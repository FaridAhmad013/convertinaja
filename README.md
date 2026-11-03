# ConvertinAja

> All your document conversions in one place.

ConvertinAja is an open-source, web-based document conversion platform. Convert documents, images, and office files without user accounts or login friction.

---

## Architecture Overview

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS (`frontend/`)
- **Backend:** Go 1.24+ + Chi router + Zerolog (`backend/`)
- **Queue & Database:** Redis & PostgreSQL
- **Conversion Engines:** Poppler, Ghostscript, LibreOffice (headless)
- **Edge:** Nginx Reverse Proxy (`infrastructure/`)

---

## Documentation Quick Links

AI agents and contributors must refer to the documentation suite in `docs/`:

- [Product Overview](docs/PRODUCT_OVERVIEW.md) — Scope, principles, and conversion matrix.
- [AI Agent Rules](AGENTS.md) — Universal coding rules and boundaries for AI coding agents.
- [Architecture](docs/ARCHITECTURE.md) — High-level design and component communication.
- [Technology Stack](docs/TECH_STACK.md) — Tool versions and selection rationale.
- [Technical Decisions (ADR)](docs/DECISIONS.md) — Architectural decision records.
- [API Specification](docs/API_SPECIFICATION.md) — REST API endpoints and contracts.
- [Database Schema](docs/DATABASE_SCHEMA.md) — PostgreSQL table definitions.
- [Conversion Engine Strategy](docs/CONVERSION_ENGINE.md) — Engine CLI wrappers and sandboxing.
- [Security Guidelines](docs/SECURITY.md) — File validation and threat mitigations.
- [Infrastructure](docs/INFRASTRUCTURE.md) — Docker and deployment architecture.
- [Testing Strategy](docs/TESTING.md) — Unit and integration test requirements.
- [Current State](docs/CURRENT_STATE.md) — Project status and active phase.

---

## Directory Guidelines for AI Agents

- [Frontend Agent Guide](frontend/AGENTS.md)
- [Backend Agent Guide](backend/AGENTS.md)
- [Infrastructure Agent Guide](infrastructure/AGENTS.md)
