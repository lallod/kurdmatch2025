
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
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, Sparkles, Save, X } from 'lucide-react';
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
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedBio(bio);
  }, [bio]);

  useEffect(() => {
    setHasChanges(editedBio !== bio);
  }, [editedBio, bio]);

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
      <Card className="backdrop-blur-md bg-white/10 border border-white/20">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">About Me</h3>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-purple-200 hover:text-white hover:bg-white/10">
                <Pencil className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          </div>
          <p className="text-purple-100 whitespace-pre-line leading-relaxed">
            {bio || "Tell others about yourself..."}
          </p>
          {!bio && (
            <div className="mt-3">
              <SheetTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Pencil className="h-4 w-4 mr-2" />
                  Add your bio
                </Button>
              </SheetTrigger>
            </div>
          )}
        </CardContent>
      </Card>

      <SheetContent className="flex flex-col bg-gray-900 border-gray-700">
        <SheetHeader>
          <SheetTitle className="text-white">Edit About Me</SheetTitle>
          <SheetDescription className="text-gray-300">
            Update your bio here. Use the AI generator for some inspiration!
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 space-y-4 flex-grow">
          <Textarea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            rows={15}
            className="h-full resize-none bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
            placeholder="Tell us about yourself... What makes you unique? What are you passionate about? What are you looking for?"
          />
          <div className="text-xs text-gray-400 text-right">
            {editedBio.length}/1000 characters
          </div>
        </div>
        
        <div className="py-4 space-y-3">
          <Button
            variant="outline"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white hover:from-purple-600 hover:to-pink-600"
            onClick={() => setIsGeneratorOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
          
          {hasChanges && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="flex-1 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </div>

        <AIBioGeneratorDialog
          open={isGeneratorOpen}
          onOpenChange={setIsGeneratorOpen}
          onGenerate={(newBio) => {
            setEditedBio(newBio);
            setIsGeneratorOpen(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
};

export default EditableAboutMeSection;
