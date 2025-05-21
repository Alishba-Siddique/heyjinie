// // // src/components/page-ui/top_rated_products.tsx
// // 'use client';
// // import { useEffect, useState, useRef, useCallback } from 'react';
// // import {
// //   fetchTopPicks,
// //   placeOrder,
// //   confirmOrder,
// // } from '@/services/api.service';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { useCart } from '@/context/CartContext';
// // import { useRouter } from 'next/navigation';
// // import { toast } from 'react-toastify';
// // import RatingStars from './rating_stars';
// // import Link from 'next/link';

// // const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// // interface TopPicks {
// //   _id: string;
// //   name: string;
// //   description: string;
// //   price: number;
// //   image_path: string | null;
// //   background_images: string;
// //   total_rating: number;
// //   company_id: {
// //     _id: string;
// //     name: string;
// //     company_logo: string;
// //     description: string;
// //   };
// // }

// // interface ApiResponse {
// //   success: boolean;
// //   message: string;
// //   data: TopPicks[];
// // }

// // interface PersonalizedMessage {
// //   name: string;
// //   message: string;
// //   image_path: string;
// //   image_id: string;
// //   productId?: string;
// // }

// // const TopPicksProducts: React.FC = () => {
// //   const [topPicks, setTopPicks] = useState<TopPicks[]>([]);
// //   const [error, setError] = useState<string | null>(null);
// //   const [loading, setLoading] = useState<boolean>(true);

// //   //Models
// //   const [processing, setProcessing] = useState(false);
// //   const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
// //   const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
// //   const [selectedTopRatedProduct, setSelectedTopRatedProduct] =
// //     useState<TopPicks | null>(null);
// //   const [quantity, setQuantity] = useState(1);
// //   const [selectedSize, setSelectedSize] = useState<string>('M');

// //   const router = useRouter();
// //   const { cartItems, addToCart, removeFromCart } = useCart();

// //   const decreaseQuantity = () => {
// //     if (quantity > 1) setQuantity(quantity - 1);
// //   };

// //   const increaseQuantity = () => {
// //     setQuantity(quantity + 1);
// //   };

// //   const isInCart = (productId: string) =>
// //     cartItems.some((item) => item._id === productId);

// //   const handleProductClick = (product: TopPicks) => {
// //     setSelectedTopRatedProduct(product);
// //     setIsFirstModalOpen(true);
// //   };

// //   const errorToastShown = useRef(false);

// //   const [personalizedMessages, setPersonalizedMessages] = useState<{
// //     [key: string]: PersonalizedMessage | undefined; // Make sure to import PersonalizedMessage type
// //   }>({});

// //   const [storageChangeKey, setStorageChangeKey] = useState(0); // Force re-render
// //   const [selectedMessages, setSelectedMessages] = useState<
// //     Record<string, PersonalizedMessage>
// //   >({});
// //   // Centralized function to update personalized messages
// //   const updatePersonalizedMessages = useCallback(
// //     (productId: string, message: PersonalizedMessage | undefined) => {
// //       setPersonalizedMessages((prevMessages) => {
// //         const updatedMessages = { ...prevMessages };
// //         if (message) {
// //           updatedMessages[productId] = message;
// //         } else {
// //           delete updatedMessages[productId]; // Remove if undefined (unselected)
// //         }

// //         // Store as JSON object keyed by productId
// //         localStorage.setItem(
// //           'selectedPersonalizedMessages',
// //           JSON.stringify(updatedMessages)
// //         );

// //         return updatedMessages;
// //       });
// //       setStorageChangeKey((prevKey) => prevKey + 1); // Force re-render
// //     },
// //     []
// //   );

// //   const loadPersonalizedMessages = useCallback(() => {
// //     // --- Read IMMEDIATELY ---
// //     const storedMessagesImmediately = localStorage.getItem(
// //       'selectedPersonalizedMessages'
// //     );
// //     console.log(
// //       '[loadPersonalizedMessages] START - Raw value:',
// //       storedMessagesImmediately
// //     );

// //     // Optional: Add a tiny delay to see if it helps visibility (use for debugging only)
// //     // setTimeout(() => {
// //     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
// //     console.log(
// //       '[loadPersonalizedMessages] Reading localStorage value:',
// //       storedMessages
// //     );
// //     try {
// //       // Default to null if storedMessages is empty/null to avoid parsing "null"
// //       const messages = storedMessages ? JSON.parse(storedMessages) : {};
// //       console.log('[loadPersonalizedMessages] Parsed messages:', messages);
// //       console.log(
// //         '[loadPersonalizedMessages] Type of parsed:',
// //         typeof messages,
// //         'Is Array:',
// //         Array.isArray(messages)
// //       );

// //       if (
// //         messages &&
// //         typeof messages === 'object' &&
// //         !Array.isArray(messages)
// //       ) {
// //         setPersonalizedMessages(messages);
// //         console.log(
// //           '[loadPersonalizedMessages] SUCCESS: Set state with OBJECT:',
// //           messages
// //         );
// //       } else {
// //         console.warn(
// //           '[loadPersonalizedMessages] WARN: Parsed value is NOT an object. Setting empty state. Found:',
// //           messages
// //         );
// //         setPersonalizedMessages({}); // Ensure state is reset
// //       }
// //     } catch (error) {
// //       console.error(
// //         '[loadPersonalizedMessages] ERROR parsing localStorage:',
// //         error,
// //         'Raw value was:',
// //         storedMessages
// //       );
// //       setPersonalizedMessages({}); // Ensure state is reset on error
// //     }
// //     // }, 50); // 50ms delay - REMOVE after testing
// //   }, []);

// //   useEffect(() => {
// //     loadPersonalizedMessages(); // Initial load

// //     const handleStorageChange = (event: StorageEvent) => {
// //       if (event.key === 'selectedPersonalizedMessages') {
// //         console.log(
// //           "Storage event triggered for 'selectedPersonalizedMessages' in ShopCategories"
// //         );
// //         loadPersonalizedMessages(); // Reload state from localStorage
// //         // setStorageChangeKey(prevKey => prevKey + 1); // Keep this if loadPersonalizedMessages doesn't trigger re-render reliably
// //       }
// //       // Add listener for the other key if needed
// //       if (event.key === 'personalizedMessages') {
// //         console.log("Storage event triggered for 'personalizedMessages'");
// //         // Decide if you need to react to changes in this key as well
// //       }
// //     };

// //     window.addEventListener('storage', handleStorageChange);

// //     return () => {
// //       window.removeEventListener('storage', handleStorageChange);
// //     };
// //     // Add dependencies if fetchAllData or loadPersonalizedMessages depend on props/state
// //     // }, [loadPersonalizedMessages]); // Make sure loadPersonalizedMessages is stable (useCallback)
// //   }, [loadPersonalizedMessages]);

// //   // Add this useEffect hook to fetch top picks data
// //   useEffect(() => {
// //     const loadTopPicks = async () => {
// //       try {
// //         const response: ApiResponse = await fetchTopPicks();
// //         if (response.success) {
// //           setTopPicks(response.data);
// //         } else {
// //           setError(response.message || 'Failed to fetch top picks');
// //         }
// //       } catch (error) {
// //         setError(
// //           error instanceof Error
// //             ? error.message
// //             : 'An unexpected error occurred'
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     loadTopPicks();
// //   }, []);

// //   const handleReviewsClick = (productId: string) => {
// //     router.push(`/reviews/${productId}`);
// //   };

// //   const handleGoToCart = () => {
// //     setIsFirstModalOpen(false);
// //     router.push('/cart');
// //   };

// //   const handleAddToCart = () => {
// //     if (selectedTopRatedProduct) {
// //       const itemToAdd = {
// //         _id: selectedTopRatedProduct._id!,
// //         price: selectedTopRatedProduct.price!,
// //         quantity,
// //         image_path: selectedTopRatedProduct.image_path!,
// //         name: selectedTopRatedProduct.name,
// //         description: selectedTopRatedProduct.description,
// //         personalization: personalizedMessages[selectedTopRatedProduct._id],
// //       };
// //       addToCart(itemToAdd);
// //       setIsFirstModalOpen(false);
// //       setIsSecondModalOpen(true);
// //     }
// //   };

// //   // Add useEffect to listen for storage changes
// //   const hasPersonalization = (productId: string) => {
// //     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
// //     if (storedMessages) {
// //       try {
// //         const messages = JSON.parse(storedMessages);

// //         // Check if it's the expected object format (non-null, object, not an array)
// //         if (
// //           messages &&
// //           typeof messages === 'object' &&
// //           !Array.isArray(messages)
// //         ) {
// //           return messages.hasOwnProperty(productId);
// //         } else {
// //           // Log a warning if the format is unexpected
// //           console.warn(
// //             `'selectedPersonalizedMessages' in localStorage is not the expected object format for product ID ${productId}. Found:`,
// //             messages
// //           );
// //           return false; // Treat unexpected format as 'not personalized' for this check
// //         }
// //       } catch (e) {
// //         console.error(
// //           "Error parsing 'selectedPersonalizedMessages' from localStorage:",
// //           e
// //         );
// //         return false;
// //       }
// //     }
// //     return false;
// //   };

// //   const handlePersonalize = (productId: string) => {
// //     localStorage.setItem('currentItemId', productId);
// //     localStorage.setItem('returnPath', window.location.pathname);
// //     router.push('/messages');
// //   };
// //   const handlePlaceOrder = async () => {
// //     if (!selectedTopRatedProduct) return;

// //     try {
// //       // Show processing state
// //       setProcessing(true);

// //       // Create order data
// //       const orderData = {
// //         cart_details: [
// //           {
// //             product_id: selectedTopRatedProduct._id,
// //             quantity: quantity,
// //             personalized:
// //               personalizedMessages[selectedTopRatedProduct._id] || null,
// //           },
// //         ],
// //       };

// //       // Place the order first (this creates the order in the database)
// //       const orderResponse = await placeOrder(orderData);

// //       if (!orderResponse.success) {
// //         throw new Error(orderResponse.message || 'Failed to place order');
// //       }

// //       // Store order and payment IDs for confirmation after payment
// //       localStorage.setItem('order_id', orderResponse.data.order_id);
// //       localStorage.setItem('payment_id', orderResponse.data.payment_id);

// //       // If it's a free product, confirm the order immediately and redirect
// //       if (orderResponse.data.payment_type === 'free') {
// //         const confirmResponse = await confirmOrder(
// //           orderResponse.data.order_id,
// //           orderResponse.data.payment_id
// //         );

// //         if (confirmResponse) {
// //           removeFromCart(selectedTopRatedProduct._id);
// //           closeModals();
// //           router.push('/thankyou');
// //         } else {
// //           throw new Error('Order confirmation failed');
// //         }
// //         return;
// //       }

// //       // For paid products, prepare PayFast payment
// //       const totalAmount = selectedTopRatedProduct.price * quantity * 1.17; // Price + 17% tax
// //       const orderId = orderResponse.data.order_id;
// //       const orderDate = new Date().toISOString().split('T')[0];

// //       // Get PayFast token
// //       const tokenResponse = await fetch(
// //         `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
// //       );

// //       if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
// //       const responseData = await tokenResponse.json();
// //       const token = responseData.ACCESS_TOKEN;

// //       if (!token) throw new Error('Invalid token response from PayFast');

// //       // Generate signature
// //       const generateSignature = (merchantId: string, token: string): string => {
// //         const timestamp = new Date().getTime();
// //         return `SIG-${merchantId}-${timestamp}`;
// //       };

// //       // Create form data for PayFast
// //       const formData = {
// //         MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
// //         MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'My Merchant',
// //         TOKEN: token,
// //         PROCCODE: '00',
// //         TXNAMT: totalAmount.toFixed(2),
// //         CUSTOMER_MOBILE_NO: '03000000000', // This should ideally come from user profile
// //         CUSTOMER_EMAIL_ADDRESS: 'rizcmt195@gmail.com', // This should ideally come from user profile
// //         SIGNATURE: generateSignature(
// //           process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
// //           token
// //         ),
// //         VERSION: 'MY_VER_1.0',
// //         TXNDESC: `Payment for ${selectedTopRatedProduct.name}`,
// //         SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
// //         FAILURE_URL: `${window.location.origin}/failure`,
// //         BASKET_ID: orderId,
// //         ORDER_DATE: orderDate,
// //         CHECKOUT_URL: `${window.location.origin}/confirm`,
// //       };

// //       // Create and submit form to PayFast
// //       const form = document.createElement('form');
// //       form.method = 'POST';
// //       form.action =
// //         'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
// //       form.style.display = 'none';

// //       Object.entries(formData).forEach(([key, value]) => {
// //         const input = document.createElement('input');
// //         input.type = 'hidden';
// //         input.name = key;
// //         input.value = value;
// //         form.appendChild(input);
// //       });

// //       // Add form to document and submit
// //       document.body.appendChild(form);
// //       form.submit();

// //       // Clear the cart item after submission
// //       removeFromCart(selectedTopRatedProduct._id);
// //     } catch (error: any) {
// //       console.error('Order placement error:', error);
// //       toast.error(
// //         error.message || 'An unexpected error occurred during checkout'
// //       );
// //       setProcessing(false);
// //     }
// //   };

// //   const closeModals = () => {
// //     setIsFirstModalOpen(false);
// //     setIsSecondModalOpen(false);
// //     setSelectedTopRatedProduct(null);
// //     setQuantity(1);
// //     setSelectedSize('M');
// //   };

// //   return (
// //     <>
// //       <div>
// //         <div className="at-giftcard">
// //           <div className="at-pagesectiontitle">
// //             <h2>Trending Products</h2>
// //           </div>
// //           <div className="at-cardgrid">
// //             {loading && (
// //               <>
// //                 {[...Array(5)].map((_, index) => (
// //                   <div className="at-carditem" key={index}>
// //                     <Skeleton className="h-40 w-full" />
// //                     <Skeleton className="h-6 w-3/4 mt-2" />
// //                     <Skeleton className="h-4 w-1/2 mt-1" />
// //                   </div>
// //                 ))}
// //               </>
// //             )}

// //             {error && !loading && <p className="error-message">{error}</p>}
// //             {/* {!loading && !error && topPicks.length === 0 && <p>No products available.</p>} */}
// //             {!loading &&
// //               topPicks.map((topPick) => (
// //                 <div
// //                   className="at-carditem cursor-pointer"
// //                   key={topPick._id}
// //                   onClick={() => handleProductClick(topPick)}
// //                 >
// //                   <figure className="at-giftimage">
// //                     <img
// //                       src={topPick.image_path || PRODUCT_PLACEHOLDER}
// //                       alt={topPick.name || 'Product Name'}
// //                     />
// //                   </figure>
// //                   <div className=" at-gifttitle flex items-center justify-between w-full font-bold">
// //                     <h3 className="font-bold text-[14px] m-0">
// //                       {topPick.name}{' '}
// //                     </h3>
// //                     <span className="text-right text-[#40A574]">
// //                       Rs.{topPick.price}
// //                     </span>
// //                   </div>
// //                   <h4 className="font-bold text-[10px]">
// //                     {topPick.company_id.name}
// //                   </h4>
// //                 </div>
// //               ))}
// //           </div>
// //         </div>

// //         {/* First Modal */}
// // {isFirstModalOpen && selectedTopRatedProduct && (
// //   <div
// //     className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
// //     onClick={() => setIsFirstModalOpen(false)}
// //   >
// //     <div
// //       className="bg-white rounded-lg shadow-lg at-modaldailouge"
// //       onClick={(e) => e.stopPropagation()}
// //     >
// //       <div className="flex justify-between items-center relative">
// //         <div className="at-modalcontent p-0">
// //           <button
// //             onClick={() => setIsFirstModalOpen(false)}
// //             className="at-btnpopupclose at-btnpopupclosetwo"
// //           >
// //             <svg
// //               width="32"
// //               height="32"
// //               viewBox="0 0 32 32"
// //               fill="none"
// //               xmlns="http://www.w3.org/2000/svg"
// //             >
// //               <circle cx="16" cy="16" r="16" fill="white" />
// //               <path
// //                 d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
// //                 fill="#434343"
// //               />
// //               <path
// //                 d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
// //                 fill="#434343"
// //               />
// //             </svg>
// //           </button>
// //           <div className="at-modalleftside p-0">
// //             <figure className="at-productimg p-0 m-0">
// //               {selectedTopRatedProduct.background_images[0] !== null ? (
// //                 <img
// //                   src={selectedTopRatedProduct.background_images[0]}
// //                   alt={selectedTopRatedProduct.name}
// //                 />
// //               ) : (
// //                 <img
// //                   src={PRODUCT_PLACEHOLDER}
// //                   alt={
// //                     selectedTopRatedProduct.name !== ''
// //                       ? selectedTopRatedProduct.name
// //                       : 'Product Name'
// //                   }
// //                 />
// //               )}
// //             </figure>
// //           </div>
// //           <div className="at-popupcontentside">
// //             <div className="at-popuptitlebrandimg">
// //               <span>
// //                 <img
// //                   src={`${selectedTopRatedProduct.company_id.company_logo}`}
// //                   alt={`${selectedTopRatedProduct.company_id.name} logo`}
// //                 />
// //               </span>
// //               <div
// //                 className="at-popupproducttitlerating"
// //                 onClick={() =>
// //                   handleReviewsClick(selectedTopRatedProduct._id)
// //                 }
// //               >
// //                 <h4>{selectedTopRatedProduct.company_id.name}</h4>
// //                 <p>3.1 km from you</p>
// //                 <RatingStars
// //                   rating={Math.round(
// //                     selectedTopRatedProduct.total_rating
// //                   )}
// //                 />
// //               </div>
// //             </div>
// //             <div className="at-popupdescription">
// //               <p>{selectedTopRatedProduct.description}</p>
// //             </div>
// //             <div className="at-popupcolorprice">
// //               <div className="at-popupcolor">
// //                 <h3>{selectedTopRatedProduct.name}</h3>
// //                 <span> 300ml/530 kcal</span>
// //               </div>
// //               <div className="at-popupprice">
// //                 <h3>Rs. {selectedTopRatedProduct.price}</h3>
// //               </div>
// //             </div>

// //             <div className="at-productsize">
// //               {['S', 'M', 'L'].map((size) => (
// //                 <span
// //                   key={size}
// //                   onClick={() => setSelectedSize(size)}
// //                   className={
// //                     selectedSize === size
// //                       ? 'bg-[#40A574] text-white'
// //                       : 'bg-gray-200'
// //                   }
// //                 >
// //                   {size}
// //                 </span>
// //               ))}
// //             </div>

// //             <div className="at-btnaddtocart">
// //               {isInCart(selectedTopRatedProduct._id) ? (
// //                 <button onClick={handleGoToCart} className="at-btn">
// //                   Go to Cart
// //                   <svg
// //                     className="mt-3"
// //                     width="24"
// //                     height="24"
// //                     viewBox="0 0 32 32"
// //                     fill="#ffffff"
// //                     xmlns="http://www.w3.org/2000/svg"
// //                   >
// //                     <circle cx="16" cy="16" r="16" fill="white" />
// //                     <path
// //                       d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6
// //                       16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
// //                       fill="#40A574"
// //                     />
// //                   </svg>
// //                 </button>
// //               ) : (
// //                 <button onClick={handleAddToCart} className="at-btn">
// //                   Add to Cart
// //                   <svg
// //                     className="mt-3"
// //                     width="24"
// //                     height="24"
// //                     viewBox="0 0 32 32"
// //                     fill="#ffffff"
// //                     xmlns="http://www.w3.org/2000/svg"
// //                   >
// //                     <circle cx="16" cy="16" r="16" fill="white" />
// //                     <path
// //                       d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
// //                       fill="#40A574"
// //                     />
// //                   </svg>
// //                 </button>
// //               )}
// //               <button
// //                 className="at-btn at-btnpersonal"
// //                 onClick={() => {
// //                   console.log(
// //                     'Personalizing product:',
// //                     selectedTopRatedProduct._id
// //                   );
// //                   handlePersonalize(selectedTopRatedProduct._id);
// //                 }}
// //               >
// //                 Personalize
// //                 <label className="custom-checkbox top-2">
// //                   <input
// //                     className="align-middle"
// //                     type="checkbox"
// //                     checked={hasPersonalization(
// //                       selectedTopRatedProduct._id
// //                     )}
// //                     readOnly
// //                   />
// //                   <span className="checkmark"></span>
// //                 </label>
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   </div>
// // )}

// //         {/* Second Modal */}
// //         {isSecondModalOpen && selectedTopRatedProduct && (
// //           <div
// //             className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
// //             onClick={closeModals}
// //           >
// //             <div
// //               className="bg-white rounded-lg shadow-lg at-modaldailouge"
// //               onClick={(e) => e.stopPropagation()}
// //             >
// //               <div className="flex justify-between items-center flex-col">
// //                 <div className="at-modalcontent">
// //                   <button
// //                     onClick={closeModals}
// //                     className="at-btnpopupclose at-btnpopupclosetwo"
// //                   >
// //                     <svg
// //                       width="32"
// //                       height="3 2"
// //                       viewBox="0 0 32 32"
// //                       fill="none"
// //                       xmlns="http://www.w3.org/2000/svg"
// //                     >
// //                       <g clipPath="url(#clip0_252_1556)">
// //                         <path
// //                           d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
// //                           fill="#434343"
// //                         />
// //                         <path
// //                           d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
// //                           fill="#434343"
// //                         />
// //                         <path
// //                           d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
// //                           fill="#434343"
// //                         />
// //                       </g>
// //                       <defs>
// //                         <clipPath id="clip0_252_1556">
// //                           <rect width="32" height="32" fill="white" />
// //                         </clipPath>
// //                       </defs>
// //                     </svg>
// //                   </button>
// //                   <div className="at-modalleftside at-modalordersummeryleft p-0">
// //                     <figure className="at-productimg m-0 p-0">
// //                       {selectedTopRatedProduct.background_images[0] !== null ? (
// //                         <img
// //                           src={selectedTopRatedProduct.background_images[0]}
// //                           alt={selectedTopRatedProduct.name}
// //                         />
// //                       ) : (
// //                         <img
// //                           src={PRODUCT_PLACEHOLDER}
// //                           alt={
// //                             selectedTopRatedProduct.name !== ''
// //                               ? selectedTopRatedProduct.name
// //                               : 'Product Name'
// //                           }
// //                         />
// //                       )}
// //                     </figure>
// //                   </div>
// //                   <div className="at-popupcontentside">
// //                     <div className="at-popuptitlebrandimg at-modaltitleqnty">
// //                       <div className="at-popupproducttitlerating at-ordersummerytitlearea">
// //                         <h4>{selectedTopRatedProduct.name}</h4>
// //                         <p>{selectedTopRatedProduct.description}</p>
// //                       </div>
// //                       <div className="at-orderquntatiy">
// //                         <div className="at-btnquntatiyholder">
// //                           <button
// //                             onClick={decreaseQuantity}
// //                             disabled={quantity === 1}
// //                           >
// //                             -
// //                           </button>
// //                           <span className="">{quantity}</span>
// //                           <button onClick={increaseQuantity} className="">
// //                             +
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                     <div className="at-ordersummery">
// //                       <h3>Order Summary</h3>
// //                       <ul>
// //                         <li>
// //                           <span>Item</span>
// //                           <span>Rs.{selectedTopRatedProduct.price}</span>
// //                         </li>
// //                         <li>
// //                           <span>Sales Tax 17%</span>
// //                           <span>
// //                             Rs.
// //                             {(
// //                               selectedTopRatedProduct.price *
// //                               0.17 *
// //                               quantity
// //                             ).toFixed(2)}
// //                           </span>
// //                         </li>
// //                         <li>
// //                           <span>Grand Total</span>
// //                           <span>
// //                             Rs.
// //                             {(
// //                               selectedTopRatedProduct.price * quantity +
// //                               selectedTopRatedProduct.price * 0.17 * quantity
// //                             ).toFixed(2)}
// //                           </span>
// //                         </li>
// //                       </ul>
// //                     </div>
// //                   </div>
// //                 </div>
// //                 <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder">
// //                   <button
// //                     type="button"
// //                     className="at-btn"
// //                     onClick={handlePlaceOrder}
// //                     disabled={processing}
// //                   >
// //                     {processing ? 'Processing...' : 'Place Order'}
// //                   </button>
// //                   <Link href="/home">
// //                     <button type="button" className="at-btn at-btncancel">
// //                       Continue Shopping
// //                     </button>
// //                   </Link>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   );
// // };

// // export default TopPicksProducts;

// // src/components/page-ui/top_rated_products.tsx
// 'use client';
// import { useEffect, useState, useRef, useCallback } from 'react';
// import {
//   fetchTopPicks,
//   placeOrder,
//   confirmOrder,
//   fetchCategoryList,
// } from '@/services/api.service';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useCart } from '@/context/CartContext';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';
// import RatingStars from './rating_stars';
// import Link from 'next/link';

// const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// // --- Interfaces (Matching API Responses) ---
// interface TopPickCategory {
//   _id: string;
//   name: string;
//   description: string;
//   search_type: string;
//   image_path: string;
//   is_active: boolean;
//   product_type: string;
//   created_at: string;
//   // 'type' field is not in this nested object
// }

// interface TopPickCompany {
//   _id: string;
//   name: string;
//   description: string;
//   category_ids: string[];
//   subcategory_ids: string[];
//   company_logo: string;
//   featured_image: string;
//   website_url: string;
//   company_email: string;
//   company_contact: string;
//   location_details?: any[]; // Optional based on your usage
//   is_active?: boolean;
//   is_featured?: boolean;
//   product_type?: string;
//   created_at?: string;
//   __v?: number;
// }

// interface TopPicks {
//   _id: string;
//   name: string;
//   product_type: string;
//   description: string;
//   price: number;
//   image_path: string | null;
//   background_images: string[];
//   company_id: TopPickCompany;
//   category_id: TopPickCategory; // Contains category details except 'type'
//   subcategory_id: object; // Define more strictly if needed
//   sticker_path: string;
//   sticker_path_2: string;
//   is_active: boolean;
//   is_featured: boolean;
//   total_rating: number;
//   rating_count: number;
//   specification: any[]; // Define more strictly if needed
//   created_at: string;
//   __v: number;
//   average_rating: string; // Or number
// }

// interface Category {
//   _id: string;
//   name: string;
//   description: string;
//   search_type: string;
//   image_path: string;
//   is_active: boolean;
//   product_type: string;
//   type: number; // The important field for background color
//   created_at: string;
//   __v: number;
// }

// interface ApiResponse {
//   // For Top Picks
//   success: boolean;
//   message: string;
//   data: TopPicks[];
// }

// interface CategoryApiResponse {
//   // For Categories
//   success: boolean;
//   message: string;
//   data: Category[];
// }

// interface PersonalizedMessage {
//   name: string;
//   message: string;
//   image_path: string;
//   image_id: string;
//   productId?: string;
// }
// // --- End Interfaces ---

// const TopPicksProducts: React.FC = () => {
//   // --- State Variables ---
//   const [topPicks, setTopPicks] = useState<TopPicks[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // Modal State
//   const [processing, setProcessing] = useState(false);
//   const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
//   const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
//   const [selectedTopRatedProduct, setSelectedTopRatedProduct] =
//     useState<TopPicks | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState<string>('M'); // Default or manage based on specs

//   // Hooks
//   const router = useRouter();
//   const cartContext = useCart(); // Get full context
//   // Safely access context values with fallbacks
//   const cartItems = cartContext?.cartItems ?? [];
//   const addToCart =
//     cartContext?.addToCart ??
//     (() => {
//       console.error('addToCart function not available from CartContext');
//     });
//   const removeFromCart =
//     cartContext?.removeFromCart ??
//     (() => {
//       console.error('removeFromCart function not available from CartContext');
//     });

//   const errorToastShown = useRef(false); // Keep if used elsewhere

//   // Personalization State
//   const [personalizedMessages, setPersonalizedMessages] = useState<{
//     [key: string]: PersonalizedMessage | undefined;
//   }>({});
//   const [storageChangeKey, setStorageChangeKey] = useState(0); // To potentially force re-renders on storage change
//   // --- End State Variables ---

//   // --- Personalized Messages ---
//   const loadPersonalizedMessages = useCallback(() => {
//     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
//     console.log(
//       '[loadPersonalizedMessages] Reading localStorage value:',
//       storedMessages
//     );
//     try {
//       const messages = storedMessages ? JSON.parse(storedMessages) : {};
//       if (
//         messages &&
//         typeof messages === 'object' &&
//         !Array.isArray(messages)
//       ) {
//         setPersonalizedMessages(messages);
//         console.log(
//           '[loadPersonalizedMessages] SUCCESS: Set state with OBJECT:',
//           messages
//         );
//       } else {
//         console.warn(
//           '[loadPersonalizedMessages] WARN: Parsed value is NOT an object. Setting empty state. Found:',
//           messages
//         );
//         setPersonalizedMessages({});
//       }
//     } catch (error) {
//       console.error(
//         '[loadPersonalizedMessages] ERROR parsing localStorage:',
//         error,
//         'Raw value was:',
//         storedMessages
//       );
//       setPersonalizedMessages({});
//     }
//   }, []); // Empty dependency array

//   // Effect for loading messages and listening to storage changes
//   useEffect(() => {
//     loadPersonalizedMessages(); // Initial load
//     const handleStorageChange = (event: StorageEvent) => {
//       if (event.key === 'selectedPersonalizedMessages') {
//         console.log(
//           "Storage event triggered for 'selectedPersonalizedMessages'"
//         );
//         loadPersonalizedMessages();
//       }
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, [loadPersonalizedMessages]); // Depend on the memoized function
//   // --- End Personalized Message Logic ---

//   // --- Data Fetching Effect ---
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Fetch both APIs concurrently
//         const [picksResponse, categoryResponse] = await Promise.all([
//           fetchTopPicks() as Promise<ApiResponse>,
//           fetchCategoryList() as Promise<CategoryApiResponse>,
//         ]);

//         let fetchError = null;

//         // Process Top Picks Response
//         if (picksResponse?.success) {
//           setTopPicks(picksResponse.data);
//         } else {
//           fetchError = picksResponse?.message || 'Failed to fetch top picks';
//           console.error('Error fetching top picks:', fetchError);
//         }

//         // Process Category Response
//         if (categoryResponse?.success) {
//           setCategories(categoryResponse.data);
//         } else {
//           const catError =
//             categoryResponse?.message || 'Failed to fetch categories';
//           console.error('Error fetching categories:', catError);
//           // Combine errors if both failed
//           fetchError = fetchError ? `${fetchError}; ${catError}` : catError;
//         }

//         // Set final error state if any occurred
//         if (fetchError) {
//           setError(fetchError);
//         }
//       } catch (err: any) {
//         console.error('Error loading data:', err);
//         setError(err.message || 'An unexpected error occurred loading data');
//       } finally {
//         setLoading(false); // Ensure loading is set to false in all cases
//       }
//     };
//     loadData();
//     // No dependencies needed here as it runs once on mount
//   }, []);
//   // --- End Data Fetching Effect ---

//   // --- Background Color Logic ---
//   const getProductBackgroundColor = useCallback(
//     (categoryId?: string): string => {
//       // If no category ID is provided or the categories haven't loaded yet, return default
//       if (!categoryId || categories.length === 0) {
//         return '#FFFFFF'; // Default white background
//       }
//       // Find the category object matching the provided ID
//       const category = categories.find((cat) => cat._id === categoryId);
//       // If no matching category is found, return default
//       if (!category) {
//         return '#FFFFFF';
//       }
//       // Return color based on the 'type' field of the found category
//       switch (category.type) {
//         case 1:
//           return '#FFD05E'; // Yellowish
//         case 2:
//           return '#FF834B'; // Orange
//         case 3:
//           return '#88C1FD'; // Blue
//         case 4:
//           return '#40A574'; // Green
//         default:
//           return '#D6DADA'; // Default white for unknown types
//       }
//     },
//     [categories]
//   ); // Re-run this function only if the categories array changes
//   // --- End Background Color Logic ---

//   // --- Event Handlers (Keep Existing Functions) ---
//   const decreaseQuantity = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const increaseQuantity = () => {
//     setQuantity(quantity + 1);
//   };

//   const isInCart = (productId: string) =>
//     cartItems.some((item) => item._id === productId);

//   const handleProductClick = (product: TopPicks) => {
//     setSelectedTopRatedProduct(product);
//     setQuantity(1); // Reset quantity for new selection
//     // Reset size or set based on product's default/first specification
//     setSelectedSize(product.specification?.[0]?.values?.[0]?.value || 'M');
//     setIsFirstModalOpen(true); // Open the details modal
//   };

//   const handleReviewsClick = (productId: string) => {
//     router.push(`/reviews/${productId}`);
//   };

//   const handleGoToCart = () => {
//     closeModals(); // Close any open modals first
//     router.push('/cart');
//   };

//   const handleAddToCart = () => {
//     if (selectedTopRatedProduct) {
//       const itemToAdd = {
//         _id: selectedTopRatedProduct._id,
//         price: selectedTopRatedProduct.price,
//         quantity,
//         image_path: selectedTopRatedProduct.image_path || PRODUCT_PLACEHOLDER,
//         name: selectedTopRatedProduct.name,
//         description: selectedTopRatedProduct.description,
//         personalization: personalizedMessages[selectedTopRatedProduct._id],
//         // Add size/specs if needed for cart logic
//         // size: selectedSize,
//       };
//       addToCart(itemToAdd);
//       setIsFirstModalOpen(false); // Close details modal
//       setIsSecondModalOpen(true); // Open summary/checkout modal
//     }
//   };

//   const hasPersonalization = (productId: string) => {
//     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
//     if (!storedMessages) return false;
//     try {
//       const messages = JSON.parse(storedMessages);
//       // Check if it's a non-array object and has the productId key
//       return (
//         messages &&
//         typeof messages === 'object' &&
//         !Array.isArray(messages) &&
//         messages.hasOwnProperty(productId)
//       );
//     } catch (e) {
//       console.error(
//         "Error parsing 'selectedPersonalizedMessages' from localStorage:",
//         e
//       );
//       return false;
//     }
//   };

//   const handlePersonalize = (productId: string) => {
//     if (!selectedTopRatedProduct) return;
//     localStorage.setItem('currentItemId', productId);
//     localStorage.setItem('returnPath', window.location.pathname); // Store current path to return to
//     // Optionally store more product details if needed on the messages page
//     // localStorage.setItem('currentItemDetails', JSON.stringify(selectedTopRatedProduct));
//     router.push('/messages');
//     // Consider closing the modal after clicking personalize, or leave it open
//     // closeModals();
//   };

//   const handlePlaceOrder = async () => {
//     if (!selectedTopRatedProduct) return;
//     setProcessing(true); // Indicate processing start

//     try {
//       const orderData = {
//         cart_details: [
//           {
//             product_id: selectedTopRatedProduct._id,
//             quantity: quantity,
//             personalized:
//               personalizedMessages[selectedTopRatedProduct._id] || null,
//             // Include size/specs if needed by backend
//             // specification: { size: selectedSize }
//           },
//         ],
//       };

//       const orderResponse = await placeOrder(orderData);
//       if (!orderResponse.success) {
//         throw new Error(orderResponse.message || 'Failed to place order');
//       }

//       localStorage.setItem('order_id', orderResponse.data.order_id);
//       localStorage.setItem('payment_id', orderResponse.data.payment_id);

//       // Handle Free Product Confirmation
//       if (orderResponse.data.payment_type === 'free') {
//         const confirmResponse = await confirmOrder(
//           orderResponse.data.order_id,
//           orderResponse.data.payment_id
//         );
//         if (confirmResponse) {
//           // Assuming confirmOrder returns success boolean or similar
//           removeFromCart(selectedTopRatedProduct._id); // Remove if added via modal
//           closeModals();
//           router.push('/thankyou'); // Redirect on success
//         } else {
//           throw new Error('Order confirmation failed for free product');
//         }
//         return; // Exit early for free products
//       }

//       // --- PayFast Integration ---
//       const totalAmount = selectedTopRatedProduct.price * quantity * 1.17; // Include tax
//       const orderId = orderResponse.data.order_id;
//       const orderDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

//       // Fetch PayFast Token (Ensure API route exists and env variables are set)
//       const tokenResponse = await fetch(
//         `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
//       );
//       if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
//       const { ACCESS_TOKEN: token } = await tokenResponse.json(); // Destructure token
//       if (!token) throw new Error('Invalid token response from PayFast');

//       // Generate Signature (Example - adapt if needed)
//       const generateSignature = (merchantId: string, token: string): string =>
//         `SIG-${merchantId}-${Date.now()}`;

//       // Prepare PayFast Form Data
//       const formData = {
//         MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
//         MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'Hey Jinie',
//         TOKEN: token,
//         PROCCODE: '00',
//         TXNAMT: totalAmount.toFixed(2),
//         CUSTOMER_MOBILE_NO: '03001234567', // TODO: Replace with actual user data
//         CUSTOMER_EMAIL_ADDRESS: 'user@example.com', // TODO: Replace with actual user data
//         SIGNATURE: generateSignature(
//           process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
//           token
//         ),
//         VERSION: 'JS-ECOMM-1.0', // Use appropriate version
//         TXNDESC: `Order for ${selectedTopRatedProduct.name}`,
//         SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
//         FAILURE_URL: `${window.location.origin}/failure`, // Your failure page
//         BASKET_ID: orderId,
//         ORDER_DATE: orderDate,
//         CHECKOUT_URL: `${window.location.origin}/confirm`, // Your confirmation page URL
//       };

//       // Create and Submit Dynamic Form
//       const form = document.createElement('form');
//       form.method = 'POST';
//       // Ensure correct PayFast endpoint (UAT or Production)
//       form.action =
//         'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction'; // UAT URL
//       form.style.display = 'none';
//       Object.entries(formData).forEach(([key, value]) => {
//         const input = document.createElement('input');
//         input.type = 'hidden';
//         input.name = key;
//         input.value = String(value); // Ensure value is string
//         form.appendChild(input);
//       });
//       document.body.appendChild(form);
//       form.submit();
//       // Form submission redirects the user, no further client-side action needed here
//       // Remove item from cart *after* successful submission is confirmed (usually via webhook or success URL check)
//       // removeFromCart(selectedTopRatedProduct._id); // Maybe remove earlier or on success page load
//     } catch (error: any) {
//       console.error('Order placement/payment error:', error);
//       toast.error(
//         error.message || 'An unexpected error occurred during checkout'
//       );
//       setProcessing(false); // Reset processing state on error
//     }
//     // Note: setProcessing(false) might not be reached if redirection occurs. Handle on return URLs if needed.
//   };

//   const closeModals = () => {
//     setIsFirstModalOpen(false);
//     setIsSecondModalOpen(false);
//     setSelectedTopRatedProduct(null); // Clear selection
//     setQuantity(1); // Reset quantity
//     setSelectedSize('M'); // Reset size
//     setProcessing(false); // Ensure processing indicator is off
//   };
//   // --- End Event Handlers ---

//   // --- Render Logic ---
//   return (
//     <>
//       <div>
//         <div className="at-giftcard">
//           <div className="at-pagesectiontitle">
//             <h2>Trending Products</h2>
//           </div>
//           <div className="at-cardgrid horizontal-scroll overflow-x-auto horizontal-scroll snap-x snap-mandatory">
//             {/* --- Loading State --- */}
//             {loading && (
//               <>
//                 {[...Array(5)].map((_, index) => (
//                   <div
//                     className="at-carditem shadow-md rounded-lg overflow-hidden animate-pulse"
//                     key={`skeleton-${index}`}
//                   >
//                     <Skeleton className="h-40 w-full" />
//                     <div className="p-3">
//                       <Skeleton className="h-5 w-3/4 mt-1" />
//                       <Skeleton className="h-4 w-1/2 mt-2 mb-1" />
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}

//             {/* --- Error State --- */}
//             {error && !loading && (
//               <p className="error-message col-span-full text-center text-red-600">
//                 {' '}
//                 {/* Use grid span */}
//                 Error: {error}
//               </p>
//             )}

//             {/* --- Empty State --- */}
//             {!loading && !error && topPicks.length === 0 && (
//               <p className="col-span-full text-center text-gray-500">
//                 {' '}
//                 {/* Use grid span */}
//                 No trending products available.
//               </p>
//             )}

//             {/* --- Product Cards --- */}
//             {!loading &&
//               !error &&
//               topPicks.length > 0 &&
//               topPicks.map((topPick) => {
//                 const categoryId = topPick.category_id?._id;
//                 const backgroundColor = getProductBackgroundColor(categoryId);

//                 return (
//                   <div
//                     className="at-carditem cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white" // Base white background for text area
//                     key={topPick._id}
//                     onClick={() => handleProductClick(topPick)}
//                   >
//                     <figure className="at-giftimage flex-shrink-0 relative">
//                       <img
//                         // Use sticker_path, fallback to image_path, then placeholder
//                         src={
//                           topPick.sticker_path ||
//                           topPick.image_path ||
//                           PRODUCT_PLACEHOLDER
//                         }
//                         alt={topPick.name || 'Product Image'}
//                         onError={(e) => {
//                           e.currentTarget.onerror = null;
//                           e.currentTarget.src = PRODUCT_PLACEHOLDER;
//                         }}
//                         className="w-full h-40 object-cover" // Image covers area
//                         // *** Apply background color to the image container ***
//                         style={{ backgroundColor: backgroundColor }}
//                       />
//                     </figure>
//                     <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
//                       {' '}
//                       {/* Padding and flex for content */}
//                       <div>
//                         {' '}
//                         {/* Content wrapper */}
//                         <div className="at-gifttitle flex items-start justify-between w-full mb-1">
//                           <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 flex-1 mr-2 truncate">
//                             {' '}
//                             {/* Name styling */}
//                             {topPick.name}
//                           </h3>
//                           <span className="text-right text-green-600 whitespace-nowrap font-bold text-sm">
//                             {' '}
//                             {/* Price styling */}
//                             Rs.{topPick.price}
//                           </span>
//                         </div>
//                         <h4 className="font-semibold text-xs text-gray-600 truncate">
//                           {' '}
//                           {/* Brand styling */}
//                           {topPick.company_id?.name || 'Brand'}
//                         </h4>
//                       </div>
//                       {/* Optional: Display rating stars on card */}
//                       {/* <RatingStars rating={Math.round(topPick.total_rating || 0)} size="small" /> */}
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//         {isFirstModalOpen &&
//           selectedTopRatedProduct &&
//           (() => {
//             // Calculate background color inside IIFE to use selected product
//             const modalCategoryId = selectedTopRatedProduct.category_id?._id;
//             const modalBackgroundColor =
//               getProductBackgroundColor(modalCategoryId);

//             return (
//               <div
//                 className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
//                 onClick={() => setIsFirstModalOpen(false)}
//               >
//                 <div
//                   className="bg-white rounded-lg shadow-lg at-modaldailouge"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className="flex justify-between items-center relative">
//                     <div className="at-modalcontent p-0 ">
//                       <div
//                         style={{ backgroundColor: modalBackgroundColor }}
//                         className="at-modalleftside at-modalcontent"
//                       >
//                         <button
//                           onClick={() => setIsFirstModalOpen(false)}
//                           className="at-btnpopupclose at-btnpopupclosetwo"
//                         >
//                           <svg
//                             width="32"
//                             height="32"
//                             viewBox="0 0 32 32"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <circle cx="16" cy="16" r="16" fill="white" />
//                             <path
//                               d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
//                               fill="#434343"
//                             />
//                             <path
//                               d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
//                               fill="#434343"
//                             />
//                           </svg>
//                         </button>
//                         <div className="at-modalleftside p-0">
//                           <figure className="at-productimg p-0 m-0">
//                             {selectedTopRatedProduct.background_images[0] !==
//                             null ? (
//                               <img
//                                 src={
//                                   selectedTopRatedProduct.background_images[0]
//                                 }
//                                 alt={selectedTopRatedProduct.name}
//                               />
//                             ) : (
//                               <img
//                                 src={PRODUCT_PLACEHOLDER}
//                                 alt={
//                                   selectedTopRatedProduct.name !== ''
//                                     ? selectedTopRatedProduct.name
//                                     : 'Product Name'
//                                 }
//                               />
//                             )}
//                           </figure>
//                         </div>
//                       </div>
//                       <div className="at-popupcontentside">
//                         <div className="at-popuptitlebrandimg">
//                           <span>
//                             <img
//                               src={`${selectedTopRatedProduct.company_id.company_logo}`}
//                               alt={`${selectedTopRatedProduct.company_id.name} logo`}
//                             />
//                           </span>
//                           <div
//                             className="at-popupproducttitlerating"
//                             onClick={() =>
//                               handleReviewsClick(selectedTopRatedProduct._id)
//                             }
//                           >
//                             <h4>{selectedTopRatedProduct.company_id.name}</h4>
//                             <p>3.1 km from you</p>
//                             <RatingStars
//                               rating={Math.round(
//                                 selectedTopRatedProduct.total_rating
//                               )}
//                             />
//                           </div>
//                         </div>
//                         <div className="at-popupdescription">
//                           <p>{selectedTopRatedProduct.description}</p>
//                         </div>
//                         <div className="at-popupcolorprice">
//                           <div className="at-popupcolor">
//                             <h3>{selectedTopRatedProduct.name}</h3>
//                             <span> 300ml/530 kcal</span>
//                           </div>
//                           <div className="at-popupprice">
//                             <h3>Rs. {selectedTopRatedProduct.price}</h3>
//                           </div>
//                         </div>

//                         <div className="at-productsize">
//                           {['S', 'M', 'L'].map((size) => (
//                             <span
//                               key={size}
//                               onClick={() => setSelectedSize(size)}
//                               className={
//                                 selectedSize === size
//                                   ? 'bg-[#40A574] text-white'
//                                   : 'bg-gray-200'
//                               }
//                             >
//                               {size}
//                             </span>
//                           ))}
//                         </div>

//                         <div className="at-btnaddtocart">
//                           {isInCart(selectedTopRatedProduct._id) ? (
//                             <button onClick={handleGoToCart} className="at-btn">
//                               Go to Cart
//                               <svg
//                                 className="mt-3"
//                                 width="24"
//                                 height="24"
//                                 viewBox="0 0 32 32"
//                                 fill="#ffffff"
//                                 xmlns="http://www.w3.org/2000/svg"
//                               >
//                                 <circle cx="16" cy="16" r="16" fill="white" />
//                                 <path
//                                   d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6
//                               16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
//                                   fill="#40A574"
//                                 />
//                               </svg>
//                             </button>
//                           ) : (
//                             <button
//                               onClick={handleAddToCart}
//                               className="at-btn"
//                             >
//                               Add to Cart
//                               <svg
//                                 className="mt-3"
//                                 width="24"
//                                 height="24"
//                                 viewBox="0 0 32 32"
//                                 fill="#ffffff"
//                                 xmlns="http://www.w3.org/2000/svg"
//                               >
//                                 <circle cx="16" cy="16" r="16" fill="white" />
//                                 <path
//                                   d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
//                                   fill="#40A574"
//                                 />
//                               </svg>
//                             </button>
//                           )}
//                           <button
//                             className="at-btn at-btnpersonal"
//                             onClick={() => {
//                               console.log(
//                                 'Personalizing product:',
//                                 selectedTopRatedProduct._id
//                               );
//                               handlePersonalize(selectedTopRatedProduct._id);
//                             }}
//                           >
//                             Personalize
//                             <label className="custom-checkbox top-2">
//                               <input
//                                 className="align-middle"
//                                 type="checkbox"
//                                 checked={hasPersonalization(
//                                   selectedTopRatedProduct._id
//                                 )}
//                                 readOnly
//                               />
//                               <span className="checkmark"></span>
//                             </label>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })()}

//         {isSecondModalOpen &&
//           selectedTopRatedProduct &&
//           (() => {
//             // Calculate background color for this modal instance
//             const modalCategoryId = selectedTopRatedProduct.category_id?._id;
//             const modalBackgroundColor =
//               getProductBackgroundColor(modalCategoryId);
//             return (
//               <div
//                 className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
//                 onClick={closeModals}
//               >
//                 <div
//                   className="bg-white rounded-lg shadow-lg at-modaldailouge "
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className="flex justify-between items-center flex-col">
//                     <div className="at-modalcontent">
//                       <div
//                         style={{ backgroundColor: modalBackgroundColor }}
//                         className="at-modalleftside"
//                       >
//                         <button
//                           onClick={closeModals}
//                           className="at-btnpopupclose at-btnpopupclosetwo"
//                         >
//                           <svg
//                             width="32"
//                             height="3 2"
//                             viewBox="0 0 32 32"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <g clipPath="url(#clip0_252_1556)">
//                               <path
//                                 d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
//                                 fill="#434343"
//                               />
//                               <path
//                                 d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
//                                 fill="#434343"
//                               />
//                               <path
//                                 d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
//                                 fill="#434343"
//                               />
//                             </g>
//                             <defs>
//                               <clipPath id="clip0_252_1556">
//                                 <rect width="32" height="32" fill="white" />
//                               </clipPath>
//                             </defs>
//                           </svg>
//                         </button>
//                         <div className="at-modalleftside at-modalordersummeryleft p-0">
//                           <figure className="at-productimg m-0 p-0">
//                             {selectedTopRatedProduct.sticker_path !== null ? (
//                               <img
//                                 src={selectedTopRatedProduct.sticker_path}
//                                 alt={selectedTopRatedProduct.name}
//                               />
//                             ) : (
//                               <img
//                                 src={PRODUCT_PLACEHOLDER}
//                                 alt={
//                                   selectedTopRatedProduct.name !== ''
//                                     ? selectedTopRatedProduct.name
//                                     : 'Product Name'
//                                 }
//                               />
//                             )}
//                           </figure>
//                         </div>
//                       </div>
//                       <div className="at-popupcontentside">
//                         <div className="at-popuptitlebrandimg at-modaltitleqnty">
//                           <div className="at-popupproducttitlerating at-ordersummerytitlearea">
//                             <h4>{selectedTopRatedProduct.name}</h4>
//                             <p>{selectedTopRatedProduct.description}</p>
//                           </div>
//                           <div className="at-orderquntatiy">
//                             <div className="at-btnquntatiyholder">
//                               <button
//                                 onClick={decreaseQuantity}
//                                 disabled={quantity === 1}
//                               >
//                                 -
//                               </button>
//                               <span className="">{quantity}</span>
//                               <button onClick={increaseQuantity} className="">
//                                 +
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="at-ordersummery">
//                           <h3>Order Summary</h3>
//                           <ul>
//                             <li>
//                               <span>Item</span>
//                               <span>Rs.{selectedTopRatedProduct.price}</span>
//                             </li>
//                             <li>
//                               <span>Sales Tax 17%</span>
//                               <span>
//                                 Rs.
//                                 {(
//                                   selectedTopRatedProduct.price *
//                                   0.17 *
//                                   quantity
//                                 ).toFixed(2)}
//                               </span>
//                             </li>
//                             <li>
//                               <span>Grand Total</span>
//                               <span>
//                                 Rs.
//                                 {(
//                                   selectedTopRatedProduct.price * quantity +
//                                   selectedTopRatedProduct.price *
//                                     0.17 *
//                                     quantity
//                                 ).toFixed(2)}
//                               </span>
//                             </li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder">
//                       <button
//                         type="button"
//                         className="at-btn"
//                         onClick={handlePlaceOrder}
//                         disabled={processing}
//                       >
//                         {processing ? 'Processing...' : 'Place Order'}
//                       </button>
//                       <Link href="/home">
//                         <button type="button" className="at-btn at-btncancel">
//                           Continue Shopping
//                         </button>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })()}
//         {/* End IIFE for Second Modal */}
//       </div>{' '}
//       {/* End Main Wrapper */}
//     </>
//   );
// };

// export default TopPicksProducts;

'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  fetchTopPicks,
  placeOrder,
  confirmOrder,
  fetchCategoryList,
} from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import RatingStars from './rating_stars';
import Link from 'next/link';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
const MODEL_BG_PATH = '/images/model-bg'; // Path to default background images

// --- Interfaces (Matching API Responses & Modal Needs) ---
interface TopPickCategory {
  _id: string;
  name: string;
  // No 'type' field here
}

interface TopPickCompany {
  _id: string;
  name: string;
  company_logo: string;
}

interface SpecificationValue {
  value: string;
  additional_info?: string;
  price: number; // Additional price for this spec value
  _id: string;
}

interface Specification {
  name: string;
  type: string;
  values: SpecificationValue[];
}

interface TopPicks {
  _id: string;
  name: string;
  description: string;
  price: number; // Base price
  image_path: string | null;
  background_images: string[]; // Ensured to be an array
  company_id: TopPickCompany;
  category_id: TopPickCategory;
  sticker_path: string | null; // Allow null
  total_rating: number;
  specification: Specification[]; // Updated for detailed specs
  // Other fields as previously defined
  product_type: string;
  subcategory_id: object;
  sticker_path_2: string | null;
  is_active: boolean;
  is_featured: boolean;
  rating_count: number;
  created_at: string;
  __v: number;
  average_rating: string; // Or number
}

interface Category {
  _id: string;
  name: string;
  type: number; // The important field for background color/image
  // Other fields as previously defined
  description: string;
  search_type: string;
  image_path: string;
  is_active: boolean;
  product_type: string;
  created_at: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: TopPicks[];
}

interface CategoryApiResponse {
  success: boolean;
  message: string;
  data: Category[];
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

interface Company {
  _id: string;
  name: string;
  company_logo: string;
  category_ids?: Array<{ _id: string; name?: string }>;
  subcategory_ids?: Array<{ _id: string; name?: string; category_id?: string }>;
}
// --- End Interfaces ---

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

// --- Helper Function for Modal Background Image ---
const getDefaultBgImageForType = (type?: number): string => {
  const valid_type =
    typeof type === 'number' && type >= 1 && type <= 4 ? type : null;
  switch (valid_type) {
    case 1:
      return `${MODEL_BG_PATH}/pd_bg_1.jpg`;
    case 2:
      return `${MODEL_BG_PATH}/pd_bg_2.jpg`;
    case 3:
      return `${MODEL_BG_PATH}/pd_bg_3.jpg`;
    case 4:
      return `${MODEL_BG_PATH}/pd_bg_4.jpg`;
    default:
      return `${MODEL_BG_PATH}/pd_bg_1.jpg`; // Default fallback
  }
};

// --- Helper Function for Card Background Color ---
const getCardBackgroundColor = (type?: number): string => {
  switch (type) {
    case 1:
      return '#FFD05E'; // Yellowish
    case 2:
      return '#FF834B'; // Orange
    case 3:
      return '#88C1FD'; // Blue
    case 4:
      return '#40A574'; // Green
    default:
      return '#D6DADA'; // Default light gray for cards
  }
};

const TopPicksProducts: React.FC = () => {
  // --- State Variables ---
  const [topPicks, setTopPicks] = useState<TopPicks[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Full category data for types
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [processing, setProcessing] = useState(false);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedTopRatedProduct, setSelectedTopRatedProduct] =
    useState<TopPicks | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(''); // Initialize empty
  const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0);
  const [currentImageSliderIndex, setCurrentImageSliderIndex] = useState(0);
  
  const [brands, setBrands] = useState<Company[]>([]);

  // Hooks
  const router = useRouter();
  const cartContext = useCart();
  const cartItems = cartContext?.cartItems ?? [];
  const addToCart = cartContext?.addToCart ?? (() => {});
  const removeFromCart = cartContext?.removeFromCart ?? (() => {});

  // Personalization State
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage | undefined;
  }>({});
  // --- End State Variables ---

  // --- Personalized Messages ---
  const loadPersonalizedMessages = useCallback(() => {
    const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
    try {
      const messages = storedMessages ? JSON.parse(storedMessages) : {};
      if (
        messages &&
        typeof messages === 'object' &&
        !Array.isArray(messages)
      ) {
        setPersonalizedMessages(messages);
      } else {
        setPersonalizedMessages({});
      }
    } catch (error) {
      console.error(
        '[loadPersonalizedMessages] ERROR parsing localStorage:',
        error
      );
      setPersonalizedMessages({});
    }
  }, []);

  useEffect(() => {
    loadPersonalizedMessages();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'selectedPersonalizedMessages') {
        loadPersonalizedMessages();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadPersonalizedMessages]);
  // --- End Personalized Message Logic ---

  // --- Data Fetching Effect ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [picksResponse, categoryResponse] = await Promise.all([
          fetchTopPicks() as Promise<ApiResponse>,
          fetchCategoryList() as Promise<CategoryApiResponse>,
        ]);

        let fetchError = null;
        if (picksResponse?.success) {
          setTopPicks(picksResponse.data);
        } else {
          fetchError = picksResponse?.message || 'Failed to fetch top picks';
        }
        if (categoryResponse?.success) {
          setCategories(categoryResponse.data);
        } else {
          const catError =
            categoryResponse?.message || 'Failed to fetch categories';
          fetchError = fetchError ? `${fetchError}; ${catError}` : catError;
        }
        if (fetchError) setError(fetchError);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  // --- End Data Fetching Effect ---

  // --- Modal Background Logic ---
  const getModalLeftPanelStyle = useCallback(
    (product?: TopPicks | null): React.CSSProperties => {
      let categoryType: number | undefined = undefined;
      if (product?.category_id?._id && categories.length > 0) {
        const fullCategory = categories.find(
          (cat) => cat._id === product.category_id._id
        );
        categoryType = fullCategory?.type;
      }
      const finalBgImage = getDefaultBgImageForType(categoryType);
      return {
        backgroundImage: `url('${finalBgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },
    [categories]
  ); // Depend on full categories list
  // --- End Modal Background Logic ---

  // --- Event Handlers ---
  const decreaseQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQuantity = () => setQuantity((q) => q + 1);
  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

  const handleProductClick = (product: TopPicks) => {
    setSelectedTopRatedProduct(product);
    setQuantity(1);
    setCurrentImageSliderIndex(0);

    const firstSpecGroup = product.specification?.[0];
    const initialSpecValue = firstSpecGroup?.values?.[0]?.value || 'M'; // Default to 'M'
    const initialSpec =
      firstSpecGroup?.values?.find((v) => v.value === initialSpecValue) ||
      firstSpecGroup?.values?.[0];
    const rawInitialSpecPrice = initialSpec?.price;
    const initialSpecPriceNum = Number(rawInitialSpecPrice);

    setSelectedSize(initialSpecValue);
    setSelectedSpecPrice(isNaN(initialSpecPriceNum) ? 0 : initialSpecPriceNum);

    setIsFirstModalOpen(true);
  };

  const handleSelectSize = (sizeValue: string, specPrice: number) => {
    setSelectedSize(sizeValue);
    setSelectedSpecPrice(isNaN(specPrice) ? 0 : specPrice);
  };

  const handleReviewsClick = (productId: string) =>
    router.push(`/reviews/${productId}`);
  const handleGoToCart = () => {
    closeModals();
    router.push('/cart');
  };

  const handleAddToCart = () => {
    if (selectedTopRatedProduct) {
      const cartImage = selectedTopRatedProduct.background_images?.[0]
        ? selectedTopRatedProduct.background_images[0] // Assuming full URLs
        : selectedTopRatedProduct.sticker_path
        ? selectedTopRatedProduct.sticker_path
        : selectedTopRatedProduct.image_path
        ? selectedTopRatedProduct.image_path
        : PRODUCT_PLACEHOLDER;

      const itemToAdd = {
        _id: selectedTopRatedProduct._id,
        price: selectedTopRatedProduct.price + selectedSpecPrice,
        quantity,
        image_path: cartImage,
        name: selectedTopRatedProduct.name,
        description: selectedTopRatedProduct.description,
        personalization: personalizedMessages[selectedTopRatedProduct._id],
        specification: selectedTopRatedProduct.specification?.length
          ? selectedTopRatedProduct.specification
          : [
              {
                name: 'Size',
                type: 'button',
                values: [
                  {
                    value: selectedSize,
                    price: selectedSpecPrice,
                    _id: `spec-default-${selectedTopRatedProduct._id}`,
                  },
                ],
              },
            ],
        size: selectedSize,
      };
      addToCart(itemToAdd as any);
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(true);
    }
  };

  const hasPersonalization = (productId: string) =>
    !!personalizedMessages[productId];

  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem('returnPath', window.location.pathname);
    router.push('/messages');
  };

  const handlePlaceOrder = async () => {
    if (!selectedTopRatedProduct) return;
    setProcessing(true);
    try {
      const finalProductPrice =
        selectedTopRatedProduct.price + selectedSpecPrice;
      const orderSpecification =
        selectedSize && selectedTopRatedProduct.specification?.[0]?.name
          ? [
              {
                name: selectedTopRatedProduct.specification[0].name,
                values: [{ value: selectedSize, price: selectedSpecPrice }],
              },
            ]
          : null;

      const orderData = {
        cart_details: [
          {
            product_id: selectedTopRatedProduct._id,
            quantity: quantity,
            personalized:
              personalizedMessages[selectedTopRatedProduct._id] || null,
            specification: orderSpecification,
          },
        ],
      };
      const orderResponse = await placeOrder(orderData);
      if (!orderResponse.success)
        throw new Error(orderResponse.message || 'Failed to place order');

      localStorage.setItem('order_id', orderResponse.data.order_id);
      localStorage.setItem('payment_id', orderResponse.data.payment_id);

      if (orderResponse.data.payment_type === 'free') {
        const confirmResponse = await confirmOrder(
          orderResponse.data.order_id,
          orderResponse.data.payment_id
        );
        if (confirmResponse) {
          removeFromCart(selectedTopRatedProduct._id);
          const currentPersonalizations = { ...personalizedMessages };
          delete currentPersonalizations[selectedTopRatedProduct._id];
          localStorage.setItem(
            'selectedPersonalizedMessages',
            JSON.stringify(currentPersonalizations)
          );
          setPersonalizedMessages(currentPersonalizations);
          closeModals();
          router.push('/thankyou');
        } else {
          throw new Error('Order confirmation failed');
        }
        return;
      }

      const totalAmount = finalProductPrice * quantity * 1.17;
      const orderId = orderResponse.data.order_id;
      const orderDate = new Date().toISOString().split('T')[0];

      const tokenResponse = await fetch(
        `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
      );
      if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
      const responseData = await tokenResponse.json();
      const token = responseData.ACCESS_TOKEN;
      if (!token) throw new Error('Invalid token response from PayFast');

      const generateSignature = (merchantId: string): string =>
        `SIG-${merchantId}-${new Date().getTime()}`;

      const formData = {
        MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
        MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'Hey Jinie',
        TOKEN: token,
        PROCCODE: '00',
        TXNAMT: totalAmount.toFixed(2),
        CUSTOMER_MOBILE_NO: '03000000000',
        CUSTOMER_EMAIL_ADDRESS: 'test@example.com',
        SIGNATURE: generateSignature(
          process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || ''
        ),
        VERSION: 'PYMT_WEB_DI_1.0', // Match PriceFilter's version
        TXNDESC: `Order ${orderId} - ${selectedTopRatedProduct.name}`,
        SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
        FAILURE_URL: `${window.location.origin}/failure?order_id=${orderId}`,
        BASKET_ID: orderId,
        ORDER_DATE: orderDate,
        CHECKOUT_URL: `${window.location.origin}/confirm?order_id=${orderId}`,
      };

      const form = document.createElement('form');
      form.method = 'POST';
      form.action =
        'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
      form.style.display = 'none';
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(
        error.message || 'An unexpected error occurred during checkout'
      );
      setProcessing(false);
    }
  };

  const closeModals = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setSelectedTopRatedProduct(null);
    setQuantity(1);
    setSelectedSize('');
    setSelectedSpecPrice(0);
    setCurrentImageSliderIndex(0);
    setProcessing(false);
  };

  const handlePrevContentImage = () => {
    if (
      !selectedTopRatedProduct?.background_images ||
      selectedTopRatedProduct.background_images.length <= 1
    )
      return;
    const imageCount = selectedTopRatedProduct.background_images.length;
    setCurrentImageSliderIndex(
      (prevIndex) => (prevIndex - 1 + imageCount) % imageCount
    );
  };

  const handleNextContentImage = () => {
    if (
      !selectedTopRatedProduct?.background_images ||
      selectedTopRatedProduct.background_images.length <= 1
    )
      return;
    const imageCount = selectedTopRatedProduct.background_images.length;
    setCurrentImageSliderIndex((prevIndex) => (prevIndex + 1) % imageCount);
  };
  // --- End Event Handlers ---

  // --- Render Logic ---
  return (
    <>
      <div>
        <div className="at-giftcard">
          <div className="at-pagesectiontitle">
            <h2>Trending Products</h2>
          </div>
          <div className="at-cardgrid horizontal-scroll overflow-x-auto snap-x snap-mandatory pb-2 flex ">
            {loading &&
              [...Array(5)].map((_, index) => (
                <div
                  className="at-carditem shadow-md rounded-lg overflow-hidden bg-white w-48 md:w-56 flex-shrink-0 snap-start"
                  key={`skeleton-trending-${index}`}
                >
                  <Skeleton className="h-40 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 mt-1" />
                    <Skeleton className="h-4 w-1/2 mt-2 mb-1" />
                  </div>
                </div>
              ))}

            {error && !loading && (
              <p className="text-center text-red-600 py-4 w-full">{error}</p>
            )}

            {!loading && !error && topPicks.length === 0 && (
              <p className="text-center text-gray-500 py-4 w-full">
                No trending products available.
              </p>
            )}

            {!loading &&
              !error &&
              topPicks.length > 0 &&
              topPicks.map((topPick) => {
                const fullCategory = categories.find(
                  (c) => c._id === topPick.category_id?._id
                );
                const cardBgColor = getCardBackgroundColor(fullCategory?.type);
                const cardImageSrc =
                  topPick.sticker_path ||
                  topPick.image_path ||
                  PRODUCT_PLACEHOLDER;

                return (
                  <div
                    className="at-carditem cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white w-48 md:w-56 flex-shrink-0 snap-start"
                    key={topPick._id}
                    onClick={() => handleProductClick(topPick)}
                  >
                    <figure
                      className="at-giftimage flex-shrink-0 relative h-40 w-full"
                      style={{ backgroundColor: cardBgColor }}
                    >
                      <img
                        src={cardImageSrc}
                        alt={topPick.name || 'Product Image'}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PRODUCT_PLACEHOLDER;
                        }}
                        className="w-full h-full object-contain p-2"
                      />
                    </figure>
                    <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="at-gifttitle flex items-start justify-between w-full mb-1">
                          <h3
                            className="font-bold text-sm m-0 leading-tight text-gray-800 flex-1 mr-2 truncate"
                            title={topPick.name}
                          >
                            {topPick.name}
                          </h3>
                          <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
                            Rs.{topPick.price}
                          </span>
                        </div>
                        <h4
                          className="font-semibold text-xs text-gray-500 truncate"
                          title={topPick.company_id?.name}
                        >
                          {topPick.company_id?.name || 'Brand'}
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* --- Modals --- */}
      {/* First Modal: Product Details (Styled like PriceFilterResult) */}
     {isFirstModalOpen && selectedTopRatedProduct && (
        <div
          className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row">
              <div
                className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
                style={getModalLeftPanelStyle()}
              >
                <button
                  onClick={closeModals}
                  className="at-btnpopupclose at-btnpopupclosetwo"
                >
                  {/* Close SVG */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_252_1556)">
                      <path
                        d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
                        fill="#434343"
                      />
                      <path
                        d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
                        fill="#434343"
                      />
                      <path
                        d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
                        fill="#434343"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_252_1556">
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
                  {selectedTopRatedProduct.background_images &&
                  selectedTopRatedProduct.background_images.length > 0 ? (
                    <>
                      <img
                        src={
                          selectedTopRatedProduct.background_images[
                            currentImageSliderIndex
                          ] || PRODUCT_PLACEHOLDER
                        }
                        alt={`${selectedTopRatedProduct.name} - image ${
                          currentImageSliderIndex + 1
                        }`}
                        className="object-contain w-full h-full "
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />
                      {selectedTopRatedProduct.background_images.length > 1 && ( // Show dots only if more than 1 image
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                          {selectedTopRatedProduct.background_images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageSliderIndex(index);
                              }}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                currentImageSliderIndex === index
                                  ? 'bg-white'
                                  : 'bg-gray-300 hover:bg-gray-100'
                              }`}
                              aria-label={`View image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Fallback if background_images array is somehow empty (shouldn't happen with ProductForModal transform)
                    <img
                      src={PRODUCT_PLACEHOLDER}
                      alt={selectedTopRatedProduct.name}
                      className="object-contain w-full h-full transition-opacity duration-300 ease-in-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          PRODUCT_PLACEHOLDER;
                      }}
                    />
                  )}
                </figure>
              </div>

              <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
                <div>
                  <div className="at-popuptitlebrandimg flex items-start mb-3">
                    <span className="w-12 h-12 mr-3 overflow-hidden flex-shrink-0">
                      <img
                        src={
                          selectedTopRatedProduct.company_id?.company_logo ||
                          PRODUCT_PLACEHOLDER
                        }
                        alt={`${
                          selectedTopRatedProduct.company_id?.name || 'Brand'
                        } logo`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />
                    </span>
                    <div
                      className="at-popupproduct titlerating flex-grow cursor-pointer"
                      onClick={() => handleReviewsClick(selectedTopRatedProduct._id)}
                      title="View Reviews"
                    >
                      <h4 className="font-semibold text-lg text-gray-800">
                        {selectedTopRatedProduct.company_id?.name || 'Brand Name'}
                      </h4>
                      <div className="flex justify-start align-middle">
                        <RatingStars
                          rating={Math.round(selectedTopRatedProduct.total_rating)}
                        />{' '}
                        <p className='align-middle'>({Math.round(selectedTopRatedProduct.total_rating)})</p>
                      </div>
                    </div>
                  </div>

                  <div className="at-popupcolorprice flex justify-between items-start my-3">
                    <div className="at-popupcolor flex-grow mr-4">
                      <h3 className="font-bold text-xl text-gray-900">
                        {selectedTopRatedProduct.name}
                      </h3>
                    </div>
                    <div className="at-popupprice flex-shrink-0">
                      <h3 className="font-bold text-xl text-[#40A574]">
                        Rs. {selectedTopRatedProduct.price + selectedSpecPrice}{' '}
                        {/* Display combined price */}
                      </h3>
                    </div>
                  </div>

                  <div className="at-popupdescription mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedTopRatedProduct.description ||
                        'No description available.'}
                    </p>
                  </div>

                  {selectedTopRatedProduct.specification &&
                    selectedTopRatedProduct.specification.length > 0 &&
                    selectedTopRatedProduct.specification[0].values &&
                    selectedTopRatedProduct.specification[0].values.length > 0 && (
                      <div className="at-productsize mb-4">
                        <label className="block text-base font-medium text-gray-700 mb-1">
                          {selectedTopRatedProduct.specification[0].name || 'Options'}
                        </label>
                        <div className=" overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-2">
                          {selectedTopRatedProduct.specification[0].values.map(
                            (specValue) => {
                              const specPriceNum = Number(specValue.price);
                              const displaySpecPrice =
                                isNaN(specPriceNum) || specPriceNum === 0
                                  ? ''
                                  : ` (+${specPriceNum})`;
                              return (
                                <button
                                  key={specValue._id || specValue.value}
                                  onClick={() => {
                                    setSelectedSize(specValue.value);
                                    setSelectedSpecPrice(
                                      isNaN(specPriceNum) ? 0 : specPriceNum
                                    );
                                  }}
                                  className={`px-5 py-3 border rounded-full text-base transition-colors duration-150 ${
                                    selectedSize === specValue.value
                                      ? 'bg-[#40A574] text-white border-[#40A574]'
                                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                  }`}
                                >
                                  {specValue.value}
                                  {displaySpecPrice}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>

                <div className="at-btnaddtocart">
                  {isInCart(selectedTopRatedProduct._id) ? (
                    <button onClick={handleGoToCart} className="at-btn">
                      Go to Cart
                      {/* SVG */}
                      <svg
                        className="mt-3"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="#ffffff"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="16" cy="16" r="16" fill="white" />
                        <path
                          d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
                          fill="#40A574"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button onClick={handleAddToCart} className="at-btn">
                      Add to Cart
                      {/* SVG */}
                      <svg
                        className="mt-3"
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="#ffffff"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="16" cy="16" r="16" fill="white" />
                        <path
                          d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
                          fill="#40A574"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    className="at-btn at-btnpersonal"
                    onClick={() => handlePersonalize(selectedTopRatedProduct._id)}
                  >
                    Personalize
                    <label className="custom-checkbox top-2">
                      <input
                        className="align-middle"
                        type="checkbox"
                        checked={hasPersonalization(selectedTopRatedProduct._id)}
                        readOnly
                      />
                      <span className="checkmark"></span>
                    </label>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Second Modal: Order Summary (Styled like PriceFilterResult) */}
    {isSecondModalOpen && selectedTopRatedProduct && (
        <div
          className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center flex-col">
              {' '}
              {/* Changed: flex-col to match typical modal flow better */}
              <div className="at-modalcontent w-full">
                {' '}
                {/* Added w-full for consistency */}
                <div
                className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
                style={getModalLeftPanelStyle()}
              >
                <button
                  onClick={closeModals}
                  className="at-btnpopupclose at-btnpopupclosetwo"
                >
                  {/* Close SVG */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_252_1556)">
                      <path
                        d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
                        fill="#434343"
                      />
                      <path
                        d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
                        fill="#434343"
                      />
                      <path
                        d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
                        fill="#434343"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_252_1556">
                        <rect width="32" height="32" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
                  {selectedTopRatedProduct.background_images &&
                  selectedTopRatedProduct.background_images.length > 0 ? (
                    <>
                      <img
                        src={
                          selectedTopRatedProduct.background_images[
                            currentImageSliderIndex
                          ] || PRODUCT_PLACEHOLDER
                        }
                        alt={`${selectedTopRatedProduct.name} - image ${
                          currentImageSliderIndex + 1
                        }`}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                      />
                      {selectedTopRatedProduct.background_images.length > 1 && ( // Show dots only if more than 1 image
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                          {selectedTopRatedProduct.background_images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageSliderIndex(index);
                              }}
                              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                currentImageSliderIndex === index
                                  ? 'bg-white'
                                  : 'bg-gray-300 hover:bg-gray-100'
                              }`}
                              aria-label={`View image ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // Fallback if background_images array is somehow empty (shouldn't happen with ProductForModal transform)
                    <img
                      src={PRODUCT_PLACEHOLDER}
                      alt={selectedTopRatedProduct.name}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          PRODUCT_PLACEHOLDER;
                      }}
                    />
                  )}
                </figure>
              </div>
                <div className="at-popupcontentside p-6">
                  {' '}
                  {/* Added padding for consistency */}
                  <div className="at-popuptitlebrandimg at-modaltitleqnty">
                    <div className="at-popupproducttitlerating at-ordersummerytitlearea">
                      <h4>{selectedTopRatedProduct.name}</h4>
                      <p>{selectedTopRatedProduct.description}</p>
                    </div>
                    <div className="at-orderquntatiy">
                      <div className="at-btnquntatiyholder">
                        <button
                          onClick={decreaseQuantity}
                          disabled={quantity === 1}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button onClick={increaseQuantity}>+</button>
                      </div>
                    </div>
                  </div>
                  <div className="at-ordersummery">
                    <h3>Order Summary</h3>
                    <ul>
                      <li>
                        <span>Item Price</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(selectedTopRatedProduct.price + selectedSpecPrice).toFixed(
                            2
                          )}
                        </span>
                      </li>
                      <li>
                        <span>Quantity</span>
                      </li>
                      <li>
                        <span>{quantity}</span>
                      </li>
                      <li>
                        <span>Subtotal</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(
                            (selectedTopRatedProduct.price + selectedSpecPrice) *
                            quantity
                          ).toFixed(2)}
                        </span>
                      </li>
                      <li>
                        <span>Sales Tax 17%</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(
                            (selectedTopRatedProduct.price + selectedSpecPrice) *
                            quantity *
                            0.17
                          ).toFixed(2)}
                        </span>
                      </li>
                      <li>
                        <span>Grand Total</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(
                            (selectedTopRatedProduct.price + selectedSpecPrice) *
                            quantity *
                            1.17
                          ).toFixed(2)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder pt-5">
                    {' '}
                    {/* Adjusted margin/padding */}
                    <button
                      type="button"
                      className="at-btn"
                      onClick={handlePlaceOrder}
                      disabled={processing}
                    >
                      {processing ? 'Processing...' : 'Place Order'}
                    </button>
                    <a href="/home">
                      {' '}
                      {/* Consider using router.push('/home') for SPA navigation */}
                      <button type="button" className="at-btn at-btncancel">
                        Continue Shopping
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} 
      </div>
    </>
  );
};

export default TopPicksProducts;
