// src/components/UnifiedPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, getSessionUser } from '@/utils/sessionUtility';
import Loader from '@/components/page-ui/Loader';
import withAuth from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import HomeSlider from '@/components/page-ui/home_slider';
import { toast } from 'react-toastify';

const images = [
  '/images/banner.png',
  '/images/bannertwo.png',
  '/images/bannerthree.png',
];

interface UnifiedPageProps {
  children: React.ReactNode; // Unique content for each page
}

const UnifiedPage: React.FC<UnifiedPageProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const sessionUser = getSessionUser();
      if (sessionUser) {
        setUser(sessionUser);
      } else {
        toast.error('Failed to retrieve user data. Please log in again.');
        clearSession();
        // router.push('/auth');
      }
    }
  }, [isLoading, router]);

  // if (isLoading || !user) return <Loader />;

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

export default withAuth(UnifiedPage as any);
