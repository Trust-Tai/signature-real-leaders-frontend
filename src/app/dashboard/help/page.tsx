'use client';

import React, { useState } from 'react';
import { Book, Video, FileText, ChevronDown, ChevronRight, Play, CheckCircle2, Mail, Sparkles, Menu } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const HelpPage = () => {
  const [expandedSection, setExpandedSection] = useState<string>('getting-started');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Welcome to RealLeaders!</h4>
            <p className="text-blue-800 text-sm">
              Follow these simple steps to set up your account and start building your professional presence.
            </p>
          </div>

          <div className="space-y-3">
            <StepCard
              number={1}
              title="Complete Your Profile"
              description="Add your personal information, company details, and profile picture to make your page stand out."
              link="/dashboard/profile"
              linkText="Go to Profile"
            />
            <StepCard
              number={2}
              title="Verify Your Account"
              description="Complete the verification process to unlock all features and publish your profile."
              link="/profile-verification"
              linkText="Start Verification"
            />
            <StepCard
              number={3}
              title="Customize Your Links"
              description="Add important links to your profile - social media, booking pages, resources, and more."
              link="/dashboard/profile"
              linkText="Add Links"
            />
            <StepCard
              number={4}
              title="Share Your Profile"
              description="Once approved, share your unique RealLeaders profile link with your audience."
            />
          </div>
        </div>
      ),
    },
    {
      id: 'video-tutorials',
      title: 'Video Tutorials',
      icon: <Video className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <VideoCard
            title="Account Setup - Complete Walkthrough"
            duration="5:30"
            description="Learn how to set up your RealLeaders account from scratch, including profile completion and verification."
            thumbnail="🎬"
          />
          <VideoCard
            title="Connecting Your Newsletter & CRM"
            duration="3:45"
            description="Step-by-step guide to integrate your email marketing tools and CRM systems."
            thumbnail="📧"
          />
          <VideoCard
            title="Using Magic Publishing"
            duration="4:20"
            description="Discover how to leverage AI-powered content creation for books, podcasts, and articles."
            thumbnail="✨"
          />
          <VideoCard
            title="Analytics & Insights"
            duration="3:15"
            description="Understanding your dashboard metrics - page views, link clicks, and audience demographics."
            thumbnail="📊"
          />
        </div>
      ),
    },
    {
      id: 'newsletter-crm',
      title: 'Newsletter & CRM Integration',
      icon: <Mail className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h4 className="font-semibold text-purple-900 mb-2">Connect Your Tools</h4>
            <p className="text-purple-800 text-sm">
              Integrate your favorite email marketing and CRM platforms to grow your audience.
            </p>
          </div>

          <div className="space-y-4">
            <IntegrationCard
              name="Mailchimp"
              description="Sync your email subscribers and automate campaigns"
              status="Available"
            />
            <IntegrationCard
              name="ConvertKit"
              description="Connect your creator email list seamlessly"
              status="Available"
            />
            <IntegrationCard
              name="HubSpot"
              description="Full CRM integration for lead management"
              status="Available"
            />
            <IntegrationCard
              name="ActiveCampaign"
              description="Advanced automation and email marketing"
              status="Coming Soon"
            />
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2 text-[#333333]">How to Connect:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Go to Profile Settings</li>
              <li>Navigate to &quot;Integrations&quot; tab</li>
              <li>Select your email/CRM provider</li>
              <li>Enter your API key or authenticate</li>
              <li>Configure sync settings</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'key-features',
      title: 'Key Features Guide',
      icon: <Sparkles className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <FeatureCard
            title="Magic Publishing"
            description="AI-powered content creation for books, podcasts, and articles. Generate professional content in minutes."
            features={[
              'Create books from your expertise',
              'Generate podcast scripts and episodes',
              'Write articles and blog posts',
              'Customize tone and style',
            ]}
            link="/dashboard/magic-publishing/setup"
          />
          <FeatureCard
            title="Analytics Dashboard"
            description="Track your profile performance with detailed insights and metrics."
            features={[
              'Page views and visitor tracking',
              'Link click analytics',
              'Audience demographics',
              'Booking and conversion metrics',
            ]}
            link="/dashboard"
          />
          <FeatureCard
            title="Custom Profile Links"
            description="Add unlimited links to your profile page for easy access to your content and services."
            features={[
              'Social media profiles',
              'Booking calendars',
              'Digital products',
              'Resources and downloads',
            ]}
            link="/dashboard/profile"
          />
          <FeatureCard
            title="Email Subscribers"
            description="Build and manage your email list directly from your profile."
            features={[
              'Newsletter signup forms',
              'Subscriber management',
              'Export subscriber data',
              'Integration with email tools',
            ]}
            link="/dashboard/email-subscribers"
          />
        </div>
      ),
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      icon: <FileText className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <FAQItem
            question="How long does account verification take?"
            answer="Account verification typically takes 24-48 hours. You&apos;ll receive an email notification once your account is approved."
          />
          <FAQItem
            question="Can I customize my profile URL?"
            answer="Yes! You can set a custom username for your profile URL during the setup process. This will be your unique RealLeaders link (e.g., realleaders.com/yourname)."
          />
          <FAQItem
            question="Is there a limit on the number of links I can add?"
            answer="No, you can add unlimited links to your profile. Organize them in the order you prefer to showcase your most important content first."
          />
          <FAQItem
            question="How do I track my profile analytics?"
            answer="Your dashboard provides real-time analytics including page views, link clicks, audience demographics, and more. Access it anytime from the main dashboard."
          />
          <FAQItem
            question="Can I export my subscriber data?"
            answer="Yes, you can export your email subscriber list at any time from the Email Subscribers section in CSV format."
          />
          <FAQItem
            question="What is Magic Publishing?"
            answer="Magic Publishing is our AI-powered content creation tool that helps you generate books, podcasts, and articles based on your expertise and brand voice."
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Fixed */}
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        currentPage="help" 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar - Fixed */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between lg:justify-end flex-shrink-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <UserProfileDropdown />
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pb-0">
          <div className="p-6 pb-0">
            <div className="max-w-5xl mx-auto pb-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600">
            Everything you need to know about using RealLeaders
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <QuickLinkCard
            icon={<Book className="w-6 h-6" />}
            title="Documentation"
            description="Detailed guides and tutorials"
            onClick={() => toggleSection('getting-started')}
          />
          <QuickLinkCard
            icon={<Video className="w-6 h-6" />}
            title="Video Tutorials"
            description="Watch step-by-step videos"
            onClick={() => toggleSection('video-tutorials')}
          />
          <QuickLinkCard
            icon={<Mail className="w-6 h-6" />}
            title="Contact Support"
            description="Get help from our team"
            href="mailto:support@realleaders.com"
          />
        </div>

        {/* Help Sections */}
        <div className="space-y-4">
          {helpSections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-custom-red">{section.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                {expandedSection === section.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedSection === section.id && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

              {/* Contact Section */}
              <div className="mt-8 bg-gradient-to-r from-custom-red to-red-600 rounded-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Still Need Help?</h3>
                <p className="mb-4 opacity-90">
                  Our support team is here to assist you with any questions or issues.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="mailto:support@realleaders.com"
                    className="px-6 py-2 bg-white text-custom-red rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Email Support
                  </a>
                  <a
                    href="#"
                    className="px-6 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
                  >
                    Schedule a Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <DashBoardFooter />
      </div>
    </div>
  );
};

// Helper Components
const StepCard: React.FC<{
  number: number;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}> = ({ number, title, description, link, linkText }) => (
  <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex-shrink-0 w-8 h-8 bg-custom-red text-white rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      {link && linkText && (
        <a
          href={link}
          className="text-sm text-custom-red hover:underline font-medium"
        >
          {linkText} →
        </a>
      )}
    </div>
  </div>
);

const VideoCard: React.FC<{
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
}> = ({ title, duration, description, thumbnail }) => (
  <div className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-custom-red to-red-600 rounded-lg flex items-center justify-center text-4xl">
      {thumbnail}
    </div>
    <div className="flex-1">
      <div className="flex items-start justify-between mb-1">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {duration}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <button className="flex items-center gap-2 text-sm text-custom-red hover:underline font-medium">
        <Play className="w-4 h-4" />
        Watch Tutorial
      </button>
    </div>
  </div>
);

const IntegrationCard: React.FC<{
  name: string;
  description: string;
  status: string;
}> = ({ name, description, status }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
    <div>
      <h4 className="font-semibold text-gray-900">{name}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === 'Available'
          ? 'bg-green-100 text-green-700'
          : 'bg-yellow-100 text-yellow-700'
      }`}
    >
      {status}
    </span>
  </div>
);

const FeatureCard: React.FC<{
  title: string;
  description: string;
  features: string[];
  link: string;
}> = ({ title, description, features, link }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200">
    <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-sm text-gray-600 mb-3">{description}</p>
    <ul className="space-y-1 mb-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          {feature}
        </li>
      ))}
    </ul>
    <a
      href={link}
      className="text-sm text-custom-red hover:underline font-medium"
    >
      Learn More →
    </a>
  </div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200">
    <h4 className="font-semibold text-gray-900 mb-2">{question}</h4>
    <p className="text-sm text-gray-600">{answer}</p>
  </div>
);

const QuickLinkCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  href?: string;
}> = ({ icon, title, description, onClick, href }) => {
  const content = (
    <>
      <div className="text-custom-red mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      {content}
    </div>
  );
};

export default HelpPage;
