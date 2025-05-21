// // src/context/AuthContext.tsx

// 'use client';

// import  { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import { isSessionValid, setSession } from '../utils/sessionUtility';
// import { getCookie } from '@/utils/cookieUtility';

// interface AuthContextType {
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   setIsAuthenticated: (authenticated: boolean) => void;
//   user: any | null;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const checkAuth = async () => {
//       setIsLoading(true);

//       const token = getCookie('authToken');
//       const userDataString = getCookie('userData');
//       const valid = isSessionValid();

//       // Define public pages
//       const isPublicPage = ["/login", "/signup", "/reset", "/verify-email", "/forgot", "/", "/auth"].includes(pathname);

//       if (token && valid && userDataString) {
//         try {
//           const userData = JSON.parse(userDataString);
//           setUser(userData);
//           setIsAuthenticated(true);

//           // Ensure the session is set
//           await setSession(token, userData);

//           // Redirect to homepage if on a public page
//           if (isPublicPage && pathname !== "/") {
//             router.replace('/home');
//           }
//         } catch (error) {
//           console.error('Error parsing user data:', error);
//           setIsAuthenticated(false);
//           setUser(null);
//           if (!isPublicPage) {
//             router.replace('/auth');
//           }
//         }
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//         if (!isPublicPage) {
//           router.replace('/auth');
//         }
//       }

//       // Only set loading to false after everything is done
//       setTimeout(() => {
//         setIsLoading(false);
//       }, 500); // Small delay to ensure UI transitions are smooth
//     };

//     checkAuth();
//   }, [pathname, router]);

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoading,
//         isAuthenticated,
//         setIsAuthenticated,
//         user
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
// src/context/AuthContext.tsx

'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isSessionValid, setSession } from '../utils/sessionUtility';
import { getCookie } from '@/utils/cookieUtility';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      // Set loading to true initially
      setIsLoading(true);

      const token = getCookie('authToken');
      const userDataString = getCookie('userData');
      const valid = isSessionValid();

      // Define public pages
      const isPublicPage = [
        '/login',
        '/signup',
        '/reset',
        '/verify-email',
        '/forgot',
        '/auth',
        '/privacy-policy',
        '/terms-conditions',
      ].includes(pathname);

      if (token && valid && userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          setUser(userData);
          setIsAuthenticated(true);

          // Ensure the session is set
          await setSession(token, userData);

          // Redirect to homepage if on a public page
          if (isPublicPage && pathname !== '/' && pathname !== '/auth') {
            router.replace('/home');
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsAuthenticated(false);
          setUser(null);
          if (!isPublicPage) {
            router.replace('/auth');
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        if (!isPublicPage) {
          router.replace('/auth');
        }
      }

      // Set loading to false after authentication check
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
