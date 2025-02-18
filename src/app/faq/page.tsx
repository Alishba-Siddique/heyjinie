// src/app/homepage/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import FAQAccordion from '@/components/page-ui/faq';

const FAQPage = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <FAQAccordion />
        </div>
      </main>
    </>
  );
};

export default withAuth(FAQPage);
