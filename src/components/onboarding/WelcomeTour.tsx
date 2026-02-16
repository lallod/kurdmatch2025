import React, { useState } from 'react';
import { Heart, Home, MessageCircle, UserRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

const STORAGE_KEY = 'kurdmatch_onboarding_seen';

interface WelcomeTourProps {
  onComplete: () => void;
}

const WelcomeTour: React.FC<WelcomeTourProps> = ({ onComplete }) => {
  const { t } = useTranslations();
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: Heart,
      color: 'text-pink-400',
      bg: 'bg-pink-500/15',
      title: t('tour.swipe_title', 'Swipe to Find Matches'),
      desc: t('tour.swipe_desc', 'Like or pass on profiles. When you both like each other, it\'s a match!'),
    },
    {
      icon: Home,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      title: t('tour.discover_title', 'Discover Your Feed'),
      desc: t('tour.discover_desc', 'See posts from the community. Like, comment, and share.'),
    },
    {
      icon: MessageCircle,
      color: 'text-sky-400',
      bg: 'bg-sky-500/15',
      title: t('tour.chat_title', 'Chat With Matches'),
      desc: t('tour.chat_desc', 'Send messages, voice notes, and photos to your matches.'),
    },
    {
      icon: UserRound,
      color: 'text-violet-400',
      bg: 'bg-violet-500/15',
      title: t('tour.profile_title', 'Complete Your Profile'),
      desc: t('tour.profile_desc', 'A complete profile gets 3x more matches. Add photos and details!'),
    },
  ];

  const current = slides[step];
  const isLast = step === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem(STORAGE_KEY, 'true');
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
      <button onClick={handleSkip} className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground">
        <X className="w-5 h-5" />
      </button>

      <div className={`w-20 h-20 ${current.bg} rounded-3xl flex items-center justify-center mb-8`}>
        <current.icon className={`w-10 h-10 ${current.color}`} />
      </div>

      <h2 className="text-xl font-bold text-foreground mb-2 text-center">{current.title}</h2>
      <p className="text-sm text-muted-foreground text-center max-w-xs mb-10">{current.desc}</p>

      {/* Dots */}
      <div className="flex gap-2 mb-8">
        {slides.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'}`} />
        ))}
      </div>

      <Button onClick={handleNext} className="w-full max-w-xs">
        {isLast ? t('tour.get_started', 'Get Started') : t('tour.next', 'Next')}
      </Button>
    </div>
  );
};

export const useWelcomeTour = () => {
  const hasSeen = localStorage.getItem(STORAGE_KEY) === 'true';
  return { shouldShow: !hasSeen };
};

export default WelcomeTour;
