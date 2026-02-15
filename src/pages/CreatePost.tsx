import React, { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createPost } from '@/api/posts';
import { toast } from 'sonner';
import { ArrowLeft, Image, Video, Loader2, Hash, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { extractHashtags, updateHashtagUsage } from '@/api/hashtags';
import { getUserGroups, addPostToGroup } from '@/api/groups';
import { Checkbox } from '@/components/ui/checkbox';

const CreatePost = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | undefined>();
  const [loading, setLoading] = useState(false);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  React.useEffect(() => { loadUserGroups(); }, []);
  React.useEffect(() => { setHashtags(extractHashtags(content)); }, [content]);

  const loadUserGroups = async () => { try { const groups = await getUserGroups(); setUserGroups(groups); } catch (error) { console.error('Error loading groups:', error); } };
  const toggleGroup = (groupId: string) => { setSelectedGroups(prev => prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) { toast.error('Please enter some content'); return; }
    try {
      setLoading(true);
      const newPost = await createPost(content, mediaUrl || undefined, mediaType, hashtags);
      if (hashtags.length > 0) await updateHashtagUsage(hashtags);
      if (selectedGroups.length > 0 && newPost) await Promise.all(selectedGroups.map(groupId => addPostToGroup(newPost.id, groupId)));
      toast.success(t('social.post_created', 'Post created successfully!'));
      navigate('/discovery');
    } catch (error) { console.error('Error creating post:', error); toast.error(t('social.post_failed', 'Failed to create post')); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-md mx-auto px-4 h-12 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2"><ArrowLeft className="w-4 h-4" />{t('common.back', 'Back')}</Button>
          <h1 className="text-lg font-bold text-foreground">{t('social.create_post', 'Create Post')}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">{t('social.whats_on_mind', "What's on your mind?")}</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder={t('social.share_thoughts', 'Share your thoughts...')} rows={6} className="resize-none" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mediaUrl">{t('social.media_url', 'Media URL (optional)')}</Label>
            <Input id="mediaUrl" type="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://example.com/image.jpg or video link" />
          </div>
          {mediaUrl && (
            <div className="space-y-2">
              <Label htmlFor="mediaType">Media Type</Label>
              <Select value={mediaType} onValueChange={(value: 'image' | 'video') => setMediaType(value)}>
                <SelectTrigger><SelectValue placeholder="Select media type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="image"><div className="flex items-center gap-2"><Image className="w-4 h-4" />Image</div></SelectItem>
                  <SelectItem value="video"><div className="flex items-center gap-2"><Video className="w-4 h-4" />Video</div></SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {mediaUrl && mediaType && (
            <div className="rounded-2xl overflow-hidden border border-border/20">
              {mediaType === 'image' ? <img src={mediaUrl} alt="Preview" className="w-full h-auto max-h-96 object-cover" /> : <video src={mediaUrl} controls className="w-full h-auto max-h-96" />}
            </div>
          )}
          {hashtags.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Hash className="w-4 h-4" />{t('social.detected_hashtags', 'Detected Hashtags')}</Label>
              <div className="flex flex-wrap gap-2">{hashtags.map((tag) => <span key={tag} className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm">#{tag}</span>)}</div>
            </div>
          )}
          {userGroups.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Users className="w-4 h-4" />{t('social.post_to_groups', 'Post to Groups (Optional)')}</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto bg-muted/30 rounded-2xl p-3 border border-border/10">
                {userGroups.map((membership: any) => (
                  <label key={membership.group_id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted cursor-pointer transition-colors">
                    <Checkbox checked={selectedGroups.includes(membership.group_id)} onCheckedChange={() => toggleGroup(membership.group_id)} />
                    <div className="flex items-center gap-2">{membership.groups?.icon && <span className="text-lg">{membership.groups.icon}</span>}<span className="text-foreground text-sm">{membership.groups?.name}</span></div>
                  </label>
                ))}
              </div>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{t('social.creating', 'Creating...')}</> : t('social.create_post', 'Create Post')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
