import type { Metadata, Viewport } from "next";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://verified.real-leaders.com'),
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
    url: "https://verified.real-leaders.com",
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
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
