'use client';

import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { navigateToProfileStep } from '@/lib/profileNavigation';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';

export default function WebhookSetupPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex bg-[#FFF9F9] overflow-hidden lg:h-screen" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar - Hidden on mobile, overlay on mobile when open */}
      <div className="hidden lg:block">
        <UserProfileSidebar
          sidebarOpen={false}
          setSidebarOpen={() => { }}
          currentPage="webhook-setup"
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 bg-white">
            <UserProfileSidebar
              sidebarOpen={true}
              setSidebarOpen={setMobileSidebarOpen}
              currentPage="webhook-setup"
            />
          </div>
        </div>
      )}

      {/* Right Side (Header + Main Content) */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Header - Fixed */}
        <header className="bg-[#FFF9F9] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-[#efc0c0] flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              
              <button
                onClick={() => {
                  // Navigate back to profile step 5 (Newsletter section)
                  navigateToProfileStep(5, router);
                }}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <h1 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">Webhook Integration Guide</h1>
            </div>

            <UserProfileDropdown />
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
            
            {/* Introduction */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#efc0c0]">
              <h2 className="text-xl sm:text-2xl font-outfit font-bold text-[#333333] mb-4">
                How to Get Your Webhook URLs
              </h2>
              <p className="text-gray-600 mb-4 font-outfit">
                Follow these step-by-step guides to obtain your webhook URLs for Zapier, 
                Zoho, Mailchimp, and HubSpot. These URLs will automatically receive your 
                profile events for automation and analytics.
              </p>
            </div>

            {/* Zapier Webhook URL */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#efc0c0]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
                  Zapier Webhook URL
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[#CF3232] pl-4">
                  <h4 className="font-semibold text-[#333333] mb-2 font-outfit">Step-by-Step Process:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 font-outfit">
                    <li>Go to <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="text-[#CF3232] hover:underline font-medium">Zapier.com</a></li>
                    <li>Sign in to your Zapier account</li>
                    <li>Click &quot;Create Zap&quot; button</li>
                    <li>Choose &quot;Webhooks by Zapier&quot; as your trigger app</li>
                    <li>Select &quot;Catch Hook&quot; as the trigger event</li>
                    <li>Click &quot;Continue&quot; and copy your webhook URL</li>
                    <li>Paste this URL in your RealLeaders webhook settings</li>
                    <li>Test the webhook by visiting your profile</li>
                  </ol>
                </div>
                
                <div className="bg-[#FFF9F9] border border-[#efc0c0] p-4 rounded-lg">
                  <p className="text-sm text-[#333333] font-outfit mb-2">
                    <strong>Example URL:</strong>
                  </p>
                  <div className="bg-gray-100 p-2 rounded border font-mono text-sm break-all text-black">
                    https://hooks.zapier.com/hooks/catch/123456/abcdef/
                  </div>
                  <button
                    onClick={() => copyToClipboard('https://hooks.zapier.com/hooks/catch/123456/abcdef/')}
                    className="mt-2 text-xs text-[#CF3232] hover:underline"
                  >
                    Copy Example URL
                  </button>
                </div>
              </div>
            </div>

            {/* Zoho Webhook URL */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#efc0c0]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
                  Zoho Webhook URL
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[#CF3232] pl-4">
                  <h4 className="font-semibold text-[#333333] mb-2 font-outfit">Step-by-Step Process:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 font-outfit">
                    <li>Go to <a href="https://www.zoho.com/crm" target="_blank" rel="noopener noreferrer" className="text-[#CF3232] hover:underline font-medium">Zoho CRM</a></li>
                    <li>Sign in to your Zoho account</li>
                    <li>Go to Setup → Developer Space → Webhooks</li>
                    <li>Click &quot;Create Webhook&quot;</li>
                    <li>Enter webhook name and description</li>
                    <li>Set the webhook URL (provided by Zoho)</li>
                    <li>Configure authentication and events</li>
                    <li>Copy the generated webhook URL</li>
                  </ol>
                </div>
                
                <div className="bg-[#FFF9F9] border border-[#efc0c0] p-4 rounded-lg">
                  <p className="text-sm text-[#333333] font-outfit mb-2">
                    <strong>Example URL:</strong>
                  </p>
                  <div className="bg-gray-100 p-2 rounded border font-mono text-sm break-all text-black">
                    https://www.zohoapis.com/crm/v2/functions/webhook_handler/actions/execute
                  </div>
                  <p className="text-xs text-gray-500 font-outfit mt-2">
                    <strong>Note:</strong> You&apos;ll also need your Zoho API key for authentication
                  </p>
                </div>
              </div>
            </div>

            {/* Mailchimp Webhook URL */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#efc0c0]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
                  Mailchimp Webhook URL
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[#CF3232] pl-4">
                  <h4 className="font-semibold text-[#333333] mb-2 font-outfit">Step-by-Step Process:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 font-outfit">
                    <li>Go to <a href="https://mailchimp.com" target="_blank" rel="noopener noreferrer" className="text-[#CF3232] hover:underline font-medium">Mailchimp.com</a></li>
                    <li>Sign in to your Mailchimp account</li>
                    <li>Go to Audience → Settings → Webhooks</li>
                    <li>Click &quot;Create New Webhook&quot;</li>
                    <li>Enter the callback URL (use RealLeaders webhook endpoint)</li>
                    <li>Select events you want to track</li>
                    <li>Save the webhook configuration</li>
                    <li>Copy your API key from Account → Extras → API keys</li>
                  </ol>
                </div>
                
                <div className="bg-[#FFF9F9] border border-[#efc0c0] p-4 rounded-lg">
                  <p className="text-sm text-[#333333] font-outfit mb-2">
                    <strong>Webhook URL to use:</strong>
                  </p>
                  <div className="bg-gray-100 p-2 rounded border font-mono text-sm break-all text-black">
                    https://api.realleaders.com/webhook/mailchimp
                  </div>
                  <button
                    onClick={() => copyToClipboard('https://api.realleaders.com/webhook/mailchimp')}
                    className="mt-2 text-xs text-[#CF3232] hover:underline"
                  >
                    Copy Webhook URL
                  </button>
                  <p className="text-xs text-gray-500 font-outfit mt-2">
                    <strong>Required:</strong> API Key and List ID
                  </p>
                </div>
              </div>
            </div>

            {/* HubSpot Webhook URL */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#efc0c0]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
                  4
                </div>
                <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
                  HubSpot Webhook URL
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[#CF3232] pl-4">
                  <h4 className="font-semibold text-[#333333] mb-2 font-outfit">Step-by-Step Process:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 font-outfit">
                    <li>Go to <a href="https://app.hubspot.com" target="_blank" rel="noopener noreferrer" className="text-[#CF3232] hover:underline font-medium">HubSpot</a></li>
                    <li>Sign in to your HubSpot account</li>
                    <li>Go to Settings → Integrations → Webhooks</li>
                    <li>Click &quot;Create webhook&quot;</li>
                    <li>Enter the webhook URL (use RealLeaders endpoint)</li>
                    <li>Select the events you want to subscribe to</li>
                    <li>Save the webhook</li>
                    <li>Get your Portal ID from Account Setup → Account Defaults</li>
                  </ol>
                </div>
                
                <div className="bg-[#FFF9F9] border border-[#efc0c0] p-4 rounded-lg">
                  <p className="text-sm text-[#333333] font-outfit mb-2">
                    <strong>Webhook URL to use:</strong>
                  </p>
                  <div className="bg-gray-100 p-2 rounded border font-mono text-sm break-all text-black">
                    https://api.realleaders.com/webhook/hubspot
                  </div>
                  <button
                    onClick={() => copyToClipboard('https://api.realleaders.com/webhook/hubspot')}
                    className="mt-2 text-xs text-[#CF3232] hover:underline"
                  >
                    Copy Webhook URL
                  </button>
                  <p className="text-xs text-gray-500 font-outfit mt-2">
                    <strong>Required:</strong> API Key and Portal ID
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-outfit font-semibold text-green-800 mb-3">🎯 Benefits of Webhook Integration:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Automatic Lead Capture</h4>
                      <p className="text-sm text-green-700 font-outfit">Profile visitors automatically added to your CRM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Email Marketing Automation</h4>
                      <p className="text-sm text-green-700 font-outfit">Auto-subscribe visitors to your email lists</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Workflow Automation</h4>
                      <p className="text-sm text-green-700 font-outfit">Trigger complex workflows in Zapier with 5000+ apps</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Real-time Notifications</h4>
                      <p className="text-sm text-green-700 font-outfit">Get instant alerts when someone views your profile</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Advanced Analytics</h4>
                      <p className="text-sm text-green-700 font-outfit">Track engagement across all your marketing tools</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Custom Integrations</h4>
                      <p className="text-sm text-green-700 font-outfit">Connect to any platform that supports webhooks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <h3 className="text-lg font-outfit font-semibold text-[#333333] mb-3">Quick Reference:</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-[#efc0c0]">
                  <h4 className="font-semibold text-[#CF3232] font-outfit">Zapier</h4>
                  <p className="text-sm text-gray-600 font-outfit">Self-generated URL</p>
                  <p className="text-xs text-gray-500 font-outfit">Found in: Zap setup</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#efc0c0]">
                  <h4 className="font-semibold text-[#CF3232] font-outfit">Zoho</h4>
                  <p className="text-sm text-gray-600 font-outfit">API endpoint + Auth</p>
                  <p className="text-xs text-gray-500 font-outfit">Found in: Developer Space</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#efc0c0]">
                  <h4 className="font-semibold text-[#CF3232] font-outfit">Mailchimp</h4>
                  <p className="text-sm text-gray-600 font-outfit">Use our endpoint</p>
                  <p className="text-xs text-gray-500 font-outfit">Need: API Key + List ID</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#efc0c0]">
                  <h4 className="font-semibold text-[#CF3232] font-outfit">HubSpot</h4>
                  <p className="text-sm text-gray-600 font-outfit">Use our endpoint</p>
                  <p className="text-xs text-gray-500 font-outfit">Need: API Key + Portal ID</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}