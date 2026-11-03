# AGENTS.md — Root AI Agent Guidelines

> Universal instructions, architectural boundaries, and coding rules for AI coding agents operating on the ConvertinAja repository.

---

## 1. Project Identity

- **Product Name:** ConvertinAja
- **Tagline:** All your document conversions in one place.
- **Description:** Web-based document conversion platform allowing users to convert documents, images, and office files quickly, securely, and free of charge.
- **Access Model:** No account required. Zero registration, zero persistent user identity. Sessions and file retrieval operate exclusively via anonymous job tokens.
- **MVP Focus:** Phase 1 delivers robust, reliable **PDF Tools** before expanding to other formats.

---

## 2. Project Context & Scope

ConvertinAja is organized into prioritized development phases:

- **Phase 1 (Active Focus): PDF Tools**
  - Merge PDF, Split PDF, Compress PDF, PDF to JPG/PNG, PDF to TXT/HTML, Extract PDF Images.
- **Phase 2 (Next): Image Conversion**
  - JPG/PNG to PDF, JPG <-> PNG, Image <-> WebP.
- **Phase 3 (Later): Office Conversion**
  - DOCX/XLSX/PPTX/ODT to PDF via headless LibreOffice.

**Scope Guardrail:** Do not implement Phase 2 or Phase 3 features, unrequested format conversions, or unrelated abstractions unless explicitly instructed.

---

## 3. Repository Structure

This monorepo separates concerns by runtime boundary:

```
convertinaja/
├── AGENTS.md                 # Root instructions and cross-cutting rules (this file)
├── README.md                 # Repository onboarding and developer run guide
├── frontend/                 # React 19 + TypeScript + Vite + Tailwind CSS SPA
│   └── AGENTS.md             # Frontend-specific architecture and UI rules
├── backend/                  # Go modular monolith (Chi, Zerolog, Workers)
│   └── AGENTS.md             # Backend-specific architecture and Go rules
├── infrastructure/           # Docker, Compose, Nginx, and deployment configs
│   └── AGENTS.md             # Infra, reverse proxy, and container resource rules
└── docs/                     # Source of truth technical documentation
    ├── PRODUCT_OVERVIEW.md   # Product identity, scope, and user flows
    ├── ARCHITECTURE.md       # High-level architecture and system interactions
    ├── TECH_STACK.md         # Pinned technologies, tool versions, rationale
    ├── DECISIONS.md          # Architectural Decision Records (ADR)
    ├── API_SPECIFICATION.md  # REST API endpoints, contracts, error schemas
    ├── DATABASE_SCHEMA.md    # PostgreSQL schema, migrations, indexes
    ├── CONVERSION_ENGINE.md  # CLI engine wrappers (Poppler, Ghostscript, LibreOffice)
    ├── SECURITY.md           # File validation, sandboxing, path sanitation
    ├── INFRASTRUCTURE.md     # Container setup, networking, production limits
    ├── TESTING.md            # Testing strategy, suites, fixtures
    └── CURRENT_STATE.md      # Current implementation state and changelog
```

---

## 4. Pinned Technology Stack

Agents must adhere strictly to the established stack. Do not replace or introduce alternative frameworks or libraries without prior approval:

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Lucide React.
- **Frontend Quality:** Oxlint, Prettier.
- **Backend API:** Go (1.24+), Chi router (`github.com/go-chi/chi/v5`).
- **Backend Logging:** Zerolog (`github.com/rs/zerolog`).
- **Database:** PostgreSQL (metadata, job lifecycle tracking).
- **Job Queue & Coordination:** Redis (queue dispatch and worker coordination).
- **Storage:** Local filesystem / shared volume (raw uploads and processed outputs; **never** store file binary blobs in PostgreSQL).
- **Conversion Engines:**
  - **Poppler:** PDF rendering, merge, split, extraction.
  - **Ghostscript:** PDF compression.
  - **LibreOffice:** Office-to-PDF conversion (headless).
  - **Go Native / Standard Libraries:** Primary image operations.
- **Infra & Edge:** Docker, Docker Compose, Nginx (reverse proxy, TLS, body limits).

---

## 5. Architecture Principles

1. **Modular Monolith:** Backend logic is organized cleanly by domain in `backend/internal/` without premature microservice distribution.
2. **Clear Boundary Separation:** Frontend and backend interact exclusively via versioned HTTP REST APIs (`/api/v1/...`).
3. **Async Job Processing:** Conversions execute asynchronously through Redis job queues. The HTTP API initiates jobs and reports status via anonymous polling.
4. **Engine Abstraction:** Wrap all external binary calls (Poppler, Ghostscript, LibreOffice) behind Go interfaces to isolate subprocess execution, mocking, and OS-specific binary paths.
5. **Ephemeral Storage:** User files are temporary artifacts. Raw and output files are deleted immediately after download or upon TTL expiration (default 60 minutes).
6. **YAGNI & Simplicity:** Build only what is needed for the current step. Favor standard libraries over new external dependencies.

---

## 6. Coding Standards

- **Minimalist & Idiomatic:** Write idiomatic Go and modern TypeScript. Delete obsolete code instead of commenting it out.
- **Single Responsibility:** Functions and components must do one thing well. Avoid God-objects, mega-handlers, and sprawling React components.
- **Explicit Error Handling:** Never swallow errors. In Go, handle errors explicitly with Zerolog context. In TypeScript, use explicit typing and safe error boundaries.
- **No Unrequested Abstractions:** Do not create interfaces with only one implementation unless required for mocking external binaries or databases.
- **No Boilerplate Scaffolding:** Do not generate empty placeholder files or speculative utility functions "for future use".

---

## 7. Development Workflow

AI agents must follow this sequential loop:

1. **Read Guidelines:** Inspect `AGENTS.md` and relevant `docs/*.md` files before writing any code.
2. **Inspect Existing Code:** Check existing implementations, types, and configs before introducing additions.
3. **Identify Scope:** Implement only the changes requested by the user prompt.
4. **Apply Changes:** Make precise, targeted edits.
5. **Lint & Test:** Run applicable linters, builds, and unit checks.
6. **Update Documentation:** Update `CURRENT_STATE.md` and any affected technical specs (`API_SPECIFICATION.md`, `DECISIONS.md`, etc.).
7. **Report Clearly:** Terse, direct summary of changes, skipping pleasantries and filler.

---

## 8. Documentation Rules

- **Source of Truth:** Documentation in `docs/` defines system truth. Code must match documentation.
- **Keep in Sync:**
  - Architecture changes $\rightarrow$ update `docs/ARCHITECTURE.md` and `docs/DECISIONS.md`.
  - API changes $\rightarrow$ update `docs/API_SPECIFICATION.md`.
  - Database schema changes $\rightarrow$ update `docs/DATABASE_SCHEMA.md`.
  - Engine strategies $\rightarrow$ update `docs/CONVERSION_ENGINE.md`.
  - Progress tracking $\rightarrow$ update `docs/CURRENT_STATE.md`.
- **Reference Docs:** Do not duplicate full architectural specs inside code comments or commit messages; link to the relevant markdown document.

---

## 9. Security Guidelines

Handling untrusted user files requires strict enforcement of the following rules:

1. **Magic Bytes Validation:** Inspect file content headers via Go MIME sniffing (`http.DetectContentType` / custom magic byte checks). Never trust file extensions or client headers.
2. **Path Traversal Immunity:** Strip client filenames completely. Assign random UUIDs for all disk operations (`/tmp/convertinaja/jobs/{job_id}/{file_uuid}`).
3. **No Filesystem Path Exposure:** Never leak internal server paths, stack traces, or command strings to the client in HTTP responses.
4. **Anonymous Access Isolation:** Job status and download endpoints must validate `job_id` + short-lived `access_token`. Users cannot inspect or download other jobs.
5. **Worker Sandboxing:**
   - Subprocess commands are executed with strict timeout contexts (default 120s).
   - CPU and memory ceilings are enforced at the container / OS level.
   - Max file size limits: 50MB (PDF/Images), 30MB (Office).
   - Max PDF page limit: 200 pages.
   - Max files per batch job: 10 files.
6. **Automatic Cleanup on Failure:** If conversion fails or times out, all temporary files belonging to the job directory must be purged immediately.

---

## 10. Testing Requirements

- **Unit Tests:** Pure functions, validators, token generators, and data transformations must have unit tests.
- **CLI Wrapper Mocking:** Subprocess engine wrappers must be verifiable through interface mocks or self-contained dummy binaries.
- **API Integration Tests:** Critical endpoints (upload, status check, download authorization) require assert-based HTTP handler tests.
- **Security Validation Tests:** Tests must verify rejection of malformed files, oversized payloads, invalid tokens, and path traversal attempts.
- **No Fabricated Tests:** Agents must never invent or fake test passes. Run the tests and report real output.

---

## 11. AI Agent Rules & Operational Boundaries

1. **No Unilateral Architecture Changes:** Agents may NOT alter core architectural decisions (e.g., swapping Chi, PostgreSQL, Redis, Poppler, or changing the job token scheme) without explicit user consent. If an architectural change is proposed, present the trade-off and ask for approval first.
2. **Minimal Diff Wins:** Make the smallest possible change that fulfills the requirement. Do not reformat unrelated files or rewrite working logic.
3. **No Unnecessary Dependencies:** Check standard libraries and existing packages first before proposing new dependencies.
4. **Preserve User Language:** If the user communicates in Indonesian, respond in Indonesian. Keep code identifiers, file paths, commands, and errors in their exact form.
5. **Terse Communication:** State the thing, the action, the reason, then the next step. Avoid pleasantries, hedging, and filler.

---

## 12. Definition of Done (DoD)

A task or feature is complete only when:

1. Code compiles and runs without unhandled exceptions.
2. Lint checks pass (Oxlint / `go vet`).
3. Associated tests pass.
4. No regressions are introduced to existing endpoints or UI workflows.
5. Temporary debug files and console logs are removed.
6. Documentation is updated (notably `docs/CURRENT_STATE.md` and any modified spec).
