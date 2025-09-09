import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  text: string;
  read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export const sendMessage = async (recipientId: string, text: string): Promise<Message> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: session.user.id,
      recipient_id: recipientId,
      text
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMessages = async (otherUserId: string): Promise<Message[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const userId = session.user.id;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getConversations = async (): Promise<Conversation[]> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const userId = session.user.id;

  // Get all messages involving the current user, with profile info
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey (id, name, profile_image),
      recipient:profiles!messages_recipient_id_fkey (id, name, profile_image)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Group messages by conversation partner and get latest message per conversation
  const conversationMap = new Map<string, Conversation>();

  data?.forEach((message: any) => {
    const isFromMe = message.sender_id === userId;
    const otherUser = isFromMe ? message.recipient : message.sender;
    const conversationId = otherUser.id;

    if (!conversationMap.has(conversationId)) {
      conversationMap.set(conversationId, {
        id: conversationId,
        name: otherUser.name,
        avatar: otherUser.profile_image,
        lastMessage: message.text,
        lastMessageTime: message.created_at,
        unreadCount: 0,
        isOnline: false // We don't have online status tracking yet
      });
    }

    // Count unread messages (messages sent to me that aren't read)
    if (!isFromMe && !message.read) {
      const conversation = conversationMap.get(conversationId)!;
      conversation.unreadCount++;
    }
  });

  return Array.from(conversationMap.values()).sort((a, b) => 
    new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );
};

export const markMessagesAsRead = async (otherUserId: string): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');

  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('sender_id', otherUserId)
    .eq('recipient_id', session.user.id);

  if (error) throw error;
};

export const getMessagesByConversation = getMessages;