import type React from "react";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PWAProvider } from "@/components/pwa-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TOSDeclined",
  description:
    "Analyze Terms of Service and Privacy Policies to understand what you're agreeing to",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TOSDeclined",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TOSDeclined",
    title: "TOSDeclined",
    description:
      "Analyze Terms of Service and Privacy Policies to understand what you're agreeing to",
  },
  twitter: {
    card: "summary",
    title: "TOSDeclined",
    description:
      "Analyze Terms of Service and Privacy Policies to understand what you're agreeing to",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={poppins.className}>
        {children}
        <PWAProvider />
        <Toaster />
      </body>
    </html>
  );
}
