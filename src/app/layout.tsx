import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { CursorTrail } from "@/components/ui/CursorTrail";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://anushka-portfolio.vercel.app";
const description =
  "Anushka Pandit — Full Stack Developer (MERN, Next.js, TypeScript, Cloud, Real-Time Systems) based in Lucknow, India. Building scalable, production-grade web apps end to end.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anushka Pandit — Full Stack Developer",
    template: "%s · Anushka Pandit",
  },
  description,
  keywords: [
    "Anushka Pandit",
    "Full Stack Developer",
    "MERN",
    "Next.js",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "Lucknow",
  ],
  authors: [{ name: "Anushka Pandit" }],
  openGraph: {
    title: "Anushka Pandit — Full Stack Developer",
    description,
    url: siteUrl,
    siteName: "Anushka Pandit",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anushka Pandit — Full Stack Developer",
    description,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid a flash of the wrong color scheme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <CursorTrail />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
