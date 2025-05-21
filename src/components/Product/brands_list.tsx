// // src/app/components/Product/brands_list.tsx
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { fetchCompanyList } from '@/services/api.service';
// import { Skeleton } from '@/components/ui/skeleton';

// const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// interface Company {
//   _id: string;
//   name: string;
//   company_logo: string;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   data: Company[];
//   status: number;
//   statusText: string;
// }

// export default function BrandList() {
//   const [brandsList, setBrandsList] = useState<Company[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const getBrandsList = async () => {
//       setLoading(true);
//       try {
//         const response: ApiResponse = await fetchCompanyList();
//         if (response && response.success) {
//           setBrandsList(response.data || []);
//         } else {
//           setError(response.message || 'Failed to fetch categories.');
//         }
//       } catch (err) {
//         console.error('Error fetching categories:', err);
//         setError('An error occurred while fetching categories.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     getBrandsList();
//   }, []);

//   const handleBrandClick = (
//     brandName: string,
//     brandLogo: string,
//     brandId: string
//   ) => {
//     const slug = brandName.toLowerCase().replace(/\s+/g, '');
//     sessionStorage.setItem('brandLogo', brandLogo); // Store logo in sessionStorage
//     router.prefetch(`/${slug}/${brandId}`); // Prefetch the page

//     router.push(`/${slug}/${brandId}`); // Navigate to the shop page
//   };

//   return (
//     <div className="at-categoriesgrid horizontal-scroll">
//       {/* {loading && (
//         <>
//           {[...Array(13)].map((_, index) => (
//             <div className="at-categoryitem flex gap-4 items-center horizontal-categories-skeleton" key={index}>
//               <Skeleton className="h-24 w-24 px-8 bg-[#d6dadb] gap-4" />
//             </div>
//           ))}
//         </>
//       )} */}
//       {loading && (
//           <div className="at-categoryitem flex gap-4 items-center horizontal-categories-skeleton"> {/* Added horizontal-categories-skeleton class */}
//             {[...Array(5)].map((_, index) => (
//               <div key={index} className="flex flex-col items-center">
//                 <Skeleton className="h-24 w-24 px-8 bg-[#d6dadb] gap-4" />
//               </div>
//             ))}
//           </div>
//         )}
//       {error && <p className="error-message">{error}</p>}
//       {!loading && brandsList.length === 0 && !error && (
//         <p>No brands available.</p>
//       )}
//       {!loading &&
//         brandsList.length > 0 &&
//         brandsList.map((brand) => (
//           <div
//             className="at-branditem px-5 py-3 border border-gray-300 rounded-lg cursor-pointer"
//             key={brand._id}
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               handleBrandClick(brand.name, brand.company_logo, brand._id);
//             }}
//           >
//             <figure>
//               {brand.company_logo !== null ? (
//                 <img
//                   src={brand.company_logo || PRODUCT_PLACEHOLDER}
//                   alt={brand.name}
//                 />
//               ) : (
//                 <img
//                   src={PRODUCT_PLACEHOLDER}
//                   alt={brand.name !== '' ? brand.name : 'Brand Name'}
//                 />
//               )}
//               <figcaption className="at-categorycontent text-center">
//                 <h3 className="at-categorytitle font-bold text-[14px]">
//                   {/* {brand.name} */}
//                 </h3>
//               </figcaption>
//             </figure>
//           </div>
//         ))}
//     </div>
//   );
// }

//src/components/Product/brand_list.tsx
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCompanyList } from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

interface Company {
  _id: string;
  name: string;
  company_logo: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Company[];
  status: number;
  statusText: string;
}

export default function BrandList() {
  const [brandsList, setBrandsList] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Create a ref

  useEffect(() => {
    const getBrandsList = async () => {
      setLoading(true);
      try {
        const response: ApiResponse = await fetchCompanyList();
        if (response && response.success) {
          setBrandsList(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch categories.');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('An error occurred while fetching categories.');
      } finally {
        setLoading(false);
      }
    };

    getBrandsList();
  }, []);

  const handleBrandClick = (
    brandName: string,
    brandLogo: string,
    brandId: string
  ) => {
    const slug = brandName.toLowerCase().replace(/\s+/g, '');
    sessionStorage.setItem('brandLogo', brandLogo);
    router.prefetch(`/${slug}/${brandId}`);
    router.push(`/${slug}/${brandId}`);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft -= 100; // Adjust scroll amount as needed
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += 100; // Adjust scroll amount as needed
    }
  };

  return (
    <div> {/* Container for scroll buttons and scrollable area */}
      
      <div
        className="at-categoriesgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory"
        ref={scrollContainerRef} // Attach the ref to the scrollable div
      >
        {loading && (
          <div className="at-categoryitem flex gap-4 items-center">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 px-8 bg-[#d6dadb] gap-4" />
              </div>
            ))}
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
        {!loading && brandsList.length === 0 && !error && (
          <p>No brands available.</p>
        )}
        {!loading &&
          brandsList.length > 0 &&
          brandsList.map((brand) => (
            <div
              className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
              key={brand._id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleBrandClick(brand.name, brand.company_logo, brand._id);
              }}
            >
              <figure>
                {brand.company_logo !== null ? (
                  <img
                    src={brand.company_logo || PRODUCT_PLACEHOLDER}
                    alt={brand.name}
                  />
                ) : (
                  <img
                    src={PRODUCT_PLACEHOLDER}
                    alt={brand.name !== '' ? brand.name : 'Brand Name'}
                  />
                )}
                <figcaption className="at-categorycontent text-center">
                  <h3 className="at-categorytitle font-bold text-[14px]">
                    {/* {brand.name} */}
                  </h3>
                </figcaption>
              </figure>
            </div>
          ))}
      </div>
    </div>
  );
}