import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Real Leaders account password. Enter your email to receive password reset instructions.",
  robots: {
    index: false,
    follow: false
  }
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
