// src/app/homepage/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import CheckOutPage from '@/components/page-ui/checkout_page';

const CheckOutDetailPage = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <CheckOutPage />
        </div>
      </main>
    </>
  );
};

export default withAuth(CheckOutDetailPage);
