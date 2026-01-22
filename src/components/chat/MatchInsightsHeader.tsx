import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Target, 
  MessageCircle,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface MatchInsightsHeaderProps {
  matchedUserId: string;
  matchedUserName: string;
  className?: string;
}

interface QuickInsights {
  matchScore: number;
  sharedInterests: string[];
  conversationTip?: string;
}

export const MatchInsightsHeader = ({ 
  matchedUserId, 
  matchedUserName,
  className 
}: MatchInsightsHeaderProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [insights, setInsights] = useState<QuickInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQuickInsights = async () => {
      setIsLoading(true);
      try {
        // Fetch match score
        const { data: scoreData } = await supabase.functions.invoke('calculate-match-score', {
          body: { otherUserId: matchedUserId }
        });

        // Fetch stored conversation insights
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: storedInsights } = await supabase
            .from('ai_conversation_insights')
            .select('shared_interests, suggested_topics')
            .eq('user_id', user.id)
            .eq('conversation_partner_id', matchedUserId)
            .maybeSingle();

          setInsights({
            matchScore: scoreData?.score || 0,
            sharedInterests: storedInsights?.shared_interests || scoreData?.commonalities || [],
            conversationTip: storedInsights?.suggested_topics?.[0] || null
          });
        }
      } catch (error) {
        console.error('Error fetching quick insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (matchedUserId) {
      fetchQuickInsights();
    }
  }, [matchedUserId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '💚';
    if (score >= 60) return '💙';
    if (score >= 40) return '💛';
    return '🤔';
  };

  if (!insights && !isLoading) return null;

  return (
    <div className={cn("border-b border-border/50", className)}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          
          {isLoading ? (
            <span className="text-sm text-muted-foreground animate-pulse">
              Analyzing match...
            </span>
          ) : insights ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Match Insights</span>
              <Badge 
                variant="outline" 
                className="text-xs bg-transparent border-purple-500/30"
              >
                <span className="mr-1">{getScoreEmoji(insights.matchScore)}</span>
                <span className={getScoreColor(insights.matchScore)}>
                  {insights.matchScore}%
                </span>
              </Badge>
            </div>
          ) : null}
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && insights && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-3">
              {/* Shared Interests */}
              {insights.sharedInterests.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Things you share with {matchedUserName}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {insights.sharedInterests.slice(0, 5).map((interest, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="text-xs bg-purple-500/10 text-purple-200"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation Tip */}
              {insights.conversationTip && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    Conversation Tip
                  </p>
                  <p className="text-sm text-foreground">
                    Try asking about: <span className="text-purple-300">{insights.conversationTip}</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
