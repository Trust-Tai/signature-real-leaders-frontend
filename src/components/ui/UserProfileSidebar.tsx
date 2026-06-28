"use client";

import React from 'react';
import Image from 'next/image';
import { X, BookUser, SquarePlus, UserCheck, HelpCircle, Share2, Users, UserCog } from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';
import { performAutoLogin } from '@/lib/autoLogin';
import { WP_URL } from '@/lib/config';
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
    performAutoLogin(WP_URL, true);
  };

  const sidebarItems = [
    { icon: UserCheck, label: 'Following', path: '/dashboard/following', page: 'following' },
    { icon: BookUser, label: 'Profile Subscribers', path: '/dashboard/profile-subscribers', page: 'profile-subscribers', tourId: 'subscribers' },
    { icon: Users, label: 'Join Community', path: 'https://real-leaders.com/membership/', page: 'community', badge: 'Add On', external: true },
    { icon: UserCog, label: 'Profile', path: '/dashboard/profile', page: 'profile' }
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
        bg-[#101117] w-[340px] flex flex-col fixed lg:static min-h-screen z-40 transition-transform duration-300 ease-in-out lg:transform-none
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
                <Image src={`${WP_URL}/wp-content/uploads/sites/5/2025/11/menu-logo.png`} width={200} height={60} alt='Real Leaders Logo' />
              </button>
            </div>
           
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="p-4 flex-1">
          <nav className="space-y-2">
            {/* Dashboard - Top Menu Item */}
            <div
              data-tour="analytics"
              onClick={() => {
                setSidebarOpen(false);
                router.push('/dashboard/analytics');
              }}
              className={`flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-colors ${
                currentPage === 'analytics' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <SquarePlus className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Dashboard</span>
              </div>
            </div>

            {/* Other Menu Items */}
            {sidebarItems.map((item, index) => {
              return (
                <div 
                  key={index}
                  data-tour={item.tourId}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    currentPage === item.page ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    setSidebarOpen(false);
                    if (item.external) {
                      window.open(item.path, '_blank', 'noopener,noreferrer');
                    } else {
                      router.push(`${item.path}`);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Help - Last Menu Item */}
            <div
              data-tour="help"
              onClick={() => {
                setSidebarOpen(false);
                router.push('/dashboard/help');
              }}
              className={`flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-colors ${
                currentPage === 'help' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Help</span>
              </div>
            </div>

            {/* Share Profile - After Help */}
            <div
              data-tour="share-profile"
              onClick={() => {
                setSidebarOpen(false);
                router.push('/dashboard/share-profile');
              }}
              className={`flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-colors ${
                currentPage === 'share-profile' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Share2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Share Profile</span>
              </div>
            </div>

            
          </nav>
        </div>
        
        
      </aside>
    </>
  );
};

export default UserProfileSidebar;
