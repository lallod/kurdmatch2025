import { supabase } from '@/integrations/supabase/client';

export interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  description: string | null;
  price_coins: number;
  category: string;
  is_premium: boolean;
  active: boolean;
  sort_order: number;
}

export interface SentGift {
  id: string;
  sender_id: string;
  recipient_id: string;
  gift_id: string;
  message: string | null;
  read: boolean;
  created_at: string;
  gift?: VirtualGift;
  sender?: { name: string; photos: { url: string; is_primary: boolean }[] };
}

export interface UserCoins {
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
}

export interface DateProposal {
  id: string;
  proposer_id: string;
  recipient_id: string;
  proposed_date: string;
  location: string | null;
  activity: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  responded_at: string | null;
  created_at: string;
  proposer?: { name: string; photos: { url: string; is_primary: boolean }[] };
  recipient?: { name: string; photos: { url: string; is_primary: boolean }[] };
}

// Virtual Gifts
export const getGiftCatalog = async (): Promise<VirtualGift[]> => {
  const { data, error } = await supabase
    .from('virtual_gifts')
    .select('*')
    .eq('active', true)
    .order('sort_order');
  if (error) throw error;
  return data as VirtualGift[];
};

export const getUserCoins = async (): Promise<UserCoins> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_coins')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  
  if (error) throw error;
  
  if (!data) {
    // Initialize coins for new user via secure RPC
    await supabase.rpc('initialize_user_coins', { p_user_id: user.id });
    
    // Re-fetch
    const { data: newData, error: fetchError } = await supabase
      .from('user_coins')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!newData) throw new Error('Failed to initialize coins');
    return newData as UserCoins;
  }
  return data as UserCoins;
};

export const sendGift = async (senderId: string, recipientId: string, giftId: string, message?: string) => {
  // Get the gift price
  const { data: gift, error: giftError } = await supabase
    .from('virtual_gifts')
    .select('price_coins, name')
    .eq('id', giftId)
    .single();
  if (giftError) throw giftError;

  // Deduct coins via secure RPC
  const { data: success, error: coinsError } = await supabase.rpc('spend_user_coins', {
    p_user_id: senderId,
    p_amount: gift.price_coins
  });
  if (coinsError) throw coinsError;
  if (!success) throw new Error('Not enough coins to send this gift');

  // Send gift
  const { data, error } = await supabase
    .from('sent_gifts')
    .insert({ sender_id: senderId, recipient_id: recipientId, gift_id: giftId, message })
    .select()
    .single();
  if (error) throw error;

  // Create notification
  await supabase.from('notifications').insert({
    user_id: recipientId,
    actor_id: senderId,
    type: 'gift',
    title: 'New Gift!',
    message: `Someone sent you a ${gift.name}!`,
    link: '/gifts',
  });

  return data;
};

export const getReceivedGifts = async (userId: string): Promise<SentGift[]> => {
  const { data, error } = await supabase
    .from('sent_gifts')
    .select('*, gift:virtual_gifts(*), sender:profiles!sent_gifts_sender_id_fkey(name, photos(url, is_primary))')
    .eq('recipient_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as unknown as SentGift[];
};

export const getSentGifts = async (userId: string): Promise<SentGift[]> => {
  const { data, error } = await supabase
    .from('sent_gifts')
    .select('*, gift:virtual_gifts(*)')
    .eq('sender_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as unknown as SentGift[];
};

// Date Proposals
export const createDateProposal = async (
  proposerId: string,
  recipientId: string,
  proposedDate: string,
  activity: string,
  location?: string,
  message?: string
) => {
  const { data, error } = await supabase
    .from('date_proposals')
    .insert({
      proposer_id: proposerId,
      recipient_id: recipientId,
      proposed_date: proposedDate,
      activity,
      location,
      message,
    })
    .select()
    .single();
  if (error) throw error;

  // Notify recipient
  await supabase.from('notifications').insert({
    user_id: recipientId,
    actor_id: proposerId,
    type: 'date_proposal',
    title: 'Date Invitation!',
    message: `Someone invited you to ${activity}!`,
    link: '/dates',
  });

  return data;
};

export const getDateProposals = async (userId: string): Promise<DateProposal[]> => {
  const { data, error } = await supabase
    .from('date_proposals')
    .select('*, proposer:profiles!date_proposals_proposer_id_fkey(name, photos(url, is_primary)), recipient:profiles!date_proposals_recipient_id_fkey(name, photos(url, is_primary))')
    .or(`proposer_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('proposed_date', { ascending: true });
  if (error) throw error;
  return data as unknown as DateProposal[];
};

export const respondToDateProposal = async (proposalId: string, status: 'accepted' | 'declined') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('date_proposals')
    .update({ status, responded_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', proposalId)
    .eq('recipient_id', user.id) // Only recipient can respond
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const cancelDateProposal = async (proposalId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('date_proposals')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', proposalId)
    .eq('proposer_id', user.id) // Only proposer can cancel
    .select()
    .single();
  if (error) throw error;
  return data;
};
