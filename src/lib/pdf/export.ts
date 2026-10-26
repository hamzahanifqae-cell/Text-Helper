import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

const PAGE_WIDTH = 612; // US Letter, points
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const FONT_SIZE = 11;
const LINE_HEIGHT = FONT_SIZE * 1.45;

export class PdfUnsupportedCharactersError extends Error {
  constructor() {
    super(
      "This text contains characters the PDF export can't render (the built-in font only supports basic Latin text). Try exporting as .txt or .docx instead."
    );
    this.name = "PdfUnsupportedCharactersError";
  }
}

function wrapParagraph(paragraph: string, font: PDFFont, maxWidth: number): string[] {
  if (paragraph === "") return [""];
  const words = paragraph.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(trial, FONT_SIZE) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = trial;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Plain-text PDF export using a standard embedded font (WinAnsi encoding).
// This is intentionally simple - no rich formatting, headers, or footers -
// and only supports basic Latin-script text. Non-Latin scripts (CJK,
// Arabic, Cyrillic, etc.) and most emoji will fail; callers should catch
// PdfUnsupportedCharactersError and suggest .txt/.docx export instead.
export async function exportTextAsPdfBlob(text: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const maxWidth = PAGE_WIDTH - MARGIN * 2;

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  try {
    const paragraphs = text.length > 0 ? text.split("\n") : [""];
    for (const paragraph of paragraphs) {
      const lines = wrapParagraph(paragraph, font, maxWidth);
      for (const line of lines) {
        if (y < MARGIN) {
          page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
          y = PAGE_HEIGHT - MARGIN;
        }
        page.drawText(line, { x: MARGIN, y, size: FONT_SIZE, font, color: rgb(0.08, 0.08, 0.1) });
        y -= LINE_HEIGHT;
      }
    }
  } catch {
    throw new PdfUnsupportedCharactersError();
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
