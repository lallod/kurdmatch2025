-- Create landing_page_v2_translations table for multi-language support
CREATE TABLE IF NOT EXISTS landing_page_v2_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code VARCHAR NOT NULL,
  
  -- Hero Section
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_cta_text TEXT NOT NULL DEFAULT 'Join KurdMatch Today',
  hero_image_url TEXT NOT NULL,
  
  -- 8 Features Section
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Global Community Section
  community_title TEXT NOT NULL,
  community_subtitle TEXT NOT NULL,
  community_dialects JSONB NOT NULL DEFAULT '[]'::jsonb,
  community_description TEXT NOT NULL,
  community_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- How It Works Section
  how_it_works_title TEXT NOT NULL DEFAULT 'How It Works',
  how_it_works_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- CTA Section
  cta_title TEXT NOT NULL,
  cta_subtitle TEXT,
  cta_button_text TEXT NOT NULL,
  
  -- Footer
  footer_text TEXT NOT NULL,
  footer_links JSONB DEFAULT '[]'::jsonb,
  
  -- Meta
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(language_code)
);

-- Enable RLS
ALTER TABLE landing_page_v2_translations ENABLE ROW LEVEL SECURITY;

-- Public can read published translations
CREATE POLICY "Public can read published translations"
  ON landing_page_v2_translations FOR SELECT
  USING (is_published = true);

-- Super admins have full access
CREATE POLICY "Super admins have full access to v2 translations"
  ON landing_page_v2_translations FOR ALL
  USING (is_super_admin(auth.uid()));

-- Create storage bucket for landing page images
INSERT INTO storage.buckets (id, name, public)
VALUES ('landing-page-v2-images', 'landing-page-v2-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view landing v2 images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'landing-page-v2-images');

CREATE POLICY "Super admins can upload landing v2 images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'landing-page-v2-images' AND is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update landing v2 images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'landing-page-v2-images' AND is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete landing v2 images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'landing-page-v2-images' AND is_super_admin(auth.uid()));

-- Seed English content
INSERT INTO landing_page_v2_translations (
  language_code,
  hero_title,
  hero_subtitle,
  hero_cta_text,
  hero_image_url,
  features,
  community_title,
  community_subtitle,
  community_dialects,
  community_description,
  how_it_works_title,
  how_it_works_steps,
  cta_title,
  cta_subtitle,
  cta_button_text,
  footer_text,
  is_published
) VALUES (
  'english',
  'Find Your Kurdish Match - Connect Hearts Worldwide 💕',
  'The first platform connecting Kurdish hearts from all regions of Kurdistan and the global diaspora',
  'Join KurdMatch Today',
  '/assets/landing/hero-romance.jpg',
  '[
    {"id":"lover","title":"Find Your Kurdish Lover 💕","description":"Connect with Kurdish singles looking for meaningful relationships","icon":"Heart","image_url":"/assets/landing/feature-lover.jpg"},
    {"id":"travel","title":"Find Your Travel Mate ✈️","description":"Discover Kurdish travel companions to explore the world together","icon":"Plane","image_url":"/assets/landing/feature-travel.jpg"},
    {"id":"friends","title":"Find New Kurdish Friends 🌍","description":"Build lasting friendships within the global Kurdish community","icon":"Users","image_url":"/assets/landing/feature-friends.jpg"},
    {"id":"family","title":"Make a Kurdish Family 🏡","description":"Connect with those who share your vision of family and future","icon":"Home","image_url":"/assets/landing/feature-family.jpg"},
    {"id":"events","title":"Find Kurdish Events 🎉","description":"Discover and join Kurdish cultural events and celebrations","icon":"Calendar","image_url":"/assets/landing/feature-events.jpg"},
    {"id":"parties","title":"Find Kurdish Parties 🪩","description":"Connect at Kurdish social gatherings and celebrations","icon":"Music","image_url":"/assets/landing/feature-parties.jpg"},
    {"id":"picnic","title":"Find Kurdish Picnic Events 🧺","description":"Join outdoor gatherings and enjoy nature with Kurdish community","icon":"UtensilsCrossed","image_url":"/assets/landing/feature-picnic.jpg"},
    {"id":"cultural","title":"Explore Kurdish Cultural Events 🕊️","description":"Experience traditional Kurdish music, dance, and celebrations","icon":"Sparkles","image_url":"/assets/landing/feature-cultural.jpg"}
  ]'::jsonb,
  'Connect Across All Kurdish Regions',
  'Join a global community of Kurds from all dialects and regions',
  '["Kurmanji","Sorani","Pehlewani","Zazaki"]'::jsonb,
  'KurdMatch brings together Kurdish people from South, North, East, and West Kurdistan, as well as the diaspora across Europe, Americas, and beyond. No matter which dialect you speak or where you live, find your Kurdish connection here.',
  'How It Works',
  '[
    {"step":1,"title":"Create Your Profile","description":"Share your story, interests, and what makes you uniquely Kurdish","icon":"UserPlus"},
    {"step":2,"title":"Connect with Kurds Worldwide","description":"Browse profiles, send messages, and build meaningful connections","icon":"MessageCircle"},
    {"step":3,"title":"Start Your Journey","description":"Whether love, friendship, or community - your Kurdish connection awaits","icon":"Heart"}
  ]'::jsonb,
  'Ready to Connect with Your Kurdish Community?',
  'Join thousands of Kurds worldwide who have found meaningful connections',
  'Join KurdMatch Today',
  '© 2024 KurdMatch. Connecting Kurdish hearts worldwide.',
  true
);

-- Seed Kurdish Sorani content (RTL)
INSERT INTO landing_page_v2_translations (
  language_code,
  hero_title,
  hero_subtitle,
  hero_cta_text,
  hero_image_url,
  features,
  community_title,
  community_subtitle,
  community_dialects,
  community_description,
  how_it_works_title,
  how_it_works_steps,
  cta_title,
  cta_subtitle,
  cta_button_text,
  footer_text,
  is_published
) VALUES (
  'kurdish_sorani',
  'هاوتای کوردی خۆت بدۆزەرەوە - دڵەکان لە سەرانسەری جیهان بەیەکەوە ببەستەوە 💕',
  'یەکەم پلاتفۆرم بۆ بەستنەوەی دڵە کوردییەکان لە هەموو هەرێمەکانی کوردستان و دیاسپۆرای جیهانی',
  'ئێستا بەشداری کوردماچ بکە',
  '/assets/landing/hero-romance.jpg',
  '[
    {"id":"lover","title":"هاوسەرگیری کوردی بدۆزەرەوە 💕","description":"پەیوەندی بکە بە تاکە کوردەکانەوە کە بەدوای پەیوەندی واتاداردان","icon":"Heart","image_url":"/assets/landing/feature-lover.jpg"},
    {"id":"travel","title":"هاوڕێی گەشتکردن بدۆزەرەوە ✈️","description":"هاوڕێیانی کوردی گەشت بدۆزەرەوە بۆ گەڕان بە جیهاندا پێکەوە","icon":"Plane","image_url":"/assets/landing/feature-travel.jpg"},
    {"id":"friends","title":"هاوڕێی نوێی کوردی بدۆزەرەوە 🌍","description":"هاوڕێیەتی بەردەوام دروست بکە لەناو کۆمەڵگەی کوردی جیهانی","icon":"Users","image_url":"/assets/landing/feature-friends.jpg"},
    {"id":"family","title":"خێزانی کوردی دروست بکە 🏡","description":"پەیوەندی بکە بەوانەی کە هاوبیری تۆن لە دیدگای خێزان و داهاتوو","icon":"Home","image_url":"/assets/landing/feature-family.jpg"},
    {"id":"events","title":"بۆنەکانی کوردی بدۆزەرەوە 🎉","description":"بۆنە کلتووری و ئاهەنگەکانی کوردی بدۆزەرەوە و بەشداریان بکە","icon":"Calendar","image_url":"/assets/landing/feature-events.jpg"},
    {"id":"parties","title":"ئاهەنگی کوردی بدۆزەرەوە 🪩","description":"پەیوەندی بکە لە کۆبوونەوە کۆمەڵایەتی و ئاهەنگەکانی کوردیدا","icon":"Music","image_url":"/assets/landing/feature-parties.jpg"},
    {"id":"picnic","title":"بۆنەی پیکنیکی کوردی بدۆزەرەوە 🧺","description":"بەشداری کۆبوونەوەی دەرەوە بکە و لە سروشت بە کۆمەڵگەی کوردی چێژ ببینە","icon":"UtensilsCrossed","image_url":"/assets/landing/feature-picnic.jpg"},
    {"id":"cultural","title":"بۆنە کلتووریەکانی کوردی بگەڕێ 🕊️","description":"میوزیک و سەما و ئاهەنگە نەریتیەکانی کوردی تاقی بکەرەوە","icon":"Sparkles","image_url":"/assets/landing/feature-cultural.jpg"}
  ]'::jsonb,
  'پەیوەندی بکە بە هەموو هەرێمەکانی کوردستانەوە',
  'بەشداری کۆمەڵگەیەکی جیهانی بە لە کوردانی هەموو شێوەزمان و هەرێمەکان',
  '["کورمانجی","سۆرانی","پەهلەوانی","زازاکی"]'::jsonb,
  'کوردماچ کوردانی باشووری، باکووری، ڕۆژهەڵاتی و ڕۆژئاوای کوردستان و هەروەها دیاسپۆرای ئەورووپا و ئەمریکا و زیاتر لە یەکتر دەبەستێتەوە. گرنگ نییە کام شێوەزمان قسە دەکەیت یان لە کوێ دەژیت، پەیوەندی کوردی خۆت لێرە بدۆزەرەوە.',
  'چۆن کار دەکات',
  '[
    {"step":1,"title":"پرۆفایلەکەت دروست بکە","description":"چیرۆک و ئارەزووەکانت و ئەوەی بە جیاوازی کوردت دەکات بڵێ","icon":"UserPlus"},
    {"step":2,"title":"پەیوەندی بکە بە کوردەکانی جیهانەوە","description":"پرۆفایلەکان بگەڕێ، نامە بنێرە و پەیوەندی واتادار دروست بکە","icon":"MessageCircle"},
    {"step":3,"title":"گەشتەکەت دەست پێ بکە","description":"جا خۆشەویستی بێت، هاوڕێیەتی یان کۆمەڵگە - پەیوەندی کوردیت چاوەڕوانتە","icon":"Heart"}
  ]'::jsonb,
  'ئامادەیت پەیوەندی بکەیت بە کۆمەڵگەی کوردیەوە؟',
  'بەشداری هەزاران کورد لە سەرانسەری جیهان بکە کە پەیوەندی واتاداریان دۆزیوەتەوە',
  'ئێستا بەشداری کوردماچ بکە',
  '© ٢٠٢٤ کوردماچ. بەستنەوەی دڵە کوردییەکان لە سەرانسەری جیهان.',
  true
);

-- Seed Kurdish Kurmanci content
INSERT INTO landing_page_v2_translations (
  language_code,
  hero_title,
  hero_subtitle,
  hero_cta_text,
  hero_image_url,
  features,
  community_title,
  community_subtitle,
  community_dialects,
  community_description,
  how_it_works_title,
  how_it_works_steps,
  cta_title,
  cta_subtitle,
  cta_button_text,
  footer_text,
  is_published
) VALUES (
  'kurdish_kurmanci',
  'Hevalê Xwe Yê Kurdî Bibîne - Dilan Li Tevahiya Dinyayê Girê Bide 💕',
  'Platforma yekem a ku dilan kurdî ji hemû herêmên Kurdistanê û dîasporayê yekê dike',
  'Niha Beşdarî KurdMatch Bibe',
  '/assets/landing/hero-romance.jpg',
  '[
    {"id":"lover","title":"Evîndarê Xwe Yê Kurdî Bibîne 💕","description":"Bi yekên kurdî re têkilî daynin ku li pêwendiyên bi wate digerin","icon":"Heart","image_url":"/assets/landing/feature-lover.jpg"},
    {"id":"travel","title":"Hevalê Gerîna Xwe Bibîne ✈️","description":"Hevalên kurdî yên gerînê bibîne ji bo bi hev re dinyayê bigerin","icon":"Plane","image_url":"/assets/landing/feature-travel.jpg"},
    {"id":"friends","title":"Hevalên Nû Yên Kurdî Bibîne 🌍","description":"Di nav civata kurdiya cîhanî de hevaliyên domdar ava bike","icon":"Users","image_url":"/assets/landing/feature-friends.jpg"},
    {"id":"family","title":"Malbateke Kurdî Ava Bike 🏡","description":"Bi kesên ku dîtina te ya malbat û pêşerojê parve dikin têkilî daynin","icon":"Home","image_url":"/assets/landing/feature-family.jpg"},
    {"id":"events","title":"Bûyerên Kurdî Bibîne 🎉","description":"Bûyer û pîroziyên çandî yên kurdî bibîne û beşdarî bibin","icon":"Calendar","image_url":"/assets/landing/feature-events.jpg"},
    {"id":"parties","title":"Ahengên Kurdî Bibîne 🪩","description":"Di kom û pîroziyên civakî yên kurdî de têkilî daynin","icon":"Music","image_url":"/assets/landing/feature-parties.jpg"},
    {"id":"picnic","title":"Bûyerên Pîknîkê Yên Kurdî Bibîne 🧺","description":"Beşdarî komên derve bibin û bi civata kurdî re ji xwezayê kêfê bigirin","icon":"UtensilsCrossed","image_url":"/assets/landing/feature-picnic.jpg"},
    {"id":"cultural","title":"Bûyerên Çandî Yên Kurdî Vekolin 🕊️","description":"Mûzîk, govend û pîroziyên kevneşopî yên kurdî biceribînin","icon":"Sparkles","image_url":"/assets/landing/feature-cultural.jpg"}
  ]'::jsonb,
  'Bi Hemû Herêmên Kurdistanê Re Têkilî Daynin',
  'Beşdarî civata cîhanî ya kurdan ji hemû zarav û herêman bibin',
  '["Kurmancî","Soranî","Pehlewanî","Zazakî"]'::jsonb,
  'KurdMatch kurdan ji Başûr, Bakur, Rojhilat û Rojava Kurdistanê û her weha dîaspora li Ewropa, Amerîka û derveyî yekê dike. Ne girîng e hûn kîjan zarav dipeyivin an li ku dimînin, li vir têkiliya kurdî ya xwe bibînin.',
  'Çawa Dixebite',
  '[
    {"step":1,"title":"Profîla Xwe Ava Bikin","description":"Çîroka xwe, berjewendiyên xwe û tiştê ku we yekta kurdî dike parve bikin","icon":"UserPlus"},
    {"step":2,"title":"Bi Kurdên Li Tevahiya Dinyayê Re Têkilî Daynin","description":"Li profîlan binêrin, peyam bişînin û pêwendiyên bi wate ava bikin","icon":"MessageCircle"},
    {"step":3,"title":"Rêwîtiya Xwe Dest Pê Bikin","description":"Yan evîn, hevalî yan civat - têkiliya we ya kurdî li benda we ye","icon":"Heart"}
  ]'::jsonb,
  'Amade ne Hûn Bi Civata Xwe Ya Kurdî Re Têkilî Daynin?',
  'Beşdarî hezaran kurdan li tevahiya dinyayê bibin ku têkiliyên bi wate dîtine',
  'Niha Beşdarî KurdMatch Bibe',
  '© 2024 KurdMatch. Dilan kurdî li tevahiya dinyayê girê dide.',
  true
);

-- Seed Norwegian content
INSERT INTO landing_page_v2_translations (
  language_code,
  hero_title,
  hero_subtitle,
  hero_cta_text,
  hero_image_url,
  features,
  community_title,
  community_subtitle,
  community_dialects,
  community_description,
  how_it_works_title,
  how_it_works_steps,
  cta_title,
  cta_subtitle,
  cta_button_text,
  footer_text,
  is_published
) VALUES (
  'norwegian',
  'Finn Din Kurdiske Match - Koble Hjerter Verden Over 💕',
  'Den første plattformen som kobler kurdiske hjerter fra alle regioner av Kurdistan og den globale diasporaen',
  'Bli Medlem av KurdMatch I Dag',
  '/assets/landing/hero-romance.jpg',
  '[
    {"id":"lover","title":"Finn Din Kurdiske Kjæreste 💕","description":"Koble til med kurdiske singler som søker meningsfulle forhold","icon":"Heart","image_url":"/assets/landing/feature-lover.jpg"},
    {"id":"travel","title":"Finn Din Reisepartner ✈️","description":"Oppdag kurdiske reisekompanioner for å utforske verden sammen","icon":"Plane","image_url":"/assets/landing/feature-travel.jpg"},
    {"id":"friends","title":"Finn Nye Kurdiske Venner 🌍","description":"Bygg varige vennskap innenfor det globale kurdiske samfunnet","icon":"Users","image_url":"/assets/landing/feature-friends.jpg"},
    {"id":"family","title":"Skap en Kurdisk Familie 🏡","description":"Koble til med de som deler din visjon om familie og fremtid","icon":"Home","image_url":"/assets/landing/feature-family.jpg"},
    {"id":"events","title":"Finn Kurdiske Arrangementer 🎉","description":"Oppdag og delta i kurdiske kulturarrangementer og feiringer","icon":"Calendar","image_url":"/assets/landing/feature-events.jpg"},
    {"id":"parties","title":"Finn Kurdiske Fester 🪩","description":"Koble til på kurdiske sosiale sammenkomster og feiringer","icon":"Music","image_url":"/assets/landing/feature-parties.jpg"},
    {"id":"picnic","title":"Finn Kurdiske Piknik-arrangementer 🧺","description":"Bli med på utendørs sammenkomster og nyt naturen med det kurdiske samfunnet","icon":"UtensilsCrossed","image_url":"/assets/landing/feature-picnic.jpg"},
    {"id":"cultural","title":"Utforsk Kurdiske Kulturarrangementer 🕊️","description":"Opplev tradisjonell kurdisk musikk, dans og feiringer","icon":"Sparkles","image_url":"/assets/landing/feature-cultural.jpg"}
  ]'::jsonb,
  'Koble Til På Tvers av Alle Kurdiske Regioner',
  'Bli med i et globalt samfunn av kurder fra alle dialekter og regioner',
  '["Kurmanji","Sorani","Pehlewani","Zazaki"]'::jsonb,
  'KurdMatch samler kurdiske folk fra Sør-, Nord-, Øst- og Vest-Kurdistan, samt diasporaen over Europa, Amerika og utover. Uansett hvilken dialekt du snakker eller hvor du bor, finn din kurdiske forbindelse her.',
  'Hvordan Det Fungerer',
  '[
    {"step":1,"title":"Opprett Din Profil","description":"Del din historie, interesser og det som gjør deg unikt kurdisk","icon":"UserPlus"},
    {"step":2,"title":"Koble Til Med Kurder Verden Over","description":"Bla gjennom profiler, send meldinger og bygg meningsfulle forbindelser","icon":"MessageCircle"},
    {"step":3,"title":"Start Din Reise","description":"Enten det er kjærlighet, vennskap eller samfunn - din kurdiske forbindelse venter","icon":"Heart"}
  ]'::jsonb,
  'Klar Til Å Koble Til Med Ditt Kurdiske Samfunn?',
  'Bli med tusenvis av kurder verden over som har funnet meningsfulle forbindelser',
  'Bli Medlem av KurdMatch I Dag',
  '© 2024 KurdMatch. Kobler kurdiske hjerter verden over.',
  true
);

-- Seed German content
INSERT INTO landing_page_v2_translations (
  language_code,
  hero_title,
  hero_subtitle,
  hero_cta_text,
  hero_image_url,
  features,
  community_title,
  community_subtitle,
  community_dialects,
  community_description,
  how_it_works_title,
  how_it_works_steps,
  cta_title,
  cta_subtitle,
  cta_button_text,
  footer_text,
  is_published
) VALUES (
  'german',
  'Finde Dein Kurdisches Match - Verbinde Herzen Weltweit 💕',
  'Die erste Plattform, die kurdische Herzen aus allen Regionen Kurdistans und der globalen Diaspora verbindet',
  'Jetzt bei KurdMatch Anmelden',
  '/assets/landing/hero-romance.jpg',
  '[
    {"id":"lover","title":"Finde Deine Kurdische Liebe 💕","description":"Verbinde dich mit kurdischen Singles, die nach bedeutungsvollen Beziehungen suchen","icon":"Heart","image_url":"/assets/landing/feature-lover.jpg"},
    {"id":"travel","title":"Finde Deinen Reisepartner ✈️","description":"Entdecke kurdische Reisebegleiter, um die Welt gemeinsam zu erkunden","icon":"Plane","image_url":"/assets/landing/feature-travel.jpg"},
    {"id":"friends","title":"Finde Neue Kurdische Freunde 🌍","description":"Baue dauerhafte Freundschaften innerhalb der globalen kurdischen Gemeinschaft auf","icon":"Users","image_url":"/assets/landing/feature-friends.jpg"},
    {"id":"family","title":"Gründe eine Kurdische Familie 🏡","description":"Verbinde dich mit denen, die deine Vision von Familie und Zukunft teilen","icon":"Home","image_url":"/assets/landing/feature-family.jpg"},
    {"id":"events","title":"Finde Kurdische Veranstaltungen 🎉","description":"Entdecke und nimm an kurdischen Kulturveranstaltungen und Feiern teil","icon":"Calendar","image_url":"/assets/landing/feature-events.jpg"},
    {"id":"parties","title":"Finde Kurdische Partys 🪩","description":"Vernetze dich bei kurdischen gesellschaftlichen Zusammenkünften und Feiern","icon":"Music","image_url":"/assets/landing/feature-parties.jpg"},
    {"id":"picnic","title":"Finde Kurdische Picknick-Events 🧺","description":"Nimm an Outdoor-Treffen teil und genieße die Natur mit der kurdischen Gemeinschaft","icon":"UtensilsCrossed","image_url":"/assets/landing/feature-picnic.jpg"},
    {"id":"cultural","title":"Erkunde Kurdische Kulturveranstaltungen 🕊️","description":"Erlebe traditionelle kurdische Musik, Tanz und Feiern","icon":"Sparkles","image_url":"/assets/landing/feature-cultural.jpg"}
  ]'::jsonb,
  'Verbinde Dich Über Alle Kurdischen Regionen Hinweg',
  'Tritt einer globalen Gemeinschaft von Kurden aus allen Dialekten und Regionen bei',
  '["Kurmanji","Sorani","Pehlewani","Zazaki"]'::jsonb,
  'KurdMatch bringt kurdische Menschen aus Süd-, Nord-, Ost- und Westkurdistan sowie der Diaspora in Europa, Amerika und darüber hinaus zusammen. Egal welchen Dialekt du sprichst oder wo du lebst, finde hier deine kurdische Verbindung.',
  'Wie Es Funktioniert',
  '[
    {"step":1,"title":"Erstelle Dein Profil","description":"Teile deine Geschichte, Interessen und was dich einzigartig kurdisch macht","icon":"UserPlus"},
    {"step":2,"title":"Verbinde Dich Mit Kurden Weltweit","description":"Durchstöbere Profile, sende Nachrichten und baue bedeutungsvolle Verbindungen auf","icon":"MessageCircle"},
    {"step":3,"title":"Beginne Deine Reise","description":"Ob Liebe, Freundschaft oder Gemeinschaft - deine kurdische Verbindung wartet","icon":"Heart"}
  ]'::jsonb,
  'Bereit, Dich Mit Deiner Kurdischen Gemeinschaft Zu Verbinden?',
  'Schließe dich Tausenden von Kurden weltweit an, die bedeutungsvolle Verbindungen gefunden haben',
  'Jetzt bei KurdMatch Anmelden',
  '© 2024 KurdMatch. Verbindet kurdische Herzen weltweit.',
  true
);