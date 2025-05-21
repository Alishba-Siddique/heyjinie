// src/components/user-interface/my_gifts.tsx
'use client';
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { getUserGifts, fetchCompanyList } from '@/services/api.service';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

interface Product {
  name: string;
  image_path: string;
  sticker_path: string;
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
        setCompanies(companiesResponse.data);

        const giftsResponse = await getUserGifts();
        setGifts(giftsResponse);
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
    const company = companies.find((comp) => comp._id === companyId);
    return company ? company.name : 'Unknown Company';
  };

  const displayGifts = showSentGifts ? gifts.claim_gifts : gifts.receive_gifts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  //   return (
  //     <div className="at-shopcategories">
  //       <div className="at-pagesectiontitle">
  //         <h2>My Gifts</h2>
  //       </div>

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
  //         <div className="text-center py-8">Loading gifts...</div>
  //       ) : displayGifts.length === 0 ? (
  //         <div className="text-center py-8 text-gray-500">
  //           No {showSentGifts ? 'sent' : 'received'} gifts found
  //         </div>
  //       ) : (
  //         <div className="at-shopcategoriesgrid at-mygiftgrid">
  //           {displayGifts.map((gift) => {
  //             const product = gift.order_id.cart_details[0].product_id;
  //             return (
  //               <div key={gift._id} className="at-shopcategorieitems">
  //                 <div className="at-shopcategoriesgriditem">
  //                   <figure>
  //                     <img
  //                       className=" mt-10  "
  //                       src={product.sticker_path}
  //                       alt={product.name}
  //                     />
  //                   </figure>
  //                   <div className="at-mygiftbrandname mt-5">

  //                     <h3>{getCompanyName(product.company_id)}</h3>
  //                     <h4>{product.name}</h4>
  //                     {/* <h4>
  //                       {formatPrice(gift.order_id.cart_details[0].orderPrice)}
  //                     </h4> */}
  //                   </div>
  //                   <div className="text-center mt-2 text-sm">
  //                     {/* <p>Order #{gift.order_number}</p>
  //                     <p>Sent on {formatDate(gift.sending_date)}</p>
  //                     {gift.claim_date && (
  //                       <p>Claimed on {formatDate(gift.claim_date)}</p>
  //                     )} */}
  //                     <span
  //                       className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
  //                         gift.is_claimed
  //                           ? 'bg-green-100 text-green-800'
  //                           : 'bg-yellow-100 text-yellow-800'
  //                       }`}
  //                     >
  //                       {gift.is_claimed ? 'Claimed' : 'Unclaimed'}
  //                     </span>
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

  return (
    <div className="at-shopcategories">
      <div className="at-pagesectiontitle">
        <h2>My Gifts</h2>
      </div>

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
        <div className="text-center py-8 text-gray-500">
          No {showSentGifts ? 'sent' : 'received'} gifts found
        </div>
      ) : (
        <div className="at-shopcategoriesgrid at-mygiftgrid">
          {displayGifts.map((gift) => {
            const product = gift.order_id.cart_details[0].product_id;
            return (
              <div key={gift._id} className="at-shopcategorieitems">
                <div className="at-shopcategoriesgriditem">
                  <figure>
                    {product.sticker_path !== null ? (
                      <img
                        src={product.sticker_path}
                        alt={product.name}
                        className="mt-10"
                      />
                    ) : (
                      <img
                        className="mt-10"
                        src={PRODUCT_PLACEHOLDER}
                        alt={
                          product.name !== '' ? product.name : 'Product Name'
                        }
                      />
                    )}
                  </figure>
                  <div className="at-mygiftbrandname mt-8">
                    <h3>{getCompanyName(product.company_id)}</h3>
                    <h4>{product.name}</h4>
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
