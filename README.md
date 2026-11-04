# ConvertinAja

> **Fast, Free & Zero-Storage Web Document Conversion Platform.**  
> Convert PDF, Image, and Office files directly in your browser without accounts, tracking, or server data retention.

- **Official Website:** [https://convertinaja.faridahmad.dev](https://convertinaja.faridahmad.dev)  
- **Developer:** [Farid Ahmad](https://faridahmad.dev)

---

## Core Values

1. **Zero-Storage Policy:**  
   ConvertinAja never retains your documents. Raw uploaded files are destroyed immediately from the server upon conversion completion or failure. Converted outputs reside only in temporary memory and are deleted promptly once retrieved.
2. **No User Accounts:**  
   Zero registration, email collection, passwords, or user profiling. Anonymous sessions are secured using short-lived UUID v4 tokens.
3. **5-Minute Execution Ceiling:**  
   To prevent server resource starvation and ensure stable VPS operations, all conversions have a strict 5-minute timeout before automatic termination.
4. **300 DPI High Definition:**  
   PDF-to-image rendering defaults to 300 DPI print-grade clarity with 95% JPEG quality.
5. **Open Source & Transparent:**  
   The entire platform codebase is open source under the MIT License.

---

## Conversion Engines & Open-Source Attribution

ConvertinAja operates as an independent web orchestration layer and respects all upstream open-source software licenses:

- **[Poppler Utilities](https://poppler.freedesktop.org/)** (`pdftoppm`, `pdfunite`, `pdfseparate`, `pdftotext`, `pdfimages`) — GPLv2 / GPLv3 License. Executed as isolated CLI subprocesses without binary modification.
- **[Ghostscript](https://www.ghostscript.com/)** (`gs`) — Copyright Artifex Software, Inc. (AGPLv3 License). Used via CLI subprocess execution for PDF stream compression.
- **[LibreOffice Headless](https://www.libreoffice.org/)** (`soffice`) — MPL-2.0 / LGPLv3+ License. Utilized for Office document conversions (DOCX, XLSX, PPTX, ODT) to PDF.
- **[WebP Tools](https://chromium.googlesource.com/webm/libwebp)** (`cwebp`, `dwebp`) — Copyright Google LLC (BSD-3-Clause License). Used for WebP image encoding and decoding.

---

## Conversion Tools Catalog

- **PDF Tools:** Merge PDF, Split PDF, Compress PDF, PDF to JPG, PDF to PNG, PDF to Text, PDF to Markdown, PDF to HTML, Extract PDF Images.
- **Image Tools:** JPG to PNG, PNG to JPG, Image to WebP, WebP to JPG, WebP to PNG, Image to PDF.
- **Office Tools:** DOCX to PDF, XLSX to PDF, PPTX to PDF, ODT to PDF, TXT to PDF.

---

## License

ConvertinAja is licensed under the [MIT License](LICENSE).
