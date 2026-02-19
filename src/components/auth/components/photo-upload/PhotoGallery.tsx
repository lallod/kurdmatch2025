
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoGalleryProps {
  photos: string[];
  onRemovePhoto: (index: number) => void;
}

const PhotoGallery = ({ photos, onRemovePhoto }: PhotoGalleryProps) => {
  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4">
      {photos.map((photo, index) => (
        <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-pink-500/30 backdrop-blur shadow-lg">
          <img 
            src={photo} 
            alt={`Photo ${index + 1}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              size="icon" 
              variant="destructive" 
              onClick={() => onRemovePhoto(index)}
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
  );
};

export default PhotoGallery;
