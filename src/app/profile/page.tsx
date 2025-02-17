'use client';

import Header from '../../components/page-ui/header';
import Sidebar from '../../components/page-ui/sidebar';
import ProfileForm from '../../components/page-ui/profile_form';
import withAuth from '@/hoc/withAuth';

function ProfilePage() {
  return (
    <>
      {/* <Header />
      <Sidebar /> */}
      <main>
        <div className="at-maincontentwrapper">
          <ProfileForm />
        </div>
      </main>
    </>
  );
}
export default withAuth(ProfilePage);
