import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, MessageSquare, ChevronDown, ChevronUp, RefreshCw, Send, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface TicketResponse {
  id: string;
  ticket_id: string;
  responder_id: string;
  responder_type: 'admin' | 'user';
  message: string;
  created_at: string;
}

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

const statusConfig = {
  open: { label: 'Open', icon: AlertCircle, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  pending: { label: 'In Progress', icon: Clock, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  resolved: { label: 'Resolved', icon: CheckCircle2, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  closed: { label: 'Closed', icon: CheckCircle2, color: 'bg-muted text-muted-foreground border-muted' }
};

const categoryLabels: Record<string, string> = {
  account: 'Account Issues',
  billing: 'Billing & Payments',
  technical: 'Technical Problems',
  safety: 'Safety Concerns',
  feedback: 'Feedback & Suggestions',
  other: 'Other'
};

const MyTickets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [responses, setResponses] = useState<Record<string, TicketResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);

      // Fetch responses for all tickets
      if (data && data.length > 0) {
        const ticketIds = data.map(t => t.id);
        const { data: responsesData, error: responsesError } = await supabase
          .from('ticket_responses')
          .select('*')
          .in('ticket_id', ticketIds)
          .order('created_at', { ascending: true });

        if (!responsesError && responsesData) {
          const responsesByTicket: Record<string, TicketResponse[]> = {};
          responsesData.forEach(response => {
            if (!responsesByTicket[response.ticket_id]) {
              responsesByTicket[response.ticket_id] = [];
            }
            responsesByTicket[response.ticket_id].push(response as TicketResponse);
          });
          setResponses(responsesByTicket);
        }
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Set up real-time subscription for ticket updates
    if (user) {
      const ticketChannel = supabase
        .channel('user-tickets')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'support_tickets',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchTickets();
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'ticket_responses'
          },
          (payload) => {
            // Check if this response is for one of user's tickets
            const ticketId = payload.new.ticket_id;
            if (tickets.some(t => t.id === ticketId)) {
              fetchTickets();
              toast({
                title: 'New Response',
                description: 'Support team has responded to your ticket',
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(ticketChannel);
      };
    }
  }, [user]);

  const handleSendReply = async (ticketId: string) => {
    const text = replyText[ticketId]?.trim();
    if (!text || !user) return;

    setSendingReply(ticketId);
    try {
      const { error } = await supabase
        .from('ticket_responses')
        .insert({
          ticket_id: ticketId,
          responder_id: user.id,
          responder_type: 'user',
          message: text
        });

      if (error) throw error;

      // Update ticket status to open if it was resolved/closed
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket && ['resolved', 'closed'].includes(ticket.status)) {
        await supabase
          .from('support_tickets')
          .update({ status: 'open', updated_at: new Date().toISOString() })
          .eq('id', ticketId);
      }

      setReplyText(prev => ({ ...prev, [ticketId]: '' }));
      toast({
        title: 'Reply Sent',
        description: 'Your message has been sent to support',
      });
      fetchTickets();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reply. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSendingReply(null);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return ['open', 'pending'].includes(ticket.status);
    return ticket.status === activeFilter;
  });

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`${config.color} gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const hasUnreadResponse = (ticketId: string) => {
    const ticketResponses = responses[ticketId] || [];
    if (ticketResponses.length === 0) return false;
    const lastResponse = ticketResponses[ticketResponses.length - 1];
    return lastResponse.responder_type === 'admin';
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Please log in to view your support tickets</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Support Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              My Support Tickets
            </CardTitle>
            <CardDescription>Track your support requests</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchTickets} title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No support tickets yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Contact support if you need help
            </p>
          </div>
        ) : (
          <>
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-4">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all" className="text-xs">
                  All ({tickets.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="text-xs">
                  Active ({tickets.filter(t => ['open', 'pending'].includes(t.status)).length})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="text-xs">
                  Resolved ({tickets.filter(t => t.status === 'resolved').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className={`border rounded-lg overflow-hidden ${hasUnreadResponse(ticket.id) ? 'border-primary/50 bg-primary/5' : ''}`}
                >
                  <button
                    onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                    className="w-full p-4 text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{ticket.subject}</p>
                          {hasUnreadResponse(ticket.id) && (
                            <Bell className="h-3 w-3 text-primary animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            {categoryLabels[ticket.category] || ticket.category}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                          </span>
                          {(responses[ticket.id]?.length || 0) > 0 && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-primary">
                                {responses[ticket.id].length} {responses[ticket.id].length === 1 ? 'response' : 'responses'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ticket.status)}
                        {expandedTicket === ticket.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>

                  {expandedTicket === ticket.id && (
                    <div className="px-4 pb-4 border-t bg-muted/30">
                      <div className="pt-4 space-y-3">
                        {/* Original message */}
                        <div className="bg-background border rounded-lg p-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Your Original Message:</p>
                          <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(ticket.created_at).toLocaleString()}
                          </p>
                        </div>

                        {/* Conversation thread */}
                        {responses[ticket.id]?.map((response) => (
                          <div
                            key={response.id}
                            className={`rounded-lg p-3 ${
                              response.responder_type === 'admin'
                                ? 'bg-primary/10 border border-primary/20 ml-0 mr-4'
                                : 'bg-secondary/50 border border-secondary ml-4 mr-0'
                            }`}
                          >
                            <p className="text-xs font-medium mb-1">
                              {response.responder_type === 'admin' ? 'Support Team:' : 'You:'}
                            </p>
                            <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(response.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))}

                        {/* Legacy admin_notes support */}
                        {ticket.admin_notes && !responses[ticket.id]?.length && (
                          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                            <p className="text-xs font-medium text-primary mb-1">Support Response:</p>
                            <p className="text-sm whitespace-pre-wrap">{ticket.admin_notes}</p>
                          </div>
                        )}

                        {/* Reply form - only for open/pending tickets */}
                        {['open', 'pending'].includes(ticket.status) && (
                          <div className="pt-2 space-y-2">
                            <Textarea
                              placeholder="Write a reply..."
                              value={replyText[ticket.id] || ''}
                              onChange={(e) => setReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                              className="min-h-[80px]"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSendReply(ticket.id)}
                              disabled={!replyText[ticket.id]?.trim() || sendingReply === ticket.id}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {sendingReply === ticket.id ? 'Sending...' : 'Send Reply'}
                            </Button>
                          </div>
                        )}

                        {/* Reopen option for resolved/closed tickets */}
                        {['resolved', 'closed'].includes(ticket.status) && (
                          <div className="pt-2">
                            <p className="text-xs text-muted-foreground mb-2">
                              Need more help? Send a reply to reopen this ticket.
                            </p>
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Describe what additional help you need..."
                                value={replyText[ticket.id] || ''}
                                onChange={(e) => setReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                                className="min-h-[80px]"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendReply(ticket.id)}
                                disabled={!replyText[ticket.id]?.trim() || sendingReply === ticket.id}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                {sendingReply === ticket.id ? 'Sending...' : 'Reopen & Send'}
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                          <span>Ticket ID: {ticket.id.slice(0, 8)}</span>
                          {ticket.resolved_at && (
                            <span>Resolved: {new Date(ticket.resolved_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MyTickets;
