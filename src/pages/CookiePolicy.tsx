import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';

const CookiePolicy = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();

  const sections = [
    { title: t('cookie.s1_title', '1. What Are Cookies'), content: t('cookie.s1_content', 'Cookies are small text files stored on your device when you visit our platform. They help us provide you with a better experience by remembering your preferences, keeping you signed in, and understanding how you use KurdMatch.') },
    { title: t('cookie.s2_title', '2. Types of Cookies We Use'), content: t('cookie.s2_content', '**Essential Cookies**: Required for the platform to function.\n\n**Functional Cookies**: Remember your preferences.\n\n**Analytics Cookies**: Help us understand usage.\n\n**Performance Cookies**: Monitor platform performance.') },
    { title: t('cookie.s3_title', '3. Third-Party Cookies'), content: t('cookie.s3_content', 'We use services like Supabase for authentication and data storage, Stripe for payment processing, and Giphy for GIF content.') },
    { title: t('cookie.s4_title', '4. How Long Cookies Last'), content: t('cookie.s4_content', '**Session Cookies**: Deleted when you close your browser.\n\n**Persistent Cookies**: Remain on your device for a set period.') },
    { title: t('cookie.s5_title', '5. Managing Cookies'), content: t('cookie.s5_content', 'You can manage cookie preferences through your browser settings.') },
    { title: t('cookie.s6_title', '6. Updates to This Policy'), content: t('cookie.s6_content', 'We may update this Cookie Policy from time to time.') },
    { title: t('cookie.s7_title', '7. Contact Us'), content: t('cookie.s7_content', 'If you have questions about our use of cookies, please contact us at support@kurdmatch.com.') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{t('cookie.title', 'Cookie Policy')}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
            <Cookie className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">{t('cookie.title', 'Cookie Policy')}</h2>
          <p className="text-sm text-muted-foreground">{t('cookie.last_updated', 'Last updated: February 2026')}</p>
        </motion.div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 rounded-2xl bg-card border border-border/50">
              <h3 className="font-semibold mb-2">{section.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center pb-8">
          <Button variant="outline" onClick={() => navigate('/contact')} className="rounded-xl">
            {t('cookie.questions_contact', 'Questions? Contact Us')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
