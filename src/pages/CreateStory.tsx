import { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

const CreateStory = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ media_url: '', media_type: 'image' as 'image' | 'video', duration: 15, category: 'general' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!formData.media_url) { toast.error('Please provide a media URL'); return; }
    try {
      setLoading(true);
      const { error } = await (supabase as any).from('stories').insert({ user_id: user.id, media_url: formData.media_url, media_type: formData.media_type, duration: formData.duration, category: formData.category });
      if (error) throw error;
      toast.success(t('social.story_created', 'Story created successfully'));
      navigate('/discovery');
    } catch (error) { console.error('Error creating story:', error); toast.error(t('social.story_failed', 'Failed to create story')); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/discovery')}><ArrowLeft className="mr-2 h-4 w-4" />{t('common.back', 'Back')}</Button>

        <Card className="bg-card border-border/20">
          <CardHeader><CardTitle className="text-foreground text-2xl">{t('social.create_story', 'Create Story')}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="media_url">Media URL *</Label>
                <div className="relative">
                  <Input id="media_url" value={formData.media_url} onChange={(e) => setFormData({ ...formData, media_url: e.target.value })} required placeholder="https://example.com/image.jpg" />
                  <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">Enter a direct URL to your image or video</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="media_type">Media Type</Label>
                <Select value={formData.media_type} onValueChange={(value: 'image' | 'video') => setFormData({ ...formData, media_type: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input id="duration" type="number" min="5" max="30" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="general">General</SelectItem><SelectItem value="culture">Culture</SelectItem><SelectItem value="lifestyle">Lifestyle</SelectItem><SelectItem value="travel">Travel</SelectItem><SelectItem value="food">Food</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="bg-muted/30 border border-border/10 rounded-2xl p-4">
                <h3 className="text-foreground font-semibold mb-2">{t('social.preview', 'Preview')}</h3>
                {formData.media_url ? (
                  formData.media_type === 'image' ? <img src={formData.media_url} alt="Story preview" className="w-full h-64 object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <video src={formData.media_url} className="w-full h-64 object-cover rounded-xl" controls />
                ) : (
                  <div className="w-full h-64 bg-muted/50 rounded-xl flex items-center justify-center"><Upload className="w-12 h-12 text-muted-foreground/30" /></div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? t('social.creating', 'Creating...') : t('social.create_story', 'Create Story')}</Button>
            </form>
          </CardContent>
        </Card>

        <div className="bg-muted/30 border border-border/10 rounded-2xl p-4">
          <h3 className="text-foreground font-semibold mb-2">{t('social.story_guidelines', 'Story Guidelines')}</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t('social.stories_expire', 'Stories expire after 24 hours')}</li><li>• {t('social.keep_appropriate', 'Keep content appropriate and respectful')}</li><li>• {t('social.max_duration', 'Maximum duration is 30 seconds')}</li><li>• {t('social.stories_visible', 'Stories are visible to all users')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
