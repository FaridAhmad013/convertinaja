# CONVERSION ENGINE STRATEGY — ConvertinAja

> Subprocess Execution, Tool Arguments, and Isolation

---

## 1. Engine Assignment Strategy

| Tool | Action | Command Pattern | Output Format |
| :--- | :--- | :--- | :--- |
| **Poppler** (`pdfunite`) | Merge PDF | `pdfunite in1.pdf in2.pdf out.pdf` | `.pdf` |
| **Poppler** (`pdfseparate`) | Split PDF | `pdfseparate -f {start} -l {end} in.pdf out-%d.pdf` | Multiple `.pdf` |
| **Poppler** (`pdftoppm`) | PDF to JPG / PNG | `pdftoppm -jpeg -r 150 in.pdf page` | Multiple `.jpg`/`.png` |
| **Poppler** (`pdftotext`) | PDF to TXT | `pdftotext in.pdf out.txt` | `.txt` |
| **Poppler** (`pdftohtml`) | PDF to HTML | `pdftohtml -noframes in.pdf out.html` | `.html` |
| **Poppler** (`pdfimages`) | Extract Images | `pdfimages -png in.pdf img` | Multiple `.png` |
| **Ghostscript** (`gs`) | Compress PDF | `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=out.pdf in.pdf` | `.pdf` |
| **LibreOffice** (`soffice`) | Office to PDF | `soffice --headless --convert-to pdf in.docx --outdir {outdir}` | `.pdf` |

---

## 2. Go Interface Abstraction

All external engine calls are wrapped behind the `Engine` interface in `backend/internal/converter/`:

```go
type ConversionJobRequest struct {
    JobID      string
    Action     string
    InputPaths []string
    OutputDir  string
    Options    map[string]interface{}
}

type Engine interface {
    Execute(ctx context.Context, req ConversionJobRequest) ([]string, error)
}
```

This prevents direct `os/exec` leaks in HTTP handlers and allows test mocking without requiring Poppler or Ghostscript installed on testing machines.

---

## 3. Subprocess Safety Rules

1. **Context-Driven Timeouts:** Every CLI call is executed with `exec.CommandContext(ctx, ...)` where `ctx` has a strict deadline (default 120s).
2. **Never Pass Raw User Input to Shell:** Never invoke a shell (`sh -c` or `cmd.exe /C`). Always pass arguments as discrete string slice tokens to `exec.CommandContext`.
3. **Dedicated Working Directory:** Subprocesses operate inside the job's temporary directory (`req.OutputDir`) as the command's `Dir`.
4. **Stderr Capture:** Standard error output is captured and logged into Zerolog, while returning sanitized user-safe error messages to the frontend.
