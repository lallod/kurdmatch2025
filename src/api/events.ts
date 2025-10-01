import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  image_url?: string;
  category?: string;
  max_attendees?: number;
  attendees_count: number;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    name: string;
    profile_image: string;
    verified?: boolean;
  };
  is_attending?: boolean;
}

// Get all upcoming events
export const getEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      profiles (
        id,
        name,
        profile_image
      )
    `)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(50);

  if (error) throw error;

  // Check which events current user is attending
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: attendees } = await supabase
      .from('event_attendees')
      .select('event_id')
      .eq('user_id', user.id);

    const attendingIds = new Set(attendees?.map(a => a.event_id) || []);
    return (data || []).map(event => ({
      ...event,
      is_attending: attendingIds.has(event.id)
    }));
  }

  return data || [];
};

// Create a new event
export const createEvent = async (
  title: string,
  description: string,
  location: string,
  eventDate: string,
  category?: string,
  maxAttendees?: number,
  imageUrl?: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          title,
          description,
          location,
          event_date: new Date(eventDate).toISOString(),
          category,
          max_attendees: maxAttendees,
          image_url: imageUrl
        })
        .select()
        .single();

  if (error) throw error;
  return data;
};

// Join an event
export const joinEvent = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if event is full
  const { data: event } = await supabase
    .from('events')
    .select('max_attendees, attendees_count')
    .eq('id', eventId)
    .single();

  if (event?.max_attendees && event.attendees_count >= event.max_attendees) {
    throw new Error('Event is full');
  }

  const { error } = await supabase
    .from('event_attendees')
    .insert({ event_id: eventId, user_id: user.id });

  if (error) throw error;

  // Increment attendees count
  await supabase
    .from('events')
    .update({ attendees_count: (event?.attendees_count || 0) + 1 })
    .eq('id', eventId);
};

// Leave an event
export const leaveEvent = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) throw error;

  // Decrement attendees count
  const { data: event } = await supabase
    .from('events')
    .select('attendees_count')
    .eq('id', eventId)
    .single();

  if (event) {
    await supabase
      .from('events')
      .update({ attendees_count: Math.max(0, event.attendees_count - 1) })
      .eq('id', eventId);
  }
};

// Get events by category
export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      profiles (
        id,
        name,
        profile_image
      )
    `)
    .eq('category', category)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data || [];
};

// Get user's attending events
export const getUserEvents = async (): Promise<Event[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: attendees } = await supabase
    .from('event_attendees')
    .select('event_id')
    .eq('user_id', user.id);

  if (!attendees || attendees.length === 0) return [];

  const eventIds = attendees.map(a => a.event_id);

  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      profiles (
        id,
        name,
        profile_image
      )
    `)
    .in('id', eventIds)
    .order('event_date', { ascending: true });

  if (error) throw error;
  return (data || []).map(event => ({ ...event, is_attending: true }));
};
