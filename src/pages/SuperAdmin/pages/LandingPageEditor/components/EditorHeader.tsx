
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface EditorHeaderProps {
  saving: boolean;
  onSave: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ saving, onSave }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Landing Page Editor</h1>
        <p className="text-muted-foreground">
          Edit the content displayed on the public landing page
        </p>
      </div>
      <Button 
        onClick={onSave} 
        disabled={saving}
        className="bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90"
      >
        <Save className="mr-2 h-4 w-4" />
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default EditorHeader;
