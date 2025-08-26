"use client";

import React, { useState } from 'react';
import { Search, Bell, User, ChevronLeft, ChevronRight, Menu, X, Plus, Download, Filter } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import { StatsCards } from '@/components';

interface Subscriber {
  id: number;
  email: string;
  name: string;
  status: string;
  date: string;
  source: string;
}

const EmailSubscribers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [addSubscriberModalOpen, setAddSubscriberModalOpen] = useState(false);
  const [editSubscriberModalOpen, setEditSubscriberModalOpen] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState<Subscriber | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    dateRange: 'all',
    searchTerm: ''
  });
  const [newSubscriber, setNewSubscriber] = useState({
    name: '',
    email: '',
    status: 'Active',
    source: 'Website Signup'
  });

  const subscribersData = [
    { id: 1, email: 'john.doe@example.com', name: 'John Doe', status: 'Active', date: '2025-01-15', source: 'Website Signup' },
    { id: 2, email: 'jane.smith@example.com', name: 'Jane Smith', status: 'Active', date: '2025-01-14', source: 'LinkedIn' },
    { id: 3, email: 'mike.johnson@example.com', name: 'Mike Johnson', status: 'Unsubscribed', date: '2025-01-13', source: 'Email Campaign' },
    { id: 4, email: 'sarah.wilson@example.com', name: 'Sarah Wilson', status: 'Active', date: '2025-01-12', source: 'Website Signup' },
    { id: 5, email: 'david.brown@example.com', name: 'David Brown', status: 'Active', date: '2025-01-11', source: 'Referral' },
    { id: 6, email: 'emma.davis@example.com', name: 'Emma Davis', status: 'Active', date: '2025-01-10', source: 'Social Media' },
    { id: 7, email: 'alex.taylor@example.com', name: 'Alex Taylor', status: 'Unsubscribed', date: '2025-01-09', source: 'Website Signup' },
    { id: 8, email: 'lisa.anderson@example.com', name: 'Lisa Anderson', status: 'Active', date: '2025-01-08', source: 'Email Campaign' }
  ];

  const statsCards = [
    { number: '3,220', label: 'TOTAL SUBSCRIBERS', description: 'People who joined your mailing list', color: '#CF3232' },
    { number: '2,890', label: 'ACTIVE SUBSCRIBERS', description: 'Currently receiving your emails', color: '#CF3232' },
    { number: '330', label: 'UNSUBSCRIBED', description: 'People who opted out', color: '#CF3232' },
    { number: '12.5%', label: 'GROWTH RATE', description: 'Monthly subscriber increase', color: '#CF3232' }
  ];

  const handleAddSubscriber = () => {
    if (newSubscriber.name && newSubscriber.email) {
      const newSubscriberItem = {
        id: subscribersData.length + 1,
        email: newSubscriber.email,
        name: newSubscriber.name,
        status: newSubscriber.status,
        date: new Date().toISOString().split('T')[0],
        source: newSubscriber.source
      };
      subscribersData.push(newSubscriberItem);
      setNewSubscriber({ name: '', email: '', status: 'Active', source: 'Website Signup' });
      setAddSubscriberModalOpen(false);
    }
  };

  const handleEditSubscriber = (subscriber: Subscriber) => {
    setEditingSubscriber(subscriber);
    setEditSubscriberModalOpen(true);
  };

  const handleUpdateSubscriber = () => {
    if (editingSubscriber) {
      const index = subscribersData.findIndex(s => s.id === editingSubscriber.id);
      if (index !== -1) {
        subscribersData[index] = { ...editingSubscriber };
        setEditSubscriberModalOpen(false);
        setEditingSubscriber(null);
      }
    }
  };

  const handleExportSubscribers = () => {
    const exportData = subscribersData.map(sub => ({
      Name: sub.name,
      Email: sub.email,
      Status: sub.status,
      'Date Joined': sub.date,
      Source: sub.source
    }));
    
    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="email-subscribers"
      />

      {/* Right Side (Header + Main Content) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        
        {/* Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              <h1 className="text-[#101117] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                Email Subscribers
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search subscribers..." 
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    3
                  </span>
                </div>
                <div className="relative">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    16
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="relative sm:hidden mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search subscribers..." 
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full"
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6">
            
            {/* Stats Cards */}
            <StatsCards stats={statsCards} columns={4} />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={() => setAddSubscriberModalOpen(true)}
                className="bg-[#CF3232] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Subscriber</span>
              </button>
              <button 
                onClick={handleExportSubscribers}
                className="bg-white text-[#CF3232] border border-[#CF3232] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export List</span>
              </button>
              <button 
                onClick={() => setFilterModalOpen(true)}
                className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>

            {/* Active Filters Display */}
            {(filters.status !== 'all' || filters.source !== 'all' || filters.dateRange !== 'all' || filters.searchTerm) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-blue-800">Active Filters:</h3>
                  <button
                    onClick={() => {
                      setFilters({
                        status: 'all',
                        source: 'all',
                        dateRange: 'all',
                        searchTerm: ''
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.status !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Status: {filters.status}
                      <button
                        onClick={() => setFilters({...filters, status: 'all'})}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.source !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Source: {filters.source}
                      <button
                        onClick={() => setFilters({...filters, source: 'all'})}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.dateRange !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Date: {filters.dateRange}
                      <button
                        onClick={() => setFilters({...filters, dateRange: 'all'})}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Search: &quot;{filters.searchTerm}&quot;
                      <button
                        onClick={() => setFilters({...filters, searchTerm: ''})}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Subscribers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117]">
                  Subscriber List
                </h2>
              </div>
              
              {/* Mobile View - Cards */}
              <div className="block sm:hidden p-4 space-y-4">
                {subscribersData.map((subscriber) => (
                  <div key={subscriber.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#101117]">{subscriber.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        subscriber.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriber.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{subscriber.email}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Joined: {subscriber.date}</span>
                      <span>Source: {subscriber.source}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Date Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Source</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribersData.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit font-regular text-[#414141]">{subscriber.name}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit font-regular text-[#414141]">{subscriber.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            subscriber.status === 'Active' ? 'bg-green-100 text-green-800 sm:text-base font-outfit font-regular' : 'bg-red-100 text-red-800sm:text-base font-outfit font-regular text-[#414141]'
                          }`}>
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit font-regular text-[#414141]">{subscriber.date}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit font-regular text-[#414141]">{subscriber.source}</td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => handleEditSubscriber(subscriber)}
                            className="text-[#CF3232] hover:text-red-600 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 sm:p-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600 text-center sm:text-left">
                    Showing 1 to 8 of 3,220 subscribers
                  </p>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="px-3 py-1 bg-[#CF3232] text-white rounded text-sm">1</span>
                    <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer text-sm">2</span>
                    <span className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded cursor-pointer text-sm">3</span>
                    <button className="p-2 hover:bg-gray-100 rounded">
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filter Modal */}
          {filterModalOpen && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setFilterModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                      Filter Subscribers
                    </h2>
                    <button
                      onClick={() => setFilterModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Subscription Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="all" className="text-[#101117]">All Statuses</option>
                      <option value="active" className="text-[#101117]">Active</option>
                      <option value="unsubscribed" className="text-[#101117]">Unsubscribed</option>
                      <option value="pending" className="text-[#101117]">Pending</option>
                    </select>
                  </div>

                  {/* Source Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Source
                    </label>
                    <select
                      value={filters.source}
                      onChange={(e) => setFilters({...filters, source: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="all" className="text-[#101117]">All Sources</option>
                      <option value="website" className="text-[#101117]">Website Signup</option>
                      <option value="linkedin" className="text-[#101117]">LinkedIn</option>
                      <option value="email" className="text-[#101117]">Email Campaign</option>
                      <option value="referral" className="text-[#101117]">Referral</option>
                      <option value="social" className="text-[#101117]">Social Media</option>
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Date Range
                    </label>
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="all" className="text-[#101117]">All Time</option>
                      <option value="today" className="text-[#101117]">Today</option>
                      <option value="week" className="text-[#101117]">This Week</option>
                      <option value="month" className="text-[#101117]">This Month</option>
                      <option value="quarter" className="text-[#101117]">This Quarter</option>
                      <option value="year" className="text-[#101117]">This Year</option>
                    </select>
                  </div>

                  {/* Search Term */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Search Term
                    </label>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => {
                      setFilters({
                        status: 'all',
                        source: 'all',
                        dateRange: 'all',
                        searchTerm: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setFilterModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add New Subscriber Modal */}
          {addSubscriberModalOpen && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setAddSubscriberModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                      Add New Subscriber
                    </h2>
                    <button
                      onClick={() => setAddSubscriberModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name..."
                      value={newSubscriber.name}
                      onChange={(e) => setNewSubscriber({...newSubscriber, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address..."
                      value={newSubscriber.email}
                      onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Status
                    </label>
                    <select
                      value={newSubscriber.status}
                      onChange={(e) => setNewSubscriber({...newSubscriber, status: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="Active">Active</option>
                      <option value="Unsubscribed">Unsubscribed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Source
                    </label>
                    <select
                      value={newSubscriber.source}
                      onChange={(e) => setNewSubscriber({...newSubscriber, source: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="Website Signup">Website Signup</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Email Campaign">Email Campaign</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setAddSubscriberModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSubscriber}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Add Subscriber
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Subscriber Modal */}
          {editSubscriberModalOpen && editingSubscriber && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setEditSubscriberModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                      Edit Subscriber
                    </h2>
                    <button
                      onClick={() => setEditSubscriberModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name..."
                      value={editingSubscriber.name}
                      onChange={(e) => setEditingSubscriber({...editingSubscriber, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email address..."
                      value={editingSubscriber.email}
                      onChange={(e) => setEditingSubscriber({...editingSubscriber, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Status
                    </label>
                    <select
                      value={editingSubscriber.status}
                      onChange={(e) => setEditingSubscriber({...editingSubscriber, status: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="Active">Active</option>
                      <option value="Unsubscribed">Unsubscribed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Source */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Source
                    </label>
                    <select
                      value={editingSubscriber.source}
                      onChange={(e) => setEditingSubscriber({...editingSubscriber, source: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="Website Signup">Website Signup</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Email Campaign">Email Campaign</option>
                      <option value="Referral">Referral</option>
                      <option value="Social Media">Social Media</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setEditSubscriberModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateSubscriber}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Update Subscriber
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Footer */}
          <footer className="flex items-center justify-center lg:justify-end px-4 sm:px-6 py-4 border-t border-gray-200 bg-[#101117] text-white h-[131px]">
            <div className="text-xs sm:text-sm text-center">
              © 2025 RealLeaders. All Rights Reserved.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default EmailSubscribers;
