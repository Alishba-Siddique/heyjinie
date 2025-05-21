// // src\app\personalize\page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { clearSession, getSessionUser } from '../../utils/sessionUtility';
// import Loader from '@/components/page-ui/Loader';
// import { useAuth } from '@/context/AuthContext';
// import withAuth from '@/hoc/withAuth';
// // import Header from '../../components/header/header';
// // import Sidebar from '../../components/sidebar/sidebar';
// import HomeSlider from '../../components/page-ui/home_slider';
// // import PersonalizedGifts from '@/components/personalized_gifts/personalized_gifts';
// import PersonalizedGiftsIcon from '@/components/Product/personalize/personalized_gifts_icons';

// const PersonalizedGiftsPage = () => {
//   const [user, setUser] = useState<any>(null);
//   const router = useRouter();
//   const { isLoading } = useAuth();

//   const images = [
//     '/images/banner.png',
//     '/images/bannertwo.png',
//     '/images/bannerthree.png',
//   ];

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
//           <div className="at-pagesectiontitle">
//             <h2>
//               <br />
//               Personalize
//             </h2>
//           </div>
//           <PersonalizedGiftsIcon />
//         </div>
//       </main>
//     </>
//   );
// };

// export default withAuth(PersonalizedGiftsPage);

// src\app\personalize\page.tsx
'use client';
import UnifiedPage from '@/components/Auth/UnifiedPage';
import PersonalizedGiftsIcon from '@/components/Product/personalize/personalized_gifts_icons';

const PersonalizedGiftsPage = () => {
  return (
    <UnifiedPage>
      <PersonalizedGiftsIcon />
    </UnifiedPage>
  );
};

export default PersonalizedGiftsPage;
