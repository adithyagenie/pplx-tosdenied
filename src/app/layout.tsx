import type React from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PWAProvider } from "@/components/pwa-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TOS Summarizer - Terms of Service Didn't Read",
  description:
    "Analyze Terms of Service and Privacy Policies to understand what you're agreeing to",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TOS Summarizer",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TOS Summarizer",
    title: "TOS Summarizer - Terms of Service Didn't Read",
    description:
      "Analyze Terms of Service and Privacy Policies to understand what you're agreeing to",
  },
  twitter: {
    card: "summary",
    title: "TOS Summarizer - Terms of Service Didn't Read",
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        {children}
        <PWAProvider />
        <Toaster />
      </body>
    </html>
  );
}
