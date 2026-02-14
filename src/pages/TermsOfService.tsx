import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5" /></Button>
          <h1 className="text-lg font-bold text-foreground">Terms of Service</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 pb-24">
        <div className="bg-card/50 backdrop-blur-md rounded-2xl p-6 border border-border/20">
          <p className="text-muted-foreground mb-8">Last updated: December 2024</p>
          <div className="space-y-8 text-muted-foreground">
            {[
              { title: '1. Acceptance of Terms', content: 'By accessing or using KurdMatch, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.' },
              { title: '2. Eligibility', content: 'To use KurdMatch, you must be at least 18 years old, be legally able to enter into a binding contract, not be prohibited from using our services under applicable laws, and not have been previously banned from our platform.' },
              { title: '3. Account Registration', content: 'You agree to provide accurate, current, and complete information during registration and to update this information to keep it accurate. You are responsible for maintaining the confidentiality of your account credentials.' },
              { title: '4. User Conduct', content: 'You agree not to harass, abuse, or harm other users, post false, misleading, or offensive content, use the service for commercial purposes without permission, or violate any applicable laws or regulations.' },
              { title: '5. Content Guidelines', content: 'You retain ownership of content you post but grant us a license to use, display, and distribute it on our platform. You are responsible for ensuring your content complies with our Community Guidelines.' },
              { title: '6. Premium Services', content: 'Some features require a paid subscription. Subscriptions auto-renew unless cancelled. Refunds are provided in accordance with applicable laws and our refund policy.' },
              { title: '7. Safety', content: 'While we strive to maintain a safe environment, we cannot guarantee the behavior of other users. Please use caution when meeting people from the internet and report any suspicious activity.' },
              { title: '8. Termination', content: 'We may suspend or terminate your account for violations of these terms. You may delete your account at any time through your account settings.' },
              { title: '9. Contact', content: 'For questions about these Terms of Service, please contact us through our Help & Support center or email us at legal@kurdmatch.com.' },
            ].map((section, i) => (
              <section key={i}>
                <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
                <p>{section.content}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
