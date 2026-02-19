
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck, UserX, Eye, Clock, Filter, Brain, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVerificationData } from '@/hooks/useVerificationData';
import { useTranslations } from '@/hooks/useTranslations';

const VerificationPage = () => {
  const { t } = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { requests, loading, handleVerificationAction } = useVerificationData();

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) || request.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const verifiedCount = requests.filter(r => r.status === 'verified').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">{t('admin.pending_review', 'Pending Review')}</Badge>;
      case 'verified': return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{t('admin.verified', 'Verified')}</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">{t('admin.rejected', 'Rejected')}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">{t('admin.high', 'High')}</Badge>;
      case 'medium': return <Badge variant="secondary">{t('admin.medium', 'Medium')}</Badge>;
      case 'normal': return <Badge variant="outline">{t('admin.normal', 'Normal')}</Badge>;
      default: return <Badge>{priority}</Badge>;
    }
  };

  const getFilteredRequestsByStatus = (status: string) => {
    if (status === 'flagged') return filteredRequests.filter(r => r.priority === 'high');
    return filteredRequests.filter(r => r.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-tinder-rose" />
          <p className="text-gray-600">{t('admin.loading_verification', 'Loading verification requests...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.user_verification', 'User Verification')}</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Clock size={16} />{t('admin.verification_history', 'History')}</Button>
          <Button className="gap-2"><UserCheck size={16} />{t('admin.verification_settings', 'Verification Settings')}</Button>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">{t('admin.ai_enhanced_verification', 'AI-Enhanced Verification')}</h3>
          <p className="text-sm text-gray-600">{t('admin.ai_verification_desc', 'Our AI system pre-validates documents and flags potential issues for your review')}</p>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">{t('admin.pending_review', 'Pending Review')} ({pendingCount})</TabsTrigger>
          <TabsTrigger value="verified">{t('admin.verified', 'Verified')} ({verifiedCount})</TabsTrigger>
          <TabsTrigger value="rejected">{t('admin.rejected', 'Rejected')} ({rejectedCount})</TabsTrigger>
          <TabsTrigger value="flagged">{t('admin.ai_flagged', 'AI Flagged')} ({requests.filter(r => r.priority === 'high').length})</TabsTrigger>
        </TabsList>

        {['pending', 'verified', 'rejected', 'flagged'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input placeholder={t('admin.search_name_email', 'Search by name or email...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                  </div>
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]"><SelectValue placeholder={t('admin.filter_by_status', 'Filter by status')} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('admin.all_statuses', 'All Statuses')}</SelectItem>
                        <SelectItem value="pending">{t('admin.pending_review', 'Pending')}</SelectItem>
                        <SelectItem value="verified">{t('admin.verified', 'Verified')}</SelectItem>
                        <SelectItem value="rejected">{t('admin.rejected', 'Rejected')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon"><Filter size={16} /></Button>
                  </div>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('common.user', 'User')}</TableHead>
                        <TableHead>{t('admin.document_type', 'Document Type')}</TableHead>
                        <TableHead>{t('admin.submitted', 'Submitted')}</TableHead>
                        <TableHead>{t('common.status', 'Status')}</TableHead>
                        <TableHead>{t('admin.priority', 'Priority')}</TableHead>
                        <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredRequestsByStatus(tabValue).length > 0 ? (
                        getFilteredRequestsByStatus(tabValue).map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="font-medium">{request.userName}</div>
                              <div className="text-sm text-gray-500">{request.email}</div>
                            </TableCell>
                            <TableCell>{request.documentType}</TableCell>
                            <TableCell>{request.submittedDate}</TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm"><Eye size={16} /></Button>
                                {request.status === 'pending' && (
                                  <>
                                    <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300" onClick={() => handleVerificationAction(request.userId, 'verify')}>
                                      <UserCheck size={16} />
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300" onClick={() => handleVerificationAction(request.userId, 'reject')}>
                                      <UserX size={16} />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            {tabValue === 'flagged' 
                              ? t('admin.no_flagged_requests', 'No AI flagged requests found')
                              : t('admin.no_verification_requests', 'No {{status}} verification requests found', { status: tabValue })
                            }
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default VerificationPage;
