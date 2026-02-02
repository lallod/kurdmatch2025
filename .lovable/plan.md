
# Plan: Online Status System og Ytterligere Moderniseringer

## Oversikt
Fortsetter 2026-moderniseringen med fokus på sanntids online-status, utvidede AI-funksjoner og forbedret brukeropplevelse.

## Hva som allerede er implementert
- SmartFilters, SmartNotificationCenter og ProfileBoostCard (integrert i Discovery og Swipe)
- AI Compatibility scoring med MatchScoreCard og CompatibilityBadge
- AI Wingman for meldingsforslag
- Icebreaker-forslag for nye samtaler
- MatchInsightsHeader med samtale-tips
- ChatInsightsPanel for samtaleanalyse

## Neste Fase: 4 Hovedforbedringer

### 1. Real-time Online Status System

**Nye komponenter:**
- `src/components/shared/OnlineStatusBadge.tsx` - Universell komponent som viser online-status med grønn/grå prikk
- `src/hooks/useOnlinePresence.ts` - Hook som bruker Supabase Realtime Presence for å spore og vise online-status

**Integrasjon i:**
- Samtale-listen (Messages-siden)
- Profilkort på Swipe og Discovery
- Match-listen

**Hvordan det fungerer:**
- Bruker Supabase Realtime Presence API
- Oppdaterer `last_active` i profilen hvert minutt
- Viser "Online nå" eller "Sist aktiv X timer siden"

### 2. Dedicated Compatibility Insights Page

**Ny side:** `src/pages/CompatibilityInsights.tsx`

Viser:
- Full MatchScoreCard med detaljert breakdown
- Sammenligning av interesser og verdier side-ved-side
- AI-genererte tips for hvordan dere kan koble bedre
- Historikk over kompatibilitetsendringer basert på samtaler

**Tilgang via:**
- Klikk på compatibility badge på profil
- Egen menyknapp i meldingsvinduet

### 3. Push Notification Integration

**Ny Edge Function:** `supabase/functions/send-push-notification/index.ts` (utvidelse)

**Varsler for:**
- Nye matcher
- Nye meldinger når offline
- Når kompatibilitets-score øker
- Profilvisninger fra premium-brukere

**Frontend oppsett:**
- Service Worker for Web Push
- Notification permission request
- Settings i NotificationSettings.tsx

### 4. Activity Feed Component

**Ny komponent:** `src/components/discovery/ActivityFeed.tsx`

Viser en sanntids feed av:
- Hvem som nylig likte deg
- Hvem som så profilen din
- Nye matcher i nettverket
- Community-aktivitet

---

## Tekniske Detaljer

### Online Presence Hook
```text
+------------------+     +------------------+
|  useOnlinePresence |---> | Supabase Presence |
+------------------+     +------------------+
       |                        |
       v                        v
+------------------+     +------------------+
|  OnlineStatusBadge |   | profiles.last_active |
+------------------+     +------------------+
```

### Database-endringer (ingen nødvendige)
Alle nødvendige kolonner finnes allerede:
- `profiles.last_active` - Eksisterer
- `profiles.privacy_show_online_status` - Eksisterer
- `profiles.privacy_show_last_active` - Eksisterer

### Filer som opprettes
1. `src/hooks/useOnlinePresence.ts`
2. `src/components/shared/OnlineStatusBadge.tsx`
3. `src/pages/CompatibilityInsights.tsx`
4. `src/components/discovery/ActivityFeed.tsx`

### Filer som oppdateres
1. `src/pages/Messages.tsx` - Legger til OnlineStatusBadge i samtale-listen
2. `src/components/swipe/ProfileInfo.tsx` - Legger til online-status
3. `src/App.tsx` - Legger til rute for CompatibilityInsights
4. `src/pages/Discovery.tsx` - Legger til ActivityFeed

---

## Implementeringsrekkefølge

1. **Fase 1**: Online Presence System (hook + badge + integrasjon)
2. **Fase 2**: Activity Feed komponent
3. **Fase 3**: Compatibility Insights side
4. **Fase 4**: Push notification utvidelser

Hver fase bygger på den forrige og gir umiddelbar verdi til brukerne.
