import { useRef } from 'react';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader = ({ onImageSelect }: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className="flex-shrink-0"
      >
        <Image className="h-5 w-5" />
      </Button>
    </>
  );
};

interface ImagePreviewProps {
  imageUrl: string;
  onRemove: () => void;
}

export const ImagePreview = ({ imageUrl, onRemove }: ImagePreviewProps) => {
  return (
    <div className="relative inline-block">
      <img
        src={imageUrl}
        alt="Upload preview"
        className="max-h-32 rounded-lg border-2 border-primary"
      />
      <Button
        variant="destructive"
        size="icon"
        onClick={onRemove}
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};
