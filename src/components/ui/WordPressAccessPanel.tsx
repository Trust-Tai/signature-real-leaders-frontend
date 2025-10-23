"use client";

import React from 'react';
import { 
  ExternalLink, 
  Settings, 
  Users, 
  FileText, 
  Image as ImageIcon, 
  User,
  Home
} from 'lucide-react';
import AutoLoginButton from './AutoLoginButton';
import { WORDPRESS_URLS, autoLoginTo } from '@/lib/autoLogin';

const WordPressAccessPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#101117] mb-2">
            WordPress Access
          </h2>
          <p className="text-gray-600">
            Quick access to your WordPress admin areas with automatic authentication
          </p>
        </div>
        <ExternalLink className="w-6 h-6 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* About Us Page */}
        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <Home className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">About Us</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            View the public About Us page
          </p>
          <AutoLoginButton
            redirectUrl={WORDPRESS_URLS.ABOUT_US}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Visit Page
          </AutoLoginButton>
        </div>

        {/* Dashboard */}
        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Dashboard</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Access WordPress admin dashboard
          </p>
          <AutoLoginButton
            redirectUrl={WORDPRESS_URLS.DASHBOARD}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Open Dashboard
          </AutoLoginButton>
        </div>

        {/* Profile */}
        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <User className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-gray-900">Profile</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Edit your WordPress profile
          </p>
          <AutoLoginButton
            redirectUrl={WORDPRESS_URLS.PROFILE}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Edit Profile
          </AutoLoginButton>
        </div>

        {/* Posts */}
        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-gray-900">Posts</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Manage your blog posts
          </p>
          <AutoLoginButton
            redirectUrl={WORDPRESS_URLS.POSTS}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Manage Posts
          </AutoLoginButton>
        </div>

        {/* Media */}
        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <ImageIcon className="w-5 h-5 text-orange-600" />
            <h3 className="font-medium text-gray-900">Media</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Upload and manage media files
          </p>
          <AutoLoginButton
            redirectUrl={WORDPRESS_URLS.MEDIA}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Media Library
          </AutoLoginButton>
        </div>

        {/* Users */}
        <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <Users className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-gray-900">Users</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Manage user accounts
          </p>
          <AutoLoginButton
            redirectUrl={WORDPRESS_URLS.USERS}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Manage Users
          </AutoLoginButton>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={autoLoginTo.dashboard}
            className="flex items-center space-x-2 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </button>
          
          <button
            onClick={autoLoginTo.posts}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>New Post</span>
          </button>
          
          <button
            onClick={autoLoginTo.media}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Media</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordPressAccessPanel;