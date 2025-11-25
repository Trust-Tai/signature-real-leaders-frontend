"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Plus, Download, X } from 'lucide-react';
import { StatsCards } from '@/components';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/toast';

const PageClicksTab = () => {
  const [loading, setLoading] = useState(true);
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '', category: 'general' });
  
  const [statsData, setStatsData] = useState({
    total_clicks: 0,
    average_click_through_rate: 0,
    active_links: 0,
    monthly_click_growth_rate: { percentage: '0%', trend: 'up' as 'up' | 'down' | 'stable' },
    performance_summary: {
      above_10_percent_ctr: 0,
      above_5_percent_ctr: 0,
      above_100_clicks: 0,
      above_average_performance: 0
    },
    hourly_click_segments: {} as { [key: string]: number },
    top_performing_links: [] as Array<{
      link_id: number;
      name: string;
      url: string;
      total_clicks: number;
      click_through_rate: number;
      monthly_growth_rate: { percentage: string; trend: string };
    }>
  });
  
  const [links, setLinks] = useState<Array<{
    id: number;
    link: string;
    url: string;
    clicks: number;
    ctr: string;
    change: string;
    trend: 'up' | 'down';
    category: string;
  }>>([]);

  useEffect(() => {
    const fetchLinkStats = async () => {
      try {
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
          toast.error('Please login to view stats');
          return;
        }

        const response = await api.getLinkStats(authToken);
        if (response.success) {
          setStatsData(response.data);
          
          const transformedLinks = response.data.top_performing_links.map((link) => ({
            id: link.link_id,
            link: link.name,
            url: link.url,
            clicks: link.total_clicks,
            ctr: `${link.click_through_rate.toFixed(1)}%`,
            change: link.monthly_growth_rate.percentage,
            trend: link.monthly_growth_rate.trend as 'up' | 'down',
            category: 'general'
          }));
          
          setLinks(transformedLinks);
        }
      } catch (error) {
        console.error('Error fetching link stats:', error);
        toast.error('Failed to load link statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchLinkStats();
  }, []);

  const statsCards = [
    { number: loading ? '...' : statsData.total_clicks.toLocaleString(), label: 'TOTAL LINK CLICKS', description: 'Combined total of clicks across all links', color: '#CF3232' },
    { number: loading ? '...' : `${statsData.average_click_through_rate.toFixed(1)}%`, label: 'AVERAGE CTR', description: 'Click-through rate across all links', color: '#CF3232' },
    { number: loading ? '...' : statsData.active_links.toString(), label: 'ACTIVE LINKS', description: 'Number of tracked links', color: '#CF3232' },
    { number: loading ? '...' : statsData.monthly_click_growth_rate.percentage, label: 'MONTHLY GROWTH RATE', description: 'Monthly click increase', color: '#CF3232', trend: statsData.monthly_click_growth_rate.trend }
  ];

  const hourlyClickData = useMemo(() => {
    if (!statsData.hourly_click_segments || Object.keys(statsData.hourly_click_segments).length === 0) {
      return [
        { time: '00:00', clicks: 0 }, { time: '04:00', clicks: 0 }, { time: '08:00', clicks: 0 },
        { time: '12:00', clicks: 0 }, { time: '16:00', clicks: 0 }, { time: '20:00', clicks: 0 }
      ];
    }

    return Object.entries(statsData.hourly_click_segments)
      .map(([time, clicks]) => ({ time, clicks }))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [statsData.hourly_click_segments]);

  const handleAddLink = () => {
    if (newLink.name && newLink.url) {
      const newLinkItem = {
        id: links.length + 1,
        link: newLink.name,
        url: newLink.url,
        clicks: 0,
        ctr: '0%',
        change: '0%',
        trend: 'up' as 'up' | 'down',
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[#101117]">Page Clicks Analytics</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-600" />
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      <StatsCards stats={statsCards} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">Top Performing Links</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#CF3232]"></div>
              <p className="mt-2 text-gray-600">Loading links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-8"><p className="text-gray-600">No links found</p></div>
          ) : (
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100" style={{ backgroundColor: '#FEE3E3CC' }}>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Link</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Clicks</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">CTR</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#101117]">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#101117] text-sm">{link.link}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 font-semibold">{link.clicks.toLocaleString()}</td>
                      <td className="py-4 px-4 text-sm text-gray-700">{link.ctr}</td>
                      <td className="py-4 px-4">
                        <span className={`text-sm font-medium ${link.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {link.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">Hourly Click Trends</h2>
          
          <div className="space-y-3">
            {hourlyClickData.map((data, index) => {
              const maxClicks = Math.max(...hourlyClickData.map(d => d.clicks), 1);
              const widthPercentage = (data.clicks / maxClicks) * 100;
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 w-12">{data.time}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div className="bg-[#CF3232] h-3 rounded-full transition-all duration-300" style={{ width: `${widthPercentage}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-[#101117] w-16 text-right">{data.clicks}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {hourlyClickData.length > 0 && (() => {
                const maxClicks = Math.max(...hourlyClickData.map(d => d.clicks));
                const peakTime = hourlyClickData.find(d => d.clicks === maxClicks);
                return peakTime ? `Peak time: ${peakTime.time} (${maxClicks.toLocaleString()} clicks)` : 'No click data available';
              })()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">Link Performance Summary</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-[#101117] mb-1">{loading ? '...' : statsData.performance_summary.above_10_percent_ctr}</h3>
            <p className="text-sm text-gray-600">Links with &gt;10% CTR</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-[#101117] mb-1">{loading ? '...' : statsData.performance_summary.above_5_percent_ctr}</h3>
            <p className="text-sm text-gray-600">Links with &gt;5% CTR</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-[#101117] mb-1">{loading ? '...' : statsData.performance_summary.above_100_clicks}</h3>
            <p className="text-sm text-gray-600">Links with &gt;100 clicks</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-[#101117] mb-1">{loading ? '...' : statsData.performance_summary.above_average_performance}</h3>
            <p className="text-sm text-gray-600">Links performing above avg</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-4">Quick Actions</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => setAddLinkModalOpen(true)} className="bg-[#CF3232] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" /><span>Add New Link</span>
          </button>
          <button onClick={handleGenerateReport} className="bg-white text-[#CF3232] border border-[#CF3232] px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" /><span>Generate Report</span>
          </button>
        </div>
      </div>

      {addLinkModalOpen && (
        <div className="fixed inset-0 bg-opacity-[0.3] z-40 flex items-center justify-center p-4 transition-opacity duration-300" onClick={() => setAddLinkModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative z-50 transform transition-all duration-300 scale-100" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#101117]">Add New Link</h2>
                <button onClick={() => setAddLinkModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#101117] mb-3">Link Name</label>
                <input type="text" placeholder="Enter link name..." value={newLink.name} onChange={(e) => setNewLink({...newLink, name: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#101117] mb-3">Link URL</label>
                <input type="url" placeholder="https://example.com or /page-path" value={newLink.url} onChange={(e) => setNewLink({...newLink, url: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117] placeholder-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#101117] mb-3">Category</label>
                <select value={newLink.category} onChange={(e) => setNewLink({...newLink, category: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CF3232] focus:border-transparent text-[#101117]">
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
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button onClick={() => setAddLinkModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAddLink} className="flex-1 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-600 transition-colors">Add Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageClicksTab;
