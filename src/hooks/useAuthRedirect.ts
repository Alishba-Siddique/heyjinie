// src/hooks/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "../utils/cookieUtility";
import { useAuth } from "@/context/AuthContext";
import { isSessionValid, setSession } from "../utils/sessionUtility";

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsAuthenticated, setIsLoading } = useAuth();

  useEffect(() => {
    const token = getCookie("authToken");
    const userData = getCookie("userData");
    const isPublicPage = ["/login", "/signup", "/reset", "/verify-email", "/forgot", "/"].includes(pathname);

    const isValid = isSessionValid();

    // Check session validity
    if (token) {
      if (isValid) {
        setIsAuthenticated(true);
        setSession(token, userData);
        if (isPublicPage) {
          router.push("/homepage");
        }
      } else {
        setIsAuthenticated(false);
        router.push("/auth");
      }
    } else {
      setIsAuthenticated(false);
      if (!isPublicPage) {
        router.push("/auth");
      }
    }
    setIsLoading(false);
  }, [pathname, router, setIsAuthenticated, setIsLoading]);

}