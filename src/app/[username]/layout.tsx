import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  
  return {
    title: `@${username}`,
    description: `View ${username}'s verified Real Leaders profile. Connect with verified thought leaders and industry experts.`,
    openGraph: {
      title: `@${username} | Real Leaders`,
      description: `View ${username}'s verified Real Leaders profile.`,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `@${username} | Real Leaders`,
      description: `View ${username}'s verified Real Leaders profile.`,
    }
  };
}

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
