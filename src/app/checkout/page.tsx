// src/app/checkout/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import CheckOutPage from '@/components/page-ui/payment/checkout_page';

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
