import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';
import { DynamicRegistrationFormValues } from '@/components/auth/utils/dynamicRegistrationSchema';

interface PhotoUploadComponentProps {
  form: UseFormReturn<DynamicRegistrationFormValues>;
}

const PhotoUploadComponent: React.FC<PhotoUploadComponentProps> = ({ form }) => {
  const [photos, setPhotos] = React.useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPhotos(prev => {
          const newPhotos = [...prev, dataUrl];
          form.setValue('photos', newPhotos);
          return newPhotos;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== index);
      form.setValue('photos', newPhotos);
      return newPhotos;
    });
  };

  return (
    <FormField
      control={form.control}
      name="photos"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Photos (Add at least 1)</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={photo} 
                      alt={`Photo ${index + 1}`} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {photos.length < 6 && (
                  <label className="cursor-pointer">
                    <div className="h-32 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center hover:border-white/50 transition-colors">
                      <ImagePlus className="w-8 h-8 text-white/60 mb-2" />
                      <span className="text-white/60 text-sm">Add Photo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                  </label>
                )}
              </div>
              
              {photos.length === 0 && (
                <div className="text-center py-8">
                  <ImagePlus className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60 mb-4">Add your best photos to get more matches</p>
                  <label className="cursor-pointer">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      Choose Photos
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                  </label>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PhotoUploadComponent;