
import React from 'react';
import { Image, Sparkles } from 'lucide-react';

interface PhotoUploadAreaProps {
  photos: string[];
  dragActive: boolean;
  hasError: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoUploadArea = ({
  photos,
  dragActive,
  hasError,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange
}: PhotoUploadAreaProps) => {
  const isDisabled = photos.length >= 5;

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer
        ${dragActive ? 'border-pink-400 bg-pink-500/10' : 'border-purple-300/40 bg-white/5'} 
        ${isDisabled ? 'opacity-50 pointer-events-none' : ''}
        ${hasError ? 'border-red-400' : ''}
        hover:border-pink-400 hover:bg-pink-500/5
      `}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => document.getElementById('photo-upload')?.click()}
    >
      <div className="flex flex-col items-center justify-center space-y-3 text-center">
        <div className={`p-3 rounded-full ${hasError ? 'bg-red-500/20' : 'bg-gradient-to-br from-pink-500/20 to-purple-500/20'}`}>
          <Image size={24} className={hasError ? 'text-red-400' : 'text-pink-400'} />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-white">
            {photos.length === 0 
              ? 'Upload your photo' 
              : `Add ${5 - photos.length} more photo${5 - photos.length !== 1 ? 's' : ''}`}
          </h4>
          <p className="text-xs text-purple-300">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-purple-300">
            JPG, PNG or GIF (Max. 5MB)
          </p>
          <div className="flex items-center justify-center gap-1 text-xs text-pink-300">
            <Sparkles size={12} />
            <span>Free AI editing included</span>
          </div>
        </div>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          multiple={photos.length < 4}
        />
      </div>
    </div>
  );
};

export default PhotoUploadArea;
