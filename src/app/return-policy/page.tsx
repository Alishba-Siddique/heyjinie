// src/app/return-policy/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import Return_Policy from '@/components/page-ui/return_policy_page';

const ReturnPolicyPage = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <Return_Policy/>
        </div>
      </main>
    </>
  );
};

export default withAuth(ReturnPolicyPage);
