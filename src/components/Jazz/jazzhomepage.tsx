// src\app\jazzhomepage\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, getSessionUser } from '../../utils/sessionUtility';
import Loader from '@/components/page-ui/Loader';
import withAuth from '@/hoc/withAuth';
import { useAuth } from '@/context/AuthContext';
import JazzSticker from './jazz_sticker';
import Header from '../page-ui/header';
import Sidebar from '../page-ui/sidebar';
import Image from 'next/image';

const JazzHomepage = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const sessionUser = getSessionUser();
      if (sessionUser) {
        setUser(sessionUser);
      } else {
        // toast.error('Failed to retrieve user data. Please log in again.');
        clearSession();
        router.push('/auth');
      }
    }
  }, [isLoading, router]);

  if (isLoading || !user) return <Loader />;

  return (
    <>
      {/* <Header />
    <Sidebar /> */}
      <main>
        <div className="at-maincontentwrapper">
          <div className="at-homebanner">
            <figure className="at-bannerimg">
              <Image
                src="/images/banner-jazz.png"
                alt="Banner Image"
                width={1000}
                height={1000}
              />
            </figure>
          </div>
          <JazzSticker />
        </div>
      </main>
    </>
  );
};

export default withAuth(JazzHomepage);
