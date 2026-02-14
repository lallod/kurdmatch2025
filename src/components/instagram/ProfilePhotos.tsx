import React, { useState } from 'react';
import { Profile } from '@/api/profiles';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, Star } from 'lucide-react';

interface ProfilePhotosProps {
  profile: Profile;
}

const ProfilePhotos: React.FC<ProfilePhotosProps> = ({ profile }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const allPhotos = [
    ...(profile.profile_image ? [{ url: profile.profile_image, is_primary: true }] : []),
    ...(profile.photos || [])
  ].filter((photo, index, self) =>
    index === self.findIndex(p => p.url === photo.url)
  );

  if (allPhotos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
          <svg className="w-7 h-7 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-foreground mb-1">No photos yet</h3>
        <p className="text-muted-foreground text-xs">Photos will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 rounded-2xl overflow-hidden">
        {allPhotos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setSelectedPhoto(photo.url)}
            className="relative aspect-square overflow-hidden bg-muted group active:opacity-80 transition-opacity"
          >
            <img
              src={photo.url}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {photo.is_primary && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-primary-foreground fill-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-md bg-black border-none p-0 rounded-3xl overflow-hidden">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-3 right-3 z-50 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Full size"
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePhotos;
