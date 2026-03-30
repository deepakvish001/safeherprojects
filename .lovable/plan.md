

# SafeHer — Fix All Features & Next Improvements Plan

## Issues Found (Must Fix)

### 1. Demo Mode button missing from Splash Page
`SplashPage.tsx` only has "Get Started" (→ auth). There's no "Explore Demo Mode" button, so judges can't bypass sign-up. The `enterDemoMode` function exists in `AuthContext` but is never called from the splash screen.

**Fix**: Add a "Try Demo" button below "Get Started" that calls `enterDemoMode()` and navigates to `/`.

### 2. RoutesPage uses stale static `DEMO_INCIDENTS`
`RoutesPage.tsx` imports `DEMO_INCIDENTS` from `@/data/incidents.ts` (hardcoded static data) instead of fetching from the database like `Index.tsx` and `IncidentsPage.tsx` do. The "Reported Incidents Nearby" section shows old static entries with relative timestamps like "2h ago" that never update.

**Fix**: Fetch incidents from the database on mount, same pattern as `Index.tsx`. Fall back to `DEMO_INCIDENTS` if fetch returns empty.

### 3. TripsPage is fully local-only (demo data, no DB persistence)
`TripsPage.tsx` uses `DEMO_TRIPS` in local state. New trips aren't saved to the `trips` table. The table and RLS policies exist but aren't used.

**Fix**: Fetch trips from the `trips` table on mount, fall back to `DEMO_TRIPS` for demo mode. Wire `createTrip` to insert into the database for authenticated users.

### 4. Incidents can't be submitted in demo mode
The `reporter_id = auth.uid()` RLS policy blocks inserts for the demo user. This is expected but means the "Report Incident" form silently fails in demo mode.

**Fix**: Show a toast in demo mode saying "Sign up to report incidents" instead of attempting the insert.

### 5. ProfilePage crashes in demo mode
`ProfilePage.tsx` queries `profiles` table with `user!.id` which is the fake "demo-user-id" — this won't match any row and the page shows "Loading..." forever for the name.

**Fix**: In demo mode, skip the DB query and show hardcoded demo profile data.

### 6. OnboardingPage insert fails in demo mode
Same RLS issue — `user!.id` is the fake demo ID, so emergency contact inserts fail silently.

**Fix**: Show a message in demo mode that contacts are simulated, or skip the insert and just navigate home.

## Files to Edit

| File | Change |
|------|--------|
| `src/pages/SplashPage.tsx` | Add "Explore Demo" button |
| `src/pages/RoutesPage.tsx` | Fetch incidents from DB, fallback to static |
| `src/pages/TripsPage.tsx` | Wire to `trips` table, fallback for demo |
| `src/pages/IncidentsPage.tsx` | Guard `submitReport` for demo mode |
| `src/pages/ProfilePage.tsx` | Show demo profile when `isDemo` |
| `src/pages/OnboardingPage.tsx` | Handle demo mode gracefully |

## Estimated Scope
6 files edited, no new tables or migrations needed. All existing DB tables and RLS policies are already correct.

