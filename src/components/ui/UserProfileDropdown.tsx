"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, LogOut, User as UserIcon, UserRoundCheck } from 'lucide-react';
import LogoutConfirmationPopup from './LogoutConfirmationPopup';
import Image from 'next/image';
import { useUser } from '../UserContext';
import { useRouter } from 'next/navigation';
interface UserProfileDropdownProps {
  userName?: string;
  userImage?: string;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  userName,
  userImage 
}) => {
  const { user, clearUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter()
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutPopup(true);
  };

  const handleLogoutConfirm = () => {
    // Clear user data and token
    clearUser();
    localStorage.removeItem('auth_token');
    // Redirect to home page
    window.location.href = '/login';
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors mb-[10]"
        >
          {userImage || user?.profile_picture_url || user?.profile_template?.image_url ? (
            <div className="relative w-8 h-8">
              {!imageLoaded && (
                <div className="absolute inset-0 w-8 h-8 bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <Image 
                src={userImage || user?.profile_picture_url || user?.profile_template?.image_url || ''} 
                alt={userName || user?.display_name || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name) || user?.username || 'User'}
                className={`w-8 h-8 rounded-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                width={32}
                height={32}
                unoptimized
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-[#CF3232] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {userName || user?.display_name || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.first_name) || user?.username || 'User'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div
             
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => {
                setIsOpen(false)
                router.push("/dashboard/profile")
              }
              }
            >
              <UserIcon className="w-4 h-4" />
              <span>Edit Profile</span>
            </div>
             <a
              href={`/${user?.username}`}
              target="_blank"
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <UserRoundCheck className="w-4 h-4"/>
             
              <span>View Public Profile</span>
            </a>
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <LogoutConfirmationPopup
        isOpen={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default UserProfileDropdown;
