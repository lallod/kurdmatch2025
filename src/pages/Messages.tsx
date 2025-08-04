import React, { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, ArrowLeft, Mic, Sparkles, Bell, BellDot, Eye, Heart } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import BottomNavigation from '@/components/BottomNavigation';
import { getConversations, getMessagesByConversation, sendMessage } from '@/api/messages';
import { getNewMatches } from '@/api/matches';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
const Messages = () => {
  const { user } = useSupabaseAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [newMatches, setNewMatches] = useState<any[]>([]);
  const [conversationMessages, setConversationMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, [user]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) return;
      
      try {
        const messages = await getMessagesByConversation(selectedConversation);
        setConversationMessages(messages);
      } catch (error) {
        toast.error('Failed to load conversation');
      }
    };

    loadMessages();
  }, [selectedConversation]);

  // Mock conversations for demo - should be replaced with real data
  const mockConversations = [{
    id: 1,
    name: "Emma Watson",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
    lastMessage: "I'd love to get coffee sometime this week!",
    time: "2 min ago",
    unread: true,
    unreadCount: 3,
    online: true,
    isTyping: false,
    priority: "high",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 1000),
    // 2 minutes ago
    notifications: ["new_message", "online"],
    messages: [{
      id: 1,
      text: "Hey there! How are you doing today?",
      sender: "them",
      time: "10:30 AM"
    }, {
      id: 2,
      text: "I'm doing great, thanks for asking! How about you?",
      sender: "me",
      time: "10:32 AM"
    }, {
      id: 3,
      text: "Pretty good! Just finishing up some work. Are you free this week?",
      sender: "them",
      time: "10:35 AM"
    }, {
      id: 4,
      text: "I'd love to get coffee sometime this week!",
      sender: "them",
      time: "10:36 AM"
    }]
  }, {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&q=80",
    lastMessage: "Thanks for the recommendations, will check them out.",
    time: "Yesterday",
    unread: false,
    unreadCount: 0,
    online: false,
    isTyping: false,
    priority: "normal",
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    // 1 day ago
    notifications: ["viewed_profile"],
    messages: [{
      id: 1,
      text: "Do you have any movie recommendations?",
      sender: "me",
      time: "3:45 PM"
    }, {
      id: 2,
      text: "I would recommend 'The Shawshank Redemption' and 'Inception'",
      sender: "them",
      time: "4:00 PM"
    }, {
      id: 3,
      text: "Thanks for the recommendations, will check them out.",
      sender: "me",
      time: "4:05 PM"
    }]
  }, {
    id: 3,
    name: "Sophia Rodriguez",
    avatar: "https://images.unsplash.com/photo-1518770660439-4636190af44d?auto=format&fit=crop&w=150&q=80",
    lastMessage: "Did you see that new movie we talked about?",
    time: "2 days ago",
    unread: false,
    unreadCount: 0,
    online: true,
    isTyping: true,
    priority: "normal",
    lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    // 2 days ago
    notifications: ["typing", "online"],
    messages: [{
      id: 1,
      text: "Hey! Did you see that new movie we talked about?",
      sender: "them",
      time: "5:20 PM"
    }, {
      id: 2,
      text: "Not yet, is it good?",
      sender: "me",
      time: "6:30 PM"
    }, {
      id: 3,
      text: "It's amazing! You should definitely watch it.",
      sender: "them",
      time: "6:35 PM"
    }]
  }, {
    id: 4,
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80",
    lastMessage: "I'll be in your area next weekend, let's meet up!",
    time: "3 days ago",
    unread: true,
    unreadCount: 1,
    online: false,
    isTyping: false,
    priority: "medium",
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    // 3 days ago
    notifications: ["new_message"],
    messages: [{
      id: 1,
      text: "Hey, how's it going?",
      sender: "them",
      time: "11:00 AM"
    }, {
      id: 2,
      text: "Good! How about you?",
      sender: "me",
      time: "11:15 AM"
    }, {
      id: 3,
      text: "I'll be in your area next weekend, let's meet up!",
      sender: "them",
      time: "11:30 AM"
    }]
  }, {
    id: 5,
    name: "Olivia Parker",
    avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80",
    lastMessage: "Looking forward to our hiking trip next month!",
    time: "1 week ago",
    unread: false,
    unreadCount: 0,
    online: false,
    isTyping: false,
    priority: "low",
    lastMessageTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    // 1 week ago
    notifications: ["liked_photo"],
    messages: [{
      id: 1,
      text: "Have you started planning for the hiking trip?",
      sender: "them",
      time: "9:00 AM"
    }, {
      id: 2,
      text: "Yes! I've got most of the gear we need.",
      sender: "me",
      time: "9:30 AM"
    }, {
      id: 3,
      text: "Great! Looking forward to our hiking trip next month!",
      sender: "them",
      time: "10:00 AM"
    }]
  }];

  // Calculate notification counts - use real data when available, fallback to mock
  const displayConversations = conversations.length > 0 ? conversations : mockConversations;
  const totalUnreadMessages = displayConversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  const newMatchesCount = newMatches.length;
  const onlineCount = displayConversations.filter(conv => conv.online).length;
  const typingCount = displayConversations.filter(conv => conv.isTyping).length;

  // Sort conversations by priority and activity
  const sortedConversations = [...displayConversations].sort((a, b) => {
    const priorityOrder = {
      high: 3,
      medium: 2,
      normal: 1,
      low: 0
    };
    if (a.unread !== b.unread) return b.unread ? 1 : -1;
    if (a.priority !== b.priority) return priorityOrder[b.priority || 'normal'] - priorityOrder[a.priority || 'normal'];
    const aTime = a.lastMessageTime || new Date(a.time);
    const bTime = b.lastMessageTime || new Date(b.time);
    return bTime.getTime() - aTime.getTime();
  });
  const getUrgencyColor = (messageTime: Date) => {
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
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case 'typing':
        return <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />;
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
      await sendMessage(selectedConversation, newMessage);
      setNewMessage('');
      // Reload messages to show the new one
      const messages = await getMessagesByConversation(selectedConversation);
      setConversationMessages(messages);
      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  if (selectedConversation !== null) {
    const conversation = displayConversations.find(c => c.id === selectedConversation);
    if (!conversation) return null;
    return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-32">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
          <div className="flex items-center p-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedConversation(null)} className="mr-2 text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Avatar className="h-10 w-10 mr-3 ring-2 ring-purple-400/30">
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback className="bg-purple-500 text-white">{conversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {conversation.online && <span className="absolute bottom-0 right-2 h-3 w-3 rounded-full bg-green-500 border-2 border-white ring-1 ring-green-400/50"></span>}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-white">{conversation.name}</h2>
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
              {conversation.notifications.includes('online') && <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Online
                </Badge>}
              {conversation.notifications.includes('viewed_profile') && <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  <Eye className="w-3 h-3 mr-1" />
                  Viewed
                </Badge>}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {(conversationMessages.length > 0 ? conversationMessages : conversation.messages || []).map(message => (
              <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[80%] rounded-xl p-3 backdrop-blur-md border
                  ${message.sender === 'me' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400/30' : 'bg-white/10 text-white border-white/20'}
                `}>
                  <p>{message.text}</p>
                  <span className="text-xs opacity-70 block text-right mt-1">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="backdrop-blur-md bg-white/10 border-t border-white/20 p-3 flex items-end gap-2 max-w-4xl mx-auto">
          <Textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} placeholder="Type a message..." className="min-h-[80px] resize-none flex-1 bg-white/10 backdrop-blur border-white/20 text-white placeholder:text-purple-200" />
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0 text-purple-200 hover:text-white hover:bg-white/10">
              <Mic className="h-5 w-5" />
            </Button>
            <Button variant="default" size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <BottomNavigation />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 pb-32">
      {/* Header with Enhanced Notifications */}
      <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <MessageCircle className="w-8 h-8 text-white" />
              {totalUnreadMessages > 0 && <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                  {totalUnreadMessages}
                </div>}
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-purple-200">Connect with your matches</p>
            
            {/* Notification Summary */}
            <div className="flex justify-center gap-4 mt-4">
              {newMatchesCount > 0 && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {newMatchesCount} New Match{newMatchesCount > 1 ? 'es' : ''}
                </Badge>}
              {totalUnreadMessages > 0 && <Badge className={`bg-gradient-to-r ${getUrgencyColor(sortedConversations.find(c => c.unread)?.lastMessageTime || new Date())} text-white`}>
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {totalUnreadMessages} New Message{totalUnreadMessages > 1 ? 's' : ''}
                </Badge>}
              {onlineCount > 0 && <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                  {onlineCount} Online
                </Badge>}
              {typingCount > 0 && <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1 animate-pulse"></div>
                  {typingCount} Typing
                </Badge>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          
          <div className="relative z-10">
            {/* New Matches Section with Enhanced Notifications */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-purple-200">New Matches</h2>
                {newMatchesCount > 0 && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                    {newMatchesCount} New
                  </Badge>}
              </div>
              
              <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                {newMatches.map(match => <CarouselItem key={match.id} className="pl-2 basis-20">
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
                        <span className="text-xs mt-1 text-center w-full truncate text-purple-200">{match.name}</span>
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
              <h2 className="text-xl font-bold text-white">All Conversations</h2>
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
              {sortedConversations.map(conversation => <Card key={conversation.id} className={`overflow-hidden backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl ${conversation.unread ? 'bg-white/15 border-white/30 hover:bg-white/25' : 'bg-white/10 border-white/20 hover:bg-white/20'}`} onClick={() => setSelectedConversation(conversation.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className={`h-12 w-12 ring-2 ${conversation.unread ? 'ring-purple-400/50' : 'ring-purple-400/30'}`}>
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback className="bg-purple-500 text-white">{conversation.name.charAt(0)}</AvatarFallback>
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
                          <h3 className={`font-semibold truncate ${conversation.unread ? 'text-white' : 'text-purple-100'}`}>
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-purple-200">{conversation.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-white' : 'text-purple-200'}`}>
                            {conversation.isTyping ? <span className="italic text-blue-300">typing...</span> : conversation.lastMessage}
                          </p>
                          {/* Activity Notifications */}
                          <div className="flex items-center gap-1 ml-2">
                            {conversation.notifications.map((notification, index) => <div key={index} className="text-purple-300 opacity-70" title={notification.replace('_', ' ').toUpperCase()}>
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
                <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
                <p className="text-purple-200 mb-4">When you match with someone, your conversations will appear here</p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start discovering people
                </Button>
              </div>}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>;
};
export default Messages;