"use client";

import React, { useState } from 'react';
import { Bell, User, Menu, X, Calendar, ExternalLink, Plus, Download } from 'lucide-react';
import UserProfileSidebar from '@/components/ui/UserProfileSidebar';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import { StatsCards } from '@/components';
import DashBoardFooter from '@/components/ui/dashboardFooter';

const TotalLinkClicks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [allLinksModalOpen, setAllLinksModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    category: 'general'
  });
  const [links, setLinks] = useState([
    { id: 1, link: 'Book Consultation', url: '/book-consultation', clicks: 456, ctr: '8.2%', change: '+15.3%', trend: 'up', category: 'consultation' },
    { id: 2, link: 'Download Guide', url: '/download-guide', clicks: 389, ctr: '6.8%', change: '+22.1%', trend: 'up', category: 'resource' },
    { id: 3, link: 'Contact Us', url: '/contact', clicks: 312, ctr: '5.4%', change: '+8.7%', trend: 'up', category: 'contact' },
    { id: 4, link: 'LinkedIn Profile', url: 'https://linkedin.com/in/richard-branson', clicks: 298, ctr: '12.3%', change: '+18.9%', trend: 'up', category: 'social' },
    { id: 5, link: 'Email Newsletter', url: '/newsletter-signup', clicks: 245, ctr: '4.1%', change: '-2.3%', trend: 'down', category: 'newsletter' },
    { id: 6, link: 'Portfolio', url: '/portfolio', clicks: 198, ctr: '3.2%', change: '+11.4%', trend: 'up', category: 'portfolio' },
    { id: 7, link: 'Testimonials', url: '/testimonials', clicks: 167, ctr: '2.8%', change: '+7.6%', trend: 'up', category: 'testimonial' },
    { id: 8, link: 'FAQ', url: '/faq', clicks: 134, ctr: '2.1%', change: '-1.8%', trend: 'down', category: 'faq' }
  ]);

  const statsCards = [
    { number: '2,183', label: 'TOTAL LINK CLICKS', description: 'Combined total of clicks across all links', color: '#CF3232' },
    { number: '5.8%', label: 'AVERAGE CTR', description: 'Click-through rate across all links', color: '#CF3232' },
    { number: '18', label: 'ACTIVE LINKS', description: 'Number of tracked links', color: '#CF3232' },
    { number: '24.7%', label: 'GROWTH RATE', description: 'Monthly click increase', color: '#CF3232' }
  ];

  const clickTrends = [
    { day: 'Mon', clicks: 156, change: '+12%' },
    { day: 'Tue', clicks: 189, change: '+18%' },
    { day: 'Wed', clicks: 234, change: '+25%' },
    { day: 'Thu', clicks: 198, change: '+8%' },
    { day: 'Fri', clicks: 267, change: '+32%' },
    { day: 'Sat', clicks: 145, change: '+5%' },
    { day: 'Sun', clicks: 123, change: '-2%' }
  ];

  const handleAddLink = () => {
    if (newLink.name && newLink.url) {
      const newLinkItem = {
        id: links.length + 1,
        link: newLink.name,
        url: newLink.url,
        clicks: 0,
        ctr: '0%',
        change: '0%',
        trend: 'up',
        category: newLink.category
      };
      setLinks([...links, newLinkItem]);
      setNewLink({ name: '', url: '', category: 'general' });
      setAddLinkModalOpen(false);
    }
  };

  const handleGenerateReport = () => {
    const reportData = {
      totalLinks: links.length,
      totalClicks: links.reduce((sum, link) => sum + link.clicks, 0),
      averageCTR: (links.reduce((sum, link) => sum + parseFloat(link.ctr), 0) / links.length).toFixed(1) + '%',
      topPerformingLink: links.reduce((max, link) => link.clicks > max.clicks ? link : max, links[0]),
      dateGenerated: new Date().toLocaleDateString()
    };
    
    // Create and download report
    const reportContent = `
Link Click Analytics Report
Generated on: ${reportData.dateGenerated}

Summary:
- Total Links: ${reportData.totalLinks}
- Total Clicks: ${reportData.totalClicks.toLocaleString()}
- Average CTR: ${reportData.averageCTR}
- Top Performing Link: ${reportData.topPerformingLink.link} (${reportData.topPerformingLink.clicks} clicks)

Detailed Performance:
${links.map(link => `${link.link}: ${link.clicks} clicks, ${link.ctr} CTR, ${link.change} change`).join('\n')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `link-analytics-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="total-link-clicks"
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
                Link Click Analytics
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Date Range Selector */}
              <div className="hidden sm:flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>Last year</option>
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
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Stats Cards */}
            <StatsCards stats={statsCards} columns={4} />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Link Clicks Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                  Top Performing Links
                </h2>
                
                {/* Mobile View - Cards */}
                <div className="block lg:hidden space-y-3">
                  {links.slice(0, 4).map((link) => (
                    <div key={link.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-[#101117] text-sm">{link.link}</h3>
                        <span className={`text-xs font-medium ${
                          link.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {link.change}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-[#101117]">{link.clicks}</span>
                        <span className="text-sm text-gray-600">CTR: {link.ctr}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{link.url}</p>
                    </div>
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Link</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Clicks</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">CTR</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Change</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {links.map((link) => (
                        <tr key={link.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-[#101117] text-sm">{link.link}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{link.clicks.toLocaleString()}</td>
                          <td className="py-4 px-4 text-sm text-gray-700">{link.ctr}</td>
                          <td className="py-4 px-4">
                            <span className={`text-sm font-medium ${
                              link.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {link.change}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-[#CF3232] hover:text-red-600 text-sm font-medium">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Daily Click Trends */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                  Daily Click Trends
                </h2>
                
                <div className="space-y-3">
                  {clickTrends.map((day, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-12">{day.day}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-[#CF3232] h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(day.clicks / 267) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center space-x-2 w-20">
                        <span className="text-sm font-medium text-[#101117]">
                          {day.clicks}
                        </span>
                        <span className={`text-xs ${
                          day.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {day.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Peak day: Friday (267 clicks, +32%)
                  </p>
                </div>
              </div>
            </div>

            {/* Link Performance Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                Link Performance Summary
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">8</h3>
                  <p className="text-sm text-gray-600">Links with &gt;10% CTR</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">12</h3>
                  <p className="text-sm text-gray-600">Links with &gt;5% CTR</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">6</h3>
                  <p className="text-sm text-gray-600">Links with &gt;100 clicks</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-2xl font-bold text-[#101117] mb-1">85%</h3>
                  <p className="text-sm text-gray-600">Links performing above avg</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">
                Quick Actions
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setAddLinkModalOpen(true)}
                  className="bg-[#CF3232] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Link</span>
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="bg-white text-[#CF3232] border border-[#CF3232] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate Report</span>
                </button>
                <button 
                  onClick={() => setAllLinksModalOpen(true)}
                  className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View All Links</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Add New Link Modal */}
          {addLinkModalOpen && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setAddLinkModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                      Add New Link
                    </h2>
                    <button
                      onClick={() => setAddLinkModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Link Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Link Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter link name..."
                      value={newLink.name}
                      onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Link URL */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Link URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com or /page-path"
                      value={newLink.url}
                      onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-[#101117] mb-3">
                      Category
                    </label>
                    <select
                      value={newLink.category}
                      onChange={(e) => setNewLink({...newLink, category: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]"
                    >
                      <option value="general">General</option>
                      <option value="consultation">Consultation</option>
                      <option value="resource">Resource</option>
                      <option value="contact">Contact</option>
                      <option value="social">Social Media</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="testimonial">Testimonial</option>
                      <option value="faq">FAQ</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setAddLinkModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLink}
                    className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Add Link
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* All Links Modal */}
          {allLinksModalOpen && (
            <div 
              className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300"
              onClick={() => setAllLinksModalOpen(false)}
            >
              <div 
                className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#101117]" style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}>
                      All Links ({links.length})
                    </h2>
                    <button
                      onClick={() => setAllLinksModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Link Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">URL</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Category</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Clicks</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">CTR</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {links.map((link) => (
                          <tr key={link.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-4 px-4 font-medium text-[#101117]">{link.link}</td>
                            <td className="py-4 px-4 text-sm text-gray-700 max-w-[200px] truncate">{link.url}</td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {link.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{link.clicks.toLocaleString()}</td>
                            <td className="py-4 px-4 text-sm text-gray-700">{link.ctr}</td>
                            <td className="py-4 px-4">
                              <span className={`text-sm font-medium ${
                                link.trend === 'up' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {link.change}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setAllLinksModalOpen(false)}
                    className="px-6 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Fixed Footer */}
        <DashBoardFooter />
      </div>
    </div>
  );
};

export default TotalLinkClicks;
