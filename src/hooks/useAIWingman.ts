import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

export type WingmanType = 'opener' | 'reply' | 'continue' | 'flirt' | 'deeper';

interface WingmanResult {
  suggestions: string[];
  type: WingmanType;
  matchName: string;
}

export const useAIWingman = () => {
  const { t } = useTranslations();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastType, setLastType] = useState<WingmanType | null>(null);

  const getSuggestions = useCallback(async (
    type: WingmanType,
    matchedUserId: string,
    options?: {
      conversationContext?: string[];
      lastMessage?: string;
    }
  ): Promise<string[]> => {
    setIsLoading(true);
    setSuggestions([]);
    setLastType(type);

    try {
      const { data, error } = await supabase.functions.invoke('ai-wingman', {
        body: {
          type,
          matchedUserId,
          conversationContext: options?.conversationContext,
          lastMessage: options?.lastMessage
        }
      });

      if (error) {
        console.error('Wingman error:', error);
        
        if (error.message?.includes('429') || error.message?.includes('Rate limit')) {
          toast.error(t('toast.ai.too_many_requests', 'Too many requests'));
        } else if (error.message?.includes('402')) {
          toast.error(t('toast.ai.credits_exhausted', 'AI credits exhausted'));
        } else {
          toast.error(t('toast.ai.suggestion_failed', 'Could not generate suggestions'));
        }
        return [];
      }

      const result = data as WingmanResult;
      setSuggestions(result.suggestions || []);
      return result.suggestions || [];

    } catch (error) {
      console.error('Wingman error:', error);
      toast.error(t('toast.ai.something_wrong', 'Something went wrong'));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOpeners = useCallback((matchedUserId: string) => {
    return getSuggestions('opener', matchedUserId);
  }, [getSuggestions]);

  const getReply = useCallback((matchedUserId: string, lastMessage: string) => {
    return getSuggestions('reply', matchedUserId, { lastMessage });
  }, [getSuggestions]);

  const getContinuation = useCallback((matchedUserId: string, conversationContext: string[]) => {
    return getSuggestions('continue', matchedUserId, { conversationContext });
  }, [getSuggestions]);

  const getFlirty = useCallback((matchedUserId: string, conversationContext?: string[]) => {
    return getSuggestions('flirt', matchedUserId, { conversationContext });
  }, [getSuggestions]);

  const getDeeper = useCallback((matchedUserId: string, conversationContext?: string[]) => {
    return getSuggestions('deeper', matchedUserId, { conversationContext });
  }, [getSuggestions]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setLastType(null);
  }, []);

  return {
    suggestions,
    isLoading,
    lastType,
    getSuggestions,
    getOpeners,
    getReply,
    getContinuation,
    getFlirty,
    getDeeper,
    clearSuggestions
  };
};
