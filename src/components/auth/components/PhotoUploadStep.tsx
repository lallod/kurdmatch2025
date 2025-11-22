
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Camera, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import AIPhotoStudioDialog from '@/components/shared/AIPhotoStudioDialog';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';
import PhotoGallery from './photo-upload/PhotoGallery';
import PhotoUploadArea from './photo-upload/PhotoUploadArea';
import PhotoTips from './photo-upload/PhotoTips';
import { usePhotoUpload } from './photo-upload/usePhotoUpload';

interface PhotoUploadStepProps {
  form: UseFormReturn<any>;
  question: QuestionItem;
}

const PhotoUploadStep = ({ form, question }: PhotoUploadStepProps) => {
  const photoFieldId = question.id;
  
  const {
    photos,
    dragActive,
    photoToEdit,
    isStudioOpen,
    handleDrag,
    handleDrop,
    handleFileChange,
    handleSavePhoto,
    handleCloseStudio,
    removePhoto,
    setIsStudioOpen
  } = usePhotoUpload({ form, photoFieldId });

  return (
    <FormField
      control={form.control}
      name={photoFieldId}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center gap-2">
            <h3 className="text-base sm:text-lg font-medium text-white">Add Your Photos</h3>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              <Badge variant="outline" className="bg-pink-900/30 text-pink-300 border-pink-500/30 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0">
                <Camera className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" />
                <span className="hidden xs:inline">Required</span>
              </Badge>
              <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-500/30 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0">
                <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5" />
                <span className="hidden xs:inline">AI Free</span>
              </Badge>
            </div>
          </div>
          
          <FormControl>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-purple-200">
                Upload clear photos of yourself. Our AI photo editor with background removal, filters, and enhancements is completely free for all users!
              </p>
              
              <PhotoGallery photos={photos} onRemovePhoto={removePhoto} />
              
              <PhotoUploadArea
                photos={photos}
                dragActive={dragActive}
                hasError={!!fieldState.error}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onFileChange={handleFileChange}
              />

              <PhotoTips />
            </div>
          </FormControl>
          <FormMessage />
          <AIPhotoStudioDialog
            open={isStudioOpen}
            onOpenChange={(open) => {
              if (!open) {
                handleCloseStudio();
              } else {
                setIsStudioOpen(true);
              }
            }}
            photoUrl={photoToEdit}
            onSave={handleSavePhoto}
          />
        </FormItem>
      )}
    />
  );
};

export default PhotoUploadStep;
