import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fromUntyped } from '@/integrations/supabase/untypedClient';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

const CreateGroup = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general',
    privacy: 'public',
    cover_image: '',
    icon: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await fromUntyped('groups')
        .insert({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          privacy: formData.privacy,
          cover_image: formData.cover_image || null,
          icon: formData.icon || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success(t('groups.created_success', 'Group created successfully'));
      navigate(`/groups/${data.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error(t('groups.create_failed', 'Failed to create group'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate('/groups')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('groups.back_to_groups', 'Back to Groups')}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{t('groups.create_new', 'Create New Group')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('groups.name_label', 'Group Name *')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder={t('groups.name_placeholder', 'Enter group name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('groups.description_label', 'Description *')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder={t('groups.description_placeholder', 'What is this group about?')}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('groups.category', 'Category')}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">{t('groups.general', 'General')}</SelectItem>
                    <SelectItem value="culture">{t('groups.culture', 'Culture')}</SelectItem>
                    <SelectItem value="language">{t('groups.language', 'Language')}</SelectItem>
                    <SelectItem value="events">{t('groups.events', 'Events')}</SelectItem>
                    <SelectItem value="hobbies">{t('groups.hobbies', 'Hobbies')}</SelectItem>
                    <SelectItem value="professional">{t('groups.professional', 'Professional')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacy">{t('groups.privacy', 'Privacy')}</Label>
                <Select
                  value={formData.privacy}
                  onValueChange={(value) => setFormData({ ...formData, privacy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">{t('groups.public', 'Public')}</SelectItem>
                    <SelectItem value="private">{t('groups.private', 'Private')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">{t('groups.icon_label', 'Icon (emoji)')}</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🌟"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image">{t('groups.cover_image', 'Cover Image URL')}</Label>
                <Input
                  id="cover_image"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('groups.creating', 'Creating...') : t('groups.create_group', 'Create Group')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGroup;
