
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
import { useTranslations } from '@/hooks/useTranslations';

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
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [editedPhoto, setEditedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (open) { setEditedPhoto(null); }
  }, [open]);

  const handleRemoveBackground = async () => {
    toast({
      title: t('ai_photo.feature_migration', 'Feature Migration in Progress'),
      description: t('ai_photo.feature_migration_desc', 'Background removal is being migrated to our new AI infrastructure. Check back soon!'),
    });
  };

  const handleToolClick = (toolName: string) => {
    toast({
      title: t('ai_photo.premium_feature', `${toolName} is a premium feature`),
      description: t('ai_photo.coming_soon', 'This functionality is coming soon!'),
    });
  };

  const handleAIEnhance = async () => {
    if (!photoUrl) return;

    setIsLoading(true);
    toast({ 
      title: t('ai_photo.enhancing', 'AI Photo Enhancement'), 
      description: t('ai_photo.enhancing_desc', 'Enhancing your photo with AI to get more matches...') 
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({ 
        title: t('ai_photo.enhanced', 'Photo Enhanced!'), 
        description: t('ai_photo.enhanced_desc', 'Your photo has been enhanced with AI for better match potential. This is a premium feature preview.') 
      });
    } catch (error) {
      toast({
        title: t('ai_photo.enhancement_failed', 'Enhancement Failed'),
        description: t('ai_photo.enhancement_failed_desc', 'AI photo enhancement is a premium feature. Upgrade to access!'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!photoUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('ai_photo.title', 'AI Photo Studio')}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img src={editedPhoto || photoUrl} alt="Photo to edit" className="w-full h-full object-contain" />
                {isLoading && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-4">
                    <Loader2 className="h-10 w-10 animate-spin" />
                    <p className="text-sm font-medium">{t('ai_photo.working', 'AI is working its magic...')}</p>
                  </div>
                )}
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="font-semibold">{t('ai_photo.editing_tools', 'AI Editing Tools')}</h3>
                <div className="grid grid-cols-3 gap-4">
                    <AIToolButton icon={Wand2} label={t('ai_photo.remove_bg', 'Remove BG')} onClick={handleRemoveBackground} disabled={isLoading} />
                    <AIToolButton icon={Droplet} label={t('ai_photo.bg_blur', 'Background Blur')} onClick={() => handleToolClick('Background Blur')} disabled={isLoading} />
                    <AIToolButton icon={Crop} label={t('ai_photo.smart_crop', 'Smart Crop')} onClick={() => handleToolClick('Smart Crop')} disabled={isLoading} />
                    <AIToolButton icon={Palette} label={t('ai_photo.style_filters', 'Style Filters')} onClick={() => handleToolClick('Style Filters')} disabled={isLoading} />
                    <AIToolButton icon={Eraser} label={t('ai_photo.magic_eraser', 'Magic Eraser')} onClick={() => handleToolClick('Magic Eraser')} isPremium disabled={isLoading} />
                    <AIToolButton icon={Wand2} label={t('ai_photo.ai_enhance', 'AI Enhance')} onClick={handleAIEnhance} isPremium disabled={isLoading} />
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button onClick={() => { if (photoUrl) onSave(editedPhoto || photoUrl); }}>{t('ai_photo.save_photo', 'Save Photo')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIPhotoStudioDialog;
