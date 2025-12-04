import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, ChevronRight, Mail, MessageCircle, Shield, Heart, Users, CreditCard, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactSupportDialog from '@/components/support/ContactSupportDialog';

const faqCategories = [
  {
    id: 'getting-started',
    icon: Heart,
    title: 'Getting Started',
    description: 'New to KurdMatch? Start here',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Download the app or visit our website, tap "Sign Up", and follow the registration process. You\'ll need to provide basic information, upload photos, and verify your email.'
      },
      {
        question: 'How does matching work?',
        answer: 'When you like someone and they like you back, it\'s a match! You can then start chatting with each other. Swipe right to like, left to pass.'
      },
      {
        question: 'Can I change my profile information?',
        answer: 'Yes! Go to your profile, tap "Edit Profile" and you can update your photos, bio, and other details at any time.'
      },
      {
        question: 'How do I verify my profile?',
        answer: 'Go to Settings > Verification and follow the selfie verification process. A verified badge increases trust and match rates.'
      }
    ]
  },
  {
    id: 'safety',
    icon: Shield,
    title: 'Safety & Privacy',
    description: 'Stay safe while dating',
    faqs: [
      {
        question: 'How do I report someone?',
        answer: 'Open the user\'s profile, tap the three dots menu, and select "Report". Choose a reason and provide details. We review all reports within 24 hours.'
      },
      {
        question: 'How do I block someone?',
        answer: 'Open their profile, tap the three dots menu, and select "Block". They won\'t be able to see your profile or contact you.'
      },
      {
        question: 'Is my personal information safe?',
        answer: 'Yes, we use industry-standard encryption and never share your personal data with third parties. Your location is approximate and you control what\'s visible on your profile.'
      },
      {
        question: 'What safety tips should I follow?',
        answer: 'Never share financial information, meet in public places for first dates, tell a friend where you\'re going, and trust your instincts. Report any suspicious behavior.'
      }
    ]
  },
  {
    id: 'matches',
    icon: Users,
    title: 'Matches & Messages',
    description: 'Connecting with others',
    faqs: [
      {
        question: 'Why am I not getting matches?',
        answer: 'Try adding more photos, completing your profile, and being active daily. Verified profiles get more matches. Consider upgrading to Premium for more visibility.'
      },
      {
        question: 'Can I unmatch someone?',
        answer: 'Yes, open the conversation, tap the profile icon, then select "Unmatch". This removes the match and deletes the conversation for both users.'
      },
      {
        question: 'How do I start a conversation?',
        answer: 'After matching, open the chat and send a message. Personalized openers based on their profile work best!'
      },
      {
        question: 'Can I see who liked me?',
        answer: 'Premium members can see everyone who liked them. Free users see blurred previews and can match by swiping.'
      }
    ]
  },
  {
    id: 'subscription',
    icon: CreditCard,
    title: 'Premium & Payments',
    description: 'Subscription questions',
    faqs: [
      {
        question: 'What are the Premium benefits?',
        answer: 'Premium includes unlimited likes, see who liked you, advanced filters, profile boost, super likes, rewind last swipe, and ad-free experience.'
      },
      {
        question: 'How do I cancel my subscription?',
        answer: 'Go to Settings > Subscription > Manage Subscription. You can cancel anytime and keep Premium benefits until the end of your billing period.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Refunds are handled through your app store (Apple/Google) for in-app purchases. Contact us for web purchases within 14 days of subscription.'
      },
      {
        question: 'How do I upgrade to Premium?',
        answer: 'Tap the Premium icon or go to Settings > Subscription. Choose your plan (monthly, quarterly, or yearly) and complete the payment.'
      }
    ]
  },
  {
    id: 'account',
    icon: Settings,
    title: 'Account Settings',
    description: 'Manage your account',
    faqs: [
      {
        question: 'How do I delete my account?',
        answer: 'Go to Settings > Account > Delete Account. Note: This is permanent and all your data, matches, and messages will be deleted.'
      },
      {
        question: 'Can I pause my account?',
        answer: 'Yes, go to Settings > Discovery and toggle "Pause Account". Your profile will be hidden but you keep your matches and messages.'
      },
      {
        question: 'How do I change my email/phone?',
        answer: 'Go to Settings > Account to update your email or phone number. You\'ll need to verify the new contact information.'
      },
      {
        question: 'I forgot my password',
        answer: 'On the login screen, tap "Forgot Password" and enter your email. We\'ll send you a reset link valid for 24 hours.'
      }
    ]
  }
];

const HelpSupport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

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
            <h1 className="text-lg font-semibold">Help & Support</h1>
            <p className="text-xs text-muted-foreground">We're here to help</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto pb-24">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => setContactDialogOpen(true)}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Contact Us</p>
                <p className="text-xs text-muted-foreground">Send a message</p>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => navigate('/community-guidelines')}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Guidelines</p>
                <p className="text-xs text-muted-foreground">Community rules</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="all" className="flex-shrink-0">All Topics</TabsTrigger>
            {faqCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-4 space-y-4">
            {filteredCategories.map(category => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left text-sm">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-sm">
                          {faq.answer}
                        </AccordionContent>
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
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs
                      .filter(faq => 
                        searchQuery === '' ||
                        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((faq, index) => (
                        <AccordionItem key={index} value={`${category.id}-tab-${index}`}>
                          <AccordionTrigger className="text-left text-sm">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground text-sm">
                            {faq.answer}
                          </AccordionContent>
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
            <h3 className="font-semibold mb-2">Still need help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is available 24/7 to assist you
            </p>
            <Button onClick={() => setContactDialogOpen(true)}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      <ContactSupportDialog 
        open={contactDialogOpen} 
        onOpenChange={setContactDialogOpen} 
      />
    </div>
  );
};

export default HelpSupport;
