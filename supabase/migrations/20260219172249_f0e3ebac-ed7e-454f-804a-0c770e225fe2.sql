
-- Batch: LocationSearch, useRegistrationFormLogic, useAdminAuth, useSetupManager translations
-- 5 languages × ~25 keys = ~125 rows

INSERT INTO public.app_translations (language_code, translation_key, translation_value, category, auto_translated) VALUES
-- location.search_error
('english','location.search_error','Search error','common',false),
('norwegian','location.search_error','Søkefeil','common',true),
('german','location.search_error','Suchfehler','common',true),
('kurdish_sorani','location.search_error','هەڵەی گەڕان','common',true),
('kurdish_kurmanji','location.search_error','Çewtiya lêgerînê','common',true),
-- location.search_error_desc
('english','location.search_error_desc','Could not search for locations. Please try again.','common',false),
('norwegian','location.search_error_desc','Kunne ikke søke etter steder. Vennligst prøv igjen.','common',true),
('german','location.search_error_desc','Standorte konnten nicht gesucht werden. Bitte versuchen Sie es erneut.','common',true),
('kurdish_sorani','location.search_error_desc','نەتوانرا شوێنەکان بگەڕێت. تکایە دووبارە هەوڵ بدە.','common',true),
('kurdish_kurmanji','location.search_error_desc','Cîh nehatin lêgerîn. Ji kerema xwe dîsa biceribîne.','common',true),
-- location.searching
('english','location.searching','Searching locations...','common',false),
('norwegian','location.searching','Søker etter steder...','common',true),
('german','location.searching','Standorte werden gesucht...','common',true),
('kurdish_sorani','location.searching','شوێنەکان دەگەڕێت...','common',true),
('kurdish_kurmanji','location.searching','Cîh tên lêgerîn...','common',true),
-- location.search_results
('english','location.search_results','Search Results','common',false),
('norwegian','location.search_results','Søkeresultater','common',true),
('german','location.search_results','Suchergebnisse','common',true),
('kurdish_sorani','location.search_results','ئەنجامەکانی گەڕان','common',true),
('kurdish_kurmanji','location.search_results','Encamên lêgerînê','common',true),
-- location.recent_searches
('english','location.recent_searches','Recent Searches','common',false),
('norwegian','location.recent_searches','Nylige søk','common',true),
('german','location.recent_searches','Letzte Suchen','common',true),
('kurdish_sorani','location.recent_searches','گەڕانەکانی تازە','common',true),
('kurdish_kurmanji','location.recent_searches','Lêgerînên dawî','common',true),
-- reg.unable_verify_email
('english','reg.unable_verify_email','Unable to verify email','auth',false),
('norwegian','reg.unable_verify_email','Kan ikke bekrefte e-post','auth',true),
('german','reg.unable_verify_email','E-Mail konnte nicht verifiziert werden','auth',true),
('kurdish_sorani','reg.unable_verify_email','ناتوانرێت ئیمەیڵ پشتڕاست بکرێتەوە','auth',true),
('kurdish_kurmanji','reg.unable_verify_email','E-name nayê piştrastkirin','auth',true),
-- reg.check_connection
('english','reg.check_connection','Please check your connection and try again.','auth',false),
('norwegian','reg.check_connection','Vennligst sjekk tilkoblingen din og prøv igjen.','auth',true),
('german','reg.check_connection','Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.','auth',true),
('kurdish_sorani','reg.check_connection','تکایە پەیوەندیەکەت بپشکنە و دووبارە هەوڵ بدە.','auth',true),
('kurdish_kurmanji','reg.check_connection','Ji kerema xwe girêdana xwe kontrol bike û dîsa biceribîne.','auth',true),
-- reg.email_already_registered
('english','reg.email_already_registered','Email Already Registered','auth',false),
('norwegian','reg.email_already_registered','E-post allerede registrert','auth',true),
('german','reg.email_already_registered','E-Mail bereits registriert','auth',true),
('kurdish_sorani','reg.email_already_registered','ئیمەیڵ پێشتر تۆمار کراوە','auth',true),
('kurdish_kurmanji','reg.email_already_registered','E-name berê hatiye tomarkirin','auth',true),
-- reg.use_different_email
('english','reg.use_different_email','Please use a different email or sign in to your existing account.','auth',false),
('norwegian','reg.use_different_email','Vennligst bruk en annen e-post eller logg inn på din eksisterende konto.','auth',true),
('german','reg.use_different_email','Bitte verwenden Sie eine andere E-Mail oder melden Sie sich bei Ihrem bestehenden Konto an.','auth',true),
('kurdish_sorani','reg.use_different_email','تکایە ئیمەیڵێکی جیاواز بەکاربهێنە یان بچۆ ژوورەوە بۆ هەژمارەکەت.','auth',true),
('kurdish_kurmanji','reg.use_different_email','Ji kerema xwe e-nameyek din bikar bîne an jî têkeve hesabê xwe yê heyî.','auth',true),
-- reg.photo_storage_error
('english','reg.photo_storage_error','Photo Storage Error','auth',false),
('norwegian','reg.photo_storage_error','Feil ved lagring av bilde','auth',true),
('german','reg.photo_storage_error','Fehler beim Speichern des Fotos','auth',true),
('kurdish_sorani','reg.photo_storage_error','هەڵەی هەڵگرتنی وێنە','auth',true),
('kurdish_kurmanji','reg.photo_storage_error','Çewtiya hilanîna wêneyê','auth',true),
-- reg.photos_save_failed
('english','reg.photos_save_failed','Photos uploaded but failed to save to database','auth',false),
('norwegian','reg.photos_save_failed','Bilder lastet opp men kunne ikke lagres i databasen','auth',true),
('german','reg.photos_save_failed','Fotos hochgeladen, aber Speichern in der Datenbank fehlgeschlagen','auth',true),
('kurdish_sorani','reg.photos_save_failed','وێنەکان بارکران بەڵام هەڵگرتن لە داتابەیس سەرکەوتوو نەبوو','auth',true),
('kurdish_kurmanji','reg.photos_save_failed','Wêne hatin barkirin lê hilanîna di databasê de bi ser neket','auth',true),
-- reg.success
('english','reg.success','Success!','auth',false),
('norwegian','reg.success','Suksess!','auth',true),
('german','reg.success','Erfolg!','auth',true),
('kurdish_sorani','reg.success','سەرکەوتوو!','auth',true),
('kurdish_kurmanji','reg.success','Serkeftin!','auth',true),
-- reg.account_created
('english','reg.account_created','Your account has been created. Please check your email to verify your account.','auth',false),
('norwegian','reg.account_created','Kontoen din er opprettet. Vennligst sjekk e-posten din for å bekrefte kontoen.','auth',true),
('german','reg.account_created','Ihr Konto wurde erstellt. Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu verifizieren.','auth',true),
('kurdish_sorani','reg.account_created','هەژمارەکەت دروست کرا. تکایە ئیمەیڵەکەت بپشکنە بۆ پشتڕاستکردنەوەی هەژمارەکەت.','auth',true),
('kurdish_kurmanji','reg.account_created','Hesabê te hat afirandin. Ji kerema xwe e-nameya xwe kontrol bike da ku hesabê xwe piştrast bikî.','auth',true),
-- reg.create_failed
('english','reg.create_failed','Failed to create account. Please try again.','auth',false),
('norwegian','reg.create_failed','Kunne ikke opprette konto. Vennligst prøv igjen.','auth',true),
('german','reg.create_failed','Kontoerstellung fehlgeschlagen. Bitte versuchen Sie es erneut.','auth',true),
('kurdish_sorani','reg.create_failed','دروستکردنی هەژمار سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدە.','auth',true),
('kurdish_kurmanji','reg.create_failed','Afirandina hesab bi ser neket. Ji kerema xwe dîsa biceribîne.','auth',true),
-- admin.rate_limited
('english','admin.rate_limited','Rate Limited','auth',false),
('norwegian','admin.rate_limited','For mange forsøk','auth',true),
('german','admin.rate_limited','Zu viele Versuche','auth',true),
('kurdish_sorani','admin.rate_limited','زۆر هەوڵ دراوە','auth',true),
('kurdish_kurmanji','admin.rate_limited','Pir ceribandin','auth',true),
-- admin.rate_limited_desc
('english','admin.rate_limited_desc','Too many login attempts. Please wait before trying again.','auth',false),
('norwegian','admin.rate_limited_desc','For mange innloggingsforsøk. Vennligst vent før du prøver igjen.','auth',true),
('german','admin.rate_limited_desc','Zu viele Anmeldeversuche. Bitte warten Sie, bevor Sie es erneut versuchen.','auth',true),
('kurdish_sorani','admin.rate_limited_desc','هەوڵی چوونەژوورەوەی زۆر. تکایە چاوەڕوان بە پێش هەوڵدانەوە.','auth',true),
('kurdish_kurmanji','admin.rate_limited_desc','Pir ceribandinên têketinê. Ji kerema xwe berî ku dîsa biceribînî bisekine.','auth',true),
-- admin.access_granted
('english','admin.access_granted','Admin Access Granted','auth',false),
('norwegian','admin.access_granted','Administratortilgang innvilget','auth',true),
('german','admin.access_granted','Administratorzugang gewährt','auth',true),
('kurdish_sorani','admin.access_granted','دەستگەیشتنی بەڕێوەبەر دەستوری پێدرا','auth',true),
('kurdish_kurmanji','admin.access_granted','Gihîştina rêveberiyê hat dayîn','auth',true),
-- admin.logged_in_admin
('english','admin.logged_in_admin','You''ve been logged in as a super admin.','auth',false),
('norwegian','admin.logged_in_admin','Du har logget inn som superadministrator.','auth',true),
('german','admin.logged_in_admin','Sie wurden als Super-Admin angemeldet.','auth',true),
('kurdish_sorani','admin.logged_in_admin','وەک سوپەر بەڕێوەبەر چوویتەژوورەوە.','auth',true),
('kurdish_kurmanji','admin.logged_in_admin','Tu wekî super rêveber têketî.','auth',true),
-- admin.auth_failed
('english','admin.auth_failed','Authentication failed','auth',false),
('norwegian','admin.auth_failed','Autentisering mislyktes','auth',true),
('german','admin.auth_failed','Authentifizierung fehlgeschlagen','auth',true),
('kurdish_sorani','admin.auth_failed','ناسینەوە سەرکەوتوو نەبوو','auth',true),
('kurdish_kurmanji','admin.auth_failed','Nasandin bi ser neket','auth',true),
-- admin.account_ready
('english','admin.account_ready','Admin Account Ready','auth',false),
('norwegian','admin.account_ready','Administratorkonto klar','auth',true),
('german','admin.account_ready','Administratorkonto bereit','auth',true),
('kurdish_sorani','admin.account_ready','هەژماری بەڕێوەبەر ئامادەیە','auth',true),
('kurdish_kurmanji','admin.account_ready','Hesabê rêveberiyê amade ye','auth',true),
-- admin.account_verified
('english','admin.account_verified','Super admin account has been verified successfully.','auth',false),
('norwegian','admin.account_verified','Superadministratorkonto er bekreftet.','auth',true),
('german','admin.account_verified','Super-Admin-Konto wurde erfolgreich verifiziert.','auth',true),
('kurdish_sorani','admin.account_verified','هەژماری سوپەر بەڕێوەبەر بە سەرکەوتوویی پشتڕاست کرایەوە.','auth',true),
('kurdish_kurmanji','admin.account_verified','Hesabê super rêveber bi serkeftî hat piştrastkirin.','auth',true),
-- admin.setup_delayed
('english','admin.setup_delayed','Setup Delayed','auth',false),
('norwegian','admin.setup_delayed','Oppsett forsinket','auth',true),
('german','admin.setup_delayed','Einrichtung verzögert','auth',true),
('kurdish_sorani','admin.setup_delayed','دامەزراندن دواخرا','auth',true),
('kurdish_kurmanji','admin.setup_delayed','Sazkirina dereng','auth',true),
-- admin.setup_issue
('english','admin.setup_issue','Setup Issue','auth',false),
('norwegian','admin.setup_issue','Oppsettsproblem','auth',true),
('german','admin.setup_issue','Einrichtungsproblem','auth',true),
('kurdish_sorani','admin.setup_issue','کێشەی دامەزراندن','auth',true),
('kurdish_kurmanji','admin.setup_issue','Pirsgirêka sazkirinê','auth',true),
-- admin.setup_error
('english','admin.setup_error','Setup Error','auth',false),
('norwegian','admin.setup_error','Oppsettsfeil','auth',true),
('german','admin.setup_error','Einrichtungsfehler','auth',true),
('kurdish_sorani','admin.setup_error','هەڵەی دامەزراندن','auth',true),
('kurdish_kurmanji','admin.setup_error','Çewtiya sazkirinê','auth',true),
-- admin.retry_failed
('english','admin.retry_failed','Retry Failed','auth',false),
('norwegian','admin.retry_failed','Nytt forsøk mislyktes','auth',true),
('german','admin.retry_failed','Wiederholung fehlgeschlagen','auth',true),
('kurdish_sorani','admin.retry_failed','هەوڵدانەوە سەرکەوتوو نەبوو','auth',true),
('kurdish_kurmanji','admin.retry_failed','Ceribandineke din bi ser neket','auth',true),
-- admin.cache_cleared
('english','admin.cache_cleared','Cache Cleared','auth',false),
('norwegian','admin.cache_cleared','Hurtigminne tømt','auth',true),
('german','admin.cache_cleared','Cache gelöscht','auth',true),
('kurdish_sorani','admin.cache_cleared','کاش پاک کرایەوە','auth',true),
('kurdish_kurmanji','admin.cache_cleared','Cache hat pakkirin','auth',true),
-- admin.cache_cleared_desc
('english','admin.cache_cleared_desc','Setup cache has been cleared. You can now retry the setup.','auth',false),
('norwegian','admin.cache_cleared_desc','Oppsetts-hurtigminne er tømt. Du kan nå prøve oppsettet på nytt.','auth',true),
('german','admin.cache_cleared_desc','Einrichtungs-Cache wurde gelöscht. Sie können die Einrichtung jetzt erneut versuchen.','auth',true),
('kurdish_sorani','admin.cache_cleared_desc','کاشی دامەزراندن پاک کرایەوە. ئێستا دەتوانیت دووبارە هەوڵ بدەیت.','auth',true),
('kurdish_kurmanji','admin.cache_cleared_desc','Cache sazkirinê hat pakkirin. Tu niha dikarî dîsa biceribînî.','auth',true)
ON CONFLICT (language_code, translation_key) DO NOTHING;
