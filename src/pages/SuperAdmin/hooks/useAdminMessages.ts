import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  text: string;
  read: boolean;
  created_at: string;
  sender?: {
    name: string;
    profile_image: string;
  };
  recipient?: {
    name: string;
    profile_image: string;
  };
}

export const useAdminMessages = () => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMessages = async (page: number = 1, limit: number = 10, searchTerm: string = '', filterStatus: string = 'all') => {
    try {
      setLoading(true);

      // Build query for total count
      let countQuery = supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });

      if (filterStatus === 'read') {
        countQuery = countQuery.eq('read', true);
      } else if (filterStatus === 'unread') {
        countQuery = countQuery.eq('read', false);
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);

      // Build query for messages
      let query = supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          text,
          read,
          created_at,
          sender:profiles!messages_sender_id_fkey(name, profile_image),
          recipient:profiles!messages_recipient_id_fkey(name, profile_image)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (filterStatus === 'read') {
        query = query.eq('read', true);
      } else if (filterStatus === 'unread') {
        query = query.eq('read', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match interface
      const transformedMessages = (data || []).map((msg: any) => ({
        id: msg.id,
        sender_id: msg.sender_id,
        recipient_id: msg.recipient_id,
        text: msg.text,
        read: msg.read,
        created_at: msg.created_at,
        sender: Array.isArray(msg.sender) ? msg.sender[0] : msg.sender,
        recipient: Array.isArray(msg.recipient) ? msg.recipient[0] : msg.recipient,
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    loading,
    totalCount,
    fetchMessages,
    deleteMessage,
  };
};
