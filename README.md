# SurakshaDigi Dashboard — Frontend

**Family caregiver dashboard for SurakshaDigi**, an elder-safety platform that monitors medication adherence and flags suspicious financial transactions — without the elder needing to do anything technical themselves.

**Live app:** https://suraksha-digi-dashboard.vercel.app
**Backend repo:** https://github.com/aayushtiwari307/suraksha-digi
**Android companion repo:** https://github.com/aayushtiwari307/suraksha-digi-android

---

## What this does

Family members log in, add elders under their account, track medication schedules, and monitor for fraud — either by testing the fraud pipeline directly with a simulated SMS, or by pairing an elder's real Android phone so genuine bank SMS gets analyzed automatically.

## Features

- **Dual-role login** — Family and Elder accounts, JWT-authenticated
- **Elder management** — add, edit, and deactivate/reactivate elders under a family account
- **Medication tracking** — schedule doses with duration control, view today's medications, get notified of missed doses (detected server-side on a background job, independent of the dashboard being open)
- **Fraud simulation** — paste any bank-style transaction SMS on the "Simulate SMS" page and see it run through the real fraud-detection pipeline (parsing, risk scoring, alert creation) — no Android setup required
- **Android device pairing** — generate a one-time pairing code for an elder from the dashboard, used to link a real Android phone running the [companion app](https://github.com/aayushtiwari307/suraksha-digi-android), enabling live SMS-based fraud monitoring
- **Alerts** — view AI-explained fraud and missed-medication alerts per elder, with severity and resolution status
- **Auto-attached auth** — Axios interceptor attaches the JWT to every request automatically; protected routes redirect to login if unauthenticated

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React + Vite |
| Routing | React Router v6 |
| State management | Context API |
| HTTP client | Axios (with interceptors) |
| Styling | Plain CSS (no framework) |

## Architecture

```
React Frontend
      ↓ Axios (JWT interceptor)
Express Backend ──→ MongoDB Atlas
      ↓                    ↑
Gemini 2.5 Flash    Android Companion App
 (risk explanations)  (real SMS ingestion)
```

## Project structure

```
suraksha-digi-dashboard/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state (JWT + family/elder info)
│   ├── pages/
│   │   ├── Login.jsx            # Family/Elder authentication
│   │   ├── Register.jsx         # Family account registration
│   │   ├── Dashboard.jsx        # Elder alerts + today's medications
│   │   ├── AddElder.jsx         # Register a new elder
│   │   ├── ManageElders.jsx     # Edit/deactivate elders, generate Android pairing codes
│   │   ├── AddMedication.jsx    # Schedule a medication for an elder
│   │   └── SimulateSms.jsx      # Paste a transaction SMS and see it scored live
│   ├── App.jsx                  # Route definitions
│   └── main.jsx                 # Entry point
├── index.html
└── vite.config.js
```

## Getting started

**Requirements:** Node.js v18+, the [SurakshaDigi backend](https://github.com/aayushtiwari307/suraksha-digi) running locally or pointed at the live API.

```bash
git clone https://github.com/aayushtiwari307/suraksha-digi-dashboard.git
cd suraksha-digi-dashboard
npm install
npm run dev
```

Runs on `http://localhost:5173` by default.

## Pages

| Page | Route | Description |
|---|---|---|
| Login | `/` | Family or Elder authentication |
| Register | `/register` | Create a new family account |
| Dashboard | `/dashboard` | View alerts and today's medications for a selected elder |
| Add Elder | `/add-elder` | Register a new elder under the family account |
| Manage Elders | `/manage-elders` | Edit/deactivate elders, generate an Android pairing code |
| Add Medication | `/add-medication` | Schedule a medication for an elder |
| Simulate SMS | `/simulate-sms` | Test the live fraud pipeline with a pasted transaction SMS |

## Known limitations (by design, not oversight)

- No in-app password reset flow yet — handled manually at the database level for now.
- Only one Android device can currently be paired per elder profile at a time.

---

Built solo as a portfolio project by [Aayush Tiwari](https://github.com/aayushtiwari307).
