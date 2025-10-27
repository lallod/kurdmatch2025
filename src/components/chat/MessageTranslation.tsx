import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageTranslationProps {
  originalText: string;
  compact?: boolean;
}

const MessageTranslation: React.FC<MessageTranslationProps> = ({ 
  originalText,
  compact = false 
}) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'ku', name: 'Kurdish', flag: '🟡' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  ];

  const handleTranslate = async (targetLanguage: string) => {
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-message', {
        body: {
          text: originalText,
          targetLanguage: targetLanguage,
        },
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast({
            title: "Rate limit reached",
            description: "Please wait a moment before translating again.",
            variant: "destructive",
          });
        } else if (error.message?.includes('402')) {
          toast({
            title: "Service unavailable",
            description: "Translation credits need to be added.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      if (data?.translatedText) {
        setTranslatedText(data.translatedText);
        toast({
          title: "Translation complete",
          description: `Translated to ${languages.find(l => l.code === targetLanguage)?.name}`,
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: "Unable to translate message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const clearTranslation = () => {
    setTranslatedText(null);
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1">
        {translatedText ? (
          <div className="flex items-center gap-1 bg-primary/10 rounded-full px-2 py-0.5">
            <span className="text-xs text-primary">Translated</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={clearTranslation}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full"
                disabled={isTranslating}
              >
                {isTranslating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Globe className="h-3 w-3" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleTranslate(lang.code)}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {translatedText ? (
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-medium text-primary">Translation:</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0"
              onClick={clearTranslation}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm">{translatedText}</p>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isTranslating}
              className="w-full"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Globe className="h-3 w-3 mr-2" />
                  Translate
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleTranslate(lang.code)}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default MessageTranslation;