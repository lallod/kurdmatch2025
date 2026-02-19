
INSERT INTO public.app_translations (language_code, translation_key, translation_value, category, context) VALUES
-- ProfileHeader toasts
('english','toast.message_sent','Message sent to {{name}}!','toast','ProfileHeader'),
('english','toast.liked_user','You liked {{name}}!','toast','ProfileHeader'),
('english','toast.passed_on','You passed on {{name}}','toast','ProfileHeader'),
('norwegian','toast.message_sent','Melding sendt til {{name}}!','toast','ProfileHeader'),
('norwegian','toast.liked_user','Du likte {{name}}!','toast','ProfileHeader'),
('norwegian','toast.passed_on','Du gikk videre fra {{name}}','toast','ProfileHeader'),
('german','toast.message_sent','Nachricht an {{name}} gesendet!','toast','ProfileHeader'),
('german','toast.liked_user','Du magst {{name}}!','toast','ProfileHeader'),
('german','toast.passed_on','Du hast {{name}} übersprungen','toast','ProfileHeader'),
('kurdish_sorani','toast.message_sent','نامە نێردرا بۆ {{name}}!','toast','ProfileHeader'),
('kurdish_sorani','toast.liked_user','حەزت کرد بە {{name}}!','toast','ProfileHeader'),
('kurdish_sorani','toast.passed_on','تێپەڕیت لە {{name}}','toast','ProfileHeader'),
('kurdish_kurmanji','toast.message_sent','Peyam ji {{name}} re hat şandin!','toast','ProfileHeader'),
('kurdish_kurmanji','toast.liked_user','Te {{name}} hez kir!','toast','ProfileHeader'),
('kurdish_kurmanji','toast.passed_on','Te {{name}} derbas kir','toast','ProfileHeader'),

-- Swipe rewind toast
('english','toast.swipe.rewinds_used','You''ve used all {{limit}} rewinds today','toast','useSwipeHistory'),
('norwegian','toast.swipe.rewinds_used','Du har brukt alle {{limit}} angre i dag','toast','useSwipeHistory'),
('german','toast.swipe.rewinds_used','Du hast alle {{limit}} Rückgängig heute benutzt','toast','useSwipeHistory'),
('kurdish_sorani','toast.swipe.rewinds_used','هەموو {{limit}} گەڕانەوەکانت بەکار هێناوە ئەمڕۆ','toast','useSwipeHistory'),
('kurdish_kurmanji','toast.swipe.rewinds_used','Te hemû {{limit}} vegerandinên îro bi kar anîn','toast','useSwipeHistory'),

-- Admin settings toasts
('english','toast.admin.update_failed','Failed to update setting: {{message}}','toast','useAdminSettings'),
('english','toast.admin.save_failed','Failed to save settings: {{message}}','toast','useAdminSettings'),
('english','toast.admin.reset_failed','Failed to reset settings: {{message}}','toast','useAdminSettings'),
('norwegian','toast.admin.update_failed','Kunne ikke oppdatere innstilling: {{message}}','toast','useAdminSettings'),
('norwegian','toast.admin.save_failed','Kunne ikke lagre innstillinger: {{message}}','toast','useAdminSettings'),
('norwegian','toast.admin.reset_failed','Kunne ikke tilbakestille innstillinger: {{message}}','toast','useAdminSettings'),
('german','toast.admin.update_failed','Einstellung konnte nicht aktualisiert werden: {{message}}','toast','useAdminSettings'),
('german','toast.admin.save_failed','Einstellungen konnten nicht gespeichert werden: {{message}}','toast','useAdminSettings'),
('german','toast.admin.reset_failed','Einstellungen konnten nicht zurückgesetzt werden: {{message}}','toast','useAdminSettings'),
('kurdish_sorani','toast.admin.update_failed','نەتوانرا ڕێکخستن نوێ بکرێتەوە: {{message}}','toast','useAdminSettings'),
('kurdish_sorani','toast.admin.save_failed','نەتوانرا ڕێکخستنەکان پاشەکەوت بکرێن: {{message}}','toast','useAdminSettings'),
('kurdish_sorani','toast.admin.reset_failed','نەتوانرا ڕێکخستنەکان بگەڕێنرێنەوە: {{message}}','toast','useAdminSettings'),
('kurdish_kurmanji','toast.admin.update_failed','Nehat nûkirin: {{message}}','toast','useAdminSettings'),
('kurdish_kurmanji','toast.admin.save_failed','Nehat tomarkirin: {{message}}','toast','useAdminSettings'),
('kurdish_kurmanji','toast.admin.reset_failed','Nehat vegerandin: {{message}}','toast','useAdminSettings'),

-- Language selector toasts
('english','toast.language.max_limit','You can select up to {{max}} languages','toast','LanguageSelector'),
('english','toast.language.already_exists','{{language}} already exists in the language list','toast','LanguageTabPanel'),
('english','toast.language.already_selected','{{language}} is already selected','toast','LanguageTabPanel'),
('english','toast.language.added','Added {{language}} to your languages','toast','LanguageTabPanel'),
('norwegian','toast.language.max_limit','Du kan velge opptil {{max}} språk','toast','LanguageSelector'),
('norwegian','toast.language.already_exists','{{language}} finnes allerede i språklisten','toast','LanguageTabPanel'),
('norwegian','toast.language.already_selected','{{language}} er allerede valgt','toast','LanguageTabPanel'),
('norwegian','toast.language.added','La til {{language}} i språkene dine','toast','LanguageTabPanel'),
('german','toast.language.max_limit','Du kannst bis zu {{max}} Sprachen auswählen','toast','LanguageSelector'),
('german','toast.language.already_exists','{{language}} existiert bereits in der Sprachliste','toast','LanguageTabPanel'),
('german','toast.language.already_selected','{{language}} ist bereits ausgewählt','toast','LanguageTabPanel'),
('german','toast.language.added','{{language}} zu deinen Sprachen hinzugefügt','toast','LanguageTabPanel'),
('kurdish_sorani','toast.language.max_limit','دەتوانیت هەتا {{max}} زمان هەڵبژێریت','toast','LanguageSelector'),
('kurdish_sorani','toast.language.already_exists','{{language}} پێشتر لە لیستی زماندا هەیە','toast','LanguageTabPanel'),
('kurdish_sorani','toast.language.already_selected','{{language}} پێشتر هەڵبژێردراوە','toast','LanguageTabPanel'),
('kurdish_sorani','toast.language.added','{{language}} زیادکرا بۆ زمانەکانت','toast','LanguageTabPanel'),
('kurdish_kurmanji','toast.language.max_limit','Tu dikarî heya {{max}} zimanan hilbijêrî','toast','LanguageSelector'),
('kurdish_kurmanji','toast.language.already_exists','{{language}} berê di lîsteya zimanan de heye','toast','LanguageTabPanel'),
('kurdish_kurmanji','toast.language.already_selected','{{language}} berê hatiye hilbijartin','toast','LanguageTabPanel'),
('kurdish_kurmanji','toast.language.added','{{language}} li zimanan hat zêdekirin','toast','LanguageTabPanel'),

-- ComprehensiveProfileSettings toast
('english','toast.field_updated','{{field}} updated','toast','ComprehensiveProfileSettings'),
('norwegian','toast.field_updated','{{field}} oppdatert','toast','ComprehensiveProfileSettings'),
('german','toast.field_updated','{{field}} aktualisiert','toast','ComprehensiveProfileSettings'),
('kurdish_sorani','toast.field_updated','{{field}} نوێکرایەوە','toast','ComprehensiveProfileSettings'),
('kurdish_kurmanji','toast.field_updated','{{field}} hate nûkirin','toast','ComprehensiveProfileSettings'),

-- ApiKeysPage toasts
('english','toast.admin.save_key_failed','Failed to save: {{message}}','toast','ApiKeysPage'),
('english','toast.admin.remove_key_failed','Failed to remove: {{message}}','toast','ApiKeysPage'),
('norwegian','toast.admin.save_key_failed','Kunne ikke lagre: {{message}}','toast','ApiKeysPage'),
('norwegian','toast.admin.remove_key_failed','Kunne ikke fjerne: {{message}}','toast','ApiKeysPage'),
('german','toast.admin.save_key_failed','Speichern fehlgeschlagen: {{message}}','toast','ApiKeysPage'),
('german','toast.admin.remove_key_failed','Entfernen fehlgeschlagen: {{message}}','toast','ApiKeysPage'),
('kurdish_sorani','toast.admin.save_key_failed','پاشەکەوتکردن سەرکەوتوو نەبوو: {{message}}','toast','ApiKeysPage'),
('kurdish_sorani','toast.admin.remove_key_failed','سڕینەوە سەرکەوتوو نەبوو: {{message}}','toast','ApiKeysPage'),
('kurdish_kurmanji','toast.admin.save_key_failed','Tomarkirin bi ser neket: {{message}}','toast','ApiKeysPage'),
('kurdish_kurmanji','toast.admin.remove_key_failed','Jêbirin bi ser neket: {{message}}','toast','ApiKeysPage'),

-- QuestionsTable toast
('english','toast.admin.previewing','Previewing: {{text}}','toast','QuestionsTable'),
('norwegian','toast.admin.previewing','Forhåndsvisning: {{text}}','toast','QuestionsTable'),
('german','toast.admin.previewing','Vorschau: {{text}}','toast','QuestionsTable'),
('kurdish_sorani','toast.admin.previewing','پێشبینین: {{text}}','toast','QuestionsTable'),
('kurdish_kurmanji','toast.admin.previewing','Pêşdîtin: {{text}}','toast','QuestionsTable')

ON CONFLICT (language_code, translation_key) DO NOTHING;
