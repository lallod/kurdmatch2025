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
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-xl">Event not found</div>
      </div>
    );
  }

  const isFull = event.max_attendees && event.attendees_count >= event.max_attendees;
  const isHost = currentUserId === event.user_id;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold text-white">Event Details</h1>
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
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 space-y-6">
          {/* Host Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar 
                className="w-14 h-14 cursor-pointer hover:ring-2 hover:ring-white/40 transition-all"
                onClick={() => navigate(`/profile/${event.user_id}`)}
              >
                <AvatarImage src={event.profiles.profile_image} alt={event.profiles.name} />
                <AvatarFallback className="bg-purple-500 text-white text-xl">
                  {event.profiles.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/profile/${event.user_id}`)}
                    className="font-semibold text-white text-lg hover:underline"
                  >
                    {event.profiles.name}
                  </button>
                  {event.profiles.verified && (
                    <CheckCircle className="w-5 h-5 text-pink-400 fill-pink-400" />
                  )}
                </div>
                <p className="text-white/70">Event Host</p>
              </div>
            </div>
            {event.category && (
              <Badge className="bg-pink-500/80 text-white border-0 text-base px-4 py-1">
                {event.category}
              </Badge>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white">{event.title}</h2>
            <p className="text-white/90 text-lg leading-relaxed">{event.description}</p>
          </div>

          {/* Event Details */}
          <div className="space-y-3 pt-4 border-t border-white/20">
            <div className="flex items-start gap-3 text-white">
              <Calendar className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Date & Time</p>
                <p className="text-white/80">{format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}</p>
                <p className="text-white/80">{format(new Date(event.event_date), 'h:mm a')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <MapPin className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-white/80">{event.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <Users className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Attendees</p>
                <p className="text-white/80">
                  {event.attendees_count} going
                  {event.max_attendees && ` • ${event.max_attendees} max capacity`}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <Clock className="w-6 h-6 text-pink-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Created</p>
                <p className="text-white/80">{format(new Date(event.created_at), 'MMM d, yyyy')}</p>
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
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
              }`}
            >
              {event.is_attending ? 'Going ✓' : isFull ? 'Event Full' : 'Join Event'}
            </Button>
          )}
        </Card>

        {/* Attendees Section */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 space-y-4">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-pink-400" />
            Who's Going ({attendees.length})
          </h3>
          
          {attendees.length === 0 ? (
            <p className="text-white/70 text-center py-8">No attendees yet. Be the first to join!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {attendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => navigate(`/profile/${attendee.user_id}`)}
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={attendee.profiles.profile_image} alt={attendee.profiles.name} />
                    <AvatarFallback className="bg-purple-500 text-white">
                      {attendee.profiles.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <p className="font-semibold text-white text-sm">{attendee.profiles.name}</p>
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
