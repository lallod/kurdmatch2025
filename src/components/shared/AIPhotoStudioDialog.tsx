
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wand2, Crop, Eraser, Palette, Droplet, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { removeBackground } from '@/utils/ai-photo-editor';

interface AIPhotoStudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photoUrl: string | null;
  onSave: (newPhotoUrl: string) => void;
}

const AIToolButton = ({ icon: Icon, label, onClick, isPremium = false, disabled = false }: { icon: React.ElementType, label: string, onClick: () => void, isPremium?: boolean, disabled?: boolean }) => (
  <div className="flex flex-col items-center gap-2">
    <Button variant="outline" size="icon" className="w-16 h-16 rounded-full" onClick={onClick} disabled={disabled}>
      <Icon size={24} />
    </Button>
    <div className="text-xs font-medium text-center">{label}</div>
    {isPremium && <div className="text-xs text-yellow-500">Premium</div>}
  </div>
);

const AIPhotoStudioDialog: React.FC<AIPhotoStudioDialogProps> = ({
  open,
  onOpenChange,
  photoUrl,
  onSave,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEditedPhoto(null);
    }
  }, [open]);

  const handleRemoveBackground = async () => {
    if (!photoUrl) return;

    setIsLoading(true);
    toast({ title: 'Removing background...', description: 'The AI model is being prepared. This might take a moment on first use.' });

    try {
      const image = new Image();
      image.crossOrigin = 'anonymous'; // Needed for images from other domains
      image.src = photoUrl;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = (err) => reject(new Error('Failed to load image. It might be a network issue or the image is protected.'));
      });

      const resultBlob = await removeBackground(image);
      const newPhotoUrl = URL.createObjectURL(resultBlob);
      setEditedPhoto(newPhotoUrl);
      toast({ title: 'Success!', description: 'Background removed. Save the photo to keep the changes.' });
    } catch (error) {
      console.error('Failed to remove background', error);
      const errorMessage = error instanceof Error ? error.message : 'Could not remove background. Please try again.';
      toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleToolClick = (toolName: string) => {
    toast({
      title: `${toolName} is a premium feature`,
      description: "This functionality is coming soon!",
    });
  };

  if (!photoUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>AI Photo Studio</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img src={editedPhoto || photoUrl} alt="Photo to edit" className="w-full h-full object-contain" />
                {isLoading && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-4">
                    <Loader2 className="h-10 w-10 animate-spin" />
                    <p className="text-sm font-medium">AI is working its magic...</p>
                  </div>
                )}
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold">AI Editing Tools</h3>
                <div className="grid grid-cols-3 gap-4">
                    <AIToolButton icon={Wand2} label="Remove BG" onClick={handleRemoveBackground} disabled={isLoading} />
                    <AIToolButton icon={Droplet} label="Background Blur" onClick={() => handleToolClick('Background Blur')} disabled={isLoading} />
                    <AIToolButton icon={Crop} label="Smart Crop" onClick={() => handleToolClick('Smart Crop')} disabled={isLoading} />
                    <AIToolButton icon={Palette} label="Style Filters" onClick={() => handleToolClick('Style Filters')} disabled={isLoading} />
                    <AIToolButton icon={Eraser} label="Magic Eraser" onClick={() => handleToolClick('Magic Eraser')} isPremium disabled={isLoading} />
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => { if (photoUrl) onSave(editedPhoto || photoUrl); }}>Save Photo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIPhotoStudioDialog;
