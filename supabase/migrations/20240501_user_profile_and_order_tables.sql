
-- Add isPublic column to profiles table to control weaver visibility
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Make sure verification is removed by setting everything to true
UPDATE public.profiles
SET is_verified = true
WHERE role = 'weaver';

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.profiles(id),
  weaver_id UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cod',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order items table for tracking items in each order
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Enable RLS on order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for customers to view their own orders
CREATE POLICY "Customers can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = customer_id);

-- Create RLS policy for weavers to view orders for their products
CREATE POLICY "Weavers can view orders for their products" 
ON public.orders FOR SELECT 
USING (auth.uid() = weaver_id);

-- Create RLS policy for customers to insert their own orders
CREATE POLICY "Customers can create their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Create RLS policy for customers to view their own order items
CREATE POLICY "Users can view their own order items" 
ON public.order_items FOR SELECT 
USING (
  order_id IN (
    SELECT id FROM public.orders 
    WHERE customer_id = auth.uid() OR weaver_id = auth.uid()
  )
);

-- Create RLS policy for customers to insert their own order items
CREATE POLICY "Customers can create their own order items" 
ON public.order_items FOR INSERT 
WITH CHECK (
  order_id IN (
    SELECT id FROM public.orders 
    WHERE customer_id = auth.uid()
  )
);

-- Add function to create avatar storage bucket if it doesn't exist
DO $$
BEGIN
  -- Check if bucket exists
  DECLARE
    bucket_exists boolean;
  BEGIN
    bucket_exists := EXISTS (
      SELECT 1 FROM storage.buckets WHERE id = 'avatars'
    );
    
    IF NOT bucket_exists THEN
      -- Create avatars bucket for user profile pictures
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('avatars', 'Avatar images', true);
      
      -- Create policy to allow users to upload their own avatars
      INSERT INTO storage.policies (name, definition, bucket_id)
      VALUES (
        'Avatar upload policy',
        jsonb_build_object(
          'name', 'Avatar upload policy',
          'owner', null,
          'resource', 'object',
          'action', 'insert',
          'condition', 'storage.foldername(name)[1] = auth.uid()::text'
        ),
        'avatars'
      );
      
      -- Create policy to allow public access to avatars
      INSERT INTO storage.policies (name, definition, bucket_id)
      VALUES (
        'Avatar public read policy',
        jsonb_build_object(
          'name', 'Avatar public read policy',
          'owner', null,
          'resource', 'object',
          'action', 'select'
        ),
        'avatars'
      );
    END IF;
  END;
END $$;

-- Add function to create product_images storage bucket if it doesn't exist
DO $$
BEGIN
  -- Check if bucket exists
  DECLARE
    bucket_exists boolean;
  BEGIN
    bucket_exists := EXISTS (
      SELECT 1 FROM storage.buckets WHERE id = 'product_images'
    );
    
    IF NOT bucket_exists THEN
      -- Create product_images bucket for product images
      INSERT INTO storage.buckets (id, name, public) 
      VALUES ('product_images', 'Product images', true);
      
      -- Create policy to allow users to upload product images
      INSERT INTO storage.policies (name, definition, bucket_id)
      VALUES (
        'Product image upload policy',
        jsonb_build_object(
          'name', 'Product image upload policy',
          'owner', null,
          'resource', 'object',
          'action', 'insert',
          'condition', '(SELECT role FROM profiles WHERE id = auth.uid()) = ''weaver'''
        ),
        'product_images'
      );
      
      -- Create policy to allow public access to product images
      INSERT INTO storage.policies (name, definition, bucket_id)
      VALUES (
        'Product image public read policy',
        jsonb_build_object(
          'name', 'Product image public read policy',
          'owner', null,
          'resource', 'object',
          'action', 'select'
        ),
        'product_images'
      );
    END IF;
  END;
END $$;
