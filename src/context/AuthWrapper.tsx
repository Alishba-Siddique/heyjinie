// //src/context/AuthWrapper.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';

// export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (isLoading) return;

//     const isPublicPage = [
//       '/login',
//       '/signup',
//       '/reset',
//       '/verify-email',
//       '/forgot',
//       '/',
//       '/auth',
//       '/privacy-policy',
//       '/terms-conditions',
//     ].includes(pathname);

//     if (
//       isAuthenticated &&
//       isPublicPage &&
//       pathname !== '/' &&
//       pathname !== '/auth'
//     ) {
//       router.replace('/home');
//     } else if (!isAuthenticated && !isPublicPage) {
//       router.replace('/auth');
//     }
//   }, [isAuthenticated, isLoading, pathname, router]);

//   if (isLoading) {
//     return null; // or return a loading spinner
//   }

//   return <>{children}</>;
// };
