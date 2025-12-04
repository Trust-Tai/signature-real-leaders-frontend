import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "View your Real Leaders analytics. Track page views, link clicks, followers, and engagement metrics.",
  robots: {
    index: false,
    follow: false
  }
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
