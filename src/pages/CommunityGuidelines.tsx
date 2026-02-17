import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, Users, MessageCircle, Camera, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from '@/hooks/useTranslations';

const CommunityGuidelines = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();

  const guidelines = [
    { icon: Heart, title: t('guidelines.be_respectful', 'Be Respectful'), description: t('guidelines.be_respectful_desc', 'Treat everyone with dignity and respect. We have zero tolerance for harassment, hate speech, or discrimination.'), rules: [t('guidelines.rule_kind', 'Use kind and respectful language'), t('guidelines.rule_boundaries', 'Respect boundaries when someone says no'), t('guidelines.rule_pressure', "Don't pressure others for personal information"), t('guidelines.rule_rejection', 'Accept rejection gracefully')] },
    { icon: Shield, title: t('guidelines.stay_safe', 'Stay Safe'), description: t('guidelines.stay_safe_desc', 'Your safety is our top priority. Protect yourself and others by following these guidelines.'), rules: [t('guidelines.rule_financial', 'Never share financial information'), t('guidelines.rule_public', 'Meet in public places for first dates'), t('guidelines.rule_friend', "Tell a friend where you're going"), t('guidelines.rule_report', 'Report suspicious behavior immediately')] },
    { icon: Camera, title: t('guidelines.authentic', 'Authentic Photos'), description: t('guidelines.authentic_desc', 'Use real, recent photos that accurately represent you. Build genuine connections based on honesty.'), rules: [t('guidelines.rule_yourself', 'All photos must be of yourself'), t('guidelines.rule_nudity', 'No nudity or sexually explicit content'), t('guidelines.rule_minors', 'No photos of minors (unless with parent)'), t('guidelines.rule_stock', 'No copyrighted or stock images')] },
    { icon: MessageCircle, title: t('guidelines.meaningful', 'Meaningful Conversations'), description: t('guidelines.meaningful_desc', 'Focus on building real connections through respectful and genuine communication.'), rules: [t('guidelines.rule_spam', 'No spam or promotional content'), t('guidelines.rule_solicitation', 'No solicitation of any kind'), t('guidelines.rule_appropriate', 'Keep conversations appropriate'), t('guidelines.rule_private', "Don't share others' private conversations")] },
    { icon: Users, title: t('guidelines.community', 'Community Standards'), description: t('guidelines.community_desc', 'Help us maintain a welcoming community for all Kurdish singles worldwide.'), rules: [t('guidelines.rule_one_account', 'One account per person'), t('guidelines.rule_18', 'Must be 18+ to use the platform'), t('guidelines.rule_impersonation', 'No impersonation of others'), t('guidelines.rule_violations', 'Report violations when you see them')] },
  ];

  const violations = [
    t('guidelines.v_harassment', 'Harassment or bullying'), t('guidelines.v_hate', 'Hate speech or discrimination'),
    t('guidelines.v_scams', 'Scams or fraud attempts'), t('guidelines.v_fake', 'Fake profiles or catfishing'),
    t('guidelines.v_underage', 'Underage users'), t('guidelines.v_violence', 'Violence or threats'),
    t('guidelines.v_illegal', 'Illegal activities'), t('guidelines.v_spam', 'Spam or commercial solicitation'),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-lg font-semibold">{t('guidelines.title', 'Community Guidelines')}</h1>
            <p className="text-xs text-muted-foreground">{t('guidelines.subtitle', 'Rules for a safe community')}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto pb-24">
        <Card className="bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/20">
          <CardContent className="p-6">
            <Shield className="h-10 w-10 text-primary mb-3" />
            <h2 className="text-xl font-semibold mb-2">{t('guidelines.welcome', 'Welcome to KurdMatch')}</h2>
            <p className="text-muted-foreground">{t('guidelines.welcome_desc', 'Our community guidelines exist to ensure everyone has a safe, respectful, and enjoyable experience. By using KurdMatch, you agree to follow these guidelines.')}</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {guidelines.map((guideline, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10"><guideline.icon className="h-5 w-5 text-primary" /></div>
                  <CardTitle className="text-base">{guideline.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{guideline.description}</p>
                <ul className="space-y-2">
                  {guideline.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="text-sm flex items-start gap-2"><span className="text-primary mt-1">•</span>{rule}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
              <CardTitle className="text-base">{t('guidelines.prohibited', 'Prohibited Behavior')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{t('guidelines.prohibited_desc', 'The following behaviors will result in immediate account suspension or permanent ban:')}</p>
            <div className="grid grid-cols-2 gap-2">
              {violations.map((violation, index) => (
                <div key={index} className="text-sm flex items-center gap-2"><span className="text-destructive">✕</span>{violation}</div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">{t('guidelines.how_report', 'How to Report')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('guidelines.report_desc', 'If you encounter any violations, please report them immediately:')}</p>
            <ol className="space-y-2 text-sm">
              <li>{t('guidelines.report_step1', "1. Open the user's profile")}</li>
              <li>{t('guidelines.report_step2', '2. Tap the three dots (...) menu')}</li>
              <li>{t('guidelines.report_step3', '3. Select "Report"')}</li>
              <li>{t('guidelines.report_step4', '4. Choose a reason and provide details')}</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">{t('guidelines.report_note', 'All reports are reviewed within 24 hours. Your identity is kept confidential.')}</p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>{t('guidelines.questions', 'Questions about our guidelines?')}</p>
          <Button variant="link" onClick={() => navigate('/help-support')}>{t('guidelines.contact_support', 'Contact Support')}</Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
