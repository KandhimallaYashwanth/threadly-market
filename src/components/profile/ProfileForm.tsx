
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/context/AuthContext';
import AvatarUpload from './AvatarUpload';
import { UserRole } from '@/lib/types';

// Profile form schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
    },
  });
  
  const handleAvatarUpload = async (url: string) => {
    if (user) {
      await updateProfile({ avatar_url: url });
    }
  };
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (user) {
      await updateProfile({
        name: values.name,
        bio: values.bio,
      });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <AvatarUpload
          currentAvatarUrl={user.avatar_url}
          name={user.name}
          onUploadComplete={handleAvatarUpload}
        />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {user.role === UserRole.WEAVER && (
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="w-full p-2 border border-border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" className="mt-4">
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileForm;
