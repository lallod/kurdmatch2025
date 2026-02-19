import React, { useState, useRef } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createPost } from '@/api/posts';
import { toast } from 'sonner';
import { ArrowLeft, Image, Loader2, Hash, Users, X, Camera } from 'lucide-react';
import { extractHashtags, updateHashtagUsage } from '@/api/hashtags';
import { getUserGroups, addPostToGroup } from '@/api/groups';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const CreatePost = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { user } = useSupabaseAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  React.useEffect(() => { loadUserGroups(); }, []);
  React.useEffect(() => { setHashtags(extractHashtags(content)); }, [content]);

  const loadUserGroups = async () => { try { const groups = await getUserGroups(); setUserGroups(groups); } catch (error) { console.error('Error loading groups:', error); } };
  const toggleGroup = (groupId: string) => { setSelectedGroups(prev => prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]); };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error(t('social.file_too_large', 'File is too large (max 10MB)'));
      return;
    }

    setMediaFile(file);
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
  };

  const removeMedia = () => {
    setMediaFile(null);
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const uploadMedia = async (): Promise<string | undefined> => {
    if (!mediaFile || !user) return undefined;
    setUploading(true);
    try {
      const ext = mediaFile.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('post-media').upload(path, mediaFile);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('post-media').getPublicUrl(path);
      return publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(t('social.upload_failed', 'Failed to upload image'));
      return undefined;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) { toast.error(t('social.enter_content', 'Please enter some content')); return; }
    try {
      setLoading(true);
      let mediaUrl: string | undefined;
      let mediaType: 'image' | 'video' | undefined;

      if (mediaFile) {
        mediaUrl = await uploadMedia();
        mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
      }

      const newPost = await createPost(content, mediaUrl, mediaType, hashtags);
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

          {/* Media upload */}
          <div className="space-y-2">
            <Label>{t('social.add_photo', 'Add Photo')}</Label>
            {mediaPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-border/20">
                <img src={mediaPreview} alt="Preview" className="w-full h-auto max-h-96 object-cover" />
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-background/70 backdrop-blur-sm text-foreground hover:bg-background"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 rounded-2xl border-2 border-dashed border-border/30 hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{t('social.tap_to_upload', 'Tap to add a photo')}</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

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
          <Button type="submit" className="w-full" disabled={loading || uploading}>
            {loading || uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{uploading ? t('social.uploading', 'Uploading...') : t('social.creating', 'Creating...')}</> : t('social.create_post', 'Create Post')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
