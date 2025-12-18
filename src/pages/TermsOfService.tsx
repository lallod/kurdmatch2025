import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          className="text-white mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-purple-200 mb-8">Last updated: December 2024</p>

          <div className="space-y-8 text-purple-100">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using KurdMatch, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Eligibility</h2>
              <p>To use KurdMatch, you must:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
                <li>Be at least 18 years old</li>
                <li>Be legally able to enter into a binding contract</li>
                <li>Not be prohibited from using our services under applicable laws</li>
                <li>Not have been previously banned from our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Account Registration</h2>
              <p>
                You agree to provide accurate, current, and complete information during registration 
                and to update this information to keep it accurate. You are responsible for maintaining 
                the confidentiality of your account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. User Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Harass, abuse, or harm other users</li>
                <li>Post false, misleading, or offensive content</li>
                <li>Use the service for commercial purposes without permission</li>
                <li>Attempt to access other users' accounts</li>
                <li>Upload malicious software or content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Content Guidelines</h2>
              <p>
                You retain ownership of content you post but grant us a license to use, display, 
                and distribute it on our platform. You are responsible for ensuring your content 
                complies with our Community Guidelines.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Premium Services</h2>
              <p>
                Some features require a paid subscription. Subscriptions auto-renew unless cancelled. 
                Refunds are provided in accordance with applicable laws and our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Safety</h2>
              <p>
                While we strive to maintain a safe environment, we cannot guarantee the behavior 
                of other users. Please use caution when meeting people from the internet and 
                report any suspicious activity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Termination</h2>
              <p>
                We may suspend or terminate your account for violations of these terms. 
                You may delete your account at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Disclaimers</h2>
              <p>
                Our services are provided "as is" without warranties of any kind. 
                We do not guarantee matches, connections, or any particular outcome from using our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, KurdMatch shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">11. Changes to Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of our services 
                after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">12. Contact</h2>
              <p>
                For questions about these Terms of Service, please contact us through our 
                Help & Support center or email us at legal@kurdmatch.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
