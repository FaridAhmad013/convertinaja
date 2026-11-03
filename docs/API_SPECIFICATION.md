# API SPECIFICATION — ConvertinAja

> REST API Contracts for ConvertinAja (Version 1)

Base URL: `/api/v1`

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health status check | None |
| `POST` | `/api/v1/conversions` | Create conversion job & upload files | None |
| `GET` | `/api/v1/conversions/{id}` | Query job conversion status | Token (`X-Job-Token` or query param) |
| `GET` | `/api/v1/conversions/{id}/download` | Download completed converted file | Token (`X-Job-Token` or query param) |
| `DELETE`| `/api/v1/conversions/{id}` | Explicitly cancel job or purge files | Token (`X-Job-Token` or query param) |

---

## 2. Endpoint Details

### 2.1 Health Check
- **`GET /health`**
- **Response `200 OK`:**
  ```json
  {
    "status": "ok",
    "service": "convertinaja-api",
    "timestamp": "2025-01-01T00:00:00Z"
  }
  ```

---

### 2.2 Create Conversion Job
- **`POST /api/v1/conversions`**
- **Request Content-Type:** `multipart/form-data`
- **Fields:**
  - `action`: `merge` | `split` | `compress` | `pdf_to_jpg` | `pdf_to_png` | `pdf_to_txt` | `pdf_to_html` | `extract_images` (Phase 1 PDF actions)
  - `options`: JSON string (optional, e.g., compression level, page range `{"pages": "1-3,5"}`)
  - `files`: File payload(s) (1 to 10 files depending on action)

- **Response `202 Accepted`:**
  ```json
  {
    "job_id": "c4b3f81e-7f61-4c17-916c-e5ecb684c13a",
    "access_token": "a1f9e83b4c92e7d1",
    "status": "pending",
    "action": "merge",
    "created_at": "2025-01-01T00:00:00Z"
  }
  ```

- **Error Responses:**
  - `400 Bad Request`: Invalid action, missing files, unsupported MIME type.
  - `413 Payload Too Large`: File exceeds size limit (> 10MB).
  - `429 Too Many Requests`: Rate limit exceeded for client IP.

---

### 2.3 Get Job Status
- **`GET /api/v1/conversions/{id}?token={access_token}`**
- **Header Alternative:** `X-Job-Token: {access_token}`

- **Response `200 OK` (In Progress):**
  ```json
  {
    "job_id": "c4b3f81e-7f61-4c17-916c-e5ecb684c13a",
    "status": "processing",
    "action": "merge",
    "created_at": "2025-01-01T00:00:00Z"
  }
  ```

- **Response `200 OK` (Completed):**
  ```json
  {
    "job_id": "c4b3f81e-7f61-4c17-916c-e5ecb684c13a",
    "status": "completed",
    "action": "merge",
    "download_url": "/api/v1/conversions/c4b3f81e-7f61-4c17-916c-e5ecb684c13a/download?token=a1f9e83b4c92e7d1",
    "file_size": 245120,
    "completed_at": "2025-01-01T00:00:05Z",
    "expires_at": "2025-01-01T01:00:05Z"
  }
  ```

- **Response `200 OK` (Failed):**
  ```json
  {
    "job_id": "c4b3f81e-7f61-4c17-916c-e5ecb684c13a",
    "status": "failed",
    "error_message": "Document is password protected or corrupted.",
    "failed_at": "2025-01-01T00:00:03Z"
  }
  ```

- **Error Responses:**
  - `401 Unauthorized`: Token invalid or mismatch with `job_id`.
  - `404 Not Found`: Job does not exist or has expired.

---

### 2.4 Download Result
- **`GET /api/v1/conversions/{id}/download?token={access_token}`**
- **Response `200 OK`:**
  - Headers:
    - `Content-Disposition: attachment; filename="converted-document.pdf"`
    - `Content-Type: application/pdf` (or `application/zip` for multi-output)
  - Body: Binary stream of the converted artifact.

---

### 2.5 Cancel or Purge Job
- **`DELETE /api/v1/conversions/{id}?token={access_token}`**
- **Response `200 OK`:**
  ```json
  {
    "job_id": "c4b3f81e-7f61-4c17-916c-e5ecb684c13a",
    "status": "purged"
  }
  ```
