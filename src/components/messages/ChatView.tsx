import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowLeft, Mic, Eye, MoreVertical, Flag, Ban, Globe, UserX, Phone, Video } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Smile } from 'lucide-react';

import { getMessagesByConversation, sendMessage, markMessagesAsRead } from '@/api/messages';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useMessageModeration } from '@/hooks/useMessageModeration';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { useImageCompression } from '@/hooks/useImageCompression';
import { ReportMessageDialog } from '@/components/chat/ReportMessageDialog';

import { GifPicker } from '@/components/chat/GifPicker';
import { VoiceRecorder } from '@/components/chat/VoiceRecorder';
import { VoicePlayer } from '@/components/chat/VoicePlayer';
import { ImageUploader, ImagePreview } from '@/components/chat/ImageUploader';
import { OnlineStatusDot } from '@/components/shared/OnlineStatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { messageSchema } from '@/utils/validation/messageValidation';
import { useTranslations } from '@/hooks/useTranslations';
import UnmatchDialog from '@/components/messages/UnmatchDialog';
import { AIWingmanPanel } from '@/components/chat/AIWingmanPanel';
import { VideoVerifiedBadge } from '@/components/verification/VideoVerifiedBadge';
import { MatchInsightsHeader } from '@/components/chat/MatchInsightsHeader';
import { IcebreakerSuggestions } from '@/components/chat/IcebreakerSuggestions';
import { ReadReceiptIndicator } from '@/components/chat/ReadReceiptIndicator';
import { getConversations } from '@/api/messages';
import { getNewMatches } from '@/api/matches';

interface ChatViewProps {
  conversation: any;
  onBack: () => void;
  onConversationsRefresh: () => void;
  onInitiateCall: (userId: string, type: 'voice' | 'video') => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  onBack,
  onConversationsRefresh,
  onInitiateCall,
}) => {
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const { compressImageForChat } = useImageCompression();

  const [newMessage, setNewMessage] = useState('');
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  
  const [translatedMessages, setTranslatedMessages] = useState<Record<string, string>>({});
  const [translatingMessages, setTranslatingMessages] = useState<Set<string>>(new Set());
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [unmatchDialogOpen, setUnmatchDialogOpen] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

  const { moderateMessage, isChecking } = useMessageModeration();

  const conversationId = user ? [user.id, conversation.id].sort().join('_') : '';
  const { isOtherUserTyping, startTyping, stopTyping } = useTypingIndicator(conversationId, user?.id || '');

  // Load messages + realtime
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messages = await getMessagesByConversation(conversation.id);
        setConversationMessages(messages);
        await markMessagesAsRead(conversation.id);
      } catch {
        toast.error(t('toast.conversation.load_failed', 'Failed to load conversation'));
      }
    };
    loadMessages();

    if (!user) return;

    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${conversation.id},recipient_id=eq.${user.id}` }, (payload) => {
        setConversationMessages(prev => [...prev, {
          id: payload.new.id, text: payload.new.text, sender: 'them',
          time: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: payload.new.read,
        }]);
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${user.id},recipient_id=eq.${conversation.id}` }, () => {})
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        setConversationMessages(prev => prev.map(msg => msg.id === payload.new.id ? { ...msg, read: payload.new.read } : msg));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversation.id, user]);


  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const validation = messageSchema.safeParse({ text: newMessage, recipientId: conversation.id });
      if (!validation.success) { toast.error(validation.error.errors.map(e => e.message).join(', ')); return; }
      const moderationResult = await moderateMessage(validation.data.text);
      if (!moderationResult.safe) return;
      await sendMessage(conversation.id, validation.data.text);
      setNewMessage('');
      const messages = await getMessagesByConversation(conversation.id);
      setConversationMessages(messages);
      toast.success(t('toast.message.sent', 'Message sent!'));
    } catch (error: any) {
      if (error?.message?.includes('Rate limit exceeded')) {
        toast.error(t('toast.message.rate_limit', "You're sending messages too quickly. Please wait a moment."));
      } else {
        toast.error(t('toast.message.send_failed', 'Failed to send message'));
      }
    }
  };

  const handleSendGif = async (gifUrl: string) => {
    try {
      const { error } = await supabase.from('messages').insert({ sender_id: user?.id, recipient_id: conversation.id, text: 'Sent a GIF', media_type: 'gif', media_url: gifUrl });
      if (error) throw error;
      const messages = await getMessagesByConversation(conversation.id);
      setConversationMessages(messages);
      setShowGifPicker(false);
      toast.success(t('toast.gif.sent', 'GIF sent!'));
    } catch { toast.error(t('toast.gif.send_failed', 'Failed to send GIF')); }
  };

  const handleSendVoice = async (audioBlob: Blob, duration: number) => {
    if (!user) return;
    try {
      const fileName = `${user.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage.from('voice-messages').upload(fileName, audioBlob);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('voice-messages').getPublicUrl(fileName);
      const { error } = await supabase.from('messages').insert({ sender_id: user.id, recipient_id: conversation.id, text: 'Sent a voice message', media_type: 'voice', media_url: publicUrl, media_duration: duration });
      if (error) throw error;
      const messages = await getMessagesByConversation(conversation.id);
      setConversationMessages(messages);
      setShowVoiceRecorder(false);
      toast.success(t('toast.voice.sent', 'Voice message sent!'));
    } catch { toast.error(t('toast.voice.send_failed', 'Failed to send voice message')); }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSendImage = async () => {
    if (!selectedImage || !user) return;
    try {
      toast.info(t('toast.image.compressing', 'Compressing image...'));
      const compressedImage = await compressImageForChat(selectedImage);
      const fileName = `${user.id}/${Date.now()}_${compressedImage.name}`;
      const { error: uploadError } = await supabase.storage.from('chat-images').upload(fileName, compressedImage);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('chat-images').getPublicUrl(fileName);
      const { error } = await supabase.from('messages').insert({ sender_id: user.id, recipient_id: conversation.id, text: 'Sent an image', media_type: 'image', media_url: publicUrl });
      if (error) throw error;
      const messages = await getMessagesByConversation(conversation.id);
      setConversationMessages(messages);
      setSelectedImage(null);
      setImagePreviewUrl(null);
      toast.success(t('toast.image.sent', 'Image sent!'));
    } catch { toast.error(t('toast.image.send_failed', 'Failed to send image')); }
  };

  const handleBlockUser = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.from('blocked_users').insert({ blocker_id: user.id, blocked_id: conversation.id, reason: 'Blocked from conversation' });
      if (error) throw error;
      toast.success(t('toast.user.blocked', 'User blocked successfully'));
      onBack();
      onConversationsRefresh();
    } catch { toast.error(t('toast.user.block_failed', 'Failed to block user')); }
  };

  const handleUnmatch = async () => {
    if (!user) return;
    try {
      const { data: match, error } = await supabase.from('matches').select('id')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${conversation.id}),and(user1_id.eq.${conversation.id},user2_id.eq.${user.id})`)
        .single();
      if (error) { toast.error(t('toast.match.not_found', 'Could not find match')); return; }
      setCurrentMatchId(match.id);
      setUnmatchDialogOpen(true);
    } catch { toast.error(t('toast.match.find_failed', 'Failed to find match')); }
  };

  const handleUnmatchSuccess = () => {
    onBack();
    onConversationsRefresh();
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const handleTranslate = async (messageId: string, text: string, targetLanguage: string) => {
    setTranslatingMessages(prev => new Set(prev).add(messageId));
    try {
      const { data, error } = await supabase.functions.invoke('translate-message', { body: { text, targetLanguage } });
      if (error) {
        if (error.message?.includes('429')) toast.error(t('toast.translate.rate_limit', 'Rate limit reached.'));
        else if (error.message?.includes('402')) toast.error(t('toast.translate.unavailable', 'Service unavailable.'));
        else throw error;
        return;
      }
      if (data?.translatedText) {
        setTranslatedMessages(prev => ({ ...prev, [messageId]: data.translatedText }));
        toast.success(t('toast.translate.complete', 'Translation complete'));
      }
    } catch { toast.error(t('toast.translate.failed', 'Unable to translate message.')); }
    finally {
      setTranslatingMessages(prev => { const s = new Set(prev); s.delete(messageId); return s; });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-24">
        {/* Header */}
        <div className="bg-surface-secondary/80 backdrop-blur-xl shadow-sm border-b border-border/20 sticky top-0 z-10">
          <div className="flex items-center p-3 sm:p-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-1.5 sm:mr-2 text-foreground hover:bg-muted/20 h-9 w-9 sm:h-10 sm:w-10" aria-label="Back to conversations">
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
                <h2 className="text-sm sm:text-base font-semibold text-foreground">{conversation.name}</h2>
                {conversation.video_verified && <VideoVerifiedBadge isVerified={true} size="sm" />}
              </div>
              <p className="text-xs text-muted-foreground">
                {conversation.isTyping ? (
                  <span className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    {t('messages.typing', 'typing...')}
                  </span>
                ) : conversation.online ? t('messages.online', 'Online') : t('messages.offline', 'Offline')}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted/20 h-9 w-9" onClick={() => onInitiateCall(conversation.id, 'voice')} aria-label="Voice call">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted/20 h-9 w-9" onClick={() => onInitiateCall(conversation.id, 'video')} aria-label="Video call">
                <Video className="h-4 w-4" />
              </Button>
              {conversation.notifications?.includes('online') && <Badge className="bg-success/20 text-success border-success/30">Online</Badge>}
              {conversation.notifications?.includes('viewed_profile') && <Badge className="bg-info/20 text-info border-info/30"><Eye className="w-3 h-3 mr-1" />Viewed</Badge>}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted/20" aria-label="More options">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur">
                  <DropdownMenuItem onClick={handleUnmatch}><UserX className="h-4 w-4 mr-2" />{t('messages.unmatch', 'Unmatch')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReportDialogOpen(true)}><Flag className="h-4 w-4 mr-2" />{t('messages.report_conversation', 'Report Conversation')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBlockUser} className="text-destructive"><Ban className="h-4 w-4 mr-2" />{t('messages.block_user', 'Block User')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <MatchInsightsHeader matchedUserId={conversation.id} matchedUserName={conversation.name} />

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {conversationMessages.length === 0 && (
              <IcebreakerSuggestions matchedUserId={conversation.id} onSelectIcebreaker={(text) => setNewMessage(text)} hasMessages={false} />
            )}
            {(conversationMessages.length > 0 ? conversationMessages : conversation.messages || []).map((message: any) => (
              <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} group`}>
                <div className={`max-w-[80%] rounded-2xl p-3 backdrop-blur-md border relative ${message.sender === 'me' ? 'bg-primary text-primary-foreground border-primary/30' : 'bg-card text-card-foreground border-border/20'}`}>
                  {message.sender !== 'me' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity h-6 w-6 text-foreground hover:bg-muted/20">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur">
                        <DropdownMenuItem onClick={() => { setSelectedMessageId(message.id); setReportDialogOpen(true); }}><Flag className="h-4 w-4 mr-2" />{t('chat.report_message', 'Report Message')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTranslate(message.id, message.text, 'en')} disabled={translatingMessages.has(message.id)}><Globe className="h-4 w-4 mr-2" />{translatingMessages.has(message.id) ? t('chat.translating', 'Translating...') : t('chat.translate_english', 'Translate to English')}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTranslate(message.id, message.text, 'no')} disabled={translatingMessages.has(message.id)}><Globe className="h-4 w-4 mr-2" />{t('chat.translate_norwegian', 'Translate to Norwegian')}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  {message.media_type === 'gif' && message.media_url && <img src={message.media_url} alt="GIF" className="rounded-lg max-w-full mb-2" />}
                  {message.media_type === 'image' && message.media_url && <img src={message.media_url} alt="Photo" className="rounded-lg max-w-full mb-2" />}
                  {message.media_type === 'voice' && message.media_url && <div className="mb-2"><VoicePlayer audioUrl={message.media_url} duration={message.media_duration || 0} /></div>}
                  <p className="mb-2">{message.text}</p>
                  {translatedMessages[message.id] && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <span className="text-xs font-medium opacity-70">Translation:</span>
                      <p className="text-sm mt-1">{translatedMessages[message.id]}</p>
                    </div>
                  )}
                  <span className="text-xs opacity-70 flex items-center justify-end gap-1 mt-1">
                    {message.time}
                    {message.sender === 'me' && <ReadReceiptIndicator sent={true} read={message.read} />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="backdrop-blur-md bg-surface-secondary/80 border-t border-border/20 p-3 max-w-4xl mx-auto">
          {isOtherUserTyping && <div className="px-3 py-2 text-sm text-muted-foreground animate-pulse">{conversation?.name} is typing...</div>}
          {showVoiceRecorder ? (
            <VoiceRecorder onSendVoice={handleSendVoice} onCancel={() => setShowVoiceRecorder(false)} />
          ) : (
            <>
              {imagePreviewUrl && <div className="mb-2"><ImagePreview imageUrl={imagePreviewUrl} onRemove={() => { setSelectedImage(null); setImagePreviewUrl(null); }} /></div>}
              <div className="px-3 pb-2">
                <AIWingmanPanel matchedUserId={conversation.id} conversationContext={conversationMessages.slice(-10).map(m => `${m.sender_id === user?.id ? 'You' : 'Them'}: ${m.text}`)} lastReceivedMessage={conversationMessages.filter(m => m.sender_id !== user?.id).slice(-1)[0]?.text} onSelectSuggestion={(message) => setNewMessage(message)} isNewConversation={conversationMessages.length === 0} />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setShowGifPicker(true)} className="flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/20" aria-label="Send a GIF"><Smile className="h-5 w-5" /></Button>
                  <ImageUploader onImageSelect={handleImageSelect} />
                  <Button variant="ghost" size="icon" onClick={() => setShowVoiceRecorder(true)} className="flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/20" aria-label="Record voice message"><Mic className="h-5 w-5" /></Button>
                </div>
                <Textarea value={newMessage} onChange={(e) => { setNewMessage(e.target.value); e.target.value.length > 0 ? startTyping() : stopTyping(); }} onKeyDown={handleKeyPress} onBlur={stopTyping} placeholder={t('messages.type_message', 'Type a message...')} disabled={isChecking} className="min-h-[80px] resize-none flex-1 bg-surface-secondary/80 backdrop-blur border-border/20 text-foreground placeholder:text-muted-foreground rounded-2xl" />
                <div className="flex flex-col gap-2">
                  {selectedImage ? (
                    <Button variant="default" size="icon" onClick={handleSendImage} className="bg-primary hover:bg-primary/90 flex-shrink-0" aria-label="Send image"><Send className="h-5 w-5" /></Button>
                  ) : (
                    <Button variant="default" size="icon" onClick={handleSendMessage} disabled={!newMessage.trim() || isChecking} className="bg-primary hover:bg-primary/90 flex-shrink-0" aria-label="Send message"><Send className="h-5 w-5" /></Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <GifPicker open={showGifPicker} onOpenChange={setShowGifPicker} onSelectGif={handleSendGif} />
      <ReportMessageDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen} messageId={selectedMessageId || ''} reportedUserId={conversation.id} conversationId={conversation.id} />
      {currentMatchId && (
        <UnmatchDialog open={unmatchDialogOpen} onOpenChange={setUnmatchDialogOpen} matchId={currentMatchId} userName={conversation.name || 'this user'} onUnmatchSuccess={handleUnmatchSuccess} />
      )}
    </div>
  );
};

export default ChatView;
