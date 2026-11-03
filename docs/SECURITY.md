# SECURITY GUIDELINES — ConvertinAja

> Threat Model, Mitigations, and Validation Policies

---

## 1. Threat Model

| Threat | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Malicious Payload / Polyglot File** | RCE via engine vulnerability | Magic bytes inspection, parser sandboxing, container privileges dropping |
| **Decompression / ZIP Bomb** | Worker memory exhaustion (DoS) | Strict file size ceiling, max uncompressed limit, page limit (200 pages) |
| **Path Traversal (`../../etc/passwd`)** | Arbitrary file overwrite or disclosure | Completely discard user filenames. Generate internal UUIDs for all disk operations |
| **CLI Argument Injection** | Subprocess command hijacking | Pass arguments as slice tokens; never invoke shell strings (`sh -c`) |
| **Unauthorized File Download** | Data leak across anonymous users | High-entropy random `access_token` validated via constant-time hash comparison |
| **DDoS / Resource Starvation** | Server unresponsiveness | Nginx rate limiting, body size limits, max 3 concurrent active jobs per IP |

---

## 2. File Validation Pipeline

Every uploaded file must pass validation before writing to disk or dispatching to the queue:

1. **Size Boundary Check:** Reject before reading if `Content-Length > 10MB`.
2. **Magic Bytes Sniffing:** Read first 512 bytes:
   - PDF: must match `%PDF-` header.
   - Images: must match PNG (`\x89PNG\r\n\x1a\n`), JPEG (`\xff\xd8\xff`), or WebP (`RIFF....WEBP`).
   - Office: must match ZIP signature (`PK\x03\x04`) with inner OpenDocument/OOXML structure.
3. **Page Count Inspection:** For PDFs, quickly probe page count via Poppler `pdfinfo`. Reject if pages > 200.

---

## 3. Storage & Process Sandboxing

- **Directory Isolation:** Files exist exclusively in `/tmp/convertinaja/jobs/{job_id}/`.
- **Non-Root Execution:** Worker processes run as an unprivileged user inside Docker (`UID 10001`).
- **Immediate Failure Cleanup:** `defer os.RemoveAll(jobDir)` executes on any failure or cancellation signal.
- **Strict TTL Purge:** Source files are purged immediately. Converted files older than 10 minutes are purged by the background cleaner worker.
