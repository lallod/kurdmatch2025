
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface EditorHeaderProps {
  saving: boolean;
  onSave: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({ saving, onSave }) => {
  const { t } = useTranslations();
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">{t('admin.landing_page_editor', 'Landing Page Editor')}</h1>
        <p className="text-muted-foreground">
          {t('admin.landing_page_editor_desc', 'Edit the content displayed on the public landing page')}
        </p>
      </div>
      <Button 
        onClick={onSave} 
        disabled={saving}
        className="bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90"
      >
        <Save className="mr-2 h-4 w-4" />
        {saving ? t('admin.saving', 'Saving...') : t('admin.save_changes', 'Save Changes')}
      </Button>
    </div>
  );
};

export default EditorHeader;
