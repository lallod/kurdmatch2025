import { useState, useEffect } from 'react';
import { Plane, MapPin, Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

const POPULAR_CITIES = [
  'Hewlêr (Erbil)',
  'Silêmanî (Sulaymaniyah)',
  'Duhok',
  'Kirkuk',
  'Istanbul',
  'London',
  'Berlin',
  'Stockholm',
  'Oslo',
  'Amsterdam',
  'Paris',
  'New York',
  'Toronto',
  'Sydney',
  'Melbourne',
];

export const TravelModeSettings = () => {
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const { hasFeature } = useSubscription();
  const isGold = hasFeature('gold');

  const [isActive, setIsActive] = useState(false);
  const [travelLocation, setTravelLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('travel_mode_active, travel_location')
      .eq('id', user.id)
      .single();

    if (data) {
      setIsActive(data.travel_mode_active || false);
      setTravelLocation(data.travel_location || '');
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!isGold) {
      toast.error(t('toast.travel.gold_feature', 'Gold feature'), { description: t('toast.travel.upgrade_gold', 'Upgrade to Gold to use Travel Mode'), icon: '👑' });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          travel_mode_active: isActive,
          travel_location: isActive ? travelLocation : null,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success(isActive ? 'Travel Mode activated!' : 'Travel Mode deactivated');
    } catch (error) {
      console.error('Error saving travel mode:', error);
      toast.error(t('toast.travel.save_failed', 'Failed to save Travel Mode settings'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (checked: boolean) => {
    if (!isGold) {
      toast.error(t('toast.travel.gold_feature', 'Gold feature'), { description: t('toast.travel.upgrade_gold', 'Upgrade to Gold to use Travel Mode'), icon: '👑' });
      return;
    }
    setIsActive(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Plane className="h-5 w-5 text-primary" />
          Travel Mode
          {!isGold && (
            <span className="text-xs bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Gold
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isGold && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Gold Feature</p>
                <p className="text-xs text-muted-foreground mt-1">Upgrade to Gold to appear in other cities while traveling</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="travel-mode">Enable Travel Mode</Label>
          <Switch
            id="travel-mode"
            checked={isActive}
            onCheckedChange={handleToggle}
            disabled={!isGold}
          />
        </div>

        {isActive && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Select City</Label>
              <Select value={travelLocation} onValueChange={setTravelLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a city..." />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_CITIES.map(city => (
                    <SelectItem key={city} value={city}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {city}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Or enter a custom location</Label>
              <Input
                placeholder="Enter city name..."
                value={travelLocation}
                onChange={(e) => setTravelLocation(e.target.value)}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Your profile will appear to users in this location instead of your home city. Your real location stays private.
            </p>
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={isSaving || !isGold}
          className="w-full"
        >
          {isSaving ? 'Saving...' : 'Save Travel Mode'}
        </Button>
      </CardContent>
    </Card>
  );
};
