
# Komplett Pre-Launch Audit og Feilsokingsplan for KurdMatch

## Oversikt

Etter en grundig skanning av hele kodebasen, databasen, sikkerhetspolicyer, edge functions, og frontend-kode, presenterer jeg her en fullstendig rapport med alt som gjenstor for lansering.

---

## SEKSJON A: SIKKERHET (Database og RLS)

### A1. FIKSET - Profiler er naa beskyttet
Profiles-tabellen har naa `authenticated`-only SELECT policy. Dette var kritisk og er fikset.

### A2. FIKSET - Reports beskytter reporter-identitet
Reports-tabellen har naa kun `Super admins can view all reports` for SELECT. Vanlige brukere kan kun INSERT (opprette rapporter), ikke se dem.

### A3. FIKSET - RLS aktivert pa alle tabeller
72 av 73 tabeller har RLS aktivert. Den eneste uten er `spatial_ref_sys` (PostGIS systemtabell - ikke sensitiv).

### A4. FIKSET - Function search paths
Alle security definer funksjoner har `search_path=public` satt korrekt.

### A5. MÅ FIKSES - RLS Policy "Always True" (5 stk)
Folgende policyer bruker `WITH CHECK (true)` som gir ubegrenset INSERT-tilgang:

| Tabell | Policy | Risiko |
|--------|--------|--------|
| `user_roles` | "Allow insertion of super_admin roles" | **KRITISK** - Enhver autentisert bruker kan gi seg selv super_admin-rollen |
| `hashtags` | "System can manage hashtags" | Middels - alle kan opprette/endre hashtags |
| `matches` | "System can create matches" | Hoy - alle kan opprette falske matches |
| `notifications` | "System can create notifications" | Middels - alle kan sende falske varsler |
| `message_safety_flags` | "Service role can create flags" | Lav - men bor begrenses |

**Aksjon:** Endre `user_roles` INSERT-policyen til a kreve `is_super_admin(auth.uid())`. De andre "System"-policyene bor endres til `service_role` only eller fjernes.

### A6. MÅ FIKSES - Leaked Password Protection
Supabase Auth har ikke aktivert sjekk mot lekke passord-databaser.
**Aksjon:** Aktiver i Supabase Dashboard -> Authentication -> Settings.

### A7. BOR FIKSES - Postgres-versjon utdatert
Sikkerhetsoppdateringer er tilgjengelige.
**Aksjon:** Oppgrader i Supabase Dashboard -> Settings -> Infrastructure.

### A8. BOR FIKSES - Extensions i public schema
PostGIS er installert i public schema i stedet for en dedikert schema.
**Aksjon:** Lav prioritet, kan gjores etter lansering.

---

## SEKSJON B: DESIGN-KONSISTENS (Gjenstående)

### B1. MÅ FIKSES - 14 filer har fortsatt gammel lilla gradient
Folgende filer bruker fortsatt `from-purple-900 via-purple-800 to-pink-900`:

1. `src/pages/Landing.tsx` - Hele landingssiden
2. `src/pages/Auth.tsx` - Login-siden
3. `src/pages/CreateEvent.tsx` - Opprett arrangement
4. `src/pages/Admin/PlatformAnalytics.tsx` - Admin analytics
5. `src/pages/Admin/SystemSettings.tsx` - Admin innstillinger
6. `src/pages/Admin/UserManagement.tsx` - Admin brukeradministrasjon
7. `src/pages/Admin/ContentModeration.tsx` - Innholdsmoderering
8. `src/pages/Messages.tsx` - Meldinger (avatar-ring)
9. `src/components/discovery/EditPostDialog.tsx` - Rediger innlegg
10. `src/components/messages/UnmatchDialog.tsx` - Avmatch dialog
11. `src/components/landing/MobileSidebar.tsx` - Mobil sidebar
12. `src/components/swipe/SwipeFilters.tsx` - Swipe-filtre
13. `src/components/my-profile/sections/ComprehensiveProfileEditor.tsx` - Profilredigering
14. `src/pages/Swipe.tsx` - Padding pb-20

**Aksjon:** Oppdater alle til `bg-background`, `text-foreground`, `bg-card`, `border-border` osv.

### B2. MÅ FIKSES - 90+ filer bruker fortsatt useToast
Ca. 90 filer bruker fortsatt den gamle `useToast` fra `@/hooks/use-toast` i stedet for `sonner`. Dette gir inkonsistente varsler pa forskjellige sider.

**Aksjon:** Migrere alle til `toast` fra `sonner`.

---

## SEKSJON C: EDGE FUNCTIONS

### C1. SJEKK - Manglende API-hemmeligheter
Kun 3 hemmeligheter er konfigurert: `LOVABLE_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.

Edge functions som trenger hemmeligheter som IKKE er konfigurert:
- `ai-wingman` - Trenger AI API-nokkel (OpenAI/Anthropic)
- `generate-bio` - Trenger AI API-nokkel
- `generate-icebreakers` - Trenger AI API-nokkel
- `generate-insights` - Trenger AI API-nokkel
- `translate-message` - Trenger oversettelse-API
- `moderate-message` / `moderate-photo` - Trenger moderering-API
- `send-sms-verification` - Trenger Twilio-hemmeligheter
- `send-push-notification` - Trenger push-tjeneste-nokkel

**Aksjon:** Disse kan konfigureres via admin-panelet etter lansering (ifolge prosjektets strategi). Funksjonene vil returnere feil inntil API-noklene er satt opp.

---

## SEKSJON D: FUNKSJONALITET

### D1. BOR SJEKKES - Registreringsflyt
Multi-select-felt bruker tomme strenger i stedet for arrays. Sjekk at registrering fungerer ende-til-ende.

### D2. BOR SJEKKES - OAuth / Social Login
Callback-handler finnes, men bor testes med faktiske providere.

### D3. BOR SJEKKES - Stripe betalingsflyt
Checkout og webhook er konfigurert. Bor verifiseres i test-modus.

---

## SEKSJON E: PRIORITERT HANDLINGSPLAN

### Fase 1: Kritisk sikkerhet (MA gjores for lansering)
1. **Fiks `user_roles` INSERT-policy** - Fjern `WITH CHECK (true)` og krev super_admin
2. **Fiks `matches`, `notifications`, `hashtags` INSERT-policyer** - Begrens til service_role
3. **Aktiver leaked password protection** i Supabase Dashboard

### Fase 2: Design-konsistens (Anbefalt for lansering)
4. **Oppdater de 14 gjenvarende filene** med gammel lilla gradient til Midnight Rose-tema
5. **Migrere useToast til sonner** i alle gjenvarende filer (~90 filer, men kan gjores i batches)

### Fase 3: Testing (MA gjores for lansering)
6. **Test registreringsflyt** ende-til-ende
7. **Test login/logout** med e-post og social login
8. **Test matching og meldinger**
9. **Test admin-panelet** (super admin tilgang)
10. **Test pa mobil og desktop**

### Fase 4: Etter lansering
11. Konfigurer API-hemmeligheter for edge functions
12. Oppgrader Postgres-versjon
13. Flytt PostGIS-extension til egen schema

---

## TEKNISK GJENNOMFORING

### Steg 1: Database-migrering for kritiske sikkerhetsfiks
```sql
-- Fiks user_roles: Fjern ubegrenset INSERT
DROP POLICY "Allow insertion of super_admin roles" ON public.user_roles;
CREATE POLICY "Only super admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (is_super_admin(auth.uid()));

-- Fiks matches: Kun system/service_role
DROP POLICY "System can create matches" ON public.matches;

-- Fiks notifications: Kun system
DROP POLICY "System can create notifications" ON public.notifications;

-- Fiks hashtags
DROP POLICY "System can manage hashtags" ON public.hashtags;

-- Fiks message_safety_flags
DROP POLICY "Service role can create flags" ON public.message_safety_flags;
```

Merk: Etter a fjerne "System"-policyene, ma backend-koden som oppretter matches/notifications bruke `service_role`-nokkel (via edge functions) i stedet for klientsiden.

### Steg 2: Frontend tema-oppdatering
Oppdater alle 14 filer fra Seksjon B1 til a bruke CSS-variabler.

### Steg 3: Toast-migrering
Erstatt `useToast` med `sonner` i batches av 10-15 filer.

---

## ESTIMERT TID

| Oppgave | Tid |
|---------|-----|
| Kritisk sikkerhet (database) | 30 min |
| Design-oppdatering (14 filer) | 1 time |
| Toast-migrering (90 filer) | 2-3 timer |
| Ende-til-ende testing | 2-3 timer |
| **Totalt** | **5-7 timer** |
