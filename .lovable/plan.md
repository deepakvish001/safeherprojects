

# SafeHer — Women-First Solo Travel Safety App

## Design System
- **Style**: Bold & confident — deep navy/charcoal backgrounds, vibrant coral/magenta accents, strong typography
- **Primary**: Coral Red `#E63946` (SOS/danger), Accent: Electric Purple `#7B2FF7` (trust/community)
- **Background**: Deep Navy `#0F1729`, Cards: `#1A2332`
- **Typography**: Bold headings, high contrast, clear hierarchy
- **Motif**: Shield iconography throughout

## Pages & Features

### 1. Auth & Onboarding
- Sign up / Login with Supabase Auth (email + Google OAuth)
- User profile with photo, emergency contacts setup, ID verification placeholder
- Trust score display on profile

### 2. Home Dashboard
- Map-centric view showing user's current location
- Quick-access SOS button (large, always visible, floating)
- Safety score for current area
- Nearby emergency services pins (hospitals, police, safe hotels)
- Danger zone overlay with color-coded areas (demo data)

### 3. SOS Emergency System
- **One-tap SOS button** — triggers alert flow:
  - Sends location + timestamp to emergency contacts via app notification
  - Starts audio recording (browser MediaRecorder API)
  - Shows countdown with cancel option
- **Fake Call feature** — simulates incoming call with realistic UI
- **Loud Alarm** — plays loud siren sound
- **Voice/Gesture activation** — "shake to SOS" detection via DeviceMotion API

### 4. Live Location Sharing
- Real-time location broadcast to selected trusted contacts
- Toggle on/off with session duration options
- Contacts dashboard showing shared sessions
- Supabase Realtime for live updates

### 5. Safe Route Navigation
- Map with route suggestions highlighting "safest" path (demo algorithm using waypoints)
- Danger zones marked with warnings on the map
- "You are entering a low safety area" toast alerts
- Uses Leaflet/OpenStreetMap (free, no API key needed)

### 6. Guardian Network
- List of verified nearby helpers (demo profiles)
- Chat and call buttons (in-app chat via Supabase Realtime)
- Trust score and review system
- Request help flow

### 7. Trip Sharing
- Create trip plan (origin, destination, dates, route)
- Share with family/emergency contacts
- Alert system for route deviations or unexpected stops (demo)

### 8. Incident Reporting
- Report harassment, unsafe locations, or suspicious activity
- Location-tagged reports feed into danger zone data
- Community safety feed

### 9. Emergency Services Finder
- Nearby hospitals, police stations, safe accommodations
- Distance and directions
- One-tap call buttons

### 10. Offline Emergency Mode (SMS via Twilio)
- Detects offline status
- Queues last known location for SMS send when back online
- Twilio connector for SMS to emergency contacts

## Backend (Supabase via Lovable Cloud)
- **Tables**: profiles, emergency_contacts, trips, location_shares, incidents, danger_zones, guardians, guardian_reviews, sos_events
- **Realtime**: location sharing, guardian chat
- **Edge Functions**: SMS alerts (Twilio), SOS notification dispatch
- **RLS**: All tables secured per user

## Implementation Order
1. Auth + Profile + Emergency Contacts setup
2. Home dashboard with map (Leaflet + OpenStreetMap)
3. SOS system (button, fake call, alarm)
4. Live location sharing with Supabase Realtime
5. Safe routes + danger zones on map
6. Emergency services finder
7. Guardian network + chat
8. Trip sharing
9. Incident reporting
10. Offline mode + Twilio SMS

