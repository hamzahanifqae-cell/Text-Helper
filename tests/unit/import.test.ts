import { describe, it, expect } from "vitest";
import { importTxtFile, importAnyTextFile, ImportTooLargeError, UnsupportedFileTypeError } from "@/lib/docx/import";

function makeFile(name: string, content: string, type = "text/plain"): File {
  return new File([content], name, { type });
}

describe("import", () => {
  it("imports a plain .txt file", async () => {
    const file = makeFile("notes.txt", "hello world");
    expect(await importTxtFile(file)).toBe("hello world");
  });

  it("imports a .txt file via importAnyTextFile", async () => {
    const file = makeFile("notes.txt", "hello");
    expect(await importAnyTextFile(file)).toBe("hello");
  });

  it("rejects unsupported file types", async () => {
    const file = makeFile("image.png", "binary-ish content", "image/png");
    await expect(importAnyTextFile(file)).rejects.toThrow(UnsupportedFileTypeError);
  });

  it("rejects files over the size limit", async () => {
    const bigContent = "a".repeat(11 * 1024 * 1024);
    const file = makeFile("big.txt", bigContent);
    await expect(importTxtFile(file)).rejects.toThrow(ImportTooLargeError);
  });

  it("handles an empty file", async () => {
    const file = makeFile("empty.txt", "");
    expect(await importTxtFile(file)).toBe("");
  });
});
