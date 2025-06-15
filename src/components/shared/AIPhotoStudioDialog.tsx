
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Crop, Eraser, Palette, Droplet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIPhotoStudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photoUrl: string | null;
  onSave: (newPhotoUrl: string) => void;
}

const AIToolButton = ({ icon: Icon, label, onClick, isPremium = false }: { icon: React.ElementType, label: string, onClick: () => void, isPremium?: boolean }) => (
  <div className="flex flex-col items-center gap-2">
    <Button variant="outline" size="icon" className="w-16 h-16 rounded-full" onClick={onClick}>
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
                <img src={photoUrl} alt="Photo to edit" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold">AI Editing Tools</h3>
                <div className="grid grid-cols-3 gap-4">
                    <AIToolButton icon={Sparkles} label="Auto-Enhance" onClick={() => handleToolClick('Auto-Enhance')} />
                    <AIToolButton icon={Droplet} label="Background Blur" onClick={() => handleToolClick('Background Blur')} />
                    <AIToolButton icon={Crop} label="Smart Crop" onClick={() => handleToolClick('Smart Crop')} />
                    <AIToolButton icon={Palette} label="Style Filters" onClick={() => handleToolClick('Style Filters')} />
                    <AIToolButton icon={Eraser} label="Magic Eraser" onClick={() => handleToolClick('Magic Eraser')} isPremium />
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => { if (photoUrl) onSave(photoUrl); }}>Save Photo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIPhotoStudioDialog;
