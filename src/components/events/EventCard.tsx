import { Calendar, MapPin, Users, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Event, joinEvent, leaveEvent } from '@/api/events';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useTranslations } from '@/hooks/useTranslations';

interface EventCardProps {
  event: Event;
  onUpdate?: () => void;
}

export default function EventCard({ event, onUpdate }: EventCardProps) {
  const { t } = useTranslations();
  const handleJoinToggle = async () => {
    try {
      if (event.is_attending) {
        await leaveEvent(event.id);
        toast.success(t('toast.event.left', 'Left event'));
      } else {
        await joinEvent(event.id);
        toast.success(t('toast.event.joined', 'Joined event!'));
      }
      onUpdate?.();
    } catch (error: any) {
      toast.error(error.message || t('misc.error', 'Something went wrong'));
    }
  };

  const eventDate = new Date(event.event_date);
  const isFull = event.max_attendees ? event.attendees_count >= event.max_attendees : false;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {event.image_url && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        {/* Event Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{event.title}</h3>
            {event.category && (
              <Badge variant="secondary" className="mt-1">
                {event.category}
              </Badge>
            )}
          </div>
          {isFull && (
            <Badge variant="destructive">{t('events.full', 'Full')}</Badge>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{format(eventDate, 'PPP p')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>
              {event.attendees_count} {t('events.attending', 'attending')}
              {event.max_attendees && ` (${t('events.max', 'max')} ${event.max_attendees})`}
            </span>
          </div>
        </div>

        {/* Event Description */}
        <p className="text-sm line-clamp-2">{event.description}</p>

        {/* Organizer */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Avatar className="w-6 h-6">
            <AvatarImage src={event.profiles.profile_image} />
            <AvatarFallback>
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {t('events.organized_by', 'Organized by')} {event.profiles.name}
          </span>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleJoinToggle}
          variant={event.is_attending ? 'outline' : 'default'}
          className="w-full"
          disabled={!event.is_attending && isFull}
        >
          {event.is_attending ? t('events.leave_event', 'Leave Event') : isFull ? t('events.event_full', 'Event Full') : t('events.join_event', 'Join Event')}
        </Button>
      </CardContent>
    </Card>
  );
}
