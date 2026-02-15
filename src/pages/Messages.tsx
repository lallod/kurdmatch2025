import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, ArrowLeft, Mic, Sparkles, Bell, BellDot, Eye, Heart, MoreVertical, Flag, Ban, Globe, Image as ImageIcon, Smile, UserX } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { getConversations, getMessagesByConversation, sendMessage, markMessagesAsRead } from '@/api/messages';
import { getNewMatches } from '@/api/matches';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useMessageModeration } from '@/hooks/useMessageModeration';
import { useConversationInsights } from '@/hooks/useConversationInsights';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { useImageCompression } from '@/hooks/useImageCompression';
import { useOnlinePresence } from '@/hooks/useOnlinePresence';
import { ReportMessageDialog } from '@/components/chat/ReportMessageDialog';
import { ConversationInsights } from '@/components/chat/ConversationInsights';
import { GifPicker } from '@/components/chat/GifPicker';
import { VoiceRecorder } from '@/components/chat/VoiceRecorder';
import { VoicePlayer } from '@/components/chat/VoicePlayer';
import { ImageUploader, ImagePreview } from '@/components/chat/ImageUploader';
import MessageTranslation from '@/components/chat/MessageTranslation';
import { OnlineStatusBadge, OnlineStatusDot } from '@/components/shared/OnlineStatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { messageSchema } from '@/utils/validation/messageValidation';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import UnmatchDialog from '@/components/messages/UnmatchDialog';
import { AIWingmanPanel } from '@/components/chat/AIWingmanPanel';
import { VideoVerifiedBadge } from '@/components/verification/VideoVerifiedBadge';
import { MatchInsightsHeader } from '@/components/chat/MatchInsightsHeader';
import { IcebreakerSuggestions } from '@/components/chat/IcebreakerSuggestions';
import { ReadReceiptIndicator } from '@/components/chat/ReadReceiptIndicator';

const Messages = () => {
  const { user } = useSupabaseAuth();
  const { compressImageForChat } = useImageCompression();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [newMatches, setNewMatches] = useState<any[]>([]);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  
  // Translation state
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const [translatingMessages, setTranslatingMessages] = useState<Set<string>>(new Set());
  
  // Media state
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  // Unmatch state
  const [unmatchDialogOpen, setUnmatchDialogOpen] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);
  
  const { moderateMessage, isChecking } = useMessageModeration();
  const { insights, isGenerating, generateInsights, fetchStoredInsights } = useConversationInsights();
  
  // Typing indicator for the selected conversation
  const conversationId = selectedConversation && user ? 
    [user.id, selectedConversation].sort().join('_') : '';
  const { isOtherUserTyping, startTyping, stopTyping } = useTypingIndicator(
    conversationId,
    user?.id || ''
  );

  // Load conversations and subscribe to updates
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const [conversationsData, matchesData] = await Promise.all([
          getConversations(),
          getNewMatches(5)
        ]);
        
        setConversations(conversationsData);
        setNewMatches(matchesData);
      } catch (error) {
        toast.error('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    if (!user) return;

    // Subscribe to conversation updates
    const conversationsChannel = supabase
      .channel('conversations-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          // Reload conversations when new messages arrive
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [user]);

  // Auto-open conversation from query param (?user=<id>)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    if (userParam) {
      setSelectedConversation(userParam);
    }
  }, []);

  // Real-time message updates
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        const messages = await getMessagesByConversation(selectedConversation);
        setConversationMessages(messages);
        
        // Mark messages as read when opening conversation
        await markMessagesAsRead(selectedConversation);
      } catch (error) {
        toast.error('Failed to load conversation');
      }
    };

    loadMessages();

    if (!selectedConversation || !user) return;

    // Set up realtime subscription for messages
    const channel = supabase
      .channel(`conversation-${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${selectedConversation},recipient_id=eq.${user.id}`
        },
        (payload) => {
          
          setConversationMessages(prev => [...prev, {
            id: payload.new.id,
            text: payload.new.text,
            sender: 'them',
            time: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: payload.new.read
          }]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id},recipient_id=eq.${selectedConversation}`
        },
        (payload) => {
          
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          
          setConversationMessages(prev => 
            prev.map(msg => msg.id === payload.new.id ? {
              ...msg,
              read: payload.new.read
            } : msg)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation, user]);

  // Calculate notification counts based on real data
  const totalUnreadMessages = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  const newMatchesCount = newMatches.length;
  const onlineCount = conversations.filter(conv => conv.online).length || 0;
  const typingCount = conversations.filter(conv => conv.isTyping).length || 0;

  // Sort conversations by priority and activity with safety check
  const sortedConversations = (conversations || []).length > 0 ? [...conversations].sort((a, b) => {
    const priorityOrder = {
      high: 3,
      medium: 2,
      normal: 1,
      low: 0
    } as Record<string, number>;
    if ((a.unread ? 1 : 0) !== (b.unread ? 1 : 0)) return (b.unread ? 1 : 0) - (a.unread ? 1 : 0);
    if ((a.priority || 'normal') !== (b.priority || 'normal')) return (priorityOrder[b.priority || 'normal'] - priorityOrder[a.priority || 'normal']);
    
    // Safely parse dates with fallback to current time
    const getTime = (conv: any): number => {
      const timeValue = conv.lastMessageTime || conv.time;
      if (!timeValue) return 0;
      const date = typeof timeValue === 'string' ? new Date(timeValue) : timeValue;
      return date instanceof Date && !isNaN(date.getTime()) ? date.getTime() : 0;
    };
    
    return getTime(b) - getTime(a);
  }) : [];

  const getUrgencyColor = (messageTime: Date | undefined) => {
    if (!messageTime || !(messageTime instanceof Date) || isNaN(messageTime.getTime())) {
      return 'from-purple-500 to-pink-500';
    }
    const hoursDiff = (Date.now() - messageTime.getTime()) / (1000 * 60 * 60);
    if (hoursDiff < 1) return 'from-red-500 to-red-600';
    if (hoursDiff < 6) return 'from-orange-500 to-orange-600';
    return 'from-purple-500 to-pink-500';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_message':
        return <MessageCircle className="w-3 h-3" />;
      case 'online':
        return <div className="w-2 h-2 rounded-full bg-success" />;
      case 'typing':
        return <div className="w-2 h-2 rounded-full bg-info animate-pulse" />;
      case 'viewed_profile':
        return <Eye className="w-3 h-3" />;
      case 'liked_photo':
        return <Heart className="w-3 h-3" />;
      default:
        return <Bell className="w-3 h-3" />;
    }
  };
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      // Validate input before sending
      const validation = messageSchema.safeParse({
        text: newMessage,
        recipientId: selectedConversation
      });

      if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(', ');
        toast.error(errors);
        return;
      }
      
      // Moderate the message before sending
      const moderationResult = await moderateMessage(validation.data.text);
      
      if (!moderationResult.safe) {
        // Message was flagged, don't send it
        return;
      }
      
      await sendMessage(selectedConversation, validation.data.text);
      setNewMessage('');
      // Reload messages to show the new one
      const messages = await getMessagesByConversation(selectedConversation);
      setConversationMessages(messages);
      toast.success('Message sent!');
    } catch (error: any) {
      console.error('Send message error:', error);
      
      // Handle rate limiting error
      if (error?.message?.includes('Rate limit exceeded')) {
        toast.error('You\'re sending messages too quickly. Please wait a moment.');
      } else {
        toast.error('Failed to send message');
      }
    }
  };
  
  const handleSendGif = async (gifUrl: string) => {
    if (!selectedConversation) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          recipient_id: selectedConversation,
          text: 'Sent a GIF',
          media_type: 'gif',
          media_url: gifUrl,
        });

      if (error) throw error;

      const messages = await getMessagesByConversation(selectedConversation);
      setConversationMessages(messages);
      setShowGifPicker(false);
      toast.success('GIF sent!');
    } catch (error) {
      console.error('Error sending GIF:', error);
      toast.error('Failed to send GIF');
    }
  };

  const handleSendVoice = async (audioBlob: Blob, duration: number) => {
    if (!selectedConversation || !user) return;

    try {
      // Upload voice message to storage
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage
        .from('voice-messages')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('voice-messages')
        .getPublicUrl(fileName);

      // Save message
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation,
          text: 'Sent a voice message',
          media_type: 'voice',
          media_url: publicUrl,
          media_duration: duration,
        });

      if (error) throw error;

      const messages = await getMessagesByConversation(selectedConversation);
      setConversationMessages(messages);
      setShowVoiceRecorder(false);
      toast.success('Voice message sent!');
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast.error('Failed to send voice message');
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSendImage = async () => {
    if (!selectedImage || !selectedConversation || !user) return;

    try {
      // Compress image before uploading
      toast.info('Compressing image...');
      const compressedImage = await compressImageForChat(selectedImage);
      
      // Upload compressed image to storage
      const fileName = `${user.id}/${Date.now()}_${compressedImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, compressedImage);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      // Save message
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedConversation,
          text: 'Sent an image',
          media_type: 'image',
          media_url: publicUrl,
        });

      if (error) throw error;

      const messages = await getMessagesByConversation(selectedConversation);
      setConversationMessages(messages);
      setSelectedImage(null);
      setImagePreviewUrl(null);
      toast.success('Image sent!');
    } catch (error) {
      console.error('Error sending image:', error);
      toast.error('Failed to send image');
    }
  };
  
  const handleBlockUser = async () => {
    if (!selectedConversation || !user) return;
    
    try {
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: user.id,
          blocked_id: selectedConversation,
          reason: 'Blocked from conversation'
        });
      
      if (error) throw error;
      
      toast.success('User blocked successfully');
      setSelectedConversation(null);
      
      // Refresh conversations
      const conversationsData = await getConversations();
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error('Failed to block user');
    }
  };
  
  const handleUnmatch = async () => {
    if (!selectedConversation || !user) return;
    
    try {
      // Find the match between current user and selected conversation user
      const { data: match, error } = await supabase
        .from('matches')
        .select('id')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${selectedConversation}),and(user1_id.eq.${selectedConversation},user2_id.eq.${user.id})`)
        .single();
      
      if (error) {
        toast.error('Could not find match');
        return;
      }
      
      setCurrentMatchId(match.id);
      setUnmatchDialogOpen(true);
    } catch (error) {
      console.error('Error finding match:', error);
      toast.error('Failed to find match');
    }
  };
  
  const handleUnmatchSuccess = async () => {
    setSelectedConversation(null);
    // Refresh conversations
    const conversationsData = await getConversations();
    setConversations(conversationsData);
    // Refresh matches
    const matchesData = await getNewMatches(5);
    setNewMatches(matchesData);
  };
  
  const handleGenerateInsights = async () => {
    if (!selectedConversation || !user) return;
    
    await generateInsights(user.id, selectedConversation);
    setShowInsights(true);
  };
  
  useEffect(() => {
    const loadInsights = async () => {
      if (!selectedConversation || !user) return;
      await fetchStoredInsights(user.id, selectedConversation);
    };
    
    loadInsights();
  }, [selectedConversation, user]);
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTranslate = async (messageId: string, text: string, targetLanguage: string) => {
    setTranslatingMessages(prev => new Set(prev).add(messageId));
    try {
      const { data, error } = await supabase.functions.invoke('translate-message', {
        body: { text, targetLanguage },
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast.error("Rate limit reached. Please wait a moment before translating again.");
        } else if (error.message?.includes('402')) {
          toast.error("Service unavailable. Translation credits need to be added.");
        } else {
          throw error;
        }
        return;
      }

      if (data?.translatedText) {
        setTranslatedMessages(prev => ({ ...prev, [messageId]: data.translatedText }));
        toast.success("Translation complete");
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error("Unable to translate message. Please try again.");
    } finally {
      setTranslatingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };
  if (selectedConversation !== null) {
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return null;
    return <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {/* Header */}
        <div className="bg-surface-secondary/80 backdrop-blur-xl shadow-sm border-b border-border/20 sticky top-0 z-10">
          <div className="flex items-center p-3 sm:p-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedConversation(null)} className="mr-1.5 sm:mr-2 text-white hover:bg-white/10 h-9 w-9 sm:h-10 sm:w-10">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="relative">
              <Avatar className="h-9 w-9 sm:h-10 sm:w-10 mr-2 sm:mr-3 ring-2 ring-purple-400/30">
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback className="bg-purple-500 text-white text-sm">{conversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <OnlineStatusDot userId={conversation.id} size="md" position="bottom-right" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm sm:text-base font-semibold text-white">{conversation.name}</h2>
                {conversation.video_verified && (
                  <VideoVerifiedBadge isVerified={true} size="sm" />
                )}
              </div>
              <p className="text-xs text-purple-200">
                {conversation.isTyping ? <span className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{
                    animationDelay: '0.1s'
                  }}></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{
                    animationDelay: '0.2s'
                  }}></div>
                    </div>
                    typing...
                  </span> : conversation.online ? 'Online' : 'Offline'}
              </p>
            </div>
            {/* Notification indicators in header */}
            <div className="flex items-center gap-2">
              {conversation.notifications?.includes('online') && <Badge className="bg-success/20 text-success border-success/30">
                  Online
                </Badge>}
              {conversation.notifications?.includes('viewed_profile') && <Badge className="bg-info/20 text-info border-info/30">
                  <Eye className="w-3 h-3 mr-1" />
                  Viewed
                </Badge>}
              
              {/* AI Insights Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerateInsights}
                disabled={isGenerating}
                className="text-purple-200 hover:text-white"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              
              {/* More Options Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur">
                  <DropdownMenuItem onClick={handleUnmatch}>
                    <UserX className="h-4 w-4 mr-2" />
                    Unmatch
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReportDialogOpen(true)}>
                    <Flag className="h-4 w-4 mr-2" />
                    Report Conversation
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBlockUser} className="text-destructive">
                    <Ban className="h-4 w-4 mr-2" />
                    Block User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Match Insights Header */}
        <MatchInsightsHeader 
          matchedUserId={conversation.id}
          matchedUserName={conversation.name}
        />

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* AI Insights */}
            {showInsights && insights && (
              <ConversationInsights
                sharedInterests={insights.sharedInterests}
                suggestedTopics={insights.suggestedTopics}
                conversationSummary={insights.conversationSummary}
                communicationStyle={insights.communicationStyle}
                onRefresh={handleGenerateInsights}
                isLoading={isGenerating}
              />
            )}

            {/* Icebreaker Suggestions for new conversations */}
            {conversationMessages.length === 0 && selectedConversation && (
              <IcebreakerSuggestions
                matchedUserId={selectedConversation}
                onSelectIcebreaker={(text) => setNewMessage(text)}
                hasMessages={conversationMessages.length > 0}
              />
            )}
            
            {/* Messages */}
            {(conversationMessages.length > 0 ? conversationMessages : conversation.messages || []).map(message => (
              <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} group`}>
                <div className={`
                  max-w-[80%] rounded-2xl p-3 backdrop-blur-md border relative
                  ${message.sender === 'me' ? 'bg-primary text-primary-foreground border-primary/30' : 'bg-card text-card-foreground border-border/20'}
                `}>
                  {message.sender !== 'me' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 text-white hover:bg-white/10"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur">
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedMessageId(message.id);
                            setReportDialogOpen(true);
                          }}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Report Message
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleTranslate(message.id, message.text, 'en')}
                          disabled={translatingMessages.has(message.id)}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          {translatingMessages.has(message.id) ? 'Translating...' : 'Translate to English'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleTranslate(message.id, message.text, 'no')}
                          disabled={translatingMessages.has(message.id)}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Translate to Norwegian
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                   )}
                   
                   {/* Media Content */}
                   {message.media_type === 'gif' && message.media_url && (
                     <img
                       src={message.media_url}
                       alt="GIF"
                       className="rounded-lg max-w-full mb-2"
                     />
                   )}
                   
                   {message.media_type === 'image' && message.media_url && (
                     <img
                       src={message.media_url}
                       alt="Image"
                       className="rounded-lg max-w-full mb-2"
                     />
                   )}
                   
                   {message.media_type === 'voice' && message.media_url && (
                     <div className="mb-2">
                       <VoicePlayer
                         audioUrl={message.media_url}
                         duration={message.media_duration || 0}
                       />
                     </div>
                   )}
                   
                   <p className="mb-2">{message.text}</p>
                  
                  {/* Translation Result */}
                  {translatedMessages[message.id] && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <span className="text-xs font-medium opacity-70">Translation:</span>
                      <p className="text-sm mt-1">{translatedMessages[message.id]}</p>
                    </div>
                  )}
                  
                  <span className="text-xs opacity-70 flex items-center justify-end gap-1 mt-1">
                    {message.time}
                    {message.sender === 'me' && (
                      <ReadReceiptIndicator sent={true} read={message.read} />
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-md bg-surface-secondary/80 border-t border-border/20 p-3 max-w-4xl mx-auto">
          {/* Typing Indicator */}
          {isOtherUserTyping && (
            <div className="px-3 py-2 text-sm text-purple-200 animate-pulse">
              {conversation?.name} is typing...
            </div>
          )}
          
          {/* Voice Recorder */}
          {showVoiceRecorder ? (
            <VoiceRecorder
              onSendVoice={handleSendVoice}
              onCancel={() => setShowVoiceRecorder(false)}
            />
          ) : (
            <>
              {/* Image Preview */}
              {imagePreviewUrl && (
                <div className="mb-2">
                  <ImagePreview
                    imageUrl={imagePreviewUrl}
                    onRemove={() => {
                      setSelectedImage(null);
                      setImagePreviewUrl(null);
                    }}
                  />
                </div>
              )}
              
              {/* AI Wingman Panel */}
              <div className="px-3 pb-2">
                <AIWingmanPanel
                  matchedUserId={selectedConversation}
                  conversationContext={conversationMessages.slice(-10).map(m => 
                    `${m.sender_id === user?.id ? 'You' : 'Them'}: ${m.text}`
                  )}
                  lastReceivedMessage={
                    conversationMessages
                      .filter(m => m.sender_id !== user?.id)
                      .slice(-1)[0]?.text
                  }
                  onSelectSuggestion={(message) => setNewMessage(message)}
                  isNewConversation={conversationMessages.length === 0}
                />
              </div>
              
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowGifPicker(true)}
                    className="flex-shrink-0 text-purple-200 hover:text-white hover:bg-white/10"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  
                  <ImageUploader onImageSelect={handleImageSelect} />
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowVoiceRecorder(true)}
                    className="flex-shrink-0 text-purple-200 hover:text-white hover:bg-white/10"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
                
                <Textarea 
                  value={newMessage} 
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    if (e.target.value.length > 0) {
                      startTyping();
                    } else {
                      stopTyping();
                    }
                  }}
                  onKeyDown={handleKeyPress} 
                  onBlur={stopTyping}
                  placeholder="Type a message..." 
                  disabled={isChecking}
                  className="min-h-[80px] resize-none flex-1 bg-surface-secondary/80 backdrop-blur border-border/20 text-foreground placeholder:text-muted-foreground rounded-2xl" 
                />
                
                <div className="flex flex-col gap-2">
                  {selectedImage ? (
                    <Button 
                      variant="default" 
                      size="icon" 
                      onClick={handleSendImage}
                      className="bg-primary hover:bg-primary/90 flex-shrink-0"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="icon" 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim() || isChecking} 
                      className="bg-primary hover:bg-primary/90 flex-shrink-0"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        </div>
        
        {/* GIF Picker Dialog */}
        <GifPicker
          open={showGifPicker}
          onOpenChange={setShowGifPicker}
          onSelectGif={handleSendGif}
        />
        
        {/* Report Dialog */}
        <ReportMessageDialog
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
          messageId={selectedMessageId || ''}
          reportedUserId={selectedConversation || ''}
          conversationId={selectedConversation || ''}
        />
        
        {/* Unmatch Dialog */}
        {currentMatchId && (
          <UnmatchDialog
            open={unmatchDialogOpen}
            onOpenChange={setUnmatchDialogOpen}
            matchId={currentMatchId}
            userName={conversations.find(c => c.id === selectedConversation)?.name || 'this user'}
            onUnmatchSuccess={handleUnmatchSuccess}
          />
        )}

      </div>;
  }
  return <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
      {/* Header with Enhanced Notifications */}
      <div className="bg-background border-b border-border/30 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center justify-between">
          <h1 className="text-base font-semibold text-foreground">Messages</h1>
          <div className="flex items-center gap-2">
            {totalUnreadMessages > 0 && <Badge className="bg-primary/15 text-primary text-xs">{totalUnreadMessages} new</Badge>}
            {onlineCount > 0 && <Badge className="bg-muted text-muted-foreground text-xs">{onlineCount} online</Badge>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto">
        <div>
          <div>
            {/* New Matches Section with Enhanced Notifications */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-muted-foreground">New Matches</h2>
                {newMatchesCount > 0 && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                    {newMatchesCount} New
                  </Badge>}
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                {(newMatches || []).map(match => <CarouselItem key={match.id} className="pl-2 basis-20">
                      <div onClick={() => {
                    setSelectedConversation(match.profileId || match.id);
                  }} className="relative flex flex-col items-center cursor-pointer my-[16px]">
                        <div className="relative">
                          <div className={`absolute inset-0 rounded-full p-0.5 ${match.isNew ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                            <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900"></div>
                          </div>
                          <Avatar className="h-16 w-16 border-2 border-transparent relative z-10">
                            <AvatarImage src={match.avatar} alt={match.name} />
                            <AvatarFallback className="bg-purple-500 text-white">{match.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {match.isNew && <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-bounce">
                              NEW
                            </div>}
                        </div>
                        <span className="text-xs mt-1 text-center w-full truncate text-muted-foreground">{match.name}</span>
                      </div>
                    </CarouselItem>)}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Priority Conversations Section */}
            {sortedConversations.some(c => c.priority === 'high' && c.unread) && <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <BellDot className="w-4 h-4 text-red-400" />
                  <h2 className="text-sm font-medium text-red-300">Priority Messages</h2>
                </div>
                <div className="space-y-2">
                  {sortedConversations.filter(c => c.priority === 'high' && c.unread).map(conversation => <Card key={conversation.id} className="overflow-hidden backdrop-blur-md bg-red-500/10 border border-red-400/30 hover:bg-red-500/20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl animate-pulse" onClick={() => setSelectedConversation(conversation.id)}>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10 ring-2 ring-red-400/50">
                                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                                <AvatarFallback className="bg-purple-500 text-white">{conversation.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {conversation.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white ring-1 ring-green-400/50"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold truncate text-white">{conversation.name}</h3>
                                <span className="text-xs text-red-300">{conversation.time}</span>
                              </div>
                              <p className="text-sm truncate text-red-200 font-medium">
                                {conversation.lastMessage}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${getUrgencyColor(conversation.lastMessageTime)} animate-pulse`}></div>
                              {conversation.unreadCount > 0 && <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2 py-1 font-bold">
                                  {conversation.unreadCount}
                                </div>}
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                </div>
              </div>}

            {/* Active Conversations Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">All Conversations</h2>
              <div className="flex gap-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {conversations.filter(c => c.unread).length} unread
                </Badge>
                {onlineCount > 0 && <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                    {onlineCount} online
                  </Badge>}
              </div>
            </div>

            {/* Enhanced Conversations List */}
            <div className="space-y-3">
              {sortedConversations.map(conversation => <Card key={conversation.id} className={`overflow-hidden backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl ${conversation.unread ? 'bg-card/80 border-border/30 hover:bg-card' : 'bg-card/50 border-border/20 hover:bg-card/70'}`} onClick={() => setSelectedConversation(conversation.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className={`h-12 w-12 ring-2 ${conversation.unread ? 'ring-purple-400/50' : 'ring-purple-400/30'}`}>
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback className="bg-primary text-primary-foreground">{conversation.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {conversation.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white ring-1 ring-green-400/50"></span>}
                        {conversation.isTyping && <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{
                          animationDelay: '0.1s'
                        }}></div>
                              <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{
                          animationDelay: '0.2s'
                        }}></div>
                            </div>
                          </div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <h3 className={`font-semibold truncate ${conversation.unread ? 'text-foreground' : 'text-foreground/80'}`}>
                              {conversation.name}
                            </h3>
                            {conversation.video_verified && (
                              <VideoVerifiedBadge isVerified={true} size="sm" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                          {conversation.isTyping ? <span className="italic text-primary/70">typing...</span> : conversation.lastMessage}
                          </p>
                          {/* Activity Notifications */}
                          <div className="flex items-center gap-1 ml-2">
                            {(conversation.notifications || []).map((notification, index) => <div key={index} className="text-muted-foreground opacity-70" title={notification.replace('_', ' ').toUpperCase()}>
                                {getNotificationIcon(notification)}
                              </div>)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {conversation.unread && <>
                            <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${getUrgencyColor(conversation.lastMessageTime)}`}></div>
                            {conversation.unreadCount > 0 && <div className={`bg-gradient-to-r ${getUrgencyColor(conversation.lastMessageTime)} text-white text-xs rounded-full px-2 py-1 font-bold min-w-[1.5rem] h-6 flex items-center justify-center`}>
                                {conversation.unreadCount}
                              </div>}
                          </>}
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>

            {/* Empty State */}
            {conversations.length === 0 && <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No messages yet</h3>
                <p className="text-muted-foreground mb-4">When you match with someone, your conversations will appear here</p>
                <Button className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start discovering people
                </Button>
              </div>}
          </div>
        </div>
      </div>
      </div>

      
    </div>;
};
export default Messages;