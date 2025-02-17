// src/components/AuthWrapper.tsx

"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  useAuthRedirect(); // Handles redirection
  return <>{children}</>;
};
