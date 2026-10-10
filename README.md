# 📚 Attendence Tracker App

A **Progressive Web App (PWA)** built for iPhone to track MBA class attendance across the current trimester subjects. Never accidentally exceed your miss limit again.

## Overview

| Detail | Value |
|---|---|
| Subjects | 4 |
| Sessions per subject | 20 |
| Max misses allowed | 4 per subject |
| Sessions per week | 2 per subject |
| Minimum attendance | 80% (16/20 sessions) |

## Subjects Tracked

- Digital Marketing (DM)
- Strategic Brand Management — Division B (SBM_B)
- Visual Analytics (VA)
- Games of Strategy (GOS)

## Features

- **Dashboard** — see all 4 subjects at a glance with colour-coded status
- **Miss counter** — instantly know how many more sessions you can skip
- **Remaining classes** — see unlogged classes per subject and across the trimester
- **Status indicators** — 🟢 Safe (2+ skips left) · 🟡 Warning (1 skip left) · 🔴 Danger (no skips left)
- **Session logging** — log any session as Present or Absent with a date picker
- **Weekly grouping** — session history grouped by week (2 sessions per week)
- **Delete sessions** — remove incorrectly logged sessions
- **Excel timetable import** — upload an NMIMS `.xlsx` timetable and automatically keep DM, SBM Division B, VA, and GOS
- **Editable timetable** — imported classes can still be added, edited, or removed
- **One-week rescheduling** — change an imported class date, time, or subject; the old slot is removed and the class moves to the correct day
- **Offline support** — works without internet after first load (service worker)
- **Installable** — add to iPhone Home Screen for a native app experience

## Live App

Hosted via GitHub Pages:
```
https://aastha381.github.io/Attendence-Tracker-App/
```

## Install on iPhone

1. Open the link above in **Safari**
2. Tap the **Share** button (box with arrow)
3. Tap **"Add to Home Screen"**
4. The app opens full-screen like a native app

## Reschedule a Class

1. Open the **Timetable** tab.
2. Tap the class that changed.
3. Update its date, time, subject, room, or professor.
4. Tap **Save**. ClassTrack removes the original slot and moves the class to the correct day within the imported week.

## Run Locally

No build step needed — it's plain HTML, CSS and JavaScript.

```bash
git clone https://github.com/AASTHA381/Attendence-Tracker-App.git
cd Attendence-Tracker-App
python3 -m http.server 3000
# Open http://localhost:3000
```

## Project Structure

```
├── index.html      # Full single-page app (HTML + CSS + JS)
├── timetable-import.js # NMIMS Excel timetable parser and subject matcher
├── manifest.json   # PWA manifest (name, icons, display mode)
├── sw.js           # Service worker for offline caching
├── vendor/
│   └── xlsx.full.min.js # Vendored SheetJS parser for offline Excel import
└── icons/
    ├── icon.svg    # Vector app icon
    ├── icon-192.png
    └── icon-512.png
```

## Data Storage

Attendance, imported timetable, active week dates, and import metadata are stored locally in the browser's **localStorage** — nothing is sent to any server. Your data stays on your device.

Timetable filenames may separate the date range with a hyphen or `to`, for example
`05.10.2026-11.10.2026.xlsx` or `12.10.2026 to 18.10.2026.xlsx`.
