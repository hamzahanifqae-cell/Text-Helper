// Only trusts X-Forwarded-For / X-Real-IP when TRUST_PROXY_HEADERS=true,
// which you should only set once you've confirmed the actual deployment
// proxy (cPanel's Passenger/Apache front end) sets these headers itself and
// strips any client-supplied value - otherwise any visitor can spoof their
// apparent IP and bypass the per-IP abuse limit entirely.
export function getClientIp(request: Request): string {
  const trustProxy = process.env.TRUST_PROXY_HEADERS === "true";
  if (trustProxy) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
      const first = forwarded.split(",")[0]?.trim();
      if (first) return first;
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
  }
  return "unknown";
}
