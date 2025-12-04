import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Verification",
  description: "Complete your Real Leaders profile verification. Add your professional information, signature, and get verified as a thought leader.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ProfileVerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
