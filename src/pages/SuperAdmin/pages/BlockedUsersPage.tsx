import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, Trash2, Search, Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';

interface BlockedUser {
  id: string;
  blocker_id: string;
  blocked_id: string;
  reason: string;
  created_at: string;
}

const BlockedUsersPage = () => {
  const { t } = useTranslations();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchBlockedUsers = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('blocked_users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setBlockedUsers(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      toast.error(t('toast.blocked_load_failed', 'Failed to load blocked users'));
    } finally {
      setLoading(false);
    }
  };

  const unblockUser = async (id: string) => {
    if (!confirm(t('admin.confirm_unblock', 'Are you sure you want to remove this block?'))) return;

    try {
      const { error } = await supabase
        .from('blocked_users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success(t('toast.block_removed', 'Block removed successfully'));
      fetchBlockedUsers();
    } catch (error) {
      console.error('Error removing block:', error);
      toast.error(t('toast.block_remove_failed', 'Failed to remove block'));
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const filteredBlocks = blockedUsers.filter(block => {
    const search = searchTerm.toLowerCase();
    return block.blocker_id.toLowerCase().includes(search) || 
           block.blocked_id.toLowerCase().includes(search) ||
           (block.reason && block.reason.toLowerCase().includes(search));
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.blocked_users_management', 'Blocked Users Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.view_all_blocks', 'View all user blocks ({{count}} total)', { count: totalCount })}</p>
        </div>
        <Button onClick={fetchBlockedUsers} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
          {t('common.refresh', 'Refresh')}
        </Button>
      </div>

      <Card className="bg-[#1a1a1a] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            {t('admin.all_blocked_users', 'All Blocked Users')}
          </CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder={t('admin.search_blocks', 'Search blocks...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-white/60">{t('admin.loading_blocked', 'Loading blocked users...')}</div>
          ) : filteredBlocks.length === 0 ? (
            <div className="text-center py-8 text-white/60">{t('admin.no_blocked_found', 'No blocked users found')}</div>
          ) : (
            <div className="space-y-3">
              {filteredBlocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-start justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mt-1">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <p className="text-white/60 text-sm">{t('admin.blocker', 'Blocker')}</p>
                          <p className="text-white font-mono text-sm">{block.blocker_id.substring(0, 12)}...</p>
                        </div>
                        <Shield className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-white/60 text-sm">{t('admin.blocked', 'Blocked')}</p>
                          <p className="text-white font-mono text-sm">{block.blocked_id.substring(0, 12)}...</p>
                        </div>
                      </div>
                      
                      {block.reason && (
                        <p className="text-white/70 text-sm mb-2 italic">{t('admin.reason_label', 'Reason: {{reason}}', { reason: block.reason })}</p>
                      )}
                      
                      <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(block.created_at), 'MMM d, yyyy HH:mm')}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => unblockUser(block.id)}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10 ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
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

export default BlockedUsersPage;
