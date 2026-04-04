# KurdMatch — Fullstendig Brukerdata-dokumentasjon

> Sist oppdatert: 2026-04-04
> Målgruppe: Utviklere, sikkerhetsansvarlige, GDPR-compliance

---

## INNHOLDSFORTEGNELSE

1. [Dataoversikt — Hva samles inn](#1-dataoversikt)
2. [Registreringsprosessen — Steg for steg](#2-registreringsprosessen)
3. [Systemgenerert data](#3-systemgenerert-data)
4. [Data synlig for andre brukere](#4-data-synlig-for-andre)
5. [Intern systemdata](#5-intern-systemdata)
6. [Data sendt til tredjeparter](#6-tredjepart)
7. [Autentisering og sikkerhet](#7-sikkerhet)
8. [Komplett databasefelt-referanse](#8-database-referanse)
9. [Forbedringsforslag](#9-forbedringer)

---

## 1. DATAOVERSIKT

### 1.1 Kategorisering av all brukerdata

| Kategori | Eksempler | Sensitiv? | Lagring |
|----------|-----------|-----------|---------|
| **Autentisering** | E-post, passord-hash, JWT | 🔴 Ja | `auth.users` (Supabase) |
| **Personlig identitet** | Navn, alder, kjønn | 🟡 Moderat | `profiles` |
| **Kulturell identitet** | Kurdistan-region, etnisitet, religion | 🟡 Moderat | `profiles` |
| **Fysisk beskrivelse** | Høyde, kroppstype | 🟡 Moderat | `profiles` |
| **Kontaktinfo** | Telefonnummer | 🔴 Ja | `profiles` (PII-beskyttet) |
| **Lokasjon** | GPS (lat/lng), by | 🔴 Ja | `profiles` (PII-beskyttet) |
| **Livsstil** | Røyking, alkohol, kosthold, trening | 🟢 Lav | `profiles` + `profile_details` |
| **Relasjonsønsker** | Mål, barn, ekteskapsintensjon | 🟢 Lav | `profiles` + `marriage_intentions` |
| **Interesser & verdier** | Arrays av strenger | 🟢 Lav | `profiles` |
| **Bilder** | Profilbilder, story-media | 🟡 Moderat | Supabase Storage (`photos` bucket) |
| **Kommunikasjon** | Meldinger, stemmeopptak, GIF | 🔴 Ja | `messages` |
| **Sosial aktivitet** | Innlegg, kommentarer, likes | 🟢 Lav | `posts`, `post_comments`, `post_likes` |
| **Bruksdata** | Swipes, visninger, online-status | 🟡 Moderat | Diverse tabeller |
| **Betalingsdata** | Stripe-kunde-ID, abonnement | 🔴 Ja | `payments`, `user_subscriptions` |
| **Enhetsdata** | Push-abonnement, user-agent | 🟡 Moderat | `push_subscriptions` |

---

## 2. REGISTRERINGSPROSESSEN

### 2.0 Forutsetninger
- Registreringsskjemaet er **databasedrevet**: spørsmål hentes fra `registration_questions`-tabellen
- Admin kan aktivere/deaktivere og omorganisere spørsmål via Super Admin → Registration Questions
- Spørsmål oversettes automatisk basert på brukerens valgte språk

### 2.1 Steg 1: Konto (Account)

**Hva brukeren ser:**
- Google/Facebook OAuth-knapper (SocialLogin-komponent)
- Eller e-post/passord-skjema med divider "or continue with email"

**Felter som samles inn:**

| Felt | Type | Obligatorisk | Validering | Feilmelding |
|------|------|-------------|------------|-------------|
| `email` | Email input | ✅ Ja | Gyldig e-postformat, live duplikatsjekk via `useEmailValidation` | "Email already taken" (inline, rød tekst med XCircle-ikon) |
| `password` | Password input | ✅ Ja | Min 8 tegn, må inneholde store/små bokstaver og tall | "Must be 8+ characters with uppercase, lowercase, and number" |
| `confirmPassword` | Password input | ✅ Ja | Må matche `password` | "Passwords don't match" |

**Live validering:**
- E-post: Debounced sjekk (300ms) mot Supabase Auth → viser spinner (gult), ✓ tilgjengelig (grønt), ✗ allerede i bruk (rødt med "Sign in?"-lenke)
- Passord: Validert ved onChange via Zod-schema
- Steg-fullførelse: Alle tre felt må være fylt + passord ≥8 tegn + passordene matcher

**UI-feedback:**
- EnhancedStepIndicator øverst viser 7 steg med farge (grønn=ferdig, blå=aktiv, grå=ugjort)
- "Next"-knapp er disabled til steget er komplett

---

### 2.2 Steg 2: Grunnleggende info (Basic Info)

**Felter:**

| Felt | Profil-felt | Type | Obligatorisk | Validering |
|------|------------|------|-------------|------------|
| Fullt navn | `name` | Tekstinput | ✅ Ja | Sanitisert via `sanitizeText()`, maks 100 tegn |
| Alder | `age` | Tallinngang | ✅ Ja | Min 18, maks 120 | 
| Kjønn | `gender` | Select | ✅ Ja | Valg fra forhåndsdefinerte opsjoner |

**Validering:**
- Alder < 18 → steg markeres som ufullstendig, kan ikke gå videre
- Alle felt valideres ved `onChange` (react-hook-form `mode: 'onChange'`)

---

### 2.3 Steg 3: Kulturell identitet (Cultural Identity)

**Felter:**

| Felt | Profil-felt | Type | Obligatorisk | Validering |
|------|------------|------|-------------|------------|
| Lokasjon | `location` | Tekstinput + geo-deteksjon | ✅ Ja | Auto-deteksjon via `useLocationManager` |
| Kurdistan-region | `kurdistan_region` | Select | ✅ Ja | En av: South/West/East/North-Kurdistan |
| Høyde | `height` | Select | ✅ Ja | Forhåndsdefinerte valg |
| Kroppstype | `body_type` | Select | ✅ Ja | Forhåndsdefinerte valg |
| Etnisitet | `ethnicity` | Select | ✅ Ja | Forhåndsdefinerte valg |
| Religion | `religion` | Select | ✅ Ja | Forhåndsdefinerte valg |
| Politiske synspunkter | `political_views` | Select | ❌ Nei | Samles inn men **vises aldri** på profilen |
| Personlighetstype | `personality_type` | Select | ❌ Nei | Valgfritt |
| Drømmeferie | `dream_vacation` | Tekst | ❌ Nei | Valgfritt |

**Viktig:** Lokasjon bruker nettleserens Geolocation API for auto-deteksjon. GPS-koordinater (`latitude`, `longitude`) lagres i `profiles`-tabellen men er **PII-beskyttet** — andre brukere kan ikke lese dem direkte (kolonnene er revoked fra `authenticated`-rollen).

---

### 2.4 Steg 4: Interesser & verdier (Interests & Values)

**Felter:**

| Felt | Profil-felt | Type | Obligatorisk | Min. valg |
|------|------------|------|-------------|-----------|
| Interesser | `interests` | Multi-select (badges) | ✅ Ja | 3 |
| Hobbyer | `hobbies` | Multi-select (badges) | ✅ Ja | 2 |
| Verdier | `values` | Multi-select (badges) | ✅ Ja | 3 |

**UI:** Inline badge-velger der brukeren klikker for å velge/avvelge. Opsjonene kommer fra `registration_questions.options`-feltet i databasen. Verdiene lagres som `TEXT[]`-arrayer direkte — ingen mapping-lag, UI-labels = databaseverdier.

---

### 2.5 Steg 5: Livsstil (Lifestyle & Habits)

**Felter:**

| Felt | Profil-felt | Type | Obligatorisk |
|------|------------|------|-------------|
| Kosthold | `dietary_preferences` | Select | ❌ Nei |
| Røyking | `smoking` | Select | ❌ Nei |
| Alkohol | `drinking` | Select | ❌ Nei |
| Søvnmønster | `sleep_schedule` | Select | ❌ Nei |
| Kjæledyr | `have_pets` | Select | ❌ Nei |
| Familienærhet | `family_closeness` | Select | ❌ Nei |
| Kjærlighetsspråk | `love_language` | Select | ❌ Nei |
| Kommunikasjonsstil | `communication_style` | Select | ❌ Nei |
| Ideell date | `ideal_date` | Tekst | ❌ Nei |
| Relasjonsmål | `relationship_goals` | Select | ✅ Ja |
| Ønsker barn | `want_children` | Select | ✅ Ja |
| Treningsvaner | `exercise_habits` | Select | ✅ Ja |

---

### 2.6 Steg 6: Karriere & utdanning (Career & Education)

**Felter:**

| Felt | Profil-felt | Type | Obligatorisk | Min. valg |
|------|------------|------|-------------|-----------|
| Yrke | `occupation` | Select | ✅ Ja | — |
| Utdanning | `education` | Select | ✅ Ja | — |
| Språk | `languages` | Multi-select | ✅ Ja | 1 |

**Språk-UI:** Kategorisert i "Kurdish Dialects" og "General/European" med "See more"-toggle for den generelle listen (viser bare 3 først).

---

### 2.7 Steg 7: Bilder (Photos)

**Felter:**

| Felt | Type | Obligatorisk | Validering |
|------|------|-------------|------------|
| `photos` | Bildeopplasting | ✅ Ja (min 1) | Komprimert via `browser-image-compression` |

**Prosess:**
1. Bruker velger bilder fra enhet
2. Bilder komprimeres client-side
3. Konverteres til data-URL for forhåndsvisning
4. Ved innsending: lastes opp til Supabase Storage bucket `photos`
5. Offentlig URL lagres i `photos`-tabellen
6. Første bilde markeres som `is_primary = true`

---

### 2.8 Bio-generering (automatisk)

Bio-feltet er **ikke** et manuelt input-felt i registreringen. I stedet:
1. `generateAIBio()` kalles med brukerens profildata
2. Genererer en bio basert på interesser, verdier, yrke, etc.
3. Bio sanitiseres via `sanitizeHtml()` og lagres i `profiles.bio`

---

### 2.9 Innsending — Backend-prosess

```
Bruker klikker "Submit" 
  ↓
1. Frontend validerer alle 7 steg (completionStatus)
   → Hvis ufullstendig: toast "Incomplete Registration", navigerer til første ufullstendige steg
  ↓
2. form.handleSubmit() trigges → Zod-skjema validerer hele formen
   → Feil: toast med feilfelter listet
  ↓
3. supabase.auth.signUp(email, password)
   → Feil: toast med feilmelding (f.eks. "User already registered")
   → Supabase oppretter rad i auth.users
   → DB-trigger handle_new_user() oppretter minimal profil automatisk
  ↓
4. generateAIBio(data) → genererer bio fra brukerdata
  ↓
5. mapFormDataToProfile(data, userId, questions)
   → Sanitiserer all input via sanitizeText/sanitizeHtml
   → Mapper form-felt til profiles-kolonner basert på registration_questions.profileField
   → Setter fallback: name="User", age=18 hvis mangler
  ↓
6. supabase.from('profiles').upsert(profileData, { onConflict: 'id' })
   → Overskriver den minimale profilen fra trigger
   → Feil: toast "Profile setup failed", redirect til /complete-profile
  ↓
7. handlePhotoUploads(photos, userId)
   → For hvert bilde: upload til Storage → hent publicUrl → insert i photos-tabell
   → Feil: toast "Some photos couldn't be uploaded", fortsetter likevel
  ↓
8. sessionStorage.removeItem('oauth_registration_flow')
   → Rydder OAuth-flagg
  ↓
9. Toast "Registration Successful!"
   → 1 sekund delay (auth state sync)
   → navigate('/', { replace: true })
```

### 2.10 Edge cases

| Scenario | Hva skjer |
|----------|-----------|
| E-post allerede i bruk | `useEmailValidation` viser inline "Email already taken" med "Sign in?"-lenke. Forhindrer innsending. |
| Nettverksbrudd under innsending | `catch`-blokk fanger feilen → toast "An unexpected error occurred" |
| Nettverksbrudd under bildeopplasting | Bilder feiler silently → toast "Some photos couldn't be uploaded" → profil opprettes uten bilder |
| Bruker avbryter midt i prosessen | Ingen data lagres — alt er kun i React state til innsending |
| OAuth-bruker (Google/Facebook) | `sessionStorage.oauth_registration_flow=true` → steg 1 viser "Your social account has been connected" i stedet for e-post/passord-feltene |
| Ugyldig passord | Zod-validering markerer feltet rødt, "Next"-knapp forblir disabled |
| Alder under 18 | Steg markeres som ufullstendig, kan ikke gå videre |
| DB-trigger lager profil først | `upsert` med `onConflict: 'id'` overskriver den minimale trigger-profilen |

### 2.11 UX-detaljer

- **Progresjonsindikator:** 7-stegs indikator med ikoner (Mail, User, MapPin, Heart, Coffee, Briefcase, Camera) og fargestatus
- **Loading state:** `LoadingSpinner` ved lasting av spørsmål fra DB
- **Scroll-oppførsel:** `window.scrollTo({ top: 0, behavior: 'instant' })` ved stegbytte
- **Form-modus:** `mode: 'onChange'` → kontinuerlig validering
- **Toast-varsler:** via `useToast` (Sonner) — destructive variant for feil, standard for suksess
- **Autofocus:** E-post-feltet har `autoFocus` på steg 1
- **Autocompletions:** `autoComplete="email"` og `autoComplete="new-password"`

---

## 3. SYSTEMGENERERT DATA

### 3.1 Data opprettet automatisk per bruker

| Data | Tabell | Trigger/Kilde | Beskrivelse |
|------|--------|---------------|-------------|
| Bruker-ID | `auth.users.id` | Supabase Auth | UUID, opprettes ved signUp |
| Profil-rad | `profiles` | `handle_new_user()` trigger | Minimal profil (id, created_at) |
| E-postbekreftelse | `auth.users.email_confirmed_at` | Supabase Auth | Tidsstempel for verifisert e-post |
| Sist aktiv | `profiles.last_active` | Applikasjon / `useOnlinePresence` | Oppdateres ved brukeraktivitet |
| Opprettet-tidsstempel | `profiles.created_at` | DB default `now()` | Når profilen ble opprettet |
| Coins-saldo | `user_coins` | Trigger ved brukeropprettelse | Startbalanse: 100 coins |
| Abonnement | `user_subscriptions` | Via RPC `initialize_user_subscription` | Default: 'free' |
| Innstillinger | `user_settings` | Opprettes ved første besøk | Varsel-/personvernpreferanser |

### 3.2 Data generert av brukerhandlinger

| Handling | Generert data | Tabell |
|----------|--------------|--------|
| Swipe høyre | Like-record | `likes` (liker_id, likee_id, created_at) |
| Swipe venstre | Swipe-historikk | `swipe_history` |
| Gjensidig like | Match-record | `matches` (user1_id, user2_id, matched_at) |
| Send melding | Meldingsrecord | `messages` (sender_id, recipient_id, text, media_type, media_url) |
| Besøk profil | Visningsrecord | `profile_views` (viewer_id, profile_id) |
| Opprett innlegg | Post-record | `posts` (user_id, content, image_url) |
| Like innlegg | Like-record | `post_likes` (user_id, post_id) |
| Kommenter | Kommentar-record | `post_comments` (user_id, post_id, content) |
| Opprett story | Story-record | `stories` (user_id, media_url, expires_at) |
| Se story | View-record | `story_views` (story_id, viewer_id) |
| Blokker bruker | Blokkering | `blocked_users` (blocker_id, blocked_id) |
| Rapporter bruker | Rapport | `reports` (reporter_id, reported_id, reason) |
| Send gave | Gave-record | `sent_gifts` (sender_id, recipient_id, gift_id) |
| Kjøp abonnement | Betalingsrecord | `payments` + `user_subscriptions` |
| Start anrop | Anropsrecord | `calls` (caller_id, callee_id, status, duration) |
| Typing | Typing-status | `typing_status` (user_id, recipient_id) — ephemeral |
| Date-forslag | Forslag | `date_proposals` (proposer_id, recipient_id, activity) |
| Ekteskapsintensjon | Intensjon | `marriage_intentions` (user_id, intention, timeline) |
| Følg bruker | Følger-record | `followers` (follower_id, following_id) |
| Lagre innlegg | Lagret innlegg | `saved_posts` (user_id, post_id) |
| Join gruppe | Medlemskap | `group_members` (user_id, group_id, role) |
| Meld deg på event | Deltakelse | `event_attendees` (user_id, event_id) |

### 3.3 Analytikk og bruksdata

| Data | Tabell | Beskrivelse | Hvem ser det |
|------|--------|-------------|-------------|
| Daglig bruk | `daily_usage` | likes_count, super_likes_count, boosts_count per dag | Kun admin |
| Engasjement | `user_engagement` | Aggregert brukerengasjement | Kun admin |
| Profilvisninger | `profile_views` | Hvem som så hvem og når | Bruker (antall), admin (detaljer) |
| Dashboard-stats | `dashboard_stats` | Aggregerte plattform-tall | Kun admin |
| Systemmetrikker | `system_metrics` | Serverytelse, latens | Kun admin |

---

## 4. DATA SYNLIG FOR ANDRE BRUKERE

### 4.1 Offentlig profilinformasjon

Følgende felter er synlige for andre autentiserte brukere (med mindre skjult via `profile_visibility_settings`):

| Felt | Kilde | Alltid synlig? |
|------|-------|----------------|
| Navn | `profiles.name` | ✅ Ja |
| Alder | `profiles.age` | Kan skjules via `privacy_show_age` |
| Profilbilde | `profiles.profile_image` + `photos` | ✅ Ja |
| Bio | `profiles.bio` | ✅ Ja |
| Lokasjon (by) | `profiles.location` | ✅ Ja (kun by, ikke GPS) |
| Kurdistan-region | `profiles.kurdistan_region` | ✅ Ja |
| Yrke | `profiles.occupation` | ✅ Ja |
| Utdanning | `profiles.education` | ✅ Ja |
| Høyde | `profiles.height` | ✅ Ja |
| Kroppstype | `profiles.body_type` | ✅ Ja |
| Etnisitet | `profiles.ethnicity` | ✅ Ja |
| Religion | `profiles.religion` | ✅ Ja |
| Interesser | `profiles.interests` | ✅ Ja |
| Hobbyer | `profiles.hobbies` | ✅ Ja |
| Verdier | `profiles.values` | ✅ Ja |
| Språk | `profiles.languages` | ✅ Ja |
| Relasjonsmål | `profiles.relationship_goals` | ✅ Ja |
| Ønsker barn | `profiles.want_children` | ✅ Ja |
| Verifisert-badge | `profiles.verified` | ✅ Ja |
| Treningsvaner | `profiles.exercise_habits` | ✅ Ja |
| Sist aktiv | `profiles.last_active` | Kan skjules via `privacy_show_last_active` |
| Online-status | Beregnet fra `last_active` | Kan skjules via `privacy_show_online_status` |
| Avstand | Beregnet fra GPS | Kan skjules via `privacy_show_distance` |

### 4.2 Data som ALDRI vises til andre brukere

| Felt | Grunn |
|------|-------|
| `profiles.political_views` | Bevisst designvalg — samles inn men skjules |
| `profiles.latitude` / `longitude` | PII-beskyttet (kolonne-revoke) |
| `profiles.phone_number` | PII-beskyttet (kolonne-revoke) |
| `profiles.is_generated` | Intern flagg for ghost-brukere |
| `profiles.dating_profile_visible` | Intern synlighetskontroll |
| E-post | Lagret i `auth.users`, ikke eksponert |
| Passord-hash | Lagret i `auth.users`, aldri eksponert |

### 4.3 Sosial aktivitet synlig for andre

| Aktivitet | Synlig for |
|-----------|-----------|
| Innlegg i feed | Alle autentiserte brukere |
| Kommentarer | Alle autentiserte brukere |
| Stories (24t) | Alle følgere / matchede brukere |
| Gruppeinnlegg | Gruppemedlemmer |
| Event-deltakelse | Alle som ser eventet |
| Gave sendt | Mottaker + sender |

---

## 5. INTERN SYSTEMDATA

### 5.1 Data brukt for matching-logikk

| Data | Brukt til | Kilde |
|------|-----------|-------|
| Interesser (overlap) | Kompatibilitetsberegning | `calculate-compatibility` edge function |
| Verdier (overlap) | Kompatibilitetsberegning | `calculate-compatibility` edge function |
| Kurdistan-region | Regionfiltrering | Discovery-filtre |
| Alder | Aldersfiltrering | Discovery-filtre |
| GPS-koordinater | Avstandsberegning | `geo_location` (PostGIS) |
| Religion | Kompatibilitet | Discovery-filtre |
| Swipe-historikk | Unngå å vise allerede swipede | `swipe_history`, `likes` |
| Blokkeringsliste | Filtrere ut blokkerte | `blocked_users` (via RLS NOT EXISTS) |
| Profilsynlighet | Vises i discovery? | `profiles.dating_profile_visible` |
| Abonnementstype | Tilgangsbegrensninger | `user_subscriptions` |

### 5.2 AI-behandlet data

| Funksjon | Input fra bruker | Hva AI ser | Lagring |
|----------|-----------------|-----------|---------|
| Bio-generering | Interesser, verdier, yrke | Profil-metadata | Generert bio → `profiles.bio` |
| Kompatibilitet | To profiler | Begge profilers offentlige data | Score → `compatibility_scores` (cache) |
| Icebreakers | To profiler | Begge profilers interesser/bio | Returnert i API-svar, ikke lagret |
| Samtaleinnsikt | Meldingshistorikk | Meldinger mellom to brukere | `ai_conversation_insights` |
| AI Wingman | Brukerens spørsmål | Kontekst + profildata | Returnert i API-svar, ikke lagret |
| Meldingsmoderering | Enkeltmelding | Meldingsinnhold | Flagg → `message_safety_flags` |
| Bildemoderasjon | Bilde-URL | Bildet | Godkjent/avvist status |

### 5.3 Skjult metadata (aldri vist til bruker)

| Data | Tabell | Formål |
|------|--------|--------|
| `is_generated` | `profiles` | Markerer ghost/fake profiler opprettet av admin |
| Rate limit counters | `message_rate_limits` | Forhindrer spam |
| Safety flags | `message_safety_flags` | AI-genererte moderasjonsflagg |
| Admin audit log | `admin_audit_log` | Logger alle admin-handlinger |
| Scheduled content | `scheduled_content` | Innhold planlagt for publisering |
| A/B test variants | `ab_tests` | Eksperiment-konfigurasjon |

---

## 6. DATA SENDT TIL TREDJEPARTER

### 6.1 Stripe (betalingsprosessor)

| Data sendt | Når | Formål | Lagring hos Stripe |
|-----------|-----|--------|-------------------|
| E-post | Checkout-opprettelse | Kundeidentifikasjon | Stripe Customer |
| Stripe Customer ID | Ved kjøp | Koble betaling til bruker | Ja, permanent |
| Abonnementsplan | Ved checkout | Pris-ID for valgt plan | Ja |

**Merk:** Kortnummer/betalingsdata tastes inn direkte i Stripes hosted checkout — KurdMatch ser aldri rå kortdata.

### 6.2 OpenAI (AI-tjenester)

| Data sendt | Funksjon | Formål |
|-----------|----------|--------|
| Profildata (interesser, verdier, yrke, bio) | `generate-bio`, `calculate-compatibility` | AI-generering |
| Meldingsinnhold | `moderate-message` | Innholdsmoderering |
| Bilde-URL | `moderate-photo` | Bildemoderasjon |
| Samtalehistorikk | `generate-insights` | Samtaleinnsikt |
| Brukerspørsmål | `ai-wingman` | Datingrådgivning |

**ANTAGELSE:** OpenAI data retention policy gjelder — API-kall via `/v1/chat/completions` lagres ikke permanent hos OpenAI med "zero data retention" for API-bruk.

### 6.3 Twilio (SMS)

| Data sendt | Når | Formål |
|-----------|-----|--------|
| Telefonnummer | SMS-verifisering | Sende OTP-kode |
| Verifiseringskode | Kodegenerering | Autentisering |

### 6.4 Tenor (GIF-søk)

| Data sendt | Når | Formål |
|-----------|-----|--------|
| Søkeord | GIF-søk i chat | Hente relevante GIF-er |

**Merk:** Ingen bruker-identifikator sendes til Tenor.

### 6.5 Google STUN

| Data sendt | Når | Formål |
|-----------|-----|--------|
| IP-adresse | WebRTC-oppsett | NAT-traversal for videoanrop |

**Merk:** Google STUN-servere er offentlige og logger ikke brukerdata.

### 6.6 Data som IKKE sendes til tredjeparter
- Passord (hashes aldri sendt)
- GPS-koordinater (kun brukt internt)
- Meldingsinnhold (unntatt for AI-moderering)
- Profilbilder (kun URL til OpenAI ved moderering)

---

## 7. AUTENTISERING OG SIKKERHET

### 7.1 Passord-håndtering

| Aspekt | Implementasjon |
|--------|---------------|
| **Hashing** | Supabase Auth bruker `bcrypt` for passord-hashing |
| **Lagring** | Hash lagres i `auth.users` (aldri i `profiles`) |
| **Passordkrav** | Min 8 tegn, store/små bokstaver, tall (Zod-validering) |
| **Passordbytte** | Krever verifisering av nåværende passord via `signInWithPassword` først |
| **Reset** | Via `resetPasswordForEmail` → bruker mottar e-post → `/reset-password`-side |

### 7.2 Tokens og sessions

| Token | Type | Levetid | Lagring |
|-------|------|---------|---------|
| Access token | JWT | 1 time (default) | `localStorage` via Supabase SDK |
| Refresh token | Opaque | 60 dager (default) | `localStorage` via Supabase SDK |
| SMS OTP | 6-sifret kode | 10 minutter | `phone_verifications`-tabell |

**Session-verifisering:** Alle API-kall bruker `supabase.auth.getUser()` (server-side validering) — ALDRI `getSession()` (kan være cached/spoofed).

### 7.3 Tilgangsnivåer / roller

| Rolle | Sjekkes via | Tilgang |
|-------|------------|---------|
| `anon` | Ingen auth | Landingsside, login, registrering |
| `authenticated` | JWT i header | Alle bruker-ruter |
| `super_admin` | `user_roles`-tabell + `is_super_admin()` RPC | Admin-panelet (48 sider) |

**Rollesjekk:**
```sql
-- SECURITY DEFINER funksjon
CREATE FUNCTION is_super_admin(_user_id uuid) RETURNS boolean AS $$
  SELECT EXISTS (SELECT 1 FROM user_roles WHERE user_id = _user_id AND role = 'super_admin')
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

### 7.4 Row Level Security (RLS)

Alle 81 tabeller har RLS aktivert. Nøkkelpolicyer:

| Tabell | Policy | Regel |
|--------|--------|-------|
| `profiles` | SELECT | Alle autentiserte, MINUS blokkerte brukere |
| `profiles` | UPDATE | Kun eier (`auth.uid() = id`) |
| `profiles` | UPDATE-trigger | `prevent_self_verification` hindrer endring av `verified`-flagg |
| `messages` | SELECT/INSERT | Kun sender eller mottaker |
| `likes` | SELECT | Kun involverte brukere |
| `user_roles` | ALL | Kun `is_super_admin(auth.uid())` |
| `user_subscriptions` | INSERT/UPDATE | Via SECURITY DEFINER RPC |
| `user_coins` | UPDATE | Via SECURITY DEFINER RPC (`spend_user_coins`) |

### 7.5 PII-beskyttelse

Sensitive kolonner har **kolonne-level revoke** på `profiles`:
```sql
REVOKE SELECT (phone_number, latitude, longitude) ON profiles FROM authenticated;
REVOKE SELECT (phone_number, latitude, longitude) ON profiles FROM anon;
```

Brukere henter egne PII-data via:
```sql
CREATE FUNCTION get_own_profile_pii(user_id uuid) RETURNS ... SECURITY DEFINER;
```

### 7.6 Input-sanitering

| Mekanisme | Implementasjon |
|-----------|---------------|
| Tekst | `sanitizeText()` — fjerner HTML-tags, trimmer |
| HTML (bio) | `sanitizeHtml()` via `isomorphic-dompurify` |
| Søk | Regex: striper `% _ \ ' " ( )` |
| Meldinger | Maks 5000 tegn, non-empty validering |
| E-post | Zod `.email()` validering |

### 7.7 Beskyttelse mot spam/bots

| Mekanisme | Status |
|-----------|--------|
| CAPTCHA | ❌ **Ikke implementert** (ANTAGELSE: bør legges til) |
| Rate limiting (meldinger) | ✅ Via `message_rate_limits`-tabell |
| Rate limiting (registrering) | ⚠️ Supabase Auth har innebygd rate limiting |
| E-post duplikatsjekk | ✅ Live validering + Supabase Auth unique constraint |
| Console suppression | ✅ Produksjon: `console.log/info/debug/warn` disabled |

### 7.8 Kontostatus og sletting

| Handling | Prosess | Reversibel? |
|----------|---------|-------------|
| Deaktivering | `account_status.status = 'deactivated'` | ✅ Ja (bruker kan reaktivere) |
| Sletteforespørsel | `account_status.status = 'deletion_requested'`, 30-dagers frist | ✅ Innen 30 dager |
| Permanent sletting | Admin-handling via `admin-delete-user` edge function | ❌ Nei |

---

## 8. KOMPLETT DATABASEFELT-REFERANSE

### 8.1 `profiles` (kjerne-brukertabell)

| Kolonne | Type | Default | Obligatorisk | Sensitiv | Synlig for andre |
|---------|------|---------|-------------|----------|-----------------|
| id | UUID (PK) | — | ✅ | Nei | Nei (intern) |
| name | VARCHAR | — | ✅ | Nei | ✅ |
| age | INTEGER | — | ✅ | Nei | Konfigurerbar |
| gender | TEXT | — | ❌ | Nei | ✅ |
| location | VARCHAR | — | ✅ | Nei | ✅ (kun by) |
| occupation | VARCHAR | 'Not specified' | ✅ | Nei | ✅ |
| bio | TEXT | 'Tell us...' | ✅ | Nei | ✅ |
| profile_image | VARCHAR | placeholder | ✅ | Nei | ✅ |
| height | VARCHAR | '5\'6"' | ✅ | Nei | ✅ |
| body_type | VARCHAR | 'Average' | ✅ | Nei | ✅ |
| ethnicity | VARCHAR | 'Prefer not to say' | ✅ | Nei | ✅ |
| religion | VARCHAR | 'Prefer not to say' | ✅ | Nei | ✅ |
| political_views | VARCHAR | — | ❌ | 🟡 | ❌ ALDRI |
| kurdistan_region | VARCHAR | 'South-Kurdistan' | ✅ | Nei | ✅ |
| education | VARCHAR | 'Not specified' | ✅ | Nei | ✅ |
| company | VARCHAR | — | ❌ | Nei | ✅ |
| relationship_goals | VARCHAR | 'Looking for...' | ✅ | Nei | ✅ |
| want_children | VARCHAR | 'Open to children' | ✅ | Nei | ✅ |
| have_pets | VARCHAR | — | ❌ | Nei | ✅ |
| exercise_habits | VARCHAR | 'Sometimes' | ✅ | Nei | ✅ |
| zodiac_sign | VARCHAR | — | ❌ | Nei | ✅ |
| personality_type | VARCHAR | — | ❌ | Nei | ✅ |
| sleep_schedule | VARCHAR | — | ❌ | Nei | ✅ |
| travel_frequency | VARCHAR | — | ❌ | Nei | ✅ |
| communication_style | VARCHAR | — | ❌ | Nei | ✅ |
| love_language | VARCHAR | — | ❌ | Nei | ✅ |
| values | TEXT[] | '{}' | ✅ (min 3) | Nei | ✅ |
| interests | TEXT[] | '{}' | ✅ (min 3) | Nei | ✅ |
| hobbies | TEXT[] | '{}' | ✅ (min 2) | Nei | ✅ |
| languages | TEXT[] | '{}' | ✅ (min 1) | Nei | ✅ |
| pet_peeves | TEXT[] | — | ❌ | Nei | ✅ |
| weekend_activities | TEXT[] | — | ❌ | Nei | ✅ |
| creative_pursuits | TEXT[] | — | ❌ | Nei | ✅ |
| dream_vacation | VARCHAR | — | ❌ | Nei | ✅ |
| financial_habits | VARCHAR | — | ❌ | Nei | ✅ |
| ideal_date | VARCHAR | — | ❌ | Nei | ✅ |
| children_status | VARCHAR | — | ❌ | Nei | ✅ |
| family_closeness | VARCHAR | — | ❌ | Nei | ✅ |
| friendship_style | VARCHAR | — | ❌ | Nei | ✅ |
| work_life_balance | VARCHAR | — | ❌ | Nei | ✅ |
| career_ambitions | VARCHAR | — | ❌ | Nei | ✅ |
| dietary_preferences | VARCHAR | — | ❌ | Nei | ✅ |
| favorite_quote | VARCHAR | — | ❌ | Nei | ✅ |
| morning_routine | VARCHAR | — | ❌ | Nei | ✅ |
| evening_routine | VARCHAR | — | ❌ | Nei | ✅ |
| favorite_season | VARCHAR | — | ❌ | Nei | ✅ |
| ideal_weather | VARCHAR | — | ❌ | Nei | ✅ |
| dream_home | VARCHAR | — | ❌ | Nei | ✅ |
| transportation_preference | VARCHAR | — | ❌ | Nei | ✅ |
| smoking | VARCHAR | — | ❌ | Nei | ✅ |
| drinking | VARCHAR | — | ❌ | Nei | ✅ |
| verified | BOOLEAN | false | — | Nei | ✅ (badge) |
| phone_verified | BOOLEAN | false | — | Nei | ✅ (badge) |
| video_verified | BOOLEAN | false | — | Nei | ✅ (badge) |
| dating_profile_visible | BOOLEAN | true | — | Nei | ❌ |
| is_generated | BOOLEAN | false | — | Nei | ❌ |
| latitude | DOUBLE | — | ❌ | 🔴 JA | ❌ (PII-revoked) |
| longitude | DOUBLE | — | ❌ | 🔴 JA | ❌ (PII-revoked) |
| geo_location | GEOGRAPHY | — | ❌ | 🔴 JA | ❌ |
| phone_number | TEXT | — | ❌ | 🔴 JA | ❌ (PII-revoked) |
| last_active | TIMESTAMPTZ | now() | — | Nei | Konfigurerbar |
| created_at | TIMESTAMPTZ | now() | — | Nei | ❌ |

### 8.2 `profile_details` (utvidet profildata)

Speilet/utvidet versjon av livsstilsdata. 40 kolonner inkl. `height`, `body_type`, `smoking`, `drinking`, `dietary_preferences`, `zodiac_sign`, `personality_type`, `sleep_schedule`, `travel_frequency`, `communication_style`, `love_language`, `have_pets`, `work_environment`, `family_closeness`, `ideal_date`, `career_ambitions`, `work_life_balance`, `dream_vacation`, `financial_habits`, `children_status`, `friendship_style`, `favorite_quote`, `morning_routine`, `evening_routine`, `favorite_season`, `ideal_weather`, `dream_home`, `transportation_preference`, `charity_involvement`, `favorite_memory`, `decision_making_style`.

### 8.3 `profile_preferences` (matching-preferanser)

| Kolonne | Type | Beskrivelse |
|---------|------|-------------|
| relationship_goals | VARCHAR | Foretrukket relasjonsmål |
| want_children | VARCHAR | Barnønske-preferanse |
| kurdistan_region | VARCHAR | Foretrukket region |
| exercise_habits | VARCHAR | Foretrukket treningsnivå |

### 8.4 `user_settings` (notifikasjoner + personvern)

**Notifikasjoner (alle BOOLEAN, default true/false):**
`notifications_matches`, `notifications_messages`, `notifications_likes`, `notifications_profile_views`, `notifications_marketing`, `notifications_push`, `notifications_email`, `notifications_sms`, `notifications_comments`, `notifications_follows`, `notifications_mentions`, `notifications_groups`, `notifications_events`

**Personvern (alle BOOLEAN, default true):**
`privacy_show_age`, `privacy_show_distance`, `privacy_show_online`, `privacy_discoverable`, `privacy_read_receipts`, `privacy_show_online_status`, `privacy_show_last_active`, `privacy_show_profile_views`

**Personvern (SELECT-felt):**
`privacy_profile_visibility` (default 'everyone'), `privacy_message_privacy` (default 'everyone'), `privacy_location_sharing` (default 'approximate')

### 8.5 `user_coins`

| Kolonne | Default | Beskrivelse |
|---------|---------|-------------|
| balance | 100 | Nåværende saldo |
| total_earned | 100 | Totalt opptjent |
| total_spent | 0 | Totalt brukt |

### 8.6 `user_subscriptions`

| Kolonne | Default | Beskrivelse |
|---------|---------|-------------|
| subscription_type | 'free' | free / basic / premium / gold |
| expires_at | NULL | Utløpstidspunkt |

---

## 9. FORBEDRINGSFORSLAG

### 9.1 Registrering

| Forbedring | Prioritet | Begrunnelse |
|-----------|-----------|-------------|
| Legg til CAPTCHA (hCaptcha/Turnstile) | 🔴 Høy | Forhindrer bot-registreringer |
| Passordstyrke-indikator (visuell) | 🟡 Middels | Bedre UX enn bare Zod-feilmelding |
| Progressiv profilkomplettering | 🟡 Middels | Tillat registrering med færre felt, fullfør senere |
| A/B-test antall steg (3 vs 7) | 🟢 Lav | Mulig konverteringsøkning med færre steg |
| Debounce på alle felt | 🟢 Lav | Reduser unødvendig re-rendering |
| Fjern debug console.log | 🔴 Høy | 12+ console.log i registreringsflyten lekker data i prod |

### 9.2 Datasikkerhet

| Forbedring | Prioritet | Begrunnelse |
|-----------|-----------|-------------|
| End-to-end kryptering for meldinger | 🔴 Høy | Meldinger er plaintext i DB |
| TURN-servere for video | 🔴 Høy | 30-40% av anrop feiler uten |
| Automatisk kontosletting (cron) | 🟡 Middels | 30-dagers sletting skjer aldri automatisk |
| Data retention policy | 🟡 Middels | Definer hvor lenge data lagres |
| Audit log for brukerhandlinger | 🟢 Lav | Kun admin-handlinger logges nå |

### 9.3 GDPR-compliance

| Krav | Status | Merknad |
|------|--------|---------|
| Rett til innsyn | ✅ Implementert | `downloadUserData()` eksporterer all data |
| Rett til sletting | ⚠️ Delvis | Forespørsel mulig, men automatisk sletting mangler cron |
| Rett til dataportabilitet | ✅ Implementert | JSON-eksport via settings |
| Samtykke til datadeling | ⚠️ Delvis | ToS/Privacy lenker finnes, men ikke eksplisitt samtykke-checkbox |
| Cookie-samtykke | ⚠️ Ukjent | Avhenger av deploy-konfigurasjon |
| Data Processing Agreement | ❌ Mangler | Trenger DPA med Supabase, Stripe, OpenAI, Twilio |
