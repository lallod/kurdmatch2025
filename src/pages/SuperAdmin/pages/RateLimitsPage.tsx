import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Clock, Search, Calendar, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface MessageRateLimit {
  id: string;
  user_id: string;
  message_count: number;
  window_start: string;
  created_at: string;
}

const RateLimitsPage = () => {
  const [rateLimits, setRateLimits] = useState<MessageRateLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchRateLimits = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('message_rate_limits')
        .select('*', { count: 'exact' })
        .order('message_count', { ascending: false })
        .limit(100);

      if (error) throw error;
      setRateLimits(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching rate limits:', error);
      toast.error('Failed to load rate limits');
    } finally {
      setLoading(false);
    }
  };

  const resetRateLimit = async (userId: string) => {
    if (!confirm('Are you sure you want to reset this rate limit?')) return;

    try {
      const { error } = await supabase
        .from('message_rate_limits')
        .update({ message_count: 0, window_start: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;
      toast.success('Rate limit reset successfully');
      fetchRateLimits();
    } catch (error) {
      console.error('Error resetting rate limit:', error);
      toast.error('Failed to reset rate limit');
    }
  };

  useEffect(() => {
    fetchRateLimits();
  }, []);

  const filteredRateLimits = rateLimits.filter(limit => {
    const search = searchTerm.toLowerCase();
    return limit.user_id.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Rate Limits Management</h1>
          <p className="text-white/60 mt-1">Monitor and manage message rate limits ({totalCount} users tracked)</p>
        </div>
        <Button onClick={fetchRateLimits} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          Refresh
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Message Rate Limits
          </CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search by user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">Loading rate limits...</div>
          ) : filteredRateLimits.length === 0 ? (
            <div className="text-center py-8 text-white/60">No rate limits found</div>
          ) : (
            <div className="space-y-3">
              {filteredRateLimits.map((limit) => (
                <div
                  key={limit.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      limit.message_count > 50 ? 'bg-red-500/20' : 'bg-orange-500/20'
                    }`}>
                      <Clock className={`h-5 w-5 ${
                        limit.message_count > 50 ? 'text-red-500' : 'text-orange-500'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white font-mono text-sm mb-2">
                        User: {limit.user_id.substring(0, 16)}...
                      </p>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge 
                          variant="outline" 
                          className={limit.message_count > 50 
                            ? 'bg-red-500/10 border-red-500/20 text-red-500'
                            : 'bg-white/5 border-white/10 text-white/60'
                          }
                        >
                          {limit.message_count > 50 && <AlertCircle className="h-3 w-3 mr-1" />}
                          {limit.message_count} messages
                        </Badge>
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                          <Calendar className="h-3 w-3 mr-1" />
                          Window: {format(new Date(limit.window_start), 'MMM d, HH:mm')}
                        </Badge>
                        <span className="text-white/40 text-xs">
                          Tracked since: {format(new Date(limit.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resetRateLimit(limit.user_id)}
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 ml-4"
                  >
                    Reset
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RateLimitsPage;
