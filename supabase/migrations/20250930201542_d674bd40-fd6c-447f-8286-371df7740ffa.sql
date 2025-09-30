-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  attendees_count INTEGER NOT NULL DEFAULT 0,
  max_attendees INTEGER,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_attendees table
CREATE TABLE public.event_attendees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Anyone can view events"
ON public.events FOR SELECT
USING (true);

CREATE POLICY "Users can create events"
ON public.events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
ON public.events FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
ON public.events FOR DELETE
USING (auth.uid() = user_id);

-- Event attendees policies
CREATE POLICY "Anyone can view event attendees"
ON public.event_attendees FOR SELECT
USING (true);

CREATE POLICY "Users can join events"
ON public.event_attendees FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave events"
ON public.event_attendees FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON public.event_attendees(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Generate sample events
INSERT INTO events (user_id, title, description, event_date, location, category, attendees_count, max_attendees)
SELECT 
  id,
  CASE floor(random() * 10)
    WHEN 0 THEN 'Kurdish Music Night'
    WHEN 1 THEN 'Traditional Dance Workshop'
    WHEN 2 THEN 'Kurdish Cuisine Cooking Class'
    WHEN 3 THEN 'Poetry Reading Evening'
    WHEN 4 THEN 'Newroz Celebration'
    WHEN 5 THEN 'Kurdish Language Exchange'
    WHEN 6 THEN 'Mountain Hiking Trip'
    WHEN 7 THEN 'Cultural Heritage Tour'
    WHEN 8 THEN 'Art Exhibition Opening'
    ELSE 'Community Gathering'
  END,
  CASE floor(random() * 5)
    WHEN 0 THEN 'Join us for an evening celebrating Kurdish music and culture. Live performances and traditional instruments!'
    WHEN 1 THEN 'Learn traditional Kurdish dances with experienced instructors. All levels welcome!'
    WHEN 2 THEN 'Discover the secrets of authentic Kurdish cuisine. Hands-on cooking experience.'
    WHEN 3 THEN 'A beautiful evening of Kurdish poetry, stories, and meaningful conversations.'
    ELSE 'Come together with the community to celebrate our rich cultural heritage!'
  END,
  now() + (random() * interval '60 days'),
  CASE floor(random() * 5)
    WHEN 0 THEN 'Erbil Cultural Center'
    WHEN 1 THEN 'Sulaymaniyah Community Hall'
    WHEN 2 THEN 'Duhok Heritage Museum'
    WHEN 3 THEN 'Qamishli Arts Center'
    ELSE 'Kurdistan Community Center'
  END,
  CASE floor(random() * 5)
    WHEN 0 THEN 'Music'
    WHEN 1 THEN 'Culture'
    WHEN 2 THEN 'Food'
    WHEN 3 THEN 'Art'
    ELSE 'Community'
  END,
  floor(random() * 50) + 10,
  floor(random() * 100) + 20
FROM profiles
ORDER BY random()
LIMIT 15;