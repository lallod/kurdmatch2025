import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createPost } from '@/api/posts';
import { extractHashtags, updateHashtagUsage } from '@/api/hashtags';
import { getUserGroups, addPostToGroup } from '@/api/groups';
import { toast } from 'sonner';
import { Image, Video, Hash, Users, Loader2 } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ open, onOpenChange, onPostCreated }) => {
  const { t } = useTranslations();
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | undefined>();
  const [loading, setLoading] = useState(false);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      loadUserGroups();
    }
  }, [open]);

  useEffect(() => {
    const detected = extractHashtags(content);
    setHashtags(detected);
  }, [content]);

  const loadUserGroups = async () => {
    try {
      const groups = await getUserGroups();
      setUserGroups(groups);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error(t('toast.post.enter_content', 'Please enter some content'));
      return;
    }

    try {
      setLoading(true);
      
      const newPost = await createPost(content, mediaUrl || undefined, mediaType, hashtags);
      
      if (hashtags.length > 0) {
        await updateHashtagUsage(hashtags);
      }

      if (selectedGroups.length > 0 && newPost) {
        await Promise.all(
          selectedGroups.map(groupId => addPostToGroup(newPost.id, groupId))
        );
      }

      toast.success(t('toast.post.created', 'Post created successfully!'));
      
      setContent('');
      setMediaUrl('');
      setMediaType(undefined);
      setSelectedGroups([]);
      onOpenChange(false);
      onPostCreated?.();
    } catch (error) {
      toast.error(t('toast.post.create_failed', 'Failed to create post'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl">Create Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content" className="text-foreground">What's on your mind?</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="resize-none bg-accent/10 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediaUrl" className="text-foreground">Media URL (optional)</Label>
            <Input
              id="mediaUrl"
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-accent/10 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {mediaUrl && (
            <div className="space-y-2">
              <Label htmlFor="mediaType" className="text-foreground">Media Type</Label>
              <Select
                value={mediaType}
                onValueChange={(value: 'image' | 'video') => setMediaType(value)}
              >
                <SelectTrigger className="bg-accent/10 border-border text-foreground">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Image
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {mediaUrl && mediaType && (
            <div className="rounded-lg overflow-hidden border border-border">
              {mediaType === 'image' ? (
                <img src={mediaUrl} alt="Preview" className="w-full h-auto max-h-64 object-cover" />
              ) : (
                <video src={mediaUrl} controls className="w-full h-auto max-h-64" />
              )}
            </div>
          )}

          {hashtags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Detected Hashtags
              </Label>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-muted-foreground text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {userGroups.length > 0 && (
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Post to Groups (Optional)
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto bg-accent/5 rounded-lg p-3 border border-border/10">
                {userGroups.map((membership: any) => (
                  <label
                    key={membership.group_id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-accent/10 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedGroups.includes(membership.group_id)}
                      onCheckedChange={() => toggleGroup(membership.group_id)}
                    />
                    <div className="flex items-center gap-2">
                      {membership.groups?.icon && (
                        <span className="text-lg">{membership.groups.icon}</span>
                      )}
                      <span className="text-foreground text-sm">{membership.groups?.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Post'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
