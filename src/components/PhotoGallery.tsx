
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Heart, X, Star, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi
} from './ui/carousel';

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
    
    // Initial index
    setCurrentIndex(api.selectedScrollSnap() || 0);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

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

  // For desktop, we'll show multiple photos
  const getMultiPhotoLayout = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 h-full">
        {photos.map((photo, index) => (
          <div 
            key={index} 
            className={cn(
              "relative rounded-lg overflow-hidden aspect-square cursor-pointer hover:opacity-90 transition-opacity",
              index === 0 ? "col-span-2 row-span-2" : ""
            )}
            onClick={() => {
              api?.scrollTo(index);
            }}
          >
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                isLoaded[index] ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full bg-gradient-to-br from-tinder-rose/10 to-tinder-orange/10 rounded-xl overflow-hidden max-w-4xl mx-auto">
      {!isMobile && (
        <div className="hidden md:block w-full h-full">
          {getMultiPhotoLayout()}
        </div>
      )}
      
      <div 
        className={cn(
          "relative w-full aspect-[3/4] md:aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-tinder-rose/20",
          !isMobile && "hidden"
        )}
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
                {renderProgressBar(currentIndex)}
                <div className="relative h-full w-full overflow-hidden">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
                      isLoaded[index] ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => handleImageLoad(index)}
                  />
                  
                  {/* Overlay gradient for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>
                  
                  {renderPhotoInfo(index)}
                  
                  {swipeDirection === 'right' && index === currentIndex && (
                    <div className="absolute inset-0 flex items-center justify-center animate-fade-in z-30">
                      <div className="transform rotate-12 bg-green-500/80 text-white text-3xl md:text-4xl font-bold py-2 px-6 md:px-8 rounded-xl border-4 border-white shadow-lg">
                        LIKE
                      </div>
                    </div>
                  )}
                  
                  {swipeDirection === 'left' && index === currentIndex && (
                    <div className="absolute inset-0 flex items-center justify-center animate-fade-in z-30">
                      <div className="transform -rotate-12 bg-red-500/80 text-white text-3xl md:text-4xl font-bold py-2 px-6 md:px-8 rounded-xl border-4 border-white shadow-lg">
                        NOPE
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {!isMobile && renderControls()}
          
          <CarouselPrevious className="hidden" />
          <CarouselNext className="hidden" />
        </Carousel>
        
        {isMobile && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm z-20">
            Swipe to navigate photos
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGallery;

