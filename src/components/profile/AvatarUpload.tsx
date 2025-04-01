
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  name: string;
  onUploadComplete?: (url: string) => void;
  className?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  name,
  onUploadComplete,
  className
}) => {
  const { uploadAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', { description: 'Please select an image file.' });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', { description: 'Please select an image smaller than 5MB.' });
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const url = await uploadAvatar(selectedFile);
      if (url && onUploadComplete) {
        onUploadComplete(url);
        toast.success('Avatar uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed', { 
        description: 'There was an error uploading your avatar.' 
      });
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };
  
  const cancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src={previewUrl || currentAvatarUrl} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      
      {selectedFile ? (
        <div className="flex gap-2">
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            size="sm"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button 
            variant="outline" 
            onClick={cancelUpload}
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={triggerFileInput}
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          Change Photo
        </Button>
      )}
    </div>
  );
};

export default AvatarUpload;
