//src/app/page.tsx
'use client';

import UnifiedAuthComponent from '@/components/Auth/UnifiedAuthComponent';

export default function Home() {
  return <main className="at-main">{<UnifiedAuthComponent />}</main>;
}
