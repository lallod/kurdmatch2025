import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, MessageSquare, ChevronDown, ChevronUp, RefreshCw, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface SupportTicket {
  id: string;
  category: string;
  message: string;
  status: string;
  admin_response?: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  user_rating?: number | null;
  user_feedback?: string | null;
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
  const [loading, setLoading] = useState(true);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [ratingTicket, setRatingTicket] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

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
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

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
        .subscribe();

      return () => {
        supabase.removeChannel(ticketChannel);
      };
    }
  }, [user]);

  const handleSubmitRating = async (ticketId: string) => {
    if (selectedRating === 0) return;
    
    setSubmittingRating(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          user_rating: selectedRating,
          user_feedback: feedbackText.trim() || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast({
        title: 'Thank you!',
        description: 'Your feedback helps us improve our support.',
      });
      
      setRatingTicket(null);
      setSelectedRating(0);
      setFeedbackText('');
      fetchTickets();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSubmittingRating(false);
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

  const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            className={`h-5 w-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
          />
        </button>
      ))}
    </div>
  );

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
                <div key={ticket.id} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                    className="w-full p-4 text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {categoryLabels[ticket.category] || ticket.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                          </span>
                          {ticket.admin_response && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-primary">Has response</span>
                            </>
                          )}
                          {ticket.user_rating && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-yellow-500 flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400" /> {ticket.user_rating}
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
                        <div className="bg-background border rounded-lg p-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Your Message:</p>
                          <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(ticket.created_at).toLocaleString()}
                          </p>
                        </div>

                        {ticket.admin_response && (
                          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                            <p className="text-xs font-medium text-primary mb-1">Support Response:</p>
                            <p className="text-sm whitespace-pre-wrap">{ticket.admin_response}</p>
                          </div>
                        )}

                        {/* Rating section for resolved tickets */}
                        {ticket.status === 'resolved' && !ticket.user_rating && (
                          <div className="bg-accent/50 border rounded-lg p-4">
                            {ratingTicket === ticket.id ? (
                              <div className="space-y-3">
                                <p className="text-sm font-medium">How was your support experience?</p>
                                <StarRating rating={selectedRating} onRate={setSelectedRating} interactive />
                                <Textarea
                                  placeholder="Share additional feedback (optional)"
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  className="min-h-[60px]"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSubmitRating(ticket.id)}
                                    disabled={selectedRating === 0 || submittingRating}
                                  >
                                    {submittingRating ? 'Submitting...' : 'Submit Feedback'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setRatingTicket(null);
                                      setSelectedRating(0);
                                      setFeedbackText('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">Was this helpful?</p>
                                <Button size="sm" variant="outline" onClick={() => setRatingTicket(ticket.id)}>
                                  <Star className="h-4 w-4 mr-2" />
                                  Rate Support
                                </Button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Show existing rating */}
                        {ticket.user_rating && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                            <p className="text-xs font-medium text-green-600 mb-2">Your Rating:</p>
                            <StarRating rating={ticket.user_rating} />
                            {ticket.user_feedback && (
                              <p className="text-sm mt-2 text-muted-foreground">{ticket.user_feedback}</p>
                            )}
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
