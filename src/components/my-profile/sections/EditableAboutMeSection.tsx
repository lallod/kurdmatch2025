import React, { useState, useEffect } from 'react';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Pencil, Sparkles, Save, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import AIBioGeneratorDialog from '../AIBioGeneratorDialog';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';

interface EditableAboutMeSectionProps {
  bio: string;
  onSave: (newBio: string) => void;
  profileData: ProfileData;
}

const EditableAboutMeSection: React.FC<EditableAboutMeSectionProps> = ({ bio, onSave, profileData }) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editedBio, setEditedBio] = useState(bio);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => { setEditedBio(bio); }, [bio]);
  useEffect(() => { setHasChanges(editedBio !== bio); }, [editedBio, bio]);

  const handleSave = () => {
    onSave(editedBio);
    setIsSheetOpen(false);
    setHasChanges(false);
    toast.success('Bio updated successfully!');
  };

  const handleCancel = () => {
    setEditedBio(bio);
    setIsSheetOpen(false);
    setHasChanges(false);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="bg-card rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-foreground">About</h3>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full">
              <Pencil className="h-4 w-4" />
            </Button>
          </SheetTrigger>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed line-clamp-4">
          {bio || "Tell others about yourself..."}
        </p>
        {!bio && (
          <div className="mt-2">
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs rounded-full h-8">
                <Pencil className="h-3 w-3 mr-1.5" />
                Add your bio
              </Button>
            </SheetTrigger>
          </div>
        )}
      </div>

      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] bg-background">
        <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4 mt-2" />
        <SheetHeader>
          <SheetTitle className="text-foreground">Edit About Me</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Update your bio. Use the AI generator for personalized options!
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-3">
          <Textarea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            rows={8}
            className="resize-none bg-card border-border text-foreground placeholder:text-muted-foreground rounded-2xl"
            placeholder="Tell us about yourself... What makes you unique?"
          />
          <div className="text-xs text-muted-foreground text-right">{editedBio.length}/1000</div>
        </div>
        
        <div className="space-y-3 pb-4">
          <Button
            variant="outline"
            className="w-full rounded-2xl h-11 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
            onClick={() => setIsGeneratorOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate AI Bio Options
          </Button>
          
          {hasChanges && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="flex-1 rounded-2xl h-11">
                <X className="mr-2 h-4 w-4" />Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1 rounded-2xl h-11">
                <Save className="mr-2 h-4 w-4" />Save
              </Button>
            </div>
          )}
        </div>

        <AIBioGeneratorDialog
          open={isGeneratorOpen}
          onOpenChange={setIsGeneratorOpen}
          onGenerate={(newBio) => { setEditedBio(newBio); setIsGeneratorOpen(false); }}
          profileData={profileData}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EditableAboutMeSection;
