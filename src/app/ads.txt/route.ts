import { NextResponse } from "next/server";
import { adsenseConfig } from "@/lib/config/site";

export const runtime = "nodejs";

// Google checks ads.txt completely separately from the AdSense verification
// script/meta-tag - a missing or wrong ads.txt is a common cause of a site
// showing "Not found" in AdSense even after the account itself is verified.
// The file format wants the bare "pub-XXXX" id, NOT the "ca-pub-XXXX" form
// used in the <script>/data-ad-client attributes - stripping the prefix
// here means there is only one place (ADSENSE_CLIENT_ID) to keep correct.
const GOOGLE_CERTIFICATION_ID = "f08c47fec0942fa0";

export async function GET() {
  if (!adsenseConfig.clientId) {
    return new NextResponse("", { status: 404 });
  }
  const pubId = adsenseConfig.clientId.replace(/^ca-/, "");
  const body = `google.com, ${pubId}, DIRECT, ${GOOGLE_CERTIFICATION_ID}\n`;
  return new NextResponse(body, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
