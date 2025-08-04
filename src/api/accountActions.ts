
import { supabase } from '@/integrations/supabase/client';
import { UserDataExport, ConnectedSocialAccount, AccountDeletionRequest } from '@/types/account';

export const downloadUserData = async (): Promise<UserDataExport> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Fetch all user data from existing database tables
  const [profileData, photosData, messagesData, matchesData, likesData] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', session.user.id).single(),
    supabase.from('photos').select('*').eq('profile_id', session.user.id),
    supabase.from('messages').select('*').or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`),
    supabase.from('matches').select('*').or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`),
    supabase.from('likes').select('*').or(`liker_id.eq.${session.user.id},likee_id.eq.${session.user.id}`)
  ]);

  // Get connected social accounts from localStorage as fallback
  const connectedAccounts = getConnectedAccountsFromStorage(session.user.id);

  const exportData: UserDataExport = {
    profile: profileData.data,
    photos: photosData.data || [],
    messages: messagesData.data || [],
    matches: matchesData.data || [],
    likes: likesData.data || [],
    social_accounts: connectedAccounts,
    export_date: new Date().toISOString()
  };

  // User data export completed

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

  // Store in localStorage as fallback until database table is created
  const account: ConnectedSocialAccount = {
    id: `${platform}_${Date.now()}`,
    user_id: session.user.id,
    platform,
    platform_user_id: platformUserId || username,
    username,
    connected_at: new Date().toISOString(),
    is_active: true
  };

  const existingAccounts = getConnectedAccountsFromStorage(session.user.id);
  const updatedAccounts = [...existingAccounts, account];
  
  localStorage.setItem(`social_accounts_${session.user.id}`, JSON.stringify(updatedAccounts));

  console.log('Social account connected:', { platform, username });
  return account;
};

export const disconnectSocialAccount = async (accountId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  // Update localStorage
  const existingAccounts = getConnectedAccountsFromStorage(session.user.id);
  const updatedAccounts = existingAccounts.map(account => 
    account.id === accountId ? { ...account, is_active: false } : account
  );
  
  localStorage.setItem(`social_accounts_${session.user.id}`, JSON.stringify(updatedAccounts));

  console.log('Social account disconnected:', { accountId });
  return { success: true };
};

export const getConnectedAccounts = async (): Promise<ConnectedSocialAccount[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const accounts = getConnectedAccountsFromStorage(session.user.id);
  return accounts.filter(account => account.is_active);
};

// Helper function to get connected accounts from localStorage
const getConnectedAccountsFromStorage = (userId: string): ConnectedSocialAccount[] => {
  try {
    const stored = localStorage.getItem(`social_accounts_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading social accounts from storage:', error);
    return [];
  }
};

export const requestAccountDeletion = async (deletionType: 'deactivate' | 'delete', reason?: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  if (deletionType === 'deactivate') {
    // Store deactivation status in localStorage until database table is created
    const accountStatus = {
      status: 'deactivated',
      requested_at: new Date().toISOString(),
      reason
    };
    
    localStorage.setItem(`account_status_${session.user.id}`, JSON.stringify(accountStatus));

    console.log('Account deactivation requested:', { userId: session.user.id, reason });
    return { type: 'deactivated', success: true };
  } else {
    // Schedule deletion for 30 days
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 30);

    const accountStatus = {
      status: 'deletion_requested',
      requested_at: new Date().toISOString(),
      scheduled_deletion_at: scheduledDate.toISOString(),
      reason
    };
    
    localStorage.setItem(`account_status_${session.user.id}`, JSON.stringify(accountStatus));

    console.log('Account deletion scheduled:', { userId: session.user.id, scheduledDate: scheduledDate.toISOString() });
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

  // Reset account status
  const accountStatus = {
    status: 'active',
    requested_at: null,
    scheduled_deletion_at: null
  };
  
  localStorage.setItem(`account_status_${session.user.id}`, JSON.stringify(accountStatus));

  console.log('Account deletion cancelled:', { userId: session.user.id });
  return { success: true };
};
