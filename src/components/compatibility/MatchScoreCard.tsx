import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Target, 
  Users, 
  Sparkles, 
  RefreshCw, 
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

interface MatchScoreBreakdown {
  interests: number;
  values: number;
  lifestyle: number;
  goals: number;
}

interface MatchScoreData {
  score: number;
  breakdown: MatchScoreBreakdown;
  commonalities: string[];
  reasoning: string;
}

interface MatchScoreCardProps {
  targetUserId: string;
  className?: string;
  onScoreLoaded?: (score: number) => void;
}

export const MatchScoreCard = ({ targetUserId, className, onScoreLoaded }: MatchScoreCardProps) => {
  const [data, setData] = useState<MatchScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslations();

  const fetchMatchScore = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: result, error: fetchError } = await supabase.functions.invoke('calculate-match-score', {
        body: { otherUserId: targetUserId }
      });

      if (fetchError) throw fetchError;
      
      setData(result);
      onScoreLoaded?.(result.score);
    } catch (err: any) {
      console.error('Error fetching match score:', err);
      setError(err.message || t('match.calc_failed', 'Failed to calculate match score'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (targetUserId) {
      fetchMatchScore();
    }
  }, [targetUserId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '💚';
    if (score >= 80) return '✨';
    if (score >= 70) return '💙';
    if (score >= 60) return '💜';
    if (score >= 50) return '💛';
    return '🤔';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return t('match.perfect', 'Perfect Match');
    if (score >= 80) return t('match.great', 'Great Match');
    if (score >= 70) return t('match.good', 'Good Match');
    if (score >= 60) return t('match.potential', 'Potential');
    if (score >= 50) return t('match.worth_exploring', 'Worth Exploring');
    return t('match.getting_to_know', 'Getting to Know');
  };

  if (isLoading) {
    return (
      <Card className={cn("bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20", className)}>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="w-5 h-5 animate-spin text-purple-400 mr-2" />
          <span className="text-purple-300">{t('match.calculating', 'Calculating compatibility...')}</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20", className)}>
        <CardContent className="py-4">
          <p className="text-sm text-red-300 text-center">{error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchMatchScore}
            className="w-full mt-2 text-red-300 hover:text-red-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t('common.try_again', 'Try Again')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const breakdownItems = [
    { 
      label: t('match.shared_interests', 'Shared Interests'), 
      value: data.breakdown.interests, 
      max: 30, 
      icon: <Heart className="w-4 h-4" />,
      color: 'from-pink-500 to-rose-500'
    },
    { 
      label: t('match.core_values', 'Core Values'), 
      value: data.breakdown.values, 
      max: 25, 
      icon: <Star className="w-4 h-4" />,
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      label: t('match.lifestyle_match', 'Lifestyle Match'), 
      value: data.breakdown.lifestyle, 
      max: 25, 
      icon: <Users className="w-4 h-4" />,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      label: t('match.relationship_goals', 'Relationship Goals'), 
      value: data.breakdown.goals, 
      max: 20, 
      icon: <Target className="w-4 h-4" />,
      color: 'from-green-500 to-emerald-500'
    },
  ];

  return (
    <Card className={cn("bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-lg">{t('match.match_score', 'Match Score')}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={fetchMatchScore}
            className="h-8 w-8 text-purple-300 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Score Display */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-center gap-4 py-4"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-background/80 flex items-center justify-center">
                <span className={cn("text-3xl font-bold", getScoreColor(data.score))}>
                  {data.score}%
                </span>
              </div>
            </div>
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-1 -right-1 text-2xl"
            >
              {getScoreEmoji(data.score)}
            </motion.span>
          </div>
          <div>
            <p className={cn("text-lg font-semibold", getScoreColor(data.score))}>
              {getScoreLabel(data.score)}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {t('match.based_on_ai', 'Based on AI analysis')}
            </p>
          </div>
        </motion.div>

        {/* Breakdown */}
        <div className="space-y-3">
          {breakdownItems.map((item, index) => (
            <motion.div 
              key={item.label}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  {item.icon}
                  {item.label}
                </span>
                <span className="font-medium">{item.value}/{item.max}</span>
              </div>
              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / item.max) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  className={cn("h-full rounded-full bg-gradient-to-r", item.color)}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Commonalities */}
        {data.commonalities.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {t('match.in_common', 'What you have in common')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.commonalities.map((item, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-purple-500/20 text-purple-200 border-purple-500/30"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Reasoning */}
        {data.reasoning && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground italic">
              "{data.reasoning}"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
