import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Search, Calendar, Archive, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConversationMetadata {
  id: string;
  user1_id: string;
  user2_id: string;
  is_archived: boolean;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

interface MutedConversation {
  id: string;
  user_id: string;
  muted_user_id: string;
  muted_until: string;
  created_at: string;
}

const ConversationsPage = () => {
  const [conversations, setConversations] = useState<ConversationMetadata[]>([]);
  const [mutedConvs, setMutedConvs] = useState<MutedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalConvs, setTotalConvs] = useState(0);
  const [totalMuted, setTotalMuted] = useState(0);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('conversation_metadata')
        .select('*', { count: 'exact' })
        .order('last_message_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setConversations(data || []);
      setTotalConvs(count || 0);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMutedConversations = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('muted_conversations')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMutedConvs(data || []);
      setTotalMuted(count || 0);
    } catch (error) {
      console.error('Error fetching muted conversations:', error);
      toast.error('Failed to load muted conversations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    fetchMutedConversations();
  }, []);

  const filteredConversations = conversations.filter(conv => {
    const search = searchTerm.toLowerCase();
    return conv.user1_id.toLowerCase().includes(search) || conv.user2_id.toLowerCase().includes(search);
  });

  const filteredMuted = mutedConvs.filter(conv => {
    const search = searchTerm.toLowerCase();
    return conv.user_id.toLowerCase().includes(search) || conv.muted_user_id.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Conversations Management</h1>
          <p className="text-white/60 mt-1">View all conversations and muted chats</p>
        </div>
        <Button onClick={() => { fetchConversations(); fetchMutedConversations(); }} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="conversations" className="w-full">
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="conversations" className="data-[state=active]:bg-white/10">
            Conversations ({totalConvs})
          </TabsTrigger>
          <TabsTrigger value="muted" className="data-[state=active]:bg-white/10">
            Muted ({totalMuted})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                All Conversations
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-white/60">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-white/60">No conversations found</div>
              ) : (
                <div className="space-y-3">
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-white font-mono text-sm">{conv.user1_id.substring(0, 8)}...</p>
                            <span className="text-white/40">↔</span>
                            <p className="text-white font-mono text-sm">{conv.user2_id.substring(0, 8)}...</p>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            {conv.is_archived && (
                              <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
                                <Archive className="h-3 w-3 mr-1" />
                                Archived
                              </Badge>
                            )}
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                              <Calendar className="h-3 w-3 mr-1" />
                              Last: {format(new Date(conv.last_message_at), 'MMM d, HH:mm')}
                            </Badge>
                            <span className="text-white/40 text-xs">
                              Created: {format(new Date(conv.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(`/messages`, '_blank')}
                        className="text-white/60 hover:text-white hover:bg-white/5"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="muted">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Archive className="h-5 w-5 text-orange-500" />
                Muted Conversations
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder="Search muted..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-white/60">Loading muted conversations...</div>
              ) : filteredMuted.length === 0 ? (
                <div className="text-center py-8 text-white/60">No muted conversations found</div>
              ) : (
                <div className="space-y-3">
                  {filteredMuted.map((muted) => (
                    <div
                      key={muted.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Archive className="h-5 w-5 text-orange-500" />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-white font-mono text-sm">{muted.user_id.substring(0, 8)}...</p>
                            <span className="text-white/40">muted</span>
                            <p className="text-white font-mono text-sm">{muted.muted_user_id.substring(0, 8)}...</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                              <Calendar className="h-3 w-3 mr-1" />
                              {muted.muted_until ? `Until: ${format(new Date(muted.muted_until), 'MMM d, yyyy')}` : 'Indefinite'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversationsPage;
