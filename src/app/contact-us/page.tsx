'use client';

import ContactForm from '../../components/page-ui/contact_form';
import withAuth from '@/hoc/withAuth';
// import HomeSlider from '@/components/page-ui/home_slider';

function ContactPage() {
  return (
    <>
      <main>
        <div className="at-maincontentwrapper">
          {/* <HomeSlider
            images={['/images/banner.png', '/images/bannertwo.png', '/images/bannerthree.png']}
          /> */}
          <ContactForm />
        </div>
      </main>
    </>
  );
}

export default withAuth(ContactPage);