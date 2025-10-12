import React, { useCallback } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import type { EmblaCarouselType } from 'embla-carousel';

interface GalleryCategoryProps {
  category: {
    id: string;
    name: string;
    description: string;
    images: string[];
  };
  isRtl?: boolean;
}

const GalleryCategory: React.FC<GalleryCategoryProps> = ({ category, isRtl = false }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [api, setApi] = React.useState<EmblaCarouselType>();

  const autoplayPlugin = React.useRef(
    Autoplay({ 
      delay: 3000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true 
    })
  );

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  React.useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  if (!category.images || category.images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className={`space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
        <h3 className="text-2xl font-bold text-white">{category.name}</h3>
        <p className="text-gray-400">{category.description}</p>
      </div>

      <div className="relative group">
        <Carousel
          opts={{ loop: true, direction: isRtl ? 'rtl' : 'ltr' }}
          plugins={[autoplayPlugin.current]}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {category.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                  <img
                    src={image}
                    alt={`${category.name} ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-sm font-medium">
                      {currentIndex + 1} / {category.images.length}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {category.images.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-primary' 
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryCategory;
