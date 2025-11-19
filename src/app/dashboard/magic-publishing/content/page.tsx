"use client";

import React, { useState } from 'react';
import { Search, Bell, Menu, Users, Sparkles, Loader2, ArrowLeft, X } from 'lucide-react';
import { UserProfileSidebar } from '@/components';
import UserProfileDropdown from '@/components/ui/UserProfileDropdown';
import GeneratedArticlesList from './components/GeneratedContentsList';
import DashBoardFooter from '@/components/ui/dashboardFooter';
import { useRouter } from 'next/navigation';
import { generateTopics, getGeneratedContent, TopicSuggestion } from '@/lib/magicPublishingApi';
import { toast } from '@/components/ui/toast';
import { useMagicPublishing } from '@/hooks/useMagicPublishing';

const MagicPublishingContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [topicSuggestions, setTopicSuggestions] = useState<TopicSuggestion[]>([]);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { handleGenerateArticles, fetchAllGenerationRequests } = useMagicPublishing('articles');

  const BRAND_RED = "#E74B3B";

  const handleAutoGenerateTopic = async () => {
    try {
      setIsGeneratingTopic(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      console.log('[Content Page] Starting topic generation...');
      toast.info('Generating topic suggestions...', { autoClose: 2000 });

      // Call generate topics API
      const response = await generateTopics(token);

      if (response.success) {
        console.log('[Content Page] Topic generation started:', response);
        toast.success('Topic generation started! Fetching suggestions...', { autoClose: 2000 });

        // Poll for completion
        const pollInterval = setInterval(async () => {
          try {
            const contentResponse = await getGeneratedContent(response.content_id.toString(), token);
            
            if (contentResponse.success && contentResponse.content) {
              if (contentResponse.content.status === 'completed') {
                clearInterval(pollInterval);
                console.log('[Content Page] Topics generated:', contentResponse.content.generated_content);
                
                // Extract topics from generated_content
                if (Array.isArray(contentResponse.content.generated_content)) {
                  setTopicSuggestions(contentResponse.content.generated_content as TopicSuggestion[]);
                  setShowTopicModal(true);
                  toast.success(`🎉 ${contentResponse.content.generated_content.length} topic suggestions generated!`, { autoClose: 3000 });
                } else {
                  toast.error('Invalid topic format received');
                }
                setIsGeneratingTopic(false);
              } else if (contentResponse.content.status === 'failed') {
                clearInterval(pollInterval);
                toast.error('Topic generation failed');
                setIsGeneratingTopic(false);
              }
            }
          } catch (pollError) {
            console.error('[Content Page] Polling error:', pollError);
          }
        }, 5000); // Poll every 5 seconds

        // Timeout after 60 seconds
        setTimeout(() => {
          clearInterval(pollInterval);
          if (isGeneratingTopic) {
            setIsGeneratingTopic(false);
            toast.error('Topic generation timeout');
          }
        }, 60000);
      } else {
        toast.error('Failed to start topic generation');
        setIsGeneratingTopic(false);
      }
    } catch (error) {
      console.error('[Content Page] Topic generation error:', error);
      toast.error('Error generating topics');
      setIsGeneratingTopic(false);
    }
  };

  const handleGenerateContent = async () => {
    try {
      if (!topic.trim()) {
        toast.error('Please enter a topic');
        return;
      }

      console.log('[Content Page] Starting article generation with topic:', topic);
      toast.info('Starting article generation...', { autoClose: 2000 });

      // Call generate articles API with topic
      const response = await handleGenerateArticles({
        topic: topic.trim()
      });

      if (response) {
        console.log('[Content Page] Article generation started:', response);
        toast.success('Article generation started! Check the list below for progress.', { autoClose: 3000 });
        
        // Refresh the articles list to show processing item
        await fetchAllGenerationRequests();
        setRefreshTrigger(prev => prev + 1);
        
        // Clear the topic input
        setTopic('');
      }
    } catch (error) {
      console.error('[Content Page] Article generation error:', error);
      toast.error('Error generating articles');
    }
  };


  return (
    <div className="h-screen flex bg-[#FFF9F9] overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <UserProfileSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="magic-publishing-content"
      />

      {/* Right Side (Header + Main Content + Footer) */}
      <div className="flex-1 flex flex-col w-full lg:w-auto h-full">
        
        {/* Fixed Header */}
        <header className="bg-[#FFF9F9] px-4 sm:px-6 py-4 flex-shrink-0 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              
              {/* Back Arrow */}
              <button
                onClick={() => router.push('/dashboard/magic-publishing')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                title="Back to Content Generator"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#CF3232] transition-colors" />
              </button>
              
              <h1 
                className="text-[#101117] text-lg sm:text-xl font-semibold" 
                style={{ fontFamily: 'Outfit SemiBold, sans-serif' }}
              >
                Magic Publishing (Articles)
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
                <div className="relative">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
               
                </div>
                <div className="relative">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              
                </div>
                <UserProfileDropdown />
              </div>
            </div>
          </div>
          
       
          <div className="sm:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search here..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full font-outfit"
                style={{ color: '#949494' }}
              />
            </div>
          </div>
        </header>





        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
         

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Generate Article</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Article Topic
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Enter a topic or auto-generate one..."
                      className="flex h-10 w-full text-[#333333] rounded-md border border-input  px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
                      disabled={isGeneratingTopic}
                    />
                    <button
                      onClick={handleAutoGenerateTopic}
                      disabled={isGeneratingTopic}
                      className="inline-flex text-[#333333] items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input  hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      {isGeneratingTopic ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" style={{ color: BRAND_RED }} />
                      )}
                      Auto Generate Topic
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGenerateContent}
                  disabled={!topic.trim()}
                  style={{ background: BRAND_RED }}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </button>
              </div>
            </div>


            {/* <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#101117]">Magic Publishing</h2>
                  <Info className="w-5 h-5 text-gray-400" />
                </div>
                <button 
                  onClick={() => router.push('/dashboard/magic-publishing/setup')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  Edit Details
                </button>
              </div>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">Generate and manage your content across all platforms.</p>
              
         
              <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit overflow-x-auto">
                <div 
                 onClick={()=>router.push("/dashboard/magic-publishing/setup")}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Setup</span>
                </div>
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/content")}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md bg-[#CF3232] text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Content</span>
                </div>
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/books")}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Books</span>
                </div>
                <div 
                onClick={()=>router.push("/dashboard/magic-publishing/podcasts")}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Mic className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Podcasts</span>
                </div>
              </div>
            </div> */}

            
            {/* <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-[#101117] mb-2">
                    Article Generation
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Generate new articles with AI-powered content creation
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#CF3232] text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Article</span>
                </button>
              </div>
            </div> */}


            {/* {showForm && (
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <MagicPublishingForm onClose={() => setShowForm(false)} />
              </div>
            )} */}

           
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <GeneratedArticlesList refreshTrigger={refreshTrigger} />
            </div>

          </div>
        </main>
        
        {/* Fixed Footer */}
         <DashBoardFooter />
      </div>

      {/* Loading Modal for Topic Generation */}
      {isGeneratingTopic && !showTopicModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              {/* Animated Loader */}
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-[#CF3232]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-ping w-8 h-8 bg-[#CF3232] rounded-full opacity-75"></div>
                </div>
              </div>
              
              {/* Loading Text */}
              <h3 className="text-xl font-bold text-[#101117] mb-2">Generating Topics...</h3>
              <p className="text-gray-600 text-center mb-4">
                Our AI is crafting personalized topic suggestions for you
              </p>
              
              {/* Animated Dots */}
              <div className="flex space-x-2 justify-center">
                <span className="animate-bounce inline-block w-2 h-2 bg-[#CF3232] rounded-full" style={{ animationDelay: '0ms' }}></span>
                <span className="animate-bounce inline-block w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '150ms' }}></span>
                <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic Suggestions Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#101117]">Topic Suggestions</h2>
              <button
                onClick={() => setShowTopicModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {topicSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#CF3232] hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setTopic(suggestion.topic);
                    setShowTopicModal(false);
                    toast.success('Topic selected!');
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-[#101117] flex-1">{suggestion.topic}</h3>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {suggestion.category}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded capitalize">
                        {suggestion.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        🔥 {suggestion.trending_score}/10
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {suggestion.content_angle}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTopic(suggestion.topic);
                        setShowTopicModal(false);
                        toast.success('Topic selected!');
                      }}
                      className="px-4 py-2 bg-[#CF3232] text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Select Topic
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
              <button
                onClick={handleAutoGenerateTopic}
                disabled={isGeneratingTopic}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isGeneratingTopic ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating More...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate More Topics</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowTopicModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicPublishingContent;

