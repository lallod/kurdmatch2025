import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarHeart, Search, Calendar, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';
import { executeAdminAction } from '@/utils/admin/auditLogger';

const DateProposalsPage = () => {
  const { t } = useTranslations();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('date_proposals')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setProposals(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching date proposals:', error);
      toast.error(t('toast.proposals_load_failed', 'Failed to load date proposals'));
    } finally {
      setLoading(false);
    }
  };

  const cancelProposal = async (id: string) => {
    if (!confirm(t('admin.confirm_cancel_proposal', 'Are you sure you want to cancel this proposal?'))) return;
    try {
      await executeAdminAction({ action: 'update_record', table: 'date_proposals', recordId: id, data: { status: 'cancelled' } });
      toast.success(t('toast.proposal_cancelled', 'Proposal cancelled'));
      fetchProposals();
    } catch (error) {
      console.error('Error cancelling proposal:', error);
      toast.error(t('toast.proposal_cancel_failed', 'Failed to cancel proposal'));
    }
  };

  useEffect(() => { fetchProposals(); }, []);

  const filtered = proposals.filter(p => {
    const search = searchTerm.toLowerCase();
    return p.activity?.toLowerCase().includes(search) || p.status?.toLowerCase().includes(search) || p.proposer_id?.toLowerCase().includes(search);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'rejected': case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.date_proposals_management', 'Date Proposals Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.view_all_proposals', 'View all proposals ({{count}} total)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchProposals} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">{t('common.refresh', 'Refresh')}</Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CalendarHeart className="h-5 w-5 text-pink-500" />
            {t('admin.all_proposals', 'All Date Proposals')}
          </CardTitle>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input placeholder={t('admin.search_proposals', 'Search proposals...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading', 'Loading...')}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_proposals_found', 'No date proposals found')}</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((proposal) => (
                <div key={proposal.id} className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <CalendarHeart className="h-5 w-5 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{proposal.activity}</p>
                      {proposal.location && <p className="text-white/60 text-sm">{proposal.location}</p>}
                      {proposal.message && <p className="text-white/50 text-sm italic mt-1">"{proposal.message}"</p>}
                      <div className="flex gap-2 flex-wrap mt-2">
                        <Badge variant="outline" className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          {proposal.proposed_date ? format(new Date(proposal.proposed_date), 'MMM d, yyyy') : 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {proposal.status === 'pending' && (
                    <Button variant="ghost" size="sm" onClick={() => cancelProposal(proposal.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 ml-4">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DateProposalsPage;
