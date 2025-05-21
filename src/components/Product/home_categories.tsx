// // src/app/components/page-ui/home_categories.tsx

// import { useEffect, useState } from 'react';
// import { fetchCategoryList } from '@/services/api.service';
// import { Skeleton } from '@/components/ui/skeleton';
// import Link from 'next/link'; // Import Link from next/link

// const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
// interface Category {
// _id: string;
// name: string;
// description: string;
// search_type: string;
// image_path: string;
// is_active: boolean;
// created_at: string;
// __v: number;
// }
// // const backgroundColors = ['#FFD05E', '#88C1FD', '#FD9399', '#FF834B', '#40A574', '#D6DADA'];
// const backgroundColors = ['#FFD05E', '#88C1FD', '#FD9399', '#FF834B'];

// interface ApiResponse {
// success: boolean;
// message: string;
// data: Category[];
// status: number;
// statusText: string;
// }

// export default function HomeCategories() {
// const [categories, setCategories] = useState<Category[]>([]);
// const [loading, setLoading] = useState<boolean>(true);
// const [error, setError] = useState<string | null>(null);

// useEffect(() => {
//   const getCategories = async () => {
//     setLoading(true);
//     try {
//       const response: ApiResponse = await fetchCategoryList();
//       if (response && response.success) {
//         setCategories(response.data || []); // Safeguard against undefined
//       } else {
//         setError(response.message || 'Failed to fetch categories.');
//       }
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       setError('An error occurred while fetching categories.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   getCategories();
// }, []);

// return (
//     <div className="at-categories mt-5">
//       <div className="at-categoriesgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-4 ">
//         {loading && (
//           <div className="at-categoryitem flex gap-4 items-center">
//             {[...Array(5)].map((_, index) => (
//               <div key={index} className="flex flex-col items-center">
//                 <Skeleton className="h-24 w-24 rounded-full bg-[#d6dadb]" />
//                 <Skeleton className="h-4 w-20 mt-2 bg-[#d6dadb]" />
//               </div>
//             ))}
//           </div>
//         )}
//         {error && <p className="error-message">{error}</p>}
//         {!loading && categories?.length === 0 && !error && (
//           <p>No categories available.</p>
//         )}
//         {!loading &&
//           categories?.length > 0 &&
//           categories?.map((category, index) => {
//             const bgColor = backgroundColors[index % backgroundColors.length];

//             const categorySlug = category.name
//               .toLowerCase()
//               .replace(/\s+/g, '');
//             return (
//               <Link href={`/category/${categorySlug}`} key={category._id}>
//                 <div className="at-categoryitem cursor-pointer" >
//                   <figure className='flex flex-col  items-center' >
//                     <span className="at-imageparent" style={{ background: bgColor }}>
//                       {category.image_path !== null ? (
//                         <img
//                           src={category.image_path || PRODUCT_PLACEHOLDER}
//                           alt={category.name}
//                         />
//                       ) : (
//                         <img
//                           src={PRODUCT_PLACEHOLDER}
//                           alt={
//                             category.name !== ''
//                               ? category.name
//                               : 'Category Name'
//                           }
//                         />
//                       )}
//                     </span>
//                     <figcaption className="at-categorycontent text-center">
//                       {category.name !== null ? (
//                         <h3 className="at-categorytitle font-bold text-[14px]">
//                           {category.name}
//                         </h3>
//                       ) : (
//                         <h3 className="at-categorytitle font-bold text-[14px]">
//                           Category Name
//                         </h3>
//                       )}
//                     </figcaption>
//                   </figure>
//                 </div>
//               </Link>
//             );
//           })}
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchCategoryList } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

interface Category {
  _id: string;
  name: string;
  description: string;
  search_type: string;
  image_path: string;
  is_active: boolean;
  created_at: string;
  type?: number;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Category[];
  status: number;
  statusText: string;
}

export default function HomeCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const getCategoryBackground = useCallback((type?: number) => {
  //   switch (type) {
  //     case 1:
  //       return '#FFD05E';
  //     case 2:
  //       return '#FF834B';
  //     case 3:
  //       return '#88C1FD';
  //     case 4:
  //       return '#40A574';
  //     default:
  //       return '#D6DADA'; // fallback
  //   }
  // }, []);
  const backgroundColors = ['#FFD05E', '#88C1FD', '#FD9399', '#FF834B'];

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchCategoryList();
        if (response?.success) {
          setCategories(response.data ?? []);
        } else {
          setError(response?.message || 'Failed to fetch categories.');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('An error occurred while fetching categories.');
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return (
    <div className="at-categories mt-5">
      <div className="at-categoriesgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-4">
        {loading && (
          <div className="flex gap-4 items-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full bg-[#d6dadb]" />
                <Skeleton className="h-4 w-20 mt-2 bg-[#d6dadb]" />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && categories.length === 0 && (
          <p>No categories available.</p>
        )}

        {!loading &&
          !error &&
          categories.map((category, index) => {
            const slugify = (str: string) =>
              str
                .toLowerCase()
                .trim()
                .replace(/&/g, 'and') // Replace "&" with "and"
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-'); // Collapse multiple hyphens

            
            const categorySlug = slugify(category.name);

            // const bgColor = getCategoryBackground(category.type);
            const bgColor = backgroundColors[index % backgroundColors.length];

            return (
              <Link href={`/category/${categorySlug}`} key={category._id}>
                <div className="at-categoryitem cursor-pointer">
                  <figure className="flex flex-col items-center">
                    <span
                      className="at-imageparent"
                      style={{ backgroundColor: bgColor }}
                    >
                      <img
                        src={category.image_path || PRODUCT_PLACEHOLDER}
                        alt={category.name || 'Category Name'}
                      />
                    </span>
                    <figcaption className="at-categorycontent text-center">
                      <h3 className="at-categorytitle font-bold text-[14px]">
                        {category.name || 'Category Name'}
                      </h3>
                    </figcaption>
                  </figure>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
