import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Heart, Users, MapPin, Bookmark, Calendar, Gift, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import { useTranslations } from '@/hooks/useTranslations';

const DiscoverHub = () => {
  const navigate = useNavigate();
  const { counts } = useNotifications();
  const { t } = useTranslations();

  const items = [
    { icon: Eye, label: t('hub.views', 'Who Viewed Me'), path: '/viewed-me', count: counts.views, gradient: 'from-emerald-500/20 to-teal-500/20', iconColor: 'text-emerald-400' },
    { icon: Heart, label: t('hub.likes', 'Who Liked Me'), path: '/liked-me', count: counts.likes, gradient: 'from-pink-500/20 to-rose-500/20', iconColor: 'text-pink-400' },
    { icon: Trophy, label: t('hub.matches', 'Matches'), path: '/matches', count: counts.matches, gradient: 'from-amber-500/20 to-orange-500/20', iconColor: 'text-amber-400' },
    { icon: MapPin, label: t('hub.nearby', 'Nearby'), path: '/discovery-nearby', count: 0, gradient: 'from-sky-500/20 to-blue-500/20', iconColor: 'text-sky-400' },
    { icon: Calendar, label: t('hub.events', 'Events'), path: '/events', count: 0, gradient: 'from-violet-500/20 to-purple-500/20', iconColor: 'text-violet-400' },
    { icon: Users, label: t('hub.groups', 'Groups'), path: '/groups', count: 0, gradient: 'from-orange-500/20 to-amber-500/20', iconColor: 'text-orange-400' },
    { icon: Bookmark, label: t('hub.saved', 'Saved Posts'), path: '/saved', count: 0, gradient: 'from-teal-500/20 to-cyan-500/20', iconColor: 'text-teal-400' },
    { icon: Gift, label: t('hub.gifts', 'Gifts & Dates'), path: '/gifts', count: 0, gradient: 'from-rose-500/20 to-pink-500/20', iconColor: 'text-rose-400' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Frosted header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center">
          <h1 className="text-lg font-bold text-foreground tracking-tight">{t('hub.title', 'Discover')}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3.5">
          {items.map((item, index) => (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => navigate(item.path)}
              className="relative group overflow-hidden rounded-2xl border border-border/10 active:scale-[0.97] transition-all duration-200"
              whileTap={{ scale: 0.96 }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="absolute inset-0 bg-card/40 backdrop-blur-sm" />
              
              {/* Content */}
              <div className="relative p-4 pt-5 pb-4 flex flex-col items-start min-h-[120px]">
                <div className="w-11 h-11 rounded-xl bg-background/50 backdrop-blur flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className={`${item.iconColor}`} style={{ width: 20, height: 20 }} />
                </div>
                <p className="text-[13px] font-semibold text-foreground text-left leading-tight">{item.label}</p>
              </div>

              {/* Count badge */}
              {item.count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.04 + 0.25, type: 'spring', stiffness: 400, damping: 15 }}
                  className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5 shadow-lg shadow-primary/40"
                >
                  {item.count > 99 ? '99+' : item.count}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverHub;
