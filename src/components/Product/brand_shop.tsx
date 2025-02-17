// // src/components/brand_shop/brand_shop.tsx

// 'use client';
// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useCart } from '@/context/CartContext';
// import { fetchProductDetails, placeOrder } from '@/services/api.service';
// import { toast } from 'react-toastify';
// import DealOfDay from '../dealofday/dealofday';

// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   quantity: number;
//   price: number;
//   image_path: string;
//   background_image: string;
//   is_featured: boolean;
//   sticker_path: string;
// }

// interface PersonalizedMessage {
//   name: string;
//   message: string;
//   image_path: string;
//   image_id: string;
//   productId?: string;
// }

// export default function BrandShop() {
//   const { brandId, brandname } = useParams();
//   const router = useRouter();
//   const { cartItems, addToCart, removeFromCart } = useCart();
//   const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

//   const [selectedSize, setSelectedSize] = useState('M');
//   const [quantity, setQuantity] = useState(1);
//   const [personalizedMessages, setPersonalizedMessages] = useState<{
//     [key: string]: PersonalizedMessage;
//   }>({});

// const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
// const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
// const [brandLogo, setBrandLogo] = useState<string | null>(null);

// const decreaseQuantity = () => {
//   if (quantity > 1) setQuantity(quantity - 1);
// };

// const increaseQuantity = () => {
//   setQuantity(quantity + 1);
// };

// const isInCart = (productId: string) =>
//   cartItems.some((item) => item._id === productId);

//   // Fetch products on mount
//   useEffect(() => {
//     setBrandLogo(sessionStorage.getItem('brandLogo'));

//     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
//     if (storedMessages) {
//       const messages = JSON.parse(storedMessages);
//       const messageMap: { [key: string]: PersonalizedMessage } = {};
//       messages.forEach((msg: PersonalizedMessage) => {
//         if (msg.productId) {
//           messageMap[msg.productId] = msg;
//         }
//       });
//       setPersonalizedMessages(messageMap);
//     }
//   }, []);

//   // Fetch products
//   useEffect(() => {
//     const loadProducts = async () => {
//       if (!brandId) return;
//       try {
//         setLoading(true);
//         const response = await fetchProductDetails(brandId as string);
//         if (response.success) {
//           setFeaturedProducts(response.data.filter((product: Product) => product.is_featured));
//           setProducts(response.data);
//         } else {
//           setError(response.message);
//         }
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProducts();
//   }, [brandId])

//   const hasPersonalization = (productId: string) => {
//     return !!personalizedMessages[productId];
//   };

//   const handleProductClick = (product: Product) => {
//     setSelectedProduct(product);
//     setIsFirstModalOpen(true);
//   };

//   useEffect(() => {
//     // Load personalized messages from localStorage
//     const loadPersonalizedMessages = () => {
//       const storedMessages = localStorage.getItem(
//         'selectedPersonalizedMessages'
//       );
//       if (storedMessages) {
//         const messages = JSON.parse(storedMessages);
//         const messageMap: { [key: string]: PersonalizedMessage } = {};
//         messages.forEach((msg: PersonalizedMessage) => {
//           if (msg.productId) {
//             messageMap[msg.productId] = msg;
//           }
//         });
//         setPersonalizedMessages(messageMap);
//       }
//     };

//     loadPersonalizedMessages();
//   }, []);

//   const handlePersonalize = (productId: string) => {
//     localStorage.setItem('currentItemId', productId);
//     localStorage.setItem('returnPath', window.location.pathname);
//     router.push('/messages');
//   };

//   const handleAddToCart = () => {
//     if (selectedProduct) {
//       const itemToAdd = {
//         _id: selectedProduct._id,
//         price: selectedProduct.price,
//         quantity,
//         image_path: selectedProduct.image_path,
//         name: selectedProduct.name,
//         description: selectedProduct.description,
//         personalization: personalizedMessages[selectedProduct._id],
//       };
//       addToCart(itemToAdd);
//       setIsFirstModalOpen(false);
//       setIsSecondModalOpen(true);
//     }
//   };

//   const handleGoToCart = () => {
//     setIsFirstModalOpen(false);
//     router.push('/cart');
//   };

//   // Handle order placement
//   const handlePlaceOrder = async () => {
//     if (!selectedProduct) return;

//     const orderData = {
//       cart_details: [
//         {
//           product_DealOfDayid: selectedProduct._id,
//           quantity: quantity,
//         },
//       ],
//       personalized: personalizedMessages[selectedProduct._id], // Use array
//     };

//     try {
//       const response = await placeOrder(orderData);
//       if (response.success) {
//         toast.success('Order placed successfully!');
//         removeFromCart(selectedProduct._id);
//         router.push('/thankyou');
//       } else {
//         toast.error(response.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <>
//       <div className="at-giftcard">
//         {error && <p className="error-message">{error}</p>}
//         <div className="at-pagesectiontitle flex items-center gap-2">
//           <img
//             width={50}
//             height={50}
//             src={`${brandLogo}`}
//             alt={`${brandname}`}
//           />
//           <h2>
//             {typeof brandname === 'string'
//               ? decodeURIComponent(brandname)
//               : 'Unknown Brand'}{' '}
//             Shop
//           </h2>
//         </div>

//         <div className="at-pagesectiontitle ">
//           <h2>Featured Products</h2>
//         </div>

//         <div className="at-cardgrid">
//           {loading && <Skeleton className="h-40 w-full" />}
//           {!loading &&
//             featuredProducts.map((product) => (
//               <div
//                 className="at-carditem cursor-pointer"
//                 key={product._id}
//                 onClick={() => handleProductClick(product)}
//               >
//                 <figure className="at-giftimage">
//                   <img src={product.image_path} alt={product.name} />
//                 </figure>
//                 <div className="at-gifttitle flex items-center justify-between w-full font-bold">
//                   <h3 className="font-bold text-[14px] m-0">{product.name} </h3>
//                   <span className="text-right text-[#40A574]">
//                     Rs.{product.price}
//                   </span>
//                 </div>
//                 <h4 className="font-bold text-[10px]">{brandname}</h4>
//               </div>
//             ))}
//         </div>

//         {loading && <Skeleton className="h-40 w-full" />}
//         {!loading &&
//           products.map((product) => (
//             <>
//               {loading && <Skeleton className="h-40 w-full" />}
//               <DealOfDay
//                 productImage={product.sticker_path}
//                 productName={product.name}
//               />
//               <br /> <br />
//               <div className="at-pagesectiontitle ">
//                 <h2>Menu</h2>
//               </div>
//               <div className="at-cardgrid">
//                 <div
//                   className="at-carditem cursor-pointer"
//                   key={product._id}
//                   onClick={() => handleProductClick(product)}
//                 >
//                   <figure className="at-giftimage">
//                     <img src={product.image_path} alt={product.name} />
//                   </figure>
//                   <div className="at-gifttitle flex items-center justify-between w-full font-bold">
//                     <h3 className="font-bold text-[14px] m-0">
//                       {product.name}{' '}
//                     </h3>
//                     <span className="text-right text-[#40A574]">
//                       Rs.{product.price}
//                     </span>
//                   </div>
//                   <h4 className="font-bold text-[10px]">{brandname}</h4>
//                 </div>
//               </div>
//             </>
//           ))}
//       </div>

//       {/* Personalization Modal */}
//       {isFirstModalOpen && selectedProduct && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//           onClick={() => setIsFirstModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg shadow-lg at-modaldailouge"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center relative">
//               <div className="at-modalcontent p-0">
//                 <button
//                   onClick={() => setIsFirstModalOpen(false)}
//                   className="at-btnpopupclose at-btnpopupclosetwo"
//                 >
//                   <svg
//                     width="32"
//                     height="32"
//                     viewBox="0 0 32 32"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <circle cx="16" cy="16" r="16" fill="white" />
//                     <path
//                       d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
//                       fill="#434343"
//                     />
//                     <path
//                       d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
//                       fill="#434343"
//                     />
//                   </svg>
//                 </button>
//                 <div className="at-modalleftside p-0">
//                   <figure className="at-productimg p-0 m-0">
//                     <img
//                       src={`${BASE_URL}/${selectedProduct.background_image}`}
//                       alt={selectedProduct.name}
//                     />
//                   </figure>
//                 </div>
//                 <div className="at-popupcontentside">
//                   <div className="at-popuptitlebrandimg">
//                     <span>
//                       <img src={`${brandLogo}`} alt={`${brandname} logo`} />
//                     </span>
//                     <div className="at-popupproducttitlerating">
//                       <h4>{selectedProduct.name}</h4>
//                       <p>3.1 km from you</p>
//                       <em>
//                         <svg
//                           width="93"
//                           height="14"
//                           viewBox="0 0 93 14"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M7.36104 11.6082L2.81252 14L3.68126 8.93493L0 5.34725L5.08567 4.6082L7.36104 0L9.63566 4.6082L14.7213 5.34725L11.0408 8.93493L11.9103 14L7.36104 11.6082Z"
//                             fill="#FFD05E"
//                           />
//                           <path
//                             d="M26.7983 11.6082L22.2498 14L23.1185 8.93493L19.4373 5.34725L24.5229 4.6082L26.7983 0L29.0729 4.6082L34.1586 5.34725L30.4781 8.93493L31.3475 14L26.7983 11.6082Z"
//                             fill="#FFD05E"
//                           />
//                           <path
//                             d="M46.2355 11.6082L41.687 14L42.5558 8.93493L38.8745 5.34725L43.9602 4.6082L46.2355 0L48.5102 4.6082L53.5958 5.34725L49.9153 8.93493L50.7848 14L46.2355 11.6082Z"
//                             fill="#FFD05E"
//                           />
//                           <path
//                             d="M65.673 11.6082L61.1245 14L61.9933 8.93493L58.312 5.34725L63.3977 4.6082L65.673 0L67.9477 4.6082L73.0333 5.34725L69.3528 8.93493L70.2223 14L65.673 11.6082Z"
//                             fill="#FFD05E"
//                           />
//                           <path
//                             d="M85.1105 11.6082L80.562 14L81.4308 8.93493L77.7495 5.34725L82.8352 4.6082L85.1105 0L87.3852 4.6082L92.4708 5.34725L88.7903 8.93493L89.6598 14L85.1105 11.6082Z"
//                             fill="#FFD05E"
//                           />
//                         </svg>
//                       </em>
//                     </div>
//                   </div>
//                   <div className="at-popupdescription">
//                     <p>{selectedProduct.description}</p>
//                   </div>
//                   <div className="at-popupcolorprice">
//                     <div className="at-popupcolor">
//                       <h3>{selectedProduct.name}</h3>
//                       <span>300ml/530 kcal</span>
//                     </div>
//                     <div className="at-popupprice">
//                       <h3>PKR {selectedProduct.price}</h3>
//                     </div>
//                   </div>

//                   <div className="at-productsize">
//                     {['S', 'M', 'L'].map((size) => (
//                       <span
//                         key={size}
//                         onClick={() => setSelectedSize(size)}
//                         className={
//                           selectedSize === size
//                             ? 'bg-[#40A574] text-white'
//                             : 'bg-gray-200'
//                         }
//                       >
//                         {size}
//                       </span>
//                     ))}
//                   </div>

//                   <div className="at-btnaddtocart">
//                     {isInCart(selectedProduct._id) ? (
//                       <button onClick={handleGoToCart} className="at-btn">
//                         Go to Cart
//                         <svg
//                           className="mt-3"
//                           width="24"
//                           height="24"
//                           viewBox="0 0 32 32"
//                           fill="#ffffff"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <circle cx="16" cy="16" r="16" fill="white" />
//                           <path
//                             d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
//                             fill="#40A574"
//                           />
//                         </svg>
//                       </button>
//                     ) : (
//                       <button onClick={handleAddToCart} className="at-btn">
//                         Add to Cart
//                         <svg
//                           className="mt-3"
//                           width="24"
//                           height="24"
//                           viewBox="0 0 32 32"
//                           fill="#ffffff"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <circle cx="16" cy="16" r="16" fill="white" />
//                           <path
//                             d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
//                             fill="#40A574"
//                           />
//                         </svg>
//                       </button>
//                     )}
//                     <button
//                       className="at-btn at-btnpersonal"
//                       onClick={() => handlePersonalize(selectedProduct._id)}
//                     >
//                       Personalize
//                       <input
//                         type="checkbox"
//                         className="align-middle w-4 h-4 mt-3"
//                         checked={hasPersonalization(selectedProduct._id)}
//                         readOnly
//                       />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Second Modal */}

//       {isSecondModalOpen && selectedProduct && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
//           onClick={() => setIsSecondModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg shadow-lg at-modaldailouge"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center flex-col">
//               <div className="at-modalcontent p-0">
//                 <div className="at-modalleftside at-modalordersummeryleft">
//                   <button
//                     onClick={() => setIsSecondModalOpen(false)}
//                     className="at-btnpopupclose at-btnpopupclosetwo"
//                   >
//                     <svg
//                       width="32"
//                       height="32"
//                       viewBox="0 0 32 32"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <g clipPath="url(#clip0_252_1556)">
//                         <path
//                           d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
//                           fill="#434343"
//                         />
//                         <path
//                           d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
//                           fill="#434343"
//                         />
//                         <path
//                           d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
//                           fill="#434343"
//                         />
//                       </g>
//                       <defs>
//                         <clipPath id="clip0_252_1556">
//                           <rect width="32" height="32" fill="white" />
//                         </clipPath>
//                       </defs>
//                     </svg>
//                   </button>
//                   <figure className="at-productimg">
//                     <img
//                       src={`${BASE_URL}/${selectedProduct.background_image}`}
//                       // src={selectedProduct.image_path}
//                       alt={selectedProduct.name}
//                     />
//                   </figure>
//                 </div>
//                 <div className="at-popupcontentside">
//                   <div className="at-popuptitlebrandimg at-modaltitleqnty">
//                     <div className="at-popupproducttitlerating at-ordersummerytitlearea">
//                       <h4>{selectedProduct.name}</h4>
//                       <p>{selectedProduct.description}</p>
//                     </div>
//                     <div className="at-orderquntatiy">
//                       <div className="at-btnquntatiyholder">
//                         <button
//                           onClick={decreaseQuantity}
//                           disabled={quantity === 1}
//                         >
//                           -
//                         </button>
//                         <span className="">{quantity}</span>
//                         <button onClick={increaseQuantity} className="">
//                           +
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="at-ordersummery">
//                     <h3>Order Summary</h3>
//                     <ul>
//                       <li>
//                         <span>Item</span>
//                         {/* <span>{selectedProduct.name}</span> */}
//                       </li>
//                       <li>
//                         {/* <span>Price</span> */}
//                         <span>Rs.{selectedProduct.price}</span>
//                       </li>
//                       <li>
//                         <span>Sales Tax 17%</span>
//                       </li>
//                       <li>
//                         <span>
//                           Rs.
//                           {(selectedProduct.price * 0.17 * quantity).toFixed(2)}
//                         </span>
//                       </li>
//                       <li>
//                         <span>Grand Total</span>
//                       </li>
//                       <li>
//                         <span>
//                           Rs.
//                           {(
//                             selectedProduct.price * quantity +
//                             selectedProduct.price * 0.17 * quantity
//                           ).toFixed(2)}
//                         </span>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder">
//                 {/* <a href="/checkout"> */}
//                 <button
//                   type="button"
//                   className="at-btn"
//                   onClick={handlePlaceOrder}
//                 >
//                   Place Order
//                 </button>
//                 {/* </a> */}
//                 <a href="/homepage">
//                   <button type="button" className="at-btn at-btncancel">
//                     Continue Shopping
//                   </button>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { fetchProductDetails, placeOrder } from '@/services/api.service';
import { toast } from 'react-toastify';
import DealOfDay from './dealofday';
import RatingStars from '../page-ui/rating_stars';

interface Product {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  image_path: string;
  background_image: string;
  is_featured: boolean;
  sticker_path: string;
  total_rating: number;
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

export default function BrandShop() {
  const { brandId, brandname } = useParams();
  const router = useRouter();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

  // State declarations
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage;
  }>({});
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [brandLogo, setBrandLogo] = useState<string | null>(null);

  // Load brand logo and personalized messages on mount
  useEffect(() => {
    setBrandLogo(sessionStorage.getItem('brandLogo'));

    const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
    if (storedMessages) {
      const messages = JSON.parse(storedMessages);
      const messageMap: { [key: string]: PersonalizedMessage } = {};
      messages.forEach((msg: PersonalizedMessage) => {
        if (msg.productId) {
          messageMap[msg.productId] = msg;
        }
      });
      setPersonalizedMessages(messageMap);
    }
  }, []);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      if (!brandId) return;
      try {
        setLoading(true);
        const response = await fetchProductDetails(brandId as string);
        if (response.success) {
          setFeaturedProducts(
            response.data.filter((product: Product) => product.is_featured)
          );
          setProducts(response.data);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [brandId]);

  // Product handlers
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity
    setIsFirstModalOpen(true);
  };

  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem('returnPath', window.location.pathname);
    router.push('/messages');
  };

  const hasPersonalization = (productId: string) => {
    return !!personalizedMessages[productId];
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    addToCart({
      _id: selectedProduct._id,
      price: selectedProduct.price,
      quantity,
      image_path: selectedProduct.image_path,
      name: selectedProduct.name,
      description: selectedProduct.description,
      personalization: personalizedMessages[selectedProduct._id],
    });

    setIsFirstModalOpen(false);
    setIsSecondModalOpen(true);
  };

  const handleGoToCart = () => {
    setIsFirstModalOpen(false);
    router.push('/cart');
  };

  const handleReviewsClick = (productId: string) => {
    router.push(`/reviews/${productId}`);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

  const handlePlaceOrder = async () => {
    if (!selectedProduct || isPlacingOrder) return;

    setIsPlacingOrder(true); // Prevent further submissions
    try {
      const response = await placeOrder({
        cart_details: [
          {
            product_id: selectedProduct._id,
            quantity: quantity,
          },
        ],
        personalized: personalizedMessages[selectedProduct._id],
      });

      if (response.success) {
        toast.success('Order placed successfully!');
        removeFromCart(selectedProduct._id);
        router.push('/thankyou');
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPlacingOrder(false); // Reset submission state
    }
  };

  // Render functions
  const renderFeaturedProducts = () => (
    <div className="at-cardgrid">
      {loading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        featuredProducts.map((product) => (
          <div
            className="at-carditem cursor-pointer"
            key={product._id}
            onClick={() => handleProductClick(product)}
          >
            <figure className="at-giftimage">
              <img src={product.image_path} alt={product.name} />
            </figure>
            <div className="at-gifttitle flex items-center justify-between w-full font-bold">
              <h3 className="font-bold text-[14px] m-0">{product.name}</h3>
              <span className="text-right text-[#40A574]">
                Rs.{product.price}
              </span>
            </div>
            <h4 className="font-bold text-[10px]">{brandname}</h4>
          </div>
        ))
      )}
    </div>
  );

  const renderMenuProducts = () => (
    <>
      {products.map((product) => (
        <React.Fragment key={product._id}>
          <DealOfDay
            productImage={product.sticker_path}
            productName={product.name}
          />
          <br /> <br />
          <div className="at-pagesectiontitle">
            <h2>Menu</h2>
          </div>
          <div className="at-cardgrid">
            <div
              className="at-carditem cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <figure className="at-giftimage">
                <img src={product.image_path} alt={product.name} />
              </figure>
              <div className="at-gifttitle flex items-center justify-between w-full font-bold">
                <h3 className="font-bold text-[14px] m-0">{product.name}</h3>
                <span className="text-right text-[#40A574]">
                  Rs.{product.price}
                </span>
              </div>
              <h4 className="font-bold text-[10px]">{brandname}</h4>
            </div>
          </div>
        </React.Fragment>
      ))}
    </>
  );

  return (
    <>
      <div className="at-giftcard">
        {error && <p className="error-message">{error}</p>}

        <div className="at-pagesectiontitle flex items-center gap-2">
          {brandLogo && (
            <img width={50} height={50} src={brandLogo} alt={`${brandname}`} />
          )}
          <h2>
            {typeof brandname === 'string'
              ? decodeURIComponent(brandname)
              : 'Unknown Brand'}{' '}
            Shop
          </h2>
        </div>

        <div className="at-pagesectiontitle">
          <h2>Featured Products</h2>
        </div>

        {renderFeaturedProducts()}
        {renderMenuProducts()}

        {/* <div className="at-cardgrid">
          {loading && <Skeleton className="h-40 w-full" />}
          {!loading &&
            featuredProducts.map((product) => (
              <div
                className="at-carditem cursor-pointer"
                key={product._id}
                onClick={() => handleProductClick(product)}
              >
                <figure className="at-giftimage">
                  <img src={product.image_path} alt={product.name} />
                </figure>
                <div className="at-gifttitle flex items-center justify-between w-full font-bold">
                  <h3 className="font-bold text-[14px] m-0">{product.name} </h3>
                  <span className="text-right text-[#40A574]">
                    Rs.{product.price}
                  </span>
                </div>
                <h4 className="font-bold text-[10px]">{brandname}</h4>
              </div>
            ))}
        </div>

        {loading && <Skeleton className="h-40 w-full" />}
        {!loading &&
          products.map((product) => (
            <>
              {loading && <Skeleton className="h-40 w-full" />}
              <DealOfDay
                productImage={product.sticker_path}
                productName={product.name}
              />
              <br /> <br />
              <div className="at-pagesectiontitle ">
                <h2>Menu</h2>
              </div>
              <div className="at-cardgrid">
                <div
                  className="at-carditem cursor-pointer"
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                >
                  <figure className="at-giftimage">
                    <img src={product.image_path} alt={product.name} />
                  </figure>
                  <div className="at-gifttitle flex items-center justify-between w-full font-bold">
                    <h3 className="font-bold text-[14px] m-0">
                      {product.name}{' '}
                    </h3>
                    <span className="text-right text-[#40A574]">
                      Rs.{product.price}
                    </span>
                  </div>
                  <h4 className="font-bold text-[10px]">{brandname}</h4>
                </div>
              </div>
            </>
          ))} */}
      </div>

      {/* Personalization Modal */}
      {isFirstModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsFirstModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center relative">
              <div className="at-modalcontent p-0">
                <button
                  onClick={() => setIsFirstModalOpen(false)}
                  className="at-btnpopupclose at-btnpopupclosetwo"
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="16" cy="16" r="16" fill="white" />
                    <path
                      d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
                      fill="#434343"
                    />
                    <path
                      d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
                      fill="#434343"
                    />
                  </svg>
                </button>
                <div className="at-modalleftside p-0">
                  <figure className="at-productimg p-0 m-0">
                    <img
                      src={`${BASE_URL}/${selectedProduct.background_image}`}
                      alt={selectedProduct.name}
                    />
                  </figure>
                </div>
                <div className="at-popupcontentside">
                  <div className="at-popuptitlebrandimg">
                    <span>
                      <img src={`${brandLogo}`} alt={`${brandname} logo`} />
                    </span>
                    <div
                      className="at-popupproducttitlerating"
                      onClick={() => handleReviewsClick(selectedProduct._id)}
                    >
                      <h4>{selectedProduct.name}</h4>
                      <p>3.1 km from you</p>
                      <RatingStars rating={selectedProduct.total_rating} />
                    </div>
                  </div>
                  <div className="at-popupdescription">
                    <p>{selectedProduct.description}</p>
                  </div>
                  <div className="at-popupcolorprice">
                    <div className="at-popupcolor">
                      <h3>{selectedProduct.name}</h3>
                      <span>300ml/530 kcal</span>
                    </div>
                    <div className="at-popupprice">
                      <h3>PKR {selectedProduct.price}</h3>
                    </div>
                  </div>

                  <div className="at-productsize">
                    {['S', 'M', 'L'].map((size) => (
                      <span
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={
                          selectedSize === size
                            ? 'bg-[#40A574] text-white'
                            : 'bg-gray-200'
                        }
                      >
                        {size}
                      </span>
                    ))}
                  </div>

                  <div className="at-btnaddtocart">
                    {isInCart(selectedProduct._id) ? (
                      <button onClick={handleGoToCart} className="at-btn">
                        Go to Cart
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
                      onClick={() => handlePersonalize(selectedProduct._id)}
                    >
                      Personalize
                      <input
                        type="checkbox"
                        className="align-middle w-4 h-4"
                        checked={hasPersonalization(selectedProduct._id)}
                        readOnly
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Second Modal */}

      {isSecondModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsSecondModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center flex-col">
              <div className="at-modalcontent p-0">
                <div className="at-modalleftside at-modalordersummeryleft">
                  <button
                    onClick={() => setIsSecondModalOpen(false)}
                    className="at-btnpopupclose at-btnpopupclosetwo"
                  >
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
                          d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
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
                  <figure className="at-productimg">
                    <img
                      src={`${BASE_URL}/${selectedProduct.background_image}`}
                      // src={selectedProduct.image_path}
                      alt={selectedProduct.name}
                    />
                  </figure>
                </div>
                <div className="at-popupcontentside">
                  <div className="at-popuptitlebrandimg at-modaltitleqnty">
                    <div className="at-popupproducttitlerating at-ordersummerytitlearea">
                      <h4>{selectedProduct.name}</h4>
                      <p>{selectedProduct.description}</p>
                    </div>
                    <div className="at-orderquntatiy">
                      <div className="at-btnquntatiyholder">
                        <button
                          onClick={decreaseQuantity}
                          disabled={quantity === 1}
                        >
                          -
                        </button>
                        <span className="">{quantity}</span>
                        <button onClick={increaseQuantity} className="">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="at-ordersummery">
                    <h3>Order Summary</h3>
                    <ul>
                      <li>
                        <span>Item</span>
                        {/* <span>{selectedProduct.name}</span> */}
                      </li>
                      <li>
                        {/* <span>Price</span> */}
                        <span>Rs.{selectedProduct.price}</span>
                      </li>
                      <li>
                        <span>Sales Tax 17%</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(selectedProduct.price * 0.17 * quantity).toFixed(2)}
                        </span>
                      </li>
                      <li>
                        <span>Grand Total</span>
                      </li>
                      <li>
                        <span>
                          Rs.
                          {(
                            selectedProduct.price * quantity +
                            selectedProduct.price * 0.17 * quantity
                          ).toFixed(2)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder">
                <button
                  type="button"
                  className="at-btn"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
                <a href="/homepage">
                  <button type="button" className="at-btn at-btncancel">
                    Continue Shopping
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
