
import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Pencil, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import AIBioGeneratorDialog from '../AIBioGeneratorDialog';
import { toast } from 'sonner';

interface EditableAboutMeSectionProps {
  bio: string;
  onSave: (newBio: string) => void;
}

const EditableAboutMeSection: React.FC<EditableAboutMeSectionProps> = ({
  bio,
  onSave,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editedBio, setEditedBio] = useState(bio);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  useEffect(() => {
    setEditedBio(bio);
  }, [bio]);

  const handleSave = () => {
    onSave(editedBio);
    setIsSheetOpen(false);
    toast.success('Bio updated successfully!');
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">About Me</h3>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </SheetTrigger>
        </div>
        <p className="text-muted-foreground whitespace-pre-line">{bio}</p>
      </div>

      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit About Me</SheetTitle>
          <SheetDescription>
            Update your bio here. Use the AI generator for some inspiration!
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4 flex-grow">
          <Textarea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            rows={15}
            className="h-full resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>
        <div className="py-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsGeneratorOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </SheetFooter>
      </SheetContent>
      <AIBioGeneratorDialog
        open={isGeneratorOpen}
        onOpenChange={setIsGeneratorOpen}
        onGenerate={(newBio) => {
          setEditedBio(newBio);
          setIsGeneratorOpen(false);
        }}
      />
    </Sheet>
  );
};

export default EditableAboutMeSection;
