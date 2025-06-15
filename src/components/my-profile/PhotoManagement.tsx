import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Image, Pencil, User, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AIPhotoStudioDialog from '@/components/shared/AIPhotoStudioDialog';

interface PhotoManagementProps {
  galleryImages: string[];
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  setAsProfilePic: (index: number) => void;
}

const PhotoManagement: React.FC<PhotoManagementProps> = ({
  galleryImages,
  onImageUpload,
  removeImage,
  setAsProfilePic
}) => {
  const [photoToEdit, setPhotoToEdit] = useState<{ url: string; index: number } | null>(null);

  const handleSavePhoto = (editedPhotoUrl: string) => {
    if (photoToEdit) {
      // In a real app, you would call a prop function like:
      // onImageUpdate(photoToEdit.index, editedPhotoUrl)
      console.log(`Photo at index ${photoToEdit.index} would be updated.`);
      setPhotoToEdit(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Photos</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Image size={16} />
          Edit Photo Settings
        </Button>
      </div>
      <p className="text-muted-foreground mb-6">
        Upload and manage your profile photos. The first photo will be your main profile picture.
      </p>

      <Alert variant="default" className="mb-6 bg-blue-50 border-blue-200 text-blue-800">
        <ShieldCheck className="h-4 w-4 !text-blue-600" />
        <AlertTitle className="font-semibold">Din sikkerhet er vår prioritet</AlertTitle>
        <AlertDescription className="text-blue-700">
          Aldri del bilder som avslører personlig informasjon som hjemmeadressen eller arbeidsplassen din. Vær bevisst på hva som er i bakgrunnen på bildene dine.
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Gallery ({galleryImages.length}/9)</h3>
        <div>
          <Button variant="outline" className="relative overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <Image size={16} className="mr-2" />
            <span>Add Photo</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {galleryImages.map((image, index) => (
          <div key={index} className="relative group">
            <div className={`aspect-square rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-transparent'}`}>
              <img 
                src={image} 
                alt={`Photo ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Edit button on main profile photo */}
              {index === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/80 backdrop-blur-sm border-0 hover:bg-white/90 rounded-full absolute bottom-2 right-2 opacity-80 group-hover:opacity-100 transition-opacity"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Camera size={16} />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 rounded-lg">
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => setPhotoToEdit({ url: image, index })}
                className="w-full max-w-[120px]"
              >
                <Pencil size={14} className="mr-1" />
                Edit with AI
              </Button>
              {index !== 0 && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setAsProfilePic(index)}
                  className="w-full max-w-[120px]"
                >
                  <User size={14} className="mr-1" />
                  Set as main
                </Button>
              )}
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => removeImage(index)}
                className="w-full max-w-[120px]"
                disabled={galleryImages.length <= 1}
              >
                Remove
              </Button>
            </div>
            
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Main
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-sm text-muted-foreground">
        <p>Tips for great photos:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Clear, recent photos of your face</li>
          <li>A mix of close-up and full-body photos</li>
          <li>Photos that show your interests and personality</li>
          <li>Avoid overly filtered or group photos</li>
        </ul>
      </div>
      
      <AIPhotoStudioDialog
        open={!!photoToEdit}
        onOpenChange={(open) => !open && setPhotoToEdit(null)}
        photoUrl={photoToEdit?.url ?? null}
        onSave={handleSavePhoto}
      />
    </div>
  );
};

export default PhotoManagement;
