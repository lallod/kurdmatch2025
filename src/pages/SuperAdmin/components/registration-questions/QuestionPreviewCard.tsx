
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor } from 'lucide-react';
import { QuestionItem } from './types';
import { useTranslations } from '@/hooks/useTranslations';

interface QuestionPreviewCardProps {
  question: QuestionItem | null;
}

const QuestionPreviewCard: React.FC<QuestionPreviewCardProps> = ({ question }) => {
  const { t } = useTranslations();

  const renderQuestionField = (question: QuestionItem | null) => {
    if (!question) {
      return <p className="text-muted-foreground">{t('admin.select_question_preview', 'Select a question to preview')}</p>;
    }

    switch (question.fieldType) {
      case 'text':
        return (<div className="space-y-2"><Label htmlFor="preview-text">{question.text}</Label><Input id="preview-text" placeholder={question.placeholder} /></div>);
      case 'textarea':
        return (<div className="space-y-2"><Label htmlFor="preview-textarea">{question.text}</Label><Textarea id="preview-textarea" placeholder={question.placeholder} /></div>);
      case 'select':
        return (<div className="space-y-2"><Label htmlFor="preview-select">{question.text}</Label><Select><SelectTrigger id="preview-select"><SelectValue placeholder={question.placeholder || "Select an option"} /></SelectTrigger><SelectContent>{question.fieldOptions.map((option, index) => (<SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, '-')}>{option}</SelectItem>))}</SelectContent></Select></div>);
      case 'multi-select':
        return (<div className="space-y-3"><Label>{question.text}</Label><div className="grid grid-cols-2 gap-2">{question.fieldOptions.slice(0, 4).map((option, index) => (<div key={index} className="flex items-center space-x-2"><Checkbox id={`preview-option-${index}`} /><Label htmlFor={`preview-option-${index}`} className="text-sm">{option}</Label></div>))}</div></div>);
      case 'radio':
        return (<div className="space-y-3"><Label>{question.text}</Label><RadioGroup defaultValue={question.fieldOptions[0]?.toLowerCase().replace(/\s+/g, '-')}>{question.fieldOptions.map((option, index) => (<div key={index} className="flex items-center space-x-2"><RadioGroupItem value={option.toLowerCase().replace(/\s+/g, '-')} id={`preview-radio-${index}`} /><Label htmlFor={`preview-radio-${index}`} className="text-sm">{option}</Label></div>))}</RadioGroup></div>);
      case 'checkbox':
        return (<div className="space-y-3"><Label>{question.text}</Label><div className="flex items-center space-x-2"><Checkbox id="preview-checkbox" /><Label htmlFor="preview-checkbox" className="text-sm">{t('admin.yes', 'Yes')}</Label></div></div>);
      case 'date':
        return (<div className="space-y-2"><Label htmlFor="preview-date">{question.text}</Label><Input id="preview-date" type="date" /></div>);
      default:
        return (<div className="space-y-2"><Label>{question.text}</Label><p className="text-muted-foreground">{t('admin.unsupported_field_type', 'Unsupported field type')}</p></div>);
    }
  };

  return (
    <Card className="bg-[#141414] border-white/5">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-white">
          <span>{t('admin.preview', 'Preview')}</span>
          <Tabs defaultValue="mobile" className="w-[180px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mobile"><Smartphone className="w-4 h-4 mr-2" />{t('admin.mobile', 'Mobile')}</TabsTrigger>
              <TabsTrigger value="desktop"><Monitor className="w-4 h-4 mr-2" />{t('admin.desktop', 'Desktop')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 border border-white/5 p-4 rounded-lg bg-black/20">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">{t('admin.registration_preview', 'Registration Preview')}</h3>
            <p className="text-sm text-white/60">
              {question ? 
                `Question from the "${question.category}" category for the "${question.registrationStep}" step` : 
                t('admin.select_question_preview_desc', 'Select a question to preview how it will appear to users')}
            </p>
          </div>
          <div className="space-y-4">{renderQuestionField(question)}</div>
          <div className="flex justify-end pt-2">
            <Button>{t('admin.continue', 'Continue')}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionPreviewCard;
