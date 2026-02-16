import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Sparkles, BellDot, Eye, Heart, Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { VideoVerifiedBadge } from '@/components/verification/VideoVerifiedBadge';
import { useTranslations } from '@/hooks/useTranslations';

interface ConversationListProps {
  conversations: any[];
  newMatches: any[];
  onSelectConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  newMatches,
  onSelectConversation,
}) => {
  const { t } = useTranslations();

  const totalUnreadMessages = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  const newMatchesCount = newMatches.length;
  const onlineCount = conversations.filter(conv => conv.online).length || 0;

  const sortedConversations = (conversations || []).length > 0 ? [...conversations].sort((a, b) => {
    const priorityOrder: Record<string, number> = { high: 3, medium: 2, normal: 1, low: 0 };
    if ((a.unread ? 1 : 0) !== (b.unread ? 1 : 0)) return (b.unread ? 1 : 0) - (a.unread ? 1 : 0);
    if ((a.priority || 'normal') !== (b.priority || 'normal')) return (priorityOrder[b.priority || 'normal'] - priorityOrder[a.priority || 'normal']);
    const getTime = (conv: any): number => {
      const timeValue = conv.lastMessageTime || conv.time;
      if (!timeValue) return 0;
      const date = typeof timeValue === 'string' ? new Date(timeValue) : timeValue;
      return date instanceof Date && !isNaN(date.getTime()) ? date.getTime() : 0;
    };
    return getTime(b) - getTime(a);
  }) : [];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_message': return <MessageCircle className="w-3 h-3" />;
      case 'online': return <div className="w-2 h-2 rounded-full bg-success" />;
      case 'typing': return <div className="w-2 h-2 rounded-full bg-info animate-pulse" />;
      case 'viewed_profile': return <Eye className="w-3 h-3" />;
      case 'liked_photo': return <Heart className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/10 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground tracking-tight">{t('messages.title', 'Messages')}</h1>
          <div className="flex items-center gap-2">
            {totalUnreadMessages > 0 && (
              <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold rounded-full px-2.5 py-0.5 shadow-lg shadow-primary/30">
                {totalUnreadMessages} new
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* New Matches */}
        {newMatches.length > 0 && (
          <div className="py-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              {t('messages.new_matches', 'New Matches')}
            </h2>
            <Carousel className="w-full">
              <CarouselContent className="-ml-1">
                {(newMatches || []).map(match => (
                  <CarouselItem key={match.id} className="pl-1 basis-[72px]">
                    <div onClick={() => onSelectConversation(match.profileId || match.id)} className="flex flex-col items-center cursor-pointer py-1 group">
                      <div className="relative">
                        <div className={`absolute -inset-[3px] rounded-full bg-gradient-to-br from-primary via-accent to-primary ${match.isNew ? 'animate-[spin_3s_linear_infinite]' : ''}`} />
                        <Avatar className="h-14 w-14 border-[3px] border-background relative z-10 group-active:scale-95 transition-transform">
                          <AvatarImage src={match.avatar} alt={match.name} />
                          <AvatarFallback className="bg-card text-primary text-sm font-bold">{match.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {match.isNew && (
                          <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[8px] rounded-full px-1.5 py-px font-bold z-20 shadow-md">
                            NEW
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] mt-1.5 text-center w-full truncate text-muted-foreground font-medium">{match.name.split(' ')[0]}</span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}

        {/* Priority Conversations */}
        {sortedConversations.some(c => c.priority === 'high' && c.unread) && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2 px-1">
              <BellDot className="w-3.5 h-3.5 text-destructive" />
              <h2 className="text-xs font-semibold text-destructive uppercase tracking-wider">Priority</h2>
            </div>
            <div className="space-y-1.5">
              {sortedConversations.filter(c => c.priority === 'high' && c.unread).map(conversation => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-destructive/10 border border-destructive/20 cursor-pointer active:scale-[0.98] transition-all"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-destructive/40">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback className="bg-card text-primary">{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-background" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate text-sm text-foreground">{conversation.name}</h3>
                      <span className="text-[10px] text-muted-foreground ml-2">{conversation.time}</span>
                    </div>
                    <p className="text-xs truncate text-muted-foreground mt-0.5">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="bg-destructive text-destructive-foreground text-[10px] rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-bold">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between mb-2 mt-2 px-1">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('messages.all_conversations', 'All Conversations')}
          </h2>
          {conversations.filter(c => c.unread).length > 0 && (
            <Badge className="bg-primary/15 text-primary text-[10px] font-medium rounded-full px-2 py-0.5 border-0">
              {conversations.filter(c => c.unread).length} unread
            </Badge>
          )}
        </div>

        {/* Conversation Items */}
        <div className="space-y-0.5">
          {sortedConversations.map(conversation => (
            <div
              key={conversation.id}
              className={`flex items-center gap-3 p-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all duration-200 ${
                conversation.unread
                  ? 'bg-card/80 hover:bg-card'
                  : 'hover:bg-card/50'
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className={`h-13 w-13 ${conversation.unread ? 'ring-2 ring-primary/40' : ''}`} style={{ width: 52, height: 52 }}>
                  <AvatarImage src={conversation.avatar} alt={conversation.name} className="object-cover" />
                  <AvatarFallback className="bg-card text-primary font-semibold">{conversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {conversation.online && (
                  <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full bg-success border-2 border-background" />
                )}
                {conversation.isTyping && (
                  <div className="absolute -top-1 -right-1 bg-info rounded-full p-1 animate-pulse">
                    <div className="flex space-x-0.5">
                      <div className="w-1 h-1 bg-info-foreground rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-info-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1 h-1 bg-info-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className={`truncate text-sm ${conversation.unread ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                      {conversation.name}
                    </h3>
                    {conversation.video_verified && <VideoVerifiedBadge isVerified={true} size="sm" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-2 flex-shrink-0">{conversation.time}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className={`text-[13px] truncate flex-1 ${conversation.unread ? 'text-foreground/90 font-medium' : 'text-muted-foreground'}`}>
                    {conversation.isTyping ? <span className="italic text-primary">typing...</span> : conversation.lastMessage}
                  </p>
                  {(conversation.notifications || []).map((notification: string, index: number) => (
                    <div key={index} className="text-muted-foreground/50 flex-shrink-0" title={notification.replace('_', ' ').toUpperCase()}>
                      {getNotificationIcon(notification)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Unread Badge */}
              {conversation.unread && conversation.unreadCount > 0 && (
                <div className="bg-primary text-primary-foreground text-[10px] rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-bold flex-shrink-0 shadow-md shadow-primary/30">
                  {conversation.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center px-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <MessageCircle className="h-9 w-9 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1.5">{t('messages.no_messages', 'No messages yet')}</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{t('messages.no_messages_desc', 'When you match with someone, your conversations will appear here')}</p>
            <Button className="bg-primary hover:bg-primary/90 rounded-full px-6 h-11 shadow-lg shadow-primary/30">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('messages.start_discovering', 'Start discovering people')}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ConversationList;
