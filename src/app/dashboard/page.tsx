"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to Analytics as default dashboard
    router.replace('/dashboard/analytics');
  }, [router]);

  return null;
};


export default Dashboard;