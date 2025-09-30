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

  const handleUsernameClick = () => {
    navigate(`/profile/${event.user_id}`);
  };

  const handleEventClick = () => {
    navigate(`/event/${event.id}`);
  };

  const handleJoinToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.is_attending) {
      onLeave(event.id);
    } else {
      onJoin(event.id);
    }
  };

  const isFull = event.max_attendees && event.attendees_count >= event.max_attendees;

  return (
    <div 
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all animate-fade-in cursor-pointer"
      onClick={handleEventClick}
    >
      {/* Event Image */}
      {event.image_url && (
        <div className="aspect-video overflow-hidden">
          <img 
            src={event.image_url} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header with Host Info */}
        <div className="flex items-center gap-3">
          <Avatar 
            className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-white/40 transition-all"
            onClick={handleUsernameClick}
          >
            <AvatarImage src={event.profiles.profile_image} alt={event.profiles.name} />
            <AvatarFallback className="bg-purple-500 text-white">{event.profiles.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <button
                onClick={handleUsernameClick}
                className="font-semibold text-white hover:underline"
              >
                {event.profiles.name}
              </button>
              {event.profiles.verified && (
                <CheckCircle className="w-4 h-4 text-pink-400 fill-pink-400" />
              )}
            </div>
            <p className="text-xs text-white/70">Event Host</p>
          </div>
          {event.category && (
            <Badge className="bg-pink-500/80 text-white border-0">
              {event.category}
            </Badge>
          )}
        </div>

        {/* Event Title & Description */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{event.description}</p>
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/90">
            <Calendar className="w-4 h-4 text-pink-400" />
            <span className="text-sm">
              {format(new Date(event.event_date), 'MMM d, yyyy • h:mm a')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Users className="w-4 h-4 text-pink-400" />
            <span className="text-sm">
              {event.attendees_count} attending
              {event.max_attendees && ` • ${event.max_attendees} max`}
            </span>
          </div>
        </div>

        {/* Join Button */}
        <Button
          onClick={handleJoinToggle}
          disabled={!event.is_attending && isFull}
          className={`w-full ${
            event.is_attending
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
          }`}
        >
          {event.is_attending ? 'Going ✓' : isFull ? 'Event Full' : 'Join Event'}
        </Button>
        
        <Button
          variant="ghost"
          className="w-full text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            handleEventClick();
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
