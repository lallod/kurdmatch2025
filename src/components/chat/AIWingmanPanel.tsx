import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageSquare, Heart, Flame, Brain, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIWingman, WingmanType } from '@/hooks/useAIWingman';
import { cn } from '@/lib/utils';

interface AIWingmanPanelProps {
  matchedUserId: string;
  conversationContext?: string[];
  lastReceivedMessage?: string;
  onSelectSuggestion: (message: string) => void;
  isNewConversation?: boolean;
}

const wingmanModes: { type: WingmanType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'opener', label: 'Opener', icon: <MessageSquare className="w-3.5 h-3.5" />, description: 'Start the conversation' },
  { type: 'reply', label: 'Reply', icon: <Sparkles className="w-3.5 h-3.5" />, description: 'Respond to their message' },
  { type: 'continue', label: 'Continue', icon: <MessageSquare className="w-3.5 h-3.5" />, description: 'Keep it going' },
  { type: 'flirt', label: 'Flirt', icon: <Heart className="w-3.5 h-3.5" />, description: 'Turn up the charm' },
  { type: 'deeper', label: 'Go Deeper', icon: <Brain className="w-3.5 h-3.5" />, description: 'Meaningful questions' },
];

export const AIWingmanPanel = ({
  matchedUserId,
  conversationContext,
  lastReceivedMessage,
  onSelectSuggestion,
  isNewConversation = false
}: AIWingmanPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMode, setSelectedMode] = useState<WingmanType | null>(null);
  
  const { 
    suggestions, 
    isLoading, 
    getSuggestions,
    clearSuggestions 
  } = useAIWingman();

  const handleModeSelect = async (type: WingmanType) => {
    setSelectedMode(type);
    
    await getSuggestions(type, matchedUserId, {
      conversationContext,
      lastMessage: lastReceivedMessage
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSelectSuggestion(suggestion);
    clearSuggestions();
    setSelectedMode(null);
    setIsExpanded(false);
  };

  // Filter available modes based on conversation state
  const availableModes = wingmanModes.filter(mode => {
    if (isNewConversation) {
      return mode.type === 'opener';
    }
    if (!lastReceivedMessage && mode.type === 'reply') {
      return false;
    }
    return mode.type !== 'opener';
  });

  return (
    <div className="relative">
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "gap-1.5 text-xs transition-all",
          isExpanded 
            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300" 
            : "text-purple-400 hover:text-purple-300"
        )}
      >
        <Sparkles className="w-3.5 h-3.5" />
        AI Wingman
        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
      </Button>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 right-0 mb-2 bg-gradient-to-br from-purple-900/95 to-pink-900/95 backdrop-blur-xl rounded-xl border border-purple-500/30 shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-medium text-white">AI Wingman</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-purple-300 hover:text-white"
                onClick={() => {
                  setIsExpanded(false);
                  clearSuggestions();
                  setSelectedMode(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Mode Selector */}
            <div className="p-2 flex gap-1.5 flex-wrap">
              {availableModes.map((mode) => (
                <Button
                  key={mode.type}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleModeSelect(mode.type)}
                  disabled={isLoading}
                  className={cn(
                    "gap-1.5 text-xs rounded-full transition-all",
                    selectedMode === mode.type
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-white/5 text-purple-200 hover:bg-white/10"
                  )}
                >
                  {mode.icon}
                  {mode.label}
                </Button>
              ))}
            </div>

            {/* Suggestions */}
            <div className="px-3 pb-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                  <span className="ml-2 text-sm text-purple-300">Generating suggestions...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-purple-500/30 transition-all group"
                    >
                      <p className="text-sm text-white/90 group-hover:text-white">
                        {suggestion}
                      </p>
                      <p className="text-xs text-purple-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to use this message
                      </p>
                    </motion.button>
                  ))}
                </div>
              ) : selectedMode ? (
                <p className="text-sm text-purple-300 text-center py-4">
                  No suggestions available. Try again!
                </p>
              ) : (
                <p className="text-sm text-purple-300/70 text-center py-4">
                  {isNewConversation 
                    ? "Let me help you start the conversation! 💬"
                    : "Choose a mode to get AI-powered message suggestions ✨"
                  }
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
