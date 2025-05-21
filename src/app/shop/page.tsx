// src/app/shop/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, getSessionUser } from '@/utils/sessionUtility';
import Loader from '@/components/page-ui/Loader';
import { toast } from 'react-toastify';
import withAuth from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import HomeSlider from '@/components/page-ui/home_slider';
import ShopCategories from '@/components/Product/shop_categories';

const ShopPage = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { isLoading } = useAuth();

  const images = [
    '/images/banner.png',
    '/images/bannertwo.png',
    '/images/bannerthree.png',
  ];

  useEffect(() => {
    if (!isLoading) {
      const sessionUser = getSessionUser();
      if (sessionUser) {
        setUser(sessionUser);
      } else {
        toast.error('Failed to retrieve user data. Please log in again.');
        clearSession();
        router.push('/auth');
      }
    }
  }, [isLoading, router]);

  // if (isLoading || !user) return <Loader />;

  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <div className="at-homebanner">
            <figure className="at-bannerimg">
              <HomeSlider images={images} />
            </figure>
          </div>
          <ShopCategories />
        </div>
      </main>
    </>
  );
};

export default withAuth(ShopPage);
