"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to Magic Publishing as default dashboard
    router.replace('/dashboard/magic-publishing');
  }, [router]);

  return null;
};


export default Dashboard;