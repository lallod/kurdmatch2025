import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Users, Lightbulb, Heart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const personalityData = [
  {
    type: 'INTJ',
    name: 'The Architect',
    description: 'Strategic masterminds who see the big picture. INTJs are independent thinkers who value logic and competence above all. They excel at planning and executing complex strategies with precision. In relationships, they seek intellectual connection and partners who respect their need for autonomy and deep conversation.',
    traits: ['Strategic thinking', 'Independent', 'Analytical', 'Direct communication'],
    compatibility: 'Best with partners who appreciate depth and intellectual discourse'
  },
  {
    type: 'INTP',
    name: 'The Logician',
    description: 'Innovative problem-solvers driven by curiosity. INTPs are logical thinkers who love exploring abstract concepts and theories. They approach life with a questioning mindset and value knowledge and understanding. In relationships, they need space for independent thought and partners who appreciate their unique perspective.',
    traits: ['Analytical', 'Creative', 'Curious', 'Reserved'],
    compatibility: 'Connects with those who value intellectual exploration'
  },
  {
    type: 'ENTJ',
    name: 'The Commander',
    description: 'Bold, strong-willed leaders who always find a way. ENTJs are natural strategists who take charge and inspire others to achieve their goals. They value efficiency and competence, expecting high standards from themselves and others. In love, they seek partners who can match their ambition and appreciate direct communication.',
    traits: ['Leadership', 'Decisive', 'Confident', 'Strategic'],
    compatibility: 'Thrives with partners who are equally driven and independent'
  },
  {
    type: 'ENTP',
    name: 'The Debater',
    description: 'Quick-witted and clever innovators who love mental sparring. ENTPs are creative thinkers who enjoy challenging the status quo and exploring new possibilities. They bring energy and enthusiasm to everything they do. In relationships, they need partners who can keep up with their intellectual curiosity and playful debates.',
    traits: ['Quick-witted', 'Innovative', 'Energetic', 'Challenging'],
    compatibility: 'Best matched with those who enjoy intellectual banter'
  },
  {
    type: 'INFJ',
    name: 'The Advocate',
    description: 'Idealistic visionaries who seek deep meaning and purpose. INFJs are compassionate and insightful, with a strong sense of intuition about people and situations. They work quietly to help others and make the world better. In relationships, they seek authentic, deep connections and partners who understand their complex inner world.',
    traits: ['Insightful', 'Idealistic', 'Organized', 'Compassionate'],
    compatibility: 'Connects deeply with authentic and emotionally aware partners'
  },
  {
    type: 'INFP',
    name: 'The Mediator',
    description: 'Idealistic dreamers guided by their deeply held values. INFPs are empathetic and creative souls who seek authentic connections and meaningful experiences. They are passionate about causes they believe in and need partners who understand their emotional depth. In love, they are loyal romantics seeking genuine, soulful relationships.',
    traits: ['Empathetic', 'Creative', 'Idealistic', 'Loyal'],
    compatibility: 'Thrives with partners who value authenticity and emotional depth'
  },
  {
    type: 'ENFJ',
    name: 'The Protagonist',
    description: 'Charismatic leaders who inspire and uplift others. ENFJs are warm, empathetic communicators who naturally bring people together. They are deeply attuned to others\' emotions and needs. In relationships, they are attentive and nurturing partners who create harmonious connections and help their loved ones grow.',
    traits: ['Charismatic', 'Empathetic', 'Organized', 'Inspiring'],
    compatibility: 'Perfect for those who appreciate emotional connection and growth'
  },
  {
    type: 'ENFP',
    name: 'The Campaigner',
    description: 'Enthusiastic free spirits who see life as full of possibilities. ENFPs are creative, sociable, and passionate individuals who bring energy and optimism everywhere. They value authentic connections and meaningful experiences. In love, they are warm, enthusiastic partners who seek deep emotional bonds and shared adventures.',
    traits: ['Enthusiastic', 'Creative', 'Sociable', 'Spontaneous'],
    compatibility: 'Connects with partners who embrace spontaneity and emotional depth'
  },
  {
    type: 'ISTJ',
    name: 'The Logistician',
    description: 'Practical, reliable individuals who value tradition and order. ISTJs are detail-oriented and methodical, taking their responsibilities seriously. They are dependable and honest, preferring proven methods and clear expectations. In relationships, they are loyal, committed partners who show love through practical actions and consistent support.',
    traits: ['Reliable', 'Practical', 'Organized', 'Honest'],
    compatibility: 'Best with partners who value stability and commitment'
  },
  {
    type: 'ISFJ',
    name: 'The Defender',
    description: 'Warm, caring protectors who dedicate themselves to others. ISFJs are nurturing and supportive, with a strong sense of duty and loyalty. They pay attention to details and remember what matters to their loved ones. In relationships, they are devoted partners who create warm, stable environments and show love through acts of service.',
    traits: ['Warm', 'Loyal', 'Practical', 'Supportive'],
    compatibility: 'Thrives with appreciative partners who value loyalty'
  },
  {
    type: 'ESTJ',
    name: 'The Executive',
    description: 'Organized administrators who value efficiency and tradition. ESTJs are practical leaders who bring order to chaos and get things done. They have high standards and value honesty and dedication. In relationships, they are reliable, committed partners who believe in clear communication and shared responsibilities.',
    traits: ['Organized', 'Efficient', 'Traditional', 'Direct'],
    compatibility: 'Matches well with partners who appreciate structure and honesty'
  },
  {
    type: 'ESFJ',
    name: 'The Consul',
    description: 'Caring, social individuals who create harmony and support others. ESFJs are warm and conscientious, naturally attuned to others\' needs and feelings. They thrive in social settings and value close relationships. In love, they are attentive, loyal partners who express affection openly and create nurturing home environments.',
    traits: ['Caring', 'Social', 'Supportive', 'Traditional'],
    compatibility: 'Perfect for those who appreciate warmth and emotional connection'
  },
  {
    type: 'ISTP',
    name: 'The Virtuoso',
    description: 'Bold, practical experimenters who master tools and techniques. ISTPs are hands-on problem solvers who remain calm in crises and adapt quickly to change. They value freedom and independence. In relationships, they show love through actions rather than words, and need partners who respect their need for space and spontaneity.',
    traits: ['Practical', 'Bold', 'Adaptable', 'Independent'],
    compatibility: 'Best with partners who value action and independence'
  },
  {
    type: 'ISFP',
    name: 'The Adventurer',
    description: 'Flexible, charming artists who live in the present moment. ISFPs are gentle free spirits who express themselves through creativity and aesthetics. They value harmony and authentic self-expression. In relationships, they are warm, caring partners who show love through thoughtful gestures and quality time together.',
    traits: ['Flexible', 'Charming', 'Artistic', 'Sensitive'],
    compatibility: 'Connects with partners who appreciate spontaneity and creativity'
  },
  {
    type: 'ESTP',
    name: 'The Entrepreneur',
    description: 'Energetic, perceptive individuals who live for the moment. ESTPs are action-oriented risk-takers who thrive on excitement and new experiences. They are socially savvy and adapt quickly to any situation. In relationships, they are fun-loving, spontaneous partners who keep things exciting and value physical connection.',
    traits: ['Energetic', 'Perceptive', 'Bold', 'Sociable'],
    compatibility: 'Thrives with adventurous partners who embrace spontaneity'
  },
  {
    type: 'ESFP',
    name: 'The Entertainer',
    description: 'Spontaneous, energetic performers who love life and people. ESFPs are the life of the party, bringing joy and enthusiasm wherever they go. They live in the moment and value authentic experiences. In love, they are warm, generous partners who express affection freely and create fun, memorable experiences together.',
    traits: ['Spontaneous', 'Energetic', 'Enthusiastic', 'Friendly'],
    compatibility: 'Perfect for partners who love fun, warmth, and adventure'
  }
];

const PersonalityTypeInfoDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          type="button"
          variant="outline" 
          size="sm"
          className="mb-4 bg-white/10 border-purple-400/30 text-white hover:bg-white/20"
        >
          <Info className="w-4 h-4 mr-2" />
          Learn About Personality Types
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Myers-Briggs Personality Types
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {personalityData.map((personality) => (
              <div 
                key={personality.type}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="px-3 py-1 rounded-md bg-purple-600 font-bold text-sm">
                    {personality.type}
                  </div>
                  <h3 className="text-xl font-semibold text-purple-300">
                    {personality.name}
                  </h3>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {personality.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-purple-400">
                      <Lightbulb className="w-4 h-4" />
                      <span className="font-semibold text-sm">Key Traits</span>
                    </div>
                    <ul className="space-y-1">
                      {personality.traits.map((trait, idx) => (
                        <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-purple-400 mt-1">•</span>
                          <span>{trait}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-pink-400">
                      <Heart className="w-4 h-4" />
                      <span className="font-semibold text-sm">In Relationships</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {personality.compatibility}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalityTypeInfoDialog;