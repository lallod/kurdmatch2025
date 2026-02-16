import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="bg-background border-b border-border/30 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center justify-between">
          <h1 className="text-base font-semibold text-foreground">{t('messages.title', 'Messages')}</h1>
          <div className="flex items-center gap-2">
            {totalUnreadMessages > 0 && <Badge className="bg-primary/15 text-primary text-xs">{totalUnreadMessages} new</Badge>}
            {onlineCount > 0 && <Badge className="bg-muted text-muted-foreground text-xs">{onlineCount} online</Badge>}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* New Matches */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">{t('messages.new_matches', 'New Matches')}</h2>
            {newMatchesCount > 0 && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                {newMatchesCount} New
              </Badge>
            )}
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2">
              {(newMatches || []).map(match => (
                <CarouselItem key={match.id} className="pl-2 basis-20">
                  <div onClick={() => onSelectConversation(match.profileId || match.id)} className="relative flex flex-col items-center cursor-pointer my-[16px]">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full p-0.5 ${match.isNew ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                        <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900"></div>
                      </div>
                      <Avatar className="h-16 w-16 border-2 border-transparent relative z-10">
                        <AvatarImage src={match.avatar} alt={match.name} />
                        <AvatarFallback className="bg-purple-500 text-white">{match.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {match.isNew && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-bounce">NEW</div>
                      )}
                    </div>
                    <span className="text-xs mt-1 text-center w-full truncate text-muted-foreground">{match.name}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Priority Conversations */}
        {sortedConversations.some(c => c.priority === 'high' && c.unread) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BellDot className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-medium text-red-300">Priority Messages</h2>
            </div>
            <div className="space-y-2">
              {sortedConversations.filter(c => c.priority === 'high' && c.unread).map(conversation => (
                <Card key={conversation.id} className="overflow-hidden backdrop-blur-md bg-red-500/10 border border-red-400/30 hover:bg-red-500/20 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl animate-pulse" onClick={() => onSelectConversation(conversation.id)}>
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
                        <p className="text-sm truncate text-red-200 font-medium">{conversation.lastMessage}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${getUrgencyColor(conversation.lastMessageTime)} animate-pulse`}></div>
                        {conversation.unreadCount > 0 && (
                          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2 py-1 font-bold">{conversation.unreadCount}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Conversations */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{t('messages.all_conversations', 'All Conversations')}</h2>
          <div className="flex gap-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {conversations.filter(c => c.unread).length} unread
            </Badge>
            {onlineCount > 0 && (
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{onlineCount} online</Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {sortedConversations.map(conversation => (
            <Card key={conversation.id} className={`overflow-hidden backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl ${conversation.unread ? 'bg-card/80 border-border/30 hover:bg-card' : 'bg-card/50 border-border/20 hover:bg-card/70'}`} onClick={() => onSelectConversation(conversation.id)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className={`h-12 w-12 ring-2 ${conversation.unread ? 'ring-purple-400/50' : 'ring-purple-400/30'}`}>
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white ring-1 ring-green-400/50"></span>}
                    {conversation.isTyping && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <h3 className={`font-semibold truncate ${conversation.unread ? 'text-foreground' : 'text-foreground/80'}`}>{conversation.name}</h3>
                        {conversation.video_verified && <VideoVerifiedBadge isVerified={true} size="sm" />}
                      </div>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                        {conversation.isTyping ? <span className="italic text-primary/70">typing...</span> : conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-1 ml-2">
                        {(conversation.notifications || []).map((notification: string, index: number) => (
                          <div key={index} className="text-muted-foreground opacity-70" title={notification.replace('_', ' ').toUpperCase()}>
                            {getNotificationIcon(notification)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {conversation.unread && (
                      <>
                        <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${getUrgencyColor(conversation.lastMessageTime)}`}></div>
                        {conversation.unreadCount > 0 && (
                          <div className={`bg-gradient-to-r ${getUrgencyColor(conversation.lastMessageTime)} text-white text-xs rounded-full px-2 py-1 font-bold min-w-[1.5rem] h-6 flex items-center justify-center`}>
                            {conversation.unreadCount}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[40vh] text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('messages.no_messages', 'No messages yet')}</h3>
            <p className="text-muted-foreground mb-4">{t('messages.no_messages_desc', 'When you match with someone, your conversations will appear here')}</p>
            <Button className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-600">
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
