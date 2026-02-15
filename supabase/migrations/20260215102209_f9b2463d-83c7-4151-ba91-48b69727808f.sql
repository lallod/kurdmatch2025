
-- Virtual Gift Catalog
CREATE TABLE public.virtual_gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '🎁',
  description text,
  price_coins integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'general',
  is_premium boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.virtual_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active gifts"
  ON public.virtual_gifts FOR SELECT
  USING (active = true);

CREATE POLICY "Super admins can manage gifts"
  ON public.virtual_gifts FOR ALL
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin'));

-- Sent Gifts
CREATE TABLE public.sent_gifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  gift_id uuid NOT NULL REFERENCES public.virtual_gifts(id),
  message text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sent_gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can send gifts"
  ON public.sent_gifts FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their sent or received gifts"
  ON public.sent_gifts FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Recipients can mark gifts as read"
  ON public.sent_gifts FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- User coin balance
CREATE TABLE public.user_coins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  balance integer NOT NULL DEFAULT 100,
  total_earned integer NOT NULL DEFAULT 100,
  total_spent integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coins"
  ON public.user_coins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own coins"
  ON public.user_coins FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own coins"
  ON public.user_coins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Date Proposals
CREATE TABLE public.date_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  proposed_date timestamptz NOT NULL,
  location text,
  activity text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled')),
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.date_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create proposals"
  ON public.date_proposals FOR INSERT
  WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Users can view their proposals"
  ON public.date_proposals FOR SELECT
  USING (auth.uid() = proposer_id OR auth.uid() = recipient_id);

CREATE POLICY "Proposer can cancel, recipient can accept/decline"
  ON public.date_proposals FOR UPDATE
  USING (auth.uid() = proposer_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = proposer_id OR auth.uid() = recipient_id);

-- Seed default gift catalog
INSERT INTO public.virtual_gifts (name, emoji, description, price_coins, category, sort_order) VALUES
  ('Rose', '🌹', 'A beautiful red rose', 10, 'romantic', 1),
  ('Heart', '❤️', 'Send your love', 15, 'romantic', 2),
  ('Chocolate Box', '🍫', 'Sweet treats for someone special', 20, 'romantic', 3),
  ('Teddy Bear', '🧸', 'A cuddly teddy bear', 25, 'romantic', 4),
  ('Diamond Ring', '💍', 'For that special someone', 100, 'luxury', 5),
  ('Bouquet', '💐', 'A beautiful flower bouquet', 30, 'romantic', 6),
  ('Coffee', '☕', 'Virtual coffee date', 5, 'casual', 7),
  ('Pizza', '🍕', 'Share a virtual pizza', 8, 'casual', 8),
  ('Star', '⭐', 'You are a star!', 12, 'compliment', 9),
  ('Crown', '👑', 'King or Queen of my heart', 50, 'luxury', 10),
  ('Sparkles', '✨', 'You make everything sparkle', 10, 'compliment', 11),
  ('Rocket', '🚀', 'To the moon and back', 15, 'fun', 12),
  ('Music', '🎵', 'A song for you', 8, 'fun', 13),
  ('Sunrise', '🌅', 'A beautiful sunrise', 20, 'nature', 14),
  ('Butterfly', '🦋', 'You give me butterflies', 12, 'nature', 15);
