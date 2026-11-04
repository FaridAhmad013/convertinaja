# ConvertinAja UI/UX Specification

Version: 1.0  
Status: Approved  
Design Direction: Clean SaaS  
Appearance: Light Mode

## 1. Product Design Direction

ConvertinAja menggunakan pendekatan desain Clean SaaS.

Tujuan desain:
- Memudahkan pengguna menemukan fitur konversi.
- Mempercepat proses upload dan konversi.
- Mengurangi langkah yang tidak diperlukan.
- Memberikan pengalaman konsisten pada desktop dan mobile.
- Menampilkan informasi secara jelas dan sederhana.

Prinsip utama:
1. Upload-first experience.
2. Simple and intuitive interaction.
3. Responsive by default.
4. Consistent components.
5. Privacy-focused experience.
6. Accessible interface.

## 2. Design System Reference

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary | #2563EB | Primary buttons, links, active states |
| Secondary | #0EA5E9 | Secondary actions and accents |
| Background | #F8FAFC | Main page background |
| Surface | #FFFFFF | Cards, panels, dialogs |
| Border | #E2E8F0 | Borders and dividers |
| Text Primary | #0F172A | Main text |
| Text Secondary | #64748B | Supporting text |
| Success | #16A34A | Successful operations |
| Warning | #F59E0B | Warnings |
| Error | #DC2626 | Errors |
| Info | #2563EB | Informational messages |

### Typography

Primary font: Inter.

| Element | Size | Weight |
|---|---:|---:|
| H1 | 40px | 700 |
| H2 | 32px | 700 |
| H3 | 24px | 600 |
| H4 | 20px | 600 |
| Body | 16px | 400 |
| Small | 14px | 400 |
| Caption | 12px | 400 |

### Component Styling

| Component | Specification |
|---|---|
| Button | 8px radius |
| Input | 8px radius |
| Card | 12px radius |
| Modal | 16px radius |
| Badge | Full radius |
| Border | 1px solid |
| Shadow | Subtle |
| Transition | 150–200ms |

## 3. Homepage Structure

Homepage terdiri dari enam bagian utama:
1. **Navbar** (Brand logo, PDF Tools, Image Tools, Office Tools; Mobile hamburger menu; no auth).
2. **Hero Section** (Headline: "All your document conversions in one place", description, privacy notice).
3. **Upload Section** (Upload-first drag & drop, file picker, multiple upload, validation, file cards with remove & status).
4. **Tools Section** (Inline compatibility filter when files are uploaded; explore catalog when empty).
5. **How It Works** (Upload -> Convert -> Download).
6. **Footer** (Product info, Privacy, Terms, Contact, Copyright).

## 4. Upload & Compatibility Rules

- Maximum file sizes: 10MB per file; Maximum 10 files per batch.
- When multiple files are uploaded: all valid files automatically selected.
- Inline tools filtered strictly by compatibility with all selected files.
- Batch download bundles outputs into ZIP if multiple; direct download if single.
- Zero-Storage Notice: immediate raw source file deletion and ephemeral processing displayed.

## 5. Interaction States & Acceptance Criteria

- Upload states: Empty, Dragging, Uploading, Validating, Valid, Invalid, Upload failed.
- Conversion states: Idle, Ready, Queued, Processing, Completed, Failed.
- Full keyboard accessibility, semantic HTML, ARIA attributes.
