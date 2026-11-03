# INFRASTRUCTURE AGENTS GUIDELINES — ConvertinAja

> Directives for AI coding agents working inside `infrastructure/`.

---

## 1. Scope & Responsibility
- Docker containerization, Docker Compose topologies, Nginx reverse proxy configurations, and system deployment scripts.
- Ensures binary dependencies (Poppler, Ghostscript, LibreOffice) are correctly provisioned in worker containers.

---

## 2. Directory Architecture

```
infrastructure/
├── docker/
│   ├── Dockerfile.api         # Lightweight Go API container
│   ├── Dockerfile.worker      # Go worker with Poppler, Ghostscript, LibreOffice
│   └── Dockerfile.frontend    # Multi-stage build for React SPA
├── nginx/
│   └── nginx.conf             # Reverse proxy, SSL, and rate limit rules
└── scripts/
    ├── dev.sh                 # Local dev launch helper
    └── cleanup.sh             # Emergency storage sweep script
```

---

## 3. Infrastructure Rules & Conventions

1. **Least Privilege:** API and worker containers must run as non-root users (`UID 10001`).
2. **Resource Constraints:** All workers must declare memory and CPU ceilings in compose files to prevent host starvation.
3. **Volume Isolation:** Use named shared volumes for `/tmp/convertinaja/jobs/` between API and Worker.
4. **Minimal Images:** Base Go containers on Alpine or Debian slim to keep images small while supporting CLI engine binaries.
