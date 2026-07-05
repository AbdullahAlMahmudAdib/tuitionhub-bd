import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TuitionHub BD — Find Your Perfect Tutor",
  description: "Bangladesh's premium tuition marketplace connecting guardians with qualified tutors.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.ico" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "TuitionHub" },
};

export const viewport: Viewport = {
  themeColor: "oklch(0.45 0.14 170)",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
