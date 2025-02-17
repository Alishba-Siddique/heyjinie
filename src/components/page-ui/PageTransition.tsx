// src/components/PageTransition.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation
import Loader from '@/components/page-ui/Loader';
import { motion } from 'framer-motion';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Simulate loading on navigation
  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Wrap router.push to trigger loading state
    const originalPush = router.push;
    router.push = async (...args) => {
      handleStart();
      await originalPush(...args);
      handleComplete();
    };

    return () => {
      // Restore original push if necessary (not strictly needed in this context)
      router.push = originalPush;
    };
  }, [router]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

export default PageTransition;
