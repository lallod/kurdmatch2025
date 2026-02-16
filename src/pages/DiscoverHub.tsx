import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Heart, Users, MapPin, Bookmark, Calendar, Gift, Trophy } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslations } from '@/hooks/useTranslations';

const DiscoverHub = () => {
  const navigate = useNavigate();
  const { counts } = useNotifications();
  const { t } = useTranslations();

  const items = [
    { icon: Eye, label: t('hub.views', 'Who Viewed Me'), path: '/viewed-me', count: counts.views, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    { icon: Heart, label: t('hub.likes', 'Who Liked Me'), path: '/liked-me', count: counts.likes, color: 'text-pink-400', bg: 'bg-pink-500/15' },
    { icon: Trophy, label: t('hub.matches', 'Matches'), path: '/matches', count: counts.matches, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { icon: MapPin, label: t('hub.nearby', 'Nearby'), path: '/discovery-nearby', count: 0, color: 'text-sky-400', bg: 'bg-sky-500/15' },
    { icon: Calendar, label: t('hub.events', 'Events'), path: '/events', count: 0, color: 'text-violet-400', bg: 'bg-violet-500/15' },
    { icon: Users, label: t('hub.groups', 'Groups'), path: '/groups', count: 0, color: 'text-orange-400', bg: 'bg-orange-500/15' },
    { icon: Bookmark, label: t('hub.saved', 'Saved Posts'), path: '/saved', count: 0, color: 'text-teal-400', bg: 'bg-teal-500/15' },
    { icon: Gift, label: t('hub.gifts', 'Gifts & Dates'), path: '/gifts', count: 0, color: 'text-rose-400', bg: 'bg-rose-500/15' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center">
          <h1 className="text-base font-semibold text-foreground">{t('hub.title', 'Discover')}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative bg-card rounded-2xl p-5 text-left transition-all active:scale-[0.97] border border-border/10 hover:border-border/30"
            >
              <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              {item.count > 0 && (
                <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5">
                  {item.count > 99 ? '99+' : item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverHub;
