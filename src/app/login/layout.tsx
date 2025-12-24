import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Real Leaders account. Access your verified profile, manage your leadership brand, and connect with other verified leaders.",
  keywords: ["login", "sign in", "real leaders login", "verified profile access"],
  openGraph: {
    title: "Login | Real Leaders",
    description: "Sign in to your Real Leaders account to access your verified profile and leadership tools.",
    type: "website",
    url: "https://real-leaders.com/login",
  },
  twitter: {
    card: "summary",
    title: "Login | Real Leaders",
    description: "Sign in to your Real Leaders account.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://real-leaders.com/login",
  }
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="login-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Login",
            "description": "Sign in to your Real Leaders account",
            "url": "https://real-leaders.com/login"
          })
        }}
      />
      {children}
    </>
  );
}
