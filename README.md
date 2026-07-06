# 📚 Attendence Tracker App

A **Progressive Web App (PWA)** built for iPhone to track MBA class attendance across 5 subjects. Never accidentally exceed your miss limit again.

## Overview

| Detail | Value |
|---|---|
| Subjects | 5 |
| Sessions per subject | 20 |
| Max misses allowed | 4 per subject |
| Sessions per week | 2 per subject |
| Minimum attendance | 80% (16/20 sessions) |

## Subjects Tracked

- Product Strategy
- Consumer Behaviour
- Market Analytics
- AI for Managers
- Management Consulting

## Features

- **Dashboard** — see all 5 subjects at a glance with colour-coded status
- **Miss counter** — instantly know how many more sessions you can skip
- **Status indicators** — 🟢 Safe (2+ skips left) · 🟡 Warning (1 skip left) · 🔴 Danger (no skips left)
- **Session logging** — log any session as Present or Absent with a date picker
- **Weekly grouping** — session history grouped by week (2 sessions per week)
- **Delete sessions** — remove incorrectly logged sessions
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
├── manifest.json   # PWA manifest (name, icons, display mode)
├── sw.js           # Service worker for offline caching
└── icons/
    ├── icon.svg    # Vector app icon
    ├── icon-192.png
    └── icon-512.png
```

## Data Storage

All attendance data is stored locally in the browser's **localStorage** — nothing is sent to any server. Your data stays on your device.
