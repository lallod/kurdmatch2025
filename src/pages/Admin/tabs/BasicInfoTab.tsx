
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CircuitBoard, User, CalendarDays, Sparkles, Wand2, Bot, Brain, Lock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const BasicInfoTab = () => {
  const [isSubscriber] = useState(false); // Mock subscription status - set to false by default
  const [birthDate, setBirthDate] = useState<Date>();
  const [isOnline, setIsOnline] = useState(true);

  const calculateAge = (birthDate?: Date): number => {
    if (!birthDate) return 0;
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const PremiumFeatureOverlay = ({ children }: { children: React.ReactNode }) => (
    <div className="relative">
      {children}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-tinder-rose/20 shadow-sm">
          <p className="text-sm font-medium text-tinder-rose flex items-center">
            <Lock size={16} className="mr-2" />
            Premium feature only
          </p>
        </div>
      </div>
    </div>
  );

  const quickDateOptions = [
    { label: "18 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 18)) },
    { label: "21 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 21)) },
    { label: "25 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 25)) },
    { label: "30 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 30)) },
    { label: "35 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 35)) },
    { label: "40 years ago", date: new Date(new Date().setFullYear(new Date().getFullYear() - 40)) },
  ];

  return (
    <Card className="neo-card bg-white/80">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CircuitBoard size={20} className="mr-2 text-tinder-rose" />
          <span>Basic Information</span>
        </CardTitle>
        <CardDescription>Edit the basic profile information. AI will optimize for best matches.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center">
              <User size={14} className="mr-1 text-tinder-rose" />
              Name
            </Label>
            <Input 
              id="name" 
              defaultValue="Sophia" 
              className="neo-border focus-within:neo-glow transition-shadow opacity-70"
              disabled={true}
            />
            <p className="text-xs text-muted-foreground">Name cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="flex items-center">
              <CalendarDays size={14} className="mr-1 text-tinder-rose" />
              Date of Birth
            </Label>
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal neo-border focus-within:neo-glow transition-shadow",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    {birthDate ? format(birthDate, "PPP") : <span>Select date of birth</span>}
                    <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3 border-b">
                    <div className="text-sm font-medium mb-2">Quick select</div>
                    <div className="grid grid-cols-2 gap-1">
                      {quickDateOptions.map((option) => (
                        <Button 
                          key={option.label}
                          variant="outline" 
                          size="sm"
                          className="text-xs h-7" 
                          onClick={() => setBirthDate(option.date)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1950-01-01")
                    }
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
              {birthDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Age: {calculateAge(birthDate)} years
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <User size={14} className="mr-1 text-tinder-rose" />
              Location
            </Label>
            {isSubscriber ? (
              <Input 
                id="location" 
                defaultValue="San Francisco, CA" 
                className="neo-border focus-within:neo-glow transition-shadow" 
              />
            ) : (
              <PremiumFeatureOverlay>
                <Input 
                  id="location" 
                  defaultValue="San Francisco, CA" 
                  className="neo-border opacity-70 cursor-not-allowed" 
                  disabled={true}
                />
              </PremiumFeatureOverlay>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="occupation" className="flex items-center">
              <User size={14} className="mr-1 text-tinder-rose" />
              Occupation
            </Label>
            <Input id="occupation" defaultValue="UX Designer" className="neo-border focus-within:neo-glow transition-shadow" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="flex items-center">
              <User size={14} className="mr-1 text-tinder-rose" />
              Company
            </Label>
            <Input id="company" defaultValue="Design Studio" className="neo-border focus-within:neo-glow transition-shadow" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastActive" className="flex items-center justify-between">
              <div className="flex items-center">
                <User size={14} className="mr-1 text-tinder-rose" />
                Online Status
              </div>
              {isSubscriber ? (
                <Switch 
                  id="lastActive" 
                  checked={isOnline} 
                  onCheckedChange={setIsOnline} 
                  className="data-[state=checked]:bg-tinder-rose"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Badge variant="outline" className="text-xs border-tinder-rose text-tinder-rose cursor-pointer flex items-center gap-1">
                        <Wand2 size={12} />
                        Premium Only
                      </Badge>
                    </DialogTrigger>
                    <DialogContent className="neo-card bg-white/90 backdrop-blur-md">
                      <DialogHeader>
                        <DialogTitle className="ai-text-gradient">AI Premium Feature</DialogTitle>
                        <DialogDescription>
                          Changing your online status is a premium feature available only to subscribers.
                          <div className="mt-4">
                            <Button className="w-full bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90 neo-glow">
                              <Sparkles size={16} className="mr-2" />
                              Upgrade to Premium
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Switch 
                    id="lastActive" 
                    checked={isOnline} 
                    disabled={true}
                    className="data-[state=checked]:bg-gray-400 opacity-70 cursor-not-allowed"
                  />
                </div>
              )}
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              {isOnline ? "Show as online" : "Show as offline"}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="about" className="flex items-center">
              <User size={14} className="mr-1 text-tinder-rose" />
              About
            </Label>
            <div className="flex items-center gap-2">
              <div className="text-xs bg-gradient-to-r from-tinder-rose to-tinder-orange bg-clip-text text-transparent font-medium flex items-center">
                <Sparkles size={14} className="mr-1 text-tinder-orange" />
                AI Generated
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Badge variant="outline" className="text-xs border-tinder-rose text-tinder-rose cursor-pointer flex items-center gap-1">
                    <Wand2 size={12} />
                    Subscribers Only
                  </Badge>
                </DialogTrigger>
                <DialogContent className="neo-card bg-white/90 backdrop-blur-md">
                  <DialogHeader>
                    <DialogTitle className="ai-text-gradient">AI Premium Feature</DialogTitle>
                    <DialogDescription>
                      Editing AI-generated bio content is a premium feature available only to subscribers.
                      {!isSubscriber && (
                        <div className="mt-4">
                          <Button className="w-full bg-gradient-to-r from-tinder-rose to-tinder-orange hover:from-tinder-rose/90 hover:to-tinder-orange/90 neo-glow">
                            <Sparkles size={16} className="mr-2" />
                            Upgrade to Premium
                          </Button>
                        </div>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="relative">
            <Textarea 
              id="about" 
              rows={6} 
              defaultValue="Hi there! I'm Sophia, a UX designer with a passion for creating beautiful and functional digital experiences. When I'm not designing, you'll find me hiking in the mountains, trying new restaurants, or curling up with a good book. I believe in living life to the fullest and finding beauty in the small moments. Looking for someone who shares my sense of adventure and appreciation for both the outdoors and quiet evenings at home." 
              disabled={!isSubscriber}
              className={`neo-border ${!isSubscriber ? "opacity-70 cursor-not-allowed" : "focus-within:neo-glow transition-shadow"}`}
            />
            {!isSubscriber && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-tinder-rose/20 shadow-sm">
                  <p className="text-sm font-medium text-tinder-rose flex items-center">
                    <Bot size={16} className="mr-2" />
                    Subscribe to premium to edit AI-generated content
                  </p>
                </div>
              </div>
            )}
          </div>
          {!isSubscriber && (
            <p className="text-xs text-tinder-rose mt-1 flex items-center">
              <Bot size={12} className="mr-1" />
              Subscribe to premium to edit AI-generated content
            </p>
          )}
        </div>
        <div className="w-full py-2 px-3 rounded-md bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 flex items-center">
          <Brain size={18} className="text-tinder-rose mr-2 animate-pulse" />
          <p className="text-xs text-gray-600">Our AI is analyzing your profile to optimize match potential</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoTab;
