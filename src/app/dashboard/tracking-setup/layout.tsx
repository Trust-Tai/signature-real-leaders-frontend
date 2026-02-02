import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tracking Setup Guide - Real Leaders',
  description: 'Step-by-step guide to get your Facebook Pixel, Google Analytics, and Google Ads tracking IDs',
};

export default function TrackingSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}