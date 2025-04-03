
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, X, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  className?: string;
  bucketName?: string;
  folderPath?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  className,
  bucketName = 'product_images',
  folderPath = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Upload file
    setIsUploading(true);
    
    try {
      // Create a unique path for the file
      const uniquePrefix = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      const filePath = folderPath 
        ? `${folderPath}/${uniquePrefix}_${file.name}`
        : `${uniquePrefix}_${file.name}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600'
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      
      // Call the onUpload callback with the URL
      onUpload(publicUrl);
      
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image', {
        description: error.message
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearPreview = () => {
    setPreview(null);
    // Reset the file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };
  
  return (
    <div className={cn("relative", className)}>
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-md" 
          />
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={clearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-6 border-dashed cursor-pointer h-48" onClick={() => document.getElementById('image-upload')?.click()}>
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-center text-muted-foreground mb-2">
            Click to upload an image
          </p>
          <p className="text-xs text-center text-muted-foreground">
            SVG, PNG, JPG or GIF (max. 5MB)
          </p>
          {isUploading && (
            <div className="mt-2 text-sm">Uploading...</div>
          )}
        </Card>
      )}
      
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
};

export default ImageUpload;
