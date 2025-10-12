import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createPost } from '@/api/posts';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Image, Video, Loader2, Hash, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { extractHashtags, updateHashtagUsage } from '@/api/hashtags';
import { getUserGroups, addPostToGroup } from '@/api/groups';
import { Checkbox } from '@/components/ui/checkbox';

const CreatePost = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | undefined>();
  const [loading, setLoading] = useState(false);
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  React.useEffect(() => {
    loadUserGroups();
  }, []);

  React.useEffect(() => {
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
      toast({
        title: 'Error',
        description: 'Please enter some content',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create the post with hashtags
      const newPost = await createPost(content, mediaUrl || undefined, mediaType, hashtags);
      
      // Update hashtag usage
      if (hashtags.length > 0) {
        await updateHashtagUsage(hashtags);
      }

      // Add post to selected groups
      if (selectedGroups.length > 0 && newPost) {
        await Promise.all(
          selectedGroups.map(groupId => addPostToGroup(newPost.id, groupId))
        );
      }

      toast({
        title: 'Success',
        description: 'Post created successfully!'
      });
      navigate('/discovery');
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold text-white">Create Post</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-white">What's on your mind?</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              rows={6}
              className="resize-none bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Media URL */}
          <div className="space-y-2">
            <Label htmlFor="mediaUrl" className="text-white">Media URL (optional)</Label>
            <Input
              id="mediaUrl"
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://example.com/image.jpg or video link"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* Media Type */}
          {mediaUrl && (
            <div className="space-y-2">
              <Label htmlFor="mediaType" className="text-white">Media Type</Label>
              <Select
                value={mediaType}
                onValueChange={(value: 'image' | 'video') => setMediaType(value)}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
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

          {/* Media Preview */}
          {mediaUrl && mediaType && (
            <div className="rounded-lg overflow-hidden border border-white/20">
              {mediaType === 'image' ? (
                <img src={mediaUrl} alt="Preview" className="w-full h-auto max-h-96 object-cover" />
              ) : (
                <video src={mediaUrl} controls className="w-full h-auto max-h-96" />
              )}
            </div>
          )}

          {/* Detected Hashtags */}
          {hashtags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Detected Hashtags
              </Label>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-purple-500/30 border border-purple-500/50 text-purple-200 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Groups Selection */}
          {userGroups.length > 0 && (
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Users className="w-4 h-4" />
                Post to Groups (Optional)
              </Label>
              <div className="space-y-2 max-h-48 overflow-y-auto bg-white/5 rounded-lg p-3 border border-white/10">
                {userGroups.map((membership: any) => (
                  <label
                    key={membership.group_id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedGroups.includes(membership.group_id)}
                      onCheckedChange={() => toggleGroup(membership.group_id)}
                    />
                    <div className="flex items-center gap-2">
                      {membership.groups?.icon && (
                        <span className="text-lg">{membership.groups.icon}</span>
                      )}
                      <span className="text-white text-sm">{membership.groups?.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
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
      </div>
    </div>
  );
};

export default CreatePost;
