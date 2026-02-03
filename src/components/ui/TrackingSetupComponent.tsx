'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TrackingSetupComponentProps {
  onBack?: () => void;
}

export default function TrackingSetupComponent({ onBack }: TrackingSetupComponentProps) {
  const [openSections, setOpenSections] = React.useState<{[key: string]: boolean}>({
    googleAnalytics: false,
    googleAds: false,
    facebookPixel: false,
    benefits: false,
    quickRef: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
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

      {/* Google Analytics ID - Accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-[#efc0c0] overflow-hidden">
        <button
          onClick={() => toggleSection('googleAnalytics')}
          className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
              1
            </div>
            <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
              Google Analytics ID (G-XXXXXXXXXX)
            </h3>
          </div>
          {openSections.googleAnalytics ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {openSections.googleAnalytics && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
            <div className="space-y-4 pt-4">
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
        )}
      </div>

      {/* Google Ads ID - Accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-[#efc0c0] overflow-hidden">
        <button
          onClick={() => toggleSection('googleAds')}
          className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
              2
            </div>
            <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
              Google Ads Conversion ID (AW-XXXXXXXXX)
            </h3>
          </div>
          {openSections.googleAds ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {openSections.googleAds && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
            <div className="space-y-4 pt-4">
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
        )}
      </div>

      {/* Facebook Pixel ID - Accordion */}
      <div className="bg-white rounded-xl shadow-sm border border-[#efc0c0] overflow-hidden">
        <button
          onClick={() => toggleSection('facebookPixel')}
          className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#CF3232] text-white rounded-full flex items-center justify-center font-bold mr-3 font-outfit">
              3
            </div>
            <h3 className="text-lg sm:text-xl font-outfit font-semibold text-[#333333]">
              Facebook Pixel ID
            </h3>
          </div>
          {openSections.facebookPixel ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {openSections.facebookPixel && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
            <div className="space-y-4 pt-4">
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
        )}
      </div>

      {/* Benefits Section - Accordion */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleSection('benefits')}
          className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-green-100/50 transition-colors"
        >
          <h3 className="text-lg font-outfit font-semibold text-green-800">🎯 Benefits of Adding Tracking IDs</h3>
          {openSections.benefits ? (
            <ChevronUp className="w-5 h-5 text-green-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-green-600" />
          )}
        </button>
        
        {openSections.benefits && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-green-200">
            <div className="grid md:grid-cols-2 gap-4 pt-4">
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
        )}
      </div>

      {/* Quick Reference - Accordion */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => toggleSection('quickRef')}
          className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-outfit font-semibold text-[#333333]">Quick Reference</h3>
          {openSections.quickRef ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        
        {openSections.quickRef && (
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-4 pt-4">
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
        )}
      </div>
    </div>
  );
}