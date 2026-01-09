import type { Metadata, Viewport } from "next";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";
import GoogleTagManager, { GoogleTagManagerNoScript } from "@/components/GoogleTagManager";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://real-leaders.com'),
  title: {
    default: "Real Leaders - Build Your Leadership Brand",
    template: "%s | Real Leaders"
  },
  description: "Build your leadership brand, grow your influence, and amplify your impact with Real Leaders. Create your verified profile, share your expertise, and connect with other leaders.",
  keywords: ["leadership", "thought leadership", "professional profile", "verified leaders", "business networking", "executive profile"],
  authors: [{ name: "Real Leaders" }],
  creator: "Real Leaders",
  publisher: "Real Leaders",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://real-leaders.com",
    siteName: "Real Leaders",
    title: "Real Leaders - Build Your Leadership Brand",
    description: "Build your leadership brand, grow your influence, and amplify your impact with Real Leaders.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Real Leaders"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Leaders - Build Your Leadership Brand",
    description: "Build your leadership brand, grow your influence, and amplify your impact.",
    images: ["/twitter-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification-code",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="en">
      <head>
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
      </head>
      <body className="antialiased">
        {gtmId && <GoogleTagManagerNoScript gtmId={gtmId} />}
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
