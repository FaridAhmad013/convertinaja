# DECISIONS (ADR) — ConvertinAja

> Architectural Decision Records for ConvertinAja.

---

## ADR-001: Anonymous Session via Job Token (No User Accounts)
- **Status:** Accepted
- **Context:** ConvertinAja is designed for zero-friction document conversions. Forcing sign-ups drops conversion rates and requires user data protection compliance (GDPR/UU PDP).
- **Decision:** Every upload generates a pair: `job_id` (UUIDv4) and `access_token` (cryptographically random hex). Status checks and file downloads require this token.
- **Consequences:** No passwords or personal data stored. If the user closes the browser and loses the token, the file is automatically purged upon TTL expiration.

---

## ADR-002: Dedicated Engine Strategy (Poppler + Ghostscript + LibreOffice)
- **Status:** Accepted
- **Context:** No single open-source engine does everything reliably. Poppler is superior for splitting/merging and rendering to images, but lacks efficient PDF stream compression. LibreOffice is standard for Office formats.
- **Decision:**
  - Use Poppler for PDF merge, split, extraction, rendering.
  - Use Ghostscript specifically for PDF compression.
  - Use LibreOffice (headless) for Office-to-PDF conversion.
  - Use Go native packages for basic image manipulation.
- **Consequences:** Multiple binary dependencies must be installed in container environments; CLI adapters must be abstracted via Go interfaces.

---

## ADR-003: Redis Queue with Go Worker over In-Memory Channels
- **Status:** Accepted
- **Context:** CPU-intensive conversions can overwhelm an HTTP server if processed synchronously or using simple in-process goroutine channels.
- **Decision:** Decouple HTTP ingestion from conversion execution using Redis as the task queue. Workers run as distinct goroutines or separate worker processes pulling from Redis.
- **Consequences:** Redis is required as infrastructure dependency, enabling independent horizontal scaling of API and worker nodes.

---

## ADR-004: Ephemeral Filesystem Storage with 60-Minute TTL
- **Status:** Accepted
- **Context:** Uploaded files and conversion results must be stored temporarily. Storing binary files in PostgreSQL bloats the database and complicates backups.
- **Decision:** Store files in a shared filesystem volume under `/tmp/convertinaja/jobs/{job_id}/`. PostgreSQL holds only metadata (filename, size, status, timestamp). A cleanup worker purges files after 60 minutes or immediately upon failure.
- **Consequences:** Storage volume must be shared between API and Worker if deployed in separate containers.
