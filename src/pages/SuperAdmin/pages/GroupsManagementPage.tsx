import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Trash2, Search, Calendar, Lock, Globe, ExternalLink, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from '@/hooks/useTranslations';

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  privacy: string;
  member_count: number;
  post_count: number;
  created_at: string;
  cover_image: string;
  created_by: string;
}

interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

const GroupsManagementPage = () => {
  const { t } = useTranslations();
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalGroups, setTotalGroups] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('groups')
        .select(`*`, { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setGroups(data || []);
      setTotalGroups(count || 0);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact' })
        .order('joined_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      setMembers(data || []);
      setTotalMembers(count || 0);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    try {
      const { error } = await supabase.from('groups').delete().eq('id', id);
      if (error) throw error;
      toast.success('Group deleted successfully');
      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    }
  };

  const removeMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      const { error } = await supabase.from('group_members').delete().eq('id', id);
      if (error) throw error;
      toast.success('Member removed successfully');
      fetchMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchMembers();
  }, []);

  const filteredGroups = groups.filter(group => {
    const search = searchTerm.toLowerCase();
    return group.name.toLowerCase().includes(search) || group.category.toLowerCase().includes(search);
  });

  const filteredMembers = members.filter(member => {
    const search = searchTerm.toLowerCase();
    return member.user_id.toLowerCase().includes(search) || member.group_id.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t('admin.groups_management', 'Groups Management')}</h1>
          <p className="text-white/60 mt-1">{t('admin.groups_desc', 'Manage all groups, members, and posts')}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchGroups} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            {t('admin.refresh', 'Refresh')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="groups" className="w-full" onValueChange={(v) => v === 'members' && fetchMembers()}>
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="groups" className="data-[state=active]:bg-white/10">
            {t('admin.all_groups', 'Groups')} ({totalGroups})
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-white/10">
            {t('admin.members', 'Members')} ({totalMembers})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                {t('admin.all_groups', 'All Groups')}
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder={t('admin.search_groups', 'Search groups...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-white/60">{t('admin.loading_groups', 'Loading groups...')}</div>
              ) : filteredGroups.length === 0 ? (
                <div className="text-center py-8 text-white/60">{t('admin.no_groups_found', 'No groups found')}</div>
              ) : (
                <div className="grid gap-4">
                  {filteredGroups.map((group) => (
                    <div key={group.id} className="p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-start gap-4">
                        <img src={group.cover_image || '/placeholder.svg'} alt={group.name} className="w-20 h-20 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-white font-semibold text-lg">{group.name}</h3>
                              <p className="text-white/60 text-sm mt-1 line-clamp-2">{group.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => window.open(`/groups/${group.id}`, '_blank')} className="text-white/60 hover:text-white hover:bg-white/5">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteGroup(group.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                              {group.privacy === 'public' ? <Globe className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                              {group.privacy}
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">{group.category}</Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                              <Users className="h-3 w-3 mr-1" />
                              {group.member_count} {t('admin.members', 'members')}
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                              {group.post_count} {t('admin.posts', 'posts')}
                            </Badge>
                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                              <Calendar className="h-3 w-3 mr-1" />
                              {format(new Date(group.created_at), 'MMM d, yyyy')}
                            </Badge>
                            <span className="text-white/40 text-sm">
                              {t('admin.creator', 'Creator')}: {group.created_by.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card className="bg-[#1a1a1a] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                {t('admin.all_group_members', 'All Group Members')}
              </CardTitle>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    placeholder={t('admin.search_members', 'Search members...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-white/60">{t('admin.loading_members', 'Loading members...')}</div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-8 text-white/60">{t('admin.no_members_found', 'No members found')}</div>
              ) : (
                <div className="space-y-3">
                  {filteredMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-white/60" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">User: {member.user_id.substring(0, 8)}...</p>
                          <p className="text-white/40 text-sm">Group: {member.group_id.substring(0, 8)}...</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 capitalize">{member.role}</Badge>
                          <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(member.joined_at), 'MMM d, yyyy')}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm" onClick={() => window.open(`/profile/${member.user_id}`, '_blank')} className="text-white/60 hover:text-white hover:bg-white/5">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeMember(member.id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupsManagementPage;
