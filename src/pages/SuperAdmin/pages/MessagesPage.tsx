import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Trash2, Mail, MailOpen, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useAdminMessages } from '../hooks/useAdminMessages';
import { useToast } from '@/hooks/use-toast';

const MessagesPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedMessage, setSelectedMessage] = React.useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'read' | 'unread'>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const { messages, loading, totalCount, fetchMessages, deleteMessage } = useAdminMessages();
  const { toast } = useToast();

  React.useEffect(() => {
    fetchMessages(currentPage, 10, searchTerm, filterStatus);
  }, [currentPage, filterStatus]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchMessages(1, 10, searchTerm, filterStatus);
  };

  const handleDelete = async (messageId: string) => {
    const success = await deleteMessage(messageId);
    if (success) {
      toast({
        title: "Message deleted",
        description: "The message has been successfully deleted.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    fetchMessages(currentPage, 10, searchTerm, filterStatus);
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.sender?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.text.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className="p-6 space-y-6">
      <Card className="bg-[#141414] border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex justify-between items-center">
            <span>Messages Management</span>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by sender, recipient, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => { setFilterStatus('all'); setCurrentPage(1); }}
                disabled={loading}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'read' ? 'default' : 'outline'}
                onClick={() => { setFilterStatus('read'); setCurrentPage(1); }}
                disabled={loading}
              >
                <MailOpen className="h-4 w-4 mr-2" />
                Read
              </Button>
              <Button
                variant={filterStatus === 'unread' ? 'default' : 'outline'}
                onClick={() => { setFilterStatus('unread'); setCurrentPage(1); }}
                disabled={loading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Unread
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-white/60">Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-white/60">No messages found</div>
          ) : (
            <div className="rounded-md border border-white/5">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-white/5">
                    <TableHead className="text-white/80">Sender</TableHead>
                    <TableHead className="text-white/80">Recipient</TableHead>
                    <TableHead className="text-white/80">Message Preview</TableHead>
                    <TableHead className="text-white/80">Date</TableHead>
                    <TableHead className="text-white/80">Status</TableHead>
                    <TableHead className="text-right text-white/80">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow key={message.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="font-medium text-white">
                        {message.sender?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-white/80">
                        {message.recipient?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-white/60">
                        {message.text}
                      </TableCell>
                      <TableCell className="text-white/60">
                        {format(new Date(message.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={message.read ? "secondary" : "default"}
                          className={message.read ? "bg-white/10 text-white/80" : ""}
                        >
                          {message.read ? 'Read' : 'Unread'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMessage(message);
                              setIsViewDialogOpen(true);
                            }}
                            className="text-white/80 hover:text-white hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(message.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-white/60">
              Showing {filteredMessages.length} of {totalCount} messages (Page {currentPage} of {totalPages})
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-[#141414] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-white/60">From</p>
                <p className="text-white">{selectedMessage.sender?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">To</p>
                <p className="text-white">{selectedMessage.recipient?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Date</p>
                <p className="text-white">
                  {format(new Date(selectedMessage.created_at), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Message</p>
                <p className="mt-2 text-white">{selectedMessage.text}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white/60">Status</p>
                <Badge 
                  variant={selectedMessage.read ? "secondary" : "default"}
                  className={selectedMessage.read ? "bg-white/10 text-white/80" : ""}
                >
                  {selectedMessage.read ? 'Read' : 'Unread'}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesPage;
