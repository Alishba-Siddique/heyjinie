//src/app/page.tsx
'use client';

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
// import Page from './signup/page';

import LoginPage from './login/page';
import UnifiedAuthComponent from '@/components/Auth/UnifiedAuthComponent';

export default function Home() {
  useAuthRedirect();
  return (
    <main className="at-main">
      {<UnifiedAuthComponent />}
    </main>
  );
}
