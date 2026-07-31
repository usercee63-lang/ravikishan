# AGENTS.md

Study Vault (package name `ravikishan`) — Nepali board-level study site (physics, chemistry, biology, mathematics, english, nepali). Frontend: React 19 + Vite 8 at repo root (ESM). Backend: Express 5 API in `backend/` (CommonJS). No workspaces — each app has its own `package.json`/`node_modules`. No tests, no CI.

## Commands

- Frontend (root): `npm run dev` (port 5173) · `npm run lint` · `npm run build` · `npm run generate-navigation`
- Backend: `npm run dev` inside `backend/` (nodemon, port 5000)
- No test suite exists. Verify with `npm run lint`, then `npm run build`.

## Data flow (critical)

- Topic/chapter pages load via the backend API: `API_BASE = VITE_API_URL || http://localhost:5000` (`src/constants/api.js`). The backend must be running; pages otherwise fail.
- Backend reads content + navigation from **`backend/data copy/`** — note the space in the directory name. Paths: `backend/data copy/content/<subject>/<chapter>/<topic>.json` and `backend/data copy/navigation/<subject>.json`. Chapter dirs may contain spaces/parens (e.g. `state of matter (gaseous state)`).
- `public/data/` is a second, legacy mirror (31 tracked files vs 56 in `backend/data copy` — not identical). The SearchBar fetches `/data/navigation/<subject>.json` statically from `public/data/navigation/` (`src/components/ui/SearchBar.jsx`). Edits to one mirror do NOT affect the other.
- Adding a topic: create the content JSON under `backend/data copy/content/`, then add it to navigation JSON in **both** mirrors. `npm run generate-navigation` only regenerates the `public/data/` mirror.
- `/api/search` (`backend/services/searchService.js`) reads `backend/data copy/content/` and skips unparseable JSON files (logs a warning). Note: `quantity-of-heat.json` and `vector.json` (physics) are currently invalid JSON and are skipped.
- Missing topic files return HTTP 200 with `{ comingSoon: true, ... }` (`backend/routes/content.js`), not 404.
- Content JSON schema: `title`, `notes` (array of HTML strings, KaTeX math in `$...$`/`$$...$$`), optional `images`, `tables`, `summary`, `formulas`, `diagrams`, `examples`, `practice`, `keyPoints`.
- Codegen ID convention is `<subject>__<chapter>__<topic>` (`scripts/builder.js` splits on `__`).

## Environment

- Root `.env` points `VITE_API_URL` at a trycloudflare tunnel URL; for local dev override it to `http://localhost:5000`. `vite.config.js` allows `.trycloudflare.com` hosts — repo root ships `cloudflared-windows-amd64.exe` for tunnel sharing.
- `backend/.env` contains PORT, JWT_SECRET, SESSION_SECRET, MONGO_URI. `connectDB()` is enabled in `backend/server.js`; `/api/auth/*` routes are gated by `backend/middleware/connectDb.js` (returns 503 "Database unavailable" when Mongo can't be reached). `/api/auth/register` and `/api/auth/login` need a live MongoDB; everything else is file-based. `register`/`login` use the DB gate; `/api/auth/me` and `/api/auth/logout` don't.
- Session management: `express-session` configured in `backend/server.js` (cookie `connect.sid`, 7-day maxAge, httpOnly, `secret` from `SESSION_SECRET`). Login/register store `req.session.user`; `/api/auth/me` reads it, `/api/auth/logout` destroys it. JWT auth still available alongside sessions.
- Password hashing: `backend/utils/password.js` — Node `crypto` scrypt with a per-user random salt, stored as `scrypt:<salt>:<hash>`. No bcrypt dependency.
- Logging: winston (`backend/utils/logger.js`) + morgan HTTP logging in `server.js`; logs to console and `backend/logs/` (gitignored). Central error handling in `backend/middleware/errorHandler.js` (404 + 500 JSON responses, errors logged with stack).
- JWT middleware lives in `backend/auth/local.js` (verifies `Authorization` header with `JWT_SECRET`). `backend/config/db.js` only resolves once `readyState === 1` — mongoose v9's `connect()` resolves optimistically otherwise, so never trust it alone.
- Build is green at HEAD (`npm run build` passes); lint (`npm run lint`) is clean. There is no `npm run check` script.
- Encoding gotcha: several content JSONs contain mojibake (Windows-1252/UTF-8 mix, e.g. `�C` for °C). Preserve raw bytes when editing; re-saving as clean UTF-8 corrupts those characters.

## Conventions

- Backend: CommonJS (`require`/`module.exports`). Frontend: ESM imports.
- Routes are defined in `src/App.jsx`: `/`, `/subject/:subjectId`, `/subject/:subjectId/chapter/:chapterId`, `/subject/:subjectId/chapter/:chapterId/topic/:topicId`.
- Content renderers live in `src/renderers/` (NotesRenderer, FormulaRenderer, etc.); keep KaTeX `$` delimiters intact in notes HTML.
