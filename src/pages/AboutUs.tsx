import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Shield, Globe, Sparkles, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';

const AboutUs = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();

  const values = [
    { icon: Heart, title: t('about.val_connections', 'Authentic Connections'), description: t('about.val_connections_desc', 'We believe in meaningful relationships rooted in shared culture, values, and genuine compatibility.') },
    { icon: Shield, title: t('about.val_safety', 'Safety First'), description: t('about.val_safety_desc', 'Your privacy and security are our top priority. We use verification systems and moderation to keep our community safe.') },
    { icon: Users, title: t('about.val_community', 'Community Driven'), description: t('about.val_community_desc', 'Built by and for the Kurdish community, celebrating our rich heritage while embracing modern connection.') },
    { icon: Globe, title: t('about.val_global', 'Global Reach'), description: t('about.val_global_desc', 'Connecting Kurds across the diaspora — from Kurdistan to Europe, North America, and beyond.') },
  ];

  const stats = [
    { value: '50K+', label: t('about.active_members', 'Active Members') },
    { value: '10K+', label: t('about.matches_made', 'Matches Made') },
    { value: '30+', label: t('about.countries', 'Countries') },
    { value: '4.8★', label: t('about.app_rating', 'App Rating') },
  ];

  const features = [
    t('about.feat_chaperone', 'Chaperone Mode for family-guided matchmaking'),
    t('about.feat_marriage', 'Marriage intentions tracking for serious seekers'),
    t('about.feat_dialect', 'Kurdish dialect preferences (Sorani, Kurmanji, etc.)'),
    t('about.feat_verification', 'Photo verification for authentic profiles'),
    t('about.feat_events', 'Community events and social groups'),
    t('about.feat_gifts', 'Virtual gifts and date planning tools'),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full"><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-lg font-semibold">{t('about.title', 'About KurdMatch')}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-rose-400 shadow-lg shadow-primary/30">
            <Sparkles className="h-10 w-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">{t('about.hero_title', 'Where Kurdish Hearts Meet')}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">{t('about.hero_desc', 'KurdMatch is the premier platform for Kurdish singles seeking meaningful, marriage-focused relationships. We honor tradition while empowering modern connection.')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-2xl bg-card border border-border/50">
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h3 className="text-xl font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />{t('about.our_mission', 'Our Mission')}</h3>
          <div className="p-6 rounded-2xl bg-card border border-border/50 space-y-3">
            <p className="text-muted-foreground leading-relaxed">{t('about.mission_p1', 'In a world where finding a compatible life partner can feel overwhelming, KurdMatch provides a culturally sensitive space where Kurdish men and women can connect authentically.')}</p>
            <p className="text-muted-foreground leading-relaxed">{t('about.mission_p2', 'We understand the importance of shared values, family, language, and tradition in Kurdish culture. Our platform is designed to respect these pillars while giving you the tools to find your perfect match — whether you\'re in Hewlêr, London, Stockholm, or anywhere in the world.')}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
          <h3 className="text-xl font-semibold">{t('about.our_values', 'Our Values')}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value, i) => (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border/50 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><value.icon className="h-5 w-5 text-primary" /></div>
                  <h4 className="font-medium">{value.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
          <h3 className="text-xl font-semibold">{t('about.what_different', 'What Makes Us Different')}</h3>
          <div className="p-6 rounded-2xl bg-card border border-border/50">
            <ul className="space-y-3 text-muted-foreground">
              {features.map((feat, i) => (
                <li key={i} className="flex gap-2"><span className="text-primary">✓</span> {feat}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center space-y-4 pb-8">
          <p className="text-muted-foreground">{t('about.ready_match', 'Ready to find your match?')}</p>
          <Button onClick={() => navigate('/register')} className="rounded-full px-8 py-3 bg-gradient-to-r from-primary to-rose-400 text-primary-foreground shadow-lg shadow-primary/30">
            {t('about.join_today', 'Join KurdMatch Today')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
