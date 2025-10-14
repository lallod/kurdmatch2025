import React from 'react';
import { Label } from '@/components/ui/label';
import { Brain, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PersonalityTypeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const personalityTypes = [
  { type: 'INTJ', name: 'The Architect', description: 'Strategic, analytical, independent thinker' },
  { type: 'INTP', name: 'The Logician', description: 'Innovative, logical, curious problem-solver' },
  { type: 'ENTJ', name: 'The Commander', description: 'Bold, strong-willed, strategic leader' },
  { type: 'ENTP', name: 'The Debater', description: 'Quick-witted, clever, resourceful' },
  { type: 'INFJ', name: 'The Advocate', description: 'Idealistic, organized, insightful' },
  { type: 'INFP', name: 'The Mediator', description: 'Empathetic, creative, passionate' },
  { type: 'ENFJ', name: 'The Protagonist', description: 'Charismatic, inspiring, natural leader' },
  { type: 'ENFP', name: 'The Campaigner', description: 'Enthusiastic, creative, sociable' },
  { type: 'ISTJ', name: 'The Logistician', description: 'Practical, reliable, organized' },
  { type: 'ISFJ', name: 'The Defender', description: 'Warm, loyal, caring protector' },
  { type: 'ESTJ', name: 'The Executive', description: 'Organized, efficient, traditional' },
  { type: 'ESFJ', name: 'The Consul', description: 'Caring, social, supportive' },
  { type: 'ISTP', name: 'The Virtuoso', description: 'Bold, practical, experimental' },
  { type: 'ISFP', name: 'The Adventurer', description: 'Flexible, charming, artistic' },
  { type: 'ESTP', name: 'The Entrepreneur', description: 'Energetic, perceptive, bold' },
  { type: 'ESFP', name: 'The Entertainer', description: 'Spontaneous, energetic, enthusiastic' }
];

const PersonalityTypeSelector = ({ value, onChange }: PersonalityTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-purple-400" />
        <Label className="text-white">Personality Type</Label>
      </div>
      <TooltipProvider>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {personalityTypes.map(({ type, name, description }) => (
            <Tooltip key={type}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(type)}
                  className={cn(
                    "relative px-4 py-3 rounded-lg border-2 transition-all duration-200",
                    "hover:scale-105 hover:shadow-lg",
                    value === type
                      ? "bg-purple-600 border-purple-400 text-white shadow-purple-500/50"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold">{type}</span>
                    <Info className="w-3 h-3 opacity-60" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-900 border-gray-700 text-white max-w-xs">
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-gray-300">{description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default PersonalityTypeSelector;
