"use client";

import React from 'react';
import { Rss, ExternalLink, Clock } from 'lucide-react';

interface RSSFeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

interface RSSFeed {
  id: number;
  title: string;
  url: string;
  latest_items: RSSFeedItem[];
}

interface RSSFeedDisplayProps {
  feed: RSSFeed;
}

const RSSFeedDisplay: React.FC<RSSFeedDisplayProps> = ({ feed }) => {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Rss className="w-5 h-5 text-[#CF3232]" />
        <h3 className="text-lg font-semibold text-[#101117]">{feed.title}</h3>
      </div>

      {/* RSS Feed Items */}
      <div className="space-y-4">
        {feed.latest_items.length === 0 ? (
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-500">No content available</p>
          </div>
        ) : (
          feed.latest_items.map((item, index) => (
            <div 
              key={index}
              className="p-4 bg-[#FFF9F9] rounded-lg border border-gray-100 hover:border-[#CF3232]/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-base font-semibold text-[#101117] flex-1">
                  {item.title}
                </h4>
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 p-1 hover:bg-white rounded transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4 text-[#CF3232]" />
                </a>
              </div>
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(item.pubDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RSSFeedDisplay;
