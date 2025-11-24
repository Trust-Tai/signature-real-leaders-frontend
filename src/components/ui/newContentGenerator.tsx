import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, MessageSquare, Mic, Mail, Video, BookOpen, Sparkles, Loader2, X } from 'lucide-react';
import { getAllContent, GenerationRequest, Article, SocialPost, Chapter, generateTopics, getGeneratedContent, TopicSuggestion } from '@/lib/magicPublishingApi';
import { useMagicPublishing } from '@/hooks/useMagicPublishing';
import { toast } from '@/components/ui/toast';
import LoadingScreen from './LoadingScreen';

interface Example {
  title: string;
  content: string;
}

interface ContentType {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  examples: Example[];
  apiType: string;
}

const NewContentGenerator: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contentData, setContentData] = useState<Record<string, Example[]>>({});
  
  // Articles specific states
  const [articleTopic, setArticleTopic] = useState('');
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [topicSuggestions, setTopicSuggestions] = useState<TopicSuggestion[]>([]);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  
  const { handleGenerateArticles } = useMagicPublishing('articles');
  
  const contentTypes: ContentType[] = [
    {
      id: 'articles',
      icon: FileText,
      title: 'Articles',
      description: 'Generate long-form thought leadership articles tailored to your audience',
      gradient: 'from-red-900 to-red-700',
      apiType: 'articles',
      examples: [
        {
          title: 'The Future of AI in Business Leadership',
          content: 'As artificial intelligence continues to reshape the business landscape, leaders must adapt their strategies to leverage these transformative technologies. This comprehensive guide explores how forward-thinking executives are integrating AI into decision-making processes...'
        },
        {
          title: 'Building Resilient Teams in Remote Work Environments',
          content: 'The shift to remote work has fundamentally changed how teams collaborate and maintain productivity. Successful leaders are discovering new approaches to building trust, maintaining culture, and fostering innovation across distributed teams...'
        }
      ]
    },
    {
      id: 'social',
      icon: MessageSquare,
      title: 'Social Posts',
      description: 'Create engaging social media content for LinkedIn, Twitter, and more',
      gradient: 'from-purple-900 via-pink-800 to-teal-700',
      apiType: 'social_posts',
      examples: [
        {
          title: 'Leadership lessons from unexpected failures',
          content: '🚀 Here\'s what nobody tells you about failure: It\'s not the opposite of success—it\'s a stepping stone to it.\n\nLast quarter, our biggest product launch flopped. Hard.\n\nBut here\'s what we learned:\n✓ Fast feedback beats perfect planning\n✓ Team resilience > individual brilliance\n✓ Customer truth > internal assumptions\n\nThe best leaders don\'t avoid failure. They learn from it faster than anyone else.'
        },
        {
          title: 'The power of asking better questions',
          content: '💡 Stop giving answers. Start asking better questions.\n\nThe best leaders I know don\'t have all the solutions.\n\nThey ask:\n• What problem are we really solving?'
        }
      ]
    },
    {
      id: 'podcast',
      icon: Mic,
      title: 'Podcast Scripts',
      description: 'Develop podcast outlines, interview questions, and episode scripts',
      gradient: 'from-gray-900 to-red-900',
      apiType: 'podcasts',
      examples: [
        {
          title: 'Interview: Scaling a Startup from 10 to 100 Employees',
          content: '[INTRO HOOK]\nHost: Today we\'re diving into one of the hardest transitions any founder faces—scaling from a tight-knit team of 10 to a full-fledged company of 100.\n\n[KEY QUESTIONS]\n1. What was the biggest mistake you made during rapid growth?\n2. How did your leadership style need to evolve?\n3. What systems did you wish you\'d implemented earlier?'
        },
        {
          title: 'Leadership Under Pressure: Decision Making in Crisis',
          content: '[INTRO HOOK]\nHost: When everything is on fire, how do great leaders stay calm and make the right calls?\n\n[KEY QUESTIONS]\n1. Describe your worst leadership crisis\n2. What\'s your decision-making framework under pressure?\n3. How do you maintain team morale during tough times?'
        }
      ]
    },
    {
      id: 'newsletter',
      icon: Mail,
      title: 'Newsletters',
      description: 'Create engaging email newsletters with compelling subject lines',
      gradient: 'from-gray-700 via-red-800 to-gray-600',
      apiType: 'newsletters',
      examples: [
        {
          title: 'Weekly Leadership Insights: Decision Fatigue',
          content: 'Subject: The Hidden Cost of Too Many Choices\n\n👋 Hey there,\n\nEver notice how the best CEOs wear the same thing every day?\n\nIt\'s not laziness—it\'s strategy.\n\nThis week, let\'s talk about decision fatigue and how to protect your mental energy for what matters most...\n\n[Read time: 3 minutes]'
        },
        {
          title: 'Monthly Roundup: Innovation in Leadership',
          content: 'Subject: 5 Leaders Who Changed Everything This Month\n\n👋 Hey there,\n\nThis month was wild. Here are 5 leadership moves that caught my attention and what we can learn from them...\n\n[Read time: 5 minutes]'
        }
      ]
    },
    {
      id: 'video',
      icon: Video,
      title: 'Video Scripts',
      description: 'Write short-form and long-form video scripts with hooks and CTAs',
      gradient: 'from-red-950 to-red-800',
      apiType: 'videos',
      examples: [
        {
          title: '3 Productivity Hacks That Actually Work',
          content: '[HOOK - First 3 seconds]\n"I used to work 12-hour days. Now I work 6 hours and get twice as much done. Here\'s how."\n\n[MAIN CONTENT]\n1. Time blocking (not task lists)\n2. The 2-minute rule\n3. Energy management over time management\n\n[CTA]\n"Which hack will you try first? Comment below!"'
        },
        {
          title: 'Why Your Team Isn\'t Performing',
          content: '[HOOK - First 3 seconds]\n"Your team isn\'t lazy. Your leadership system is broken. Here\'s the fix."\n\n[MAIN CONTENT]\n1. Clear expectations vs micromanagement\n2. Trust-based accountability\n3. Removing blockers, not adding pressure\n\n[CTA]\n"Tag a leader who needs to see this!"'
        }
      ]
    },
    {
      id: 'books',
      icon: BookOpen,
      title: 'Books',
      description: 'Outline book chapters and develop thought leadership content',
      gradient: 'from-gray-950 to-red-950',
      apiType: 'book',
      examples: [
        {
          title: 'The Adaptive Leader: Thriving in Constant Change',
          content: 'Chapter 1: Why Traditional Leadership Is Failing\n\nThe playbook that worked for decades is broken. Leaders who rely on hierarchy, control, and five-year plans are finding themselves obsolete. This chapter explores why adaptability has become the most critical leadership skill of our time...'
        },
        {
          title: 'Leading Through Complexity: A Modern Framework',
          content: 'Chapter 3: Building Antifragile Organizations\n\nWhat if your company could get stronger from chaos? This chapter introduces the concept of antifragility in leadership and provides practical frameworks for building organizations that thrive under pressure...'
        }
      ]
    }
  ];

  // Fetch dynamic content for each type
  useEffect(() => {
    const fetchAllContent = async () => {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const fetchPromises = contentTypes.map(async (type) => {
          try {
            const response = await getAllContent(type.apiType, token, {
              page: 1,
              per_page: 2,
              status: 'completed'
            });

            if (response.success && response.generation_requests) {
              const examples = response.generation_requests.map((item: GenerationRequest) => {
                const title = item.title || 'Untitled';
                let content = '';

                // Extract content based on type
                if (type.id === 'articles' && item.generated_content) {
                  const articles = (item.generated_content as { articles?: Article[] }).articles;
                  if (articles && articles.length > 0) {
                    content = articles[0].content.substring(0, 300) + '...';
                  }
                } else if (type.id === 'social' && item.generated_content) {
                  const posts = (item.generated_content as { social_posts?: SocialPost[] }).social_posts;
                  if (posts && posts.length > 0) {
                    content = posts[0].content.substring(0, 300) + '...';
                  }
                } else if (type.id === 'books' && item.generated_content) {
                  const chapters = (item.generated_content as { chapters?: Chapter[] }).chapters;
                  if (chapters && chapters.length > 0) {
                    content = `Chapter 1: ${chapters[0].title}\n\n${chapters[0].content.substring(0, 250)}...`;
                  }
                } else {
                  content = item.content_preview || item.content_summary || 'No preview available';
                }

                return { title, content };
              });

              return { typeId: type.id, examples };
            }
            return { typeId: type.id, examples: [] };
          } catch (error) {
            console.error(`Error fetching ${type.id}:`, error);
            return { typeId: type.id, examples: [] };
          }
        });

        const results = await Promise.all(fetchPromises);
        const dataMap: Record<string, Example[]> = {};
        results.forEach(({ typeId, examples }) => {
          dataMap[typeId] = examples;
        });
        setContentData(dataMap);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  // Handle auto-generate topic for articles
  const handleAutoGenerateTopic = async () => {
    try {
      setIsGeneratingTopic(true);
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }

      console.log('[NewContentGenerator] Starting topic generation...');
      toast.info('Generating topic suggestions...', { autoClose: 2000 });

      const response = await generateTopics(token);

      if (response.success) {
        console.log('[NewContentGenerator] Topic generation started:', response);
        toast.success('Topic generation started! Fetching suggestions...', { autoClose: 2000 });

        // Poll for completion
        const pollInterval = setInterval(async () => {
          try {
            const contentResponse = await getGeneratedContent(response.content_id.toString(), token);
            
            if (contentResponse.success && contentResponse.content) {
              if (contentResponse.content.status === 'completed') {
                clearInterval(pollInterval);
                console.log('[NewContentGenerator] Topics generated:', contentResponse.content.generated_content);
                
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
            console.error('[NewContentGenerator] Polling error:', pollError);
          }
        }, 5000);

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
      console.error('[NewContentGenerator] Topic generation error:', error);
      toast.error('Error generating topics');
      setIsGeneratingTopic(false);
    }
  };

  // Handle generate article content
  const handleGenerateArticle = async () => {
    try {
      if (!articleTopic.trim()) {
        toast.error('Please enter a topic');
        return;
      }

      setIsGeneratingArticle(true);
      console.log('[NewContentGenerator] Starting article generation with topic:', articleTopic);
      toast.info('Starting article generation...', { autoClose: 2000 });

      const response = await handleGenerateArticles({
        topic: articleTopic.trim()
      });

      if (response) {
        console.log('[NewContentGenerator] Article generation started:', response);
        toast.success('Article generation started! Redirecting to articles page...', { autoClose: 3000 });
        
        // Clear the topic input
        setArticleTopic('');
        
        // Redirect to articles page after a short delay
        setTimeout(() => {
          router.push('/dashboard/magic-publishing/content');
        }, 1500);
      }
    } catch (error) {
      console.error('[NewContentGenerator] Article generation error:', error);
      toast.error('Error generating articles');
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  const handleMoreClick = (typeId: string): void => {
    const routes: Record<string, string> = {
      articles: '/dashboard/magic-publishing/content',
      social: '/dashboard/magic-publishing/social-posts',
      podcast: '/dashboard/magic-publishing/podcasts',
      newsletter: '/dashboard/magic-publishing/newsletters',
      video: '/dashboard/magic-publishing/videos',
      books: '/dashboard/magic-publishing/books'
    };
    
    const route = routes[typeId];
    if (route) {
      router.push(route);
    }
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
     
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-3">
            Magic Publishing Content Generator
          </h1>
          <p className="text-gray-600 text-center text-lg">
            Create AI-powered thought leadership content tailored to your voice, audience, and goals.
          </p>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          const isArticles = type.id === 'articles';
          
          return (
            <div key={type.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
        
              <div className={`bg-gradient-to-br ${type.gradient} p-8 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{type.title}</h2>
                    <p className="text-white/90 text-lg">{type.description}</p>
                  </div>
                </div>
              </div>

             
              <div className="p-8 border-b border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={isArticles ? articleTopic : ''}
                    onChange={(e) => isArticles && setArticleTopic(e.target.value)}
                    placeholder="Enter topic or auto-generate one..."
                    className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-lg"
                    disabled={isArticles && (isGeneratingTopic || isGeneratingArticle)}
                  />
                  {isArticles && (
                    <button 
                      onClick={handleAutoGenerateTopic}
                      disabled={isGeneratingTopic || isGeneratingArticle}
                      className="p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Auto Generate Topic"
                    >
                      {isGeneratingTopic ? (
                        <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
                      ) : (
                        <Sparkles className="w-6 h-6 text-gray-600" />
                      )}
                    </button>
                  )}
                  {!isArticles && (
                    <button className="p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                      <Sparkles className="w-6 h-6 text-gray-600" />
                    </button>
                  )}
                  <button 
                    onClick={isArticles ? handleGenerateArticle : undefined}
                    disabled={isArticles && (!articleTopic.trim() || isGeneratingTopic || isGeneratingArticle)}
                    className="px-8 py-4 bg-[#CF3232] hover:bg-red-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isArticles && isGeneratingArticle ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
              </div>

            
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-red-500" />
                  <h3 className="text-xl font-bold text-gray-900">
                    {contentData[type.id] && contentData[type.id].length > 0 ? 'Your Recent Content' : 'Example Content'}
                  </h3>
                </div>
                
                <div className="space-y-6">
                  {(contentData[type.id] && contentData[type.id].length > 0 
                    ? contentData[type.id] 
                    : type.examples
                  ).map((example, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-red-300 transition-colors">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">
                        {example.title}
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {example.content}
                      </p>
                    </div>
                  ))}
                </div>

              
                <div className="mt-6 text-center">
                  <button
                    onClick={() => handleMoreClick(type.id)}
                    className="px-6 py-3 bg-[#CF3232] text-white font-semibold rounded-xl hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
                  >
                    See More {type.title}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
                    setArticleTopic(suggestion.topic);
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
                        setArticleTopic(suggestion.topic);
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
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Article Generation Loading Modal */}
      {isGeneratingArticle && (
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
              <h3 className="text-xl font-bold text-[#101117] mb-2">Generating Article...</h3>
              <p className="text-gray-600 text-center mb-4">
                Creating your article content. You&apos;ll be redirected to the articles page shortly.
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
    </div>
  );
};

export default NewContentGenerator;