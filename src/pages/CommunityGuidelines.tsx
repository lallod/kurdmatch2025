import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, Users, MessageCircle, Camera, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const guidelines = [
  {
    icon: Heart,
    title: 'Be Respectful',
    description: 'Treat everyone with dignity and respect. We have zero tolerance for harassment, hate speech, or discrimination based on race, ethnicity, religion, gender, or sexual orientation.',
    rules: [
      'Use kind and respectful language',
      'Respect boundaries when someone says no',
      'Don\'t pressure others for personal information',
      'Accept rejection gracefully'
    ]
  },
  {
    icon: Shield,
    title: 'Stay Safe',
    description: 'Your safety is our top priority. Protect yourself and others by following these guidelines.',
    rules: [
      'Never share financial information',
      'Meet in public places for first dates',
      'Tell a friend where you\'re going',
      'Report suspicious behavior immediately'
    ]
  },
  {
    icon: Camera,
    title: 'Authentic Photos',
    description: 'Use real, recent photos that accurately represent you. Build genuine connections based on honesty.',
    rules: [
      'All photos must be of yourself',
      'No nudity or sexually explicit content',
      'No photos of minors (unless with parent)',
      'No copyrighted or stock images'
    ]
  },
  {
    icon: MessageCircle,
    title: 'Meaningful Conversations',
    description: 'Focus on building real connections through respectful and genuine communication.',
    rules: [
      'No spam or promotional content',
      'No solicitation of any kind',
      'Keep conversations appropriate',
      'Don\'t share others\' private conversations'
    ]
  },
  {
    icon: Users,
    title: 'Community Standards',
    description: 'Help us maintain a welcoming community for all Kurdish singles worldwide.',
    rules: [
      'One account per person',
      'Must be 18+ to use the platform',
      'No impersonation of others',
      'Report violations when you see them'
    ]
  }
];

const violations = [
  'Harassment or bullying',
  'Hate speech or discrimination',
  'Scams or fraud attempts',
  'Fake profiles or catfishing',
  'Underage users',
  'Violence or threats',
  'Illegal activities',
  'Spam or commercial solicitation'
];

const CommunityGuidelines = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Community Guidelines</h1>
            <p className="text-xs text-muted-foreground">Rules for a safe community</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-2xl mx-auto pb-24">
        {/* Introduction */}
        <Card className="bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/20">
          <CardContent className="p-6">
            <Shield className="h-10 w-10 text-primary mb-3" />
            <h2 className="text-xl font-semibold mb-2">Welcome to KurdMatch</h2>
            <p className="text-muted-foreground">
              Our community guidelines exist to ensure everyone has a safe, respectful, 
              and enjoyable experience. By using KurdMatch, you agree to follow these guidelines.
            </p>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <div className="space-y-4">
          {guidelines.map((guideline, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <guideline.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{guideline.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{guideline.description}</p>
                <ul className="space-y-2">
                  {guideline.rules.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Violations */}
        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <CardTitle className="text-base">Prohibited Behavior</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The following behaviors will result in immediate account suspension or permanent ban:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {violations.map((violation, index) => (
                <div key={index} className="text-sm flex items-center gap-2">
                  <span className="text-destructive">✕</span>
                  {violation}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reporting */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">How to Report</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you encounter any violations, please report them immediately:
            </p>
            <ol className="space-y-2 text-sm">
              <li>1. Open the user's profile</li>
              <li>2. Tap the three dots (...) menu</li>
              <li>3. Select "Report"</li>
              <li>4. Choose a reason and provide details</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              All reports are reviewed within 24 hours. Your identity is kept confidential.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Questions about our guidelines?</p>
          <Button variant="link" onClick={() => navigate('/help-support')}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
