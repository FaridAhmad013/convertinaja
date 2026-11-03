# INFRASTRUCTURE & DEPLOYMENT — ConvertinAja

> Docker Compose, Nginx, and Runtime Limits

---

## 1. Container Topology

The production setup uses 5 service containers:

1. **`nginx`**: Public reverse proxy, SSL termination, static SPA file serving, and `/api/v1/` proxying.
2. **`api`**: Go Chi HTTP server (validates requests, pushes tasks to Redis, coordinates downloads).
3. **`worker`**: Go background runner with Poppler, Ghostscript, and LibreOffice binaries installed.
4. **`postgres`**: Relational database for job lifecycle tracking.
5. **`redis`**: In-memory task queue and temporary worker state cache.

---

## 2. Shared Volume Mounts

- **Job Storage Volume (`job_data`):** Shared between `api` and `worker` at `/tmp/convertinaja/jobs/`.
  - API writes uploaded raw files into the volume.
  - Worker reads raw files, executes conversion, writes output files.
  - API streams output back to the client.
  - Retention worker cleans up expired directories.

---

## 3. Resource & Container Limits

Worker containers must specify explicit resource limits in `docker-compose.yml`:

```yaml
services:
  worker:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2048M
        reservations:
          cpus: '0.5'
          memory: 512M
    security_opt:
      - no-new-privileges:true
```

---

## 4. Nginx Configuration Rules

- `client_max_body_size 55M;` (accommodates 50MB file payload + multipart form overhead).
- Rate limiting: `limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;`.
- Upload endpoint limiting: `limit_req_zone $binary_remote_addr zone=upload_limit:10m rate=2r/s;`.
