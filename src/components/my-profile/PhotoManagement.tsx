import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Star, Camera, Shield, Sparkles, Eye, Heart, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

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
  setAsProfilePic,
}) => {
  const { t } = useTranslations();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const maxPhotos = 6;
  const photoCompletion = Math.min((galleryImages.length / maxPhotos) * 100, 100);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      // Handle reordering logic here
      console.log(`Moving photo from ${draggedIndex} to ${dropIndex}`);
    }
    setDraggedIndex(null);
  };

  const handleRemove = (index: number) => {
    removeImage(index);
    toast.success(t('toast.profile.photo_removed', 'Photo removed successfully'));
  };

  const handleSetAsProfile = (index: number) => {
    setAsProfilePic(index);
    toast.success(t('toast.profile.photo_updated', 'Profile photo updated'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Photo Gallery</h2>
              <p className="text-purple-200 text-sm">Add up to {maxPhotos} photos to showcase yourself</p>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {galleryImages.length}/{maxPhotos} photos
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-200">Photo Gallery Completion</span>
              <span className="text-sm font-medium text-white">{Math.round(photoCompletion)}%</span>
            </div>
            <Progress value={photoCompletion} className="h-2 bg-white/10">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${photoCompletion}%` }}
              />
            </Progress>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Upload Area */}
        {galleryImages.length < maxPhotos && (
          <Card className="backdrop-blur-md bg-white/10 border border-white/20 border-dashed hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-6">
              <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm text-purple-200 text-center">
                  Add Photo
                </span>
              </label>
            </CardContent>
          </Card>
        )}

        {/* Existing Photos */}
        {galleryImages.map((image, index) => (
          <Card 
            key={index}
            className="backdrop-blur-md bg-white/10 border border-white/20 relative overflow-hidden group hover:scale-105 transition-all duration-300"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <CardContent className="p-0 relative">
              <img 
                src={image} 
                alt={`Photo ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex gap-2">
                  {index !== 0 && (
                    <Button
                      size="sm"
                      onClick={() => handleSetAsProfile(index)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Profile photo badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                    <Camera className="w-3 h-3 mr-1" />
                    Profile
                  </Badge>
                </div>
              )}

              {/* Photo verification status */}
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>

              {/* Photo stats (mock data) */}
              <div className="absolute bottom-2 left-2 flex gap-1">
                <Badge className="bg-black/50 text-white text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  {Math.floor(Math.random() * 100) + 20}
                </Badge>
                <Badge className="bg-black/50 text-white text-xs">
                  <Heart className="w-3 h-3 mr-1" />
                  {Math.floor(Math.random() * 50) + 5}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Photo Tips */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
            Photo Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-200">
            <div className="space-y-2">
              <p>✨ Use natural lighting for better photos</p>
              <p>📱 Include photos that show your personality</p>
              <p>👥 Add at least one full-body photo</p>
            </div>
            <div className="space-y-2">
              <p>😊 Smile! Photos with smiles get more likes</p>
              <p>🎯 Show your hobbies and interests</p>
              <p>🚫 Avoid group photos as your main picture</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Photo Enhancement */}
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Photo Enhancement</h3>
              <p className="text-purple-200 text-sm">Enhance your photos with AI to get more matches</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Sparkles className="w-4 h-4 mr-2" />
              Enhance Photos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoManagement;
