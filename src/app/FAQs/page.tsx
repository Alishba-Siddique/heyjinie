// src/app/checkout/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import FAQAccordion from '@/components/page-ui/faq';

const FAQ = () => {
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

export default withAuth(FAQ);
