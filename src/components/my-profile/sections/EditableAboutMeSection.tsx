import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Sparkles, Save, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import AIBioGeneratorDialog from '../AIBioGeneratorDialog';
import { toast } from 'sonner';
import { ProfileData } from '@/types/profile';
import { useTranslations } from '@/hooks/useTranslations';

interface EditableAboutMeSectionProps {
  bio: string;
  onSave: (newBio: string) => void;
  profileData: ProfileData;
}

const EditableAboutMeSection: React.FC<EditableAboutMeSectionProps> = ({ bio, onSave, profileData }) => {
  const { t } = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(bio);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => { setEditedBio(bio); }, [bio]);
  useEffect(() => { setHasChanges(editedBio !== bio); }, [editedBio, bio]);

  const handleSave = () => {
    onSave(editedBio);
    setIsEditing(false);
    setHasChanges(false);
    toast.success(t('toast.profile.bio_updated', 'Bio updated successfully!'));
  };

  const handleCancel = () => {
    setEditedBio(bio);
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-foreground">About</h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8 rounded-full"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <Textarea
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
            rows={5}
            className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground rounded-xl"
            placeholder="Tell us about yourself... What makes you unique?"
            autoFocus
          />
          <div className="text-xs text-muted-foreground text-right">{editedBio.length}/1000</div>

          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl h-9 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 text-xs"
            onClick={() => setIsGeneratorOpen(true)}
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Generate AI Bio
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel} className="flex-1 rounded-xl h-9 text-xs">
              <X className="mr-1.5 h-3.5 w-3.5" />Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges} className="flex-1 rounded-xl h-9 text-xs">
              <Save className="mr-1.5 h-3.5 w-3.5" />Save
            </Button>
          </div>

          <AIBioGeneratorDialog
            open={isGeneratorOpen}
            onOpenChange={setIsGeneratorOpen}
            onGenerate={(newBio) => { setEditedBio(newBio); setIsGeneratorOpen(false); }}
            profileData={profileData}
          />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed line-clamp-4">
            {bio || "Tell others about yourself..."}
          </p>
          {!bio && (
            <div className="mt-2">
              <Button variant="outline" size="sm" className="text-xs rounded-full h-8" onClick={() => setIsEditing(true)}>
                <Pencil className="h-3 w-3 mr-1.5" />
                Add your bio
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditableAboutMeSection;
