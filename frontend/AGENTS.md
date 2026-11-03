# FRONTEND AGENTS GUIDELINES — ConvertinAja

> Directives for AI coding agents working inside `frontend/`.

---

## 1. Scope & Responsibility
- Pure client-side Single Page Application (SPA) built with React 19, Vite, TypeScript, and Tailwind CSS.
- No business logic or server-side document parsing here. All file operations delegate to `/api/v1/` endpoints.

---

## 2. Directory Architecture

```
frontend/src/
├── assets/          # Static images, SVG icons
├── components/      # Reusable UI primitives (Button, Dropzone, Modal, ProgressBar)
├── features/        # Domain-specific components (e.g., pdf-tools, conversion-viewer)
├── hooks/           # Custom React hooks (useConversionJob, useDropzone)
├── layouts/         # Layout wrappers (Header, Footer, MainLayout)
├── pages/           # Route views (HomePage, ToolPage, StatusPage)
├── services/        # HTTP API client (`api.ts`, conversion endpoints)
├── types/           # TypeScript interfaces matching API schemas
├── App.tsx          # Router configuration
└── main.tsx         # Application root entry
```

---

## 3. Frontend Rules & Conventions

1. **TypeScript Strictness:** No `any`. Define explicit response types matching `docs/API_SPECIFICATION.md`.
2. **State Management:** Keep state local with hooks (`useState`, `useReducer`, or small context). Do not introduce Redux or heavy state stores.
3. **No Account State:** There is no login or auth context. Manage current job IDs and `access_token` in local state or browser `sessionStorage`.
4. **Styling:** Use Tailwind CSS utility classes. Avoid custom CSS files unless defining global design tokens in `index.css`.
5. **Code Quality:** Run Oxlint and Prettier before marking tasks complete:
   ```bash
   pnpm run lint
   ```
6. **Error Feedback:** Provide clear, actionable error toasts/messages if backend rejects invalid file types or oversized payloads.
