import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createGroup } from '@/api/groups';
import { toast } from 'sonner';
import { Upload, Sparkles } from 'lucide-react';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'lifestyle', label: 'Lifestyle', icon: '🌟' },
  { value: 'culture', label: 'Culture', icon: '🎵' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
];

const iconOptions = ['🎯', '💼', '🌟', '🎵', '✈️', '📚', '🎨', '⚽', '🍕', '🎭', '🎬', '🎮', '📱', '💻', '🏋️'];

export const CreateGroupDialog = ({ open, onOpenChange }: CreateGroupDialogProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'professional',
    icon: '🎯',
    privacy: 'public' as 'public' | 'private',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      const group = await createGroup({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        privacy: formData.privacy,
      });
      
      toast.success('Group created successfully!');
      onOpenChange(false);
      navigate(`/groups/${group.id}`);
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Create New Group
          </DialogTitle>
          <DialogDescription>
            Build your community and connect with people who share your interests
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Kurdish Tech Professionals"
              className="h-12 glass border-border/50"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell people what your group is about..."
              className="glass border-border/50 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label>Category *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.category === cat.value
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border/50 glass hover:border-primary/50'
                  }`}
                >
                  <span className="text-3xl block mb-2">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div className="space-y-3">
            <Label>Group Icon</Label>
            <div className="grid grid-cols-5 gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-2xl ${
                    formData.icon === icon
                      ? 'border-primary bg-primary/10'
                      : 'border-border/50 glass hover:border-primary/50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <Label>Privacy</Label>
            <RadioGroup
              value={formData.privacy}
              onValueChange={(value) => setFormData({ ...formData, privacy: value as 'public' | 'private' })}
            >
              <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border/50 glass">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">Public</div>
                    <div className="text-sm text-muted-foreground">Anyone can see and join</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border/50 glass">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex-1 cursor-pointer">
                  <div>
                    <div className="font-medium">Private</div>
                    <div className="text-sm text-muted-foreground">Only members can see content</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-full"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-full shadow-lg"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
