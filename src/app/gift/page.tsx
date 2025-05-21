'use client';

import Image from 'next/image';
import MyGifts from '../../components/page-ui/my_gifts';

export default function MyGiftPage() {
  return (
    <>
      {/* <Header />
      <Sidebar /> */}
      <main>
        <div className="at-maincontentwrapper">
          {/* <HomeSlider/> */}
          {/* <div className="at-homebanner">
            <figure className="at-bannerimg">
              <Image
                src="/images/banner.png"
                alt="Banner Image"
                width={1000}
                height={1000}
              />
            </figure>
          </div> */}
          <MyGifts />
        </div>
      </main>
    </>
  );
}
