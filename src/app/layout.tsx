import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const SITE_URL = "https://ringa.live";
const SITE_NAME = "Ringa";
const TITLE = "Ringa — Your front desk, always on";
const DESCRIPTION =
  "AI receptionist for HVAC companies. Answers every call, books every job, dispatches your techs — in English, Spanish & Portuguese. 24/7.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Ringa",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Ringa", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "HVAC AI",
    "AI receptionist",
    "HVAC answering service",
    "HVAC booking software",
    "AI phone agent",
    "HVAC dispatch",
    "multilingual receptionist",
  ],
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["pt_BR", "es_MX"],
    // The opengraph-image.tsx file in this directory is picked up automatically.
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    // The twitter-image.tsx file in this directory is picked up automatically.
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
