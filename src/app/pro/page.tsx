// src/app/home/page.tsx
'use client';

import withAuth from '@/hoc/withAuth';
import ProPage from '@/components/page-ui/pro';

const CheckOutDetailPage = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <ProPage />
        </div>
      </main>
    </>
  );
};

export default withAuth(CheckOutDetailPage);
