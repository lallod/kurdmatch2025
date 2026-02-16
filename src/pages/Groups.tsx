import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface Group {
  id: string;
  name: string;
  description: string;
  cover_image: string | null;
  icon: string | null;
  category: string;
  privacy: string;
  member_count: number;
  post_count: number;
  created_at: string;
}

const Groups = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslations();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('groups')
        .select('*')
        .eq('privacy', 'public')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Slim header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="max-w-lg mx-auto px-4 h-11 flex items-center justify-between">
           <h1 className="text-base font-semibold text-foreground">{t('groups.title', 'Groups')}</h1>
           <Button onClick={() => navigate('/groups/create')} size="sm" variant="ghost" className="gap-1 text-sm">
             <Plus className="w-4 h-4" />
             {t('groups.create', 'Create')}
           </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('groups.search', 'Search groups...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted border-border/30 h-9"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading groups...</div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">
              {searchTerm ? t('groups.no_found', 'No groups found') : t('groups.no_available', 'No groups available yet')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl overflow-hidden bg-card border border-border/20 cursor-pointer hover:bg-card/80 transition-colors"
                onClick={() => navigate(`/groups/${group.id}`)}
              >
                {group.cover_image && (
                  <img
                    src={group.cover_image}
                    alt={group.name}
                    className="w-full h-28 object-cover"
                  />
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    {group.icon && <span>{group.icon}</span>}
                    {group.name}
                  </h3>
                  {group.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{group.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {group.member_count} members
                    </span>
                    <span>{group.post_count} posts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
