import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ImageOff, Users, ChevronDown, ChevronRight, Share2, Lock } from 'lucide-react';
import { useProfileVisibility, PROFILE_FIELDS } from '@/hooks/useProfileVisibility';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const PrivacySettings: React.FC = () => {
  const { visibility, blurPhotos, loading, toggleField, setBlurPhotos } = useProfileVisibility();
  const { subscription } = useSubscription();
  const isPremium = subscription.subscription_type !== 'free';
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Basic Info');
  const [matches, setMatches] = useState<any[]>([]);
  const [sharedWith, setSharedWith] = useState<Record<string, boolean>>({});
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [showSharing, setShowSharing] = useState(false);

  // Group fields by category
  const categories = PROFILE_FIELDS.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof PROFILE_FIELDS>);

  // Load matched users for sharing
  useEffect(() => {
    const loadMatches = async () => {
      setLoadingMatches(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: matchData } = await supabase
          .from('matches')
          .select('user1_id, user2_id')
          .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`)
          .limit(50);

        if (!matchData) return;

        const matchedUserIds = matchData.map(m => 
          m.user1_id === session.user.id ? m.user2_id : m.user1_id
        ).filter(Boolean);

        if (matchedUserIds.length === 0) return;

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, profile_image')
          .in('id', matchedUserIds);

        setMatches(profiles || []);

        // Load existing sharing
        const { data: sharingData } = await supabase
          .from('profile_sharing')
          .select('shared_with_user_id')
          .eq('owner_id', session.user.id);

        const shared: Record<string, boolean> = {};
        sharingData?.forEach(s => { shared[s.shared_with_user_id] = true; });
        setSharedWith(shared);
      } catch (err) {
        console.error('Error loading matches for sharing:', err);
      } finally {
        setLoadingMatches(false);
      }
    };
    if (showSharing) loadMatches();
  }, [showSharing]);

  const toggleShareWithUser = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const isCurrentlyShared = sharedWith[userId];

      if (isCurrentlyShared) {
        await supabase
          .from('profile_sharing')
          .delete()
          .eq('owner_id', session.user.id)
          .eq('shared_with_user_id', userId);
        setSharedWith(prev => ({ ...prev, [userId]: false }));
        toast.success('Sharing removed');
      } else {
        await supabase
          .from('profile_sharing')
          .upsert({
            owner_id: session.user.id,
            shared_with_user_id: userId,
            share_type: 'all',
          }, { onConflict: 'owner_id,shared_with_user_id' });
        setSharedWith(prev => ({ ...prev, [userId]: true }));
        toast.success('Profile shared');
      }
    } catch {
      toast.error('Failed to update sharing');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  const hiddenCount = Object.values(visibility).filter(v => !v).length;

  return (
    <div className="space-y-4">
      {/* Photo Blur Setting */}
      <div className="bg-card rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <ImageOff className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Blur Photos</h3>
              <p className="text-[11px] text-muted-foreground">Hide your face on dating profiles (Muzz-style)</p>
            </div>
          </div>
          <Switch checked={blurPhotos} onCheckedChange={setBlurPhotos} />
        </div>
        {blurPhotos && (
          <div className="mt-3 bg-muted/50 rounded-xl p-3">
            <p className="text-[10px] text-muted-foreground">
              Your photos will appear blurred to other users. You can share clear photos with specific matches below.
            </p>
          </div>
        )}
      </div>

      {/* Field Visibility Controls */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Field Visibility</h3>
                <p className="text-[11px] text-muted-foreground">Control what others see</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isPremium && (
                <Badge className="text-[10px] bg-amber-500/15 text-amber-600 border-amber-500/20 rounded-full flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Premium
                </Badge>
              )}
              {hiddenCount > 0 && isPremium && (
                <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary rounded-full">
                  {hiddenCount} hidden
                </Badge>
              )}
            </div>
          </div>
          {!isPremium && (
            <p className="text-[10px] text-muted-foreground mt-2 ml-[52px]">
              Upgrade to Premium to control which fields are visible on your profile.
            </p>
          )}
        </div>

        {Object.entries(categories).map(([category, fields]) => {
          const isExpanded = expandedCategory === category;
          const hiddenInCategory = fields.filter(f => !visibility[f.key]).length;

          return (
            <div key={category} className="border-b border-border/5 last:border-b-0">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{category}</span>
                  {hiddenInCategory > 0 && isPremium && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 rounded-full border-destructive/30 text-destructive">
                      {hiddenInCategory} hidden
                    </Badge>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 space-y-2">
                  {fields.map(field => (
                    <div key={field.key} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        {visibility[field.key] ? (
                          <Eye className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span className={`text-xs ${visibility[field.key] ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {field.label}
                        </span>
                      </div>
                      <Switch
                        checked={visibility[field.key] ?? true}
                        onCheckedChange={(checked) => {
                          if (!isPremium) {
                            toast.error('Field visibility is a Premium feature', { icon: '⭐' });
                            return;
                          }
                          toggleField(field.key, checked);
                        }}
                        disabled={!isPremium}
                        className="scale-75"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Share With Specific Users */}
      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowSharing(!showSharing)}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Share2 className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-foreground">Share With Matches</h3>
              <p className="text-[11px] text-muted-foreground">
                Share hidden info & clear photos with specific people
              </p>
            </div>
          </div>
          {showSharing ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showSharing && (
          <div className="px-4 pb-4">
            {loadingMatches ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-6">
                <Users className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No matches yet</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Match with people to share your full profile with them
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {matches.map(match => (
                  <div key={match.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={match.profile_image} />
                        <AvatarFallback className="text-xs bg-muted">{match.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground font-medium">{match.name}</span>
                    </div>
                    <Button
                      variant={sharedWith[match.id] ? 'default' : 'outline'}
                      size="sm"
                      className="h-8 rounded-xl text-[11px] px-3"
                      onClick={() => toggleShareWithUser(match.id)}
                    >
                      {sharedWith[match.id] ? 'Shared ✓' : 'Share'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;
