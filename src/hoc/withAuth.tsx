//  src/hoc/withAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  isSessionValid,
  getSessionUser,
  clearSession,
} from '../utils/sessionUtility';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

const withAuth = (WrappedComponent: React.FC) => {
  const AuthWrapper = (props: any) => {
    const router = useRouter();
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
      const checkAuth = async () => {
        if (!isSessionValid()) {
          setIsAuthenticated(false);
          router.push('/auth');
        } else {
          const sessionUser = getSessionUser();
          if (sessionUser) {
            setUser(sessionUser);
            setIsAuthenticated(true);
          } else {
            clearSession();
            toast.error('Failed to retrieve user data. Please log in again.');
            router.push('/auth');
          }
        }
      };

      checkAuth();
    }, [router, isAuthenticated]);

    // Show loader while checking authentication
    if (!isAuthenticated || !user) {
      return;
    }

    return <WrappedComponent user={user} {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;
