# BACKEND AGENTS GUIDELINES — ConvertinAja

> Directives for AI coding agents working inside `backend/`.

---

## 1. Scope & Responsibility
- Go modular monolith serving REST APIs via Chi (`cmd/api`) and asynchronous background workers (`internal/worker`).
- Manages file validations, temporary disk storage, database transactions, queue dispatching, and CLI engine execution.

---

## 2. Directory Architecture

```
backend/
├── cmd/
│   └── api/                  # Main HTTP entry point (Chi server)
├── internal/
│   ├── config/               # Environment & configuration loading
│   ├── handler/              # Chi HTTP request handlers & routing
│   ├── middleware/           # CORS, rate limit, request logger, token validator
│   ├── service/              # Core business logic (job lifecycle, cleanup)
│   ├── converter/            # Engine interfaces and CLI wrappers (Poppler, GS)
│   ├── storage/              # Local disk storage abstractions
│   └── worker/               # Redis queue consumers & background tickers
├── pkg/                      # Shared reusable utilities
├── migrations/               # PostgreSQL schema migrations
└── go.mod
```

---

## 3. Backend Rules & Conventions

1. **Idiomatic Go:** Minimalist, clean standard library idioms. Return errors explicitly (`val, err := ...`).
2. **Logging:** Use `zerolog/log` with structured fields (`Str`, `Int`, `Err`). Never use standard `log.Print` or `fmt.Println`.
3. **Engine Isolation:** Do not call `os/exec` directly inside HTTP handlers. All subprocess commands belong in `internal/converter/` behind an interface.
4. **Security Enforcement:**
   - Always validate magic bytes before writing full file payloads to disk.
   - Sanitize filenames: generate random UUIDs for all temporary disk paths.
   - Always run subprocesses with `exec.CommandContext(ctx, ...)` having explicit deadlines.
5. **No File Binary in Database:** Never store uploaded or converted file binaries in PostgreSQL. Only store metadata.
6. **Testing:** Unit test validators, token generators, and CLI argument builders with `go test ./...`.
