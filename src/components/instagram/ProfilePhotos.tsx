import React, { useState } from 'react';
import { Profile } from '@/api/profiles';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ProfilePhotosProps {
  profile: Profile;
}

const ProfilePhotos: React.FC<ProfilePhotosProps> = ({ profile }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Combine profile_image and photos array
  const allPhotos = [
    ...(profile.profile_image ? [{ url: profile.profile_image, is_primary: true }] : []),
    ...(profile.photos || [])
  ].filter((photo, index, self) => 
    // Remove duplicates
    index === self.findIndex(p => p.url === photo.url)
  );

  if (allPhotos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
          <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No photos yet</h3>
        <p className="text-white/60 text-sm">Photos will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {allPhotos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setSelectedPhoto(photo.url)}
            className="relative aspect-square overflow-hidden bg-black/20 group"
          >
            <img
              src={photo.url}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-110"
            />
            {photo.is_primary && (
              <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-semibold">
                Primary
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl bg-black border-none p-0">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          {selectedPhoto && (
            <img
              src={selectedPhoto}
              alt="Full size"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePhotos;
