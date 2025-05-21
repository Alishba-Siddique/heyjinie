'use client';

import ProfileForm from '../../components/page-ui/profile_form';
import withAuth from '@/hoc/withAuth';

function ProfilePage() {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          <ProfileForm />
        </div>
      </main>
    </>
  );
}
export default withAuth(ProfilePage);
