import { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { generateIcebreakers } from '@/api/ai';
import { motion, AnimatePresence } from 'framer-motion';

interface IcebreakerSuggestionsProps {
  matchedUserId: string;
  onSelectIcebreaker: (text: string) => void;
  hasMessages?: boolean;
}

export const IcebreakerSuggestions = ({
  matchedUserId,
  onSelectIcebreaker,
  hasMessages = false,
}: IcebreakerSuggestionsProps) => {
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(!hasMessages);

  useEffect(() => {
    if (!hasMessages && matchedUserId) {
      loadIcebreakers();
    }
  }, [matchedUserId, hasMessages]);

  const loadIcebreakers = async () => {
    setIsLoading(true);
    try {
      const result = await generateIcebreakers(matchedUserId);
      setIcebreakers(result.icebreakers || []);
    } catch (error) {
      console.error('Failed to load icebreakers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (text: string) => {
    onSelectIcebreaker(text);
    setIsVisible(false);
  };

  if (!isVisible || hasMessages) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="p-4"
      >
        <Card className="p-4 bg-gradient-to-br from-primary/5 via-background to-primary/10 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">AI Icebreaker Suggestions</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadIcebreakers}
              disabled={isLoading}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : icebreakers.length > 0 ? (
            <div className="space-y-2">
              {icebreakers.map((icebreaker, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelect(icebreaker)}
                  className="w-full text-left p-3 rounded-lg bg-background/80 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm">{icebreaker}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Start the conversation your way! 💬
            </p>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
