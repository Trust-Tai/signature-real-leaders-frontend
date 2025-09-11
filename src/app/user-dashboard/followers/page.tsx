"use client";

import React, { useMemo, useState } from 'react';
import { Search, Bell, User as UserIcon, Menu, X, Download, Filter } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import { StatsCards } from '@/components';

type Follower = {
  id: number;
  name: string; // full name (kept for legacy use in stats/search)
  firstName: string;
  lastName: string;
  age: number;
  occupation: string;
  followedAt: string; // YYYY-MM-DD (when followed)
  username: string;
  email: string;
  location: string;
  joined: string; // YYYY-MM-DD
};

const FollowersPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const followersData: Follower[] = useMemo(() => [
    { id: 1, name: 'John Doe', firstName: 'John', lastName: 'Doe', age: 34, occupation: 'Entrepreneur', followedAt: '2025-01-20', username: 'johnd', email: 'john@example.com', location: 'New York, USA', joined: '2025-01-12' },
    { id: 2, name: 'Jane Smith', firstName: 'Jane', lastName: 'Smith', age: 29, occupation: 'Marketing Director', followedAt: '2025-01-18', username: 'janes', email: 'jane@example.com', location: 'London, UK', joined: '2025-01-09' },
    { id: 3, name: 'Michael Lee', firstName: 'Michael', lastName: 'Lee', age: 41, occupation: 'Consultant', followedAt: '2025-01-22', username: 'mikelee', email: 'mike@example.com', location: 'Toronto, CA', joined: '2025-01-21' },
    { id: 4, name: 'Sara Khan', firstName: 'Sara', lastName: 'Khan', age: 36, occupation: 'Nonprofit Leader', followedAt: '2025-01-06', username: 'sarak', email: 'sara@example.com', location: 'Dubai, UAE', joined: '2025-01-05' },
    { id: 5, name: 'Luis Garcia', firstName: 'Luis', lastName: 'Garcia', age: 32, occupation: 'Coach', followedAt: '2025-01-10', username: 'luisg', email: 'luis@example.com', location: 'Madrid, ES', joined: '2025-01-03' },
    { id: 6, name: 'Emily Chen', firstName: 'Emily', lastName: 'Chen', age: 27, occupation: 'Product Manager', followedAt: '2025-01-19', username: 'emchen', email: 'emily@example.com', location: 'Sydney, AU', joined: '2025-01-18' },
  ], []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return followersData;
    return followersData.filter((f) =>
      f.name.toLowerCase().includes(term) ||
      f.firstName.toLowerCase().includes(term) ||
      f.lastName.toLowerCase().includes(term) ||
      f.username.toLowerCase().includes(term) ||
      f.email.toLowerCase().includes(term) ||
      f.location.toLowerCase().includes(term) ||
      f.occupation.toLowerCase().includes(term)
    );
  }, [followersData, searchTerm]);

  const statsCards = useMemo(() => {
    const total = filtered.length.toString();
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const newThisMonth = filtered.filter((f) => f.followedAt.startsWith(yearMonth)).length.toString();
    const topLocation = (() => {
      const map: Record<string, number> = {};
      for (const f of filtered) map[f.location] = (map[f.location] || 0) + 1;
      const entries = Object.entries(map);
      if (entries.length === 0) return 'N/A';
      entries.sort((a, b) => b[1] - a[1]);
      return entries[0][0]; // Just the location name, no count
    })();
    const topCountry = (() => {
      const map: Record<string, number> = {};
      for (const f of filtered) {
        const country = f.location.split(',')[1]?.trim() || f.location;
        map[country] = (map[country] || 0) + 1;
      }
      const entries = Object.entries(map);
      if (entries.length === 0) return 'N/A';
      entries.sort((a, b) => b[1] - a[1]);
      return entries[0][0];
    })();

    return [
      { number: total, label: 'TOTAL FOLLOWERS', description: 'All people following you', color: '#CF3232' },
      { number: newThisMonth, label: 'NEW THIS MONTH', description: 'Followers added this month', color: '#CF3232' },
      { number: topCountry, label: 'TOP COUNTRY', description: 'Most common follower country', color: '#CF3232', smallText: true },
      { number: topLocation, label: 'TOP LOCATION', description: 'Most common follower location', color: '#CF3232', smallText: true },
    ];
  }, [filtered]);

  const handleExportFollowers = () => {
    const exportData = filtered.map((f) => ({
      'First Name': f.firstName,
      'Last Name': f.lastName,
      Age: f.age,
      'Followed On': f.followedAt,
      Occupation: f.occupation,
    }));
    if (exportData.length === 0) return;
    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map((row) => Object.values(row).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `followers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex bg-[#FFF9F9]" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        currentPage="followers"
      />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <h1 className="text-[#101117] text-lg sm:text-xl font-semibold" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                Followers
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search followers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit"
                  style={{ color: '#949494' }}
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">3</span>
                </div>
                <div className="relative">
                  <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  <span className="absolute -top-2 -right-2 bg-[#CF3232] text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">16</span>
                </div>
                <UserProfileDropdown userName="Richard Branson" />
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="relative sm:hidden mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search followers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full font-outfit"
              style={{ color: '#949494' }}
            />
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 gap-6">
            <StatsCards stats={statsCards} columns={4} />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={handleExportFollowers}
                className="bg-white text-[#CF3232] border border-[#CF3232] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Followers</span>
              </button>
              <button 
                onClick={() => setFilterOpen(true)}
                className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117]">Follower List</h2>
              </div>

              {/* Mobile Cards */}
              <div className="block sm:hidden p-4 space-y-4">
                {filtered.map((f) => (
                  <div key={f.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#101117]">{f.firstName} {f.lastName}</h3>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Follower
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Occupation: {f.occupation}</p>
                    <p className="text-gray-600 text-sm">Age: {f.age}</p>
                    <div className="text-xs text-gray-500 mt-2">Followed On: {f.followedAt}</div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">First Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Last Name</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Age</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Followed On</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Occupation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((f) => (
                      <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.firstName}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.lastName}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.email}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.age}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.followedAt}</td>
                        <td className="py-4 px-4 text-sm sm:text-base font-outfit text-[#414141]">{f.occupation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Showing {filtered.length} of {followersData.length} followers
                </p>
              </div>
            </div>
          </div>

          {/* Filter Modal */}
          {filterOpen && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setFilterOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>Filter Followers</h2>
                    <button onClick={() => setFilterOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">Search Term</label>
                    <input
                      type="text"
                      placeholder="Search by name, username, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent font-outfit"
                      style={{ color: '#949494' }}
                    />
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          <footer className="flex items-center justify-center lg:justify-end px-4 sm:px-6 py-4 border-t border-gray-200 bg-[#101117] text-white h-[131px]">
            <div className="text-xs sm:text-sm text-center">© 2025 RealLeaders. All Rights Reserved.</div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default FollowersPage;


