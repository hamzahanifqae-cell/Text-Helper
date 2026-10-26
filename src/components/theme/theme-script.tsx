// Inline, synchronous script injected before paint so the correct theme is
// applied on the very first frame - no flash of the wrong theme while React
// hydrates. Reads the same localStorage key the ThemeProvider writes to.
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("texthelper-theme");
    var theme = stored === "light" || stored === "dark" ? stored : null;
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {}
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
