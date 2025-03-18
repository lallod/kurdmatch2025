
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from 'lucide-react';

const Messages = () => {
  const conversations = [
    {
      id: 1,
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
      lastMessage: "I'd love to get coffee sometime this week!",
      time: "2 min ago",
      unread: true,
      online: true
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&q=80",
      lastMessage: "Thanks for the recommendations, will check them out.",
      time: "Yesterday",
      unread: false,
      online: false
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80",
      lastMessage: "Did you see that new movie we talked about?",
      time: "2 days ago",
      unread: false,
      online: true
    },
    {
      id: 4,
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80",
      lastMessage: "I'll be in your area next weekend, let's meet up!",
      time: "3 days ago",
      unread: true,
      online: false
    },
    {
      id: 5,
      name: "Olivia Parker",
      avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80",
      lastMessage: "Looking forward to our hiking trip next month!",
      time: "1 week ago",
      unread: false,
      online: false
    }
  ];

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
          <Card key={conversation.id} className="hover:shadow-md transition-shadow">
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
