// src/components/layouts/AuthenticatedLayout.tsx
'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/page-ui/sidebar';
import Header from '@/components/page-ui/header';
import PageTransition from '@/components/page-ui/PageTransition';
import { usePathname } from 'next/navigation';
import ChatPage from '../page-ui/chat';
import Loader from '@/components/page-ui/Loader'; // Adjust import path as needed

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // Define public routes
  const publicRoutes = [
    '/login',
    '/signup', 
    '/reset',
    '/verify-email',
    '/auth',
    '/forgot',
    '/privacy-policy',
    '/terms-conditions',
    '/', // Add root path if it should be public
  ];

  const isPublicRoute = publicRoutes.includes(pathname);

  // Show loader while authentication is being checked
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }

  // For public routes, render without sidebar/header regardless of auth status
  if (isPublicRoute) {
    return <PageTransition>{children}</PageTransition>;
  }

  // For protected routes, only render if authenticated
  // AuthContext will handle redirects for unauthenticated users
  if (!isAuthenticated) {
    return null; // Don't render anything, let AuthContext handle the redirect
  }

  // For authenticated users on protected routes, render with full layout
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="content-wrapper">
        <Header />
        <PageTransition>{children}</PageTransition>
        <ChatPage />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;