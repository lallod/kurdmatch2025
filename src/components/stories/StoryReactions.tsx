import React, { useState } from 'react';
import { Heart, Laugh, Sparkles, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface StoryReactionsProps {
  storyId: string;
  reactions: any[];
  onReactionAdded: () => void;
}

const reactionTypes = [
  { icon: Heart, label: 'Love', color: 'text-pink-500' },
  { icon: Laugh, label: 'Laugh', color: 'text-yellow-500' },
  { icon: Sparkles, label: 'Wow', color: 'text-blue-500' },
  { icon: ThumbsUp, label: 'Like', color: 'text-green-500' },
];

const StoryReactions: React.FC<StoryReactionsProps> = ({ storyId, reactions, onReactionAdded }) => {
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = async (reactionType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current reactions
      const { data: story } = await supabase
        .from('stories')
        .select('reactions')
        .eq('id', storyId)
        .single();

      const currentReactions = Array.isArray(story?.reactions) ? story.reactions : [];
      
      // Add new reaction
      const newReaction = {
        user_id: user.id,
        type: reactionType,
        timestamp: new Date().toISOString()
      };

      const updatedReactions = [...currentReactions, newReaction];

      const { error } = await supabase
        .from('stories')
        .update({ 
          reactions: updatedReactions as any
        })
        .eq('id', storyId);

      if (error) throw error;

      toast({
        title: 'Reaction sent!',
        description: `You reacted with ${reactionType}`,
      });

      setShowReactions(false);
      onReactionAdded();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowReactions(!showReactions)}
        className="p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors"
      >
        <Heart className="w-6 h-6 text-white" />
      </button>

      {showReactions && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-full p-2 flex gap-2">
          {reactionTypes.map((reaction) => (
            <button
              key={reaction.label}
              onClick={() => handleReaction(reaction.label)}
              className="p-2 hover:scale-125 transition-transform"
              title={reaction.label}
            >
              <reaction.icon className={`w-6 h-6 ${reaction.color}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryReactions;
