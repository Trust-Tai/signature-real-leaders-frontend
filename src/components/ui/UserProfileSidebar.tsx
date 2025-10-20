"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Calendar, Mail, Eye, Send, SquarePlus, LayoutDashboardIcon, Users } from 'lucide-react';
import { images } from '@/assets';
import UserProfileDropdown from './UserProfileDropdown';

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
  const sidebarItems = [
    { icon: LayoutDashboardIcon, label: 'Dashboard', path: '/dashboard', page: 'dashboard' },
    { icon: Calendar, label: 'Bookings This Month', path: '/dashboard/booking-this-month', page: 'booking-this-month' },
    { icon: Mail, label: 'Newsletter Subscribers', path: '/dashboard/email-subscribers', page: 'email-subscribers' },
    { icon: Users, label: 'Followers', path: '/dashboard/followers', page: 'followers' },
    { icon: Eye, label: 'Page Views', path: '/dashboard/page-views', page: 'page-views' },
    { icon: Send, label: 'Total Link Clicks', path: '/dashboard/total-link-clicks', page: 'total-link-clicks' },
    { icon: SquarePlus, label: 'Audience Demographics', path: '/dashboard/audience-demographics', page: 'audience-demographics' }
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
              <Image src={images.realLeaders} alt='' />
            </div>
            <div className="lg:hidden">
              <UserProfileDropdown userName="Richard Branson" />
            </div>
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="p-6 flex-1">
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <Link 
                key={index}
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentPage === item.page ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-6 hidden lg:block">
           <Image src={images.realLeaders} alt='' className='w-32 h-8 mb-[30] ml-[80]'/>
        </div>
      </aside>
    </>
  );
};

export default UserProfileSidebar;
