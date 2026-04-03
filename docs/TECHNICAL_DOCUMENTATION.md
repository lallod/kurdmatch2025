# KurdMatch - Fullstendig Teknisk Dokumentasjon

**App Name:** KurdMatch - Kurdish Dating & Social Platform  
**Stack:** React 18 + TypeScript 5 + Vite 5 + Tailwind CSS 3 + Supabase  
**Last Updated:** 2026-04-03

---

## 1. OVERSIKT

### 1.1 Hva appen gjør
KurdMatch er en dating- og sosial nettverksplattform designet spesifikt for det kurdiske diaspora-samfunnet. Appen kombinerer klassisk dating-funksjonalitet (swipe, matching, chat) med sosiale funksjoner (feed, stories, grupper, events) og kulturelle tilpasninger (Kurdistan-regioner, flerspråklig støtte med kurdisk Sorani/Kurmanci, RTL-støtte).

### 1.2 Hvem den er for
- Kurdere i diaspora (primært Norge, Tyskland, Europa)
- Aldersgruppe: 18+
- Brukere som søker romantiske relasjoner, vennskap, eller kulturelt fellesskap

### 1.3 Hovedfunksjoner
1. **Swipe/Matching** - Tinder-lignende swipe-grensesnitt med like/dislike/super-like
2. **Sosial Feed** - Instagram-lignende innlegg med bilder, likes, kommentarer, hashtags
3. **Stories** - 24-timers midlertidige bilder/videoer
4. **Meldinger** - Sanntids chat med typing-indikatorer, lesebekreftelser, GIF-søk, stemmeopptak
5. **Video/Taleanrop** - WebRTC-baserte anrop mellom matchede brukere
6. **Grupper** - Fellesskap med medlemskap, innlegg, admin-moderering
7. **Events** - Opprettelse og deltakelse på arrangementer
8. **AI-funksjoner** - Bio-generering, kompatibilitetsberegning, icebreakers, samtaleinnsikt, AI Wingman
9. **Gaver & Coins** - Virtuell valuta-system med gavesending
10. **Abonnement** - 4-tier subscription (Free/Basic/Premium/Gold) via Stripe
11. **Verifisering** - Video-verifisering, telefonverifisering, profilverifisering
12. **Super Admin Panel** - 48-siders administrasjonspanel

---

## 2. ARKITEKTUR

### 2.1 Systemarkitektur

```text
┌──────────────────────────────────────────┐
│            KLIENT (Browser/PWA)          │
│  React 18 + Vite 5 + TypeScript 5       │
│  Tailwind CSS 3 + shadcn/ui + Radix UI  │
│  Framer Motion (animasjoner)             │
└──────────────┬───────────────────────────┘
               │ HTTPS / WSS
               ▼
┌──────────────────────────────────────────┐
│           SUPABASE BACKEND               │
│  ┌─────────────────────────────────────┐ │
│  │ Auth (email, Google, Facebook)      │ │
│  │ PostgreSQL 15 (85 tabeller)         │ │
│  │ Realtime (WebSocket subscriptions)  │ │
│  │ Storage (avatarer, bilder, videoer) │ │
│  │ Edge Functions (28 Deno-funksjoner) │ │
│  │ Row Level Security (RLS)            │ │
│  └─────────────────────────────────────┘ │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│         TREDJEPARTSTJENESTER             │
│  Stripe (betalinger/abonnement)          │
│  OpenAI (AI bio, icebreakers, wingman)   │
│  Twilio (SMS-verifisering)               │
│  Google STUN (WebRTC)                    │
│  Tenor/GIPHY (GIF-søk)                   │
└──────────────────────────────────────────┘
```

### 2.2 Hvordan komponentene henger sammen
- **Frontend** kommuniserer med Supabase via `@supabase/supabase-js` SDK
- **Auth** håndteres av Supabase Auth med JWT-tokens lagret i localStorage
- **Realtime** bruker Supabase Channels for live-oppdateringer på meldinger, innlegg, notifikasjoner
- **Edge Functions** kjører serverside-logikk for Stripe, AI, SMS, moderering
- **RLS** (Row Level Security) beskytter all data på databasenivå
- **WebRTC** bruker peer-to-peer med Supabase Realtime som signalering

### 2.3 Tredjepartstjenester
| Tjeneste | Bruk | Hemmelighet |
|----------|------|-------------|
| Stripe | Betalinger, abonnement | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| OpenAI | AI-generert bio, icebreakers, innsikt, moderering | `OPENAI_API_KEY` |
| Twilio | SMS-verifisering | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` |
| Google STUN | WebRTC NAT-traversal | Ingen (offentlig) |
| Tenor/GIPHY | GIF-søk i chat | `TENOR_API_KEY` |

---

## 3. TEKNOLOGISTACK

| Kategori | Teknologi | Versjon |
|----------|-----------|---------|
| Frontend-rammeverk | React | 18.3.1 |
| Byggverktøy | Vite | 5.4.1 |
| Språk | TypeScript | 5.5.3 |
| CSS | Tailwind CSS | 3.4.11 |
| UI-komponenter | shadcn/ui + Radix UI | Diverse |
| Animasjoner | Framer Motion | 12.23.24 |
| Routing | React Router DOM | 6.26.2 |
| State/Data | TanStack React Query | 5.56.2 |
| Skjema | React Hook Form + Zod | 7.53.0 / 3.23.8 |
| Grafer | Recharts | 2.12.7 |
| Kart | Leaflet + React Leaflet | 1.9.4 / 4.2.1 |
| Drag & Drop | react-beautiful-dnd | 13.1.1 |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions) | 2.56.1 |
| Betalinger | Stripe | 18.5.0 (Deno) |
| Toast | Sonner | 1.5.0 |
| Ikoner | Lucide React | 0.462.0 |
| HTML-sanitering | isomorphic-dompurify | 2.28.0 |
| Bildekomprimering | browser-image-compression | 2.0.2 |

---

## 4. FILSTRUKTUR

```text
/
├── index.html                    # HTML entrypoint med PWA manifest, SEO meta
├── package.json                  # Avhengigheter og scripts
├── vite.config.ts                # Vite-konfigurasjon
├── tailwind.config.ts            # Tailwind-konfigurasjon
├── public/
│   ├── manifest.json             # PWA-manifest
│   ├── service-worker.js         # Push notification worker
│   ├── icons/                    # PWA app-ikoner (192x192, 512x512)
│   └── favicon.ico
├── supabase/
│   ├── config.toml               # Supabase-prosjektkonfigurasjon
│   ├── migrations/               # SQL-migrasjonsfiler (kronologisk)
│   └── functions/                # 28 Edge Functions (Deno)
│       ├── _shared/validation.ts # Delt inputvalidering
│       ├── admin-actions/        # Admin CRUD via service role
│       ├── admin-delete-user/    # Sletting av brukere
│       ├── ai-wingman/           # AI-assistent for dating-råd
│       ├── calculate-compatibility/ # AI-kompatibilitetsberegning
│       ├── calculate-match-score/   # Matchscore-algoritme
│       ├── check-subscription/   # Sjekk abonnementsstatus
│       ├── collect-system-metrics/ # Systemhelse-metrikker
│       ├── create-checkout/      # Stripe Checkout-sesjon
│       ├── create-super-admin/   # Opprett superadmin-rolle
│       ├── customer-portal/      # Stripe kundeportal
│       ├── extract-texts/        # Tekstuttrekk for oversettelse
│       ├── generate-bio/         # AI bio-generering
│       ├── generate-icebreakers/ # AI åpningsreplikker
│       ├── generate-insights/    # AI samtaleinnsikt
│       ├── manage-api-keys/      # API-nøkkelhåndtering
│       ├── moderate-message/     # AI meldingsmoderering
│       ├── moderate-photo/       # AI bildemoderasjon
│       ├── search-gifs/          # GIF-søk (Tenor)
│       ├── send-push-notification/ # Push-varsler
│       ├── send-sms-verification/  # SMS OTP via Twilio
│       ├── setup-admin/          # Admin-oppsett
│       ├── stripe-webhook/       # Stripe webhook-mottaker
│       ├── submit-verification/  # Video-verifisering
│       ├── sync-all-translations/ # Oversettelsessynkronisering
│       ├── sync-translations/    # Enkelt-språk oversettelse
│       ├── translate-message/    # AI meldingsoversettelse
│       └── verify-phone-code/    # SMS OTP-verifisering
└── src/
    ├── main.tsx                  # React entrypoint + console-suppression
    ├── App.tsx                   # Root: Providers → Router → AppRoutes
    ├── index.css                 # Midnight Rose design system variabler
    ├── api/                      # Supabase datalag (24 filer)
    │   ├── profiles.ts           # Profilhenting, oppdatering, søk
    │   ├── messages.ts           # Samtaler, sendmeldinger, lesmerking
    │   ├── matches.ts            # Match-henting med paginering
    │   ├── likes.ts              # Like/dislike/superlike + match-opprettelse
    │   ├── swipes.ts             # Swipe-historikk
    │   ├── posts.ts              # CRUD for innlegg + stories
    │   ├── comments.ts           # Kommentarer på innlegg
    │   ├── reactions.ts          # Reaksjoner (likes, hjerte, etc.)
    │   ├── events.ts             # Events CRUD, join/leave
    │   ├── groups.ts             # Grupper CRUD, medlemskap
    │   ├── gifts.ts              # Virtuelle gaver, coins
    │   ├── payments.ts           # Stripe checkout/portal
    │   ├── notifications.ts      # Notifikasjoner CRUD
    │   ├── hashtags.ts           # Hashtag-sporing
    │   ├── reports.ts            # Rapportering av brukere/innhold
    │   ├── moderation.ts         # Modereringsverktøy
    │   ├── ai.ts                 # AI-funksjonsanrop
    │   ├── accountActions.ts     # Kontodeaktivering, sletting, passordbytte
    │   ├── admin.ts              # Admin-spesifikke operasjoner
    │   ├── adminDatabase.ts      # Admin database-queries
    │   ├── dashboard.ts          # Dashboard-statistikk
    │   ├── usage.ts              # Bruksstatistikk
    │   ├── realDataService.ts    # Real data helpers
    │   └── constants.ts          # API-konstanter
    ├── components/               # React-komponenter (32 mapper)
    │   ├── app/                  # App-shell: Layout, Routes, Guards, Transitions
    │   │   ├── AppRoutes.tsx     # Hovedruting
    │   │   ├── AppLayout.tsx     # Layout med BottomNav
    │   │   ├── ProtectedRoute.tsx # Auth-guard
    │   │   ├── SuperAdminGuard.tsx # Admin rollesjekk
    │   │   └── routes/           # Rute-definisjoner (5 filer)
    │   ├── auth/                 # Login-skjema, OAuth, Callback
    │   ├── ui/                   # shadcn/ui basiskomponenter
    │   ├── swipe/                # Swipe-kort, animasjoner
    │   ├── messages/             # ChatView, ConversationList
    │   ├── chat/                 # Meldingsbobler, input, typing
    │   ├── calls/                # VideoCall, IncomingCall
    │   ├── profile/              # Profilvisning, redigering
    │   ├── my-profile/           # Min profil-sider
    │   ├── discovery/            # Utforsk-feed, nærme brukere
    │   ├── stories/              # Story-visning, opprettelse
    │   ├── groups/               # Gruppelistning, detaljer
    │   ├── events/               # Event-kort, detaljer
    │   ├── gifts/                # Gave-UI, coins
    │   ├── dates/                # Date-forslag
    │   ├── compatibility/        # Kompatibilitetsvisning
    │   ├── subscription/         # Abonnementsplaner
    │   ├── verification/         # Video-verifisering
    │   ├── notifications/        # Varselvisning
    │   ├── settings/             # Innstillingsskjermer
    │   ├── landing/              # Landingsside-seksjoner
    │   ├── admin/                # Admin-komponenter
    │   ├── boost/                # Profil-boost
    │   ├── instagram/            # Instagram-stil profil
    │   ├── location/             # Stedsvalg
    │   ├── modals/               # Modale vinduer
    │   ├── onboarding/           # Onboarding-flyt
    │   ├── security/             # Sikkerhetskomponenter
    │   ├── shared/               # Delte komponenter
    │   ├── support/              # Support/hjelp
    │   ├── language-selector/    # Språkvelger
    │   ├── DetailEditor/         # Profildetalj-redigering
    │   ├── BottomNavigation.tsx  # Hovednavigasjon (bunnmeny)
    │   ├── EmptyState.tsx        # Tom tilstand-komponent
    │   ├── ErrorBoundary.tsx     # Feilhåndtering
    │   ├── LoadingState.tsx      # Lastespinner
    │   └── MatchPopup.tsx        # Match-animasjon
    ├── contexts/                 # React Contexts
    │   ├── LanguageContext.tsx   # Språk (5 språk, RTL-støtte)
    │   └── SubscriptionContext.tsx # Abonnementsstatus
    ├── hooks/                    # Custom React Hooks (44 filer)
    │   ├── useWebRTC.ts         # Video/taleanrop
    │   ├── useTranslations.ts   # i18n oversettelser
    │   ├── useSubscription.ts   # Abonnement-logikk
    │   ├── useDiscoveryProfiles.ts # Profilforslag
    │   ├── useNotifications.ts  # Varseltelling
    │   ├── useOnlinePresence.ts # Online-status
    │   ├── useStories.ts       # Story-håndtering
    │   ├── useCompatibility.ts  # Kompatibilitet
    │   └── useVoiceRecorder.ts  # Stemmeopptak
    ├── pages/                    # Sidekomponenter (50+ sider)
    │   ├── SuperAdmin/          # Admin-panel (48 undersider)
    │   └── ...
    ├── types/                    # TypeScript-typer
    │   ├── profile.ts           # ProfileData (75+ felt)
    │   ├── subscription.ts      # Abonnementsplaner og tiers
    │   ├── account.ts           # Konto-handlinger
    │   ├── swipe.ts             # Swipe-typer
    │   ├── location.ts          # Stedsinformasjon
    │   └── translations.ts      # Oversettelsetyper
    ├── utils/                    # Hjelpefunksjoner
    │   ├── logger.ts            # Produksjonslogger
    │   ├── rtl.ts               # RTL-deteksjon
    │   ├── valueMapping.ts      # Verdioversettelser
    │   ├── ghostUserGenerator.ts # Ghost-brukere (admin)
    │   ├── validation/          # Inputvalidering
    │   ├── security/            # Sikkerhetsverktøy
    │   ├── auth/                # Auth-hjelpere
    │   └── admin/               # Admin-hjelpere
    ├── config/
    │   └── swipe.ts             # Swipe-konfigurasjon
    ├── data/
    │   ├── languages.ts         # Språkliste
    │   └── occupations.ts       # Yrkes-liste
    └── integrations/
        └── supabase/
            ├── client.ts        # Supabase-klient
            ├── auth.tsx         # AuthProvider + hooks
            └── types.ts         # Auto-genererte DB-typer (5725 linjer)
```

---

## 5. FUNKSJONALITET - DETALJERT

### 5.1 Autentisering & Registrering
- **Login**: Email/passord via `supabase.auth.signInWithPassword()`
- **Registrering**: Flertrinns wizard (`EnhancedDynamicRegistrationForm`) med:
  - Steg 1: Email, passord, navn, alder, kjønn
  - Steg 2: Kurdistan-region, lokasjon, yrke
  - Steg 3: Bio, interesser, verdier, hobbyer
  - Steg 4: Fysiske attributter, livsstil
  - Steg 5: Profilbilde-opplasting
- **OAuth**: Google og Facebook via `supabase.auth.signInWithOAuth()`
- **Passord-reset**: Via `supabase.auth.resetPasswordForEmail()`
- **Passordbytte**: Krever verifisering av nåværende passord først
- **Session**: JWT i localStorage, auto-refresh via Supabase SDK

### 5.2 Swipe & Matching
- **Swipe-kort**: Fullskjerm profil-kort med bilde, navn, alder, bio
- **Handlinger**: Like (høyre), Dislike (venstre), Super Like (opp)
- **Matching**: Når to brukere liker hverandre → match opprettes i `matches`-tabell
- **Match-popup**: Animert popup ved ny match med "Send melding"-knapp
- **Discovery-filtre**: Alder, avstand, region, religion, utdanning

### 5.3 Meldinger
- **Samtaler**: Hentet fra `messages`-tabell, gruppert per brukerpar
- **Sanntid**: Supabase Realtime channels for nye meldinger
- **Typing-indikator**: Via `typing_indicators`-tabell med realtime
- **Lesebekreftelser**: `read_at`-tidsstempel oppdateres når meldinger vises
- **Stemmeopptak**: `useVoiceRecorder` hook med MediaRecorder API
- **GIF-søk**: Via `search-gifs` edge function (Tenor API)
- **AI Meldingsoversettelse**: `translate-message` edge function
- **AI Moderering**: `moderate-message` edge function sjekker innhold

### 5.4 Video/Taleanrop
- **WebRTC**: Peer-to-peer via `useWebRTC` hook
- **Signalering**: Supabase Realtime brukt som signalkanal
- **ICE-servere**: Google STUN (mangler TURN for produksjon)
- **UI**: Fullskjerm VideoCallScreen med mute/kamera-toggle
- **Innkommende anrop**: IncomingCallSheet (bottom sheet)

### 5.5 Sosial Feed
- **Innlegg**: Tekst + bilde med hashtags, likes, kommentarer
- **Realtime**: Live oppdateringer via Supabase channels
- **Hashtags**: Spores i `post_hashtags`-tabell, trendende hashtags
- **Lagrede innlegg**: Brukere kan lagre innlegg (`saved_posts`)
- **Rapportering**: Brukere kan rapportere innhold (`reports`)

### 5.6 Stories
- **Opprettelse**: Bilde/video med tekst-overlay
- **Visning**: Fullskjerm slideshow per bruker
- **24-timers TTL**: Stories ekspirerer automatisk
- **Story-visninger**: Spores for analytikk

### 5.7 Grupper
- **Opprettelse**: Navn, beskrivelse, kategori, bilde
- **Medlemskap**: Join/leave med `group_members`-tabell
- **Innlegg**: Gruppeinnlegg synlig kun for medlemmer
- **Admin**: Gruppeeier kan moderere

### 5.8 Events
- **Opprettelse**: Tittel, beskrivelse, dato, sted, maks deltakere
- **Deltakelse**: Join/leave med kapasitetssjekk
- **Listing**: Filtrering etter dato, kategori

### 5.9 AI-funksjoner
| Funksjon | Edge Function | Beskrivelse |
|----------|--------------|-------------|
| Bio-generering | `generate-bio` | AI skriver profilbio basert på brukerdata |
| Kompatibilitet | `calculate-compatibility` | Scorer kompatibilitet mellom to profiler |
| Icebreakers | `generate-icebreakers` | Foreslår åpningsreplikker |
| Samtaleinnsikt | `generate-insights` | Analyserer samtalemønstre |
| AI Wingman | `ai-wingman` | Datingrådgiver-chatbot |
| Moderering | `moderate-message`, `moderate-photo` | Innholdsfiltrering |

### 5.10 Gaver & Coins
- **Coins**: Virtuell valuta lagret i `user_coins`
- **Gaver**: Virtuelle gaver fra `virtual_gifts`-katalog
- **Sending**: Bruker sender gave → coins trekkes → mottaker får notifikasjon
- **Date-forslag**: Invitasjoner lagret i `date_proposals`

### 5.11 Abonnement (Stripe)
| Tier | Pris (NOK) | Stripe Price ID |
|------|-----------|-----------------|
| Free | 0 | - |
| Basic | 199/mnd | `price_1RK4pqDY8qZ9eNdMPGHK0Rw5` |
| Premium | 299/mnd | `price_1RK4rLDY8qZ9eNdMZiI5XTrO` |
| Gold | 499/mnd | `price_1RK4sIDY8qZ9eNdMvrimk1w5` |

**Flyt**: Bruker velger plan → `create-checkout` → Stripe Checkout → `stripe-webhook` oppdaterer `user_subscriptions`.

### 5.12 Verifisering
- **Video**: Bruker tar opp video → `submit-verification` → admin godkjenner
- **Telefon**: SMS OTP via `send-sms-verification` → `verify-phone-code`
- **Status**: `profiles.verified`, `profiles.phone_verified`, `profiles.video_verified`

---

## 6. RUTER (ALLE)

### 6.1 Offentlige ruter
| Rute | Side | Beskrivelse |
|------|------|-------------|
| `/` | LandingV2 | Landingsside (redirect til /discovery hvis innlogget) |
| `/auth` | Auth | Innlogging |
| `/register` | Register | Registrering |
| `/auth/callback` | AuthCallback | OAuth callback |
| `/admin-login` | SuperAdminLogin | Admin innlogging |
| `/reset-password` | ResetPassword | Passord-reset |
| `/help` | HelpSupport | Hjelp og support |
| `/community-guidelines` | CommunityGuidelines | Retningslinjer |
| `/privacy-policy` | PrivacyPolicy | Personvern |
| `/terms` | TermsOfService | Vilkår |
| `/about` | AboutUs | Om oss |
| `/contact` | ContactUs | Kontakt oss |
| `/cookie-policy` | CookiePolicy | Cookie-policy |

### 6.2 Beskyttede ruter (krever innlogging)
| Rute | Side | Beskrivelse |
|------|------|-------------|
| `/discovery` | DiscoveryFeed | Hovedfeed |
| `/swipe` | Swipe | Swipe-kort |
| `/discover` | DiscoverHub | Hub: likes, views, matches |
| `/messages` | Messages | Samtaler + chat |
| `/my-profile` | MyProfile | Min profil |
| `/profile/:id` | InstagramProfile | Andres profil |
| `/matches` | Matches | Mine matcher |
| `/liked-me` | LikedMe | Hvem liker meg |
| `/viewed-me` | ViewedMe | Hvem har sett meg |
| `/search` | AdvancedSearch | Avansert søk |
| `/saved` | SavedPosts | Lagrede innlegg |
| `/events` | Events | Event-liste |
| `/create-event` | CreateEvent | Opprett event |
| `/event/:id` | EventDetail | Event-detalj |
| `/create-post` | CreatePost | Opprett innlegg |
| `/post/:id` | PostDetail | Innlegg-detalj |
| `/hashtag/:hashtag` | HashtagFeed | Hashtag-feed |
| `/groups` | Groups | Gruppe-liste |
| `/groups/create` | CreateGroup | Opprett gruppe |
| `/groups/:id` | GroupDetail | Gruppe-detalj |
| `/stories/create` | CreateStory | Opprett story |
| `/stories/:userId` | StoriesView | Se stories |
| `/gifts` | GiftsAndDates | Gaver og dates |
| `/subscription` | Subscription | Abonnementsplaner |
| `/verification` | Verification | Verifisering |
| `/compatibility/:userId` | CompatibilityInsights | Kompatibilitetsvisning |
| `/notifications` | Notifications | Varsler |
| `/complete-profile` | CompleteProfile | Fullfør profil |
| `/settings` | Settings | Innstillinger |
| `/settings/privacy` | PrivacySettings | Personverninnstillinger |
| `/settings/blocked` | BlockedUsers | Blokkerte brukere |
| `/settings/phone-verification` | PhoneVerification | Telefonverifisering |
| `/settings/relationship` | RelationshipSettings | Relasjonsinnstillinger |
| `/notifications/settings` | NotificationSettings | Varselinnstillinger |

### 6.3 Admin-ruter (krever super_admin rolle)
| Rute | Side |
|------|------|
| `/super-admin` | Dashboard |
| `/super-admin/users` | Brukerhåndtering |
| `/super-admin/stories` | Stories-moderering |
| `/super-admin/calls` | Anropslogg |
| `/super-admin/messages` | Meldingsovervåking |
| `/super-admin/conversations` | Samtaler |
| `/super-admin/matches` | Matcher |
| `/super-admin/likes` | Likes |
| `/super-admin/photos` | Bildemoderasjon |
| `/super-admin/events` | Events |
| `/super-admin/groups` | Grupper |
| `/super-admin/moderation` | Moderering |
| `/super-admin/safety-flags` | Sikkerhetsflagg |
| `/super-admin/verification` | Verifisering |
| `/super-admin/ghost-users` | Ghost-brukere |
| `/super-admin/analytics` | Analytikk |
| `/super-admin/daily-usage` | Daglig bruk |
| `/super-admin/profile-views` | Profilvisninger |
| `/super-admin/subscribers` | Abonnenter |
| `/super-admin/payments` | Betalinger |
| `/super-admin/virtual-gifts` | Virtuelle gaver |
| `/super-admin/date-proposals` | Date-forslag |
| `/super-admin/marriage-intentions` | Ekteskapsønsker |
| `/super-admin/notifications` | Varsler |
| `/super-admin/email-campaigns` | E-postkampanjer |
| `/super-admin/support-tickets` | Support |
| `/super-admin/ab-testing` | A/B-testing |
| `/super-admin/categories` | Kategorier |
| `/super-admin/interests` | Interesser |
| `/super-admin/hashtags` | Hashtags |
| `/super-admin/comments` | Kommentarer |
| `/super-admin/followers` | Følgere |
| `/super-admin/blocked-users` | Blokkerte |
| `/super-admin/rate-limits` | Hastighetsbegrensninger |
| `/super-admin/scheduled-content` | Planlagt innhold |
| `/super-admin/translations` | Oversettelser |
| `/super-admin/registration-questions` | Registreringsspørsmål |
| `/super-admin/landing-page` | Landingsside-editor |
| `/super-admin/social-login` | Sosial innlogging |
| `/super-admin/api-keys` | API-nøkler |
| `/super-admin/exports` | Eksporter |
| `/super-admin/bulk-actions` | Massehandlinger |
| `/super-admin/roles` | Roller |
| `/super-admin/ai-insights` | AI-innsikt |
| `/super-admin/system-health` | Systemhelse |
| `/super-admin/audit-logs` | Revisjonslogger |
| `/super-admin/settings` | Innstillinger |

---

## 7. DATABASE

### 7.1 Tabelloversikt (85 tabeller)
Gruppert etter domene:

**Kjerne-bruker (8)**
`profiles`, `profile_details`, `profile_preferences`, `profile_visibility_settings`, `account_status`, `user_roles`, `connected_social_accounts`, `chaperone_settings`

**Matching & Dating (8)**
`likes`, `matches`, `swipes`, `date_proposals`, `marriage_intentions`, `compatibility_scores`, `compatibility_cache`, `match_feedback`

**Meldinger & Kommunikasjon (7)**
`messages`, `conversation_metadata`, `muted_conversations`, `typing_indicators`, `calls`, `ai_conversation_insights`, `message_rate_limits`

**Sosialt (12)**
`posts`, `post_comments`, `comment_likes`, `post_likes`, `post_reactions`, `post_hashtags`, `hashtags`, `post_media`, `stories`, `story_views`, `saved_posts`, `user_followers`

**Grupper & Events (4)**
`groups`, `group_members`, `events`, `event_attendees`

**Gaver & Coins (4)**
`virtual_gifts`, `sent_gifts`, `user_coins`, `coin_transactions`

**Abonnement & Betalinger (2)**
`user_subscriptions`, `subscription_history`

**Verifisering (3)**
`video_verifications`, `phone_verifications`, `verification_badges`

**Notifikasjoner (3)**
`notifications`, `notification_preferences`, `push_subscriptions`

**Rapportering & Moderering (4)**
`reports`, `safety_flags`, `blocked_users`, `scheduled_content`

**Analytikk (5)**
`profile_views`, `daily_usage`, `user_engagement`, `usage_tracking`, `ab_tests`

**Admin (7)**
`admin_activities`, `admin_audit_log`, `admin_reports`, `email_campaigns`, `support_tickets`, `app_settings`, `api_keys`

**Innhold (4)**
`content_categories`, `category_items`, `landing_page_content`, `app_translations`

**System (2)**
`social_login_providers`, `system_metrics`

### 7.2 Profiltabellen (kjerneskjema)
```sql
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name VARCHAR NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT,
  location VARCHAR NOT NULL,
  occupation VARCHAR NOT NULL DEFAULT 'Not specified',
  bio TEXT NOT NULL DEFAULT 'Tell us about yourself...',
  profile_image VARCHAR NOT NULL DEFAULT 'https://placehold.co/400',
  height VARCHAR NOT NULL DEFAULT '5''6"',
  body_type VARCHAR NOT NULL DEFAULT 'Average',
  ethnicity VARCHAR NOT NULL DEFAULT 'Prefer not to say',
  religion VARCHAR NOT NULL DEFAULT 'Prefer not to say',
  kurdistan_region VARCHAR NOT NULL DEFAULT 'South-Kurdistan',
  education VARCHAR NOT NULL DEFAULT 'Not specified',
  relationship_goals VARCHAR NOT NULL DEFAULT 'Looking for something serious',
  want_children VARCHAR NOT NULL DEFAULT 'Open to children',
  exercise_habits VARCHAR NOT NULL DEFAULT 'Sometimes',
  values TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  hobbies TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  video_verified BOOLEAN DEFAULT false,
  dating_profile_visible BOOLEAN DEFAULT true,
  is_generated BOOLEAN DEFAULT false,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  geo_location GEOGRAPHY(POINT),
  phone_number TEXT,
  last_active TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
  -- + 40 ytterligere valgfrie felt (livsstil, preferanser, etc.)
)
```

### 7.3 Nøkkelrelasjoner
```text
auth.users(id) ←── profiles(id)
profiles(id) ←── profile_details(profile_id)
profiles(id) ←── profile_preferences(user_id)
profiles(id) ←── likes(liker_id, liked_id)
profiles(id) ←── matches(user1_id, user2_id)
profiles(id) ←── messages(sender_id, recipient_id)
profiles(id) ←── posts(user_id)
profiles(id) ←── stories(user_id)
profiles(id) ←── user_roles(user_id)
profiles(id) ←── user_subscriptions(user_id)
posts(id) ←── post_comments(post_id)
posts(id) ←── post_likes(post_id)
groups(id) ←── group_members(group_id)
events(id) ←── event_attendees(event_id)
```

### 7.4 RLS-policy oversikt
- **profiles**: Alle autentiserte kan lese (blokkerte brukere filtreres), kun eier kan oppdatere
- **messages**: Kun sender/mottaker kan lese/opprette
- **likes/matches**: Kun involverte brukere kan lese
- **posts**: Autentiserte kan lese, eier kan CRUD
- **user_roles**: Kun super_admins kan administrere
- **user_subscriptions**: Eier kan lese, insert/update via SECURITY DEFINER
- **admin-tabeller**: Kun `is_super_admin(auth.uid())` har tilgang

---

## 8. EDGE FUNCTIONS (API)

### 8.1 Autentisering
Alle edge functions verifiserer JWT via:
```typescript
const authHeader = req.headers.get("Authorization")!;
const token = authHeader.replace("Bearer ", "");
const { data } = await supabaseClient.auth.getUser(token);
```

### 8.2 Endepunkter

| Funksjon | Metode | Input | Output |
|----------|--------|-------|--------|
| `create-checkout` | POST | `{ priceId }` | `{ url: string }` (Stripe checkout URL) |
| `stripe-webhook` | POST | Stripe Event | 200 OK |
| `customer-portal` | POST | - | `{ url: string }` |
| `check-subscription` | POST | - | `{ subscription_type, expires_at, is_active }` |
| `generate-bio` | POST | `{ profile data }` | `{ bio: string }` |
| `generate-icebreakers` | POST | `{ userId, targetUserId }` | `{ icebreakers: string[] }` |
| `generate-insights` | POST | `{ conversationId }` | `{ insights }` |
| `ai-wingman` | POST | `{ message, context }` | `{ reply: string }` |
| `calculate-compatibility` | POST | `{ userId, targetUserId }` | `{ score, details }` |
| `calculate-match-score` | POST | `{ profile1, profile2 }` | `{ score: number }` |
| `moderate-message` | POST | `{ message }` | `{ safe: boolean, reason? }` |
| `moderate-photo` | POST | `{ imageUrl }` | `{ safe: boolean }` |
| `send-sms-verification` | POST | `{ phoneNumber }` | `{ success: boolean }` |
| `verify-phone-code` | POST | `{ phone, code }` | `{ verified: boolean }` |
| `search-gifs` | POST | `{ query }` | `{ results: GIF[] }` |
| `translate-message` | POST | `{ text, targetLang }` | `{ translated: string }` |
| `admin-actions` | POST | `{ action, table, data }` | `{ success, data }` |
| `admin-delete-user` | POST | `{ userId }` | `{ success }` |
| `create-super-admin` | POST | `{ userId }` | `{ success }` |
| `collect-system-metrics` | POST | - | `{ metrics }` |
| `send-push-notification` | POST | `{ userId, title, body }` | `{ success }` |
| `submit-verification` | POST | `{ videoUrl }` | `{ success }` |
| `sync-translations` | POST | `{ languageCode }` | `{ count }` |
| `sync-all-translations` | POST | - | `{ count }` |
| `extract-texts` | POST | - | `{ texts }` |
| `manage-api-keys` | POST | `{ action, keyData }` | `{ key }` |
| `setup-admin` | POST | `{ userId }` | `{ success }` |

---

## 9. AUTENTISERING & SIKKERHET

### 9.1 Auth-flyt
1. Bruker registrerer seg via email/passord eller OAuth
2. Supabase Auth utsteder JWT + refresh token
3. Token lagres i `localStorage` via Supabase SDK
4. `AuthProvider` wrapper lytter på `onAuthStateChange`
5. `ProtectedRoute` sjekker `user` fra context
6. `SuperAdminGuard` sjekker `user_roles`-tabell for `super_admin`

### 9.2 Rollesystem
```sql
user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL  -- 'super_admin'
)
```
Sjekkes via `is_super_admin(auth.uid())` SECURITY DEFINER funksjon.

### 9.3 Data-beskyttelse
- **PII-beskyttelse**: `phone_number`, `latitude`, `longitude` er revoked fra `authenticated` role på `profiles`-tabellen. Tilgang kun via `get_own_profile_pii` RPC.
- **Blokkering**: RLS filtrerer blokkerte brukere fra alle spørringer via `NOT EXISTS (SELECT 1 FROM blocked_users ...)`
- **Profil-synlighet**: `profile_visibility_settings` lar brukere kontrollere hvilke felt som er synlige
- **Trigger-beskyttelse**: DB-trigger hindrer brukere fra å endre `verified`, `phone_verified` selv
- **Input-sanitering**: `isomorphic-dompurify` brukes for HTML-rensing
- **Console-suppression**: `console.log/info/debug/warn` supprimert i produksjon

### 9.4 Hemmeligheter (krever Supabase Dashboard)
| Hemmelighet | Brukes av |
|-------------|-----------|
| `STRIPE_SECRET_KEY` | create-checkout, stripe-webhook |
| `STRIPE_WEBHOOK_SECRET` | stripe-webhook |
| `OPENAI_API_KEY` | generate-bio, icebreakers, insights, wingman, moderering |
| `TWILIO_ACCOUNT_SID` | send-sms-verification |
| `TWILIO_AUTH_TOKEN` | send-sms-verification |
| `TWILIO_PHONE_NUMBER` | send-sms-verification |
| `TENOR_API_KEY` | search-gifs |
| `SUPABASE_SERVICE_ROLE_KEY` | admin-actions, admin-delete-user |

---

## 10. DESIGN SYSTEM

### 10.1 Midnight Rose
Appen bruker et egendefinert mørkt tema kalt "Midnight Rose":

| Variabel | HSL-verdi | Bruk |
|----------|-----------|------|
| `--background` | 271 33% 9% | Hovedbakgrunn (mørk lilla) |
| `--card` | 268 37% 17% | Kort-bakgrunn |
| `--primary` | 336 90% 60% | Hovedfarge (rosa) |
| `--accent` | 340 95% 71% | Aksentfarge (lys rosa) |
| `--muted-foreground` | 270 20% 63% | Dempet tekst |
| `--border` | 268 25% 25% | Kantlinjer |

### 10.2 Typografi
- **Hovedfont**: Inter (alle vekter 100-900)
- **Sekundær**: Poppins (300-700)
- **Alternativ**: Quicksand (300-700)
- **Kurdisk/Arabisk**: Noto Sans Arabic (300-900, RTL)

### 10.3 Design-prinsipper
- iOS/Android-nativt utseende med frosted glass headers
- Pill-style kontroller og 24-32px avrundede hjørner
- Bottom navigation (56px) med safe-area padding
- Sheet/bottom-sheet for popups (vaul)
- Sonner for toast-varsler
- Framer Motion for sideoverganger

### 10.4 Responsivitet
- Optimalisert for 390x844 (iPhone) som primær viewport
- Max-width containere for tablet/desktop
- Bottom nav skjules på admin-ruter

---

## 11. INTERNASJONALISERING (i18n)

### 11.1 Støttede språk
| Kode | Språk | Retning |
|------|-------|---------|
| `english` | English | LTR |
| `kurdish_sorani` | کوردی (سۆرانی) | RTL |
| `kurdish_kurmanci` | Kurdî (Kurmancî) | LTR |
| `norwegian` | Norsk | LTR |
| `german` | Deutsch | LTR |

### 11.2 Implementasjon
- Oversettelser lagres i `app_translations`-tabell
- `useTranslations()` hook henter oversettelser basert på valgt språk
- Auto-deteksjon av nettleserens språk ved første besøk
- RTL-støtte via CSS `[dir="rtl"]` selektorer og `getTextDirection()`
- Synkronisering via `sync-translations` edge function

---

## 12. DEPLOY & DRIFT

### 12.1 Hosting
- **Frontend**: Lovable (Vite build → CDN)
- **Backend**: Supabase Cloud (PostgreSQL, Edge Functions, Auth, Storage, Realtime)
- **Publisert URL**: `https://dating-profile-creator-45.lovable.app`

### 12.2 Bygging
```bash
npm run build     # Vite produksjonsbygging
npm run dev       # Utviklingsserver
npm run preview   # Forhåndsvis prod-bygging
```

### 12.3 Miljøvariabler
Frontend (auto-satt av Lovable):
- `VITE_SUPABASE_URL` = `https://bqgjfxilcpqosmccextj.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = (anon key)
- `VITE_SUPABASE_PROJECT_ID` = `bqgjfxilcpqosmccextj`

Backend (Supabase Dashboard → Edge Function Secrets):
- Se seksjon 9.4 for komplett liste

### 12.4 Edge Functions
Deployes automatisk av Lovable. Kjører på Deno runtime.

### 12.5 PWA
- `manifest.json` med app-metadata
- Service worker for push-varsler
- Apple PWA meta-tags for iOS

---

## 13. FEILHÅNDTERING

### 13.1 Frontend
- **ErrorBoundary**: React error boundary wrapper rundt kritiske komponenter
- **Toast**: Sonner brukes for alle brukervenlige feilmeldinger
- **Loading states**: `LoadingState`-komponent med spinner
- **Empty states**: `EmptyState`-komponent
- **Console suppression**: `console.log/info/debug/warn` disabled i produksjon

### 13.2 Backend
- Edge functions returnerer strukturerte JSON-feil med HTTP statuskoder
- Supabase RLS gir 403 ved uautorisert tilgang
- Stripe webhook verifiserer signatur før prosessering

### 13.3 Logging
- `src/utils/logger.ts` - produksjonslogger
- Edge function logger via `console.log` (synlig i Supabase Dashboard)
- Admin audit log: alle admin-handlinger logges i `admin_audit_log`

---

## 14. KJENTE BEGRENSNINGER & FORBEDRINGER

### 14.1 Kjente begrensninger
1. WebRTC mangler TURN-servere (30-40% av anrop kan feile bak NAT)
2. Ingen offline-modus/caching utover push-varsler
3. Ingen automatisk kontosletting (cron-jobb mangler)
4. Ghost user generator fortsatt i klient-bundle

### 14.2 Foreslåtte forbedringer
1. **TURN-servere**: Legg til Twilio/Metered TURN for pålitelige videoanrop
2. **Server-side paginering**: Implementer cursor-basert paginering for meldinger
3. **Offline-støtte**: Service worker precaching for app shell
4. **Kontosletting-cron**: Daglig edge function som kjører planlagte slettinger
5. **E2E-tester**: Playwright tester for kritiske brukerflyter
6. **Overvåking**: Sentry eller tilsvarende for feilrapportering

### 14.3 Skalerbarhet
- Supabase PostgreSQL skalerer vertikalt (instansstørrelse kan oppgraderes)
- Edge Functions skalerer automatisk med trafikk
- Klientside-aggregering av samtaler bør migreres til database-views/RPCs
- Realtime channels bør scopes til brukerens relevante data

---

## 15. HURTIGREFERANSE FOR UTVIKLERE

### Kjør lokalt
```bash
npm install
npm run dev
```

### Legg til ny side
1. Opprett `src/pages/NySide.tsx`
2. Legg til rute i relevant fil under `src/components/app/routes/`
3. Wrap med `<P>` (ProtectedRoute) og `<L>` (Suspense lazy-loading)

### Legg til ny API-funksjon
1. Opprett/rediger fil i `src/api/`
2. Bruk `supabase` fra `@/integrations/supabase/client`
3. Verifiser bruker med `supabase.auth.getUser()` (ALDRI `getSession()`)

### Legg til ny Edge Function
1. Opprett mappe `supabase/functions/ny-funksjon/index.ts`
2. Håndter CORS, verifiser JWT, returner JSON
3. Deployes automatisk ved commit

### Legg til ny tabell
1. Bruk database migration tool
2. Aktiver RLS
3. Opprett policies med `auth.uid()`-sjekker
4. Typer auto-genereres i `src/integrations/supabase/types.ts`

### Design-konvensjoner
- Bruk CSS-variabler: `bg-background`, `bg-card`, `text-foreground`, `text-primary`
- Avrunding: `rounded-2xl` eller `rounded-3xl`
- Headere: `h-14` med `backdrop-blur-xl bg-background/80`
- Toast: `toast.success()` / `toast.error()` fra Sonner
- Ikoner: Lucide React
- Oversettelser: `t('key', 'Fallback')` via `useTranslations()`
