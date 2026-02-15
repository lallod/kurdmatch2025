import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserX, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslations } from '@/hooks/useTranslations';

interface BlockedUser {
  id: string; blocked_id: string; created_at: string; reason?: string;
  blocked_profile: { id: string; name: string; profile_image: string; age: number; };
}

const BlockedUsers = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);

  useEffect(() => { loadBlockedUsers(); }, [user]);

  const loadBlockedUsers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase.from('blocked_users').select(`id, blocked_id, created_at, reason, blocked_profile:profiles!blocked_users_blocked_id_fkey(id, name, profile_image, age)`)
        .eq('blocker_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setBlockedUsers(data || []);
    } catch (error) { console.error('Error:', error); toast.error('Failed to load blocked users'); }
    finally { setLoading(false); }
  };

  const handleUnblock = async (blockId: string) => {
    try {
      setUnblockingId(blockId);
      const { error } = await supabase.from('blocked_users').delete().eq('id', blockId);
      if (error) throw error;
      toast.success('User unblocked');
      loadBlockedUsers();
    } catch (error) { toast.error('Failed to unblock user'); }
    finally { setUnblockingId(null); setShowUnblockDialog(false); setSelectedUser(null); }
  };

  const confirmUnblock = (blockedUser: BlockedUser) => { setSelectedUser(blockedUser); setShowUnblockDialog(true); };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-semibold text-foreground">{t('blocked_users.title', 'Blocked Users')}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="text-center py-16">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
             <h3 className="text-base font-semibold text-foreground mb-1">{t('blocked_users.no_blocked', 'No blocked users')}</h3>
             <p className="text-sm text-muted-foreground">{t('blocked_users.no_blocked_desc', "You haven't blocked anyone yet")}</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              {blockedUsers.length} user{blockedUsers.length !== 1 ? 's' : ''} blocked
            </p>
            {blockedUsers.map(blockedUser => (
              <div key={blockedUser.id} className="flex items-center gap-3 py-3 border-b border-border/10">
                <Avatar className="w-11 h-11">
                  <AvatarImage src={blockedUser.blocked_profile.profile_image} alt={blockedUser.blocked_profile.name} />
                  <AvatarFallback>{blockedUser.blocked_profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">
                    {blockedUser.blocked_profile.name}, {blockedUser.blocked_profile.age}
                  </h3>
                  {blockedUser.reason && <p className="text-xs text-muted-foreground">{blockedUser.reason}</p>}
                  <p className="text-xs text-muted-foreground">Blocked {new Date(blockedUser.created_at).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => confirmUnblock(blockedUser)} disabled={unblockingId === blockedUser.id} className="text-xs">
                  {unblockingId === blockedUser.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Unblock'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unblock {selectedUser?.blocked_profile.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedUser && handleUnblock(selectedUser.id)}>Unblock</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlockedUsers;
