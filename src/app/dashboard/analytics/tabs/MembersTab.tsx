"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2, ExternalLink, X, Eye } from 'lucide-react';
import Image from 'next/image';
import { getMembers, type Member, type MembersFilters } from '@/lib/membersApi';
import { toast } from '@/components/ui/toast';
import { WP_URL, APP_URL } from '@/lib/config';

const MembersTab = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 1
  });

  const fetchMembers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const filters: MembersFilters = {
        page,
        per_page: 20
      };

      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await getMembers(filters);
      setMembers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchMembers(1);
  }, [fetchMembers]);

  const handlePageChange = (page: number) => {
    fetchMembers(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMembers(1);
  };

  const handleViewDetails = (member: Member) => {
    setSelectedMember(member);
    setDetailsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Stats, Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Total Members Stats */}
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total.toLocaleString()}</p>
            </div>
            <div className="hidden sm:block h-12 w-px bg-gray-200"></div>
            <div className="hidden sm:block">
              <p className="text-sm text-gray-600">Page {pagination.page} of {pagination.total_pages}</p>
            </div>
          </div>

          {/* Search */}
          <div className="w-full lg:w-auto lg:min-w-[400px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
          <p className="text-gray-500">No members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {members.map((member) => (
            <div
              key={member.post_id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-red-200 transition-all duration-200 relative"
            >
              {/* Industry Badge - Top Left */}
              {member.industry && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                    {member.industry}
                  </span>
                </div>
              )}

              {/* Profile Avatar/Image */}
              <div className="mb-4 -mx-5 -mt-5">
                {member.user_image_url ? (
                  <div className="w-full h-48 overflow-hidden rounded-t-xl">
                    <img 
                      src={member.user_image_url} 
                      alt={member.profile_name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-red-100 to-red-200 rounded-t-xl flex items-center justify-center">
                    <span className="text-6xl font-bold text-red-700">
                      {member.first_name?.[0]}{member.last_name?.[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="text-center mb-4">
                <button
                  onClick={() => handleViewDetails(member)}
                  className="text-lg font-bold text-gray-900 mb-1 hover:text-red-600 transition-colors cursor-pointer"
                >
                  {member.profile_name}
                </button>
                <p className="text-sm text-gray-600 mb-1">
                  {member.company_name}
                </p>
                {member.job_title && (
                  <span className="inline-block bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full">
                    {member.job_title}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(member)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>

                {member.user_id ? (
                  <a
                    href={`${WP_URL}/${member.profile_name.toLowerCase().replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href={`${APP_URL}/claim-profile?id=${member.post_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white hover:bg-gray-50 text-red-600 text-sm font-medium rounded-lg border-2 border-red-600 transition-colors"
                  >
                    <span>Claim Profile</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && members.length > 0 && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.total_pages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.total_pages}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Member Details Modal */}
      {detailsModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            {/* Close Button */}
            <button
              onClick={() => setDetailsModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>

            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              {/* Left Side - Profile Image - Only show if image exists */}
              {selectedMember.user_image_url && (
                <div className="md:w-2/5 bg-black flex items-center justify-center overflow-hidden">
                  <img 
                    src={selectedMember.user_image_url} 
                    alt={selectedMember.profile_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Right Side - Details (Full Width when no image) */}
              <div className={`${selectedMember.user_image_url ? 'md:w-3/5' : 'w-full'} bg-[#1a1a1a] p-6 md:p-8 overflow-y-auto`}>
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-1 h-16 bg-red-600 rounded-full"></div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">
                        {selectedMember.profile_name}
                      </h2>
                      <p className="text-red-500 text-lg font-medium">
                        {selectedMember.company_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-4 mb-6">
                  {/* Job Title */}
                  {selectedMember.job_title && (
                    <div className="bg-[#252525] rounded-xl p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Job Title</p>
                      <p className="text-white text-base">{selectedMember.job_title}</p>
                    </div>
                  )}

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#252525] rounded-xl p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Email</p>
                      <p className="text-white text-base break-all">{selectedMember.email}</p>
                    </div>
                    {selectedMember.phone && (
                      <div className="bg-[#252525] rounded-xl p-4">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Phone</p>
                        <p className="text-white text-base">{selectedMember.phone}</p>
                      </div>
                    )}
                  </div>

                  {/* Industry */}
                  {selectedMember.industry && (
                    <div className="bg-[#252525] rounded-xl p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Industry</p>
                      <p className="text-white text-base">{selectedMember.industry}</p>
                    </div>
                  )}

                  {/* Location */}
                  {selectedMember.location && (
                    <div className="bg-[#252525] rounded-xl p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Location</p>
                      <p className="text-white text-base">{selectedMember.location}</p>
                    </div>
                  )}

                  {/* Asset Type & Asset Class */}
                  {(selectedMember.asset_type || selectedMember.asset_class) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedMember.asset_type && (
                        <div className="bg-[#252525] rounded-xl p-4">
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Asset Type</p>
                          <p className="text-white text-base">{selectedMember.asset_type}</p>
                        </div>
                      )}
                      {selectedMember.asset_class && (
                        <div className="bg-[#252525] rounded-xl p-4">
                          <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Asset Class</p>
                          <p className="text-white text-base">{selectedMember.asset_class}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Deal Size */}
                  {selectedMember.deal_size && (
                    <div className="bg-[#252525] rounded-xl p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Deal Size</p>
                      <p className="text-white text-base">{selectedMember.deal_size}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Horizontal Layout */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
                  {selectedMember.website && (
                    <a
                      href={selectedMember.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-colors text-sm"
                    >
                      <span>Visit Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {selectedMember.linkedin && (
                    <a
                      href={selectedMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-[#0077B5] hover:bg-[#006399] text-white font-medium rounded-lg transition-colors text-sm"
                    >
                      <span>LinkedIn</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {selectedMember.user_id ? (
                    <a
                      href={`${WP_URL}/${selectedMember.profile_name.toLowerCase().replace(/\s+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <a
                      href={`${APP_URL}/claim-profile?id=${selectedMember.post_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                    >
                      <span>Claim Profile</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MembersTab;
