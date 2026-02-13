# Job-Agent (JavaScript Full-Stack)

A professional, debuggable job-search assistant built with **JavaScript on both backend and frontend**.

## Features

- Clean web interface to define your job profile.
- Backend validation for predictable debugging.
- Profile-driven Boolean search queries.
- Ready-to-click links for LinkedIn, Indeed, Google, Wellfound, and RemoteOK.
- Daily execution checklist to stay consistent.

## Tech Stack

- Backend: Node.js (built-in HTTP server)
- Frontend: HTML + CSS + Vanilla JavaScript

## Run locally

```bash
npm start
```

Open: `http://localhost:3000`

## API endpoints

- `GET /api/health` - health check
- `GET /api/profile/template` - sample profile payload
- `POST /api/plan` - generate queries, links, and daily plan

### Example payload (`POST /api/plan`)

```json
{
  "targetRoles": ["Software Engineer", "Backend Engineer"],
  "locations": ["New York, NY", "Austin, TX"],
  "remoteOnly": true,
  "seniority": "mid",
  "salaryMinUsd": 120000,
  "keywords": ["Node.js", "TypeScript", "AWS", "PostgreSQL"]
}
```

## Debuggability notes

- Input is validated in `src/jobSearchService.js` with explicit errors.
- API errors are returned as structured JSON: `{ error, message }`.
- Server logs include route and timestamp for easier troubleshooting.
