
import { supabase } from '@/integrations/supabase/client';
import { UserDataExport, ConnectedSocialAccount, AccountDeletionRequest } from '@/types/account';

export const downloadUserData = async (): Promise<UserDataExport> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Fetch all user data from existing tables
  const [profileData, photosData, messagesData, matchesData, likesData] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
    supabase.from('photos').select('*').eq('profile_id', session.user.id),
    supabase.from('messages').select('*').or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`),
    supabase.from('matches').select('*').or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`),
    supabase.from('likes').select('*').or(`liker_id.eq.${session.user.id},likee_id.eq.${session.user.id}`)
  ]);

  // Get connected accounts from localStorage (since table doesn't exist yet)
  const storedAccounts = localStorage.getItem(`social_accounts_${session.user.id}`);
  const socialAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];

  const exportData: UserDataExport = {
    profile: profileData.data,
    photos: photosData.data || [],
    messages: messagesData.data || [],
    matches: matchesData.data || [],
    likes: likesData.data || [],
    social_accounts: socialAccounts,
    export_date: new Date().toISOString()
  };

  return exportData;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
  return { success: true };
};

export const connectSocialAccount = async (platform: 'instagram' | 'snapchat', username: string, platformUserId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Store in localStorage for now (until we can create the proper table)
  const accountId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newAccount: ConnectedSocialAccount = {
    id: accountId,
    user_id: session.user.id,
    platform,
    platform_user_id: platformUserId,
    username,
    connected_at: new Date().toISOString(),
    is_active: true
  };

  const storedAccounts = localStorage.getItem(`social_accounts_${session.user.id}`);
  const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
  accounts.push(newAccount);
  localStorage.setItem(`social_accounts_${session.user.id}`, JSON.stringify(accounts));

  return newAccount;
};

export const disconnectSocialAccount = async (accountId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Update localStorage
  const storedAccounts = localStorage.getItem(`social_accounts_${session.user.id}`);
  if (storedAccounts) {
    const accounts = JSON.parse(storedAccounts);
    const updatedAccounts = accounts.map((acc: ConnectedSocialAccount) => 
      acc.id === accountId ? { ...acc, is_active: false } : acc
    );
    localStorage.setItem(`social_accounts_${session.user.id}`, JSON.stringify(updatedAccounts));
  }

  return { success: true };
};

export const getConnectedAccounts = async (): Promise<ConnectedSocialAccount[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Get from localStorage for now
  const storedAccounts = localStorage.getItem(`social_accounts_${session.user.id}`);
  const accounts = storedAccounts ? JSON.parse(storedAccounts) : [];
  
  return accounts.filter((acc: ConnectedSocialAccount) => acc.is_active);
};

export const requestAccountDeletion = async (deletionType: 'deactivate' | 'delete', reason?: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  if (deletionType === 'deactivate') {
    // Store deactivation status in localStorage for now
    localStorage.setItem(`account_status_${session.user.id}`, JSON.stringify({
      status: 'deactivated',
      deactivated_at: new Date().toISOString(),
      reason
    }));

    return { type: 'deactivated', success: true };
  } else {
    // Schedule deletion for 30 days
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 30);

    // Store deletion request in localStorage for now
    localStorage.setItem(`account_status_${session.user.id}`, JSON.stringify({
      status: 'deletion_requested',
      deletion_requested_at: new Date().toISOString(),
      scheduled_deletion_at: scheduledDate.toISOString(),
      reason
    }));

    return { 
      type: 'deletion_scheduled', 
      scheduledDate: scheduledDate.toISOString(),
      success: true 
    };
  }
};

export const cancelAccountDeletion = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Reset status in localStorage
  localStorage.setItem(`account_status_${session.user.id}`, JSON.stringify({
    status: 'active',
    deletion_requested_at: null,
    scheduled_deletion_at: null
  }));

  return { success: true };
};
