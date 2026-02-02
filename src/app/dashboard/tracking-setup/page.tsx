'use client';

import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { navigateToProfileStep } from '@/lib/profileNavigation';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';

export default function TrackingSetupPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-[#FFF9F9] overflow-hidden lg:h-screen" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar - Hidden on mobile, overlay on mobile when open */}
      <div className="hidden lg:block">
        <UserProfileSidebar
          sidebarOpen={false}
          setSidebarOpen={() => { }}
          currentPage="tracking-setup"
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
              currentPage="tracking-setup"
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
                  // Navigate back to profile step 6 (Metrics & Tracking section)
                  navigateToProfileStep(6, router);
                }}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <h1 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">Tracking Setup Guide</h1>
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
                How to Get Your Tracking IDs
              </h2>
              <p className="text-gray-600 mb-4 font-outfit">
                Follow these step-by-step guides to obtain your tracking IDs for Facebook Ads, 
                Google Analytics, and Google Ads. These IDs are essential for tracking your 
                marketing performance and analytics.
              </p>
            </div>

            {/* Google Analytics ID */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#efc0c0]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
                  1
                </div>
                <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
                  Google Analytics ID (G-XXXXXXXXXX)
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[#CF3232] pl-4">
                  <h4 className="font-semibold text-[#333333] mb-2 font-outfit">Step-by-Step Process:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 font-outfit">
                    <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-[#CF3232] hover:underline font-medium">Google Analytics</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click &quot;Start measuring&quot; if you&apos;re new, or select your existing property</li>
                    <li>Create a new property or select existing one</li>
                    <li>Go to &quot;Admin&quot; (gear icon) in the bottom left</li>
                    <li>Under &quot;Property&quot; column, click &quot;Data Streams&quot;</li>
                    <li>Select your web data stream or create a new one</li>
                    <li>Your Measurement ID will be displayed (starts with G-)</li>
                  </ol>
                </div>
                
                <div className="bg-[#FFF9F9] border border-[#efc0c0] p-4 rounded-lg">
                  <p className="text-sm text-[#333333] font-outfit">
                    <strong>Example:</strong> G-ABCD123456<br/>
                    <strong>Location:</strong> Admin → Property → Data Streams → Web Stream
                  </p>
                </div>
              </div>
            </div>

            {/* Google Ads ID */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#efc0c0]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
                  2
                </div>
                <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
                  Google Ads Conversion ID (AW-XXXXXXXXX)
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[#CF3232] pl-4">
                  <h4 className="font-semibold text-[#333333] mb-2 font-outfit">Step-by-Step Process:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 font-outfit">
                    <li>Go to <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="text-[#CF3232] hover:underline font-medium">Google Ads</a></li>
                    <li>Sign in to your Google Ads account</li>
                    <li>Click on &quot;Tools &amp; Settings&quot; (wrench icon) in the top menu</li>
                    <li>Under &quot;Measurement&quot;, click &quot;Conversions&quot;</li>
                    <li>Click the &quot;+&quot; button to create a new conversion action</li>
                    <li>Select &quot;Website&quot; as the conversion source</li>
                    <li>Fill in the conversion details and click &quot;Create and continue&quot;</li>
                    <li>Choose &quot;Install the tag yourself&quot; option</li>
                    <li>Your Conversion ID will be shown (starts with AW-)</li>
                  </ol>
                </div>
                
                <div className="bg-[#FFF9F9] border border-[#efc0c0] p-4 rounded-lg">
                  <p className="text-sm text-[#333333] font-outfit">
                    <strong>Example:</strong> AW-123456789<br/>
                    <strong>Location:</strong> Tools & Settings → Conversions → Create Conversion → Install Tag
                  </p>
                </div>
              </div>
            </div>

            {/* Facebook Pixel ID */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#efc0c0]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
                  3
                </div>
                <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
                  Facebook Pixel ID
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-[#CF3232] pl-4">
                  <h4 className="font-semibold text-[#333333] mb-2 font-outfit">Step-by-Step Process:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 font-outfit">
                    <li>Go to <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#CF3232] hover:underline font-medium">Facebook Business Manager</a></li>
                    <li>Sign in to your Facebook Business account</li>
                    <li>Click on &quot;All Tools&quot; in the left menu</li>
                    <li>Under &quot;Measure &amp; Report&quot;, click &quot;Events Manager&quot;</li>
                    <li>Select your pixel or click &quot;Create Pixel&quot; if you don&apos;t have one</li>
                    <li>Click on your pixel name</li>
                    <li>Go to &quot;Settings&quot; tab</li>
                    <li>Your Pixel ID will be displayed at the top</li>
                  </ol>
                </div>
                
                <div className="bg-[#FFF9F9] border border-[#efc0c0] p-4 rounded-lg">
                  <p className="text-sm text-[#333333] font-outfit">
                    <strong>Example:</strong> 123456789012345<br/>
                    <strong>Location:</strong> Business Manager → Events Manager → Pixel → Settings
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-outfit font-semibold text-green-800 mb-3">🎯 Benefits of Adding Tracking IDs:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Real-time Profile Analytics</h4>
                      <p className="text-sm text-green-700 font-outfit">Get instant data when someone visits your profile page</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Link Click Tracking</h4>
                      <p className="text-sm text-green-700 font-outfit">Monitor which links visitors click on your profile with detailed analytics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Audience Insights</h4>
                      <p className="text-sm text-green-700 font-outfit">Understand your audience demographics and behavior</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Marketing ROI Measurement</h4>
                      <p className="text-sm text-green-700 font-outfit">Track conversions from your profile to measure campaign success</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Retargeting Opportunities</h4>
                      <p className="text-sm text-green-700 font-outfit">Create custom audiences for Facebook and Google ads</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
                    <div>
                      <h4 className="font-semibold text-green-800 font-outfit">Performance Optimization</h4>
                      <p className="text-sm text-green-700 font-outfit">Use data to improve your profile and content strategy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
              <h3 className="text-lg font-outfit font-semibold text-[#333333] mb-3">Quick Reference:</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-[#efc0c0]">
                  <h4 className="font-semibold text-[#CF3232] font-outfit">Google Analytics</h4>
                  <p className="text-sm text-gray-600 font-outfit">Format: G-XXXXXXXXXX</p>
                  <p className="text-xs text-gray-500 font-outfit">Found in: Data Streams</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#efc0c0]">
                  <h4 className="font-semibold text-[#CF3232] font-outfit">Google Ads</h4>
                  <p className="text-sm text-gray-600 font-outfit">Format: AW-XXXXXXXXX</p>
                  <p className="text-xs text-gray-500 font-outfit">Found in: Conversions</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-[#efc0c0]">
                  <h4 className="font-semibold text-[#CF3232] font-outfit">Facebook Pixel</h4>
                  <p className="text-sm text-gray-600 font-outfit">Format: 15-digit number</p>
                  <p className="text-xs text-gray-500 font-outfit">Found in: Events Manager</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}