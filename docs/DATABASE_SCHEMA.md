# DATABASE SCHEMA — ConvertinAja

> PostgreSQL Relational Schema for Metadata and Audit Lifecycle

---

## 1. Principles
- **No Binary Blobs:** Never store raw or converted files in PostgreSQL. Only file metadata (name, size, MIME type, relative storage path) is persisted.
- **Anonymous Session:** No `users` table. The `conversion_jobs` table uses an anonymized hash of the client IP and an unguessable `access_token_hash`.
- **Automatic TTL Indexing:** Records are indexed by `created_at` and `expires_at` for high-throughput cleanup operations.

---

## 2. Table Definitions

### 2.1 `conversion_jobs`

Tracks lifecycle of each conversion request.

```sql
CREATE TYPE job_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'expired'
);

CREATE TABLE conversion_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    access_token_hash VARCHAR(64) NOT NULL, -- SHA-256 of access_token
    action VARCHAR(50) NOT NULL,            -- e.g., 'merge', 'compress', 'split'
    status job_status NOT NULL DEFAULT 'pending',
    client_ip_hash VARCHAR(64) NOT NULL,    -- Anonymized hash for rate limiting
    options JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '60 minutes')
);

CREATE INDEX idx_jobs_status_expires ON conversion_jobs (status, expires_at);
CREATE INDEX idx_jobs_token_hash ON conversion_jobs (access_token_hash);
```

### 2.2 `job_files`

Tracks files associated with a conversion job (raw uploaded inputs and processed outputs).

```sql
CREATE TYPE file_kind AS ENUM ('input', 'output');

CREATE TABLE job_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES conversion_jobs(id) ON DELETE CASCADE,
    kind file_kind NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL, -- UUID-based disk filename
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    page_count INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_files_job_id ON job_files (job_id);
```

---

## 3. Retention & Cleanup Query

The retention worker queries expired records on an interval:

```sql
SELECT id FROM conversion_jobs
WHERE expires_at < NOW() AND status != 'expired'
LIMIT 100;
```

Upon removing the job directory `/tmp/convertinaja/jobs/{id}/`, the worker marks status as `expired` or deletes the job record cascade.
