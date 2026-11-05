import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/theme/theme-script";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { siteConfig, adsenseConfig, analyticsConfig } from "@/lib/config/site";

// AdSense's crawler reads the raw HTML. It does not run Next.js hydration.
// next/script strategy="afterInteractive" only emits a <link rel="preload">
// in that HTML and injects the real <script> after the page becomes
// interactive, so site verification never sees the snippet. A plain async
// script is what Google looks for between <head> and </head>.
const adsenseClientId =
  adsenseConfig.enabled && /^ca-pub-\d+$/.test(adsenseConfig.clientId)
    ? adsenseConfig.clientId
    : "";

const googleAnalyticsId = analyticsConfig.measurementId;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // Leave title and description unset here. An absolute value on the root
  // layout is reused on every page, so tool and article pages were all
  // sharing the homepage Open Graph title. Each page's own title and
  // description fill these in.
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
  },
  robots: { index: true, follow: true },
  ...(adsenseClientId
    ? { other: { "google-adsense-account": adsenseClientId } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#141c28" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        {adsenseClientId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
          />
        ) : null}
        {googleAnalyticsId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleAnalyticsId}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
