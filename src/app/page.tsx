'use client';

import HeroSection from '@/components/ui/hero-section';
import FooterBanner from '@/components/ui/home-page-footer';
import EventCarousel from '@/components/ui/open-registration';
import PodcastSection from '@/components/ui/podcast-page';
import React from 'react';
const Home = () => {

  return (
    <div className="">
      <HeroSection />
       <EventCarousel />
       <PodcastSection />
       <FooterBanner />
    </div>
  )
 

};

export default Home;
