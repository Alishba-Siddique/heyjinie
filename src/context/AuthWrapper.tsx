//src/context/AuthWrapper.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Define public pages
    const isPublicPage = ["/login", "/signup", "/reset", "/verify-email", "/forgot", "/", "/auth"].includes(pathname);
    
    // Only handle redirects if we're not in a loading state
    if (!isLoading) {
      if (isAuthenticated && isPublicPage && pathname !== "/" && pathname !== "/auth") {
        router.replace('/home');
      } else if (!isAuthenticated && !isPublicPage) {
        router.replace('/auth');
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return <>{children}</>;
};