import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarIcon, MapPin, Loader2, Send } from 'lucide-react';
import { createDateProposal } from '@/api/gifts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProposeDateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
}

const ACTIVITIES = [
  { emoji: '☕', label: 'Coffee Date' },
  { emoji: '🍽️', label: 'Dinner' },
  { emoji: '🚶', label: 'Walk in the Park' },
  { emoji: '🎬', label: 'Movie Night' },
  { emoji: '🎮', label: 'Gaming Session' },
  { emoji: '📚', label: 'Book Club' },
  { emoji: '🎨', label: 'Art Gallery' },
  { emoji: '🏋️', label: 'Workout' },
  { emoji: '🎵', label: 'Concert / Music' },
  { emoji: '🧑‍🍳', label: 'Cook Together' },
];

const ProposeDateModal = ({ open, onOpenChange, recipientId, recipientName }: ProposeDateModalProps) => {
  const [activity, setActivity] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const chosenActivity = activity || customActivity;
    if (!chosenActivity || !date || !time) {
      toast.error('Please select an activity, date, and time');
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const proposedDate = new Date(`${date}T${time}`).toISOString();
      await createDateProposal(user.id, recipientId, proposedDate, chosenActivity, location || undefined, message || undefined);
      
      toast.success(`Date invitation sent to ${recipientName}!`);
      onOpenChange(false);
      // Reset
      setActivity('');
      setCustomActivity('');
      setDate('');
      setTime('');
      setLocation('');
      setMessage('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send date proposal');
    } finally {
      setSending(false);
    }
  };

  // Default to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Invite {recipientName} on a Date
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Activity picker */}
          <div>
            <Label className="text-sm font-medium mb-2 block">What would you like to do?</Label>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITIES.map(act => (
                <button
                  key={act.label}
                  onClick={() => { setActivity(act.label); setCustomActivity(''); }}
                  className={`p-2.5 rounded-lg border-2 text-left text-sm transition-all flex items-center gap-2 ${
                    activity === act.label
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <span className="text-lg">{act.emoji}</span>
                  <span>{act.label}</span>
                </button>
              ))}
            </div>
            <Input
              placeholder="Or type a custom activity..."
              value={customActivity}
              onChange={(e) => { setCustomActivity(e.target.value); setActivity(''); }}
              className="mt-2"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm mb-1 block">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
              />
            </div>
            <div>
              <Label className="text-sm mb-1 block">Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label className="text-sm mb-1 block">Location (optional)</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Where should you meet?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <Label className="text-sm mb-1 block">Message (optional)</Label>
            <Textarea
              placeholder="Add a personal note..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none h-16"
              maxLength={300}
            />
          </div>

          <Button onClick={handleSend} disabled={sending} className="w-full" size="lg">
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send Date Invitation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProposeDateModal;
