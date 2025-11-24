"use client";

import React from 'react';
import Image from 'next/image';
import { X, Mail, Eye, Send, SquarePlus, LayoutDashboardIcon, Users, Wand2, HelpCircle } from 'lucide-react';
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
  const router = useRouter();

  const handleLogoClick = () => {
    // Navigate to WordPress site with auto-login
    performAutoLogin('https://verified.real-leaders.com', true);
  };

  const sidebarItems = [
    { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/dashboard', page: 'dashboard', tourId: 'dashboard' },
    { icon: Eye, label: 'Page Views', path: '/dashboard/page-views', page: 'page-views', tourId: 'page-views' },
    { icon: Send, label: 'Page Clicks', path: '/dashboard/total-link-clicks', page: 'total-link-clicks', tourId: 'link-clicks' },
    { icon: Mail, label: 'Newsletter Subscribers', path: '/dashboard/email-subscribers', page: 'email-subscribers', tourId: 'subscribers' },
    { icon: Users, label: 'Members', path: '/dashboard/followers', page: 'followers', tourId: 'followers' },
    { icon: Users, label: 'Following', path: '/dashboard/following', page: 'following', tourId: 'following' },
    { icon: SquarePlus, label: 'Analytics', path: '/dashboard/analytics', page: 'analytics', tourId: 'analytics' },
    { icon: HelpCircle, label: 'Help', path: '/dashboard/help', page: 'help', tourId: 'help' }
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
        bg-[#101117] w-[280px] flex flex-col fixed lg:static min-h-screen z-40 transition-transform duration-300 ease-in-out lg:transform-none
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

            {/* Magic Publishing - Single Menu Item */}
            <div className="mt-6">
              <div
                data-tour="magic-publishing"
                onClick={() => {
                  setSidebarOpen(false);
                  router.push('/dashboard/magic-publishing');
                }}
                className={`flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-colors ${
                  currentPage.startsWith('magic-publishing') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Wand2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Magic Publishing</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                    Beta
                  </span>
                </div>
              </div>
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
