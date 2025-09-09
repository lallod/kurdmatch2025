import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { getConversations, getMessages, sendMessage, type Conversation as APIConversation, type Message as APIMessage } from '@/api/messages';
import { ArrowLeft, Send, Search } from 'lucide-react';
import { toast } from 'sonner';

type Conversation = APIConversation;
type Message = APIMessage;

const Messages = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedUserId = searchParams.get('user');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedUserId) {
      // If user ID is provided in URL, open that conversation
      const conversation = conversations.find(c => c.id === selectedUserId);
      if (conversation) {
        handleSelectConversation(conversation);
      }
    }
  }, [selectedUserId, conversations]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    try {
      const messagesData = await getMessages(conversation.id);
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !user) return;

    try {
      setSending(true);
      await sendMessage(selectedConversation.id, messageText.trim());
      
      // Add message to local state immediately for better UX
      const newMessage: Message = {
        id: Date.now().toString(),
        sender_id: user.id,
        recipient_id: selectedConversation.id,
        text: messageText.trim(),
        created_at: new Date().toISOString(),
        read: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessageText('');
      
      // Update conversation's last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: messageText.trim(), lastMessageTime: 'Just now' }
          : conv
      ));
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
        <div className="text-white text-xl font-semibold">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 pb-20">
      <div className="h-screen flex flex-col">
        {!selectedConversation ? (
          // Conversations List
          <div className="flex-1 flex flex-col">
            <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
              <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div className="text-white/80">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
                    <p className="text-white/60">Start matching to begin conversations!</p>
                    <Button 
                      onClick={() => navigate('/swipe')} 
                      className="mt-4 bg-pink-600 hover:bg-pink-700"
                    >
                      Start Swiping
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 p-4">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className="flex items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 cursor-pointer transition-colors"
                    >
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={conversation.avatar || undefined} />
                        <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white truncate">{conversation.name}</h3>
                          <span className="text-xs text-white/60">{conversation.lastMessageTime}</span>
                        </div>
                        <p className="text-sm text-white/80 truncate">{conversation.lastMessage}</p>
                      </div>
                      
                      {conversation.unreadCount > 0 && (
                        <div className="bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Chat View
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
                className="text-white hover:bg-white/20 mr-3"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={selectedConversation.avatar || undefined} />
                <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-white">{selectedConversation.name}</h2>
                <p className="text-xs text-white/60">Active now</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender_id === user?.id
                        ? 'bg-pink-600 text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white/10 backdrop-blur-sm border-t border-white/20">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  disabled={sending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sending}
                  size="sm"
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {!selectedConversation && <BottomNavigation />}
    </div>
  );
};

export default Messages;