# TECH STACK — ConvertinAja

> Pinned technologies, tool versions, and rationale.

---

## 1. Core Stack Matrix

| Tier | Technology | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 19.x | Modern concurrent rendering, fast client reactivity |
| **Build Tool** | Vite | 6.x | Fast HMR, optimized ESM bundling |
| **Language (Web)** | TypeScript | 5.x | Strict type safety for API contracts and UI states |
| **Styling** | Tailwind CSS | 4.x | Utility-first, zero-runtime CSS |
| **Frontend Linter** | Oxlint | latest | Blazing fast Rust-based linter |
| **Backend Language** | Go | 1.24+ | Low memory overhead, fast startup, robust standard library, excellent concurrency |
| **HTTP Router** | Chi | v5.x | Idiomatic, 100% compatible with `net/http`, lightweight |
| **Logging** | Zerolog | v1.33+ | Zero-allocation structured JSON logger |
| **Relational DB** | PostgreSQL | 16+ | ACID compliance for job tracking, audit logs, and status history |
| **Queue / Cache** | Redis | 7+ | Fast in-memory queue (`RPUSH`/`BLPOP`) and ephemeral state store |
| **Reverse Proxy** | Nginx | 1.25+ (Alpine) | SSL termination, upload buffer control, rate limit proxy |
| **Container** | Docker & Compose | v2+ | Reproducible environment across Windows dev and Linux prod |

---

## 2. Conversion Engines

| Engine | Primary Scope | Distribution / Package |
| :--- | :--- | :--- |
| **Poppler** | Merge, split, render to image, text extract | `poppler-utils` (Linux), `oschwartz10612/poppler-windows` (Windows) |
| **Ghostscript** | PDF compression | `ghostscript` CLI (`gs`) |
| **LibreOffice** | DOCX, XLSX, PPTX, ODT to PDF | LibreOffice headless CLI (`soffice --headless --convert-to pdf`) |
| **Go Native** | Image conversions (JPG, PNG, WebP) | Go standard `image` package + `golang.org/x/image` |

---

## 3. Toolchain & Development Rules

- **No Framework Swapping:** Do not replace Chi with Gin/Fiber, React with Vue/Svelte, or PostgreSQL with MongoDB.
- **Dependency Vetting:** Any newly proposed library must solve a problem not reasonably solvable with the standard library or currently installed dependencies.
