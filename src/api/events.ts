import { supabase } from "@/integrations/supabase/client";

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url?: string;
  attendees_count: number;
  max_attendees?: number;
  category?: string;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    name: string;
    profile_image: string;
    verified: boolean;
  };
  is_attending?: boolean;
}

export const getEvents = async (): Promise<Event[]> => {
  const { data: events, error } = await supabase
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

    const attendingEventIds = new Set(attendees?.map(a => a.event_id) || []);
    return (events || []).map(event => ({
      ...event,
      is_attending: attendingEventIds.has(event.id)
    }));
  }

  return events || [];
};

export const createEvent = async (
  title: string,
  description: string,
  eventDate: string,
  location: string,
  imageUrl?: string,
  category?: string,
  maxAttendees?: number
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      title,
      description,
      event_date: eventDate,
      location,
      image_url: imageUrl,
      category,
      max_attendees: maxAttendees
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinEvent = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('event_attendees')
    .insert({ event_id: eventId, user_id: user.id });

  if (error) throw error;

  // Increment attendees count
  const { data: event } = await supabase
    .from('events')
    .select('attendees_count')
    .eq('id', eventId)
    .single();

  if (event) {
    await supabase
      .from('events')
      .update({ attendees_count: event.attendees_count + 1 })
      .eq('id', eventId);
  }
};

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
