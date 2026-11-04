# ARCHITECTURE — ConvertinAja

> System Architecture & Component Interaction Model

---

## 1. High-Level Architecture

ConvertinAja is a single-repository decoupled system:
- **Client Tier:** React 19 Single Page Application (SPA).
- **Edge Tier:** Nginx Reverse Proxy (TLS termination, body size limit, static caching).
- **Application Tier:** Go modular monolith providing REST APIs and background workers.
- **Data & Queue Tier:** PostgreSQL (relational metadata) and Redis (job queue & pub/sub status).
- **Engine Tier:** CLI binary tools (Poppler, Ghostscript, LibreOffice) executed inside isolated OS sandboxes.
- **Storage Tier:** Local volume filesystem (`/tmp/convertinaja/jobs/...`) with strict TTL cleanup.

```
                      ┌──────────────────────┐
                      │    Client Browser    │
                      └──────────┬───────────┘
                                 │ HTTPS
                                 ▼
                      ┌──────────────────────┐
                      │    Nginx (Proxy)     │
                      └─────┬──────────┬─────┘
           Static Assets    │          │ API Proxy (/api/v1/*)
                            ▼          ▼
             ┌────────────────┐     ┌────────────────────────┐
             │ Frontend (SPA) │     │     Go Backend API     │
             └────────────────┘     └─────┬────────────┬─────┘
                                          │            │
                           Metadata & Log │            │ Dispatch Job
                                          ▼            ▼
                                    ┌──────────┐ ┌──────────┐
                                    │PostgreSQL│ │  Redis   │
                                    └──────────┘ └─────┬────┘
                                                       │ Consume
                                                       ▼
                                            ┌──────────────────────┐
                                            │      Go Worker       │
                                            └──────────┬───────────┘
                                                       │
                           ┌───────────────────────────┴───────────────────────────┐
                           ▼                                                       ▼
             ┌───────────────────────────┐                           ┌───────────────────────────┐
             │    Conversion Engines     │                           │   Ephemeral Job Storage   │
             │(Poppler/GS/LibreOffice)   │                           │(/tmp/convertinaja/jobs/..)│
             └───────────────────────────┘                           └───────────────────────────┘
```

---

## 2. Component Boundaries & Responsibilities

### 2.1 Frontend (`frontend/`)
- Pure client-side application.
- Handles file selection, validation pre-flight (size, extension), and upload progress.
- Polls job status using short-lived tokens; triggers browser downloads.
- No business logic or file transformation occurs on the client.

### 2.2 Backend API (`backend/cmd/api`)
- Stateless HTTP server using Chi.
- Validates uploads: magic bytes verification, MIME checking, and payload size bounds.
- Generates `job_id` (UUIDv4) and cryptographically secure `access_token`.
- Persists initial job record in PostgreSQL and pushes conversion task to Redis queue.
- Serves status polling and streams converted file to client upon token verification.

### 2.3 Worker Service (`backend/internal/worker`)
- Asynchronous task consumer subscribed to Redis queue.
- Allocates isolated workspace directory per job: `/tmp/convertinaja/jobs/{job_id}/`.
- Invokes conversion engine adapters with timeout context and resource limits.
- Updates PostgreSQL job state (`pending` -> `processing` -> `completed` | `failed`).
- Cleans up workspace immediately upon failure.

### 2.4 Ephemeral Storage & Retention Worker
- Files live in directory `/tmp/convertinaja/jobs/{job_id}/`.
- A background ticker worker sweeps stale job directories as a safety net and prunes records. Source files are shredded immediately upon job completion or failure.
- After a successful user download, a short grace period (e.g., 5 minutes) triggers purge.

---

## 3. Communication Patterns

| Source | Target | Protocol | Description |
| :--- | :--- | :--- | :--- |
| Frontend | Nginx / Backend API | HTTP/2 (REST, JSON) | File upload (`multipart/form-data`), status polling (`GET`), download stream |
| Backend API | PostgreSQL | TCP (`pgx` driver) | Job metadata CRUD, audit logging |
| Backend API | Redis | TCP | `RPUSH` task payload to queue, status caching |
| Worker | Redis | TCP | `BLPOP` task consumer, heartbeat |
| Worker | Engines | OS CLI Subprocess | Executed via `os/exec.CommandContext` |
| Worker / API | Storage | POSIX Filesystem | Read, write, and purge job directories |
