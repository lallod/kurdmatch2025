
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
  CarouselNext
} from './ui/carousel';

interface PhotoGalleryProps {
  photos: string[];
  name: string;
  age: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, name, age }) => {
  const [isLoaded, setIsLoaded] = useState<boolean[]>(Array(photos.length).fill(false));
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
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
      cardRef.current.classList.add('swipe-right');
      cardRef.current.classList.remove('swipe-left');
    } else if (diff < -50) {
      cardRef.current.classList.add('swipe-left');
      cardRef.current.classList.remove('swipe-right');
    } else {
      cardRef.current.classList.remove('swipe-right', 'swipe-left');
    }
  };

  const handleTouchEnd = () => {
    if (!cardRef.current) return;
    
    if (cardRef.current.classList.contains('swipe-right')) {
      setSwipeDirection('right');
      // Simulate like
      setTimeout(() => {
        resetCard();
      }, 500);
    } else if (cardRef.current.classList.contains('swipe-left')) {
      setSwipeDirection('left');
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

  // Common photo info overlay that appears on both mobile and desktop
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

  // Common progress indicator for both mobile and desktop
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

  // The Tinder card swipe UI for mobile
  if (isMobile) {
    return (
      <section className="w-full min-h-screen bg-gradient-to-br from-tinder-rose to-tinder-orange px-2 py-4">
        <div 
          ref={cardRef}
          className={cn(
            "tinder-card transition-all duration-300",
            swipeDirection === 'right' && "animate-swipe-right",
            swipeDirection === 'left' && "animate-swipe-left"
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {photos.map((photo, index) => (
                <CarouselItem key={index} className="h-full">
                  {renderProgressBar(index)}
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
                  <div className="tinder-gradient"></div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 z-10 bg-white/20 hover:bg-white/40 text-white border-none" />
            <CarouselNext className="absolute right-2 z-10 bg-white/20 hover:bg-white/40 text-white border-none" />
          </Carousel>
          
          <div className="swipe-overlay swipe-overlay-right">
            <div className="transform rotate-12 bg-green-500/80 text-white text-4xl font-bold py-2 px-8 rounded-xl border-4 border-white">
              LIKE
            </div>
          </div>
          
          <div className="swipe-overlay swipe-overlay-left">
            <div className="transform -rotate-12 bg-red-500/80 text-white text-4xl font-bold py-2 px-8 rounded-xl border-4 border-white">
              NOPE
            </div>
          </div>
        </div>

        <div className="swipe-actions">
          <button 
            className="action-button bg-white hover:scale-110"
            onClick={() => handleManualSwipe('left')}
          >
            <X size={28} className="text-red-500" />
          </button>
          
          <button 
            className="action-button-big bg-gradient-to-r from-tinder-rose to-tinder-orange hover:scale-110"
            onClick={() => handleManualSwipe('right')}
          >
            <Heart size={32} className="text-white" />
          </button>
          
          <button 
            className="action-button bg-gradient-to-r from-blue-400 to-blue-500 hover:scale-110"
          >
            <Star size={28} className="text-white" />
          </button>
        </div>
      </section>
    );
  }

  // Desktop version with the same swipeable gallery
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16 bg-gradient-to-br from-tinder-rose/20 to-tinder-orange/20 rounded-3xl">
      <div className="mb-12">
        <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Gallery</span>
        <h2 className="text-3xl font-light mt-1">Photos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-[400px] md:h-[500px] bg-secondary rounded-2xl overflow-hidden shadow-lg transition-all-slow hover:shadow-xl hover:scale-[1.01]">
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {photos.map((photo, index) => (
                <CarouselItem key={index} className="h-full">
                  {renderProgressBar(index)}
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
                "relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md transition-all-slow hover:shadow-lg hover:scale-[1.03]"
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
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2",
                "opacity-0 hover:opacity-100 transition-opacity duration-300"
              )}>
                <span className="text-white text-xs font-medium">Photo {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallery;
