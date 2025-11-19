'use client'
import React from 'react';
import Image from 'next/image';
import { Sparkles, FileText, MessageSquare, Mic, Megaphone, Mail, Video, BookOpen } from 'lucide-react';
import articlesImg from '@/assets/images/content-articles-bg.jpg';
import socialImg from '@/assets/images/content-social-bg.jpg';
import podcastImg from '@/assets/images/content-podcast-bg.jpg';
import calendarImg from '@/assets/images/content-calendar-bg.jpg';
import newsletterImg from '@/assets/images/content-newsletter-bg.jpg';
import videoImg from '@/assets/images/content-video-bg.jpg';
import booksImg from '@/assets/images/content-books-bg.jpg';

const BRAND_RED = "#E74B3B";
const CANVAS = "#FFF6F3";

interface ContentTypeCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
  bgImage: string | { src: string; height: number; width: number };
  status: 'beta' | 'coming-soon';
}

export default function ContentGenerator() {
  const contentTypes: ContentTypeCard[] = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Articles",
      description: "Generate long-form thought leadership articles tailored to your audience",
      path: "/dashboard/magic-publishing/content",
      bgImage: articlesImg,
      status: "beta"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Books",
      description: "Outline book chapters and develop thought leadership content",
      path: "/dashboard/magic-publishing/books",
      bgImage: booksImg,
      status: "beta"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Podcasts",
      description: "Develop podcast outlines, interview questions, and episode scripts",
      path: "/dashboard/magic-publishing/podcasts",
      bgImage: podcastImg,
      status: "beta"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Social Posts",
      description: "Create engaging social media content for LinkedIn, Twitter, and more",
      path: "/dashboard/magic-publishing/social-posts",
      bgImage: socialImg,
      status: "beta"
    },
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: "Content Calendar",
      description: "Generate a strategic content calendar tailored to your platforms and goals",
      path: "/content/calendar",
      bgImage: calendarImg,
      status: "coming-soon"
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Newsletters",
      description: "Create engaging email newsletters with compelling subject lines",
      path: "/content/newsletters",
      bgImage: newsletterImg,
      status: "coming-soon"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Video Scripts",
      description: "Write short-form and long-form video scripts with hooks and CTAs",
      path: "/content/videos",
      bgImage: videoImg,
      status: "coming-soon"
    }
  ];


  

  const handleCardClick = (path: string, status?: 'beta' | 'coming-soon') => {
    // Only navigate if not coming soon
    if (status !== 'coming-soon' && typeof window !== 'undefined') {
      console.log('Navigating to:', path);
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: CANVAS }}>
      <main className="flex-1 min-h-screen">
        {/* Header */}
        

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-3">
              What would you like to generate?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Choose a content type below to start creating AI-powered thought leadership content 
              tailored to your voice, audience, and goals.
            </p>
          </div>

          {/* Content Type Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTypes.map((contentType, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(contentType.path, contentType.status)}
                disabled={contentType.status === 'coming-soon'}
                className={`relative overflow-hidden rounded-2xl shadow-lg transition-all text-left group h-80 border border-neutral-200/50 ${
                  contentType.status === 'coming-soon' 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-2xl cursor-pointer'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={contentType.bgImage}
                    alt={contentType.title}
                    fill
                    className={`object-cover transition-transform duration-500 ${
                      contentType.status !== 'coming-soon' ? 'group-hover:scale-110' : ''
                    }`}
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-70`} />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                
                {/* Badge */}
                {contentType.status && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-800">
                      {contentType.status === 'beta' ? 'Beta' : 'Coming Soon'}
                    </span>
                  </div>
                )}
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6">
                  {/* Icon */}
                  <div 
                    className={`w-14 h-14 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 transition-transform ${
                      contentType.status !== 'coming-soon' ? 'group-hover:scale-110' : ''
                    }`}
                    style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <div className="text-white">
                      {contentType.icon}
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {contentType.title}
                    </h3>
                    <p className="text-sm text-white/90 mb-4">
                      {contentType.description}
                    </p>
                    {contentType.status === 'beta' && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-white transition-all group-hover:gap-3">
                        Generate now
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-200 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-neutral-900 mb-3">
                Need help getting started?
              </h3>
              <p className="text-neutral-600 mb-6">
                Complete your Magic Publishing profile to get personalized content recommendations 
                and automated weekly content generation.
              </p>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.href = '/dashboard/magic-publishing/setup';
                  }
                }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold h-10 px-6 py-2 text-white transition-colors hover:opacity-90"
                style={{ background: BRAND_RED }}
              >
                Complete Your Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}