
import React from 'react';
import { User, Heart, Coffee, Brain, Star, Activity, Scroll } from 'lucide-react';

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Basics': return <User className="h-4 w-4" />;
    case 'Relationships': return <Heart className="h-4 w-4" />;
    case 'Lifestyle': return <Coffee className="h-4 w-4" />;
    case 'Beliefs': return <Scroll className="h-4 w-4" />;
    case 'Personality': return <Brain className="h-4 w-4" />;
    case 'Interests': return <Star className="h-4 w-4" />;
    case 'Physical': return <Activity className="h-4 w-4" />;
    default: return <User className="h-4 w-4" />;
  }
};
