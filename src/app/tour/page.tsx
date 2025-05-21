// src/app/checkout/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Tour from '@/components/page-ui/tour/tour';
import withAuth from '@/hoc/withAuth';

const TourPage = () => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const shouldShowTour =
      localStorage.getItem('showTourAfterSignup') === 'true';
    if (shouldShowTour) {
      setShowTour(true);
      localStorage.removeItem('showTourAfterSignup');
    }
  }, []);
  return <>{showTour && <Tour onFinish={() => setShowTour(false)} />}</>;
};

export default withAuth(TourPage);
