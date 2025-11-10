"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Calendar, Mail, Eye, Send, SquarePlus, LayoutDashboardIcon, Users, Wand2, BookOpen, Mic, ChevronDown, ChevronRight, FileText, Settings } from 'lucide-react';
import { images } from '@/assets';
import UserProfileDropdown from './UserProfileDropdown';
import { performAutoLogin } from '@/lib/autoLogin';
import { useRouter } from 'next/navigation';

interface UserProfileSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
}


const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  currentPage 
}) => {
  // Auto-expand Magic Publishing submenu when on any magic publishing page
  const [magicPublishingOpen, setMagicPublishingOpen] = useState(
    currentPage.startsWith('magic-publishing')
  );
  const router = useRouter()
  // Update submenu state when currentPage changes
  useEffect(() => {
    setMagicPublishingOpen(currentPage.startsWith('magic-publishing'));
  }, [currentPage]);

  const handleLogoClick = () => {
    // Navigate to WordPress site with auto-login
    performAutoLogin('https://verified.real-leaders.com', true);
  };

  const sidebarItems = [
    { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/dashboard', page: 'dashboard', tourId: 'dashboard' },
    { icon: Calendar, label: 'Bookings This Month', path: '/dashboard/booking-this-month', page: 'booking-this-month', tourId: 'bookings' },
    { icon: Mail, label: 'Newsletter Subscribers', path: '/dashboard/email-subscribers', page: 'email-subscribers', tourId: 'subscribers' },
    { icon: Users, label: 'Followers', path: '/dashboard/followers', page: 'followers', tourId: 'followers' },
    { icon: Eye, label: 'Page Views', path: '/dashboard/page-views', page: 'page-views', tourId: 'page-views' },
    { icon: Send, label: 'Total Link Clicks', path: '/dashboard/total-link-clicks', page: 'total-link-clicks', tourId: 'link-clicks' },
    { icon: SquarePlus, label: 'Audience Demographics', path: '/dashboard/audience-demographics', page: 'audience-demographics', tourId: 'demographics' }
  ];

  const magicPublishingItems = [
    { icon: Settings, label: 'Setup', path: '/dashboard/magic-publishing/setup', page: 'magic-publishing-setup' },
    { icon: FileText, label: 'Content', path: '/dashboard/magic-publishing/content', page: 'magic-publishing-content' },
    { icon: BookOpen, label: 'Books', path: '/dashboard/magic-publishing/books', page: 'magic-publishing-books' },
    { icon: Mic, label: 'Podcasts', path: '/dashboard/magic-publishing/podcasts', page: 'magic-publishing-podcasts' }
  ];



  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed top-0 left-64 right-0 bottom-0 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        bg-[#101117] w-64 flex flex-col fixed lg:static min-h-screen z-40 transition-transform duration-300 ease-in-out lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar Header Logo */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleLogoClick}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                title="Go to Real Leaders Website"
              >
                <Image src="https://real-leaders.com/wp-content/uploads/2023/08/cropped-Red-White.png" width={200} height={60} alt='Real Leaders Logo' />
              </button>
            </div>
            <div className="lg:hidden">
              <UserProfileDropdown />
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="p-6 flex-1">
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <div 
                key={index}
                data-tour={item.tourId}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentPage === item.page ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => {
                  setSidebarOpen(false)
                  router.push(`${item.path}`)
                }
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}

            {/* Magic Publishing Section */}
            <div className="mt-6">
              <button
                data-tour="magic-publishing"
                onClick={() => setMagicPublishingOpen(!magicPublishingOpen)}
                className={`flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-colors ${
                  currentPage.startsWith('magic-publishing') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Wand2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Magic Publishing</span>
                </div>
                {(magicPublishingOpen || currentPage.startsWith('magic-publishing')) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Magic Publishing Sub-menu - Always show when on magic publishing pages */}
              {(magicPublishingOpen || currentPage.startsWith('magic-publishing')) && (
                <div className="ml-6 mt-2 space-y-1">
                  {magicPublishingItems.map((item, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        currentPage === item.page ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        setSidebarOpen(false)
                        router.push(`${item.path}`)
                      }}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
        
        <div className="p-6 hidden lg:block">
          <button 
            onClick={handleLogoClick}
            className="hover:opacity-80 transition-opacity cursor-pointer"
            title="Go to Real Leaders Website"
          >
            <Image src={images.realLeaders} alt='Real Leaders Logo' className='w-32 h-8 ml-[80]'/>
          </button>
        </div>
      </aside>
    </>
  );
};

export default UserProfileSidebar;
