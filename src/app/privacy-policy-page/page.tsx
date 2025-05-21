// src/app/privacy-policy/page.tsx
'use client';

import Privacy_Policy_Page from "@/components/page-ui/privacy_policy_page";
import withAuth from "@/hoc/withAuth";

const PrivacyPolicyPage = () => {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <Privacy_Policy_Page />
        </div>
      </main>
    </>
  );
};

export default withAuth(PrivacyPolicyPage);
