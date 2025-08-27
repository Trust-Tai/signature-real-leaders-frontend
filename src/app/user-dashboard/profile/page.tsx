"use client";

import React, { useState } from 'react';
import { ArrowLeft, Camera, Save, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { UserProfileSidebar, UserProfileDropdown } from '@/components';
import Image from 'next/image';

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState("Founder Of The Virgin Group, Which Has Gone On To Grow Successful Businesses In Sectors Including Mobile Telephony, Travel And Transportation, Financial And Entertainment And Health And Wellness. Virgin Is A Leading International Investment Group And One Of The World's Most Recognised And Respected Brands.");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Handle success
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    
    // Reset password fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    
    // Handle success
  };

  return (
    <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar */}
      <UserProfileSidebar 
        sidebarOpen={false}
        setSidebarOpen={() => {}}
        currentPage="profile"
      />

      {/* Right Side (Header + Main Content) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {/* Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 border-b border-[#efc0c0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/user-dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-xl font-outift font-semibold text-[#333333]">Profile Settings</h1>
            </div>
            
            <UserProfileDropdown userName="Richard Branson" />
          </div>
        </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-8">
          
          {/* Profile Image Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-outift font-semibold text-[#333333] mb-4">Profile Image</h2>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-[#efc0c0] overflow-hidden">
                  {profileImage ? (
                    <Image 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-[#CF3232] text-white p-2 rounded-full cursor-pointer hover:bg-red-600 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Upload a new profile image. Recommended size: 256x256 pixels.
                </p>
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isLoading ? 'Saving...' : 'Save Image'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-semibold font-outift text-[#333333]  mb-4">Bio</h2>
            <div className="space-y-4">
              <div className='firstVerifyScreen h-[250]'>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
                className="w-full p-3 font-outift font-regular resize-none border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#efc0c0]"
                placeholder="Tell us about yourself..."
                style={{ color: '#949494', height: '240px' }}
              />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Bio'}</span>
              </button>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#efc0c0]">
            <h2 className="font-semibold font-outift text-[#333333] mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium font-outift text-[#333333] mb-2">
                  Current Password
                </label>
                <div className="relative firstVerifyScreen">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 pr-10 font-outift font-regular border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#efc0c0]"
                    placeholder="Enter current password"
                    style={{ color: '#949494', height: '70px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-outfit text-[#333333] mb-2">
                  New Password
                </label>
                <div className="relative firstVerifyScreen">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 pr-10 font-outift font-regular border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#efc0c0]"
                    placeholder="Enter new password"
                    style={{ color: '#949494', height: '70px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium font-outift text-[#333333] mb-2">
                  Confirm New Password
                </label>
                <div className="relative firstVerifyScreen">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 font-outift font-regular border border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-[#efc0c0]" 
                    placeholder="Confirm new password"
                    style={{ color: '#949494', height: '70px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                className="px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Changing Password...' : 'Change Password'}</span>
              </button>
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Note:</h3>
            <p className="text-sm font-outift font-regular text-[#333333]">
              You can only change your profile image, bio, and password. Your name and title cannot be modified.
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="flex items-center justify-center lg:justify-end px-4 sm:px-6 py-4 border-t border-gray-200 bg-[#101117] text-white h-[131px]">
        <div className="text-xs sm:text-sm text-center">
          © 2025 RealLeaders. All Rights Reserved.
        </div>
      </footer>
      </div>
    </div>
  );
};

export default ProfilePage;
