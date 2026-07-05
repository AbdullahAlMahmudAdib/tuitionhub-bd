import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TuitionHub BD — Find Your Perfect Tutor",
  description:
    "Bangladesh's premium tuition marketplace connecting guardians with qualified tutors.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TuitionHub",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-ivory font-body text-neutral-900 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
