-- Add gallery fields to landing_page_v2_translations table
ALTER TABLE landing_page_v2_translations
ADD COLUMN gallery_title TEXT DEFAULT 'See Our Community in Action',
ADD COLUMN gallery_subtitle TEXT DEFAULT 'Real moments from Kurdish connections worldwide',
ADD COLUMN gallery_categories JSONB DEFAULT '[]'::jsonb;

-- Add sample gallery data for English
UPDATE landing_page_v2_translations
SET 
  gallery_title = 'See Our Community in Action',
  gallery_subtitle = 'Real moments from Kurdish connections worldwide',
  gallery_categories = '[
    {
      "id": "weddings",
      "name": "Kurdish Weddings",
      "description": "Beautiful wedding celebrations bringing families together",
      "images": [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
      ]
    },
    {
      "id": "cultural",
      "name": "Cultural Events",
      "description": "Traditional Kurdish festivals and celebrations",
      "images": [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
      ]
    },
    {
      "id": "gatherings",
      "name": "Community Gatherings",
      "description": "Friends and families coming together",
      "images": [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800"
      ]
    }
  ]'::jsonb
WHERE language_code = 'en' AND is_published = true;

-- Kurdish Sorani
UPDATE landing_page_v2_translations
SET 
  gallery_title = 'کۆمەڵگای ئێمە ببینە',
  gallery_subtitle = 'ساتە ڕاستەقینەکانی پەیوەندییە کوردییەکان لە سەرانسەری جیهان',
  gallery_categories = '[
    {
      "id": "weddings",
      "name": "ئاهەنگی زەماوەند",
      "description": "ئاهەنگە جوانەکانی زەماوەند کە خێزانەکان پێکەوە دەبەستێتەوە",
      "images": [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
      ]
    },
    {
      "id": "cultural",
      "name": "بۆنە کلتوورییەکان",
      "description": "جەژنە نەتەوەییەکانی کوردی",
      "images": [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
      ]
    },
    {
      "id": "gatherings",
      "name": "کۆبوونەوەی کۆمەڵگا",
      "description": "هاوڕێیان و خێزانەکان پێکەوە کۆدەبنەوە",
      "images": [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800"
      ]
    }
  ]'::jsonb
WHERE language_code = 'kurdish_sorani' AND is_published = true;

-- Kurdish Kurmanci
UPDATE landing_page_v2_translations
SET 
  gallery_title = 'Civaka Me Bibîne',
  gallery_subtitle = 'Demên rastîn ji girêdanên kurdî li seranserê cîhanê',
  gallery_categories = '[
    {
      "id": "weddings",
      "name": "Dawetên Kurdî",
      "description": "Dawetên xweşik ku malbatan bi hev re girê didin",
      "images": [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
      ]
    },
    {
      "id": "cultural",
      "name": "Bûyerên Çandî",
      "description": "Festîvalên kevneşopî yên kurdî",
      "images": [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
      ]
    },
    {
      "id": "gatherings",
      "name": "Civînên Civakê",
      "description": "Heval û malbat bi hev re tên",
      "images": [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800"
      ]
    }
  ]'::jsonb
WHERE language_code = 'kurdish_kurmanci' AND is_published = true;

-- Norwegian
UPDATE landing_page_v2_translations
SET 
  gallery_title = 'Se Vårt Samfunn i Aksjon',
  gallery_subtitle = 'Ekte øyeblikk fra kurdiske forbindelser over hele verden',
  gallery_categories = '[
    {
      "id": "weddings",
      "name": "Kurdiske Bryllup",
      "description": "Vakre bryllupsfeiringer som samler familier",
      "images": [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
      ]
    },
    {
      "id": "cultural",
      "name": "Kulturelle Arrangementer",
      "description": "Tradisjonelle kurdiske festivaler",
      "images": [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
      ]
    },
    {
      "id": "gatherings",
      "name": "Fellessamlinger",
      "description": "Venner og familier kommer sammen",
      "images": [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800"
      ]
    }
  ]'::jsonb
WHERE language_code = 'no' AND is_published = true;

-- German
UPDATE landing_page_v2_translations
SET 
  gallery_title = 'Sehen Sie Unsere Gemeinschaft in Aktion',
  gallery_subtitle = 'Echte Momente kurdischer Verbindungen weltweit',
  gallery_categories = '[
    {
      "id": "weddings",
      "name": "Kurdische Hochzeiten",
      "description": "Wunderschöne Hochzeitsfeiern, die Familien zusammenbringen",
      "images": [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"
      ]
    },
    {
      "id": "cultural",
      "name": "Kulturelle Veranstaltungen",
      "description": "Traditionelle kurdische Feste",
      "images": [
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800"
      ]
    },
    {
      "id": "gatherings",
      "name": "Gemeinschaftstreffen",
      "description": "Freunde und Familien kommen zusammen",
      "images": [
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
        "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800"
      ]
    }
  ]'::jsonb
WHERE language_code = 'de' AND is_published = true;