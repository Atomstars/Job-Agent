# Job-Agent (JavaScript Full-Stack)

A professional, debuggable job-search assistant bot built with **JavaScript on both backend and frontend**.

## Features

- Personal assistant bot flow with a web interface.
- Company-focused opportunity cards (company + role + links).
- Profile-driven Boolean search queries and board links.
- Structured backend validation and clear API errors.
- Daily execution checklist and assistant tips.

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
- `POST /api/plan` - base plan generation
- `POST /api/bot/assistant` - assistant bot response with company-role opportunities

### Example payload (`POST /api/bot/assistant`)

```json
{
  "targetRoles": ["Software Engineer", "Backend Engineer"],
  "locations": ["New York, NY", "Austin, TX"],
  "companyWatchlist": ["Google", "Microsoft", "Stripe"],
  "remoteOnly": true,
  "seniority": "mid",
  "salaryMinUsd": 120000,
  "maxOpportunities": 16,
  "keywords": ["Node.js", "TypeScript", "AWS", "PostgreSQL"]
}
```

## Debuggability notes

- Input is validated in `src/jobSearchService.js` with explicit errors.
- Assistant opportunity generation is isolated in `src/assistantBotService.js`.
- API errors are returned as structured JSON: `{ error, message }`.
- Server logs include route and timestamp for easier troubleshooting.
