import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Image, Upload, X, Camera, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AIPhotoStudioDialog from '@/components/shared/AIPhotoStudioDialog';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

interface PhotoUploadStepProps {
  form: UseFormReturn<any>;
  question: QuestionItem;
}

const PhotoUploadStep = ({ form, question }: PhotoUploadStepProps) => {
  const photoFieldId = question.id;
  const [photos, setPhotos] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState<string | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<string[]>([]);

  useEffect(() => {
    const formPhotos = form.getValues(photoFieldId) || [];
    console.log('PhotoUploadStep: Initial photos from form:', formPhotos);
    
    if (Array.isArray(formPhotos) && formPhotos.length > 0) {
      setPhotos(formPhotos);
    }
  }, [form, photoFieldId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (photos.length >= 5) {
      return;
    }

    const filesToProcess = Array.from(files).slice(0, 5 - photos.length);
    const dataUrls: string[] = [];
    let processedCount = 0;

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          dataUrls.push(e.target.result as string);
        }
        processedCount++;
        if (processedCount === filesToProcess.length) {
          if (dataUrls.length > 0) {
            setPhotoToEdit(dataUrls[0]);
            setPendingPhotos(dataUrls.slice(1));
            setIsStudioOpen(true);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSavePhoto = (editedPhotoUrl: string) => {
    const newPhotos = [...photos, editedPhotoUrl];
    setPhotos(newPhotos);
    
    form.setValue(photoFieldId, newPhotos, { shouldValidate: true });
    form.clearErrors(photoFieldId);
    
    console.log('PhotoUploadStep: Saved photo, new photos array:', newPhotos);

    if (pendingPhotos.length > 0) {
      setPhotoToEdit(pendingPhotos[0]);
      setPendingPhotos(pendingPhotos.slice(1));
      setIsStudioOpen(true);
    } else {
      setPhotoToEdit(null);
      setIsStudioOpen(false);
    }
  };

  const handleCloseStudio = () => {
    setPhotoToEdit(null);
    setPendingPhotos([]);
    setIsStudioOpen(false);
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    
    form.setValue(photoFieldId, newPhotos, { shouldValidate: true });
    
    console.log('PhotoUploadStep: Removed photo, new photos array:', newPhotos);
  };

  return (
    <FormField
      control={form.control}
      name={photoFieldId}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">Add Your Photos</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-pink-900/30 text-pink-300 border-pink-500/30 text-[10px] px-1.5 py-0">
                <Camera size={10} className="mr-0.5" />
                Required
              </Badge>
              <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-500/30 text-[10px] px-1.5 py-0">
                <Sparkles size={10} className="mr-0.5" />
                AI Editing Free
              </Badge>
            </div>
          </div>
          
          <FormControl>
            <div className="space-y-2">
              <p className="text-sm text-purple-200">
                Upload clear photos of yourself. Our AI photo editor with background removal, filters, and enhancements is completely free for all users!
              </p>
              
              {/* Photo gallery */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-pink-500/30 backdrop-blur shadow-lg">
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          onClick={() => removePhoto(index)}
                          className="rounded-full w-8 h-8 bg-red-500/80 hover:bg-red-500"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload area */}
              <div 
                className={`border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
                  ${dragActive ? 'border-pink-400 bg-pink-500/10' : 'border-purple-300/40 bg-white/5'} 
                  ${photos.length >= 5 ? 'opacity-50 pointer-events-none' : ''}
                  ${fieldState.error ? 'border-red-400' : ''}
                  hover:border-pink-400 hover:bg-pink-500/5
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                  <div className={`p-3 rounded-full ${fieldState.error ? 'bg-red-500/20' : 'bg-gradient-to-br from-pink-500/20 to-purple-500/20'}`}>
                    <Image size={24} className={fieldState.error ? 'text-red-400' : 'text-pink-400'} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">
                      {photos.length === 0 
                        ? 'Upload your photo' 
                        : `Add ${5 - photos.length} more photo${5 - photos.length !== 1 ? 's' : ''}`}
                    </h4>
                    <p className="text-xs text-purple-300">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-xs text-purple-300">
                      JPG, PNG or GIF (Max. 5MB)
                    </p>
                    <div className="flex items-center justify-center gap-1 text-xs text-pink-300">
                      <Sparkles size={12} />
                      <span>Free AI editing included</span>
                    </div>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple={photos.length < 4}
                  />
                </div>
              </div>

              <Alert variant="default" className="mt-4 bg-blue-500/10 border-blue-400/30 backdrop-blur">
                <ShieldCheck className="h-4 w-4 !text-blue-400" />
                <AlertTitle className="font-semibold text-blue-300">Your safety is our priority</AlertTitle>
                <AlertDescription className="text-blue-200">
                  Never share photos that reveal personal information like your home address or workplace. Be mindful of what's in the background of your photos.
                </AlertDescription>
              </Alert>
              
              {/* Photo tips */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 text-white">Photo tips:</h4>
                <ul className="text-xs text-purple-300 space-y-1 list-disc pl-5">
                  <li>Your first photo should clearly show your face</li>
                  <li>Add up to 5 photos to showcase your personality</li>
                  <li>Use our free AI editor to enhance your photos</li>
                  <li>Background removal and filters are completely free</li>
                  <li>Good lighting makes a big difference</li>
                </ul>
              </div>
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
