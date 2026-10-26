import "@testing-library/jest-dom/vitest";

// jsdom's File/Blob implementation doesn't ship File.prototype.text() in
// every version we might run against; real browsers always have it. This
// polyfill keeps tests/unit/import.test.ts exercising the real import code
// path instead of a test-only branch.
if (typeof File !== "undefined" && typeof File.prototype.text !== "function") {
  File.prototype.text = function (this: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(this);
    });
  };
}
