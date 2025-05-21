// // src\app\personalize\page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { clearSession, getSessionUser } from '@/utils/sessionUtility';
// import Loader from '@/components/page-ui/Loader';
// import { useAuth } from '@/context/AuthContext';
// import withAuth from '@/hoc/withAuth';
// import HomeSlider from '@/components/page-ui/home_slider';
// import PersonalizedGiftDetailPage from '@/components/Product/personalize/personalized_gifts_detail_page';

// const PersonalizedGiftsTemplatePage = () => {
// const [user, setUser] = useState<any>(null);
// const router = useRouter();
// const { isLoading } = useAuth();

//   const images = [
//     '/images/banner.png',
//     '/images/bannertwo.png',
//     '/images/bannerthree.png',
//   ];

//   const giftType = sessionStorage.getItem('selectedGiftName');

//   const slug = giftType ? giftType.toLowerCase().replace(/\s+/g, '-') : '';

//   useEffect(() => {
//     if (!isLoading) {
//       const sessionUser = getSessionUser();
//       if (sessionUser) {
//         setUser(sessionUser);
//       } else {
//         // toast.error('Failed to retrieve user data. Please log in again.');
//         clearSession();
//         router.prefetch('/auth');
//         router.push('/auth');
//       }
//     }
//   }, [isLoading, router]);

//   if (isLoading || !user) return <Loader />;

//   return (
//     <>
//       {/* <Header />
//       <Sidebar /> */}
//       <main>
//         <div className="at-maincontentwrapper">
//           <div className="at-homebanner">
//             <figure className="at-bannerimg">
//               <HomeSlider images={images} />
//             </figure>
//           </div>

//           <PersonalizedGiftDetailPage params={{ slug }} />
//         </div>
//       </main>
//     </>
//   );
// };

// export default withAuth(PersonalizedGiftsTemplatePage);

// src\app\personalize\page.tsx
'use client';
import UnifiedPage from '@/components/Auth/UnifiedPage';
import PersonalizedGiftDetailPage from '@/components/Product/personalize/personalized_gifts_detail_page';

const PersonalizedGiftsTemplatePage = () => {
  const giftType = localStorage.getItem('selectedGiftName');

  const slug = giftType ? giftType.toLowerCase().replace(/\s+/g, '-') : '';

  return (
    <UnifiedPage>
      <PersonalizedGiftDetailPage params={{ slug }} />
    </UnifiedPage>
  );
};

export default PersonalizedGiftsTemplatePage;
