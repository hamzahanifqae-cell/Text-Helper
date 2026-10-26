import { describe, it, expect } from "vitest";
import { extractEmails, extractUrls, extractHashtags, extractNumbers, redactPII } from "@/lib/tools/extraction";

describe("extraction", () => {
  it("handles empty input", () => {
    expect(extractEmails("")).toEqual([]);
    expect(extractUrls("")).toEqual([]);
    expect(extractHashtags("")).toEqual([]);
    expect(extractNumbers("")).toEqual([]);
  });

  it("extracts unique emails", () => {
    const emails = extractEmails("Contact a@example.com or b@test.org, or a@example.com again.");
    expect(emails).toEqual(["a@example.com", "b@test.org"]);
  });

  it("extracts URLs including www-prefixed ones", () => {
    const urls = extractUrls("Visit https://example.com/page and www.other.com too.");
    expect(urls).toContain("https://example.com/page");
    expect(urls.some((u) => u.startsWith("www.other.com"))).toBe(true);
  });

  it("extracts hashtags", () => {
    expect(extractHashtags("Loving #sunshine and #Summer2024!")).toEqual(["#sunshine", "#Summer2024"]);
  });

  it("extracts numbers including decimals and negatives", () => {
    expect(extractNumbers("Values: 42, -7, 3.14, 1,000")).toEqual(["42", "-7", "3.14", "1,000"]);
  });

  it("redacts emails and phone-shaped numbers", () => {
    const result = redactPII("Email me at jane@example.com or call 555-123-4567.", {
      redactEmails: true,
      redactPhones: true,
    });
    expect(result.text).not.toContain("jane@example.com");
    expect(result.text).not.toContain("555-123-4567");
    expect(result.emailsRedacted).toBe(1);
    expect(result.phonesRedacted).toBe(1);
  });

  it("can selectively redact only emails", () => {
    const result = redactPII("jane@example.com and 555-123-4567", {
      redactEmails: true,
      redactPhones: false,
    });
    expect(result.text).toContain("555-123-4567");
    expect(result.text).not.toContain("jane@example.com");
  });
});
