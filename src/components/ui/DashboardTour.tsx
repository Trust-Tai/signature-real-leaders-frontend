"use client";

import { useEffect, useState } from 'react';

interface DashboardTourProps {
  onComplete: () => void;
}

export const DashboardTour: React.FC<DashboardTourProps> = ({ onComplete }) => {
  const [tourStarted, setTourStarted] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      startTour();
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTour = async () => {
    if (tourStarted) return;
    setTourStarted(true);

    // Dynamic import to avoid SSR issues
    const { TourGuideClient } = await import('@sjmc11/tourguidejs/dist/tour');

    const tg = new TourGuideClient({
      dialogClass: 'dashboard-tour',
      nextLabel: 'Next →',
      prevLabel: '← Back',
      finishLabel: 'Finish Tour',
      showStepProgress: true,
      showStepDots: true,
      stepDotsPlacement: 'footer',
      progressBar: '#CF3232',
      backdropColor: 'rgba(16, 17, 23, 0.85)',
      exitOnClickOutside: false,
      exitOnEscape: true,
      keyboardControls: true,
      autoScroll: true,
      autoScrollSmooth: true,
      dialogAnimate: true,
      targetPadding: 10,
      dialogMaxWidth: 400,
    });

    // Define tour steps for sidebar menu items - Updated structure
    tg.addSteps([
      {
        title: 'Dashboard - Your Analytics Hub',
        content: 'Your complete analytics center with 4 powerful tabs: Dashboard (overview), Page Views (traffic), Page Clicks (link performance), and Members (follower management). All your insights in one place!',
        target: '[data-tour="analytics"]',
        order: 1,
      },
      {
        title: 'Following',
        content: 'See the RSS feeds and profiles you are following. Stay updated with content from your network.',
        target: '[data-tour="following"]',
        order: 2,
      },
      {
        title: 'Leads',
        content: 'Manage and view all the people who have joined your mailing list. Build and engage with your email audience. This is a Pro feature!',
        target: '[data-tour="subscribers"]',
        order: 3,
      },
      {
        title: 'Magic Studio - Your Content Creation Engine',
        content: 'Create AI-powered content, articles, books, and podcasts to grow your brand. This is your personal content creation studio! This is a Pro feature!',
        target: '[data-tour="magic-publishing"]',
        order: 4,
      },
      {
        title: 'Help Center',
        content: 'Need assistance? Access our help center for guides, FAQs, and support resources.',
        target: '[data-tour="help"]',
        order: 5,
      },
    ]);

    tg.onFinish(() => {
      localStorage.setItem('dashboard_tour_completed', 'true');
      onComplete();
    });

    tg.onBeforeExit(() => {
      localStorage.setItem('dashboard_tour_completed', 'true');
      onComplete();
    });

    tg.start();
  };

  return null;
};
