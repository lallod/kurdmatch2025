import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Bot, Users, FileText, Clock, Trash2, RefreshCw, Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { generateGhostUsers, deleteAllGhostUsers, deleteSingleGhostUser, publishScheduledContent, regenerateActivity, type GhostGenerationOptions } from '@/utils/ghostUserGenerator';
import { kurdishRegions } from '@/utils/profileGenerator/data/locations';
import { useTranslations } from '@/hooks/useTranslations';

const GhostUsersPage = () => {
  const { t } = useTranslations();
  const queryClient = useQueryClient();
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const [count, setCount] = useState('20');
  const [gender, setGender] = useState<'male' | 'female' | 'mixed'>('mixed');
  const [generatePosts, setGeneratePosts] = useState(true);
  const [generateStories, setGenerateStories] = useState(true);
  const [generatePhotos, setGeneratePhotos] = useState(true);
  const [setVerified, setSetVerified] = useState(false);
  const [region, setRegion] = useState('');

  const { data: ghostUsers = [], isLoading } = useQuery({
    queryKey: ['ghost-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, gender, location, created_at, last_active, verified, is_generated')
        .eq('is_generated', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['ghost-stats'],
    queryFn: async () => {
      const [ghostCount, postsRes, scheduledRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('is_generated', true),
        supabase.from('posts').select('id', { count: 'exact', head: true }).in('user_id', ghostUsers.map(u => u.id)),
        supabase.from('scheduled_content').select('id', { count: 'exact', head: true }).eq('published', false),
      ]);
      return { totalGhosts: ghostCount.count || 0, totalPosts: postsRes.count || 0, scheduledContent: scheduledRes.count || 0 };
    },
    enabled: ghostUsers.length >= 0,
  });

  const handleGenerate = async () => {
    setGenerating(true);
    setProgress({ current: 0, total: parseInt(count) });
    const result = await generateGhostUsers({ count: parseInt(count), gender, generatePosts, generateStories, generatePhotos, setVerified, region: region || undefined, onProgress: (current, total) => setProgress({ current, total }) });
    setGenerating(false);
    setGenerateOpen(false);
    queryClient.invalidateQueries({ queryKey: ['ghost-users'] });
    queryClient.invalidateQueries({ queryKey: ['ghost-stats'] });
    toast({ title: t('admin.generation_complete', 'Generation Complete'), description: t('admin.generation_result', 'Successfully created {{count}} ghost users.', { count: result.success }) + (result.errors.length > 0 ? ` ${result.errors.length} errors.` : '') });
  };

  const handleDeleteAll = async () => {
    const result = await deleteAllGhostUsers();
    queryClient.invalidateQueries({ queryKey: ['ghost-users'] });
    queryClient.invalidateQueries({ queryKey: ['ghost-stats'] });
    toast({ title: t('admin.all_ghost_deleted', 'All Ghost Users Deleted'), description: t('admin.ghost_deleted_result', 'Removed {{count}} ghost users and their content.', { count: result.deleted }) });
  };

  const handleDeleteSingle = async (id: string) => {
    await deleteSingleGhostUser(id);
    queryClient.invalidateQueries({ queryKey: ['ghost-users'] });
    queryClient.invalidateQueries({ queryKey: ['ghost-stats'] });
    toast({ title: t('admin.ghost_user_deleted', 'Ghost user deleted') });
  };

  const handlePublish = async () => {
    const result = await publishScheduledContent();
    queryClient.invalidateQueries({ queryKey: ['ghost-stats'] });
    toast({ title: t('admin.published_content', 'Published Content'), description: result.error ? `Error: ${result.error}` : t('admin.published_items', 'Published {{count}} scheduled items.', { count: result.published }) });
  };

  const handleRegenerate = async () => {
    const ids = ghostUsers.map(u => u.id);
    if (ids.length === 0) return;
    const result = await regenerateActivity(ids);
    queryClient.invalidateQueries({ queryKey: ['ghost-stats'] });
    toast({ title: t('admin.activity_regenerated', 'Activity Regenerated'), description: t('admin.scheduled_items', 'Scheduled {{count}} new content items.', { count: result.scheduled }) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="h-7 w-7 text-purple-400" />
            {t('admin.ghost_users', 'Ghost Users')}
          </h1>
          <p className="text-white/60 mt-1">{t('admin.ghost_users_desc', 'Generate and manage auto-generated profiles')}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePublish} className="border-white/10 text-white/80 hover:bg-white/5">
            <Zap className="h-4 w-4 mr-1" /> {t('admin.publish_due_content', 'Publish Due Content')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRegenerate} className="border-white/10 text-white/80 hover:bg-white/5">
            <RefreshCw className="h-4 w-4 mr-1" /> {t('admin.regenerate_activity', 'Regenerate Activity')}
          </Button>
          <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4 mr-1" /> {t('admin.generate_users', 'Generate Users')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle>{t('admin.generate_ghost_users', 'Generate Ghost Users')}</DialogTitle>
                <DialogDescription className="text-white/60">{t('admin.create_realistic_profiles', 'Create realistic auto-generated profiles')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-white/80">{t('admin.number_of_users', 'Number of users')}</Label>
                  <Select value={count} onValueChange={setCount}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/80">{t('admin.gender', 'Gender')}</Label>
                  <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">{t('admin.mixed', 'Mixed')}</SelectItem>
                      <SelectItem value="male">{t('admin.male_only', 'Male only')}</SelectItem>
                      <SelectItem value="female">{t('admin.female_only', 'Female only')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/80">{t('admin.region_optional', 'Region (optional)')}</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1"><SelectValue placeholder={t('admin.all_regions', 'All regions')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('admin.all_regions', 'All regions')}</SelectItem>
                      {kurdishRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-white/80">{t('admin.content_options', 'Content options')}</Label>
                  <div className="flex items-center gap-2"><Checkbox id="posts" checked={generatePosts} onCheckedChange={(c) => setGeneratePosts(!!c)} /><Label htmlFor="posts" className="text-white/70 text-sm">{t('admin.generate_posts', 'Generate posts (2-5 per user)')}</Label></div>
                  <div className="flex items-center gap-2"><Checkbox id="stories" checked={generateStories} onCheckedChange={(c) => setGenerateStories(!!c)} /><Label htmlFor="stories" className="text-white/70 text-sm">{t('admin.generate_stories', 'Generate stories (1-3 per user)')}</Label></div>
                  <div className="flex items-center gap-2"><Checkbox id="photos" checked={generatePhotos} onCheckedChange={(c) => setGeneratePhotos(!!c)} /><Label htmlFor="photos" className="text-white/70 text-sm">{t('admin.generate_profile_photos', 'Generate profile photos (2-4 per user)')}</Label></div>
                  <div className="flex items-center gap-2"><Checkbox id="verified" checked={setVerified} onCheckedChange={(c) => setSetVerified(!!c)} /><Label htmlFor="verified" className="text-white/70 text-sm">{t('admin.set_verified_profiles', 'Set as verified profiles')}</Label></div>
                </div>
                {generating && (
                  <div className="space-y-2">
                    <Progress value={(progress.current / progress.total) * 100} className="h-2" />
                    <p className="text-xs text-white/50 text-center">{t('admin.generating_progress', 'Generating {{current}} / {{total}}', { current: progress.current, total: progress.total })}</p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setGenerateOpen(false)} className="border-white/10 text-white/80">{t('common.cancel', 'Cancel')}</Button>
                <Button onClick={handleGenerate} disabled={generating} className="bg-purple-600 hover:bg-purple-700">
                  {generating ? t('common.generating', 'Generating...') : t('common.generate', 'Generate')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#141414] border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><Users className="h-5 w-5 text-purple-400" /></div>
            <div><p className="text-sm text-white/50">{t('admin.ghost_users', 'Ghost Users')}</p><p className="text-2xl font-bold text-white">{stats?.totalGhosts ?? 0}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><FileText className="h-5 w-5 text-blue-400" /></div>
            <div><p className="text-sm text-white/50">{t('admin.total_posts', 'Total Posts')}</p><p className="text-2xl font-bold text-white">{stats?.totalPosts ?? 0}</p></div>
          </CardContent>
        </Card>
        <Card className="bg-[#141414] border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center"><Clock className="h-5 w-5 text-orange-400" /></div>
            <div><p className="text-sm text-white/50">{t('admin.scheduled_content', 'Scheduled Content')}</p><p className="text-2xl font-bold text-white">{stats?.scheduledContent ?? 0}</p></div>
          </CardContent>
        </Card>
      </div>

      {ghostUsers.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1" /> {t('admin.delete_all_ghost_users', 'Delete All Ghost Users')} ({ghostUsers.length})</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1a1a1a] border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">{t('admin.delete_all_ghost_users', 'Delete All Ghost Users')}?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/60">{t('admin.delete_all_ghost_confirm', 'This will permanently remove all {{count}} ghost users and their posts, stories, photos, and scheduled content.', { count: ghostUsers.length })}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 text-white/80">{t('common.cancel', 'Cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAll} className="bg-red-600 hover:bg-red-700">{t('common.delete_all', 'Delete All')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <Card className="bg-[#141414] border-white/5">
        <CardHeader><CardTitle className="text-white text-lg">{t('admin.ghost_users', 'Ghost Users')} ({ghostUsers.length})</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-white/50 text-center py-8">{t('common.loading', 'Loading...')}</p>
          ) : ghostUsers.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t('admin.no_ghost_users', 'No ghost users yet. Generate some to get started.')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5">
                    <TableHead className="text-white/60">{t('common.name', 'Name')}</TableHead>
                    <TableHead className="text-white/60">{t('common.gender', 'Gender')}</TableHead>
                    <TableHead className="text-white/60">{t('common.location', 'Location')}</TableHead>
                    <TableHead className="text-white/60">{t('common.created', 'Created')}</TableHead>
                    <TableHead className="text-white/60">{t('common.last_active', 'Last Active')}</TableHead>
                    <TableHead className="text-white/60">{t('common.status', 'Status')}</TableHead>
                    <TableHead className="text-white/60">{t('common.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ghostUsers.map((user) => (
                    <TableRow key={user.id} className="border-white/5">
                      <TableCell className="text-white font-medium">{user.name}</TableCell>
                      <TableCell className="text-white/70">{user.gender}</TableCell>
                      <TableCell className="text-white/70">{user.location}</TableCell>
                      <TableCell className="text-white/50 text-sm">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</TableCell>
                      <TableCell className="text-white/50 text-sm">{user.last_active ? new Date(user.last_active).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        {user.verified ? <Badge className="bg-green-500/20 text-green-400 border-0">{t('admin.verified', 'Verified')}</Badge> : <Badge className="bg-white/10 text-white/50 border-0">{t('admin.active', 'Active')}</Badge>}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSingle(user.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GhostUsersPage;
