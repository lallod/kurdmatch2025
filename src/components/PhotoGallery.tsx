
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Heart, X, Star, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AspectRatio } from './ui/aspect-ratio';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi
} from './ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from './ui/dialog';

interface PhotoGalleryProps {
  photos: string[];
  name: string;
  age: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, name, age }) => {
  const [isLoaded, setIsLoaded] = useState<boolean[]>(Array(photos.length).fill(false));
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const isMobile = useIsMobile();
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
  const handleImageLoad = (index: number) => {
    const newLoadedState = [...isLoaded];
    newLoadedState[index] = true;
    setIsLoaded(newLoadedState);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    
    if (diff > 70) {
      setSwipeDirection('right');
    } else if (diff < -70) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (swipeDirection === 'right') {
      api?.scrollPrev();
    } else if (swipeDirection === 'left') {
      api?.scrollNext();
    }
    setSwipeDirection(null);
  };

  useEffect(() => {
    if (!api) return;
    
    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap() || 0);
    };

    api.on("select", handleSelect);
    
    setCurrentIndex(api.selectedScrollSnap() || 0);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handlePhotoClick = (photoIndex: number) => {
    setSelectedPhotoIndex(photoIndex);
    setPhotoDialogOpen(true);
  };

  const navigatePhoto = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setSelectedPhotoIndex((prev) => 
        prev === photos.length - 1 ? 0 : prev + 1
      );
    } else {
      setSelectedPhotoIndex((prev) => 
        prev === 0 ? photos.length - 1 : prev - 1
      );
    }
  };

  const renderPhotoInfo = (index: number) => (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white">{name}, {age}</h3>
          <p className="text-white/80 text-sm">Photo {index + 1} of {photos.length}</p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white">
          <Info size={18} />
        </button>
      </div>
    </div>
  );

  const renderProgressBar = (currentIndex: number) => (
    <div className="absolute top-2 left-2 right-2 flex gap-1 z-10">
      {photos.map((_, index) => (
        <div 
          key={index} 
          className={cn(
            "h-1 rounded-full flex-1 transition-all duration-300",
            currentIndex === index ? "bg-white" : "bg-white/30"
          )}
        />
      ))}
    </div>
  );

  const renderControls = () => (
    <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center gap-4 z-20">
      <button 
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg transform transition-all duration-300 hover:scale-110"
        onClick={() => api?.scrollPrev()}
      >
        <ChevronLeft size={24} className="text-red-500" />
      </button>
      
      <button 
        className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-tinder-rose to-tinder-orange shadow-lg transform transition-all duration-300 hover:scale-110"
        onClick={() => api?.scrollNext()}
      >
        <Heart size={28} className="text-white" />
      </button>
      
      <button 
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg transform transition-all duration-300 hover:scale-110"
        onClick={() => api?.scrollNext()}
      >
        <ChevronRight size={24} className="text-green-500" />
      </button>
    </div>
  );

  const getPhotoGridLayout = () => {
    const displayPhotos = [...photos];
    while (displayPhotos.length < 4) {
      displayPhotos.push("https://images.unsplash.com/photo-1518770660439-4636190af475");
    }
    
    const currentSet = Math.floor(currentIndex / 4);
    const startIdx = currentSet * 4;
    const photosToShow = displayPhotos.slice(startIdx, startIdx + 4);
    
    return (
      <div className="relative w-full h-full">
        <div className="grid grid-cols-2 gap-2 p-2 h-full">
          {photosToShow.map((photo, idx) => {
            const photoIndex = startIdx + idx;
            return (
              <div 
                key={photoIndex} 
                className="relative rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handlePhotoClick(photoIndex)}
              >
                <AspectRatio ratio={9/16} className="w-full">
                  <img
                    src={photo}
                    alt={`Photo ${photoIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    onLoad={() => handleImageLoad(photoIndex)}
                  />
                  {idx === 0 && currentSet === 0 && (
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      Main Photo
                    </div>
                  )}
                </AspectRatio>
              </div>
            );
          })}
        </div>
        
        {photos.length > 4 && (
          <>
            <button 
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 flex items-center justify-center z-20 shadow-lg transition-opacity",
                currentSet === 0 ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:bg-white"
              )}
              onClick={() => {
                if (currentSet > 0) {
                  api?.scrollTo((currentSet - 1) * 4);
                }
              }}
              disabled={currentSet === 0}
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 flex items-center justify-center z-20 shadow-lg transition-opacity",
                (currentSet + 1) * 4 >= displayPhotos.length ? "opacity-50 cursor-not-allowed" : "opacity-100 hover:bg-white"
              )}
              onClick={() => {
                if ((currentSet + 1) * 4 < displayPhotos.length) {
                  api?.scrollTo((currentSet + 1) * 4);
                }
              }}
              disabled={(currentSet + 1) * 4 >= displayPhotos.length}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        {photos.length > 4 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full z-20">
            Set {currentSet + 1} of {Math.ceil(displayPhotos.length / 4)}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="w-full bg-gradient-to-br from-tinder-rose/10 to-tinder-orange/10 rounded-xl overflow-hidden max-w-4xl mx-auto">
      <div className="block w-full h-full border border-tinder-rose/20 rounded-xl overflow-hidden">
        {getPhotoGridLayout()}
      </div>
      
      <div 
        className="hidden"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Carousel 
          className="w-full h-full" 
          opts={{ loop: true, dragFree: true }}
          setApi={setApi}
        >
          <CarouselContent className="h-full">
            {photos.map((photo, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative h-full w-full">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden" />
          <CarouselNext className="hidden" />
        </Carousel>
      </div>
      
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 m-0 border-none bg-black">
          <DialogTitle className="sr-only">Photo Gallery</DialogTitle>
          <DialogClose className="absolute right-4 top-4 z-50 bg-black/50 p-2 rounded-full text-white hover:bg-black/70">
            <X size={20} />
          </DialogClose>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <button 
              className="absolute left-4 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-20"
              onClick={() => navigatePhoto('prev')}
            >
              <ChevronLeft size={30} />
            </button>
            
            <button 
              className="absolute right-4 p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors z-20"
              onClick={() => navigatePhoto('next')}
            >
              <ChevronRight size={30} />
            </button>
            
            <div className="w-full h-full flex items-center justify-center">
              <div className="h-full max-h-screen flex items-center justify-center">
                <AspectRatio ratio={9/16} className="h-full max-h-[80vh] w-auto">
                  <img 
                    src={photos[selectedPhotoIndex]} 
                    alt={`Full size photo ${selectedPhotoIndex + 1}`}
                    className="w-full h-full object-cover" 
                  />
                </AspectRatio>
              </div>
            </div>
            
            <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 z-20">
              {photos.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${selectedPhotoIndex === index ? 'bg-white' : 'bg-white/50'}`}
                  onClick={() => setSelectedPhotoIndex(index)}
                />
              ))}
            </div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedPhotoIndex + 1} / {photos.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-500">
          
        </p>
      </div>
    </section>
  );
};

export default PhotoGallery;
