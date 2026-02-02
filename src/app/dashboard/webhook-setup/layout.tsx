import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Webhook Integration Setup - RealLeaders Dashboard',
  description: 'Connect your RealLeaders profile to external platforms with webhook integration. Automate workflows with Zapier, Zoho, Mailchimp, and HubSpot.',
  keywords: 'webhook, integration, zapier, zoho, mailchimp, hubspot, automation, crm, email marketing',
};

export default function WebhookSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}