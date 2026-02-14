import React from 'react';
import { Event } from '@/api/events';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Users, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
  onJoin: (eventId: string) => void;
  onLeave: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onJoin, onLeave }) => {
  const navigate = useNavigate();

  const handleUsernameClick = () => navigate(`/profile/${event.user_id}`);
  const handleEventClick = () => navigate(`/event/${event.id}`);

  const handleJoinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.is_attending) onLeave(event.id);
    else onJoin(event.id);
  };

  const isFull = event.max_attendees && event.attendees_count >= event.max_attendees;

  return (
    <div 
      className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all animate-fade-in cursor-pointer"
      onClick={handleEventClick}
    >
      {/* Cover image */}
      {event.image_url && (
        <div className="aspect-video overflow-hidden bg-muted">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.parentElement!.style.display = 'none'; }}
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Host row */}
        <div className="flex items-center gap-3">
          <Avatar 
            className="w-9 h-9 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); handleUsernameClick(); }}
          >
            <AvatarImage src={event.profiles.profile_image} alt={event.profiles.name} />
            <AvatarFallback className="bg-primary/20 text-primary text-sm">{event.profiles.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); handleUsernameClick(); }} className="font-semibold text-sm text-foreground hover:opacity-70">
                {event.profiles.name}
              </button>
              {event.profiles.verified && <CheckCircle className="w-3.5 h-3.5 text-primary fill-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">Event Host</p>
          </div>
          {event.category && (
            <Badge className="bg-primary/15 text-primary border-primary/20 text-xs">{event.category}</Badge>
          )}
        </div>

        {/* Title & description */}
        <div>
          <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{event.description}</p>
        </div>

        {/* Details */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm">{format(new Date(event.event_date), 'MMM d, yyyy • h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm">
              {event.attendees_count} attending{event.max_attendees && ` • ${event.max_attendees} max`}
            </span>
          </div>
        </div>

        {/* Join button — full width */}
        <Button
          onClick={handleJoinToggle}
          disabled={!event.is_attending && !!isFull}
          className={`w-full rounded-2xl h-11 font-semibold ${
            event.is_attending
              ? 'bg-muted hover:bg-muted/80 text-foreground'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          {event.is_attending ? 'Going ✓' : isFull ? 'Event Full' : 'Join Event'}
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
