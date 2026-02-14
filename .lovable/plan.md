

# Super Admin Dashboard -- Komplett Design og Funksjonsaudit

## Oversikt

Etter grundig gjennomgang av hele Super Admin-dashboardet (38 sider + sidebar-layout), har jeg identifisert problemer i 3 hovedkategorier: **design-inkonsistens**, **manglende admin-funksjoner**, og **teknisk gjeld**.

---

## SEKSJON A: DESIGN-INKONSISTENS (To temaer i bruk)

Super Admin-dashboardet bruker et **mork tema** (svart bakgrunn `#0a0a0a`/`#0f0f0f`/`#141414` med hvit tekst). MEN **en side** bryter fullstendig med dette:

### A1. SettingsPage bruker LIGHT tema (kritisk)
`src/pages/SuperAdmin/pages/SettingsPage.tsx` bruker:
- `text-gray-900` (svart tekst pa svart bakgrunn = uleselig)
- Standard `Card` uten dark-styling (hvit bakgrunn)
- `TabsList` med `w-[600px]` hardkodet bredde (bryter pa mobil)

**Alle andre SuperAdmin-sider** bruker:
- `text-white` / `text-white/60` for tekst
- `bg-[#141414] border-white/5` for kort
- `bg-white/5 border-white/10 text-white` for inputs

### A2. ContentModerationTab bruker LIGHT tema
`src/pages/SuperAdmin/components/users/redesign/tabs/ContentModerationTab.tsx` bruker:
- `text-gray-900` og `text-gray-600` (hvit/lys tema)

### A3. RolesPage og AIRecommendations bruker LIGHT tema
- `RolesPage.tsx` bruker standard `Card` uten dark-styling
- `AIRecommendations.tsx` bruker `bg-blue-50`, `text-blue-800` (lys tema-farger)
- `RoleData.tsx` bruker mock-data istedenfor ekte database

### A4. Sidebar branding feil
SuperAdminLayout.tsx viser "**LoveAffection**" som appen heter -- men appen heter **KurdMatch**.

---

## SEKSJON B: TOAST-MIGRERING (19 filer)

Folgende SuperAdmin-filer bruker fortsatt `useToast` fra `@/hooks/use-toast`:

1. `SubscribersPage.tsx`
2. `ModerationPage.tsx`
3. `EmailCampaignsPage.tsx`
4. `ABTestingPage.tsx`
5. `RegistrationQuestionsPage.tsx`
6. `SupportTicketsPage.tsx`
7. `Admin/index.tsx`
8. `AddUserDialog.tsx`
9. `QuestionsTable.tsx`
10. `StatsOverview.tsx`
11. `UserDistributionChart.tsx`
12. `UpdateProfilesForm.tsx`
13. + ca. 7 andre

---

## SEKSJON C: DUPLISERT ADMIN-SYSTEM

Appen har **TO separate admin-systemer** som gjor det forvirrende:

| System | Rute | Sider |
|--------|------|-------|
| **Admin** (`/admin/*`) | 6 sider | Dashboard, Users, Reports, Content, Analytics, Settings |
| **Super Admin** (`/super-admin/*`) | 38 sider | Alt over + mange flere |

`/admin/*`-rutene har **ingen ekstra rollekontroll** utover `ProtectedRoute` (som bare sjekker innlogging, ikke admin-rolle). Super Admin bruker `useAdminRoleCheck` korrekt.

**Forslag:** Fjern `/admin/*`-rutene og redirect til `/super-admin/*`. Alt admin-arbeid bor skje fra ett sted.

---

## SEKSJON D: MANGLENDE ADMIN-FUNKSJONER

### D1. Funksjoner som finnes men bruker mock-data:
| Side | Problem |
|------|---------|
| DashboardNew.tsx | Earnings-chart og registrations-chart bruker **hardkodet mock-data** |
| RolesPage.tsx | Bruker `mockRoles` fra `RoleData.tsx` istedenfor database |
| AIRecommendations.tsx | Statisk tekst, ingen ekte AI-anbefalinger |
| ABTestingPage.tsx | Grunnstruktur men trenger ekte A/B-test-integrasjon |

### D2. Admin-funksjoner som BOR finnes (forslag):
| Funksjon | Beskrivelse | Prioritet |
|----------|-------------|-----------|
| **Bruker-sletting** | Admin kan ikke slette brukere permanent (kun blokkere) | Hoy |
| **Masse-e-post** | EmailCampaigns eksisterer men sender ikke ekte e-post | Middels |
| **Backup/Restore** | Ingen mulighet til a ta backup av data | Lav |
| **Admin-varsler i sanntid** | Varsler for nye rapporter, nye brukere (real-time) | Middels |
| **Bruker-impersonering** | Se appen som en spesifikk bruker (for feilsoking) | Lav |
| **Geo-analyse** | Kart over hvor brukere befinner seg (data finnes allerede) | Middels |
| **Inntektsrapporter** | Ekte Stripe-integrasjon for betalingsdata pa dashboardet | Hoy |

---

## SEKSJON E: HANDLINGSPLAN

### Fase 1: Kritisk design-fix (SettingsPage + branding)
1. Oppdater `SettingsPage.tsx` til dark tema (`bg-[#141414]`, `text-white`, `border-white/5`)
2. Oppdater `ContentModerationTab.tsx` til dark tema
3. Oppdater `RolesPage.tsx` og `AIRecommendations.tsx` til dark tema
4. Endre sidebar-branding fra "LoveAffection" til "KurdMatch"

### Fase 2: Toast-migrering (19 filer)
5. Migrere alle 19 SuperAdmin-filer fra `useToast` til `sonner`

### Fase 3: Fjern duplisert admin-system
6. Redirect `/admin/*`-ruter til `/super-admin/*`
7. Fjern gammel `Admin/AdminDashboard.tsx` (profil-redigerer som feilaktig heter "Admin")

### Fase 4: Erstatt mock-data
8. Koble DashboardNew earnings-chart til ekte Stripe-data
9. Koble registrations-chart til ekte `profiles.created_at` data
10. Flytt roles fra mock-data til `user_roles`-tabellen

---

## TEKNISK DETALJER

### Filer som ma endres (Fase 1):
- `src/pages/SuperAdmin/pages/SettingsPage.tsx` -- Full dark-tema konvertering
- `src/pages/SuperAdmin/components/users/redesign/tabs/ContentModerationTab.tsx` -- Dark tema
- `src/pages/SuperAdmin/pages/RolesPage.tsx` -- Dark tema for kort
- `src/pages/SuperAdmin/components/roles/AIRecommendations.tsx` -- Dark tema
- `src/pages/SuperAdmin/SuperAdminLayout.tsx` -- Endre "LoveAffection" til "KurdMatch"

### Filer for toast-migrering (Fase 2):
Alle 19 filer listet i Seksjon B -- erstatt `import { useToast } from '@/hooks/use-toast'` med `import { toast } from 'sonner'` og oppdater alle `toast({title, description})` til `toast.success(title)` / `toast.error(title)`.

### Estimert omfang:
| Oppgave | Antall filer | Tid |
|---------|-------------|-----|
| Design-fix (dark tema) | 5 filer | 30 min |
| Toast-migrering | 19 filer | 1 time |
| Branding-fix | 1 fil | 5 min |
| Duplisert admin-cleanup | 3-5 filer | 30 min |
| Mock-data erstatning | 3 filer | 1 time |
| **Totalt** | **~30 filer** | **~3 timer** |

