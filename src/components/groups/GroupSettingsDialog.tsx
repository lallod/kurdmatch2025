import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { updateGroup, deleteGroup } from '@/api/groups';
import type { Group } from '@/api/groups';
import { toast } from 'sonner';
import { Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface GroupSettingsDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const iconOptions = ['🎯', '💼', '🌟', '🎵', '✈️', '📚', '🎨', '⚽', '🍕', '🎭', '🎬', '🎮', '📱', '💻', '🏋️'];

export const GroupSettingsDialog = ({ group, open, onOpenChange, onUpdate }: GroupSettingsDialogProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description || '',
    icon: group.icon || '🎯',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      await updateGroup(group.id, {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
      });
      
      toast.success('Group updated successfully!');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating group:', error);
      toast.error('Failed to update group');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteGroup(group.id);
      toast.success('Group deleted successfully');
      navigate('/groups');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Group Settings
            </DialogTitle>
            <DialogDescription>
              Manage your group settings and information
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
                placeholder="Group name"
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
                placeholder="Group description..."
                className="glass border-border/50 min-h-[100px]"
                maxLength={500}
              />
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
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {/* Delete Section */}
            <div className="pt-6 border-t border-border/50">
              <div className="space-y-3">
                <Label className="text-destructive">Danger Zone</Label>
                <p className="text-sm text-muted-foreground">
                  Once you delete a group, there is no going back. Please be certain.
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full rounded-full"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Group
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="glass backdrop-blur-xl border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the group
              and remove all associated data including posts and members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-full bg-destructive hover:bg-destructive/90"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
