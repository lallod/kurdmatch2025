
import React from 'react';
import { ListChecks } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FooterContent } from './types';
import { useTranslations } from '@/hooks/useTranslations';

interface FooterEditorProps {
  footer: FooterContent;
  updateFooter: (field: keyof FooterContent, value: string) => void;
}

const FooterEditor: React.FC<FooterEditorProps> = ({ footer, updateFooter }) => {
  const { t } = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          {t('admin.footer_content', 'Footer Content')}
        </CardTitle>
        <CardDescription>
          {t('admin.footer_content_desc', 'Edit the content displayed in the website footer')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="footer-copyright">{t('admin.copyright_text', 'Copyright Text')}</Label>
          <Input 
            id="footer-copyright" 
            value={footer.copyright} 
            onChange={(e) => updateFooter('copyright', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FooterEditor;
