
INSERT INTO public.app_translations (language_code, translation_key, translation_value, category, context) VALUES
('english','admin.provider_updated','{{provider}} provider updated','admin','SocialLoginPage'),
('english','admin.provider_update_failed','Failed to update provider: {{message}}','admin','SocialLoginPage'),
('norwegian','admin.provider_updated','{{provider}}-leverandør oppdatert','admin','SocialLoginPage'),
('norwegian','admin.provider_update_failed','Kunne ikke oppdatere leverandør: {{message}}','admin','SocialLoginPage'),
('german','admin.provider_updated','{{provider}}-Anbieter aktualisiert','admin','SocialLoginPage'),
('german','admin.provider_update_failed','Anbieter konnte nicht aktualisiert werden: {{message}}','admin','SocialLoginPage'),
('kurdish_sorani','admin.provider_updated','دابینکەری {{provider}} نوێکرایەوە','admin','SocialLoginPage'),
('kurdish_sorani','admin.provider_update_failed','نەتوانرا دابینکەر نوێ بکرێتەوە: {{message}}','admin','SocialLoginPage'),
('kurdish_kurmanji','admin.provider_updated','Pêşkêşkerê {{provider}} hate nûkirin','admin','SocialLoginPage'),
('kurdish_kurmanji','admin.provider_update_failed','Nehat nûkirin: {{message}}','admin','SocialLoginPage')
ON CONFLICT (language_code, translation_key) DO NOTHING;
