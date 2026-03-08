import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // All new translation keys with translations for all 5 languages
  const translations: { key: string; category: string; en: string; ckb: string; kmr: string; de: string; no: string }[] = [
    // AUTH
    { key: 'auth.welcome_back', category: 'auth', en: 'Welcome Back', ckb: 'بەخێربێیتەوە', kmr: 'Bi xêr hatî', de: 'Willkommen zurück', no: 'Velkommen tilbake' },
    { key: 'auth.login_subtitle', category: 'auth', en: 'Log in to continue your journey', ckb: 'بچۆ ژوورەوە بۆ بەردەوامبوون', kmr: 'Têkeve da ku rêwîtiya xwe bidomînî', de: 'Melden Sie sich an um fortzufahren', no: 'Logg inn for å fortsette' },
    { key: 'auth.logging_in', category: 'auth', en: 'Logging In...', ckb: 'چوونەژوورەوە...', kmr: 'Tê ketin...', de: 'Anmeldung...', no: 'Logger inn...' },
    { key: 'auth.log_in', category: 'auth', en: 'Log In', ckb: 'چوونەژوورەوە', kmr: 'Têkeve', de: 'Anmelden', no: 'Logg inn' },
    { key: 'auth.no_account', category: 'auth', en: "Don't have an account?", ckb: 'هەژمارت نییە؟', kmr: 'Hesabê te tune?', de: 'Noch kein Konto?', no: 'Har du ikke en konto?' },
    { key: 'auth.sign_up', category: 'auth', en: 'Sign up', ckb: 'خۆتۆمارکردن', kmr: 'Tomarbûn', de: 'Registrieren', no: 'Registrer deg' },
    { key: 'auth.back_to_landing', category: 'auth', en: 'Back to Landing Page', ckb: 'گەڕانەوە بۆ پەڕەی سەرەکی', kmr: 'Vegere rûpela destpêkê', de: 'Zurück zur Startseite', no: 'Tilbake til forsiden' },
    { key: 'auth.welcome_success', category: 'auth', en: 'Welcome back!', ckb: 'بەخێربێیتەوە!', kmr: 'Bi xêr hatî!', de: 'Willkommen zurück!', no: 'Velkommen tilbake!' },
    { key: 'auth.login_success', category: 'auth', en: "You've successfully logged in.", ckb: 'بە سەرکەوتوویی چوویتە ژوورەوە.', kmr: 'Te bi serkeftî têketin.', de: 'Sie haben sich erfolgreich angemeldet.', no: 'Du har logget inn.' },
    { key: 'auth.auth_failed', category: 'auth', en: 'Authentication failed', ckb: 'ناسینەوە سەرنەکەوت', kmr: 'Naskirinê bi ser neket', de: 'Authentifizierung fehlgeschlagen', no: 'Autentisering mislyktes' },
    { key: 'auth.confirm_email', category: 'auth', en: 'Please check your email to confirm your account before logging in.', ckb: 'تکایە ئیمەیڵەکەت بپشکنە بۆ دڵنیابوونەوە لە هەژمارەکەت.', kmr: 'Ji kerema xwe e-nameya xwe kontrol bike.', de: 'Bitte überprüfen Sie Ihre E-Mail.', no: 'Vennligst sjekk e-posten din.' },
    { key: 'auth.or_continue_with', category: 'auth', en: 'OR CONTINUE WITH', ckb: 'یان بەردەوامبە لەگەڵ', kmr: 'AN BI ... BIDOMÎNE', de: 'ODER WEITER MIT', no: 'ELLER FORTSETT MED' },
    { key: 'auth.join_community', category: 'auth', en: 'Join Our Community', ckb: 'بەشداری کۆمەڵگەکەمان بکە', kmr: 'Beşdarî civata me bibe', de: 'Treten Sie unserer Gemeinschaft bei', no: 'Bli med i fellesskapet' },
    { key: 'auth.create_account_steps', category: 'auth', en: 'Create your account in just a few simple steps', ckb: 'هەژمارەکەت دروست بکە بە چەند هەنگاوێکی ئاسان', kmr: 'Hesabê xwe bi çend gavên hêsan ava bike', de: 'Erstellen Sie Ihr Konto in wenigen Schritten', no: 'Opprett kontoen din med noen enkle steg' },
    { key: 'auth.back_to_home', category: 'auth', en: 'Back to Home', ckb: 'گەڕانەوە بۆ ماڵەوە', kmr: 'Vegere malê', de: 'Zurück zur Startseite', no: 'Tilbake til hjem' },
    { key: 'auth.have_account', category: 'auth', en: 'Already have an account?', ckb: 'پێشتر هەژمارت هەیە؟', kmr: 'Jixwe hesabê te heye?', de: 'Haben Sie bereits ein Konto?', no: 'Har du allerede en konto?' },
    { key: 'auth.sign_in_here', category: 'auth', en: 'Sign in here', ckb: 'لێرە بچۆ ژوورەوە', kmr: 'Li vir têkeve', de: 'Hier anmelden', no: 'Logg inn her' },
    { key: 'auth.basic_info', category: 'auth', en: 'Basic Info', ckb: 'زانیاری سەرەکی', kmr: 'Agahiyên bingehîn', de: 'Grundinformationen', no: 'Grunnleggende info' },
    { key: 'auth.tell_about_yourself', category: 'auth', en: 'Tell us about yourself', ckb: 'دەربارەی خۆت بڵێ', kmr: 'Li ser xwe ji me re bêje', de: 'Erzählen Sie uns von sich', no: 'Fortell oss om deg selv' },

    // DISCOVERY FEED
    { key: 'discovery.feed.for_you', category: 'discovery', en: 'For You', ckb: 'بۆ تۆ', kmr: 'Ji bo te', de: 'Für dich', no: 'For deg' },
    { key: 'discovery.feed.following', category: 'discovery', en: 'Following', ckb: 'شوێنکەوتن', kmr: 'Dişopîne', de: 'Folge ich', no: 'Følger' },
    { key: 'discovery.feed.no_posts', category: 'discovery', en: 'No posts yet', ckb: 'هێشتا هیچ بابەتێک نییە', kmr: 'Hîn şandinek tune', de: 'Noch keine Beiträge', no: 'Ingen innlegg ennå' },
    { key: 'discovery.feed.no_following_posts', category: 'discovery', en: 'No posts from people you follow', ckb: 'هیچ بابەتێک نییە لە ئەو کەسانەی شوێنیان دەکەویت', kmr: 'Ji kesên ku tu dişopînî ti şandinek tune', de: 'Keine Beiträge von Personen denen du folgst', no: 'Ingen innlegg fra folk du følger' },
    { key: 'discovery.feed.follow_people', category: 'discovery', en: 'Follow people to see their posts here', ckb: 'شوێنکەوتنی کەسان بکە بۆ بینینی بابەتەکانیان لێرە', kmr: 'Kesan bişopîne da ku şandinên wan li vir bibînî', de: 'Folge Personen um ihre Beiträge zu sehen', no: 'Følg folk for å se innleggene deres her' },
    { key: 'discovery.feed.posts_appear', category: 'discovery', en: 'Posts from users will appear here', ckb: 'بابەتەکانی بەکارهێنەران لێرە دەردەکەون', kmr: 'Şandinên bikarhêneran dê li vir derkevin', de: 'Beiträge von Nutzern erscheinen hier', no: 'Innlegg fra brukere vises her' },
    { key: 'discovery.search', category: 'discovery', en: 'Search by word or #hashtag...', ckb: 'گەڕان بە وشە یان #هاشتاگ...', kmr: 'Bi peyv an #hashtag bigere...', de: 'Nach Wort oder #Hashtag suchen...', no: 'Søk etter ord eller #hashtag...' },

    // SWIPE
    { key: 'swipe.loading', category: 'swipe', en: 'Loading profiles...', ckb: 'پرۆفایلەکان بارکردن...', kmr: 'Profîl tên barkirin...', de: 'Profile werden geladen...', no: 'Laster profiler...' },
    { key: 'swipe.finding_matches', category: 'swipe', en: 'Finding your perfect matches', ckb: 'دۆزینەوەی گونجاوترین هاوتاکان', kmr: 'Hevgiriyên te yên bêkêmasî tên dîtin', de: 'Perfekte Übereinstimmungen finden', no: 'Finner dine perfekte treff' },
    { key: 'swipe.no_more', category: 'swipe', en: 'No more profiles', ckb: 'پرۆفایلی دیکە نییە', kmr: 'Êdî profîl tune', de: 'Keine weiteren Profile', no: 'Ingen flere profiler' },
    { key: 'swipe.check_back', category: 'swipe', en: 'Check back later for new matches!', ckb: 'دواتر سەردانمان بکەرەوە بۆ هاوتاکانی نوێ!', kmr: 'Paşê dîsa binêre ji bo hevgiriyên nû!', de: 'Schau später nach neuen Übereinstimmungen!', no: 'Kom tilbake senere for nye treff!' },
    { key: 'swipe.profile_passed', category: 'swipe', en: 'Profile passed', ckb: 'پرۆفایل تێپەڕێنرا', kmr: 'Profîl derbas bû', de: 'Profil übersprungen', no: 'Profil hoppet over' },
    { key: 'swipe.its_a_match', category: 'swipe', en: "It's a match! 🎉", ckb: 'هاوتایە! 🎉', kmr: 'Hevgirî ye! 🎉', de: 'Es ist ein Match! 🎉', no: 'Det er en match! 🎉' },
    { key: 'swipe.profile_liked', category: 'swipe', en: 'Profile liked!', ckb: 'پرۆفایل پەسەند کرا!', kmr: 'Profîl hat hezkirin!', de: 'Profil gefällt mir!', no: 'Profil likt!' },
    { key: 'swipe.super_like_sent', category: 'swipe', en: 'Super like sent!', ckb: 'سوپەر لایک نێردرا!', kmr: 'Super hezkirin hat şandin!', de: 'Super-Like gesendet!', no: 'Super-like sendt!' },
    { key: 'swipe.no_more_profiles', category: 'swipe', en: 'No more profiles to show', ckb: 'پرۆفایلی دیکە نییە بۆ پیشاندان', kmr: 'Êdî profîl tune ku were nîşandan', de: 'Keine weiteren Profile', no: 'Ingen flere profiler å vise' },

    // MESSAGES
    { key: 'messages.title', category: 'messages', en: 'Messages', ckb: 'نامەکان', kmr: 'Peyam', de: 'Nachrichten', no: 'Meldinger' },
    { key: 'messages.new', category: 'messages', en: 'new', ckb: 'نوێ', kmr: 'nû', de: 'neu', no: 'ny' },
    { key: 'messages.online', category: 'messages', en: 'online', ckb: 'سەرهێڵ', kmr: 'serhêl', de: 'online', no: 'online' },
    { key: 'messages.type_message', category: 'messages', en: 'Type a message...', ckb: 'نامەیەک بنووسە...', kmr: 'Peyamek binivîse...', de: 'Nachricht schreiben...', no: 'Skriv en melding...' },
    { key: 'messages.send', category: 'messages', en: 'Send', ckb: 'ناردن', kmr: 'Bişîne', de: 'Senden', no: 'Send' },
    { key: 'messages.sent', category: 'messages', en: 'Message sent!', ckb: 'نامە نێردرا!', kmr: 'Peyam hat şandin!', de: 'Nachricht gesendet!', no: 'Melding sendt!' },
    { key: 'messages.no_conversations', category: 'messages', en: 'No conversations yet', ckb: 'هێشتا هیچ گفتوگۆیەک نییە', kmr: 'Hîn axaftin tune', de: 'Noch keine Unterhaltungen', no: 'Ingen samtaler ennå' },
    { key: 'messages.start_chatting', category: 'messages', en: 'Start chatting with your matches!', ckb: 'دەستبکە بە چاتکردن لەگەڵ هاوتاکانت!', kmr: 'Bi hevgiriyên xwe re dest bi axaftinê bike!', de: 'Starte eine Unterhaltung mit deinen Matches!', no: 'Start å chatte med dine treff!' },
    { key: 'messages.new_matches', category: 'messages', en: 'New Matches', ckb: 'هاوتاکانی نوێ', kmr: 'Hevgiriyên nû', de: 'Neue Matches', no: 'Nye treff' },
    { key: 'messages.typing', category: 'messages', en: 'typing...', ckb: 'نووسین...', kmr: 'dinivîse...', de: 'schreibt...', no: 'skriver...' },
    { key: 'messages.unmatch', category: 'messages', en: 'Unmatch', ckb: 'لابردنی هاوتا', kmr: 'Hevgiriyê rake', de: 'Entmatchen', no: 'Fjern match' },
    { key: 'messages.report', category: 'messages', en: 'Report Conversation', ckb: 'ڕاپۆرتکردنی گفتوگۆ', kmr: 'Axaftinê rapor bike', de: 'Unterhaltung melden', no: 'Rapporter samtale' },
    { key: 'messages.block_user', category: 'messages', en: 'Block User', ckb: 'بلۆککردنی بەکارهێنەر', kmr: 'Bikarhêner asteng bike', de: 'Benutzer blockieren', no: 'Blokker bruker' },
    { key: 'messages.report_message', category: 'messages', en: 'Report Message', ckb: 'ڕاپۆرتکردنی نامە', kmr: 'Peyamê rapor bike', de: 'Nachricht melden', no: 'Rapporter melding' },
    { key: 'messages.translate_english', category: 'messages', en: 'Translate to English', ckb: 'وەرگێڕان بۆ ئینگلیزی', kmr: 'Bo Îngilîzî wergerîne', de: 'Ins Englische übersetzen', no: 'Oversett til engelsk' },
    { key: 'messages.translate_norwegian', category: 'messages', en: 'Translate to Norwegian', ckb: 'وەرگێڕان بۆ نەرویجی', kmr: 'Bo Norwêcî wergerîne', de: 'Ins Norwegische übersetzen', no: 'Oversett til norsk' },
    { key: 'messages.translating', category: 'messages', en: 'Translating...', ckb: 'وەرگێڕان...', kmr: 'Tê wergerandin...', de: 'Übersetzen...', no: 'Oversetter...' },
    { key: 'messages.translation', category: 'messages', en: 'Translation:', ckb: 'وەرگێڕان:', kmr: 'Werger:', de: 'Übersetzung:', no: 'Oversettelse:' },

    // PROFILE
    { key: 'profile.loading', category: 'profile', en: 'Loading profile...', ckb: 'بارکردنی پرۆفایل...', kmr: 'Profîl tê barkirin...', de: 'Profil wird geladen...', no: 'Laster profil...' },
    { key: 'profile.not_found', category: 'profile', en: 'Profile not found', ckb: 'پرۆفایل نەدۆزرایەوە', kmr: 'Profîl nehat dîtin', de: 'Profil nicht gefunden', no: 'Profil ikke funnet' },
    { key: 'profile.go_back', category: 'profile', en: 'Go back', ckb: 'گەڕانەوە', kmr: 'Vegere', de: 'Zurück', no: 'Gå tilbake' },
    { key: 'profile.basic_info', category: 'profile', en: 'Basic Info', ckb: 'زانیاری سەرەکی', kmr: 'Agahiyên bingehîn', de: 'Grundinfo', no: 'Grunninfo' },
    { key: 'profile.career_education', category: 'profile', en: 'Career & Education', ckb: 'کار و خوێندن', kmr: 'Karîyer & Perwerde', de: 'Karriere & Bildung', no: 'Karriere og utdanning' },
    { key: 'profile.lifestyle', category: 'profile', en: 'Lifestyle', ckb: 'شێوازی ژیان', kmr: 'Şêwaza jiyanê', de: 'Lebensstil', no: 'Livsstil' },
    { key: 'profile.beliefs_values', category: 'profile', en: 'Beliefs & Values', ckb: 'باوەڕ و بەهاکان', kmr: 'Bawer û nirx', de: 'Überzeugungen & Werte', no: 'Tro og verdier' },
    { key: 'profile.relationships', category: 'profile', en: 'Relationships', ckb: 'پەیوەندییەکان', kmr: 'Têkilî', de: 'Beziehungen', no: 'Relasjoner' },
    { key: 'profile.about', category: 'profile', en: 'About', ckb: 'دەربارە', kmr: 'Derbarê', de: 'Über', no: 'Om' },
    { key: 'profile.height', category: 'profile', en: 'Height:', ckb: 'باڵا:', kmr: 'Bilindahî:', de: 'Größe:', no: 'Høyde:' },
    { key: 'profile.body_type', category: 'profile', en: 'Body Type:', ckb: 'جۆری لەش:', kmr: 'Cureyê laş:', de: 'Körpertyp:', no: 'Kroppstype:' },
    { key: 'profile.ethnicity', category: 'profile', en: 'Ethnicity:', ckb: 'نەتەوە:', kmr: 'Etnîsîte:', de: 'Ethnizität:', no: 'Etnisitet:' },
    { key: 'profile.religion', category: 'profile', en: 'Religion:', ckb: 'ئایین:', kmr: 'Ol:', de: 'Religion:', no: 'Religion:' },
    { key: 'profile.zodiac', category: 'profile', en: 'Zodiac:', ckb: 'بورج:', kmr: 'Burc:', de: 'Sternzeichen:', no: 'Stjernetegn:' },
    { key: 'profile.personality', category: 'profile', en: 'Personality:', ckb: 'کەسایەتی:', kmr: 'Kesayetî:', de: 'Persönlichkeit:', no: 'Personlighet:' },
    { key: 'profile.occupation', category: 'profile', en: 'Occupation:', ckb: 'پیشە:', kmr: 'Pîşe:', de: 'Beruf:', no: 'Yrke:' },
    { key: 'profile.education', category: 'profile', en: 'Education:', ckb: 'خوێندن:', kmr: 'Perwerde:', de: 'Bildung:', no: 'Utdanning:' },
    { key: 'profile.company', category: 'profile', en: 'Company:', ckb: 'کۆمپانیا:', kmr: 'Pargîdanî:', de: 'Unternehmen:', no: 'Selskap:' },
    { key: 'profile.goals', category: 'profile', en: 'Goals:', ckb: 'ئامانجەکان:', kmr: 'Armanc:', de: 'Ziele:', no: 'Mål:' },
    { key: 'profile.work_style', category: 'profile', en: 'Work Style:', ckb: 'شێوازی کارکردن:', kmr: 'Şêwaza kar:', de: 'Arbeitsstil:', no: 'Arbeidsstil:' },
    { key: 'profile.exercise', category: 'profile', en: 'Exercise:', ckb: 'وەرزش:', kmr: 'Werzîş:', de: 'Sport:', no: 'Trening:' },
    { key: 'profile.diet', category: 'profile', en: 'Diet:', ckb: 'خواردن:', kmr: 'Xwarin:', de: 'Ernährung:', no: 'Kosthold:' },
    { key: 'profile.smoking', category: 'profile', en: 'Smoking:', ckb: 'جگەرە:', kmr: 'Cixare:', de: 'Rauchen:', no: 'Røyking:' },
    { key: 'profile.drinking', category: 'profile', en: 'Drinking:', ckb: 'خواردنەوەی ئاڵکۆحۆل:', kmr: 'Vexwarin:', de: 'Trinken:', no: 'Drikking:' },
    { key: 'profile.sleep', category: 'profile', en: 'Sleep:', ckb: 'خەو:', kmr: 'Xew:', de: 'Schlaf:', no: 'Søvn:' },
    { key: 'profile.pets', category: 'profile', en: 'Pets:', ckb: 'ئاژەڵی ماڵی:', kmr: 'Heywanên malê:', de: 'Haustiere:', no: 'Kjæledyr:' },
    { key: 'profile.hobbies', category: 'profile', en: 'Hobbies:', ckb: 'ئارەزووەکان:', kmr: 'Hobî:', de: 'Hobbys:', no: 'Hobbyer:' },
    { key: 'profile.political_views', category: 'profile', en: 'Political Views:', ckb: 'بۆچوونە سیاسییەکان:', kmr: 'Nêrînên siyasî:', de: 'Politische Ansichten:', no: 'Politiske synspunkter:' },
    { key: 'profile.values', category: 'profile', en: 'Values:', ckb: 'بەهاکان:', kmr: 'Nirx:', de: 'Werte:', no: 'Verdier:' },
    { key: 'profile.interests', category: 'profile', en: 'Interests:', ckb: 'ئارەزووەکان:', kmr: 'Berjewendî:', de: 'Interessen:', no: 'Interesser:' },
    { key: 'profile.looking_for', category: 'profile', en: 'Looking for:', ckb: 'بەدوای دەگەڕێت:', kmr: 'Li ber digere:', de: 'Sucht nach:', no: 'Ser etter:' },
    { key: 'profile.children', category: 'profile', en: 'Children:', ckb: 'منداڵ:', kmr: 'Zarok:', de: 'Kinder:', no: 'Barn:' },
    { key: 'profile.love_language', category: 'profile', en: 'Love Language:', ckb: 'زمانی خۆشەویستی:', kmr: 'Zimanê evînê:', de: 'Liebessprache:', no: 'Kjærlighetsspråk:' },
    { key: 'profile.communication', category: 'profile', en: 'Communication:', ckb: 'پەیوەندی:', kmr: 'Ragihandin:', de: 'Kommunikation:', no: 'Kommunikasjon:' },
    { key: 'profile.ideal_date', category: 'profile', en: 'Ideal Date:', ckb: 'مەیلی ئایدیاڵ:', kmr: 'Dîmena îdeal:', de: 'Ideales Date:', no: 'Ideell date:' },
    { key: 'profile.family', category: 'profile', en: 'Family:', ckb: 'خێزان:', kmr: 'Malbat:', de: 'Familie:', no: 'Familie:' },
    { key: 'profile.languages', category: 'profile', en: 'Languages:', ckb: 'زمانەکان:', kmr: 'Ziman:', de: 'Sprachen:', no: 'Språk:' },

    // MY PROFILE
    { key: 'my_profile.title', category: 'profile', en: 'Profile', ckb: 'پرۆفایل', kmr: 'Profîl', de: 'Profil', no: 'Profil' },
    { key: 'my_profile.views', category: 'profile', en: 'Views', ckb: 'بینینەکان', kmr: 'Dîtin', de: 'Aufrufe', no: 'Visninger' },
    { key: 'my_profile.likes', category: 'profile', en: 'Likes', ckb: 'پەسەندکردنەکان', kmr: 'Hezkirin', de: 'Likes', no: 'Liker' },
    { key: 'my_profile.matches', category: 'profile', en: 'Matches', ckb: 'هاوتاکان', kmr: 'Hevgirî', de: 'Matches', no: 'Treff' },
    { key: 'my_profile.loading', category: 'profile', en: 'Loading your profile...', ckb: 'بارکردنی پرۆفایلەکەت...', kmr: 'Profîla te tê barkirin...', de: 'Profil wird geladen...', no: 'Laster profilen din...' },
    { key: 'my_profile.complete', category: 'profile', en: 'Complete your profile', ckb: 'پرۆفایلەکەت تەواو بکە', kmr: 'Profîla xwe temam bike', de: 'Profil vervollständigen', no: 'Fullfør profilen din' },
    { key: 'my_profile.complete_desc', category: 'profile', en: 'Fill in missing details to get more matches', ckb: 'وردەکاری کەم پڕبکەرەوە بۆ هاوتای زیاتر', kmr: 'Kêmasiyên xwe dagire da ku bêtir hevgirî bibînî', de: 'Fehlende Details ausfüllen', no: 'Fyll inn manglende detaljer' },
    { key: 'my_profile.share', category: 'profile', en: 'Share Profile', ckb: 'هاوبەشکردنی پرۆفایل', kmr: 'Profîlê parve bike', de: 'Profil teilen', no: 'Del profil' },
    { key: 'my_profile.edit', category: 'profile', en: 'Edit Profile', ckb: 'دەستکاریکردنی پرۆفایل', kmr: 'Profîlê biguherîne', de: 'Profil bearbeiten', no: 'Rediger profil' },
    { key: 'my_profile.sections', category: 'profile', en: 'Profile Sections', ckb: 'بەشەکانی پرۆفایل', kmr: 'Beşên profîlê', de: 'Profilabschnitte', no: 'Profilseksjoner' },
    { key: 'my_profile.continue', category: 'profile', en: 'Continue', ckb: 'بەردەوامبوون', kmr: 'Bidomîne', de: 'Weiter', no: 'Fortsett' },
    { key: 'my_profile.values_beliefs', category: 'profile', en: 'Values & Beliefs', ckb: 'بەهاکان و باوەڕەکان', kmr: 'Nirx û Bawer', de: 'Werte & Überzeugungen', no: 'Verdier og tro' },
    { key: 'my_profile.interests_hobbies', category: 'profile', en: 'Interests & Hobbies', ckb: 'ئارەزوو و حەز', kmr: 'Berjewendî û Hobî', de: 'Interessen & Hobbys', no: 'Interesser og hobbyer' },
    { key: 'my_profile.relationship_goals', category: 'profile', en: 'Relationship Goals', ckb: 'ئامانجی پەیوەندی', kmr: 'Armancên têkiliyê', de: 'Beziehungsziele', no: 'Forholdsmål' },

    // NOTIFICATIONS
    { key: 'notifications.activity', category: 'notifications', en: 'Activity', ckb: 'چالاکی', kmr: 'Çalakî', de: 'Aktivität', no: 'Aktivitet' },
    { key: 'notifications.all', category: 'notifications', en: 'All', ckb: 'هەموو', kmr: 'Hemû', de: 'Alle', no: 'Alle' },
    { key: 'notifications.unread', category: 'notifications', en: 'Unread', ckb: 'نەخوێندراوەکان', kmr: 'Nexwendî', de: 'Ungelesen', no: 'Ulest' },
    { key: 'notifications.mark_all_read', category: 'notifications', en: 'Mark all read', ckb: 'هەمووی وەک خوێندراوە نیشانە بکە', kmr: 'Hemûyan wek xwendî nîşan bike', de: 'Alle als gelesen markieren', no: 'Merk alle som lest' },
    { key: 'notifications.no_notifications', category: 'notifications', en: 'No notifications yet', ckb: 'هێشتا هیچ ئاگاداریەک نییە', kmr: 'Hîn agahdarî tune', de: 'Noch keine Benachrichtigungen', no: 'Ingen varsler ennå' },
    { key: 'notifications.no_unread', category: 'notifications', en: 'No unread notifications', ckb: 'هیچ ئاگاداریەکی نەخوێندراوە نییە', kmr: 'Ti agahdariya nexwendî tune', de: 'Keine ungelesenen Benachrichtigungen', no: 'Ingen uleste varsler' },
    { key: 'notifications.title', category: 'notifications', en: 'Notifications', ckb: 'ئاگاداریەکان', kmr: 'Agahdarî', de: 'Benachrichtigungen', no: 'Varsler' },
    { key: 'notifications.view_all', category: 'notifications', en: 'View All', ckb: 'بینینی هەموو', kmr: 'Hemûyan bibîne', de: 'Alle anzeigen', no: 'Vis alle' },
    { key: 'notifications.loading', category: 'notifications', en: 'Loading...', ckb: 'بارکردن...', kmr: 'Tê barkirin...', de: 'Laden...', no: 'Laster...' },

    // SETTINGS
    { key: 'settings.title', category: 'settings', en: 'Settings', ckb: 'ڕێکخستنەکان', kmr: 'Mîheng', de: 'Einstellungen', no: 'Innstillinger' },

    // MATCHES
    { key: 'matches.title', category: 'matches', en: 'Matches', ckb: 'هاوتاکان', kmr: 'Hevgirî', de: 'Matches', no: 'Treff' },
    { key: 'matches.new', category: 'matches', en: 'New', ckb: 'نوێ', kmr: 'Nû', de: 'Neu', no: 'Ny' },
    { key: 'matches.new_matches', category: 'matches', en: 'New Matches', ckb: 'هاوتاکانی نوێ', kmr: 'Hevgiriyên nû', de: 'Neue Matches', no: 'Nye treff' },
    { key: 'matches.no_matches', category: 'matches', en: 'No matches yet', ckb: 'هێشتا هیچ هاوتایەک نییە', kmr: 'Hîn hevgirî tune', de: 'Noch keine Matches', no: 'Ingen treff ennå' },
    { key: 'matches.start_swiping', category: 'matches', en: 'Start swiping to find your match!', ckb: 'دەستبکە بە سوایپکردن بۆ دۆزینەوەی هاوتات!', kmr: 'Dest bi swipê bike da ku hevgiriya xwe bibînî!', de: 'Starte das Swipen um dein Match zu finden!', no: 'Start å sveipe for å finne ditt treff!' },
    { key: 'matches.loading', category: 'matches', en: 'Loading matches...', ckb: 'بارکردنی هاوتاکان...', kmr: 'Hevgirî tên barkirin...', de: 'Matches werden geladen...', no: 'Laster treff...' },
    { key: 'matches.start_swiping_btn', category: 'matches', en: 'Start Swiping', ckb: 'دەستبکە', kmr: 'Dest pê bike', de: 'Swipen starten', no: 'Start å sveipe' },

    // LIKED ME
    { key: 'liked_me.title', category: 'likes', en: 'Liked You', ckb: 'پەسەندی تۆی کردووە', kmr: 'Te hez kir', de: 'Gefällt dir', no: 'Liker deg' },
    { key: 'liked_me.subtitle', category: 'likes', en: 'People who liked your profile', ckb: 'کەسانەی پرۆفایلەکەتیان پەسەند کردووە', kmr: 'Kesên ku profîla te hez kirin', de: 'Personen die dein Profil mögen', no: 'Folk som liker profilen din' },
    { key: 'liked_me.no_likes', category: 'likes', en: 'No likes yet', ckb: 'هێشتا هیچ پەسەندکردنێک نییە', kmr: 'Hîn hezkirin tune', de: 'Noch keine Likes', no: 'Ingen liker ennå' },
    { key: 'liked_me.no_likes_desc', category: 'likes', en: 'When someone likes your profile, they\'ll appear here. Keep your profile active to get more likes!', ckb: 'کاتێک کەسێک پرۆفایلەکەت پەسەند بکات لێرە دەردەکەوێت. پرۆفایلەکەت چالاک بهێڵەرەوە!', kmr: 'Dema ku yek profîla te hez bike, ew ê li vir xuya bibe. Profîla xwe çalak bihêle!', de: 'Wenn jemand dein Profil mag erscheint er hier.', no: 'Når noen liker profilen din vises de her.' },
    { key: 'liked_me.loading', category: 'likes', en: 'Loading profiles who liked you...', ckb: 'بارکردنی پرۆفایلەکانی پەسەندکارانت...', kmr: 'Profîlên ku te hez kirin tên barkirin...', de: 'Lade Profile die dich mögen...', no: 'Laster profiler som liker deg...' },

    // VIEWED ME
    { key: 'viewed_me.title', category: 'profile', en: 'Profile Views', ckb: 'بینینەکانی پرۆفایل', kmr: 'Dîtinên profîlê', de: 'Profilaufrufe', no: 'Profilvisninger' },
    { key: 'viewed_me.subtitle', category: 'profile', en: "See who's been checking you out", ckb: 'ببینە کێ سەیری تۆی کردووە', kmr: 'Bibîne kê te kontrol kiriye', de: 'Sieh wer dein Profil besucht hat', no: 'Se hvem som har sett på deg' },
    { key: 'viewed_me.no_views', category: 'profile', en: 'No profile views yet', ckb: 'هێشتا هیچ بینینێکی پرۆفایل نییە', kmr: 'Hîn dîtinên profîlê tune', de: 'Noch keine Profilaufrufe', no: 'Ingen profilvisninger ennå' },
    { key: 'viewed_me.no_views_desc', category: 'profile', en: 'When someone views your profile, they\'ll appear here. Keep your profile active to get more views!', ckb: 'کاتێک کەسێک پرۆفایلەکەت ببینێت لێرە دەردەکەوێت!', kmr: 'Dema ku yek profîla te bibîne, ew ê li vir xuya bibe!', de: 'Wenn jemand dein Profil ansieht erscheint er hier.', no: 'Når noen ser på profilen din vises de her.' },
    { key: 'viewed_me.loading', category: 'profile', en: 'Loading profile views...', ckb: 'بارکردنی بینینەکانی پرۆفایل...', kmr: 'Dîtinên profîlê tên barkirin...', de: 'Profilaufrufe werden geladen...', no: 'Laster profilvisninger...' },

    // BLOCKED USERS
    { key: 'blocked.title', category: 'settings', en: 'Blocked Users', ckb: 'بەکارهێنەرە بلۆککراوەکان', kmr: 'Bikarhênerên astengkirî', de: 'Blockierte Benutzer', no: 'Blokkerte brukere' },
    { key: 'blocked.no_blocked', category: 'settings', en: 'No blocked users', ckb: 'هیچ بەکارهێنەرێکی بلۆککراو نییە', kmr: 'Ti bikarhênerê astengkirî tune', de: 'Keine blockierten Benutzer', no: 'Ingen blokkerte brukere' },
    { key: 'blocked.no_blocked_desc', category: 'settings', en: "You haven't blocked anyone yet", ckb: 'هێشتا کەست بلۆک نەکردووە', kmr: 'Te hîn kes asteng nekiriye', de: 'Sie haben noch niemanden blockiert', no: 'Du har ikke blokkert noen ennå' },
    { key: 'blocked.unblock', category: 'settings', en: 'Unblock', ckb: 'لابردنی بلۆک', kmr: 'Astengkirinê rake', de: 'Entsperren', no: 'Fjern blokkering' },
    { key: 'blocked.unblock_confirm', category: 'settings', en: 'Unblock User?', ckb: 'بلۆکی بەکارهێنەر لاببرێت؟', kmr: 'Astengkirinê ji bikarhênerê rake?', de: 'Benutzer entsperren?', no: 'Fjern blokkering av bruker?' },
    { key: 'blocked.unblock_desc', category: 'settings', en: 'Are you sure you want to unblock', ckb: 'دڵنیایت دەتەوێت بلۆکی لاببرێت', kmr: 'Tu bawer î ku dixwazî astengkirinê rakî', de: 'Sind Sie sicher dass Sie entsperren möchten', no: 'Er du sikker på at du vil fjerne blokkeringen av' },

    // EVENTS
    { key: 'events.title', category: 'events', en: 'Events', ckb: 'بۆنەکان', kmr: 'Bûyer', de: 'Veranstaltungen', no: 'Arrangementer' },
    { key: 'events.create', category: 'events', en: 'Create', ckb: 'دروستکردن', kmr: 'Afirandin', de: 'Erstellen', no: 'Opprett' },
    { key: 'events.all', category: 'events', en: 'All Events', ckb: 'هەموو بۆنەکان', kmr: 'Hemû bûyer', de: 'Alle Veranstaltungen', no: 'Alle arrangementer' },
    { key: 'events.mine', category: 'events', en: 'My Events', ckb: 'بۆنەکانی من', kmr: 'Bûyerên min', de: 'Meine Veranstaltungen', no: 'Mine arrangementer' },
    { key: 'events.loading', category: 'events', en: 'Loading events...', ckb: 'بارکردنی بۆنەکان...', kmr: 'Bûyer tên barkirin...', de: 'Veranstaltungen laden...', no: 'Laster arrangementer...' },
    { key: 'events.no_events', category: 'events', en: 'No upcoming events', ckb: 'هیچ بۆنەیەکی داهاتوو نییە', kmr: 'Ti bûyera pêş de tune', de: 'Keine anstehenden Veranstaltungen', no: 'Ingen kommende arrangementer' },
    { key: 'events.not_joined', category: 'events', en: "You haven't joined any events yet.", ckb: 'هێشتا بەشداری هیچ بۆنەیەکت نەکردووە.', kmr: 'Te hîn beşdarî ti bûyerekê nekiriye.', de: 'Sie sind noch keiner Veranstaltung beigetreten.', no: 'Du har ikke deltatt i noen arrangementer ennå.' },

    // GROUPS
    { key: 'groups.title', category: 'groups', en: 'Groups', ckb: 'گرووپەکان', kmr: 'Kom', de: 'Gruppen', no: 'Grupper' },
    { key: 'groups.create', category: 'groups', en: 'Create', ckb: 'دروستکردن', kmr: 'Afirandin', de: 'Erstellen', no: 'Opprett' },
    { key: 'groups.search', category: 'groups', en: 'Search groups...', ckb: 'گەڕان لە گرووپەکان...', kmr: 'Li koman bigere...', de: 'Gruppen suchen...', no: 'Søk i grupper...' },
    { key: 'groups.loading', category: 'groups', en: 'Loading groups...', ckb: 'بارکردنی گرووپەکان...', kmr: 'Kom tên barkirin...', de: 'Gruppen laden...', no: 'Laster grupper...' },
    { key: 'groups.no_groups', category: 'groups', en: 'No groups available yet', ckb: 'هێشتا هیچ گرووپێک بەردەست نییە', kmr: 'Hîn ti kom tune', de: 'Noch keine Gruppen verfügbar', no: 'Ingen grupper tilgjengelig ennå' },
    { key: 'groups.no_results', category: 'groups', en: 'No groups found', ckb: 'هیچ گرووپێک نەدۆزرایەوە', kmr: 'Ti kom nehat dîtin', de: 'Keine Gruppen gefunden', no: 'Ingen grupper funnet' },
    { key: 'groups.members', category: 'groups', en: 'members', ckb: 'ئەندام', kmr: 'endam', de: 'Mitglieder', no: 'medlemmer' },
    { key: 'groups.posts', category: 'groups', en: 'posts', ckb: 'بابەت', kmr: 'şandin', de: 'Beiträge', no: 'innlegg' },

    // SOCIAL / POSTS
    { key: 'social.create_post', category: 'social', en: 'Create Post', ckb: 'دروستکردنی بابەت', kmr: 'Şandinekê biafirîne', de: 'Beitrag erstellen', no: 'Opprett innlegg' },
    { key: 'social.whats_on_mind', category: 'social', en: "What's on your mind?", ckb: 'چی لە مێشکتدایە؟', kmr: 'Çi di hişê te de ye?', de: 'Was denkst du?', no: 'Hva tenker du på?' },
    { key: 'social.share_thoughts', category: 'social', en: 'Share your thoughts...', ckb: 'بیرۆکەکانت هاوبەش بکە...', kmr: 'Ramanên xwe parve bike...', de: 'Teile deine Gedanken...', no: 'Del tankene dine...' },
    { key: 'social.post', category: 'social', en: 'Post', ckb: 'بابەت', kmr: 'Şandin', de: 'Beitrag', no: 'Innlegg' },
    { key: 'social.post_not_found', category: 'social', en: 'Post not found', ckb: 'بابەت نەدۆزرایەوە', kmr: 'Şandin nehat dîtin', de: 'Beitrag nicht gefunden', no: 'Innlegg ikke funnet' },
    { key: 'social.back', category: 'social', en: 'Back', ckb: 'گەڕانەوە', kmr: 'Vegere', de: 'Zurück', no: 'Tilbake' },
    { key: 'social.creating', category: 'social', en: 'Creating...', ckb: 'دروستکردن...', kmr: 'Tê afirandin...', de: 'Erstellen...', no: 'Oppretter...' },
    { key: 'social.media_url', category: 'social', en: 'Media URL (optional)', ckb: 'بەستەری میدیا (ئارەزوومەندانە)', kmr: 'URL-ya medyayê (bijare)', de: 'Medien-URL (optional)', no: 'Medie-URL (valgfritt)' },
    { key: 'social.media_type', category: 'social', en: 'Media Type', ckb: 'جۆری میدیا', kmr: 'Cureyê medyayê', de: 'Medientyp', no: 'Medietype' },
    { key: 'social.detected_hashtags', category: 'social', en: 'Detected Hashtags', ckb: 'هاشتاگە دۆزراوەکان', kmr: 'Hashtagên hatine dîtin', de: 'Erkannte Hashtags', no: 'Oppdagede hashtags' },
    { key: 'social.post_to_groups', category: 'social', en: 'Post to Groups (Optional)', ckb: 'بابەت بۆ گرووپەکان (ئارەزوومەندانە)', kmr: 'Bişîne bo koman (bijare)', de: 'In Gruppen posten (Optional)', no: 'Post til grupper (valgfritt)' },

    // SUBSCRIPTION
    { key: 'subscription.choose_plan', category: 'subscription', en: 'Choose Your Plan', ckb: 'پلانەکەت هەڵبژێرە', kmr: 'Plana xwe hilbijêre', de: 'Wählen Sie Ihren Plan', no: 'Velg din plan' },
    { key: 'subscription.unlock_premium', category: 'subscription', en: 'Unlock premium features and find your perfect match faster', ckb: 'تایبەتمەندییە پریمیۆمەکان بکەرەوە', kmr: 'Taybetmendiyên premium veke', de: 'Premium-Funktionen freischalten', no: 'Lås opp premium-funksjoner' },
    { key: 'subscription.current_plan', category: 'subscription', en: 'Current Plan', ckb: 'پلانی ئێستا', kmr: 'Plana niha', de: 'Aktueller Plan', no: 'Nåværende plan' },
    { key: 'subscription.refresh', category: 'subscription', en: 'Refresh', ckb: 'نوێکردنەوە', kmr: 'Nûve bike', de: 'Aktualisieren', no: 'Oppdater' },
    { key: 'subscription.manage', category: 'subscription', en: 'Manage', ckb: 'بەڕێوەبردن', kmr: 'Birêve bibe', de: 'Verwalten', no: 'Administrer' },
    { key: 'subscription.details', category: 'subscription', en: 'Subscription Details', ckb: 'وردەکاری بەشداری', kmr: 'Hûrgiliyên abonetiyê', de: 'Abonnementdetails', no: 'Abonnementsdetaljer' },

    // HELP
    { key: 'help.title', category: 'help', en: 'Help & Support', ckb: 'یارمەتی و پشتگیری', kmr: 'Alîkarî û Piştgirî', de: 'Hilfe & Support', no: 'Hjelp og støtte' },
    { key: 'help.subtitle', category: 'help', en: "We're here to help", ckb: 'لێرەین بۆ یارمەتیدانت', kmr: 'Em li vir in ku alîkariya te bikin', de: 'Wir sind hier um zu helfen', no: 'Vi er her for å hjelpe' },
    { key: 'help.search', category: 'help', en: 'Search for help...', ckb: 'گەڕان بۆ یارمەتی...', kmr: 'Li alîkariyê bigere...', de: 'Hilfe suchen...', no: 'Søk etter hjelp...' },
    { key: 'help.contact', category: 'help', en: 'Contact Us', ckb: 'پەیوەندیمان پێوە بکە', kmr: 'Bi me re têkilî dayne', de: 'Kontakt', no: 'Kontakt oss' },
    { key: 'help.send_message', category: 'help', en: 'Send a message', ckb: 'نامەیەک بنێرە', kmr: 'Peyamekê bişîne', de: 'Nachricht senden', no: 'Send en melding' },
    { key: 'help.guidelines', category: 'help', en: 'Guidelines', ckb: 'ڕێنمایییەکان', kmr: 'Rêwerz', de: 'Richtlinien', no: 'Retningslinjer' },
    { key: 'help.community_rules', category: 'help', en: 'Community rules', ckb: 'یاساکانی کۆمەڵگە', kmr: 'Qaîdeyên civakê', de: 'Gemeinschaftsregeln', no: 'Fellesskapsregler' },
    { key: 'help.tickets', category: 'help', en: 'My Support Tickets', ckb: 'تیکێتەکانی پشتگیریم', kmr: 'Bilêtên piştgiriya min', de: 'Meine Support-Tickets', no: 'Mine henvendelser' },
    { key: 'help.popular_questions', category: 'help', en: 'Popular Questions', ckb: 'پرسیارە باوەکان', kmr: 'Pirsên populer', de: 'Beliebte Fragen', no: 'Populære spørsmål' },
    { key: 'help.search_results', category: 'help', en: 'Search Results', ckb: 'ئەنجامەکانی گەڕان', kmr: 'Encamên lêgerînê', de: 'Suchergebnisse', no: 'Søkeresultater' },
    { key: 'help.no_results', category: 'help', en: 'No results found for', ckb: 'هیچ ئەنجامێک نەدۆزرایەوە بۆ', kmr: 'Ji bo ti encam nehat dîtin', de: 'Keine Ergebnisse gefunden für', no: 'Ingen resultater funnet for' },
    { key: 'help.contact_support', category: 'help', en: 'Contact support instead', ckb: 'لە جیاتی ئەوە پەیوەندی بە پشتگیری بکە', kmr: 'Li şûna wê bi piştgiriyê re têkilî dayne', de: 'Stattdessen Support kontaktieren', no: 'Kontakt support i stedet' },
    { key: 'help.all_topics', category: 'help', en: 'All Topics', ckb: 'هەموو بابەتەکان', kmr: 'Hemû mijar', de: 'Alle Themen', no: 'Alle emner' },

    // VERIFICATION
    { key: 'verification.title', category: 'verification', en: 'Get Verified', ckb: 'دڵنیایی بکەرەوە', kmr: 'Verîfîkasyonê bistîne', de: 'Verifizierung erhalten', no: 'Bli verifisert' },
    { key: 'verification.subtitle', category: 'verification', en: 'Increase trust and match quality', ckb: 'متمانە و کوالیتی هاوتا زیاد بکە', kmr: 'Pêbawerî û kalîteya hevgiriyê zêde bike', de: 'Vertrauen und Match-Qualität erhöhen', no: 'Øk tillit og matchkvalitet' },

    // MISC / SHARED COMPONENTS
    { key: 'misc.loading', category: 'common', en: 'Loading...', ckb: 'بارکردن...', kmr: 'Tê barkirin...', de: 'Laden...', no: 'Laster...' },
    { key: 'misc.error', category: 'common', en: 'Something went wrong', ckb: 'شتێک هەڵەی هەبوو', kmr: 'Tiştek xelet çêbû', de: 'Etwas ist schiefgelaufen', no: 'Noe gikk galt' },
    { key: 'misc.cancel', category: 'common', en: 'Cancel', ckb: 'هەڵوەشاندنەوە', kmr: 'Betal bike', de: 'Abbrechen', no: 'Avbryt' },
  ];

  const languageMap: Record<string, string> = {
    en: 'english',
    ckb: 'kurdish_sorani',
    kmr: 'kurdish_kurmanci',
    de: 'german',
    no: 'norwegian',
  };

  const rows: any[] = [];
  for (const t of translations) {
    for (const [langKey, langCode] of Object.entries(languageMap)) {
      rows.push({
        language_code: langCode,
        translation_key: t.key,
        translation_value: (t as any)[langKey],
        category: t.category,
        auto_translated: langKey !== 'en',
        needs_review: false,
      });
    }
  }

  // Upsert in batches of 200
  const batchSize = 200;
  let inserted = 0;
  let errors: string[] = [];
  
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase
      .from('app_translations')
      .upsert(batch, { onConflict: 'language_code,translation_key' });
    
    if (error) {
      errors.push(`Batch ${i / batchSize}: ${error.message}`);
    } else {
      inserted += batch.length;
    }
  }

  return new Response(
    JSON.stringify({ 
      success: errors.length === 0,
      total_rows: rows.length,
      inserted,
      errors,
      translation_count: translations.length,
      languages: Object.values(languageMap),
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
