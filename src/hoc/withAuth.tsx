// src/hoc/withAuth.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import Loader from '@/components//page-ui/Loader'; // Adjust import path as needed

const withAuth = (WrappedComponent: React.FC) => {
  const AuthWrapper = (props: any) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Show loader while checking authentication
    // if (isLoading) {
    //   return <Loader />;
    // }

    // If not authenticated, AuthContext will handle the redirect
    // We just don't render the component
    if (!isAuthenticated || !user) {
      return null;
    }

    return <WrappedComponent user={user} {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;