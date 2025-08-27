"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import LogoutConfirmationPopup from './LogoutConfirmationPopup';
import Image from 'next/image';

interface UserProfileDropdownProps {
  userName?: string;
  userImage?: string;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  userName = "User",
  userImage 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    // Handle actual logout logic here
    // For now, just redirect to home page
    window.location.href = '/';
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors mb-[10]"
        >
          {userImage ? (
            <Image 
              src={userImage} 
              alt={userName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-[#CF3232] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <span className="hidden sm:block text-sm font-medium text-gray-700">{userName}</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <Link
              href="/user-dashboard/profile"
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="w-4 h-4" />
              <span>View Profile</span>
            </Link>
            
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
