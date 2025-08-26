"use client";

import React, { useState } from 'react';
import { Bell, User, TrendingUp, TrendingDown, Calendar, Menu } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import { StatsCards } from '@/components';

const BookingThisMonth = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bookingData = [
    { type: 'New Bookings', count: 82, change: '+12.5%', trend: 'up' },
    { type: 'Returning Bookings', count: 46, change: '+8.2%', trend: 'up' },
    { type: 'Consultations', count: 35, change: '+15.3%', trend: 'up' },
    { type: 'Events', count: 28, change: '-2.1%', trend: 'down' },
    { type: 'Meetings', count: 54, change: '+22.7%', trend: 'up' },
    { type: 'Workshops', count: 19, change: '+5.8%', trend: 'up' }
  ];

  const statsCards = [
    { number: '128', label: 'TOTAL BOOKINGS', description: 'Total number of bookings this month', color: '#CF3232' },
    { number: '82', label: 'NEW BOOKINGS', description: 'First-time bookings received', color: '#CF3232' },
    { number: '46', label: 'RETURNING BOOKINGS', description: 'Repeat customer bookings', color: '#CF3232' },
    { number: '+12%', label: 'GROWTH RATE', description: 'Monthly booking increase', color: '#CF3232' }
  ];

  const weeklyData = [
    { week: 'Week 1', bookings: 28 },
    { week: 'Week 2', bookings: 32 },
    { week: 'Week 3', bookings: 35 },
    { week: 'Week 4', bookings: 33 }
  ];

  return (
    <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="booking-this-month"
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
                Bookings This Month
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Date Range Selector */}
              <div className="hidden sm:flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Last 3 Months</option>
                  <option>Last 6 Months</option>
                </select>
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
          
          {/* Mobile Date Range */}
          <div className="sm:hidden mt-4">
            <select className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6">
            
            {/* Stats Cards */}
            <StatsCards stats={statsCards} columns={4} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bookings by Type */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                  Bookings by Type
                </h2>
                
                {/* Mobile View - Cards */}
                <div className="block lg:hidden space-y-3">
                  {bookingData.map((booking, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-[#101117] text-sm">{booking.type}</h3>
                        <span className={`text-xs font-medium ${
                          booking.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {booking.change}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#101117]">{booking.count}</span>
                        {booking.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Booking Type</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Count</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Change</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingData.map((booking, index) => (
                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-[#101117]">{booking.type}</td>
                          <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{booking.count}</td>
                          <td className="py-4 px-4">
                            <span className={`text-sm font-medium ${
                              booking.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {booking.change}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {booking.trend === 'up' ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Weekly Booking Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                  Weekly Booking Trend
                </h2>
                
                <div className="space-y-3">
                  {weeklyData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-16">{data.week}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-[#CF3232] h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(data.bookings / 35) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-[#101117] w-12 text-right">
                        {data.bookings}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Average weekly bookings: 32
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Analytics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                Booking Sources
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">45%</h3>
                  <p className="text-sm text-gray-600">Direct Contact</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">32%</h3>
                  <p className="text-sm text-gray-600">Website Form</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">18%</h3>
                  <p className="text-sm text-gray-600">Referral</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">5%</h3>
                  <p className="text-sm text-gray-600">Social Media</p>
                </div>
              </div>
            </div>
          </div>
          
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

export default BookingThisMonth;
