import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationInsights } from './ConversationInsights';
import { useConversationInsights } from '@/hooks/useConversationInsights';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInsightsPanelProps {
  partnerId: string;
}

export const ChatInsightsPanel = ({ partnerId }: ChatInsightsPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useSupabaseAuth();
  const { insights, isGenerating, generateInsights, fetchStoredInsights } = useConversationInsights();

  useEffect(() => {
    if (user && partnerId) {
      fetchStoredInsights(user.id, partnerId);
    }
  }, [user, partnerId]);

  const handleRefresh = () => {
    if (user && partnerId) {
      generateInsights(user.id, partnerId);
    }
  };

  return (
    <div className="border-b border-border/50">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 h-auto"
      >
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Conversation Insights</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0">
              {insights ? (
                <ConversationInsights
                  sharedInterests={insights.sharedInterests}
                  suggestedTopics={insights.suggestedTopics}
                  conversationSummary={insights.conversationSummary}
                  communicationStyle={insights.communicationStyle}
                  onRefresh={handleRefresh}
                  isLoading={isGenerating}
                />
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
