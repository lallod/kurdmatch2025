-- Comprehensive Translation System Migration - Fixed
-- Adding 300+ translation keys across 5 languages (English, Kurdish Sorani, Kurdish Kurmanci, Norwegian, German)
-- Categories: discovery, messages, profile, swipe, settings, notifications, validation, errors, filters, attributes, actions

-- ============================================
-- DISCOVERY PAGE TRANSLATIONS
-- ============================================

INSERT INTO app_translations (language_code, translation_key, translation_value, category, needs_review, auto_translated) VALUES
('english', 'discovery.header.title', 'Discover People', 'discovery', false, false),
('kurdish_sorani', 'discovery.header.title', 'دۆزینەوەی خەڵک', 'discovery', true, true),
('kurdish_kurmanci', 'discovery.header.title', 'Kesên Bibîne', 'discovery', true, true),
('norwegian', 'discovery.header.title', 'Oppdag Folk', 'discovery', true, true),
('german', 'discovery.header.title', 'Menschen Entdecken', 'discovery', true, true),

('english', 'discovery.header.subtitle', 'Find your perfect match in our community', 'discovery', false, false),
('kurdish_sorani', 'discovery.header.subtitle', 'هاوتای تەواوی خۆت لە کۆمەڵگەکەماندا بدۆزەرەوە', 'discovery', true, true),
('kurdish_kurmanci', 'discovery.header.subtitle', 'Di civata me de hevalta xwe ya bêkêmasî bibîne', 'discovery', true, true),
('norwegian', 'discovery.header.subtitle', 'Finn din perfekte match i vårt samfunn', 'discovery', true, true),
('german', 'discovery.header.subtitle', 'Finden Sie Ihren perfekten Partner in unserer Community', 'discovery', true, true),

('english', 'discovery.filters.active', 'Active Filters', 'discovery', false, false),
('kurdish_sorani', 'discovery.filters.active', 'فلتەرە چالاکەکان', 'discovery', true, true),
('kurdish_kurmanci', 'discovery.filters.active', 'Fîltreyên Çalak', 'discovery', true, true),
('norwegian', 'discovery.filters.active', 'Aktive Filtre', 'discovery', true, true),
('german', 'discovery.filters.active', 'Aktive Filter', 'discovery', true, true),

('english', 'discovery.filters.reset', 'Reset Filters', 'discovery', false, false),
('kurdish_sorani', 'discovery.filters.reset', 'ڕێکخستنەوەی فلتەرەکان', 'discovery', true, true),
('kurdish_kurmanci', 'discovery.filters.reset', 'Fîltreyan Nû Bike', 'discovery', true, true),
('norwegian', 'discovery.filters.reset', 'Tilbakestill Filtre', 'discovery', true, true),
('german', 'discovery.filters.reset', 'Filter Zurücksetzen', 'discovery', true, true),

('english', 'discovery.filters.apply', 'Apply Filters', 'discovery', false, false),
('kurdish_sorani', 'discovery.filters.apply', 'جێبەجێکردنی فلتەرەکان', 'discovery', true, true),
('kurdish_kurmanci', 'discovery.filters.apply', 'Fîltreyan Bicîh Bîne', 'discovery', true, true),
('norwegian', 'discovery.filters.apply', 'Bruk Filtre', 'discovery', true, true),
('german', 'discovery.filters.apply', 'Filter Anwenden', 'discovery', true, true),

-- FILTER OPTIONS - REGIONS
('english', 'filters.regions.all', 'All Regions', 'filters', false, false),
('kurdish_sorani', 'filters.regions.all', 'هەموو هەرێمەکان', 'filters', true, true),
('kurdish_kurmanci', 'filters.regions.all', 'Hemû Herêm', 'filters', true, true),
('norwegian', 'filters.regions.all', 'Alle Regioner', 'filters', true, true),
('german', 'filters.regions.all', 'Alle Regionen', 'filters', true, true),

('english', 'filters.regions.south_kurdistan', 'South Kurdistan', 'filters', false, false),
('kurdish_sorani', 'filters.regions.south_kurdistan', 'باشووری کوردستان', 'filters', false, false),
('kurdish_kurmanci', 'filters.regions.south_kurdistan', 'Kurdistana Başûr', 'filters', false, false),
('norwegian', 'filters.regions.south_kurdistan', 'Sør-Kurdistan', 'filters', true, true),
('german', 'filters.regions.south_kurdistan', 'Südkurdistan', 'filters', true, true),

('english', 'filters.regions.north_kurdistan', 'North Kurdistan', 'filters', false, false),
('kurdish_sorani', 'filters.regions.north_kurdistan', 'باکووری کوردستان', 'filters', false, false),
('kurdish_kurmanci', 'filters.regions.north_kurdistan', 'Kurdistana Bakur', 'filters', false, false),
('norwegian', 'filters.regions.north_kurdistan', 'Nord-Kurdistan', 'filters', true, true),
('german', 'filters.regions.north_kurdistan', 'Nordkurdistan', 'filters', true, true),

('english', 'filters.regions.west_kurdistan', 'West Kurdistan', 'filters', false, false),
('kurdish_sorani', 'filters.regions.west_kurdistan', 'ڕۆژاوای کوردستان', 'filters', false, false),
('kurdish_kurmanci', 'filters.regions.west_kurdistan', 'Kurdistana Rojava', 'filters', false, false),
('norwegian', 'filters.regions.west_kurdistan', 'Vest-Kurdistan', 'filters', true, true),
('german', 'filters.regions.west_kurdistan', 'Westkurdistan', 'filters', true, true),

('english', 'filters.regions.east_kurdistan', 'East Kurdistan', 'filters', false, false),
('kurdish_sorani', 'filters.regions.east_kurdistan', 'ڕۆژهەڵاتی کوردستان', 'filters', false, false),
('kurdish_kurmanci', 'filters.regions.east_kurdistan', 'Kurdistana Rojhilat', 'filters', false, false),
('norwegian', 'filters.regions.east_kurdistan', 'Øst-Kurdistan', 'filters', true, true),
('german', 'filters.regions.east_kurdistan', 'Ostkurdistan', 'filters', true, true),

-- FILTER OPTIONS - RELIGIONS
('english', 'filters.religions.all', 'All Religions', 'filters', false, false),
('kurdish_sorani', 'filters.religions.all', 'هەموو ئایینەکان', 'filters', true, true),
('kurdish_kurmanci', 'filters.religions.all', 'Hemû Ol', 'filters', true, true),
('norwegian', 'filters.religions.all', 'Alle Religioner', 'filters', true, true),
('german', 'filters.religions.all', 'Alle Religionen', 'filters', true, true),

('english', 'filters.religions.muslim', 'Muslim', 'filters', false, false),
('kurdish_sorani', 'filters.religions.muslim', 'موسڵمان', 'filters', false, false),
('kurdish_kurmanci', 'filters.religions.muslim', 'Misilman', 'filters', false, false),
('norwegian', 'filters.religions.muslim', 'Muslim', 'filters', true, true),
('german', 'filters.religions.muslim', 'Muslimisch', 'filters', true, true),

('english', 'filters.religions.christian', 'Christian', 'filters', false, false),
('kurdish_sorani', 'filters.religions.christian', 'مەسیحی', 'filters', false, false),
('kurdish_kurmanci', 'filters.religions.christian', 'Xirîstîyan', 'filters', false, false),
('norwegian', 'filters.religions.christian', 'Kristen', 'filters', true, true),
('german', 'filters.religions.christian', 'Christlich', 'filters', true, true),

('english', 'filters.religions.yazidi', 'Yazidi', 'filters', false, false),
('kurdish_sorani', 'filters.religions.yazidi', 'ئێزیدی', 'filters', false, false),
('kurdish_kurmanci', 'filters.religions.yazidi', 'Êzîdî', 'filters', false, false),
('norwegian', 'filters.religions.yazidi', 'Yezidi', 'filters', true, true),
('german', 'filters.religions.yazidi', 'Jesidisch', 'filters', true, true),

('english', 'filters.religions.secular', 'Secular', 'filters', false, false),
('kurdish_sorani', 'filters.religions.secular', 'دینسزی', 'filters', true, true),
('kurdish_kurmanci', 'filters.religions.secular', 'Sekuler', 'filters', true, true),
('norwegian', 'filters.religions.secular', 'Sekulær', 'filters', true, true),
('german', 'filters.religions.secular', 'Säkular', 'filters', true, true),

-- FILTER OPTIONS - BODY TYPES
('english', 'filters.body_types.all', 'All Body Types', 'filters', false, false),
('kurdish_sorani', 'filters.body_types.all', 'هەموو جۆرەکانی جەستە', 'filters', true, true),
('kurdish_kurmanci', 'filters.body_types.all', 'Hemû Cureyên Laş', 'filters', true, true),
('norwegian', 'filters.body_types.all', 'Alle Kroppstyper', 'filters', true, true),
('german', 'filters.body_types.all', 'Alle Körpertypen', 'filters', true, true),

('english', 'filters.body_types.slim', 'Slim', 'filters', false, false),
('kurdish_sorani', 'filters.body_types.slim', 'باریک', 'filters', false, false),
('kurdish_kurmanci', 'filters.body_types.slim', 'Zirav', 'filters', false, false),
('norwegian', 'filters.body_types.slim', 'Slank', 'filters', true, true),
('german', 'filters.body_types.slim', 'Schlank', 'filters', true, true),

('english', 'filters.body_types.average', 'Average', 'filters', false, false),
('kurdish_sorani', 'filters.body_types.average', 'مامناوەند', 'filters', false, false),
('kurdish_kurmanci', 'filters.body_types.average', 'Navîn', 'filters', false, false),
('norwegian', 'filters.body_types.average', 'Gjennomsnittlig', 'filters', true, true),
('german', 'filters.body_types.average', 'Durchschnittlich', 'filters', true, true),

('english', 'filters.body_types.athletic', 'Athletic', 'filters', false, false),
('kurdish_sorani', 'filters.body_types.athletic', 'وەرزشی', 'filters', false, false),
('kurdish_kurmanci', 'filters.body_types.athletic', 'Werzîşî', 'filters', false, false),
('norwegian', 'filters.body_types.athletic', 'Atletisk', 'filters', true, true),
('german', 'filters.body_types.athletic', 'Athletisch', 'filters', true, true),

('english', 'filters.body_types.muscular', 'Muscular', 'filters', false, false),
('kurdish_sorani', 'filters.body_types.muscular', 'ماسوولکەدار', 'filters', true, true),
('kurdish_kurmanci', 'filters.body_types.muscular', 'Masûledar', 'filters', true, true),
('norwegian', 'filters.body_types.muscular', 'Muskuløs', 'filters', true, true),
('german', 'filters.body_types.muscular', 'Muskulös', 'filters', true, true),

('english', 'filters.body_types.curvy', 'Curvy', 'filters', false, false),
('kurdish_sorani', 'filters.body_types.curvy', 'خولاوی', 'filters', true, true),
('kurdish_kurmanci', 'filters.body_types.curvy', 'Xulawî', 'filters', true, true),
('norwegian', 'filters.body_types.curvy', 'Kurvet', 'filters', true, true),
('german', 'filters.body_types.curvy', 'Kurvig', 'filters', true, true),

-- ============================================
-- MESSAGES PAGE TRANSLATIONS
-- ============================================
('english', 'messages.header.title', 'Messages', 'messages', false, false),
('kurdish_sorani', 'messages.header.title', 'نامەکان', 'messages', false, false),
('kurdish_kurmanci', 'messages.header.title', 'Mesaj', 'messages', false, false),
('norwegian', 'messages.header.title', 'Meldinger', 'messages', true, true),
('german', 'messages.header.title', 'Nachrichten', 'messages', true, true),

('english', 'messages.tabs.matches', 'New Matches', 'messages', false, false),
('kurdish_sorani', 'messages.tabs.matches', 'هاوتاکانی نوێ', 'messages', true, true),
('kurdish_kurmanci', 'messages.tabs.matches', 'Hevtayên Nû', 'messages', true, true),
('norwegian', 'messages.tabs.matches', 'Nye Matcher', 'messages', true, true),
('german', 'messages.tabs.matches', 'Neue Matches', 'messages', true, true),

('english', 'messages.tabs.conversations', 'Conversations', 'messages', false, false),
('kurdish_sorani', 'messages.tabs.conversations', 'گفتووگۆکان', 'messages', false, false),
('kurdish_kurmanci', 'messages.tabs.conversations', 'Axaftin', 'messages', false, false),
('norwegian', 'messages.tabs.conversations', 'Samtaler', 'messages', true, true),
('german', 'messages.tabs.conversations', 'Unterhaltungen', 'messages', true, true),

('english', 'messages.status.online', 'Online', 'messages', false, false),
('kurdish_sorani', 'messages.status.online', 'سەرهێڵ', 'messages', false, false),
('kurdish_kurmanci', 'messages.status.online', 'Serhêl', 'messages', false, false),
('norwegian', 'messages.status.online', 'Pålogget', 'messages', true, true),
('german', 'messages.status.online', 'Online', 'messages', true, true),

('english', 'messages.status.offline', 'Offline', 'messages', false, false),
('kurdish_sorani', 'messages.status.offline', 'دەرهێڵ', 'messages', false, false),
('kurdish_kurmanci', 'messages.status.offline', 'Dernehêl', 'messages', false, false),
('norwegian', 'messages.status.offline', 'Frakoblet', 'messages', true, true),
('german', 'messages.status.offline', 'Offline', 'messages', true, true),

('english', 'messages.status.typing', 'Typing...', 'messages', false, false),
('kurdish_sorani', 'messages.status.typing', 'نووسینەوە...', 'messages', false, false),
('kurdish_kurmanci', 'messages.status.typing', 'Dinivîse...', 'messages', false, false),
('norwegian', 'messages.status.typing', 'Skriver...', 'messages', true, true),
('german', 'messages.status.typing', 'Schreibt...', 'messages', true, true),

('english', 'messages.actions.send', 'Send Message', 'messages', false, false),
('kurdish_sorani', 'messages.actions.send', 'ناردنی نامە', 'messages', false, false),
('kurdish_kurmanci', 'messages.actions.send', 'Mesaj Bişîne', 'messages', false, false),
('norwegian', 'messages.actions.send', 'Send Melding', 'messages', true, true),
('german', 'messages.actions.send', 'Nachricht Senden', 'messages', true, true),

('english', 'messages.actions.block', 'Block User', 'messages', false, false),
('kurdish_sorani', 'messages.actions.block', 'بلۆککردنی بەکارهێنەر', 'messages', false, false),
('kurdish_kurmanci', 'messages.actions.block', 'Bikarhêner Asteng Bike', 'messages', false, false),
('norwegian', 'messages.actions.block', 'Blokker Bruker', 'messages', true, true),
('german', 'messages.actions.block', 'Benutzer Blockieren', 'messages', true, true),

('english', 'messages.actions.report', 'Report Conversation', 'messages', false, false),
('kurdish_sorani', 'messages.actions.report', 'گوزارشتکردنی گفتووگۆ', 'messages', true, true),
('kurdish_kurmanci', 'messages.actions.report', 'Axaftinê Rapor Bike', 'messages', true, true),
('norwegian', 'messages.actions.report', 'Rapporter Samtale', 'messages', true, true),
('german', 'messages.actions.report', 'Unterhaltung Melden', 'messages', true, true),

('english', 'messages.empty.title', 'No conversations yet', 'messages', false, false),
('kurdish_sorani', 'messages.empty.title', 'هێشتا هیچ گفتووگۆیەک نییە', 'messages', true, true),
('kurdish_kurmanci', 'messages.empty.title', 'Hîn tu axaftin tune', 'messages', true, true),
('norwegian', 'messages.empty.title', 'Ingen samtaler ennå', 'messages', true, true),
('german', 'messages.empty.title', 'Noch keine Unterhaltungen', 'messages', true, true),

('english', 'messages.empty.subtitle', 'Start chatting with your matches', 'messages', false, false),
('kurdish_sorani', 'messages.empty.subtitle', 'دەستپێبکە بە گفتووگۆ لەگەڵ هاوتاکانت', 'messages', true, true),
('kurdish_kurmanci', 'messages.empty.subtitle', 'Bi hevtayên xwe re dest bi axaftinê bike', 'messages', true, true),
('norwegian', 'messages.empty.subtitle', 'Begynn å chatte med dine matcher', 'messages', true, true),
('german', 'messages.empty.subtitle', 'Beginnen Sie ein Gespräch mit Ihren Matches', 'messages', true, true),

-- ============================================
-- PROFILE PAGE TRANSLATIONS
-- ============================================
('english', 'profile.header.title', 'My Profile', 'profile', false, false),
('kurdish_sorani', 'profile.header.title', 'پرۆفایلی من', 'profile', false, false),
('kurdish_kurmanci', 'profile.header.title', 'Profîla Min', 'profile', false, false),
('norwegian', 'profile.header.title', 'Min Profil', 'profile', true, true),
('german', 'profile.header.title', 'Mein Profil', 'profile', true, true),

('english', 'profile.completion.title', 'Profile Completion', 'profile', false, false),
('kurdish_sorani', 'profile.completion.title', 'تەواوکردنی پرۆفایل', 'profile', true, true),
('kurdish_kurmanci', 'profile.completion.title', 'Temamkirina Profîlê', 'profile', true, true),
('norwegian', 'profile.completion.title', 'Profilfullførelse', 'profile', true, true),
('german', 'profile.completion.title', 'Profilvollständigkeit', 'profile', true, true),

('english', 'profile.status.verified', 'Verified Account', 'profile', false, false),
('kurdish_sorani', 'profile.status.verified', 'هەژماری پشتڕاستکراوە', 'profile', true, true),
('kurdish_kurmanci', 'profile.status.verified', 'Hesabê Piştrastandî', 'profile', true, true),
('norwegian', 'profile.status.verified', 'Verifisert Konto', 'profile', true, true),
('german', 'profile.status.verified', 'Verifiziertes Konto', 'profile', true, true),

('english', 'profile.stats.views', 'Views', 'profile', false, false),
('kurdish_sorani', 'profile.stats.views', 'بینینەکان', 'profile', false, false),
('kurdish_kurmanci', 'profile.stats.views', 'Dîtin', 'profile', false, false),
('norwegian', 'profile.stats.views', 'Visninger', 'profile', true, true),
('german', 'profile.stats.views', 'Ansichten', 'profile', true, true),

('english', 'profile.stats.likes', 'Likes', 'profile', false, false),
('kurdish_sorani', 'profile.stats.likes', 'پەسەندکردنەکان', 'profile', false, false),
('kurdish_kurmanci', 'profile.stats.likes', 'Hez', 'profile', false, false),
('norwegian', 'profile.stats.likes', 'Liker', 'profile', true, true),
('german', 'profile.stats.likes', 'Likes', 'profile', true, true),

('english', 'profile.stats.matches', 'Matches', 'profile', false, false),
('kurdish_sorani', 'profile.stats.matches', 'هاوتاکان', 'profile', false, false),
('kurdish_kurmanci', 'profile.stats.matches', 'Hevta', 'profile', false, false),
('norwegian', 'profile.stats.matches', 'Matcher', 'profile', true, true),
('german', 'profile.stats.matches', 'Matches', 'profile', true, true),

('english', 'profile.actions.edit', 'Edit Profile', 'profile', false, false),
('kurdish_sorani', 'profile.actions.edit', 'دەستکاریکردنی پرۆفایل', 'profile', false, false),
('kurdish_kurmanci', 'profile.actions.edit', 'Profîlê Biguherîne', 'profile', false, false),
('norwegian', 'profile.actions.edit', 'Rediger Profil', 'profile', true, true),
('german', 'profile.actions.edit', 'Profil Bearbeiten', 'profile', true, true),

('english', 'profile.actions.upload_photo', 'Upload Photo', 'profile', false, false),
('kurdish_sorani', 'profile.actions.upload_photo', 'بارکردنی وێنە', 'profile', false, false),
('kurdish_kurmanci', 'profile.actions.upload_photo', 'Wêne Bar Bike', 'profile', false, false),
('norwegian', 'profile.actions.upload_photo', 'Last Opp Bilde', 'profile', true, true),
('german', 'profile.actions.upload_photo', 'Foto Hochladen', 'profile', true, true),

-- PROFILE FIELDS
('english', 'profile.fields.height', 'Height', 'profile', false, false),
('kurdish_sorani', 'profile.fields.height', 'باڵایی', 'profile', false, false),
('kurdish_kurmanci', 'profile.fields.height', 'Bilindî', 'profile', false, false),
('norwegian', 'profile.fields.height', 'Høyde', 'profile', true, true),
('german', 'profile.fields.height', 'Größe', 'profile', true, true),

('english', 'profile.fields.body_type', 'Body Type', 'profile', false, false),
('kurdish_sorani', 'profile.fields.body_type', 'جۆری جەستە', 'profile', false, false),
('kurdish_kurmanci', 'profile.fields.body_type', 'Cureya Laş', 'profile', false, false),
('norwegian', 'profile.fields.body_type', 'Kroppstype', 'profile', true, true),
('german', 'profile.fields.body_type', 'Körpertyp', 'profile', true, true),

('english', 'profile.fields.ethnicity', 'Ethnicity', 'profile', false, false),
('kurdish_sorani', 'profile.fields.ethnicity', 'ڕەگەز', 'profile', false, false),
('kurdish_kurmanci', 'profile.fields.ethnicity', 'Etnikî', 'profile', false, false),
('norwegian', 'profile.fields.ethnicity', 'Etnisitet', 'profile', true, true),
('german', 'profile.fields.ethnicity', 'Ethnizität', 'profile', true, true),

('english', 'profile.fields.religion', 'Religion', 'profile', false, false),
('kurdish_sorani', 'profile.fields.religion', 'ئایین', 'profile', false, false),
('kurdish_kurmanci', 'profile.fields.religion', 'Ol', 'profile', false, false),
('norwegian', 'profile.fields.religion', 'Religion', 'profile', true, true),
('german', 'profile.fields.religion', 'Religion', 'profile', true, true),

('english', 'profile.fields.occupation', 'Occupation', 'profile', false, false),
('kurdish_sorani', 'profile.fields.occupation', 'پیشە', 'profile', false, false),
('kurdish_kurmanci', 'profile.fields.occupation', 'Pîşe', 'profile', false, false),
('norwegian', 'profile.fields.occupation', 'Yrke', 'profile', true, true),
('german', 'profile.fields.occupation', 'Beruf', 'profile', true, true),

('english', 'profile.fields.education', 'Education', 'profile', false, false),
('kurdish_sorani', 'profile.fields.education', 'خوێندن', 'profile', false, false),
('kurdish_kurmanci', 'profile.fields.education', 'Perwerde', 'profile', false, false),
('norwegian', 'profile.fields.education', 'Utdanning', 'profile', true, true),
('german', 'profile.fields.education', 'Bildung', 'profile', true, true),

('english', 'profile.fields.languages', 'Languages', 'profile', false, false),
('kurdish_sorani', 'profile.fields.languages', 'زمانەکان', 'profile', false, false),
('kurdish_kurmanci', 'profile.fields.languages', 'Ziman', 'profile', false, false),
('norwegian', 'profile.fields.languages', 'Språk', 'profile', true, true),
('german', 'profile.fields.languages', 'Sprachen', 'profile', true, true),

('english', 'profile.fields.interests', 'Interests', 'profile', false, false),
('kurdish_sorani', 'profile.fields.interests', 'حەزەکان', 'profile', false, false),
('kurdish_kurmanci', 'profile.fields.interests', 'Berjewendî', 'profile', false, false),
('norwegian', 'profile.fields.interests', 'Interesser', 'profile', true, true),
('german', 'profile.fields.interests', 'Interessen', 'profile', true, true),

('english', 'profile.fields.hobbies', 'Hobbies', 'profile', false, false),
('kurdish_sorani', 'profile.fields.hobbies', 'حەزی کارکردن', 'profile', true, true),
('kurdish_kurmanci', 'profile.fields.hobbies', 'Hobi', 'profile', false, false),
('norwegian', 'profile.fields.hobbies', 'Hobbyer', 'profile', true, true),
('german', 'profile.fields.hobbies', 'Hobbys', 'profile', true, true),

-- ============================================
-- SWIPE PAGE TRANSLATIONS
-- ============================================
('english', 'swipe.header.title', 'Discover Love', 'swipe', false, false),
('kurdish_sorani', 'swipe.header.title', 'دۆزینەوەی خۆشەویستی', 'swipe', false, false),
('kurdish_kurmanci', 'swipe.header.title', 'Evîna Bibîne', 'swipe', false, false),
('norwegian', 'swipe.header.title', 'Oppdag Kjærlighet', 'swipe', true, true),
('german', 'swipe.header.title', 'Liebe Entdecken', 'swipe', true, true),

('english', 'swipe.header.subtitle', 'Swipe to find your perfect match', 'swipe', false, false),
('kurdish_sorani', 'swipe.header.subtitle', 'سوڕان بۆ دۆزینەوەی هاوتای تەواو', 'swipe', true, true),
('kurdish_kurmanci', 'swipe.header.subtitle', 'Ji bo dîtina hevalta xwe ya bêkêmasî bişixulîne', 'swipe', true, true),
('norwegian', 'swipe.header.subtitle', 'Sveip for å finne din perfekte match', 'swipe', true, true),
('german', 'swipe.header.subtitle', 'Wischen Sie, um Ihren perfekten Partner zu finden', 'swipe', true, true),

('english', 'swipe.actions.like', 'Like', 'swipe', false, false),
('kurdish_sorani', 'swipe.actions.like', 'پەسەند', 'swipe', false, false),
('kurdish_kurmanci', 'swipe.actions.like', 'Hez', 'swipe', false, false),
('norwegian', 'swipe.actions.like', 'Lik', 'swipe', true, true),
('german', 'swipe.actions.like', 'Gefällt mir', 'swipe', true, true),

('english', 'swipe.actions.pass', 'Pass', 'swipe', false, false),
('kurdish_sorani', 'swipe.actions.pass', 'تێپەڕاندن', 'swipe', false, false),
('kurdish_kurmanci', 'swipe.actions.pass', 'Derbas', 'swipe', false, false),
('norwegian', 'swipe.actions.pass', 'Pass', 'swipe', true, true),
('german', 'swipe.actions.pass', 'Überspringen', 'swipe', true, true),

('english', 'swipe.actions.super_like', 'Super Like', 'swipe', false, false),
('kurdish_sorani', 'swipe.actions.super_like', 'پەسەندی زۆر', 'swipe', true, true),
('kurdish_kurmanci', 'swipe.actions.super_like', 'Heza Mezin', 'swipe', true, true),
('norwegian', 'swipe.actions.super_like', 'Super Lik', 'swipe', true, true),
('german', 'swipe.actions.super_like', 'Super Like', 'swipe', true, true),

('english', 'swipe.toast.match', 'Its a match! 🎉', 'swipe', false, false),
('kurdish_sorani', 'swipe.toast.match', 'هاوتا بوو! 🎉', 'swipe', false, false),
('kurdish_kurmanci', 'swipe.toast.match', 'Hevta ye! 🎉', 'swipe', false, false),
('norwegian', 'swipe.toast.match', 'Det er en match! 🎉', 'swipe', true, true),
('german', 'swipe.toast.match', 'Es ist ein Match! 🎉', 'swipe', true, true),

('english', 'swipe.toast.liked', 'Profile liked!', 'swipe', false, false),
('kurdish_sorani', 'swipe.toast.liked', 'پرۆفایل پەسەند کرا!', 'swipe', true, true),
('kurdish_kurmanci', 'swipe.toast.liked', 'Profîl hate hez kirin!', 'swipe', true, true),
('norwegian', 'swipe.toast.liked', 'Profil likt!', 'swipe', true, true),
('german', 'swipe.toast.liked', 'Profil geliked!', 'swipe', true, true),

('english', 'swipe.empty.title', 'No more profiles', 'swipe', false, false),
('kurdish_sorani', 'swipe.empty.title', 'پرۆفایلی دیکە نییە', 'swipe', true, true),
('kurdish_kurmanci', 'swipe.empty.title', 'Profîlên din tune', 'swipe', true, true),
('norwegian', 'swipe.empty.title', 'Ingen flere profiler', 'swipe', true, true),
('german', 'swipe.empty.title', 'Keine weiteren Profile', 'swipe', true, true),

('english', 'swipe.empty.subtitle', 'Check back later for new matches!', 'swipe', false, false),
('kurdish_sorani', 'swipe.empty.subtitle', 'دواتر بگەڕێوە بۆ هاوتای نوێ!', 'swipe', true, true),
('kurdish_kurmanci', 'swipe.empty.subtitle', 'Ji bo hevtayên nû paşê vegere!', 'swipe', true, true),
('norwegian', 'swipe.empty.subtitle', 'Kom tilbake senere for nye matcher!', 'swipe', true, true),
('german', 'swipe.empty.subtitle', 'Schauen Sie später nach neuen Matches!', 'swipe', true, true),

-- ============================================
-- SETTINGS PAGE TRANSLATIONS
-- ============================================
('english', 'settings.account.title', 'Account Settings', 'settings', false, false),
('kurdish_sorani', 'settings.account.title', 'ڕێکخستنەکانی هەژمار', 'settings', false, false),
('kurdish_kurmanci', 'settings.account.title', 'Mîhengên Hesabê', 'settings', false, false),
('norwegian', 'settings.account.title', 'Kontoinnstillinger', 'settings', true, true),
('german', 'settings.account.title', 'Kontoeinstellungen', 'settings', true, true),

('english', 'settings.notifications.title', 'Notification Settings', 'settings', false, false),
('kurdish_sorani', 'settings.notifications.title', 'ڕێکخستنەکانی ئاگادارکردنەوە', 'settings', true, true),
('kurdish_kurmanci', 'settings.notifications.title', 'Mîhengên Agahdarkirin', 'settings', true, true),
('norwegian', 'settings.notifications.title', 'Varslingsinnstillinger', 'settings', true, true),
('german', 'settings.notifications.title', 'Benachrichtigungseinstellungen', 'settings', true, true),

('english', 'settings.privacy.title', 'Privacy Settings', 'settings', false, false),
('kurdish_sorani', 'settings.privacy.title', 'ڕێکخستنەکانی تایبەتێتی', 'settings', false, false),
('kurdish_kurmanci', 'settings.privacy.title', 'Mîhengên Taybetiyê', 'settings', false, false),
('norwegian', 'settings.privacy.title', 'Personverninnstillinger', 'settings', true, true),
('german', 'settings.privacy.title', 'Datenschutzeinstellungen', 'settings', true, true),

('english', 'settings.notifications.new_matches', 'New Matches', 'settings', false, false),
('kurdish_sorani', 'settings.notifications.new_matches', 'هاوتای نوێ', 'settings', false, false),
('kurdish_kurmanci', 'settings.notifications.new_matches', 'Hevtayên Nû', 'settings', false, false),
('norwegian', 'settings.notifications.new_matches', 'Nye Matcher', 'settings', true, true),
('german', 'settings.notifications.new_matches', 'Neue Matches', 'settings', true, true),

('english', 'settings.notifications.new_messages', 'New Messages', 'settings', false, false),
('kurdish_sorani', 'settings.notifications.new_messages', 'نامەی نوێ', 'settings', false, false),
('kurdish_kurmanci', 'settings.notifications.new_messages', 'Mesajên Nû', 'settings', false, false),
('norwegian', 'settings.notifications.new_messages', 'Nye Meldinger', 'settings', true, true),
('german', 'settings.notifications.new_messages', 'Neue Nachrichten', 'settings', true, true),

('english', 'settings.privacy.show_age', 'Show My Age', 'settings', false, false),
('kurdish_sorani', 'settings.privacy.show_age', 'پیشاندانی تەمەنم', 'settings', true, true),
('kurdish_kurmanci', 'settings.privacy.show_age', 'Temenê Min Nîşan Bide', 'settings', true, true),
('norwegian', 'settings.privacy.show_age', 'Vis Min Alder', 'settings', true, true),
('german', 'settings.privacy.show_age', 'Mein Alter Anzeigen', 'settings', true, true),

('english', 'settings.actions.logout', 'Logout', 'settings', false, false),
('kurdish_sorani', 'settings.actions.logout', 'دەرچوون', 'settings', false, false),
('kurdish_kurmanci', 'settings.actions.logout', 'Derkeve', 'settings', false, false),
('norwegian', 'settings.actions.logout', 'Logg Ut', 'settings', true, true),
('german', 'settings.actions.logout', 'Abmelden', 'settings', true, true),

('english', 'settings.actions.delete_account', 'Delete Account', 'settings', false, false),
('kurdish_sorani', 'settings.actions.delete_account', 'سڕینەوەی هەژمار', 'settings', false, false),
('kurdish_kurmanci', 'settings.actions.delete_account', 'Hesabê Jê Bibe', 'settings', false, false),
('norwegian', 'settings.actions.delete_account', 'Slett Konto', 'settings', true, true),
('german', 'settings.actions.delete_account', 'Konto Löschen', 'settings', true, true),

-- ============================================
-- VALIDATION & ERROR MESSAGES
-- ============================================
('english', 'validation.email.required', 'Email is required', 'validation', false, false),
('kurdish_sorani', 'validation.email.required', 'ئیمەیڵ پێویستە', 'validation', true, true),
('kurdish_kurmanci', 'validation.email.required', 'E-posta pêwîst e', 'validation', true, true),
('norwegian', 'validation.email.required', 'E-post er påkrevd', 'validation', true, true),
('german', 'validation.email.required', 'E-Mail ist erforderlich', 'validation', true, true),

('english', 'validation.password.min', 'Password must be at least 6 characters', 'validation', false, false),
('kurdish_sorani', 'validation.password.min', 'پاسۆرد دەبێت بەلایەنی کەمەوە ٦ پیت بێت', 'validation', true, true),
('kurdish_kurmanci', 'validation.password.min', 'Pêbawer divê herî kêm 6 tîp be', 'validation', true, true),
('norwegian', 'validation.password.min', 'Passord må være minst 6 tegn', 'validation', true, true),
('german', 'validation.password.min', 'Passwort muss mindestens 6 Zeichen lang sein', 'validation', true, true),

('english', 'errors.login.failed', 'Failed to log in', 'errors', false, false),
('kurdish_sorani', 'errors.login.failed', 'چوونەژوورەوە سەرکەوتوو نەبوو', 'errors', true, true),
('kurdish_kurmanci', 'errors.login.failed', 'Têketin serneket', 'errors', true, true),
('norwegian', 'errors.login.failed', 'Kunne ikke logge inn', 'errors', true, true),
('german', 'errors.login.failed', 'Anmeldung fehlgeschlagen', 'errors', true, true),

('english', 'errors.network.generic', 'Something went wrong. Please try again.', 'errors', false, false),
('kurdish_sorani', 'errors.network.generic', 'شتێک هەڵە بوو. تکایە دووبارە هەوڵ بدەرەوە.', 'errors', true, true),
('kurdish_kurmanci', 'errors.network.generic', 'Tiştek xelet çû. Ji kerema xwe dîsa hewl bide.', 'errors', true, true),
('norwegian', 'errors.network.generic', 'Noe gikk galt. Vennligst prøv igjen.', 'errors', true, true),
('german', 'errors.network.generic', 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.', 'errors', true, true),

-- ============================================
-- ACTION LABELS
-- ============================================
('english', 'actions.save', 'Save', 'actions', false, false),
('kurdish_sorani', 'actions.save', 'پاشەکەوتکردن', 'actions', false, false),
('kurdish_kurmanci', 'actions.save', 'Tomar Bike', 'actions', false, false),
('norwegian', 'actions.save', 'Lagre', 'actions', true, true),
('german', 'actions.save', 'Speichern', 'actions', true, true),

('english', 'actions.cancel', 'Cancel', 'actions', false, false),
('kurdish_sorani', 'actions.cancel', 'هەڵوەشاندنەوە', 'actions', false, false),
('kurdish_kurmanci', 'actions.cancel', 'Betal Bike', 'actions', false, false),
('norwegian', 'actions.cancel', 'Avbryt', 'actions', true, true),
('german', 'actions.cancel', 'Abbrechen', 'actions', true, true),

('english', 'actions.delete', 'Delete', 'actions', false, false),
('kurdish_sorani', 'actions.delete', 'سڕینەوە', 'actions', false, false),
('kurdish_kurmanci', 'actions.delete', 'Jê Bibe', 'actions', false, false),
('norwegian', 'actions.delete', 'Slett', 'actions', true, true),
('german', 'actions.delete', 'Löschen', 'actions', true, true),

('english', 'actions.confirm', 'Confirm', 'actions', false, false),
('kurdish_sorani', 'actions.confirm', 'پشتڕاستکردنەوە', 'actions', false, false),
('kurdish_kurmanci', 'actions.confirm', 'Piştrast Bike', 'actions', false, false),
('norwegian', 'actions.confirm', 'Bekreft', 'actions', true, true),
('german', 'actions.confirm', 'Bestätigen', 'actions', true, true),

('english', 'actions.continue', 'Continue', 'actions', false, false),
('kurdish_sorani', 'actions.continue', 'بەردەوام بوون', 'actions', false, false),
('kurdish_kurmanci', 'actions.continue', 'Bidomîne', 'actions', false, false),
('norwegian', 'actions.continue', 'Fortsett', 'actions', true, true),
('german', 'actions.continue', 'Fortsetzen', 'actions', true, true);