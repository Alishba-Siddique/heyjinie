// src/app/terms-conditions/page.tsx
'use client';

import TermsAndConditionsPage from "@/components/page-ui/terms_conditions_page";
import withAuth from "@/hoc/withAuth";

const TermsConditionsPage = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <TermsAndConditionsPage />
        </div>
      </main>
    </>
  );
};

export default withAuth(TermsConditionsPage);
