# CURRENT STATE — ConvertinAja

> Operational State & Roadmap Status

---

## 1. Project Phase

- **Active Phase:** Foundation & Architecture Specification (Phase 0).
- **Next Phase:** Phase 1 — PDF Tools Implementation (Backend HTTP + Poppler/Ghostscript engine + Frontend UI).

---

## 2. Component Progress

| Component | Status | Notes |
| :--- | :--- | :--- |
| **Documentation & Rules** | Complete | Root & sub-level `AGENTS.md` and complete `docs/*.md` suite established. |
| **Backend Scaffold** | Initialized | Chi router, Zerolog, `.env`, basic `/health` check functional. |
| **Frontend Scaffold** | Initialized | Vite + React 19 + TypeScript + Tailwind CSS initialized. |
| **Frontend UI/UX** | Implemented | Clean SaaS Light Mode homepage implemented according to UI/UX specification (Navbar, Hero, UploadZone, FileList, InlineToolSelector, ConversionStatus, ToolsCatalog, HowItWorks, Footer). Oxlint & build pass. |
| **Conversion Engines** | Pending | Poppler & Ghostscript wrapper adapters to be implemented in `backend/internal/converter/`. |
| **Database & Queue** | Pending | PostgreSQL migration schemas and Redis queue dispatcher to be implemented. |
| **Infrastructure** | Pending | `docker-compose.yml` and Nginx reverse proxy configuration to be implemented. |

---

## 3. Immediate Next Steps

1. Implement `frontend/AGENTS.md`, `backend/AGENTS.md`, `infrastructure/AGENTS.md`.
2. Implement root `README.md`.
3. Build backend conversion engine abstractions and validators.
