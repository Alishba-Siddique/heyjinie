// src/components/page-ui/my_gifts.tsx
'use client';
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { getUserGifts, fetchCompanyList } from '@/services/api.service';
import Link from 'next/link';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

interface Product {
  name: string;
  image_path: string | null;
  sticker_path: string | null;
  price: number;
  company_id: string;
}

interface CartDetail {
  product_id: Product;
  orderPrice: number;
  quantity: number;
  verification: number;
  is_claimed: boolean;
  is_reviewed: boolean;
}

interface OrderId {
  cart_details: CartDetail[];
  payment_status: boolean;
  created_at: string;
}

interface Gift {
  _id: string;
  order_id: OrderId;
  order_number: string;
  sending_date: string;
  is_claimed: boolean;
  claim_date: string | null;
}

interface Company {
  _id: string;
  name: string;
}

interface GiftState {
  receive_gifts: Gift[];
  claim_gifts: Gift[];
}

const initialGiftState: GiftState = {
  receive_gifts: [],
  claim_gifts: [],
};

const GiftSkeleton = () => {
  return (
    <div className="at-shopcategorieitems animate-pulse">
      <div className="at-shopcategoriesgriditem">
        <figure className="bg-gray-300 h-48 w-full mb-4"></figure>
        <div className="at-mygiftbrandname mt-5">
          <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-300 w-1/2"></div>
        </div>
        <div className="text-center mt-2">
          <div className="h-6 bg-gray-300 w-1/3 mx-auto rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const MyGifts = () => {
  const [showSentGifts, setShowSentGifts] = useState(false);
  const [gifts, setGifts] = useState<GiftState>(initialGiftState);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const companiesResponse = await fetchCompanyList();
        setCompanies(companiesResponse?.data || []);

        const giftsResponse = await getUserGifts();

        // Validate the structure of giftsResponse before setting state
        if (giftsResponse &&
            (Array.isArray(giftsResponse.receive_gifts) || Array.isArray(giftsResponse.claim_gifts))) {
          setGifts(giftsResponse);
        } else {
          console.error('Invalid gifts response format:', giftsResponse);
          setError('Received invalid data format from server');
          setGifts(initialGiftState);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load gifts and companies. Please try again later.');
        setGifts(initialGiftState);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCompanyName = (companyId: string) => {
    if (!companyId) return 'Unknown Company';
    const company = companies.find((comp) => comp._id === companyId);
    return company ? company.name : 'Company Name';
  };

  const displayGifts = showSentGifts ? gifts.claim_gifts : gifts.receive_gifts;

  // Safely get product details with null checks
  const getProductDetails = (gift: Gift) => {
    if (!gift?.order_id || !gift.order_id.cart_details || !gift.order_id.cart_details.length) {
      return {
        name: 'Unknown Product',
        sticker_path: null,
        company_id: ''
      };
    }

    const product = gift.order_id.cart_details[0]?.product_id;
    return product || { name: 'Unknown Product', sticker_path: null, company_id: '' };
  };

  return (
    <div className="at-shopcategories">
      <div className="flex justify-end items-center mb-4 mr-4">
        <span className={`text-sm mr-2 ${!showSentGifts ? 'font-bold' : ''}`}>
          Received
        </span>
        <Switch
          checked={showSentGifts}
          onCheckedChange={setShowSentGifts}
          className="data-[state=checked]:bg-blue-600"
        />
        <span className={`text-sm ml-2 ${showSentGifts ? 'font-bold' : ''}`}>
          Sent
        </span>
      </div>

      {error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : loading ? (
        <div className="at-shopcategoriesgrid at-mygiftgrid">
          {[...Array(4)].map((_, index) => (
            <GiftSkeleton key={index} />
          ))}
        </div>
      ) : displayGifts.length === 0 ? (
        <>
          <div className="text-center py-8 text-gray-500">
            No gifts found yet! <br />{' '}
            <Link href="/home">
              👉 <u>Click here to place your first order!</u>
            </Link>
          </div>
        </>
      ) : (
        <div className="at-shopcategoriesgrid at-mygiftgrid">
          {displayGifts.map((gift) => {
            const product = getProductDetails(gift);
            return (
              <div key={gift._id} className="at-shopcategorieitems">
                <div className="at-shopcategoriesgriditem">
                  <figure>
                    {product.sticker_path ? (
                      <img
                        className="mt-10"
                        src={product.sticker_path}
                        alt={product.name || "Product"}
                      />
                    ) : (
                      <img
                        className="mt-10"
                        src={PRODUCT_PLACEHOLDER}
                        alt={product.name || "Product"}
                      />
                    )}
                  </figure>
                  <div className="at-mygiftbrandname mt-8">
                    <h3>{getCompanyName(product.company_id)}</h3>
                    <h4 style={{ marginTop: '12px' }}>
                      {product.name || 'Product Name'}
                    </h4>
                  </div>
                  <div className="text-center mt-2 text-sm">
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
                        gift.is_claimed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {gift.is_claimed ? 'Claimed' : 'Unclaimed'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyGifts;

// // src/components/page-ui/my_gifts.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { Switch } from '@/components/ui/switch';
// import { getUserGifts, fetchCompanyList } from '@/services/api.service';
// import Link from 'next/link';
// import { getAllSharedGifts, ShareSource } from '@/utils/shareTrackingUtility';

// const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// interface Product {
//   name: string;
//   image_path: string | null;
//   sticker_path: string | null;
//   price: number;
//   company_id: string;
// }

// interface CartDetail {
//   product_id: Product | null;
//   orderPrice: number;
//   quantity: number;
//   verification: number;
//   is_claimed: boolean;
//   is_reviewed: boolean;
// }

// interface OrderId {
//   _id: any;
//   cart_details: CartDetail[] | null;
//   payment_status: boolean;
//   created_at: string;
// }

// interface Gift {
//   _id: string;
//   order_id: OrderId | null;
//   order_number: string;
//   sending_date: string;
//   is_claimed: boolean;
//   claim_date: string | null;
// }

// interface Company {
//   _id: string;
//   name: string;
// }

// interface GiftState {
//   receive_gifts: Gift[];
//   claim_gifts: Gift[];
// }

// const initialGiftState: GiftState = {
//   receive_gifts: [],
//   claim_gifts: [],
// };

// const getShareIcon = (shareSource: ShareSource): string => {
//   switch (shareSource) {
//     case ShareSource.WHATSAPP:
//       return '/images/icon-whatsapp.svg';
//     case ShareSource.MESSENGER:
//       return '/images/icon-messenger.svg';
//     case ShareSource.INSTAGRAM:
//       return '/images/icon-insta.svg';
//     case ShareSource.EMAIL:
//       return '/images/icon-email.svg'; // Assuming you have this icon
//     default:
//       return '';
//   }
// };

// const getShareSourceName = (shareSource: ShareSource): string => {
//   switch (shareSource) {
//     case ShareSource.WHATSAPP:
//       return 'WhatsApp';
//     case ShareSource.MESSENGER:
//       return 'Messenger';
//     case ShareSource.INSTAGRAM:
//       return 'Instagram';
//     case ShareSource.EMAIL:
//       return 'Email';
//     default:
//       return 'Unknown';
//   }
// };

// const GiftSkeleton = () => {
//   return (
//     <div className="at-shopcategorieitems animate-pulse">
//       <div className="at-shopcategoriesgriditem">
//         <figure className="bg-gray-300 h-48 w-full mb-4"></figure>
//         <div className="at-mygiftbrandname mt-5">
//           <div className="h-4 bg-gray-300 mb-2 w-3/4"></div>
//           <div className="h-4 bg-gray-300 w-1/2"></div>
//         </div>
//         <div className="text-center mt-2">
//           <div className="h-6 bg-gray-300 w-1/3 mx-auto rounded-full"></div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MyGifts = () => {
//   const [showSentGifts, setShowSentGifts] = useState(false);
//   const [gifts, setGifts] = useState<GiftState>(initialGiftState);
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [giftShareSourcesMap, setGiftShareSourcesMap] = useState<
//     Record<string, ShareSource[]>
//   >({});

//   useEffect(() => {
//     // Load share tracking information
//     const loadShareTracking = () => {
//       try {
//         const allSharedGifts = getAllSharedGifts();
//         const sharesMap: Record<string, ShareSource[]> = {};

//         // Group all shares by orderId
//         allSharedGifts.forEach((gift) => {
//           if (!sharesMap[gift.orderId]) {
//             sharesMap[gift.orderId] = [];
//           }

//           // Only add unique share sources
//           if (!sharesMap[gift.orderId].includes(gift.shareSource)) {
//             sharesMap[gift.orderId].push(gift.shareSource);
//           }
//         });

//         setGiftShareSourcesMap(sharesMap);
//       } catch (error) {
//         console.error('Error loading share tracking data:', error);
//       }
//     };

//     loadShareTracking();


//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const companiesResponse = await fetchCompanyList();
//         setCompanies(companiesResponse?.data || []);

//         const giftsResponse = await getUserGifts();

//         if (giftsResponse && Array.isArray(giftsResponse.receive_gifts)) {
//           setGifts(giftsResponse);
//         } else {
//           console.error('Invalid gifts response format:', giftsResponse);
//           setError('Received invalid data format from server');
//           setGifts(initialGiftState);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setError('Failed to load gifts and companies.');
//         setGifts(initialGiftState);
//         setCompanies([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();

//   }, []);

//   // Function to get share sources for a gift
//   const getGiftShareSources = (gift: Gift): ShareSource[] => {
//     if (!gift.order_id?._id) return [];
//     return giftShareSourcesMap[gift.order_id._id] || [];
//   };

//   const getCompanyName = (companyId: string) => {
//     if (!companyId) return 'Unknown Company';
//     const company = companies.find((comp) => comp._id === companyId);
//     return company ? company.name : 'Company Name';
//   };

//   const displayGifts = showSentGifts ? gifts.claim_gifts : gifts.receive_gifts;

//   const getProductDetails = (gift: Gift) => {
//     if (
//       !gift?.order_id ||
//       !Array.isArray(gift.order_id.cart_details) ||
//       gift.order_id.cart_details.length === 0
//     ) {
//       return { name: 'Unknown Product', sticker_path: null, company_id: '' };
//     }

//     const product = gift.order_id.cart_details[0]?.product_id;
//     return (
//       product || { name: 'Unknown Product', sticker_path: null, company_id: '' }
//     );
//   };
//   return (
//     <div className="at-shopcategories">
//       <div className="flex justify-end items-center mb-4 mr-4">
//         <span className={`text-sm mr-2 ${!showSentGifts ? 'font-bold' : ''}`}>
//           Received
//         </span>
//         <Switch
//           checked={showSentGifts}
//           onCheckedChange={setShowSentGifts}
//           className="data-[state=checked]:bg-blue-600"
//         />
//         <span className={`text-sm ml-2 ${showSentGifts ? 'font-bold' : ''}`}>
//           Sent
//         </span>
//       </div>

//       {error ? (
//         <div className="text-center py-8 text-red-600">{error}</div>
//       ) : loading ? (
//         <div className="at-shopcategoriesgrid at-mygiftgrid">
//           {[...Array(4)].map((_, index) => (
//             <GiftSkeleton key={index} />
//           ))}
//         </div>
//       ) : displayGifts.length === 0 ? (
//         <>
//           <div className="text-center py-8 text-gray-500">
//             No gifts found yet! <br />{' '}
//             <Link href="/shop">
//               👉 <u>Click here to place your first order!</u>
//             </Link>
//           </div>
//         </>
//       ) : (
//         <div className="at-shopcategoriesgrid at-mygiftgrid">
//           {displayGifts.map((gift) => {
//             const product = getProductDetails(gift);
//             const shareSources = getGiftShareSources(gift);
//             return (
//               <div key={gift._id} className="at-shopcategorieitems">
//                 <div className="at-shopcategoriesgriditem">
//                   <figure>
//                     <img
//                       className="mt-10"
//                       src={product.sticker_path || PRODUCT_PLACEHOLDER}
//                       alt={product.name}
//                     />
//                     {/* Show share source badges if available */}
//                     {shareSources.length > 0 && (
//                       <div className="absolute top-2 right-2 flex flex-row gap-1">
//                         {shareSources.map((source, index) => (
//                           <div
//                             key={index}
//                             className="bg-white rounded-full p-1 shadow-md"
//                           >
//                             <img
//                               src={getShareIcon(source)}
//                               alt={`Shared via ${getShareSourceName(source)}`}
//                               className="w-6 h-6"
//                               title={`Shared via ${getShareSourceName(source)}`}
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </figure>
//                   <div className="at-mygiftbrandname mt-8">
//                     <h3>{getCompanyName(product.company_id)}</h3>
//                     <h4>{product.name}</h4>

//                     {/* Display share sources text */}
//                     {shareSources.length > 0 && (
//                       <p className="text-xs text-gray-500 mt-2">
//                         Shared via:{' '}
//                         {shareSources.map(getShareSourceName).join(', ')}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyGifts;
