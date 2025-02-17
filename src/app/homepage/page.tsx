// // src/app/homepage/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { clearSession, getSessionUser } from '../../utils/sessionUtility';
// import Loader from '@/components/page-ui/Loader';
// import withAuth from '@/hoc/withAuth';
// import { useAuth } from '@/context/AuthContext';
// import HomeCategories from '../../components/page-ui/home_categories';
// import HomeSlider from '../../components/page-ui/home_slider';
// import BrandList from '../../components/Product/brands_list';
// import TopPicksProducts from '@/components/page-ui/top_rated_products';
// import { Skeleton } from '@/components/ui/skeleton';
// import PersonalizedMessages from '@/components/Product/personalize/personalized_messages';
// import Checkout_Payment_Page from '../checkout_payment_page/page';
// import PersonalizedGifts from '@/components/Product/personalize/personalized_gifts';

// const Homepage = () => {
//   const [user, setUser] = useState<any>(null);
//   const router = useRouter();
//   const { isLoading } = useAuth();
//   const [loadingContent, setLoadingContent] = useState(true);

//   const images = [
//     '/images/banner.png',
//     '/images/bannertwo.png',
//     '/images/bannerthree.png',
//   ];

//   const Customer = {
//     customer_id: '672c71f3abd6fe54e452af4e',
//     product_id: '670d01ae74f6aad762562881',
//     rating: 2.5,
//     review: 'y',
//     order_number: '28630940',
//     cart_id: '674ef7d3c0bf4e69b867188a',
//   };

//   useEffect(() => {
//     setLoadingContent(true);
//     const sessionUser = getSessionUser();
//     if (sessionUser) {
//       setUser(sessionUser);
//       setLoadingContent(false);
//     } else {
//       setLoadingContent(false);
//       clearSession();
//       router.prefetch('/auth');
//       router.push('/auth');
//     }
//     setLoadingContent(false);
//   }, [router]);

//   if (isLoading || loadingContent) {
//     return (
//       <div>
//         <Loader />
//         <Skeleton className="h-40 w-full" />
//         <Skeleton className="h-40 w-full" />
//         <Skeleton className="h-40 w-full" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <main>
//         <div className="at-maincontentwrapper">
//           <div className="at-homebanner">
//             <figure className="at-bannerimg">
//               <HomeSlider images={images} />
//             </figure>
//           </div>
//           <HomeCategories />
//           <TopPicksProducts customerData={Customer} />

//           <div className="at-pagesectiontitle">
//             <h2>
//               <br />
//               <br />
//               Shop by Brands
//             </h2>
//           </div>
//           <BrandList />
//           <br />
//           <div className="at-pagesectiontitle">
//             <h2>Personalize Your Gifts</h2>
//           </div>
//           <PersonalizedGifts />
//         </div>
//       </main>
//     </>
//   );
// };

// export default withAuth(Homepage);


// src/app/homepage/page.tsx
"use client";
import UnifiedPage from '@/components/UnifiedPage';
import HomeCategories from '@/components/page-ui/home_categories';
import TopPicksProducts from '@/components/page-ui/top_rated_products';
import BrandList from '@/components/Product/brands_list';
import PersonalizedGifts from '@/components/Product/personalize/personalized_gifts';
import UpcomingEvents from '@/components/page-ui/events_page/upcoming_events';
import withAuth from '@/hoc/withAuth';

const Homepage = () => {
  

  return (
    <UnifiedPage>
      <HomeCategories />
      <UpcomingEvents />
      <TopPicksProducts />
      <div className="at-pagesectiontitle">
        <h2><br />Shop by Brands</h2>
      </div>
      <BrandList />
      <div className="at-pagesectiontitle">
        <h2><br/>Personalize Your Gifts</h2>
      </div>
      <PersonalizedGifts />
    </UnifiedPage>
  );
};

export default withAuth(Homepage);
