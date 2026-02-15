import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, Users, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';


interface EventDetail {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  attendees_count: number;
  max_attendees: number | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
  profiles: {
    id: string;
    name: string;
    profile_image: string;
    verified: boolean;
  };
  is_attending?: boolean;
}

interface Attendee {
  id: string;
  user_id: string;
  created_at: string;
  profiles: {
    id: string;
    name: string;
    profile_image: string;
    verified: boolean;
  };
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchEventDetails();
    fetchCurrentUser();
  }, [id]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const fetchEventDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select(`
          *,
          profiles (
            id,
            name,
            profile_image,
            verified
          )
        `)
        .eq('id', id)
        .single();

      if (eventError) throw eventError;

      // Check if current user is attending
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: attendanceData } = await supabase
          .from('event_attendees')
          .select('id')
          .eq('event_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        (eventData as EventDetail).is_attending = !!attendanceData;
      }

      setEvent(eventData as EventDetail);

      // Fetch attendees
      const { data: attendeesData, error: attendeesError } = await supabase
        .from('event_attendees')
        .select(`
          *,
          profiles (
            id,
            name,
            profile_image,
            verified
          )
        `)
        .eq('event_id', id)
        .order('created_at', { ascending: false });

      if (attendeesError) throw attendeesError;
      setAttendees(attendeesData || []);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load event details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinToggle = async () => {
    if (!event || !currentUserId) return;

    try {
      if (event.is_attending) {
        // Leave event
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', event.id)
          .eq('user_id', currentUserId);

        if (error) throw error;

        toast({
          title: 'Left event',
          description: 'You are no longer attending this event',
        });
      } else {
        // Join event
        const { error } = await supabase
          .from('event_attendees')
          .insert({
            event_id: event.id,
            user_id: currentUserId,
          });

        if (error) throw error;

        toast({
          title: 'Joined event!',
          description: 'You are now attending this event',
        });
      }

      fetchEventDetails();
    } catch (error) {
      console.error('Error toggling attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to update attendance',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Event not found</div>
      </div>
    );
  }

  const isFull = event.max_attendees && event.attendees_count >= event.max_attendees;
  const isHost = currentUserId === event.user_id;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-md border-b border-border/20 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Event Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Event Image */}
        {event.image_url && (
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Event Info Card */}
        <Card className="bg-card/50 backdrop-blur-md border-border/20 p-6 space-y-6">
          {/* Host Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar 
                className="w-14 h-14 cursor-pointer hover:ring-2 hover:ring-white/40 transition-all"
                onClick={() => navigate(`/profile/${event.user_id}`)}
              >
                <AvatarImage src={event.profiles.profile_image} alt={event.profiles.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {event.profiles.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/profile/${event.user_id}`)}
                    className="font-semibold text-foreground text-lg hover:underline"
                  >
                    {event.profiles.name}
                  </button>
                  {event.profiles.verified && (
                    <CheckCircle className="w-5 h-5 text-pink-400 fill-pink-400" />
                  )}
                </div>
                <p className="text-muted-foreground">Event Host</p>
              </div>
            </div>
            {event.category && (
              <Badge className="bg-primary/80 text-primary-foreground border-0 text-base px-4 py-1">
                {event.category}
              </Badge>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-foreground">{event.title}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{event.description}</p>
          </div>

          {/* Event Details */}
          <div className="space-y-3 pt-4 border-t border-border/20">
            <div className="flex items-start gap-3 text-foreground">
              <Calendar className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Date & Time</p>
                <p className="text-muted-foreground">{format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}</p>
                <p className="text-muted-foreground">{format(new Date(event.event_date), 'h:mm a')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-foreground">
              <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-muted-foreground">{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-foreground">
              <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Attendees</p>
                <p className="text-muted-foreground">
                  {event.attendees_count} going
                  {event.max_attendees && ` • ${event.max_attendees} max capacity`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-foreground">
              <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Created</p>
                <p className="text-muted-foreground">{format(new Date(event.created_at), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Join/Leave Button */}
          {!isHost && (
            <Button
              onClick={handleJoinToggle}
              disabled={!event.is_attending && isFull}
              size="lg"
              className={`w-full text-lg ${
                event.is_attending
                  ? 'bg-muted hover:bg-muted/80 text-foreground'
                  : 'bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-700 text-primary-foreground'
              }`}
            >
              {event.is_attending ? 'Going ✓' : isFull ? 'Event Full' : 'Join Event'}
            </Button>
          )}
        </Card>

        {/* Attendees Section */}
        <Card className="bg-card/50 backdrop-blur-md border-border/20 p-6 space-y-4">
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Who's Going ({attendees.length})
          </h3>
          
          {attendees.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No attendees yet. Be the first to join!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex flex-col items-center gap-2 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all cursor-pointer"
                  onClick={() => navigate(`/profile/${attendee.user_id}`)}
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={attendee.profiles.profile_image} alt={attendee.profiles.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {attendee.profiles.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <p className="font-semibold text-foreground text-sm">{attendee.profiles.name}</p>
                      {attendee.profiles.verified && (
                        <CheckCircle className="w-3 h-3 text-pink-400 fill-pink-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EventDetail;
