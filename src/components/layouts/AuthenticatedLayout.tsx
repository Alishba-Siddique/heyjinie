// src/components/layouts/AuthenticatedLayout.tsx
'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/page-ui/sidebar';
import Header from '@/components/page-ui/header';
import PageTransition from '@/components/page-ui/PageTransition';
import { usePathname } from 'next/navigation';
import ChatPage from '../page-ui/chat';

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // Check if current path is a public route
  const isPublicRoute = [
    '/login',
    '/signup',
    '/reset',
    '/verify-email',
    '/auth',
    '/forgot',
    '/privacy-policy',
    '/terms-conditions',
  ].includes(pathname);

  // For public routes or unauthenticated users, render without sidebar/header
  if (isPublicRoute || !isAuthenticated) {
    return <PageTransition>{children}</PageTransition>;
  }

  // For authenticated users on protected routes, render with sidebar/header
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="content-wrapper">
        <Header />
        <PageTransition>{children}</PageTransition>
        {isAuthenticated && <ChatPage />}
      </div>
    </div>
  );
};

export default AuthenticatedLayout;