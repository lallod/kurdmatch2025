import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslations } from '@/hooks/useTranslations';

interface CreateStoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStoryCreated: () => void;
  userId: string;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  open,
  onOpenChange,
  onStoryCreated,
  userId,
}) => {
  const { toast } = useToast();
  const { t } = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        title: t('common.error', 'Error'),
        description: t('stories.file_too_large', 'Please select a file smaller than 10MB'),
        variant: 'destructive',
      });
      return;
    }

    // Determine media type
    const type = selectedFile.type.startsWith('video/') ? 'video' : 'image';
    setMediaType(type);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview('');
    if (preview) URL.revokeObjectURL(preview);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('story-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('story-media')
        .getPublicUrl(fileName);

      // Create story record
      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          user_id: userId,
          media_url: publicUrl,
          media_type: mediaType,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });

      if (insertError) throw insertError;

      toast({
        title: t('stories.created', 'Story created!'),
        description: t('stories.story_live', 'Your story is now live for 24 hours'),
      });

      onStoryCreated();
      onOpenChange(false);
      handleRemoveFile();
    } catch (error) {
      console.error('Error uploading story:', error);
      toast({
        title: t('common.error', 'Error'),
        description: t('stories.upload_failed', 'Failed to create story. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('stories.create_story', 'Create Story')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">{t('stories.click_upload', 'Click to upload')}</span> {t('stories.drag_drop', 'or drag and drop')}
                </p>
                <p className="text-xs text-muted-foreground">{t('stories.max_size', 'Image or Video (Max 10MB)')}</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-black">
              {mediaType === 'image' ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <video src={preview} className="w-full h-full object-contain" controls />
              )}
              <button
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              className="flex-1"
              disabled={!file || uploading}
            >
              {uploading ? t('stories.uploading', 'Uploading...') : t('stories.post_story', 'Post Story')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoryModal;
