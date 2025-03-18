import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, ArrowLeft, Mic } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const conversations = [
    {
      id: 1,
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
      lastMessage: "I'd love to get coffee sometime this week!",
      time: "2 min ago",
      unread: true,
      online: true,
      messages: [
        { id: 1, text: "Hey there! How are you doing today?", sender: "them", time: "10:30 AM" },
        { id: 2, text: "I'm doing great, thanks for asking! How about you?", sender: "me", time: "10:32 AM" },
        { id: 3, text: "Pretty good! Just finishing up some work. Are you free this week?", sender: "them", time: "10:35 AM" },
        { id: 4, text: "I'd love to get coffee sometime this week!", sender: "them", time: "10:36 AM" },
      ]
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&q=80",
      lastMessage: "Thanks for the recommendations, will check them out.",
      time: "Yesterday",
      unread: false,
      online: false,
      messages: [
        { id: 1, text: "Do you have any movie recommendations?", sender: "me", time: "3:45 PM" },
        { id: 2, text: "I would recommend 'The Shawshank Redemption' and 'Inception'", sender: "them", time: "4:00 PM" },
        { id: 3, text: "Thanks for the recommendations, will check them out.", sender: "me", time: "4:05 PM" },
      ]
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      avatar: "https://images.unsplash.com/photo-1518770660439-4636190af44d?auto=format&fit=crop&w=150&q=80",
      lastMessage: "Did you see that new movie we talked about?",
      time: "2 days ago",
      unread: false,
      online: true,
      messages: [
        { id: 1, text: "Hey! Did you see that new movie we talked about?", sender: "them", time: "5:20 PM" },
        { id: 2, text: "Not yet, is it good?", sender: "me", time: "6:30 PM" },
        { id: 3, text: "It's amazing! You should definitely watch it.", sender: "them", time: "6:35 PM" },
      ]
    },
    {
      id: 4,
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80",
      lastMessage: "I'll be in your area next weekend, let's meet up!",
      time: "3 days ago",
      unread: true,
      online: false,
      messages: [
        { id: 1, text: "Hey, how's it going?", sender: "them", time: "11:00 AM" },
        { id: 2, text: "Good! How about you?", sender: "me", time: "11:15 AM" },
        { id: 3, text: "I'll be in your area next weekend, let's meet up!", sender: "them", time: "11:30 AM" },
      ]
    },
    {
      id: 5,
      name: "Olivia Parker",
      avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80",
      lastMessage: "Looking forward to our hiking trip next month!",
      time: "1 week ago",
      unread: false,
      online: false,
      messages: [
        { id: 1, text: "Have you started planning for the hiking trip?", sender: "them", time: "9:00 AM" },
        { id: 2, text: "Yes! I've got most of the gear we need.", sender: "me", time: "9:30 AM" },
        { id: 3, text: "Great! Looking forward to our hiking trip next month!", sender: "them", time: "10:00 AM" },
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, we would send this message to a server
    console.log("Sending message:", newMessage);
    
    // For demo purposes, we'll just clear the input
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (selectedConversation !== null) {
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return null;

    return (
      <div className="flex flex-col h-screen pb-24">
        {/* Chat header */}
        <div className="flex items-center p-4 border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSelectedConversation(null)} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={conversation.avatar} alt={conversation.name} />
            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{conversation.name}</h2>
            <p className="text-xs text-muted-foreground">
              {conversation.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Chat messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] rounded-xl p-3 
                  ${message.sender === 'me' 
                    ? 'bg-gradient-tinder text-white' 
                    : 'bg-muted'
                  }
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

        {/* Message input */}
        <div className="border-t p-3 flex items-end gap-2">
          <Textarea 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..." 
            className="min-h-[80px] resize-none flex-1"
          />
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Mic className="h-5 w-5" />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-tinder hover:bg-gradient-tinder flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Badge variant="outline" className="bg-tinder-rose/10 text-tinder-rose border-tinder-rose/20">
          {conversations.filter(c => c.unread).length} new
        </Badge>
      </div>

      <div className="space-y-3">
        {conversations.map((conversation) => (
          <Card 
            key={conversation.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedConversation(conversation.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 border border-muted">
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                    <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold truncate">{conversation.name}</h3>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>
                  <p className={`text-sm truncate ${conversation.unread ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && (
                  <div className="ml-2 h-2.5 w-2.5 rounded-full bg-tinder-rose"></div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <MessageCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-1">When you match with someone, your conversations will appear here</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
