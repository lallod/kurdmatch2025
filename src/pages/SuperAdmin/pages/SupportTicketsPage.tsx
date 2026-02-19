import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Ticket,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Send,
  Loader2,
} from 'lucide-react';

interface SupportTicket {
  id: string;
  user_id: string | null;
  email: string | null;
  category: string;
  subject: string;
  message: string;
  status: string;
  admin_notes: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
  updated_at: string;
}

const SupportTicketsPage = () => {
  const { t } = useTranslations();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState('');
  const [isSending, setIsSending] = useState(false);
  

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (searchQuery) {
        query = query.or(`subject.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,message.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error(t('admin.failed_fetch_tickets', 'Failed to fetch support tickets'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, categoryFilter]);

  const handleSearch = () => {
    fetchTickets();
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      open: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: <AlertCircle className="h-3 w-3" /> },
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: <Clock className="h-3 w-3" /> },
      resolved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <CheckCircle className="h-3 w-3" /> },
      closed: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: <XCircle className="h-3 w-3" /> },
    };

    const { color, icon } = config[status] || config.open;

    return (
      <Badge variant="outline" className={`${color} flex items-center gap-1`}>
        {icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      technical: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      billing: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      account: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      safety: 'bg-red-500/20 text-red-400 border-red-500/30',
      feedback: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    return (
      <Badge variant="outline" className={colors[category] || colors.other}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get ticket info for notification
      const ticket = tickets.find(t => t.id === ticketId);
      
      const updateData: Record<string, unknown> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === 'resolved' || newStatus === 'closed') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = user?.id;
      }

      const { error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId);

      if (error) throw error;

      // Send notification to user if ticket has user_id
      if (ticket?.user_id) {
        const statusMessages: Record<string, string> = {
          resolved: t('admin.ticket_resolved_msg', 'Your support ticket has been resolved.'),
          closed: t('admin.ticket_closed_msg', 'Your support ticket has been closed.'),
          pending: t('admin.ticket_pending_msg', 'Your support ticket is being reviewed.'),
        };
        
        await supabase.from('notifications').insert({
          user_id: ticket.user_id,
          type: 'support_status',
          title: t('admin.ticket_status_title', 'Ticket {{status}}', { status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) }),
          message: statusMessages[newStatus] || t('admin.ticket_status_updated_msg', 'Your ticket status has been updated to {{status}}.', { status: newStatus }),
          link: '/help-support',
        });
      }

      toast.success(t('admin.ticket_status_updated', 'Ticket status updated to {{status}}', { status: newStatus }));

      fetchTickets();
      
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error(t('admin.failed_update_ticket', 'Failed to update ticket status'));
    }
  };

  const handleSendResponse = async () => {
    if (!selectedTicket || !adminResponse.trim()) return;

    setIsSending(true);
    try {
      const existingNotes = selectedTicket.admin_notes || '';
      const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm');
      const newNote = `[${timestamp}] Admin: ${adminResponse.trim()}`;
      const updatedNotes = existingNotes 
        ? `${existingNotes}\n\n${newNote}` 
        : newNote;

      const { error } = await supabase
        .from('support_tickets')
        .update({
          admin_notes: updatedNotes,
          status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedTicket.id);

      if (error) throw error;

      // Send notification to user if they have a user_id
      if (selectedTicket.user_id) {
        await supabase.from('notifications').insert({
          user_id: selectedTicket.user_id,
          type: 'support_response',
          title: t('admin.support_team_responded', 'Support Team Responded'),
          message: t('admin.ticket_response_msg', 'Your support ticket "{{subject}}" has received a response.', { subject: selectedTicket.subject }),
          link: '/help-support',
        });
      }

      toast.success(t('admin.response_sent', 'Response sent and user notified'));

      setAdminResponse('');
      setSelectedTicket({ ...selectedTicket, admin_notes: updatedNotes, status: 'pending' });
      fetchTickets();
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error(t('admin.failed_send_response', 'Failed to send response'));
    } finally {
      setIsSending(false);
    }
  };

  const openTicketCount = tickets.filter(t => t.status === 'open').length;
  const pendingTicketCount = tickets.filter(t => t.status === 'pending').length;
  const resolvedTicketCount = tickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="h-6 w-6 text-red-500" />
            {t('admin.support_tickets', 'Support Tickets')}
          </h1>
          <p className="text-white/60 mt-1">{t('admin.support_tickets_desc', 'Manage and respond to user support requests')}</p>
        </div>
        <Button
          onClick={fetchTickets}
          variant="outline"
          className="border-white/10 text-white hover:bg-white/5"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {t('admin.refresh', 'Refresh')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{t('admin.total_tickets', 'Total Tickets')}</p>
              <p className="text-2xl font-bold text-white">{tickets.length}</p>
            </div>
            <Ticket className="h-8 w-8 text-white/20" />
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{t('admin.open', 'Open')}</p>
              <p className="text-2xl font-bold text-blue-400">{openTicketCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-500/30" />
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{t('admin.pending', 'Pending')}</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingTicketCount}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500/30" />
          </CardContent>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{t('admin.resolved', 'Resolved')}</p>
              <p className="text-2xl font-bold text-green-400">{resolvedTicketCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500/30" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder={t('admin.search_placeholder_tickets', 'Search by subject, email, or message...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.all_status', 'All Status')}</SelectItem>
                <SelectItem value="open">{t('admin.open', 'Open')}</SelectItem>
                <SelectItem value="pending">{t('admin.pending', 'Pending')}</SelectItem>
                <SelectItem value="resolved">{t('admin.resolved', 'Resolved')}</SelectItem>
                <SelectItem value="closed">{t('admin.close', 'Closed')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.all_categories', 'All Categories')}</SelectItem>
                <SelectItem value="technical">{t('admin.technical', 'Technical')}</SelectItem>
                <SelectItem value="billing">{t('admin.billing', 'Billing')}</SelectItem>
                <SelectItem value="account">{t('admin.account', 'Account')}</SelectItem>
                <SelectItem value="safety">{t('admin.safety', 'Safety')}</SelectItem>
                <SelectItem value="feedback">{t('admin.feedback', 'Feedback')}</SelectItem>
                <SelectItem value="other">{t('admin.other', 'Other')}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="bg-red-500 hover:bg-red-600">
              {t('admin.search', 'Search')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">{t('admin.support_tickets', 'Support Tickets')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-red-500" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('admin.no_tickets_found', 'No support tickets found')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/60">{t('admin.subject', 'Subject')}</TableHead>
                    <TableHead className="text-white/60">{t('admin.email_label', 'Email')}</TableHead>
                    <TableHead className="text-white/60">{t('admin.category', 'Category')}</TableHead>
                    <TableHead className="text-white/60">{t('admin.status', 'Status')}</TableHead>
                    <TableHead className="text-white/60">{t('admin.created', 'Created')}</TableHead>
                    <TableHead className="text-white/60">{t('admin.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white font-medium max-w-xs truncate">
                        {ticket.subject}
                      </TableCell>
                      <TableCell className="text-white/80">
                        {ticket.email || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(ticket.category)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(ticket.status)}
                      </TableCell>
                      <TableCell className="text-white/60">
                        {format(new Date(ticket.created_at), 'dd MMM yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/5"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsDetailOpen(true);
                              setAdminResponse('');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {ticket.status === 'open' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                              onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-red-500" />
              {t('admin.ticket_details', 'Ticket Details')}
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">{t('admin.email_label', 'Email')}</p>
                  <p className="text-white">{selectedTicket.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">{t('admin.category', 'Category')}</p>
                  {getCategoryBadge(selectedTicket.category)}
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">{t('admin.status', 'Status')}</p>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">{t('admin.created', 'Created')}</p>
                  <p className="text-white">{format(new Date(selectedTicket.created_at), 'dd MMM yyyy HH:mm')}</p>
                </div>
              </div>

              {/* Subject & Message */}
              <div>
                <p className="text-white/60 text-sm mb-1">{t('admin.subject', 'Subject')}</p>
                <p className="text-white font-medium">{selectedTicket.subject}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">{t('admin.message_label', 'Message')}</p>
                <div className="bg-white/5 rounded-lg p-4 text-white/90 whitespace-pre-wrap">
                  {selectedTicket.message}
                </div>
              </div>

              {/* Admin Notes */}
              {selectedTicket.admin_notes && (
                <div>
                  <p className="text-white/60 text-sm mb-1">{t('admin.admin_notes', 'Admin Notes / Responses')}</p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-white/90 whitespace-pre-wrap">
                    {selectedTicket.admin_notes}
                  </div>
                </div>
              )}

              {/* Admin Response */}
              <div>
                <p className="text-white/60 text-sm mb-2">{t('admin.add_response', 'Add Response')}</p>
                <Textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder={t('admin.write_response', 'Write your response to the user...')}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px]"
                />
              </div>

              {/* Status Actions */}
              <div className="flex flex-wrap gap-2">
                <p className="text-white/60 text-sm w-full mb-1">{t('admin.change_status', 'Change Status')}</p>
                {['open', 'pending', 'resolved', 'closed'].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={selectedTicket.status === status ? 'default' : 'outline'}
                    className={selectedTicket.status === status 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'border-white/10 text-white hover:bg-white/5'}
                    onClick={() => updateTicketStatus(selectedTicket.id, status)}
                    disabled={selectedTicket.status === status}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailOpen(false)}
              className="border-white/10 text-white hover:bg-white/5"
            >
              {t('admin.close', 'Close')}
            </Button>
            <Button
              onClick={handleSendResponse}
              disabled={isSending || !adminResponse.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {t('admin.send_response', 'Send Response')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportTicketsPage;
