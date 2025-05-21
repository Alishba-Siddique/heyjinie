// // src\app\[brandname]\[brandId]\page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { clearSession, getSessionUser } from '@/utils/sessionUtility';
// import Loader from '@/components/page-ui/Loader';
// import withAuth from '@/hoc/withAuth';
// import { useAuth } from '@/context/AuthContext';
// import HomeSlider from '@/components/page-ui/home_slider';
// import BrandShop from '@/components/Product/brand_shop';
// import { toast } from 'react-toastify';

// const BrandPage = () => {
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
//         toast.error('Failed to retrieve user data. Please log in again.');
//         clearSession();
//         router.prefetch('/auth');
//         router.push('/auth');
//       }
//     }
//   }, [isLoading, router]);

//   if (isLoading || !user) return <Loader />;

//   return (
//     <>
//       <main>
//         <div className="at-maincontentwrapper">
//           <div className="at-homebanner">
//             <figure className="at-bannerimg">
//               <HomeSlider images={images} />
//             </figure>
//           </div>

//           <BrandShop />
//         </div>
//       </main>
//     </>
//   );
// };

// export default withAuth(BrandPage);

// src/app/category/[category]/[brandname]/[brandId]/page.tsx
import UnifiedPage from '@/components/Auth/UnifiedPage';
import BrandShop from '@/components/Product/brand_shop';

const BrandDetailPage = () => {
  return (
    <UnifiedPage>
      <BrandShop />
    </UnifiedPage>
  );
};

export default BrandDetailPage;
