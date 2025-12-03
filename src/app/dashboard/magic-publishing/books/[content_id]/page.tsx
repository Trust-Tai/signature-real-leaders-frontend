"use client";

import React, { useState, useEffect } from 'react';
import { Search, Menu, Loader2, BookOpen } from 'lucide-react';
import { UserProfileSidebar } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { useRouter, useParams } from 'next/navigation';
import { getGeneratedContent, pollForCompletion } from '@/lib/magicPublishingApi';
import BookDetail from '../components/BookDetail';

const BookContentPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [contentStatus, setContentStatus] = useState<'processing' | 'completed' | 'failed' | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const params = useParams();
    const contentId = params.content_id as string;

    useEffect(() => {
        const checkContentStatus = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await getGeneratedContent(contentId, token);

                if (response.success && response.content) {
                    setContentStatus(response.content.status);

                    // If still processing, start polling
                    if (response.content.status === 'processing') {
                        pollForCompletion(
                            contentId,
                            (content) => {
                                setContentStatus(content.status);
                            },
                            () => {
                                setContentStatus('completed');
                            },
                            (errorMessage) => {
                                setError(errorMessage);
                                setContentStatus('failed');
                            },
                            async () => {
                                // Refresh callback - not needed for individual page
                            }
                        );
                    }
                } else {
                    setError('Failed to fetch content');
                }
            } catch (error) {
                console.error('Error checking content status:', error);
                setError(error instanceof Error ? error.message : 'Unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        if (contentId) {
            checkContentStatus();
        }
    }, [contentId, router]);

    const handleBackToBooks = () => {
        router.push('/dashboard/magic-publishing/books');
    };

    if (isLoading) {
        return (
            <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <UserProfileSidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    currentPage="magic-publishing-books"
                />

                <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
                    <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <Menu className="w-6 h-6 text-gray-600" />
                                </button>
                                <h1 className="text-[#101117] text-lg sm:text-xl font-semibold">
                                    Magic Publishing (Books)
                                </h1>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="relative hidden sm:block">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search here..."
                                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit"
                                        style={{ color: '#949494' }}
                                    />
                                </div>

                                <div className="flex items-center space-x-4">
                                   
                                    <UserProfileDropdown />
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto">
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin text-[#cf3232] mb-4 mx-auto" />
                                <p className="text-gray-600">Loading book content...</p>
                            </div>
                        </div>
                    </main>

                    <DashBoardFooter />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <UserProfileSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentPage="magic-publishing-books"
            />

            <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
                <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Menu className="w-6 h-6 text-gray-600" />
                            </button>
                            <h1 className="text-[#101117] text-lg sm:text-xl font-semibold">
                                Magic Publishing (Books)
                            </h1>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search here..."
                                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-48 md:w-64 font-outfit"
                                    style={{ color: '#949494' }}
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                               
                                <UserProfileDropdown />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8 space-y-6">

                        {/* Magic Publishing Header */}
                       

                        {/* Content Area */}
                        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600">{error}</p>
                                </div>
                            )}

                            {contentStatus === 'processing' && (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="relative mb-6">
                                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#cf3232] shadow-lg"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-ping w-6 h-6 bg-[#cf3232] rounded-full opacity-75"></div>
                                        </div>
                                        <div className="absolute -inset-2 rounded-full border-2 border-gray-300 opacity-30 animate-pulse"></div>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#101117] mb-4">🚀 Generating Your Book...</h3>
                                    <p className="text-gray-600 text-center max-w-md mb-6 text-sm sm:text-base px-4">
                                        Your book is being generated with AI assistance. This may take several minutes to complete.
                                    </p>
                                    <div className="flex space-x-1 justify-center mb-6">
                                        <span className="animate-bounce inline-block w-3 h-3 bg-[#cf3232] rounded-full shadow-lg" style={{ animationDelay: '0ms' }}></span>
                                        <span className="animate-bounce inline-block w-3 h-3 bg-gray-500 rounded-full shadow-lg" style={{ animationDelay: '150ms' }}></span>
                                        <span className="animate-bounce inline-block w-3 h-3 bg-gray-400 rounded-full shadow-lg" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                    <div className="bg-gradient-to-r from-[#f9efef] to-[#fee3e3] px-4 sm:px-6 py-4 rounded-lg shadow-md mx-4 sm:mx-0">
                                        <p className="text-xs sm:text-sm text-[#333333] font-medium text-center">
                                            ✨ Creating amazing content for you. This usually takes a few moments...
                                        </p>
                                    </div>
                                </div>
                            )}

                            {contentStatus === 'failed' && (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                        <BookOpen className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold text-[#101117] mb-2">Generation Failed</h3>
                                    <p className="text-gray-600 text-center max-w-md mb-4 text-sm sm:text-base px-4">
                                        {error || 'There was an error generating your book. Please try again.'}
                                    </p>
                                    <button
                                        onClick={handleBackToBooks}
                                        className="px-4 py-2 bg-[#cf3232] text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                                    >
                                        Back to Books
                                    </button>
                                </div>
                            )}

                            {contentStatus === 'completed' && (
                                <BookDetail
                                    contentId={contentId}
                                    onBack={handleBackToBooks}
                                />
                            )}
                        </div>

                    </div>
                </main>

                {/* Fixed Footer */}
                <DashBoardFooter />
            </div>
        </div>
    );
};

export default BookContentPage;