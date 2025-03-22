
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Image, Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

interface PhotoUploadStepProps {
  form: UseFormReturn<any>;
}

const PhotoUploadStep = ({ form }: PhotoUploadStepProps) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Initialize photos from form values when component mounts
  useEffect(() => {
    const formPhotos = form.getValues('photos');
    if (Array.isArray(formPhotos) && formPhotos.length > 0) {
      setPhotos(formPhotos);
    }
  }, [form]);

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
      return; // Limit to 5 photos
    }
    
    const newPhotos = [...photos];
    
    // Convert each file to a data URL
    Array.from(files).slice(0, 5 - photos.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPhotos.push(e.target.result as string);
          setPhotos([...newPhotos]);
          
          // Store photo data in the form
          form.setValue('photos', newPhotos);
          form.clearErrors('photos');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
    
    // Update form value
    form.setValue('photos', newPhotos);
  };

  return (
    <FormField
      control={form.control}
      name="photos"
      render={({ field, fieldState }) => (
        <FormItem className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Add Your Photos</h3>
            <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700/30 text-[10px] px-1.5 py-0">
              <Camera size={10} className="mr-0.5" />
              Required
            </Badge>
          </div>
          
          <FormControl>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Upload a clear photo of yourself to complete your profile. This will be your main profile picture.
              </p>
              
              {/* Photo gallery */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-800">
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
                          className="rounded-full w-8 h-8"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload area */}
              <div 
                className={`border-2 border-dashed rounded-lg p-6 transition-all
                  ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-900/30'} 
                  ${photos.length >= 5 ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
                  ${fieldState.error ? 'border-red-500' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                <div className="flex flex-col items-center justify-center space-y-3 text-center">
                  <div className={`p-3 rounded-full ${fieldState.error ? 'bg-red-500/20' : 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20'}`}>
                    <Image size={24} className={fieldState.error ? 'text-red-400' : 'text-purple-400'} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {photos.length === 0 
                        ? 'Upload your photo' 
                        : `Add ${5 - photos.length} more photo${5 - photos.length !== 1 ? 's' : ''}`}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG or GIF (Max. 5MB)
                    </p>
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
              
              {/* Photo tips */}
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Photo tips:</h4>
                <ul className="text-xs text-gray-500 space-y-1 list-disc pl-5">
                  <li>Your first photo should clearly show your face</li>
                  <li>Add up to 5 photos to showcase your personality</li>
                  <li>Avoid group photos in your main picture</li>
                  <li>Good lighting makes a big difference</li>
                </ul>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhotoUploadStep;
