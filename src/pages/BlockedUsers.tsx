import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserX, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BlockedUser {
  id: string;
  blocked_id: string;
  created_at: string;
  reason?: string;
  blocked_profile: {
    id: string;
    name: string;
    profile_image: string;
    age: number;
  };
}

const BlockedUsers = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);

  useEffect(() => {
    loadBlockedUsers();
  }, [user]);

  const loadBlockedUsers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blocked_users')
        .select(`
          id,
          blocked_id,
          created_at,
          reason,
          blocked_profile:profiles!blocked_users_blocked_id_fkey(
            id,
            name,
            profile_image,
            age
          )
        `)
        .eq('blocker_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlockedUsers(data || []);
    } catch (error) {
      console.error('Error loading blocked users:', error);
      toast.error('Failed to load blocked users');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (blockId: string) => {
    try {
      setUnblockingId(blockId);
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('id', blockId);

      if (error) throw error;

      toast.success('User unblocked successfully');
      loadBlockedUsers();
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error('Failed to unblock user');
    } finally {
      setUnblockingId(null);
      setShowUnblockDialog(false);
      setSelectedUser(null);
    }
  };

  const confirmUnblock = (blockedUser: BlockedUser) => {
    setSelectedUser(blockedUser);
    setShowUnblockDialog(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-accent pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-white" />
              <h1 className="text-2xl font-bold text-white">Blocked Users</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-lg font-semibold mb-2 text-white">No blocked users</h3>
            <p className="text-purple-200">
              You haven't blocked anyone yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-purple-200 text-sm mb-4">
              {blockedUsers.length} user{blockedUsers.length !== 1 ? 's' : ''} blocked
            </p>
            {blockedUsers.map((blockedUser) => (
              <div
                key={blockedUser.id}
                className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={blockedUser.blocked_profile.profile_image}
                        alt={blockedUser.blocked_profile.name}
                      />
                      <AvatarFallback>
                        {blockedUser.blocked_profile.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">
                        {blockedUser.blocked_profile.name}, {blockedUser.blocked_profile.age}
                      </h3>
                      {blockedUser.reason && (
                        <p className="text-sm text-purple-200">
                          Reason: {blockedUser.reason}
                        </p>
                      )}
                      <p className="text-xs text-purple-200">
                        Blocked {new Date(blockedUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => confirmUnblock(blockedUser)}
                    disabled={unblockingId === blockedUser.id}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {unblockingId === blockedUser.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Unblock'
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unblock Confirmation Dialog */}
      <AlertDialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unblock User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unblock {selectedUser?.blocked_profile.name}? They will be
              able to see your profile and interact with you again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && handleUnblock(selectedUser.id)}
            >
              Unblock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlockedUsers;
