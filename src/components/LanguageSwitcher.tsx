import React from 'react';
import { Globe2 } from 'lucide-react';
import { useLanguage, LanguageCode } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LanguageSwitcher = () => {
  const { language, setLanguage, languageName } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as LanguageCode)}>
      <SelectTrigger className="w-[180px]">
        <Globe2 className="w-4 h-4 mr-2" />
        <SelectValue>{languageName}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="english">English</SelectItem>
        <SelectItem value="kurdish_sorani">کوردی (سۆرانی)</SelectItem>
        <SelectItem value="kurdish_kurmanci">Kurdî (Kurmancî)</SelectItem>
        <SelectItem value="norwegian">Norsk</SelectItem>
        <SelectItem value="german">Deutsch</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
