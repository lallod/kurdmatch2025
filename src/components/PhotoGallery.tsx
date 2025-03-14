import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Heart, X, Star, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from './ui/scroll-area';
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
  const cardRef = useRef<HTMLDivElement>(null);
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
    if (!cardRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    const rotation = diff / 20;
    
    cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
    
    if (diff > 50) {
      setSwipeDirection('right');
      cardRef.current.classList.add('swipe-right');
      cardRef.current.classList.remove('swipe-left');
    } else if (diff < -50) {
      setSwipeDirection('left');
      cardRef.current.classList.add('swipe-left');
      cardRef.current.classList.remove('swipe-right');
    } else {
      setSwipeDirection(null);
      cardRef.current.classList.remove('swipe-right', 'swipe-left');
    }
  };

  const handleTouchEnd = () => {
    if (!cardRef.current) return;
    
    if (cardRef.current.classList.contains('swipe-right')) {
      // Simulate like
      setTimeout(() => {
        resetCard();
      }, 500);
    } else if (cardRef.current.classList.contains('swipe-left')) {
      // Simulate dislike
      setTimeout(() => {
        resetCard();
      }, 500);
    } else {
      resetCard();
    }
  };

  const resetCard = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = '';
    cardRef.current.classList.remove('swipe-right', 'swipe-left');
    setSwipeDirection(null);
  };

  const handleManualSwipe = (direction: string) => {
    if (cardRef.current) {
      setSwipeDirection(direction);
      cardRef.current.style.transform = direction === 'right' ? 'translateX(150%) rotate(30deg)' : 'translateX(-150%) rotate(-30deg)';
      
      // Reset after animation
      setTimeout(() => {
        resetCard();
      }, 500);
    }
  };

  React.useEffect(() => {
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

  if (isMobile) {
    return (
      <section className="w-full min-h-screen bg-gradient-to-br from-tinder-rose to-tinder-orange px-0 py-0">
        <div 
          ref={cardRef}
          className={cn(
            "tinder-card relative w-full h-[calc(100vh-5rem)] rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 transform transition-all duration-300",
            swipeDirection === 'right' && "animate-swipe-right",
            swipeDirection === 'left' && "animate-swipe-left"
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Carousel 
            className="w-full h-full" 
            opts={{ loop: true }}
            setApi={setApi}
          >
            <CarouselContent className="h-full">
              {photos.map((photo, index) => (
                <CarouselItem key={index} className="h-full">
                  {renderProgressBar(currentIndex)}
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-300",
                      isLoaded[index] ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => handleImageLoad(index)}
                  />
                  {renderPhotoInfo(index)}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"></div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 z-10 bg-white/20 hover:bg-white/40 text-white border-none" />
            <CarouselNext className="absolute right-2 z-10 bg-white/20 hover:bg-white/40 text-white border-none" />
          </Carousel>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 swipe-overlay swipe-overlay-right">
            <div className="transform rotate-12 bg-green-500/80 text-white text-4xl font-bold py-2 px-8 rounded-xl border-4 border-white shadow-lg">
              LIKE
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 swipe-overlay swipe-overlay-left">
            <div className="transform -rotate-12 bg-red-500/80 text-white text-4xl font-bold py-2 px-8 rounded-xl border-4 border-white shadow-lg">
              NOPE
            </div>
          </div>
        </div>

        <div className="fixed bottom-4 left-0 right-0 flex items-center justify-center gap-6 z-20">
          <button 
            className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg transform transition-all duration-300 hover:scale-110"
            onClick={() => handleManualSwipe('left')}
          >
            <X size={28} className="text-red-500" />
          </button>
          
          <button 
            className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-tinder-rose to-tinder-orange shadow-lg transform transition-all duration-300 hover:scale-110"
            onClick={() => handleManualSwipe('right')}
          >
            <Heart size={32} className="text-white" />
          </button>
          
          <button 
            className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg transform transition-all duration-300 hover:scale-110"
          >
            <Star size={28} className="text-white" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12 bg-gradient-to-br from-tinder-rose/10 to-tinder-orange/10 rounded-3xl">
      <div className="mb-8">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Gallery</span>
        <h2 className="text-3xl font-light mt-1">Photos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-[400px] md:h-[500px] bg-secondary rounded-2xl overflow-hidden shadow-lg border border-tinder-rose/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
          <Carousel 
            className="w-full h-full" 
            opts={{ loop: true }}
            setApi={setApi}
          >
            <CarouselContent className="h-full">
              {photos.map((photo, index) => (
                <CarouselItem key={index} className="h-full">
                  {renderProgressBar(currentIndex)}
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-300",
                      isLoaded[index] ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => handleImageLoad(index)}
                  />
                  {renderPhotoInfo(index)}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 z-10 bg-white/20 hover:bg-white/40 text-white border-none" />
            <CarouselNext className="absolute right-2 z-10 bg-white/20 hover:bg-white/40 text-white border-none" />
          </Carousel>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={cn(
                "relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-tinder-rose/20 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.03]",
                currentIndex === index && "ring-2 ring-tinder-rose"
              )}
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
              
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent",
                "opacity-0 hover:opacity-100 transition-opacity duration-300"
              )}>
                <div className="absolute bottom-2 left-2">
                  <span className="text-white text-xs font-medium">Photo {index + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
