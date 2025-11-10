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

    // Define tour steps for sidebar menu items
    tg.addSteps([
      {
        title: '📊 Dashboard Overview',
        content: 'Welcome! This is your main dashboard where you can see all your key metrics at a glance - bookings, contacts, page views, and link clicks.',
        target: '[data-tour="dashboard"]',
        order: 1,
      },
      {
        title: '📅 Bookings This Month',
        content: 'Track all your new meetings, consultations, and events scheduled through your signature page. Stay on top of your appointments!',
        target: '[data-tour="bookings"]',
        order: 2,
      },
      {
        title: '📧 Newsletter Subscribers',
        content: 'Manage and view all the people who have joined your mailing list. Build and engage with your email audience.',
        target: '[data-tour="subscribers"]',
        order: 3,
      },
      {
        title: '👥 Followers',
        content: 'See who is following you and engage with your audience. You can export your followers list anytime for further analysis.',
        target: '[data-tour="followers"]',
        order: 4,
      },
      {
        title: '👁️ Page Views',
        content: 'Monitor how many times your signature page has been viewed. Track your reach and visibility over time.',
        target: '[data-tour="page-views"]',
        order: 5,
      },
      {
        title: '🔗 Total Link Clicks',
        content: 'See the combined total of clicks across all your links. Understand what content resonates most with your audience.',
        target: '[data-tour="link-clicks"]',
        order: 6,
      },
      {
        title: '📈 Audience Demographics',
        content: 'Get detailed insights about your audience including countries, devices, age groups, and professional roles.',
        target: '[data-tour="demographics"]',
        order: 7,
      },
      {
        title: '✨ Magic Publishing',
        content: 'Create AI-powered content, books, and podcasts to grow your brand and engage your audience. Your personal content engine!',
        target: '[data-tour="magic-publishing"]',
        order: 8,
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
