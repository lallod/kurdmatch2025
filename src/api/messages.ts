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

const MAX_MESSAGE_LENGTH = 5000;

export const sendMessage = async (recipientId: string, text: string): Promise<Message> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Input validation
  if (!text || typeof text !== 'string') throw new Error('Message text is required');
  const trimmed = text.trim();
  if (trimmed.length === 0) throw new Error('Message cannot be empty');
  if (trimmed.length > MAX_MESSAGE_LENGTH) throw new Error(`Message exceeds ${MAX_MESSAGE_LENGTH} characters`);
  if (user.id === recipientId) throw new Error('Cannot send message to yourself');

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      text: trimmed
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getMessages = async (otherUserId: string): Promise<Message[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const userId = user.id;

  const { data, error } = await supabase
    .from('messages')
    .select('id, sender_id, recipient_id, text, read, created_at, media_type, media_url, media_duration')
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const getConversations = async (): Promise<Conversation[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const userId = user.id;

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey (id, name, profile_image),
      recipient:profiles!messages_recipient_id_fkey (id, name, profile_image)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) throw error;

  const conversationMap = new Map<string, Conversation>();

  data?.forEach((message: { sender_id: string; recipient_id: string; sender: { id: string; name: string; profile_image: string | null }; recipient: { id: string; name: string; profile_image: string | null }; text: string; created_at: string; read: boolean }) => {
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
        isOnline: false
      });
    }

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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('sender_id', otherUserId)
    .eq('recipient_id', user.id);

  if (error) throw error;
};

export const getMessagesByConversation = getMessages;
