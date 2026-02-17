import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="text-foreground mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('privacy.back', 'Back')}
        </Button>

        <div className="bg-card backdrop-blur-md rounded-xl p-8 border border-border">
          <h1 className="text-3xl font-bold text-foreground mb-6">{t('privacy.title', 'Privacy Policy')}</h1>
          <p className="text-muted-foreground mb-8">{t('privacy.last_updated', 'Last updated: December 2024')}</p>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('privacy.s1_title', '1. Introduction')}</h2>
              <p>{t('privacy.s1_content', 'Welcome to KurdMatch. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our dating platform.')}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('privacy.s2_title', '2. Information We Collect')}</h2>
              <p className="mb-3">{t('privacy.s2_intro', 'We collect information you provide directly to us, including:')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.s2_item1', 'Account information (name, email, phone number, date of birth)')}</li>
                <li>{t('privacy.s2_item2', 'Profile information (photos, bio, interests, preferences)')}</li>
                <li>{t('privacy.s2_item3', 'Location data (with your consent)')}</li>
                <li>{t('privacy.s2_item4', 'Communication data (messages, reports)')}</li>
                <li>{t('privacy.s2_item5', 'Usage data (how you interact with our services)')}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('privacy.s3_title', '3. How We Use Your Information')}</h2>
              <p className="mb-3">{t('privacy.s3_intro', 'We use the information we collect to:')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.s3_item1', 'Provide, maintain, and improve our services')}</li>
                <li>{t('privacy.s3_item2', 'Match you with other users based on your preferences')}</li>
                <li>{t('privacy.s3_item3', 'Send you notifications about matches and messages')}</li>
                <li>{t('privacy.s3_item4', 'Ensure safety and prevent fraud')}</li>
                <li>{t('privacy.s3_item5', 'Comply with legal obligations')}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('privacy.s4_title', '4. Information Sharing')}</h2>
              <p>{t('privacy.s4_content', 'We do not sell your personal information. We may share your information with other users, service providers, and law enforcement when required.')}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('privacy.s5_title', '5. Data Security')}</h2>
              <p>{t('privacy.s5_content', 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.')}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('privacy.s6_title', '6. Your Rights')}</h2>
              <p className="mb-3">{t('privacy.s6_intro', 'You have the right to:')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.s6_item1', 'Access your personal data')}</li>
                <li>{t('privacy.s6_item2', 'Correct inaccurate data')}</li>
                <li>{t('privacy.s6_item3', 'Delete your account and data')}</li>
                <li>{t('privacy.s6_item4', 'Object to processing of your data')}</li>
                <li>{t('privacy.s6_item5', 'Download a copy of your data')}</li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('privacy.s7_title', '7. Cookies')}</h2>
              <p>{t('privacy.s7_content', 'We use cookies and similar technologies to enhance your experience, analyze usage, and assist in our marketing efforts.')}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">{t('privacy.s8_title', '8. Contact Us')}</h2>
              <p>{t('privacy.s8_content', 'If you have any questions about this Privacy Policy, please contact us through our Help & Support center or email us at privacy@kurdmatch.com.')}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
