export const siteConfig = {
  name: "TextHelper",
  tagline: "Your everyday text toolkit.",
  url: process.env.SITE_URL ?? "https://texthelper.online",
  publisherName: "Hamza Hanif",
  contactEmail: "hamzahanifadsense@gmail.com",
  description:
    "TextHelper is a free toolkit for everyday text work: word and character counters, grammar and spelling checks, text cleanup, case conversion, and AI-assisted writing, rewriting, and summarizing tools.",
};

export const operatorConfig = {
  name: process.env.OPERATOR_NAME || "",
  contactEmail: process.env.OPERATOR_CONTACT_EMAIL || "",
  address: process.env.OPERATOR_ADDRESS || "",
};

export function isOperatorConfigured(): boolean {
  return Boolean(operatorConfig.name && operatorConfig.contactEmail);
}

export const adsenseConfig = {
  enabled: process.env.ADSENSE_ENABLED === "true",
  clientId: process.env.ADSENSE_CLIENT_ID || "",
};

// GA4 measurement IDs are public (they ship in the page), but a bad value
// must not be interpolated into a script. Set this at build time: these
// pages are prerendered, so a cPanel-only value never reaches the HTML.
const gaMeasurementId = process.env.GA_MEASUREMENT_ID?.trim() ?? "";

export const analyticsConfig = {
  measurementId: /^G-[A-Z0-9]+$/.test(gaMeasurementId) ? gaMeasurementId : "",
};
