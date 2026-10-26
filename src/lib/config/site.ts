export const siteConfig = {
  name: "TextHelper",
  tagline: "Your everyday text toolkit.",
  url: process.env.SITE_URL ?? "https://texthelper.online",
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
