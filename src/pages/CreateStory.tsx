import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CreateStory = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    media_url: '',
    media_type: 'image' as 'image' | 'video',
    duration: 15,
    category: 'general',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.media_url) {
      toast({
        title: 'Error',
        description: 'Please provide a media URL',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await (supabase as any)
        .from('stories')
        .insert({
          user_id: user.id,
          media_url: formData.media_url,
          media_type: formData.media_type,
          duration: formData.duration,
          category: formData.category,
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Story created successfully',
      });
      navigate('/discovery');
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        title: 'Error',
        description: 'Failed to create story',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/discovery')}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Create Story</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="media_url" className="text-white">Media URL *</Label>
                <div className="relative">
                  <Input
                    id="media_url"
                    value={formData.media_url}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                  <ImageIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                </div>
                <p className="text-xs text-white/60">Enter a direct URL to your image or video</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media_type" className="text-white">Media Type</Label>
                <Select
                  value={formData.media_type}
                  onValueChange={(value: 'image' | 'video') => setFormData({ ...formData, media_type: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-white">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="30"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="bg-white/5 border-white/20 text-white"
                />
                <p className="text-xs text-white/60">Between 5-30 seconds</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Preview</h3>
                {formData.media_url ? (
                  formData.media_type === 'image' ? (
                    <img
                      src={formData.media_url}
                      alt="Story preview"
                      className="w-full h-64 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=Invalid+URL';
                      }}
                    />
                  ) : (
                    <video
                      src={formData.media_url}
                      className="w-full h-64 object-cover rounded-lg"
                      controls
                    />
                  )
                ) : (
                  <div className="w-full h-64 bg-white/5 rounded-lg flex items-center justify-center">
                    <Upload className="w-12 h-12 text-white/30" />
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Story'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Story Guidelines</h3>
          <ul className="text-sm text-white/70 space-y-1">
            <li>• Stories expire after 24 hours</li>
            <li>• Keep content appropriate and respectful</li>
            <li>• Maximum duration is 30 seconds</li>
            <li>• Stories are visible to all users</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
