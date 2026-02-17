import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, Mail, MessageCircle, Shield, Heart, Users, CreditCard, Settings, HelpCircle, Ticket, TrendingUp, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ContactSupportDialog from '@/components/support/ContactSupportDialog';
import MyTickets from '@/components/support/MyTickets';
import { useAuth } from '@/integrations/supabase/auth';
import { useTranslations } from '@/hooks/useTranslations';

const HelpSupport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [showMyTickets, setShowMyTickets] = useState(false);
  const { t } = useTranslations();

  const faqCategories = [
    {
      id: 'getting-started',
      icon: Heart,
      title: t('help.faq.getting_started.title', 'Getting Started'),
      description: t('help.faq.getting_started.description', 'New to KurdMatch? Start here'),
      faqs: [
        { question: t('help.faq.getting_started.q1', 'How do I create an account?'), answer: t('help.faq.getting_started.a1', 'Download the app or visit our website, tap "Sign Up", and follow the registration process. You\'ll need to provide basic information, upload photos, and verify your email.'), popular: true },
        { question: t('help.faq.getting_started.q2', 'How does matching work?'), answer: t('help.faq.getting_started.a2', 'When you like someone and they like you back, it\'s a match! You can then start chatting with each other. Swipe right to like, left to pass.'), popular: true },
        { question: t('help.faq.getting_started.q3', 'Can I change my profile information?'), answer: t('help.faq.getting_started.a3', 'Yes! Go to your profile, tap "Edit Profile" and you can update your photos, bio, and other details at any time.'), popular: false },
        { question: t('help.faq.getting_started.q4', 'How do I verify my profile?'), answer: t('help.faq.getting_started.a4', 'Go to Settings > Verification and follow the selfie verification process. A verified badge increases trust and match rates.'), popular: true }
      ]
    },
    {
      id: 'safety',
      icon: Shield,
      title: t('help.faq.safety.title', 'Safety & Privacy'),
      description: t('help.faq.safety.description', 'Stay safe while dating'),
      faqs: [
        { question: t('help.faq.safety.q1', 'How do I report someone?'), answer: t('help.faq.safety.a1', 'Open the user\'s profile, tap the three dots menu, and select "Report". Choose a reason and provide details. We review all reports within 24 hours.'), popular: true },
        { question: t('help.faq.safety.q2', 'How do I block someone?'), answer: t('help.faq.safety.a2', 'Open their profile, tap the three dots menu, and select "Block". They won\'t be able to see your profile or contact you.'), popular: true },
        { question: t('help.faq.safety.q3', 'Is my personal information safe?'), answer: t('help.faq.safety.a3', 'Yes, we use industry-standard encryption and never share your personal data with third parties. Your location is approximate and you control what\'s visible on your profile.'), popular: false },
        { question: t('help.faq.safety.q4', 'What safety tips should I follow?'), answer: t('help.faq.safety.a4', 'Never share financial information, meet in public places for first dates, tell a friend where you\'re going, and trust your instincts. Report any suspicious behavior.'), popular: false }
      ]
    },
    {
      id: 'matches',
      icon: Users,
      title: t('help.faq.matches.title', 'Matches & Messages'),
      description: t('help.faq.matches.description', 'Connecting with others'),
      faqs: [
        { question: t('help.faq.matches.q1', 'Why am I not getting matches?'), answer: t('help.faq.matches.a1', 'Try adding more photos, completing your profile, and being active daily. Verified profiles get more matches. Consider upgrading to Premium for more visibility.'), popular: true },
        { question: t('help.faq.matches.q2', 'Can I unmatch someone?'), answer: t('help.faq.matches.a2', 'Yes, open the conversation, tap the profile icon, then select "Unmatch". This removes the match and deletes the conversation for both users.'), popular: false },
        { question: t('help.faq.matches.q3', 'How do I start a conversation?'), answer: t('help.faq.matches.a3', 'After matching, open the chat and send a message. Personalized openers based on their profile work best!'), popular: false },
        { question: t('help.faq.matches.q4', 'Can I see who liked me?'), answer: t('help.faq.matches.a4', 'Premium members can see everyone who liked them. Free users see blurred previews and can match by swiping.'), popular: true }
      ]
    },
    {
      id: 'subscription',
      icon: CreditCard,
      title: t('help.faq.subscription.title', 'Premium & Payments'),
      description: t('help.faq.subscription.description', 'Subscription questions'),
      faqs: [
        { question: t('help.faq.subscription.q1', 'What are the Premium benefits?'), answer: t('help.faq.subscription.a1', 'Premium includes unlimited likes, see who liked you, advanced filters, profile boost, super likes, rewind last swipe, and ad-free experience.'), popular: true },
        { question: t('help.faq.subscription.q2', 'How do I cancel my subscription?'), answer: t('help.faq.subscription.a2', 'Go to Settings > Subscription > Manage Subscription. You can cancel anytime and keep Premium benefits until the end of your billing period.'), popular: true },
        { question: t('help.faq.subscription.q3', 'Can I get a refund?'), answer: t('help.faq.subscription.a3', 'Refunds are handled through your app store (Apple/Google) for in-app purchases. Contact us for web purchases within 14 days of subscription.'), popular: false },
        { question: t('help.faq.subscription.q4', 'How do I upgrade to Premium?'), answer: t('help.faq.subscription.a4', 'Tap the Premium icon or go to Settings > Subscription. Choose your plan (monthly, quarterly, or yearly) and complete the payment.'), popular: false }
      ]
    },
    {
      id: 'account',
      icon: Settings,
      title: t('help.faq.account.title', 'Account Settings'),
      description: t('help.faq.account.description', 'Manage your account'),
      faqs: [
        { question: t('help.faq.account.q1', 'How do I delete my account?'), answer: t('help.faq.account.a1', 'Go to Settings > Account > Delete Account. Note: This is permanent and all your data, matches, and messages will be deleted.'), popular: true },
        { question: t('help.faq.account.q2', 'Can I pause my account?'), answer: t('help.faq.account.a2', 'Yes, go to Settings > Discovery and toggle "Pause Account". Your profile will be hidden but you keep your matches and messages.'), popular: false },
        { question: t('help.faq.account.q3', 'How do I change my email/phone?'), answer: t('help.faq.account.a3', 'Go to Settings > Account to update your email or phone number. You\'ll need to verify the new contact information.'), popular: false },
        { question: t('help.faq.account.q4', 'I forgot my password'), answer: t('help.faq.account.a4', 'On the login screen, tap "Forgot Password" and enter your email. We\'ll send you a reset link valid for 24 hours.'), popular: true }
      ]
    }
  ];

  // Get all popular FAQs
  const popularFaqs = useMemo(() => {
    return faqCategories.flatMap(category => 
      category.faqs
        .filter(faq => faq.popular)
        .map(faq => ({ ...faq, categoryId: category.id, categoryTitle: category.title, icon: category.icon }))
    ).slice(0, 5);
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return faqCategories.flatMap(category =>
      category.faqs
        .filter(faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
        )
        .map(faq => ({ ...faq, categoryId: category.id, categoryTitle: category.title, icon: category.icon }))
    );
  }, [searchQuery]);

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(
      faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0 || searchQuery === '');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
             <h1 className="text-lg font-semibold">{t('help.title', 'Help & Support')}</h1>
             <p className="text-xs text-muted-foreground">{t('help.subtitle', "We're here to help")}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto pb-24">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('help.search', 'Search for help...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setContactDialogOpen(true)}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div>
              <div><p className="font-medium text-sm">{t('help.contact_us', 'Contact Us')}</p><p className="text-xs text-muted-foreground">{t('help.send_message', 'Send a message')}</p></div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate('/community-guidelines')}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10"><Shield className="h-5 w-5 text-primary" /></div>
              <div><p className="font-medium text-sm">{t('help.guidelines', 'Guidelines')}</p><p className="text-xs text-muted-foreground">{t('help.community_rules', 'Community rules')}</p></div>
            </CardContent>
          </Card>
        </div>

        {/* My Tickets Section - Only for logged in users */}
        {user && (
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between" onClick={() => setShowMyTickets(!showMyTickets)}>
              <div className="flex items-center gap-2"><Ticket className="h-4 w-4" /><span>{t('help.my_tickets', 'My Support Tickets')}</span></div>
              <ChevronDown className={`h-4 w-4 transition-transform ${showMyTickets ? 'rotate-180' : ''}`} />
            </Button>
            {showMyTickets && <MyTickets />}
          </div>
        )}

        {/* Search Results */}
        {searchQuery.trim() && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium flex items-center gap-2"><Search className="h-4 w-4" />{t('help.search_results', 'Search Results')} ({searchResults.length})</h2>
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}><X className="h-4 w-4 mr-1" />{t('help.clear', 'Clear')}</Button>
            </div>
            {searchResults.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {searchResults.map((result, index) => (
                      <AccordionItem key={`search-${index}`} value={`search-${index}`}>
                        <AccordionTrigger className="px-4 text-left text-sm hover:no-underline">
                          <div className="flex items-start gap-3">
                            <result.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div><span>{result.question}</span><Badge variant="secondary" className="ml-2 text-xs">{result.categoryTitle}</Badge></div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-muted-foreground text-sm pl-11">{result.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <HelpCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t('help.no_results', 'No results found for')} "{searchQuery}"</p>
                  <Button variant="link" size="sm" onClick={() => setContactDialogOpen(true)}>{t('help.contact_instead', 'Contact support instead')}</Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Popular Questions - only show when not searching */}
        {!searchQuery.trim() && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />{t('help.popular_questions', 'Popular Questions')}</h2>
            <Card>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {popularFaqs.map((faq, index) => (
                    <AccordionItem key={`popular-${index}`} value={`popular-${index}`}>
                      <AccordionTrigger className="px-4 text-left text-sm hover:no-underline">
                        <div className="flex items-start gap-3">
                          <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div><span>{faq.question}</span><Badge variant="outline" className="ml-2 text-xs">{faq.categoryTitle}</Badge></div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-muted-foreground text-sm pl-11">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" className="flex-shrink-0">{t('help.all_topics', 'All Topics')}</TabsTrigger>
            {faqCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">{category.title}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            {filteredCategories.map(category => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2"><category.icon className="h-5 w-5 text-primary" /><CardTitle className="text-base">{category.title}</CardTitle></div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left text-sm">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {faqCategories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2"><category.icon className="h-5 w-5 text-primary" /><CardTitle className="text-base">{category.title}</CardTitle></div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs
                      .filter(faq => searchQuery === '' || faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((faq, index) => (
                        <AccordionItem key={index} value={`${category.id}-tab-${index}`}>
                          <AccordionTrigger className="text-left text-sm">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Still need help */}
        <Card className="bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <HelpCircle className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">{t('help.still_need', 'Still need help?')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('help.support_247', 'Our support team is available 24/7 to assist you')}</p>
            <Button onClick={() => setContactDialogOpen(true)}>
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('help.contact_support', 'Contact Support')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <ContactSupportDialog open={contactDialogOpen} onOpenChange={setContactDialogOpen} />
    </div>
  );
};

export default HelpSupport;
