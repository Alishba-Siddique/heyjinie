'use client';

import OrderHistory from '@/components/page-ui/order_history_page';
import withAuth from '@/hoc/withAuth';

function OrderHistoryPage() {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <OrderHistory />
        </div>
      </main>
    </>
  );
}

export default withAuth(OrderHistoryPage);
