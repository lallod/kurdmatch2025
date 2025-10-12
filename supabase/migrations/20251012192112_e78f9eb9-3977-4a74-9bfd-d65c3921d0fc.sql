-- Seed app_translations with core translations
-- Common UI elements
INSERT INTO app_translations (language_code, translation_key, translation_value, category, needs_review) VALUES
-- English
('english', 'common.save', 'Save', 'common', false),
('english', 'common.cancel', 'Cancel', 'common', false),
('english', 'common.delete', 'Delete', 'common', false),
('english', 'common.edit', 'Edit', 'common', false),
('english', 'common.close', 'Close', 'common', false),
('english', 'common.submit', 'Submit', 'common', false),
('english', 'common.back', 'Back', 'common', false),
('english', 'common.next', 'Next', 'common', false),
('english', 'common.loading', 'Loading...', 'common', false),
('english', 'common.error', 'Error', 'common', false),
('english', 'common.success', 'Success', 'common', false),
('english', 'common.search', 'Search', 'common', false),

-- Norwegian
('norwegian', 'common.save', 'Lagre', 'common', false),
('norwegian', 'common.cancel', 'Avbryt', 'common', false),
('norwegian', 'common.delete', 'Slett', 'common', false),
('norwegian', 'common.edit', 'Rediger', 'common', false),
('norwegian', 'common.close', 'Lukk', 'common', false),
('norwegian', 'common.submit', 'Send inn', 'common', false),
('norwegian', 'common.back', 'Tilbake', 'common', false),
('norwegian', 'common.next', 'Neste', 'common', false),
('norwegian', 'common.loading', 'Laster...', 'common', false),
('norwegian', 'common.error', 'Feil', 'common', false),
('norwegian', 'common.success', 'Suksess', 'common', false),
('norwegian', 'common.search', 'Søk', 'common', false),

-- German
('german', 'common.save', 'Speichern', 'common', false),
('german', 'common.cancel', 'Abbrechen', 'common', false),
('german', 'common.delete', 'Löschen', 'common', false),
('german', 'common.edit', 'Bearbeiten', 'common', false),
('german', 'common.close', 'Schließen', 'common', false),
('german', 'common.submit', 'Absenden', 'common', false),
('german', 'common.back', 'Zurück', 'common', false),
('german', 'common.next', 'Weiter', 'common', false),
('german', 'common.loading', 'Lädt...', 'common', false),
('german', 'common.error', 'Fehler', 'common', false),
('german', 'common.success', 'Erfolg', 'common', false),
('german', 'common.search', 'Suchen', 'common', false),

-- Kurdish Sorani - Keep English where uncertain
('kurdish_sorani', 'common.save', 'پاشەکەوتکردن', 'common', false),
('kurdish_sorani', 'common.cancel', 'Cancel', 'common', true),
('kurdish_sorani', 'common.delete', 'سڕینەوە', 'common', false),
('kurdish_sorani', 'common.edit', 'Edit', 'common', true),
('kurdish_sorani', 'common.close', 'Close', 'common', true),
('kurdish_sorani', 'common.submit', 'Submit', 'common', true),
('kurdish_sorani', 'common.back', 'Back', 'common', true),
('kurdish_sorani', 'common.next', 'Next', 'common', true),
('kurdish_sorani', 'common.loading', 'Loading...', 'common', true),
('kurdish_sorani', 'common.error', 'Error', 'common', true),
('kurdish_sorani', 'common.success', 'Success', 'common', true),
('kurdish_sorani', 'common.search', 'گەڕان', 'common', false),

-- Kurdish Kurmanci - Keep English where uncertain
('kurdish_kurmanci', 'common.save', 'Save', 'common', true),
('kurdish_kurmanci', 'common.cancel', 'Cancel', 'common', true),
('kurdish_kurmanci', 'common.delete', 'Delete', 'common', true),
('kurdish_kurmanci', 'common.edit', 'Edit', 'common', true),
('kurdish_kurmanci', 'common.close', 'Close', 'common', true),
('kurdish_kurmanci', 'common.submit', 'Submit', 'common', true),
('kurdish_kurmanci', 'common.back', 'Back', 'common', true),
('kurdish_kurmanci', 'common.next', 'Next', 'common', true),
('kurdish_kurmanci', 'common.loading', 'Loading...', 'common', true),
('kurdish_kurmanci', 'common.error', 'Error', 'common', true),
('kurdish_kurmanci', 'common.success', 'Success', 'common', true),
('kurdish_kurmanci', 'common.search', 'Lêgerîn', 'common', false);

-- Navigation
INSERT INTO app_translations (language_code, translation_key, translation_value, category, needs_review) VALUES
-- English
('english', 'nav.discover', 'Discover', 'navigation', false),
('english', 'nav.swipe', 'Swipe', 'navigation', false),
('english', 'nav.messages', 'Messages', 'navigation', false),
('english', 'nav.profile', 'Profile', 'navigation', false),
('english', 'nav.settings', 'Settings', 'navigation', false),

-- Norwegian
('norwegian', 'nav.discover', 'Oppdag', 'navigation', false),
('norwegian', 'nav.swipe', 'Sveip', 'navigation', false),
('norwegian', 'nav.messages', 'Meldinger', 'navigation', false),
('norwegian', 'nav.profile', 'Profil', 'navigation', false),
('norwegian', 'nav.settings', 'Innstillinger', 'navigation', false),

-- German
('german', 'nav.discover', 'Entdecken', 'navigation', false),
('german', 'nav.swipe', 'Swipen', 'navigation', false),
('german', 'nav.messages', 'Nachrichten', 'navigation', false),
('german', 'nav.profile', 'Profil', 'navigation', false),
('german', 'nav.settings', 'Einstellungen', 'navigation', false),

-- Kurdish Sorani
('kurdish_sorani', 'nav.discover', 'Discover', 'navigation', true),
('kurdish_sorani', 'nav.swipe', 'Swipe', 'navigation', true),
('kurdish_sorani', 'nav.messages', 'Messages', 'navigation', true),
('kurdish_sorani', 'nav.profile', 'Profile', 'navigation', true),
('kurdish_sorani', 'nav.settings', 'Settings', 'navigation', true),

-- Kurdish Kurmanci
('kurdish_kurmanci', 'nav.discover', 'Discover', 'navigation', true),
('kurdish_kurmanci', 'nav.swipe', 'Swipe', 'navigation', true),
('kurdish_kurmanci', 'nav.messages', 'Messages', 'navigation', true),
('kurdish_kurmanci', 'nav.profile', 'Profile', 'navigation', true),
('kurdish_kurmanci', 'nav.settings', 'Settings', 'navigation', true);

-- Auth
INSERT INTO app_translations (language_code, translation_key, translation_value, category, needs_review) VALUES
-- English
('english', 'auth.login', 'Log In', 'auth', false),
('english', 'auth.register', 'Register', 'auth', false),
('english', 'auth.email', 'Email', 'auth', false),
('english', 'auth.password', 'Password', 'auth', false),
('english', 'auth.forgot_password', 'Forgot Password?', 'auth', false),
('english', 'auth.sign_out', 'Sign Out', 'auth', false),

-- Norwegian
('norwegian', 'auth.login', 'Logg inn', 'auth', false),
('norwegian', 'auth.register', 'Registrer', 'auth', false),
('norwegian', 'auth.email', 'E-post', 'auth', false),
('norwegian', 'auth.password', 'Passord', 'auth', false),
('norwegian', 'auth.forgot_password', 'Glemt passord?', 'auth', false),
('norwegian', 'auth.sign_out', 'Logg ut', 'auth', false),

-- German
('german', 'auth.login', 'Anmelden', 'auth', false),
('german', 'auth.register', 'Registrieren', 'auth', false),
('german', 'auth.email', 'E-Mail', 'auth', false),
('german', 'auth.password', 'Passwort', 'auth', false),
('german', 'auth.forgot_password', 'Passwort vergessen?', 'auth', false),
('german', 'auth.sign_out', 'Abmelden', 'auth', false),

-- Kurdish Sorani
('kurdish_sorani', 'auth.login', 'Log In', 'auth', true),
('kurdish_sorani', 'auth.register', 'Register', 'auth', true),
('kurdish_sorani', 'auth.email', 'Email', 'auth', true),
('kurdish_sorani', 'auth.password', 'Password', 'auth', true),
('kurdish_sorani', 'auth.forgot_password', 'Forgot Password?', 'auth', true),
('kurdish_sorani', 'auth.sign_out', 'Sign Out', 'auth', true),

-- Kurdish Kurmanci
('kurdish_kurmanci', 'auth.login', 'Log In', 'auth', true),
('kurdish_kurmanci', 'auth.register', 'Register', 'auth', true),
('kurdish_kurmanci', 'auth.email', 'Email', 'auth', true),
('kurdish_kurmanci', 'auth.password', 'Password', 'auth', true),
('kurdish_kurmanci', 'auth.forgot_password', 'Forgot Password?', 'auth', true),
('kurdish_kurmanci', 'auth.sign_out', 'Sign Out', 'auth', true);

-- Settings
INSERT INTO app_translations (language_code, translation_key, translation_value, category, needs_review) VALUES
-- English
('english', 'settings.title', 'Settings', 'settings', false),
('english', 'settings.language', 'Language', 'settings', false),
('english', 'settings.notifications', 'Notifications', 'settings', false),
('english', 'settings.privacy', 'Privacy', 'settings', false),
('english', 'settings.account', 'Account', 'settings', false),

-- Norwegian
('norwegian', 'settings.title', 'Innstillinger', 'settings', false),
('norwegian', 'settings.language', 'Språk', 'settings', false),
('norwegian', 'settings.notifications', 'Varsler', 'settings', false),
('norwegian', 'settings.privacy', 'Personvern', 'settings', false),
('norwegian', 'settings.account', 'Konto', 'settings', false),

-- German
('german', 'settings.title', 'Einstellungen', 'settings', false),
('german', 'settings.language', 'Sprache', 'settings', false),
('german', 'settings.notifications', 'Benachrichtigungen', 'settings', false),
('german', 'settings.privacy', 'Datenschutz', 'settings', false),
('german', 'settings.account', 'Konto', 'settings', false),

-- Kurdish Sorani
('kurdish_sorani', 'settings.title', 'Settings', 'settings', true),
('kurdish_sorani', 'settings.language', 'Language', 'settings', true),
('kurdish_sorani', 'settings.notifications', 'Notifications', 'settings', true),
('kurdish_sorani', 'settings.privacy', 'Privacy', 'settings', true),
('kurdish_sorani', 'settings.account', 'Account', 'settings', true),

-- Kurdish Kurmanci
('kurdish_kurmanci', 'settings.title', 'Settings', 'settings', true),
('kurdish_kurmanci', 'settings.language', 'Language', 'settings', true),
('kurdish_kurmanci', 'settings.notifications', 'Notifications', 'settings', true),
('kurdish_kurmanci', 'settings.privacy', 'Privacy', 'settings', true),
('kurdish_kurmanci', 'settings.account', 'Account', 'settings', true);