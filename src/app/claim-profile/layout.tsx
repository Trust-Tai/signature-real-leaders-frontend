import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Claim Profile - Real Leaders',
  description: 'Claim your profile on Real Leaders platform',
};

export default function ClaimProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}