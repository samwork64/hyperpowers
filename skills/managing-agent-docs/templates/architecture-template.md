# Codebase Architecture Overview

> **Repository:** [PROJECT_NAME]  
> **Tech Stack:** [LANGUAGES, FRAMEWORKS, DATABASES]  
> **Last Verified Commit:** `[INITIAL_COMMIT_SHA]` ([YYYY-MM-DD])

---

## 1. Directory Map
* `src/api/` - Backend HTTP routes, controllers, and middleware.
* `src/services/` - Business logic, domain services, third-party integrations.
* `src/models/` - Data schemas, ORM models, migration definitions.
* `src/ui/` - Client components, views, and presentation styling.
* `tests/` - Unit, integration, and E2E test suites.

---

## 2. Core Entry Points & Bootstrapping
* **Main Server Entry**: `src/server.ts` (starts express/fastapi listener on port 3000)
* **Client Entry**: `src/index.tsx` (Vite / Next.js mount)
* **Database Client**: `src/db/client.ts` (connection pooling & credentials)

---

## 3. Essential Commands & Verification
* **Install**: `npm install` / `poetry install`
* **Run Local Dev**: `npm run dev`
* **Test Suite**: `npm test` / `pytest`
* **Build / Typecheck**: `npm run build` / `tsc --noEmit`
* **Linter**: `npm run lint`

---

## 4. Key Architectural Invariants
* Error propagation: All async route handlers wrap in standard `AppError` envelope.
* Database access: Never issue raw queries from route handlers; use service repository layer.
* Configuration: Read from `process.env` / `os.environ` via validated config schema only.
