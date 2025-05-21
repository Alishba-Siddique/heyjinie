// src/app/delivery-policy/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import Delivery_Policy from '@/components/page-ui/delivery_policy_page';

const DeliveryPolicyPage = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <Delivery_Policy />
        </div>
      </main>
    </>
  );
};

export default withAuth(DeliveryPolicyPage);
