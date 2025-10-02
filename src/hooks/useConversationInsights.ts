import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ConversationInsights {
  sharedInterests: string[];
  suggestedTopics: string[];
  conversationSummary?: string;
  communicationStyle?: string;
}

export const useConversationInsights = () => {
  const [insights, setInsights] = useState<ConversationInsights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateInsights = async (userId: string, partnerId: string) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { userId, partnerId }
      });

      if (error) throw error;

      setInsights(data as ConversationInsights);
      
      toast({
        title: "Insights generated",
        description: "AI has analyzed your conversation patterns",
      });

      return data as ConversationInsights;
    } catch (error) {
      console.error('Insights generation error:', error);
      toast({
        title: "Failed to generate insights",
        description: "Unable to analyze conversation at this time",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchStoredInsights = async (userId: string, partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from('ai_conversation_insights')
        .select('*')
        .eq('user_id', userId)
        .eq('conversation_partner_id', partnerId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setInsights({
          sharedInterests: data.shared_interests as string[],
          suggestedTopics: data.suggested_topics as string[],
          conversationSummary: data.conversation_summary,
          communicationStyle: data.communication_style
        });
      }

      return data;
    } catch (error) {
      console.error('Error fetching insights:', error);
      return null;
    }
  };

  return { insights, isGenerating, generateInsights, fetchStoredInsights };
};
