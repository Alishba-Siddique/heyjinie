// src/context/AuthContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
  useRef, // Import useRef
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isSessionValid, setSession, clearSession } from '../utils/sessionUtility';
import { getCookie } from '@/utils/cookieUtility';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void; // Keep if needed by other parts, but auth flow should manage it
  user: any | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true); // Initial load is true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Ref to track if initial check is done for the current path
  const initialCheckCompletedForPath = useRef<Record<string, boolean>>({});
  const currentPathRef = useRef<string>(pathname);


  const logout = useCallback(() => {
    clearSession();
    setIsAuthenticated(false);
    setUser(null);
    // Reset completion tracker on logout for all paths, or specifically for /auth
    initialCheckCompletedForPath.current = {}; 
    router.replace('/auth');
  }, [router]); // Dependencies for useCallback

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // If path changed, reset completion status for the new path and set loading
      if (pathname !== currentPathRef.current) {
        initialCheckCompletedForPath.current[pathname] = false;
        currentPathRef.current = pathname;
        if (isMounted) setIsLoading(true);
      } else if (!initialCheckCompletedForPath.current[pathname] && isMounted) {
        // If same path, but initial check not marked complete (e.g. first run for this path)
        setIsLoading(true);
      }
      // If initialCheckCompletedForPath.current[pathname] is true, setIsLoading(true) is skipped, preventing flicker.

      const token = getCookie('authToken');
      const userDataString = getCookie('userData');
      const valid = isSessionValid();

      const publicPages = [
        '/login', '/signup', '/reset', '/verify-email', '/auth',
        '/forgot', '/privacy-policy', '/terms-conditions', '/',
      ];
      const isPublicPage = publicPages.includes(pathname);

      let newIsAuthenticated = false;
      let newUserData = null;

      if (token && valid && userDataString) {
        try {
          const parsedUser = JSON.parse(userDataString);
          newUserData = parsedUser;
          newIsAuthenticated = true;
          // await setSession(token, parsedUser); // Call if session needs active update

          if (pathname === '/auth' && isMounted) {
            router.replace('/home');
            // Don't set isLoading(false) or other states here; new path's useEffect will handle.
            return; 
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          if (isMounted) clearSession(); // Clear only if mounted
          // newIsAuthenticated and newUserData remain false/null
        }
      }
      
      // If not authenticated and not on a public page, redirect
      if (!newIsAuthenticated && !isPublicPage && isMounted) {
        router.replace('/auth');
         // Don't set isLoading(false) or other states here; new path's useEffect will handle.
        return;
      }

      if (isMounted) {
        setIsAuthenticated(newIsAuthenticated);
        setUser(newUserData);
        setIsLoading(false);
        initialCheckCompletedForPath.current[pathname] = true; // Mark check as complete for this path
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]); // Keep dependencies, logic inside handles conditions

  const contextValue = useMemo(() => ({
    isLoading,
    isAuthenticated,
    setIsAuthenticated, // Make sure this is stable if passed (it is from useState)
    user,
    logout,
  }), [isLoading, isAuthenticated, user, logout]); // Add setIsAuthenticated if it's part of the value.

  return (
    <AuthContext.Provider value={contextValue}>
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