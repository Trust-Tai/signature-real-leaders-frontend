import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magic Publishing",
  description: "AI-powered content creation for thought leaders. Generate articles, social posts, books, and podcasts with Magic Publishing.",
  robots: {
    index: false,
    follow: false
  }
};

export default function MagicPublishingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
