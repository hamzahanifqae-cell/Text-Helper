export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadTextAsTxt(text: string, filename: string) {
  downloadBlob(new Blob([text], { type: "text/plain;charset=utf-8" }), filename);
}
