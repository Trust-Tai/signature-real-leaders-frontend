import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Manage your Real Leaders profile. Update your information, customize your page, and control your privacy settings.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
