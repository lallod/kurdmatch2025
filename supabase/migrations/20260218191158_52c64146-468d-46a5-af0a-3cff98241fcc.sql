
-- Batch 4: Remaining user-facing toast messages and UI strings
INSERT INTO public.app_translations (language_code, translation_key, translation_value, category) VALUES
-- EmailVerificationGuard
('english', 'toast.email.verification_sent', 'Verification email sent! Please check your inbox.', 'auth'),
('norwegian', 'toast.email.verification_sent', 'Verifiserings-e-post sendt! Sjekk innboksen din.', 'auth'),
('kurdish_sorani', 'toast.email.verification_sent', 'ئیمەیڵی پشتڕاستکردنەوە نێردرا! ئینبۆکسەکەت بپشکنە.', 'auth'),
('kurdish_kurmanci', 'toast.email.verification_sent', 'E-nameya piştrastkirinê hat şandin! Peyamên xwe kontrol bike.', 'auth'),
('german', 'toast.email.verification_sent', 'Bestätigungs-E-Mail gesendet! Bitte überprüfe deinen Posteingang.', 'auth'),

('english', 'toast.email.verification_failed', 'Failed to send verification email. Please try again.', 'auth'),
('norwegian', 'toast.email.verification_failed', 'Kunne ikke sende verifiserings-e-post. Prøv igjen.', 'auth'),
('kurdish_sorani', 'toast.email.verification_failed', 'نەتوانرا ئیمەیڵی پشتڕاستکردنەوە بنێردرێت. دووبارە هەوڵ بدەوە.', 'auth'),
('kurdish_kurmanci', 'toast.email.verification_failed', 'E-nameya piştrastkirinê nehat şandin. Ji kerema xwe dîsa biceribîne.', 'auth'),
('german', 'toast.email.verification_failed', 'Bestätigungs-E-Mail konnte nicht gesendet werden. Bitte versuche es erneut.', 'auth'),

-- LifestyleEditor
('english', 'toast.profile.lifestyle_updated', 'Lifestyle updated successfully!', 'profile'),
('norwegian', 'toast.profile.lifestyle_updated', 'Livsstil oppdatert!', 'profile'),
('kurdish_sorani', 'toast.profile.lifestyle_updated', 'شێوازی ژیان نوێ کرایەوە!', 'profile'),
('kurdish_kurmanci', 'toast.profile.lifestyle_updated', 'Şêwaza jiyanê hat nûkirin!', 'profile'),
('german', 'toast.profile.lifestyle_updated', 'Lebensstil erfolgreich aktualisiert!', 'profile'),

-- CareerEducationEditor
('english', 'toast.profile.career_updated', 'Career & education updated successfully!', 'profile'),
('norwegian', 'toast.profile.career_updated', 'Karriere og utdanning oppdatert!', 'profile'),
('kurdish_sorani', 'toast.profile.career_updated', 'کار و خوێندن نوێ کرایەوە!', 'profile'),
('kurdish_kurmanci', 'toast.profile.career_updated', 'Karîyer û perwerde hat nûkirin!', 'profile'),
('german', 'toast.profile.career_updated', 'Karriere & Ausbildung erfolgreich aktualisiert!', 'profile'),

-- SwipeActions
('english', 'toast.action.failed', 'Action failed. Please try again.', 'common'),
('norwegian', 'toast.action.failed', 'Handlingen feilet. Prøv igjen.', 'common'),
('kurdish_sorani', 'toast.action.failed', 'کردارەکە سەرنەکەوت. دووبارە هەوڵ بدەوە.', 'common'),
('kurdish_kurmanci', 'toast.action.failed', 'Çalakî bi ser neket. Ji kerema xwe dîsa biceribîne.', 'common'),
('german', 'toast.action.failed', 'Aktion fehlgeschlagen. Bitte versuche es erneut.', 'common'),

-- EventCard
('english', 'toast.event.left', 'Left event', 'events'),
('norwegian', 'toast.event.left', 'Forlot arrangementet', 'events'),
('kurdish_sorani', 'toast.event.left', 'لە بۆنەکە دەرچوویت', 'events'),
('kurdish_kurmanci', 'toast.event.left', 'Ji bûyerê derketin', 'events'),
('german', 'toast.event.left', 'Veranstaltung verlassen', 'events'),

('english', 'toast.event.joined', 'Joined event!', 'events'),
('norwegian', 'toast.event.joined', 'Ble med på arrangementet!', 'events'),
('kurdish_sorani', 'toast.event.joined', 'بەشداری لە بۆنەکە کرد!', 'events'),
('kurdish_kurmanci', 'toast.event.joined', 'Beşdarî bûyerê bû!', 'events'),
('german', 'toast.event.joined', 'Am Event teilgenommen!', 'events'),

('english', 'toast.event.created', 'Event created successfully!', 'events'),
('norwegian', 'toast.event.created', 'Arrangement opprettet!', 'events'),
('kurdish_sorani', 'toast.event.created', 'بۆنەکە بە سەرکەوتوویی دروست کرا!', 'events'),
('kurdish_kurmanci', 'toast.event.created', 'Bûyer bi serkeftî hat afirandin!', 'events'),
('german', 'toast.event.created', 'Veranstaltung erfolgreich erstellt!', 'events'),

('english', 'toast.event.fill_required', 'Please fill in all required fields', 'events'),
('norwegian', 'toast.event.fill_required', 'Vennligst fyll ut alle obligatoriske felt', 'events'),
('kurdish_sorani', 'toast.event.fill_required', 'تکایە هەموو خانە پێویستەکان پڕ بکەوە', 'events'),
('kurdish_kurmanci', 'toast.event.fill_required', 'Ji kerema xwe hemû qadên pêwîst dagirin', 'events'),
('german', 'toast.event.fill_required', 'Bitte fülle alle Pflichtfelder aus', 'events'),

-- MarriageIntentions
('english', 'toast.marriage.select_intention', 'Please select your marriage intention', 'settings'),
('norwegian', 'toast.marriage.select_intention', 'Vennligst velg ekteskapsintensjon', 'settings'),
('kurdish_sorani', 'toast.marriage.select_intention', 'تکایە مەبەستی هاوسەرگیریت هەڵبژێرە', 'settings'),
('kurdish_kurmanci', 'toast.marriage.select_intention', 'Ji kerema xwe armanca zewacê hilbijêre', 'settings'),
('german', 'toast.marriage.select_intention', 'Bitte wähle deine Heiratsabsicht', 'settings'),

('english', 'toast.marriage.saved', 'Marriage intentions saved', 'settings'),
('norwegian', 'toast.marriage.saved', 'Ekteskapsintensjon lagret', 'settings'),
('kurdish_sorani', 'toast.marriage.saved', 'مەبەستی هاوسەرگیری پاشەکەوت کرا', 'settings'),
('kurdish_kurmanci', 'toast.marriage.saved', 'Armanca zewacê hat tomarkirin', 'settings'),
('german', 'toast.marriage.saved', 'Heiratsabsichten gespeichert', 'settings'),

('english', 'toast.save.failed', 'Failed to save', 'common'),
('norwegian', 'toast.save.failed', 'Kunne ikke lagre', 'common'),
('kurdish_sorani', 'toast.save.failed', 'پاشەکەوتکردن سەرنەکەوت', 'common'),
('kurdish_kurmanci', 'toast.save.failed', 'Tomarkirin bi ser neket', 'common'),
('german', 'toast.save.failed', 'Speichern fehlgeschlagen', 'common'),

-- StoryToolbar
('english', 'toast.story.shared', 'Story shared!', 'common'),
('norwegian', 'toast.story.shared', 'Historie delt!', 'common'),
('kurdish_sorani', 'toast.story.shared', 'چیرۆکەکە هاوبەش کرا!', 'common'),
('kurdish_kurmanci', 'toast.story.shared', 'Çîrok hat parve kirin!', 'common'),
('german', 'toast.story.shared', 'Story geteilt!', 'common'),

('english', 'toast.story.details', 'Story details', 'common'),
('norwegian', 'toast.story.details', 'Historiedetaljer', 'common'),
('kurdish_sorani', 'toast.story.details', 'وردەکاری چیرۆک', 'common'),
('kurdish_kurmanci', 'toast.story.details', 'Hûrguliyên çîrokê', 'common'),
('german', 'toast.story.details', 'Story-Details', 'common'),

-- ComprehensiveProfileSettings (reuse some existing keys, add new)
('english', 'toast.profile.photo_updated', 'Profile photo updated', 'profile'),
('norwegian', 'toast.profile.photo_updated', 'Profilbilde oppdatert', 'profile'),
('kurdish_sorani', 'toast.profile.photo_updated', 'وێنەی پرۆفایل نوێ کرایەوە', 'profile'),
('kurdish_kurmanci', 'toast.profile.photo_updated', 'Wêneyê profîlê hat nûkirin', 'profile'),
('german', 'toast.profile.photo_updated', 'Profilfoto aktualisiert', 'profile'),

('english', 'toast.photo.upload_failed', 'Failed to upload photo', 'profile'),
('norwegian', 'toast.photo.upload_failed', 'Kunne ikke laste opp bilde', 'profile'),
('kurdish_sorani', 'toast.photo.upload_failed', 'نەتوانرا وێنە بار بکرێت', 'profile'),
('kurdish_kurmanci', 'toast.photo.upload_failed', 'Wêne nehat barkirin', 'profile'),
('german', 'toast.photo.upload_failed', 'Foto konnte nicht hochgeladen werden', 'profile'),

('english', 'toast.save_changes.failed', 'Failed to save changes', 'common'),
('norwegian', 'toast.save_changes.failed', 'Kunne ikke lagre endringer', 'common'),
('kurdish_sorani', 'toast.save_changes.failed', 'نەتوانرا گۆڕانکاری پاشەکەوت بکرێت', 'common'),
('kurdish_kurmanci', 'toast.save_changes.failed', 'Guhertin nehat tomarkirin', 'common'),
('german', 'toast.save_changes.failed', 'Änderungen konnten nicht gespeichert werden', 'common'),

-- CreatePostDialog
('english', 'toast.post.enter_content', 'Please enter some content', 'posts'),
('norwegian', 'toast.post.enter_content', 'Vennligst skriv noe innhold', 'posts'),
('kurdish_sorani', 'toast.post.enter_content', 'تکایە ناوەڕۆکێک بنووسە', 'posts'),
('kurdish_kurmanci', 'toast.post.enter_content', 'Ji kerema xwe naverokekê binivîse', 'posts'),
('german', 'toast.post.enter_content', 'Bitte gib einen Inhalt ein', 'posts'),

('english', 'toast.post.created', 'Post created successfully!', 'posts'),
('norwegian', 'toast.post.created', 'Innlegg opprettet!', 'posts'),
('kurdish_sorani', 'toast.post.created', 'بابەتەکە بە سەرکەوتوویی دروست کرا!', 'posts'),
('kurdish_kurmanci', 'toast.post.created', 'Post bi serkeftî hat afirandin!', 'posts'),
('german', 'toast.post.created', 'Beitrag erfolgreich erstellt!', 'posts'),

('english', 'toast.post.create_failed', 'Failed to create post', 'posts'),
('norwegian', 'toast.post.create_failed', 'Kunne ikke opprette innlegg', 'posts'),
('kurdish_sorani', 'toast.post.create_failed', 'نەتوانرا بابەت دروست بکرێت', 'posts'),
('kurdish_kurmanci', 'toast.post.create_failed', 'Post nehat afirandin', 'posts'),
('german', 'toast.post.create_failed', 'Beitrag konnte nicht erstellt werden', 'posts'),

-- BlurredProfileOverlay
('english', 'toast.checkout.failed', 'Failed to start checkout', 'payments'),
('norwegian', 'toast.checkout.failed', 'Kunne ikke starte betaling', 'payments'),
('kurdish_sorani', 'toast.checkout.failed', 'نەتوانرا پارەدان دەست پێ بکات', 'payments'),
('kurdish_kurmanci', 'toast.checkout.failed', 'Drav dest pê nekir', 'payments'),
('german', 'toast.checkout.failed', 'Checkout konnte nicht gestartet werden', 'payments'),

-- UnmatchDialog
('english', 'toast.unmatch.failed', 'Failed to unmatch. Please try again.', 'common'),
('norwegian', 'toast.unmatch.failed', 'Kunne ikke fjerne match. Prøv igjen.', 'common'),
('kurdish_sorani', 'toast.unmatch.failed', 'نەتوانرا ماتچ لابدرێت. دووبارە هەوڵ بدەوە.', 'common'),
('kurdish_kurmanci', 'toast.unmatch.failed', 'Match nehat rakirin. Ji kerema xwe dîsa biceribîne.', 'common'),
('german', 'toast.unmatch.failed', 'Entmatchen fehlgeschlagen. Bitte versuche es erneut.', 'common'),

-- ChatView messages
('english', 'toast.conversation.load_failed', 'Failed to load conversation', 'messages'),
('norwegian', 'toast.conversation.load_failed', 'Kunne ikke laste samtale', 'messages'),
('kurdish_sorani', 'toast.conversation.load_failed', 'نەتوانرا گفتوگۆ بار بکرێت', 'messages'),
('kurdish_kurmanci', 'toast.conversation.load_failed', 'Gotûbêj nehat barkirin', 'messages'),
('german', 'toast.conversation.load_failed', 'Unterhaltung konnte nicht geladen werden', 'messages'),

('english', 'toast.message.sent', 'Message sent!', 'messages'),
('norwegian', 'toast.message.sent', 'Melding sendt!', 'messages'),
('kurdish_sorani', 'toast.message.sent', 'نامە نێردرا!', 'messages'),
('kurdish_kurmanci', 'toast.message.sent', 'Peyam hat şandin!', 'messages'),
('german', 'toast.message.sent', 'Nachricht gesendet!', 'messages'),

('english', 'toast.message.rate_limit', 'You''re sending messages too quickly. Please wait a moment.', 'messages'),
('norwegian', 'toast.message.rate_limit', 'Du sender meldinger for raskt. Vent litt.', 'messages'),
('kurdish_sorani', 'toast.message.rate_limit', 'زۆر خێرا نامە دەنێریت. تکایە چاوەڕوان بە.', 'messages'),
('kurdish_kurmanci', 'toast.message.rate_limit', 'Tu pir zû peyaman dişînî. Ji kerema xwe hinekî bisekine.', 'messages'),
('german', 'toast.message.rate_limit', 'Du sendest Nachrichten zu schnell. Bitte warte einen Moment.', 'messages'),

('english', 'toast.message.send_failed', 'Failed to send message', 'messages'),
('norwegian', 'toast.message.send_failed', 'Kunne ikke sende melding', 'messages'),
('kurdish_sorani', 'toast.message.send_failed', 'نەتوانرا نامە بنێردرێت', 'messages'),
('kurdish_kurmanci', 'toast.message.send_failed', 'Peyam nehat şandin', 'messages'),
('german', 'toast.message.send_failed', 'Nachricht konnte nicht gesendet werden', 'messages'),

('english', 'toast.gif.sent', 'GIF sent!', 'messages'),
('norwegian', 'toast.gif.sent', 'GIF sendt!', 'messages'),
('kurdish_sorani', 'toast.gif.sent', 'GIF نێردرا!', 'messages'),
('kurdish_kurmanci', 'toast.gif.sent', 'GIF hat şandin!', 'messages'),
('german', 'toast.gif.sent', 'GIF gesendet!', 'messages'),

('english', 'toast.gif.send_failed', 'Failed to send GIF', 'messages'),
('norwegian', 'toast.gif.send_failed', 'Kunne ikke sende GIF', 'messages'),
('kurdish_sorani', 'toast.gif.send_failed', 'نەتوانرا GIF بنێردرێت', 'messages'),
('kurdish_kurmanci', 'toast.gif.send_failed', 'GIF nehat şandin', 'messages'),
('german', 'toast.gif.send_failed', 'GIF konnte nicht gesendet werden', 'messages'),

('english', 'toast.voice.sent', 'Voice message sent!', 'messages'),
('norwegian', 'toast.voice.sent', 'Talemelding sendt!', 'messages'),
('kurdish_sorani', 'toast.voice.sent', 'نامەی دەنگی نێردرا!', 'messages'),
('kurdish_kurmanci', 'toast.voice.sent', 'Peyama dengî hat şandin!', 'messages'),
('german', 'toast.voice.sent', 'Sprachnachricht gesendet!', 'messages'),

('english', 'toast.voice.send_failed', 'Failed to send voice message', 'messages'),
('norwegian', 'toast.voice.send_failed', 'Kunne ikke sende talemelding', 'messages'),
('kurdish_sorani', 'toast.voice.send_failed', 'نەتوانرا نامەی دەنگی بنێردرێت', 'messages'),
('kurdish_kurmanci', 'toast.voice.send_failed', 'Peyama dengî nehat şandin', 'messages'),
('german', 'toast.voice.send_failed', 'Sprachnachricht konnte nicht gesendet werden', 'messages'),

('english', 'toast.image.compressing', 'Compressing image...', 'messages'),
('norwegian', 'toast.image.compressing', 'Komprimerer bilde...', 'messages'),
('kurdish_sorani', 'toast.image.compressing', 'وێنە چاپ دەکرێت...', 'messages'),
('kurdish_kurmanci', 'toast.image.compressing', 'Wêne tê kompres kirin...', 'messages'),
('german', 'toast.image.compressing', 'Bild wird komprimiert...', 'messages'),

('english', 'toast.image.sent', 'Image sent!', 'messages'),
('norwegian', 'toast.image.sent', 'Bilde sendt!', 'messages'),
('kurdish_sorani', 'toast.image.sent', 'وێنە نێردرا!', 'messages'),
('kurdish_kurmanci', 'toast.image.sent', 'Wêne hat şandin!', 'messages'),
('german', 'toast.image.sent', 'Bild gesendet!', 'messages'),

('english', 'toast.image.send_failed', 'Failed to send image', 'messages'),
('norwegian', 'toast.image.send_failed', 'Kunne ikke sende bilde', 'messages'),
('kurdish_sorani', 'toast.image.send_failed', 'نەتوانرا وێنە بنێردرێت', 'messages'),
('kurdish_kurmanci', 'toast.image.send_failed', 'Wêne nehat şandin', 'messages'),
('german', 'toast.image.send_failed', 'Bild konnte nicht gesendet werden', 'messages'),

('english', 'toast.user.blocked', 'User blocked successfully', 'messages'),
('norwegian', 'toast.user.blocked', 'Bruker blokkert', 'messages'),
('kurdish_sorani', 'toast.user.blocked', 'بەکارهێنەر بە سەرکەوتوویی بلۆک کرا', 'messages'),
('kurdish_kurmanci', 'toast.user.blocked', 'Bikarhêner bi serkeftî hat astengkirin', 'messages'),
('german', 'toast.user.blocked', 'Benutzer erfolgreich blockiert', 'messages'),

('english', 'toast.user.block_failed', 'Failed to block user', 'messages'),
('norwegian', 'toast.user.block_failed', 'Kunne ikke blokkere bruker', 'messages'),
('kurdish_sorani', 'toast.user.block_failed', 'نەتوانرا بەکارهێنەر بلۆک بکرێت', 'messages'),
('kurdish_kurmanci', 'toast.user.block_failed', 'Bikarhêner nehat astengkirin', 'messages'),
('german', 'toast.user.block_failed', 'Benutzer konnte nicht blockiert werden', 'messages'),

('english', 'toast.match.not_found', 'Could not find match', 'messages'),
('norwegian', 'toast.match.not_found', 'Kunne ikke finne match', 'messages'),
('kurdish_sorani', 'toast.match.not_found', 'نەتوانرا ماتچ بدۆزرێتەوە', 'messages'),
('kurdish_kurmanci', 'toast.match.not_found', 'Match nehat dîtin', 'messages'),
('german', 'toast.match.not_found', 'Match konnte nicht gefunden werden', 'messages'),

('english', 'toast.match.find_failed', 'Failed to find match', 'messages'),
('norwegian', 'toast.match.find_failed', 'Kunne ikke finne match', 'messages'),
('kurdish_sorani', 'toast.match.find_failed', 'نەتوانرا ماتچ بدۆزرێتەوە', 'messages'),
('kurdish_kurmanci', 'toast.match.find_failed', 'Match nehat dîtin', 'messages'),
('german', 'toast.match.find_failed', 'Match konnte nicht gefunden werden', 'messages'),

('english', 'toast.translate.rate_limit', 'Rate limit reached.', 'messages'),
('norwegian', 'toast.translate.rate_limit', 'Grense nådd.', 'messages'),
('kurdish_sorani', 'toast.translate.rate_limit', 'سنووری داواکاری تێپەڕاوە.', 'messages'),
('kurdish_kurmanci', 'toast.translate.rate_limit', 'Sînorê daxwaziyê hat derbaskirin.', 'messages'),
('german', 'toast.translate.rate_limit', 'Ratenlimit erreicht.', 'messages'),

('english', 'toast.translate.unavailable', 'Service unavailable.', 'messages'),
('norwegian', 'toast.translate.unavailable', 'Tjeneste utilgjengelig.', 'messages'),
('kurdish_sorani', 'toast.translate.unavailable', 'خزمەتگوزاری بەردەست نییە.', 'messages'),
('kurdish_kurmanci', 'toast.translate.unavailable', 'Xizmet ne berdest e.', 'messages'),
('german', 'toast.translate.unavailable', 'Dienst nicht verfügbar.', 'messages'),

('english', 'toast.translate.complete', 'Translation complete', 'messages'),
('norwegian', 'toast.translate.complete', 'Oversettelse ferdig', 'messages'),
('kurdish_sorani', 'toast.translate.complete', 'وەرگێڕان تەواو بوو', 'messages'),
('kurdish_kurmanci', 'toast.translate.complete', 'Werger qediya', 'messages'),
('german', 'toast.translate.complete', 'Übersetzung abgeschlossen', 'messages'),

('english', 'toast.translate.failed', 'Unable to translate message.', 'messages'),
('norwegian', 'toast.translate.failed', 'Kunne ikke oversette melding.', 'messages'),
('kurdish_sorani', 'toast.translate.failed', 'نەتوانرا نامە وەربگێردرێت.', 'messages'),
('kurdish_kurmanci', 'toast.translate.failed', 'Peyam nehat wergerandin.', 'messages'),
('german', 'toast.translate.failed', 'Nachricht konnte nicht übersetzt werden.', 'messages'),

-- Messages page
('english', 'toast.messages.load_failed', 'Failed to load messages', 'messages'),
('norwegian', 'toast.messages.load_failed', 'Kunne ikke laste meldinger', 'messages'),
('kurdish_sorani', 'toast.messages.load_failed', 'نەتوانرا نامەکان بار بکرێن', 'messages'),
('kurdish_kurmanci', 'toast.messages.load_failed', 'Peyam nehat barkirin', 'messages'),
('german', 'toast.messages.load_failed', 'Nachrichten konnten nicht geladen werden', 'messages'),

-- HashtagFeed
('english', 'toast.auth.login_required', 'Please log in to like posts', 'auth'),
('norwegian', 'toast.auth.login_required', 'Vennligst logg inn for å like innlegg', 'auth'),
('kurdish_sorani', 'toast.auth.login_required', 'تکایە بچۆ ژوورەوە بۆ لایک کردنی بابەت', 'auth'),
('kurdish_kurmanci', 'toast.auth.login_required', 'Ji kerema xwe têkeve da ku postan bihez bikî', 'auth'),
('german', 'toast.auth.login_required', 'Bitte melde dich an, um Beiträge zu liken', 'auth'),

('english', 'toast.like.update_failed', 'Failed to update like', 'common'),
('norwegian', 'toast.like.update_failed', 'Kunne ikke oppdatere like', 'common'),
('kurdish_sorani', 'toast.like.update_failed', 'نەتوانرا لایک نوێ بکرێتەوە', 'common'),
('kurdish_kurmanci', 'toast.like.update_failed', 'Like nehat nûkirin', 'common'),
('german', 'toast.like.update_failed', 'Like konnte nicht aktualisiert werden', 'common'),

-- AdminReports
('english', 'toast.report.resolved', 'Report resolved', 'admin'),
('norwegian', 'toast.report.resolved', 'Rapport løst', 'admin'),
('kurdish_sorani', 'toast.report.resolved', 'ڕاپۆرت چارەسەر کرا', 'admin'),
('kurdish_kurmanci', 'toast.report.resolved', 'Rapor hat çareser kirin', 'admin'),
('german', 'toast.report.resolved', 'Bericht gelöst', 'admin'),

('english', 'toast.report.resolve_failed', 'Failed to resolve report', 'admin'),
('norwegian', 'toast.report.resolve_failed', 'Kunne ikke løse rapport', 'admin'),
('kurdish_sorani', 'toast.report.resolve_failed', 'نەتوانرا ڕاپۆرت چارەسەر بکرێت', 'admin'),
('kurdish_kurmanci', 'toast.report.resolve_failed', 'Rapor nehat çareser kirin', 'admin'),
('german', 'toast.report.resolve_failed', 'Bericht konnte nicht gelöst werden', 'admin'),

('english', 'toast.report.dismissed', 'Report dismissed', 'admin'),
('norwegian', 'toast.report.dismissed', 'Rapport avvist', 'admin'),
('kurdish_sorani', 'toast.report.dismissed', 'ڕاپۆرت ڕەت کرایەوە', 'admin'),
('kurdish_kurmanci', 'toast.report.dismissed', 'Rapor hat red kirin', 'admin'),
('german', 'toast.report.dismissed', 'Bericht abgewiesen', 'admin'),

('english', 'toast.report.dismiss_failed', 'Failed to dismiss report', 'admin'),
('norwegian', 'toast.report.dismiss_failed', 'Kunne ikke avvise rapport', 'admin'),
('kurdish_sorani', 'toast.report.dismiss_failed', 'نەتوانرا ڕاپۆرت ڕەت بکرێتەوە', 'admin'),
('kurdish_kurmanci', 'toast.report.dismiss_failed', 'Rapor nehat red kirin', 'admin'),
('german', 'toast.report.dismiss_failed', 'Bericht konnte nicht abgewiesen werden', 'admin'),

-- PushNotificationPreferences (already has Norwegian UI, but toasts need keys)
('english', 'toast.settings.updated', 'Settings updated', 'settings'),
('norwegian', 'toast.settings.updated', 'Innstillinger oppdatert', 'settings'),
('kurdish_sorani', 'toast.settings.updated', 'ڕێکخستنەکان نوێ کران', 'settings'),
('kurdish_kurmanci', 'toast.settings.updated', 'Mîheng hat nûkirin', 'settings'),
('german', 'toast.settings.updated', 'Einstellungen aktualisiert', 'settings'),

('english', 'toast.settings.save_failed', 'Could not save settings', 'settings'),
('norwegian', 'toast.settings.save_failed', 'Kunne ikke lagre innstillinger', 'settings'),
('kurdish_sorani', 'toast.settings.save_failed', 'نەتوانرا ڕێکخستنەکان پاشەکەوت بکرێن', 'settings'),
('kurdish_kurmanci', 'toast.settings.save_failed', 'Mîheng nehat tomarkirin', 'settings'),
('german', 'toast.settings.save_failed', 'Einstellungen konnten nicht gespeichert werden', 'settings')

ON CONFLICT (language_code, translation_key) DO NOTHING;
