import React from 'react';
import GalleryCategory from './GalleryCategory';

interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  images: string[];
}

interface PhotoGallerySectionProps {
  title: string;
  subtitle: string;
  categories: GalleryCategory[];
  isRtl?: boolean;
}

const PhotoGallerySection: React.FC<PhotoGallerySectionProps> = ({ 
  title, 
  subtitle, 
  categories, 
  isRtl = false 
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-purple-950/20 to-indigo-950/30" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 space-y-4 ${isRtl ? 'font-kurdistan' : ''}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            {title}
          </h2>
          <p className="text-xl text-gray-300">
            {subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {categories.map((category) => (
            <GalleryCategory 
              key={category.id} 
              category={category} 
              isRtl={isRtl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoGallerySection;
