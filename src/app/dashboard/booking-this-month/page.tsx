"use client";

import React, { useState, useEffect } from 'react';
import { Bell, User, TrendingUp, TrendingDown, Calendar, Menu, Loader2 } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import { StatsCards } from '@/components';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/toast';

const BookingThisMonth = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<Array<{
    type: string;
    count: number;
    change: string;
    trend: 'up' | 'down' | 'same';
  }>>([]);
  const [statsCards, setStatsCards] = useState<Array<{
    number: string;
    label: string;
    description: string;
    color: string;
  }>>([]);
  const [weeklyData, setWeeklyData] = useState<Array<{
    week: string;
    bookings: number;
  }>>([]);
  const [averageWeeklyBookings, setAverageWeeklyBookings] = useState(0);

  useEffect(() => {
    const fetchBookingStats = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
          toast.error('Please login to view booking stats');
          return;
        }

        const response = await api.getBookingStats(authToken);
        
        if (response.success && response.data) {
          const { stats, booking_by_type, weekly_booking_trend } = response.data;

          // Set stats cards
          const growthSign = stats.growth_rate > 0 ? '+' : stats.growth_rate < 0 ? '-' : '';
          setStatsCards([
            { 
              number: stats.total_bookings.toString(), 
              label: 'TOTAL BOOKINGS', 
              description: 'Total number of bookings this month', 
              color: '#CF3232' 
            },
            { 
              number: stats.new_bookings.toString(), 
              label: 'NEW BOOKINGS', 
              description: 'First-time bookings received', 
              color: '#CF3232' 
            },
            { 
              number: stats.returning_bookings.toString(), 
              label: 'RETURNING BOOKINGS', 
              description: 'Repeat customer bookings', 
              color: '#CF3232' 
            },
            { 
              number: `${growthSign}${Math.abs(stats.growth_rate)}%`, 
              label: 'GROWTH RATE', 
              description: 'Monthly booking increase', 
              color: '#CF3232' 
            }
          ]);

          // Set booking by type data
          const formattedBookingData = booking_by_type.map(item => {
            const changeSign = item.growth_rate > 0 ? '+' : item.growth_rate < 0 ? '-' : '';
            return {
              type: item.type,
              count: item.count,
              change: `${changeSign}${Math.abs(item.growth_rate)}%`,
              trend: item.trend
            };
          });
          setBookingData(formattedBookingData);

          // Set weekly trend data
          const avgBookings = weekly_booking_trend.find(item => item.average_weekly_bookings !== undefined);
          if (avgBookings) {
            setAverageWeeklyBookings(avgBookings.average_weekly_bookings || 0);
          }

          const formattedWeeklyData = weekly_booking_trend
            .filter(item => item.week_label)
            .map(item => ({
              week: item.week_label,
              bookings: item.count
            }));
          setWeeklyData(formattedWeeklyData);
        }
      } catch (error) {
        console.error('Error fetching booking stats:', error);
        toast.error('Failed to load booking statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingStats();
  }, []);

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="booking-this-month"
      />

      {/* Right Side (Header + Main Content + Footer) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
        
        {/* Fixed Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
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
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    3
                  </span> */}
                </div>
                <div className="relative">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  {/* <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                    16
                  </span> */}
                </div>
                <UserProfileDropdown />
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

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#CF3232]" />
              </div>
            ) : (
              <>
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
                  {weeklyData.map((data, index) => {
                    const maxBookings = Math.max(...weeklyData.map(d => d.bookings), 1);
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-16">{data.week}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-[#CF3232] h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(data.bookings / maxBookings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-[#101117] w-12 text-right">
                          {data.bookings}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Average weekly bookings: {averageWeeklyBookings}
                  </p>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
        </main>
        
        {/* Fixed Footer */}
         <DashBoardFooter />
      </div>
    </div>
  );
};

export default BookingThisMonth;
