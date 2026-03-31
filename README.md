# Concierge AI — AI Interview Scheduler

> **Live demo → [concierge-ai.live](https://roy-adriyan04.github.io/Concierge-AI/)**

Hiring teams waste 4–6 hours per candidate just coordinating interview slots across panel schedules. Concierge AI eliminates that entirely — paste in availability, get the top 3 conflict-free slots ranked by AI, and send calendar invites in one click.

Built with React + Google Workspace APIs. n8n automation backend in active development.

---

## The problem

Scheduling a single interview round requires:
- Collecting availability from 3–5 panelists
- Cross-referencing against the candidate's slots
- Checking for calendar conflicts manually
- Sending invites and Meet links individually

For a team interviewing 10+ candidates a week, this is a part-time job.

---

## What Concierge AI does

- **AI slot ranking** — scores available windows by panel alignment and candidate preference
- **Conflict detection** — automatically surfaces overlaps before they happen  
- **Availability heatmap** — visual density map of optimal interview windows
- **One-click scheduling** — creates Google Calendar events + Meet links + Gmail invites
- **Candidate pipeline** — Kanban board tracking applicants from application to scheduled

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS, Framer Motion |
| Auth | Google OAuth 2.0 |
| APIs | Google Calendar API, Gmail API |
| Automation (WIP) | n8n |

---

## Status

- [x] Frontend UI complete and deployed
- [x] Google OAuth + Calendar + Gmail integration
- [x] AI slot ranking + conflict detection
- [ ] n8n workflow automation backend (in progress)
- [ ] Beta user onboarding (target: April 2026)

---

## Run locally
```bash
git clone https://github.com/roy-adriyan04/Concierge-AI.git
cd Concierge-AI
npm install
```

Create `.env.local`:
```
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_API_KEY=your_api_key
```
```bash
npm run dev
```

---

## Screenshots

*Coming soon — Loom demo video in progress*

---

Built by [Adriyan Roy](https://linkedin.com/in/adriyan-roy) · New Delhi, India
