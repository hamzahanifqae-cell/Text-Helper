const MAX_IMPORT_BYTES = 10 * 1024 * 1024; // 10 MB

export class ImportTooLargeError extends Error {
  constructor() {
    super(`File is larger than ${MAX_IMPORT_BYTES / (1024 * 1024)}MB.`);
    this.name = "ImportTooLargeError";
  }
}

export class UnsupportedFileTypeError extends Error {
  constructor(message = "Unsupported file type.") {
    super(message);
    this.name = "UnsupportedFileTypeError";
  }
}

export async function importTxtFile(file: File): Promise<string> {
  if (file.size > MAX_IMPORT_BYTES) throw new ImportTooLargeError();
  return file.text();
}

// Extracts plain text only - this does not execute macros, scripts, or any
// embedded content, and does not preserve formatting (consistent with
// TextHelper's tools operating on plain text).
export async function importDocxFile(file: File): Promise<string> {
  if (file.size > MAX_IMPORT_BYTES) throw new ImportTooLargeError();
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function importAnyTextFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".docx")) return importDocxFile(file);
  if (name.endsWith(".txt") || file.type.startsWith("text/") || file.type === "") {
    return importTxtFile(file);
  }
  throw new UnsupportedFileTypeError(
    "Only .txt and .docx files are supported. (Legacy .doc is not supported - re-save as .docx first.)"
  );
}
