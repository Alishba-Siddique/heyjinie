// src/components/UnifiedPage.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import HomeSlider from '@/components/page-ui/home_slider';
import Loader from '@/components/page-ui/Loader'; // Adjust import path as needed

const images = [
  '/images/banner.png',
  '/images/bannertwo.png',
  '/images/bannerthree.png',
];

interface UnifiedPageProps {
  children: React.ReactNode;
}

const UnifiedPage: React.FC<UnifiedPageProps> = ({ children }) => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return null; // AuthContext will handle the redirect
  }

  return (
    <main>
      <div className="at-maincontentwrapper">
        <div className="at-homebanner">
          <figure className="at-bannerimg">
            <HomeSlider images={images} />
          </figure>
        </div>
        {children}
      </div>
    </main>
  );
};

export default UnifiedPage;