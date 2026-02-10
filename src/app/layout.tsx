import type { Metadata, Viewport } from "next";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";
import Script from "next/script";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="gtm-script" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`}
          </Script>
        )}
        
        {/* Google Analytics 4 (GA4) */}
        {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}');
                console.log('[GA4] Initialized with ID: ${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
