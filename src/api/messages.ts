
import { supabase } from '@/integrations/supabase/client';

export const getConversations = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const userId = session.user.id;
  
  // Get all conversations where the user is either sender or recipient
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      text,
      read,
      created_at,
      sender: sender_id (id, name, profile_image),
      recipient: recipient_id (id, name, profile_image)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Group messages by conversation
  const conversations = data.reduce((acc: any, message: any) => {
    const otherUser = message.sender.id === userId ? message.recipient : message.sender;
    const conversationId = otherUser.id;
    
    if (!acc[conversationId]) {
      acc[conversationId] = {
        id: conversationId,
        name: otherUser.name,
        avatar: otherUser.profile_image,
        lastMessage: message.text,
        time: message.created_at,
        lastMessageTime: new Date(message.created_at),
        unread: message.recipient.id === userId && !message.read,
        unreadCount: 0,
        online: false, // Could be determined by checking last_active
        messages: []
      };
    }
    
    // Track unread count for this conversation
    if (message.recipient.id === userId && !message.read) {
      acc[conversationId].unreadCount = (acc[conversationId].unreadCount || 0) + 1;
    }
    
    acc[conversationId].messages.push({
      id: message.id,
      text: message.text,
      sender: message.sender.id === userId ? 'me' : 'them',
      time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    return acc;
  }, {});
  
  return Object.values(conversations);
};

export const getMessagesByConversation = async (otherUserId: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const userId = session.user.id;
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
    .order('created_at');
  
  if (error) throw error;
  
  return data.map((message: any) => ({
    id: message.id,
    text: message.text,
    sender: message.sender_id === userId ? 'me' : 'them',
    time: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));
};

export const sendMessage = async (recipientId: string, text: string) => {
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

export const markMessageAsRead = async (messageId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
