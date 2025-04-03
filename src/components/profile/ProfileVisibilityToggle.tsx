
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface ProfileVisibilityToggleProps {
  isPublic: boolean;
  onChange?: (isPublic: boolean) => void;
}

const ProfileVisibilityToggle: React.FC<ProfileVisibilityToggleProps> = ({ 
  isPublic = false, 
  onChange 
}) => {
  const [isVisible, setIsVisible] = useState(isPublic);
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateProfile } = useAuth();

  const handleToggleVisibility = async (checked: boolean) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update the profile visibility in the database
      const { error } = await supabase
        .from('profiles')
        .update({ is_public: checked }) // This matches the column name in the database
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setIsVisible(checked);
      
      // Update user context
      updateProfile({ isPublic: checked }); // But we use isPublic in our app code
      
      // Call onChange if provided
      if (onChange) {
        onChange(checked);
      }
      
      // Show success message
      toast.success(
        checked 
          ? "Your profile is now public and visible to customers" 
          : "Your profile is now private"
      );
    } catch (error: any) {
      toast.error("Failed to update profile visibility", {
        description: error.message
      });
      // Revert UI state on error
      setIsVisible(isPublic);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show for weavers
  if (user?.role !== 'weaver') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Profile Visibility
        </CardTitle>
        <CardDescription>
          Control whether your profile is visible on the public weavers page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch 
            id="profile-visibility" 
            checked={isVisible}
            onCheckedChange={handleToggleVisibility}
            disabled={isLoading}
          />
          <Label htmlFor="profile-visibility">
            {isVisible ? "Public profile" : "Private profile"}
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {isVisible 
            ? "Your profile is visible to all customers on the marketplace." 
            : "Your profile is hidden from the weavers page."}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileVisibilityToggle;
