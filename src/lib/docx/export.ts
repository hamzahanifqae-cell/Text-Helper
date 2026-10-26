import { Document, Packer, Paragraph } from "docx";

// Plain-text export to .docx: one paragraph per line. This intentionally
// does not attempt to preserve rich formatting (bold, headings, tables) -
// TextHelper's tools work on plain text, so there is no formatting to
// round-trip. Documented as a limitation on the import/export UI.
export async function exportTextAsDocxBlob(text: string): Promise<Blob> {
  const lines = text.length > 0 ? text.split("\n") : [""];
  const doc = new Document({
    sections: [
      {
        children: lines.map((line) => new Paragraph({ text: line })),
      },
    ],
  });
  return Packer.toBlob(doc);
}
