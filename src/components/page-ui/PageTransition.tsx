// src/components/page-ui/PageTransition.tsx

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    // const loadingTimeout = setTimeout(() => {
      const isContentReady = true;
      if (isContentReady) {
        setLoading(false);
      }
    // }, 1000);

    // return () => clearTimeout(loadingTimeout);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
