# TESTING STRATEGY — ConvertinAja

> Test Levels, Test Fixtures, and Verification Standards

---

## 1. Testing Philosophy
- Fast, deterministic tests that run without external network access.
- Subprocess engines (Poppler/Ghostscript) are mocked in standard unit tests via interfaces.
- One integration test verifies full end-to-end execution against real CLI binaries in containerized CI.

---

## 2. Test Tiers

### 2.1 Backend Unit Tests
- **Validators:** Magic byte checks, file extension sanitization, options JSON parsing.
- **Token Generation:** Entropy and validation of anonymous access tokens.
- **Conversion Adapters:** Mock CLI execution to verify argument array generation.

Run command:
```bash
cd backend && go test -v -race ./...
```

### 2.2 Backend HTTP Integration Tests
- Verify `/health` response.
- Verify `POST /api/v1/conversions` with invalid MIME type returns `400 Bad Request`.
- Verify `GET /api/v1/conversions/{id}` with wrong token returns `401 Unauthorized`.

### 2.3 Frontend Tests & Quality Checks
- Oxlint for rapid syntax and correctness checks.
- Component rendering tests for upload drag-and-drop zone and progress states.

Run command:
```bash
cd frontend && pnpm run lint
```

---

## 3. Test Fixtures

Test fixtures reside in `backend/testdata/`:
- `sample.pdf` (valid 1-page PDF).
- `sample_multipage.pdf` (valid 5-page PDF).
- `sample.png` / `sample.jpg`.
- `corrupted.pdf` (invalid magic bytes).
- `oversized_dummy.bin` (simulated large file).
