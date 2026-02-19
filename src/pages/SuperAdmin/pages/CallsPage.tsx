import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Phone, Search, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';

const CallsPage = () => {
  const { t } = useTranslations();
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('calls')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setCalls(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching calls:', error);
      toast.error(t('toast.calls_load_failed', 'Failed to load calls'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCalls(); }, []);

  const filtered = calls.filter(c => {
    const search = searchTerm.toLowerCase();
    return c.caller_id?.toLowerCase().includes(search) ||
           c.callee_id?.toLowerCase().includes(search) ||
           c.call_type?.toLowerCase().includes(search) ||
           c.status?.toLowerCase().includes(search);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'missed': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'ongoing': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-white/60 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.calls_management', 'Calls Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.view_all_calls', 'View all calls ({{count}} total)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchCalls} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          {t('common.refresh', 'Refresh')}
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-500" />
            {t('admin.all_calls', 'All Calls')}
          </CardTitle>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input placeholder={t('admin.search_calls', 'Search calls...')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading', 'Loading...')}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_calls_found', 'No calls found')}</div>
          ) : (
            <div className="space-y-3">
              {filtered.map((call) => (
                <div key={call.id} className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-mono text-sm">{call.caller_id?.substring(0, 12)}...</span>
                        <span className="text-white/40">→</span>
                        <span className="text-white font-mono text-sm">{call.callee_id?.substring(0, 12)}...</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className={getStatusColor(call.status)}>{call.status}</Badge>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">{call.call_type}</Badge>
                        {call.duration_seconds && (
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                            <Clock className="h-3 w-3 mr-1" />{call.duration_seconds}s
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          {call.created_at ? format(new Date(call.created_at), 'MMM d, yyyy HH:mm') : 'N/A'}
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
    </div>
  );
};

export default CallsPage;
