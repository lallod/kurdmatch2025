
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface PhotoGalleryProps {
  photos: string[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(Array(photos.length).fill(false));

  const handleImageLoad = (index: number) => {
    const newLoadedState = [...isLoaded];
    newLoadedState[index] = true;
    setIsLoaded(newLoadedState);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16">
      <div className="mb-12">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Gallery</span>
        <h2 className="text-3xl font-light mt-1">Photos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[400px] md:h-[500px] bg-secondary rounded-2xl overflow-hidden shadow-lg transition-all-slow hover:shadow-xl hover:scale-[1.01]">
          <img
            src={photos[selectedPhoto]}
            alt={`Selected photo ${selectedPhoto + 1}`}
            className={cn("w-full h-full object-cover transition-all duration-500", 
              isLoaded[selectedPhoto] ? "opacity-100" : "opacity-0")}
            onLoad={() => handleImageLoad(selectedPhoto)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={cn(
                "aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all-slow hover:shadow-lg hover:scale-[1.03]",
                selectedPhoto === index ? "ring-4 ring-primary ring-offset-2" : ""
              )}
              onClick={() => setSelectedPhoto(index)}
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  isLoaded[index] ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => handleImageLoad(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
