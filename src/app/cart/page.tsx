// src/app/cart/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import CartPage from '@/components/page-ui/payment/cart_page';

const CartListPage = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <CartPage />
        </div>
      </main>
    </>
  );
};

export default withAuth(CartListPage);
