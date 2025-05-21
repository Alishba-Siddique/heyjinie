// // // // // // src/app/components/Product/sub_category_page.tsx
// // // // // 'use client';
// // // // // import { useEffect, useState, useCallback } from 'react';
// // // // // import { useRouter, useParams } from 'next/navigation';
// // // // // import {
// // // // //   fetchSubCategoryList,
// // // // //   fetchCompanyList,
// // // // //   fetchProductDetails,
// // // // //   placeOrder,
// // // // //   confirmOrder,
// // // // // } from '@/services/api.service';
// // // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // // import { useCart } from '@/context/CartContext';
// // // // // import { toast } from 'react-toastify';
// // // // // import RatingStars from '../page-ui/rating_stars';
// // // // // import Link from 'next/link';

// // // // // const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// // // // // // Define type-based background settings
// // // // // const getCategoryBackground = (type: number) => {
// // // // //   switch (type) {
// // // // //     case 1:
// // // // //       return { image: 'pd_bg_1', color: '#FFD05E' };
// // // // //     case 2:
// // // // //       return { image: 'pd_bg_2', color: '#FF834B' };
// // // // //     case 3:
// // // // //       return { image: 'pd_bg_3', color: '#88C1FD' };
// // // // //     case 4:
// // // // //       return { image: 'pd_bg_4', color: '#40A574' };
// // // // //     default:
// // // // //       return { image: 'pd_bg_1', color: '#FFD05E' }; // Default fallback
// // // // //   }
// // // // // };

// // // // // interface Company {
// // // // //   _id: string;
// // // // //   name: string;
// // // // //   company_logo: string;
// // // // //   subcategory_ids: Array<{
// // // // //     _id: string;
// // // // //     name: string;
// // // // //     category_id: string;
// // // // //   }>;
// // // // // }

// // // // // interface Product {
// // // // //   _id: string;
// // // // //   name: string;
// // // // //   price: number;
// // // // //   image_path: string;
// // // // //   sticker_path: string;
// // // // //   description: string;
// // // // //   company_id: string;
// // // // //   subcategory_id: string;
// // // // //   background_image: string;
// // // // //   is_featured: boolean;
// // // // //   total_rating: number;
// // // // // }

// // // // // interface PersonalizedMessage {
// // // // //   name: string;
// // // // //   message: string;
// // // // //   image_path: string;
// // // // //   image_id: string;
// // // // //   productId?: string;
// // // // // }

// // // // // interface CategoryInfo {
// // // // //   _id: string;
// // // // //   name: string;
// // // // //   type?: number;
// // // // // }

// // // // // const SubCategoryPage = () => {
// // // // //   const router = useRouter();
// // // // //   const params = useParams();
// // // // //   const { subcategory } = params;
// // // // //   const [brands, setBrands] = useState<Company[]>([]);
// // // // //   const [products, setProducts] = useState<Product[]>([]);
// // // // //   const [loading, setLoading] = useState<boolean>(true);
// // // // //   const [error, setError] = useState<string | null>(null);
// // // // //   const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
// // // // //   // const [subcategories, setSubCategories] = useState<any[]>([]);
// // // // //   const [brandsLoading, setBrandsLoading] = useState<boolean>(true);
// // // // //   const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
// // // // //   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
// // // // //   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

// // // // //   // Combined modal states
// // // // //   const [processing, setProcessing] = useState(false);
// // // // //   const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
// // // // //   const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

// // // // //   const { cartItems, addToCart, removeFromCart } = useCart();
// // // // //   const [quantity, setQuantity] = useState(1);
// // // // //   const [selectedSize, setSelectedSize] = useState<string>('M');

// // // // //   const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
// // // // //   const decreaseQuantity = () => {
// // // // //     if (quantity > 1) setQuantity(quantity - 1);
// // // // //   };

// // // // //   const increaseQuantity = () => {
// // // // //     setQuantity(quantity + 1);
// // // // //   };

// // // // //   const isInCart = (productId: string) =>
// // // // //     cartItems.some((item) => item._id === productId);

// // // // //   // Personalized messages
// // // // //   const [personalizedMessages, setPersonalizedMessages] = useState<{
// // // // //     [key: string]: PersonalizedMessage | undefined;
// // // // //   }>({});

// // // // //   const loadPersonalizedMessages = useCallback(() => {
// // // // //     // --- Read IMMEDIATELY ---
// // // // //     const storedMessagesImmediately = localStorage.getItem(
// // // // //       'selectedPersonalizedMessages'
// // // // //     );
// // // // //     console.log(
// // // // //       '[loadPersonalizedMessages] START - Raw value:',
// // // // //       storedMessagesImmediately
// // // // //     );

// // // // //     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
// // // // //     console.log(
// // // // //       '[loadPersonalizedMessages] Reading localStorage value:',
// // // // //       storedMessages
// // // // //     );
// // // // //     try {
// // // // //       // Default to null if storedMessages is empty/null to avoid parsing "null"
// // // // //       const messages = storedMessages ? JSON.parse(storedMessages) : {};
// // // // //       console.log('[loadPersonalizedMessages] Parsed messages:', messages);
// // // // //       console.log(
// // // // //         '[loadPersonalizedMessages] Type of parsed:',
// // // // //         typeof messages,
// // // // //         'Is Array:',
// // // // //         Array.isArray(messages)
// // // // //       );

// // // // //       if (
// // // // //         messages &&
// // // // //         typeof messages === 'object' &&
// // // // //         !Array.isArray(messages)
// // // // //       ) {
// // // // //         setPersonalizedMessages(messages);
// // // // //         console.log(
// // // // //           '[loadPersonalizedMessages] SUCCESS: Set state with OBJECT:',
// // // // //           messages
// // // // //         );
// // // // //       } else {
// // // // //         console.warn(
// // // // //           '[loadPersonalizedMessages] WARN: Parsed value is NOT an object. Setting empty state. Found:',
// // // // //           messages
// // // // //         );
// // // // //         setPersonalizedMessages({}); // Ensure state is reset
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error(
// // // // //         '[loadPersonalizedMessages] ERROR parsing localStorage:',
// // // // //         error,
// // // // //         'Raw value was:',
// // // // //         storedMessages
// // // // //       );
// // // // //       setPersonalizedMessages({}); // Ensure state is reset on error
// // // // //     }
// // // // //   }, []);

// // // // //   useEffect(() => {
// // // // //     loadPersonalizedMessages(); // Initial load

// // // // //     const handleStorageChange = (event: StorageEvent) => {
// // // // //       if (event.key === 'selectedPersonalizedMessages') {
// // // // //         console.log(
// // // // //           "Storage event triggered for 'selectedPersonalizedMessages' in ShopCategories"
// // // // //         );
// // // // //         loadPersonalizedMessages(); // Reload state from localStorage
// // // // //       }
// // // // //       // Add listener for the other key if needed
// // // // //       if (event.key === 'personalizedMessages') {
// // // // //         console.log("Storage event triggered for 'personalizedMessages'");
// // // // //         // Decide if you need to react to changes in this key as well
// // // // //       }
// // // // //     };

// // // // //     window.addEventListener('storage', handleStorageChange);

// // // // //     return () => {
// // // // //       window.removeEventListener('storage', handleStorageChange);
// // // // //     };
// // // // //   }, [loadPersonalizedMessages]);

// // // // //   const hasPersonalization = (productId: string) => {
// // // // //     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
// // // // //     if (storedMessages) {
// // // // //       try {
// // // // //         const messages = JSON.parse(storedMessages);

// // // // //         // Check if it's the expected object format (non-null, object, not an array)
// // // // //         if (
// // // // //           messages &&
// // // // //           typeof messages === 'object' &&
// // // // //           !Array.isArray(messages)
// // // // //         ) {
// // // // //           return messages.hasOwnProperty(productId);
// // // // //         } else {
// // // // //           // Log a warning if the format is unexpected
// // // // //           console.warn(
// // // // //             `'selectedPersonalizedMessages' in localStorage is not the expected object format for product ID ${productId}. Found:`,
// // // // //             messages
// // // // //           );
// // // // //           return false; // Treat unexpected format as 'not personalized' for this check
// // // // //         }
// // // // //       } catch (e) {
// // // // //         console.error(
// // // // //           "Error parsing 'selectedPersonalizedMessages' from localStorage:",
// // // // //           e
// // // // //         );
// // // // //         return false;
// // // // //       }
// // // // //     }
// // // // //     return false;
// // // // //   };

// // // // //   const handlePersonalize = (productId: string) => {
// // // // //     localStorage.setItem('currentItemId', productId);
// // // // //     localStorage.setItem('returnPath', window.location.pathname);
// // // // //     router.push('/messages');
// // // // //   };

// // // // //   const handleProductClick = (product: Product) => {
// // // // //     setSelectedProduct(product);
// // // // //     setIsFirstModalOpen(true);
// // // // //   };

// // // // //   const handleAddToCart = () => {
// // // // //     if (selectedProduct) {
// // // // //       const itemToAdd = {
// // // // //         _id: selectedProduct._id,
// // // // //         price: selectedProduct.price,
// // // // //         quantity,
// // // // //         image_path: selectedProduct.image_path,
// // // // //         sticker_path: selectedProduct.sticker_path,
// // // // //         name: selectedProduct.name,
// // // // //         description: selectedProduct.description,
// // // // //         personalization: personalizedMessages[selectedProduct._id],
// // // // //       };
// // // // //       addToCart(itemToAdd);
// // // // //       setIsFirstModalOpen(false);
// // // // //       setIsSecondModalOpen(true);
// // // // //     }
// // // // //   };

// // // // //   const handleGoToCart = () => {
// // // // //     setIsFirstModalOpen(false);
// // // // //     router.push('/cart');
// // // // //   };

// // // // //   // Handle order placement
// // // // //   const handlePlaceOrder = async () => {
// // // // //     if (!selectedProduct) return;

// // // // //     try {
// // // // //       setProcessing(true);
// // // // //       const orderData = {
// // // // //         cart_details: [
// // // // //           {
// // // // //             product_id: selectedProduct._id,
// // // // //             quantity: quantity,
// // // // //             personalized: personalizedMessages[selectedProduct._id] || null,
// // // // //           },
// // // // //         ],
// // // // //       };

// // // // //       const orderResponse = await placeOrder(orderData);

// // // // //       if (!orderResponse.success) {
// // // // //         throw new Error(orderResponse.message || 'Failed to place order');
// // // // //       }

// // // // //       localStorage.setItem('order_id', orderResponse.data.order_id);
// // // // //       localStorage.setItem('payment_id', orderResponse.data.payment_id);

// // // // //       if (orderResponse.data.payment_type === 'free') {
// // // // //         const confirmResponse = await confirmOrder(
// // // // //           orderResponse.data.order_id,
// // // // //           orderResponse.data.payment_id
// // // // //         );

// // // // //         if (confirmResponse) {
// // // // //           removeFromCart(selectedProduct._id);
// // // // //           closeModals();
// // // // //           router.push('/thankyou');
// // // // //         } else {
// // // // //           throw new Error('Order confirmation failed');
// // // // //         }
// // // // //         return;
// // // // //       }

// // // // //       const totalAmount = selectedProduct.price * quantity * 1.17;
// // // // //       const orderId = orderResponse.data.order_id;
// // // // //       const orderDate = new Date().toISOString().split('T')[0];

// // // // //       const tokenResponse = await fetch(
// // // // //         `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
// // // // //       );

// // // // //       if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
// // // // //       const responseData = await tokenResponse.json();
// // // // //       const token = responseData.ACCESS_TOKEN;

// // // // //       if (!token) throw new Error('Invalid token response from PayFast');

// // // // //       const generateSignature = (merchantId: string, token: string): string => {
// // // // //         const timestamp = new Date().getTime();
// // // // //         return `SIG-${merchantId}-${timestamp}`;
// // // // //       };

// // // // //       const formData = {
// // // // //         MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
// // // // //         MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'My Merchant',
// // // // //         TOKEN: token,
// // // // //         PROCCODE: '00',
// // // // //         TXNAMT: totalAmount.toFixed(2),
// // // // //         CUSTOMER_MOBILE_NO: '03000000000',
// // // // //         CUSTOMER_EMAIL_ADDRESS: 'rizcmt195@gmail.com',
// // // // //         SIGNATURE: generateSignature(
// // // // //           process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
// // // // //           token
// // // // //         ),
// // // // //         VERSION: 'MY_VER_1.0',
// // // // //         TXNDESC: `Payment for ${selectedProduct.name}`,
// // // // //         SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
// // // // //         FAILURE_URL: `${window.location.origin}/failure`,
// // // // //         BASKET_ID: orderId,
// // // // //         ORDER_DATE: orderDate,
// // // // //         CHECKOUT_URL: `${window.location.origin}/confirm`,
// // // // //       };

// // // // //       const form = document.createElement('form');
// // // // //       form.method = 'POST';
// // // // //       form.action =
// // // // //         'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
// // // // //       form.style.display = 'none';

// // // // //       Object.entries(formData).forEach(([key, value]) => {
// // // // //         const input = document.createElement('input');
// // // // //         input.type = 'hidden';
// // // // //         input.name = key;
// // // // //         input.value = value;
// // // // //         form.appendChild(input);
// // // // //       });

// // // // //       document.body.appendChild(form);
// // // // //       form.submit();

// // // // //       removeFromCart(selectedProduct._id);
// // // // //     } catch (error: any) {
// // // // //       console.error('Order placement error:', error);
// // // // //       toast.error(
// // // // //         error.message || 'An unexpected error occurred during checkout'
// // // // //       );
// // // // //       setProcessing(false);
// // // // //     }
// // // // //   };

// // // // //   const closeModals = () => {
// // // // //     setIsFirstModalOpen(false);
// // // // //     setIsSecondModalOpen(false);
// // // // //     setSelectedProduct(null);
// // // // //     setQuantity(1);
// // // // //     setSelectedSize('M');
// // // // //   };

// // // // //   const fetchSubCategories = async () => {
// // // // //     try {
// // // // //       const response = await fetchSubCategoryList();
// // // // //       if (response.success) {
// // // // //         const subcategories = response.data.find(
// // // // //           (subCat: any) =>
// // // // //             subCat.name.toLowerCase().replace(/\s+/g, '') === subcategory
// // // // //         );
// // // // //         if (subcategories) {
// // // // //           setSubCategoryId(subcategories._id);
// // // // //           // Store the category info for background color/image
// // // // //           setCategoryInfo(subcategories.category_id);
// // // // //           fetchData(subcategories._id);
// // // // //         } else {
// // // // //           setError(' Subcategory not found.');
// // // // //         }
// // // // //       } else {
// // // // //         throw new Error(response.message || 'Failed to fetch subcategories.');
// // // // //       }
// // // // //     } catch (err: any) {
// // // // //       console.error('Error fetching subcategories:', err);
// // // // //       const errorMessage =
// // // // //         err.response?.data?.message ||
// // // // //         err.message ||
// // // // //         'An error occurred while fetching subcategories.';
// // // // //       setError(errorMessage);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     if (subcategory) {
// // // // //       fetchSubCategories();
// // // // //     }
// // // // //   }, [subcategory]);

// // // // //   const fetchData = async (subCategoryId: string) => {
// // // // //     setLoading(true);
// // // // //     setBrandsLoading(true);
// // // // //     try {
// // // // //       const companiesResponse = await fetchCompanyList();

// // // // //       if (companiesResponse.success) {
// // // // //         const filteredCompanies = companiesResponse.data.filter(
// // // // //           (company: any) =>
// // // // //             company.subcategory_ids.some(
// // // // //               (subCat: any) => subCat._id === subCategoryId
// // // // //             )
// // // // //         );
// // // // //         setBrands(filteredCompanies);

// // // // //         const allProductsPromises = filteredCompanies.map((company: any) =>
// // // // //           fetchProductDetails(company._id)
// // // // //         );
// // // // //         const responses = await Promise.all(allProductsPromises);

// // // // //         const allProducts = responses.flatMap((response) =>
// // // // //           response.success ? response.data : []
// // // // //         );

// // // // //         const featured = responses.flatMap((response) =>
// // // // //           response.success
// // // // //             ? response.data.filter((product: Product) => product.is_featured)
// // // // //             : []
// // // // //         );

// // // // //         setFeaturedProducts(featured);
// // // // //         setProducts(allProducts);
// // // // //         setBrandsLoading(false);
// // // // //       } else {
// // // // //         setBrandsLoading(false);
// // // // //         setError(companiesResponse.message);
// // // // //         throw new Error(
// // // // //           companiesResponse.message || 'Failed to fetch companies.'
// // // // //         );
// // // // //       }
// // // // //     } catch (err: any) {
// // // // //       setLoading(false);
// // // // //       setBrandsLoading(false);
// // // // //       console.error('Error fetching data:', err);
// // // // //       const errorMessage =
// // // // //         err.response?.data?.message ||
// // // // //         err.message ||
// // // // //         'An error occurred while fetching data.';
// // // // //       setError(errorMessage);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //       setBrandsLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleBrandClick = (
// // // // //     brandname: string,
// // // // //     brandLogo: string,
// // // // //     brandId: string
// // // // //   ) => {
// // // // //     const slug = brandname.toLowerCase().replace(/\s+/g, '');
// // // // //     sessionStorage.setItem('brandLogo', brandLogo);
// // // // //     router.push(`subcategory/${slug}/${brandId}`);
// // // // //   };

// // // // //   const handleReviewsClick = (productId: string) => {
// // // // //     router.push(`/reviews/${productId}`);
// // // // //   };

// // // // //   // Get background styles based on category type
// // // // //   const getBackgroundStyle = () => {
// // // // //     if (!categoryInfo?.type) return {};

// // // // //     const { color } = getCategoryBackground(categoryInfo.type);
// // // // //     return { backgroundColor: color };
// // // // //   };

// // // // //   return (
// // // // //     <div className="at-categories">
// // // // //       {/* <div className="at-pagesectiontitle">
// // // // //         <h2>SubCategory Page</h2>
// // // // //       </div> */}

// // // // //       {error && <p className="error-message">{error}</p>}
// // // // //       <>
// // // // //         <div className="at-pagesectiontitle mb-6 border-b pb-3">
// // // // //           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
// // // // //             {typeof subcategory === 'string'
// // // // //               ? decodeURIComponent(subcategory).replace(/-/g, ' ')
// // // // //               : 'SubCategory'}
// // // // //           </h1>
// // // // //         </div>

// // // // //         <div className="at-pagesectiontitle">
// // // // //           <h2>Shop by Brands</h2>
// // // // //         </div>
// // // // //         <div className="at-categoriesgrid">
// // // // //           {brandsLoading &&
// // // // //             Array.from({ length: 6 }).map((_, brandindex) => (
// // // // //               <div className="at-branditem" key={brandindex}>
// // // // //                 <Skeleton className="h-24 w-24 px-8 bg-[#d6dadb] gap-4" />
// // // // //               </div>
// // // // //             ))}
// // // // //           {error && <p className="error-message">{error}</p>}
// // // // //           {!brandsLoading && brands?.length === 0 && !error && (
// // // // //             <p>No brands available.</p>
// // // // //           )}
// // // // //           {!brandsLoading &&
// // // // //             brands.length > 0 &&
// // // // //             brands.map((brand) => (
// // // // //               <div
// // // // //                 key={brand._id}
// // // // //                 className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
// // // // //                 onClick={(e) => {
// // // // //                   e.preventDefault();
// // // // //                   handleBrandClick(brand.name, brand.company_logo, brand._id);
// // // // //                 }}
// // // // //               >
// // // // //                 <img src={brand.company_logo} alt={brand.name} />
// // // // //               </div>
// // // // //             ))}
// // // // //         </div>

// // // // //         <div className="at-giftcard">
// // // // //           <div className="at-pagesectiontitle">
// // // // //             <h2>Featured Products</h2>
// // // // //           </div>
// // // // //           <div className="at-cardgrid">
// // // // //             {brandsLoading && (
// // // // //               <>
// // // // //                 {Array.from({ length: 5 }).map((_, index) => (
// // // // //                   <div className="at-carditem" key={index}>
// // // // //                     <Skeleton className="h-40 w-full" />
// // // // //                     <Skeleton className="h-6 w-3/4 mt-2" />
// // // // //                     <Skeleton className="h-4 w-1/2 mt-1" />
// // // // //                   </div>
// // // // //                 ))}
// // // // //               </>
// // // // //             )}
// // // // //             {error && !brandsLoading && (
// // // // //               <p className="error-message">{error}</p>
// // // // //             )}
// // // // //             {!brandsLoading &&
// // // // //               !error &&
// // // // //               Array.isArray(featuredProducts) &&
// // // // //               featuredProducts?.length === 0 && <p>No products available.</p>}
// // // // //             {!brandsLoading &&
// // // // //               Array.isArray(featuredProducts) &&
// // // // //               featuredProducts?.map((product) => {
// // // // //                 const brand = brands.find((b) => b._id === product.company_id);
// // // // //                 return (
// // // // //                   <div
// // // // //                     className="at-carditem cursor-pointer"
// // // // //                     key={product._id}
// // // // //                     onClick={() => handleProductClick(product)}
// // // // //                   >
// // // // //                     <figure
// // // // //                       className="at-giftimage"
// // // // //                       style={getBackgroundStyle()}
// // // // //                     >
// // // // //                       {product.sticker_path !== null ? (
// // // // //                         <img src={product.sticker_path} alt={product.name} />
// // // // //                       ) : (
// // // // //                         <img
// // // // //                           src={PRODUCT_PLACEHOLDER}
// // // // //                           alt={
// // // // //                             product.name !== '' ? product.name : 'Product Name'
// // // // //                           }
// // // // //                         />
// // // // //                       )}
// // // // //                     </figure>
// // // // //                     <div className="at-gifttitle flex items-center justify-between w-full font-bold">
// // // // //                       {brand && (
// // // // //                         <h4 className="font-bold text-[14px]">{brand.name}</h4>
// // // // //                       )}
// // // // //                       <span className="text-right text-[#40A574]">
// // // // //                         Rs.{product.price}
// // // // //                       </span>
// // // // //                     </div>
// // // // //                     {brand && (
// // // // //                       <h4 className="font-bold text-[10px]">{brand.name}</h4>
// // // // //                     )}
// // // // //                   </div>
// // // // //                 );
// // // // //               })}
// // // // //           </div>
// // // // //         </div>
// // // // //         {isFirstModalOpen && selectedProduct && (
// // // // //           <div
// // // // //             className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
// // // // //             onClick={() => setIsFirstModalOpen(false)}
// // // // //           >
// // // // //             <div
// // // // //               className="bg-white rounded-lg shadow-lg at-modaldailouge"
// // // // //               onClick={(e) => e.stopPropagation()}
// // // // //             >
// // // // //               <div className="flex justify-between items-center relative">
// // // // //                 <div className="at-modalcontent p-0">
// // // // //                   <div
// // // // //                     className="at-modalleftside at-modalcontent"
// // // // //                     style={getBackgroundStyle()}
// // // // //                   >
// // // // //                     <button
// // // // //                       onClick={() => setIsFirstModalOpen(false)}
// // // // //                       className="at-btnpopupclose at-btnpopupclosetwo"
// // // // //                     >
// // // // //                       <svg
// // // // //                         width="32"
// // // // //                         height="32"
// // // // //                         viewBox="0 0 32 32"
// // // // //                         fill="none"
// // // // //                         xmlns="http://www.w3.org/2000/svg"
// // // // //                       >
// // // // //                         <circle cx="16" cy="16" r="16" fill="white" />
// // // // //                         <path
// // // // //                           d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
// // // // //                           fill="#434343"
// // // // //                         />
// // // // //                         <path
// // // // //                           d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
// // // // //                           fill="#434343"
// // // // //                         />
// // // // //                       </svg>
// // // // //                     </button>
// // // // //                     <figure className="at-productimg p-0 m-0">
// // // // //                       {selectedProduct.background_image[0] !== null ? (
// // // // //                         <img
// // // // //                           src={`${BASE_URL}/${selectedProduct.background_image[0]}`}
// // // // //                           alt={selectedProduct.name}
// // // // //                         />
// // // // //                       ) : (
// // // // //                         <img
// // // // //                           src={PRODUCT_PLACEHOLDER}
// // // // //                           alt={
// // // // //                             selectedProduct.name !== ''
// // // // //                               ? selectedProduct.name
// // // // //                               : 'Product Name'
// // // // //                           }
// // // // //                         />
// // // // //                       )}
// // // // //                     </figure>
// // // // //                   </div>
// // // // //                   <div className="at-popupcontentside">
// // // // //                     <div className="at-popuptitlebrandimg">
// // // // //                       <span>
// // // // //                         <img
// // // // //                           src={
// // // // //                             brands.find(
// // // // //                               (b) => b._id === selectedProduct.company_id
// // // // //                             )?.company_logo
// // // // //                           }
// // // // //                           alt=""
// // // // //                         />
// // // // //                       </span>
// // // // //                       <div
// // // // //                         className="at-popupproduct titlerating"
// // // // //                         onClick={() => handleReviewsClick(selectedProduct._id)}
// // // // //                       >
// // // // //                         <h4>
// // // // //                           {
// // // // //                             brands.find(
// // // // //                               (b) => b._id === selectedProduct.company_id
// // // // //                             )?.name
// // // // //                           }
// // // // //                         </h4>
// // // // //                         <p>3.1 km from you</p>
// // // // //                         <RatingStars rating={selectedProduct.total_rating} />
// // // // //                       </div>
// // // // //                     </div>

// // // // //                     <div className="at-popupcolorprice">
// // // // //                       <div className="at-popupcolor">
// // // // //                         <h3>{selectedProduct.name}</h3>
// // // // //                         <span>300ml/530 kcal</span>
// // // // //                       </div>
// // // // //                       <div className="at-popupprice">
// // // // //                         <h3>Rs. {selectedProduct.price}</h3>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     <div className="at-popupdescription">
// // // // //                       <p>{selectedProduct.description}</p>
// // // // //                     </div>

// // // // //                     <div className="at-productsize">
// // // // //                       {['S', 'M', 'L'].map((size) => (
// // // // //                         <span
// // // // //                           key={size}
// // // // //                           onClick={() => setSelectedSize(size)}
// // // // //                           className={
// // // // //                             selectedSize === size
// // // // //                               ? 'bg-[#40A574] text-white'
// // // // //                               : 'bg-gray-200'
// // // // //                           }
// // // // //                         >
// // // // //                           {size}
// // // // //                         </span>
// // // // //                       ))}
// // // // //                     </div>

// // // // //                     <div className="at-btnaddtocart">
// // // // //                       {isInCart(selectedProduct._id) ? (
// // // // //                         <button onClick={handleGoToCart} className="at-btn">
// // // // //                           Go to Cart
// // // // //                           <svg
// // // // //                             className="mt-3"
// // // // //                             width="24"
// // // // //                             height="24"
// // // // //                             viewBox="0 0 32 32"
// // // // //                             fill="#ffffff"
// // // // //                             xmlns="http://www.w3.org/2000/svg"
// // // // //                           >
// // // // //                             <circle cx="16" cy="16" r="16" fill="white" />
// // // // //                             <path
// // // // //                               d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6
// // // // //                               16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
// // // // //                               fill="#40A574"
// // // // //                             />
// // // // //                           </svg>
// // // // //                         </button>
// // // // //                       ) : (
// // // // //                         <button onClick={handleAddToCart} className="at-btn">
// // // // //                           Add to Cart
// // // // //                           <svg
// // // // //                             className="mt-3"
// // // // //                             width="24"
// // // // //                             height="24"
// // // // //                             viewBox="0 0 32 32"
// // // // //                             fill="#ffffff"
// // // // //                             xmlns="http://www.w3.org/2000/svg"
// // // // //                           >
// // // // //                             <circle cx="16" cy="16" r="16" fill="white" />
// // // // //                             <path
// // // // //                               d="M24 16 C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
// // // // //                               fill="#40A574"
// // // // //                             />
// // // // //                           </svg>
// // // // //                         </button>
// // // // //                       )}
// // // // //                       <button
// // // // //                         className="at-btn at-btnpersonal"
// // // // //                         onClick={() => handlePersonalize(selectedProduct._id)}
// // // // //                       >
// // // // //                         Personalize
// // // // //                         <label className="custom-checkbox top-2">
// // // // //                           <input
// // // // //                             className="align-middle"
// // // // //                             type="checkbox"
// // // // //                             checked={hasPersonalization(selectedProduct._id)}
// // // // //                             readOnly
// // // // //                           />
// // // // //                           <span className="checkmark"></span>
// // // // //                         </label>
// // // // //                       </button>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}

// // // // //         {isSecondModalOpen && selectedProduct && (
// // // // //           <div
// // // // //             className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
// // // // //             onClick={closeModals}
// // // // //           >
// // // // //             <div
// // // // //               className="bg-white rounded-lg shadow-lg at-modaldailouge"
// // // // //               onClick={(e) => e.stopPropagation()}
// // // // //             >
// // // // //               <div className="flex justify-between items-center flex-col">
// // // // //                 <div className="at-modalcontent">
// // // // //                   <div
// // // // //                     className="at-modalleftside at-modalordersummeryleft p-0"
// // // // //                     style={getBackgroundStyle()}
// // // // //                   >
// // // // //                     <button
// // // // //                       onClick={closeModals}
// // // // //                       className="at-btnpopupclose at-btnpopupclosetwo"
// // // // //                     >
// // // // //                       <svg
// // // // //                         width="32"
// // // // //                         height="32"
// // // // //                         viewBox="0 0 32 32"
// // // // //                         fill="none"
// // // // //                         xmlns="http://www.w3.org/2000/svg"
// // // // //                       >
// // // // //                         <g clipPath="url(#clip0_252_1556)">
// // // // //                           <path
// // // // //                             d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
// // // // //                             fill="#434343"
// // // // //                           />
// // // // //                           <path
// // // // //                             d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
// // // // //                             fill="#434343"
// // // // //                           />
// // // // //                           <path
// // // // //                             d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
// // // // //                             fill="#434343"
// // // // //                           />
// // // // //                         </g>
// // // // //                         <defs>
// // // // //                           <clipPath id="clip0_252_1556">
// // // // //                             <rect width="32" height="32" fill="white" />
// // // // //                           </clipPath>
// // // // //                         </defs>
// // // // //                       </svg>
// // // // //                     </button>
// // // // //                     <figure className="at-productimg m-0 p-0">
// // // // //                       {selectedProduct.background_image[0] !== null ? (
// // // // //                         <img
// // // // //                           src={`${BASE_URL}/${selectedProduct.background_image[0]}`}
// // // // //                           alt={selectedProduct.name}
// // // // //                         />
// // // // //                       ) : (
// // // // //                         <img
// // // // //                           src={PRODUCT_PLACEHOLDER}
// // // // //                           alt={
// // // // //                             selectedProduct.name !== ''
// // // // //                               ? selectedProduct.name
// // // // //                               : 'Product Name'
// // // // //                           }
// // // // //                         />
// // // // //                       )}
// // // // //                     </figure>
// // // // //                   </div>
// // // // //                   <div className="at-popupcontentside">
// // // // //                     <div className="at-popuptitlebrandimg at-modaltitleqnty">
// // // // //                       <div className="at-popupproducttitlerating at-ordersummerytitlearea">
// // // // //                         <h4>{selectedProduct.name}</h4>
// // // // //                         <p>{selectedProduct.description}</p>
// // // // //                       </div>
// // // // //                       <div className="at-orderquntatiy">
// // // // //                         <div className="at-btnquntatiyholder">
// // // // //                           <button
// // // // //                             onClick={decreaseQuantity}
// // // // //                             disabled={quantity === 1}
// // // // //                           >
// // // // //                             -
// // // // //                           </button>
// // // // //                           <span className="">{quantity}</span>
// // // // //                           <button onClick={increaseQuantity} className="">
// // // // //                             +
// // // // //                           </button>
// // // // //                         </div>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                     <div className="at-ordersummery">
// // // // //                       <h3>Order Summary</h3>
// // // // //                       <ul>
// // // // //                         <li>
// // // // //                           <span>Item</span>
// // // // //                         </li>
// // // // //                         <li>
// // // // //                           <span>Rs.{selectedProduct.price}</span>
// // // // //                         </li>
// // // // //                         <li>
// // // // //                           <span>Sales Tax 17%</span>
// // // // //                         </li>
// // // // //                         <li>
// // // // //                           <span>
// // // // //                             Rs.
// // // // //                             {(selectedProduct.price * 0.17 * quantity).toFixed(
// // // // //                               2
// // // // //                             )}
// // // // //                           </span>
// // // // //                         </li>
// // // // //                         <li>
// // // // //                           <span>Grand Total</span>
// // // // //                         </li>
// // // // //                         <li>
// // // // //                           <span>
// // // // //                             Rs.
// // // // //                             {(
// // // // //                               selectedProduct.price * quantity +
// // // // //                               selectedProduct.price * 0.17 * quantity
// // // // //                             ).toFixed(2)}
// // // // //                           </span>
// // // // //                         </li>
// // // // //                       </ul>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //                 <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder">
// // // // //                   <button
// // // // //                     type="button"
// // // // //                     className="at-btn"
// // // // //                     onClick={handlePlaceOrder}
// // // // //                     disabled={processing}
// // // // //                   >
// // // // //                     {processing ? 'Processing...' : 'Place Order'}
// // // // //                   </button>
// // // // //                   <Link href="/home">
// // // // //                     <button type="button" className="at-btn at-btncancel">
// // // // //                       Continue Shopping
// // // // //                     </button>
// // // // //                   </Link>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}
// // // // //       </>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default SubCategoryPage;

// // // // // src/app/components/Product/sub_category_page.tsx
// // // // 'use client';
// // // // import { useEffect, useState, useCallback } from 'react';
// // // // import { useRouter, useParams } from 'next/navigation';
// // // // import {
// // // //   fetchSubCategoryList,
// // // //   fetchCompanyList,
// // // //   fetchProductDetails,
// // // //   placeOrder,
// // // //   confirmOrder,
// // // // } from '@/services/api.service';
// // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // import { useCart } from '@/context/CartContext';
// // // // import { toast } from 'react-toastify';
// // // // import RatingStars from '../page-ui/rating_stars';
// // // // import Link from 'next/link';

// // // // const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
// // // // const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
// // // // const MODEL_BG_PATH = '/images/model-bg';

// // // // // Define type-based background settings (original from sub_category_page for non-modal elements)
// // // // const getCategoryCardBackground = (type: number) => {
// // // //   switch (type) {
// // // //     case 1:
// // // //       return { image: 'pd_bg_1', color: '#FFD05E' };
// // // //     case 2:
// // // //       return { image: 'pd_bg_2', color: '#FF834B' };
// // // //     case 3:
// // // //       return { image: 'pd_bg_3', color: '#88C1FD' };
// // // //     case 4:
// // // //       return { image: 'pd_bg_4', color: '#40A574' };
// // // //     default:
// // // //       return { image: 'pd_bg_1', color: '#D6D6DA' }; // Default fallback
// // // //   }
// // // // };

// // // // // --- Helper Function for Default Background Image (Modal Background) --- From category_page.tsx
// // // // const getDefaultBgImageForType = (type?: number): string => {
// // // //   const valid_type =
// // // //     typeof type === 'number' && type >= 1 && type <= 4 ? type : null;
// // // //   switch (valid_type) {
// // // //     case 1:
// // // //       return `${MODEL_BG_PATH}/pd_bg_1.jpg`;
// // // //     case 2:
// // // //       return `${MODEL_BG_PATH}/pd_bg_2.jpg`;
// // // //     case 3:
// // // //       return `${MODEL_BG_PATH}/pd_bg_3.jpg`;
// // // //     case 4:
// // // //       return `${MODEL_BG_PATH}/pd_bg_4.jpg`;
// // // //     default:
// // // //       return `${MODEL_BG_PATH}/pd_bg_1.jpg`; // Default to type 1 image if invalid
// // // //   }
// // // // };

// // // // interface Company {
// // // //   _id: string;
// // // //   name: string;
// // // //   company_logo: string;
// // // //   subcategory_ids: Array<{
// // // //     _id: string;
// // // //     name: string;
// // // //     category_id: string;
// // // //   }>;
// // // // }

// // // // // Updated Product interface to match category_page.tsx for modal consistency
// // // // interface Product {
// // // //   _id: string;
// // // //   name: string;
// // // //   price: number;
// // // //   image_path: string | null;
// // // //   sticker_path?: string | null;
// // // //   description: string;
// // // //   company_id: string;
// // // //   subcategory_id: string;
// // // //   category_id?: string; // Parent category ID
// // // //   background_image?: string[]; // For modal image slider
// // // //   is_featured: boolean;
// // // //   total_rating: number;
// // // //   specification?: Array<{
// // // //     name: string;
// // // //     type: string;
// // // //     values: Array<{
// // // //       value: string;
// // // //       additional_info?: string;
// // // //       price: number;
// // // //       _id: string;
// // // //     }>;
// // // //   }>;
// // // // }

// // // // interface PersonalizedMessage {
// // // //   name: string;
// // // //   message: string;
// // // //   image_path: string;
// // // //   image_id: string;
// // // //   productId?: string;
// // // // }

// // // // interface CategoryInfo {
// // // //   _id: string;
// // // //   name: string;
// // // //   type?: number; // This is the parent category type
// // // // }

// // // // const SubCategoryPage = () => {
// // // //   const router = useRouter();
// // // //   const params = useParams();
// // // //   const { subcategory } = params;
// // // //   const [brands, setBrands] = useState<Company[]>([]);
// // // //   const [products, setProducts] = useState<Product[]>([]);
// // // //   const [loading, setLoading] = useState<boolean>(true);
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
// // // //   const [brandsLoading, setBrandsLoading] = useState<boolean>(true);
// // // //   const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null); // Stores parent category info including type
// // // //   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
// // // //   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

// // // //   // Combined modal states
// // // //   const [processing, setProcessing] = useState(false);
// // // //   const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
// // // //   const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);

// // // //   const { cartItems, addToCart, removeFromCart } = useCart();
// // // //   const [quantity, setQuantity] = useState(1);

// // // //   // States from category_page.tsx for modals
// // // //   const [selectedSize, setSelectedSize] = useState<string>('');
// // // //   const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0);
// // // //   const [currentImageSliderIndex, setCurrentImageSliderIndex] = useState(0);

// // // //   const decreaseQuantity = () => {
// // // //     if (quantity > 1) setQuantity(quantity - 1);
// // // //   };

// // // //   const increaseQuantity = () => {
// // // //     setQuantity(quantity + 1);
// // // //   };

// // // //   const isInCart = (productId: string) =>
// // // //     cartItems.some((item) => item._id === productId);

// // // //   // Personalized messages (logic remains same)
// // // //   const [personalizedMessages, setPersonalizedMessages] = useState<{
// // // //     [key: string]: PersonalizedMessage | undefined;
// // // //   }>({});

// // // //   const loadPersonalizedMessages = useCallback(() => {
// // // //     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
// // // //     try {
// // // //       const messages = storedMessages ? JSON.parse(storedMessages) : {};
// // // //       if (
// // // //         messages &&
// // // //         typeof messages === 'object' &&
// // // //         !Array.isArray(messages)
// // // //       ) {
// // // //         setPersonalizedMessages(messages);
// // // //       } else {
// // // //         setPersonalizedMessages({});
// // // //       }
// // // //     } catch (error) {
// // // //       console.error(
// // // //         '[loadPersonalizedMessages] ERROR parsing localStorage:',
// // // //         error
// // // //       );
// // // //       setPersonalizedMessages({});
// // // //     }
// // // //   }, []);

// // // //   useEffect(() => {
// // // //     loadPersonalizedMessages();
// // // //     const handleStorageChange = (event: StorageEvent) => {
// // // //       if (event.key === 'selectedPersonalizedMessages') {
// // // //         loadPersonalizedMessages();
// // // //       }
// // // //     };
// // // //     window.addEventListener('storage', handleStorageChange);
// // // //     return () => {
// // // //       window.removeEventListener('storage', handleStorageChange);
// // // //     };
// // // //   }, [loadPersonalizedMessages]);

// // // //   const hasPersonalization = (productId: string) =>
// // // //     !!personalizedMessages[productId];

// // // //   const handlePersonalize = (productId: string) => {
// // // //     localStorage.setItem('currentItemId', productId);
// // // //     localStorage.setItem('returnPath', window.location.pathname);
// // // //     router.push('/messages');
// // // //   };

// // // //   // Modal Left Panel Style from category_page.tsx, adapted for sub_category_page.tsx
// // // //   const getModalLeftPanelStyle = useCallback((): React.CSSProperties => {
// // // //     const categoryType = categoryInfo?.type; // Use parent category type
// // // //     const finalBgImage = getDefaultBgImageForType(categoryType);
// // // //     return {
// // // //       backgroundImage: `url('${finalBgImage}')`,
// // // //       backgroundSize: 'cover',
// // // //       backgroundPosition: 'center',
// // // //     };
// // // //   }, [categoryInfo]);

// // // //   const handleProductClick = (product: Product) => {
// // // //     setSelectedProduct(product);
// // // //     setQuantity(1); // Reset quantity
// // // //     setCurrentImageSliderIndex(0); // Reset slider index

// // // //     // Set initial size and spec price from category_page.tsx logic
// // // //     const firstSpecGroup = product.specification?.[0];
// // // //     const initialSpecValue = firstSpecGroup?.values?.[0]?.value || ''; // Default to empty or first available
// // // //     const initialSpec =
// // // //       firstSpecGroup?.values?.find((v) => v.value === initialSpecValue) ||
// // // //       firstSpecGroup?.values?.[0];

// // // //     const rawInitialSpecPrice = initialSpec?.price;
// // // //     const initialSpecPriceNum = Number(rawInitialSpecPrice);

// // // //     setSelectedSize(initialSpecValue);
// // // //     setSelectedSpecPrice(isNaN(initialSpecPriceNum) ? 0 : initialSpecPriceNum);

// // // //     setIsFirstModalOpen(true);
// // // //   };

// // // //   const handleSelectSize = (sizeValue: string, specPrice: number) => {
// // // //     setSelectedSize(sizeValue);
// // // //     setSelectedSpecPrice(isNaN(specPrice) ? 0 : specPrice);
// // // //   };

// // // //   const handleAddToCart = () => {
// // // //     if (selectedProduct) {
// // // //       // Logic from category_page.tsx for cart item
// // // //       const cartImage = selectedProduct.background_image?.[0]
// // // //         ? `${BASE_URL}/${selectedProduct.background_image[0]}`
// // // //         : selectedProduct.sticker_path
// // // //         ? `${selectedProduct.sticker_path}` // Assuming sticker_path is full URL or handled by server
// // // //         : selectedProduct.image_path
// // // //         ? `${selectedProduct.image_path}` // Assuming image_path is full URL
// // // //         : PRODUCT_PLACEHOLDER;

// // // //       const itemToAdd = {
// // // //         _id: selectedProduct._id,
// // // //         price: selectedProduct.price + selectedSpecPrice, // Base price + spec additional price
// // // //         quantity,
// // // //         image_path: cartImage,
// // // //         name: selectedProduct.name,
// // // //         description: selectedProduct.description,
// // // //         specification: selectedProduct.specification?.length
// // // //           ? selectedProduct.specification
// // // //           : selectedSize // If no full spec, pass selected size info if needed by cart
// // // //           ? [ { name: 'Size', type: 'button', values: [{ value: selectedSize, price: selectedSpecPrice, _id: `spec-default-${selectedProduct._id}` }] }]
// // // //           : undefined,
// // // //         personalization: personalizedMessages[selectedProduct._id],
// // // //         size: selectedSize, // Explicitly pass size
// // // //       };
// // // //       addToCart(itemToAdd as any); // Cast if itemToAdd doesn't perfectly match CartItem type definition
// // // //       setIsFirstModalOpen(false);
// // // //       setIsSecondModalOpen(true);
// // // //     }
// // // //   };

// // // //   const handleGoToCart = () => {
// // // //     closeModals();
// // // //     router.push('/cart');
// // // //   };

// // // //   // Handle order placement (updated from category_page.tsx)
// // // //   const handlePlaceOrder = async () => {
// // // //     if (!selectedProduct) return;
// // // //     setProcessing(true);
// // // //     try {
// // // //       const finalProductPrice = selectedProduct.price + selectedSpecPrice;

// // // //       const orderSpecification =
// // // //         selectedSize && selectedProduct.specification?.[0]?.name
// // // //           ? [
// // // //               {
// // // //                 name: selectedProduct.specification[0].name,
// // // //                 values: [{ value: selectedSize, price: selectedSpecPrice, _id: `spec-val-${selectedSize}` }], // Ensure _id is unique or handled
// // // //               },
// // // //             ]
// // // //           : null;

// // // //       const orderData = {
// // // //         cart_details: [
// // // //           {
// // // //             product_id: selectedProduct._id,
// // // //             quantity: quantity,
// // // //             personalized: personalizedMessages[selectedProduct._id] || null,
// // // //             specification: orderSpecification,
// // // //           },
// // // //         ],
// // // //       };

// // // //       const orderResponse = await placeOrder(orderData);
// // // //       if (!orderResponse.success) {
// // // //         throw new Error(orderResponse.message || 'Failed to place order');
// // // //       }

// // // //       localStorage.setItem('order_id', orderResponse.data.order_id);
// // // //       localStorage.setItem('payment_id', orderResponse.data.payment_id);

// // // //       if (orderResponse.data.payment_type === 'free') {
// // // //         const confirmResponse = await confirmOrder(
// // // //           orderResponse.data.order_id,
// // // //           orderResponse.data.payment_id
// // // //         );
// // // //         if (confirmResponse) {
// // // //           removeFromCart(selectedProduct._id);
// // // //           const currentPersonalizations = { ...personalizedMessages };
// // // //           delete currentPersonalizations[selectedProduct._id];
// // // //           localStorage.setItem(
// // // //             'selectedPersonalizedMessages',
// // // //             JSON.stringify(currentPersonalizations)
// // // //           );
// // // //           setPersonalizedMessages(currentPersonalizations);
// // // //           closeModals();
// // // //           router.replace('/thankyou'); // Use replace to prevent back button to order summary
// // // //         } else {
// // // //           throw new Error('Order confirmation failed');
// // // //         }
// // // //         return;
// // // //       }

// // // //       const totalAmount = finalProductPrice * quantity * 1.17; // Price + 17% tax
// // // //       const orderId = orderResponse.data.order_id;
// // // //       const orderDate = new Date().toISOString().split('T')[0];

// // // //       const tokenResponse = await fetch(
// // // //         `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
// // // //       );
// // // //       if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
// // // //       const responseData = await tokenResponse.json();
// // // //       const token = responseData.ACCESS_TOKEN;
// // // //       if (!token) throw new Error('Invalid token response from PayFast');

// // // //       const generateSignature = (merchantId: string, token: string): string =>
// // // //         `SIG-${merchantId}-${new Date().getTime()}`;

// // // //       const formData = {
// // // //         MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
// // // //         MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'Hey Jinie', // Updated from 'My Merchant'
// // // //         TOKEN: token,
// // // //         PROCCODE: '00',
// // // //         TXNAMT: totalAmount.toFixed(2),
// // // //         CUSTOMER_MOBILE_NO: '03000000000', // Placeholder
// // // //         CUSTOMER_EMAIL_ADDRESS: 'test@example.com', // Placeholder
// // // //         SIGNATURE: generateSignature(
// // // //           process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
// // // //           token
// // // //         ),
// // // //         VERSION: 'MY_VER_1.0',
// // // //         TXNDESC: `Payment for ${selectedProduct.name} (Order ${orderId})`,
// // // //         SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
// // // //         FAILURE_URL: `${window.location.origin}/failure?order_id=${orderId}`,
// // // //         BASKET_ID: orderId,
// // // //         ORDER_DATE: orderDate,
// // // //         CHECKOUT_URL: `${window.location.origin}/confirm`,
// // // //       };

// // // //       const form = document.createElement('form');
// // // //       form.method = 'POST';
// // // //       form.action =
// // // //         'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
// // // //       form.style.display = 'none';
// // // //       Object.entries(formData).forEach(([key, value]) => {
// // // //         const input = document.createElement('input');
// // // //         input.type = 'hidden';
// // // //         input.name = key;
// // // //         input.value = value as string;
// // // //         form.appendChild(input);
// // // //       });
// // // //       document.body.appendChild(form);
// // // //       form.submit();
// // // //       document.body.removeChild(form); // Clean up form

// // // //       // Do not remove from cart or personalization here; PayFast success/failure will handle this.
// // // //       // If payment is successful, success page should trigger cart removal.
// // // //     } catch (error: any) {
// // // //       console.error('Order placement error:', error);
// // // //       toast.error(
// // // //         error.message || 'An unexpected error occurred during checkout'
// // // //       );
// // // //     } finally {
// // // //         setProcessing(false); // Ensure processing is set to false in finally
// // // //     }
// // // //   };

// // // //   const closeModals = () => {
// // // //     setIsFirstModalOpen(false);
// // // //     setIsSecondModalOpen(false);
// // // //     setSelectedProduct(null);
// // // //     setQuantity(1);
// // // //     // Reset states from category_page.tsx modals
// // // //     setSelectedSize('');
// // // //     setSelectedSpecPrice(0);
// // // //     setCurrentImageSliderIndex(0);
// // // //     setProcessing(false);
// // // //   };

// // // //   const fetchSubCategoriesData = async () => { // Renamed from fetchSubCategories to avoid conflict
// // // //     try {
// // // //       const response = await fetchSubCategoryList();
// // // //       if (response.success) {
// // // //         const foundSubcategory = response.data.find(
// // // //           (subCat: any) =>
// // // //             subCat.name.toLowerCase().replace(/\s+/g, '') === (subcategory as string).toLowerCase().replace(/\s+/g, '')
// // // //         );
// // // //         if (foundSubcategory) {
// // // //           setSubCategoryId(foundSubcategory._id);
// // // //           // Store the parent category info for background type
// // // //           setCategoryInfo(foundSubcategory.category_id); // category_id should be { _id, name, type }
// // // //           fetchData(foundSubcategory._id, foundSubcategory.category_id?._id);
// // // //         } else {
// // // //           setError('Subcategory not found.');
// // // //         }
// // // //       } else {
// // // //         throw new Error(response.message || 'Failed to fetch subcategories.');
// // // //       }
// // // //     } catch (err: any) {
// // // //       console.error('Error fetching subcategories:', err);
// // // //       const errorMessage =
// // // //         err.response?.data?.message ||
// // // //         err.message ||
// // // //         'An error occurred while fetching subcategories.';
// // // //       setError(errorMessage);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     if (subcategory) {
// // // //       fetchSubCategoriesData();
// // // //     }
// // // //   }, [subcategory]);

// // // //   const fetchData = async (currentSubCategoryId: string, parentCategoryId?: string) => {
// // // //     setLoading(true);
// // // //     setBrandsLoading(true);
// // // //     try {
// // // //       const companiesResponse = await fetchCompanyList();

// // // //       if (companiesResponse.success) {
// // // //         const filteredCompanies = companiesResponse.data.filter(
// // // //           (company: any) =>
// // // //             company.subcategory_ids.some(
// // // //               (subCat: any) => subCat._id === currentSubCategoryId
// // // //             )
// // // //         );
// // // //         setBrands(filteredCompanies);

// // // //         if (filteredCompanies.length > 0) {
// // // //             const allProductsPromises = filteredCompanies.map((company: any) =>
// // // //               fetchProductDetails(company._id).catch(err => {
// // // //                 console.error(`Failed to fetch products for company ${company._id}`, err);
// // // //                 return { success: false, data: [] }; // Allow Promise.all to succeed
// // // //               })
// // // //             );
// // // //             const responses = await Promise.all(allProductsPromises);

// // // //             let allProductsFromApi = responses.flatMap((response) =>
// // // //               response.success && response.data ? response.data : []
// // // //             );

// // // //             // Filter products by the current subcategory_id and add category_id
// // // //             const relevantProducts = allProductsFromApi
// // // //               .filter((product: Product) => product.subcategory_id === currentSubCategoryId)
// // // //               .map(product => ({
// // // //                 ...product,
// // // //                 category_id: parentCategoryId || product.category_id, // Assign parent category_id
// // // //               }));

// // // //             const featured = relevantProducts.filter((product: Product) => product.is_featured);

// // // //             setFeaturedProducts(featured);
// // // //             setProducts(relevantProducts); // Set all products relevant to this subcategory
// // // //         } else {
// // // //             setProducts([]);
// // // //             setFeaturedProducts([]);
// // // //         }
// // // //         setBrandsLoading(false);
// // // //       } else {
// // // //         setBrandsLoading(false);
// // // //         setError(companiesResponse.message);
// // // //         throw new Error(
// // // //           companiesResponse.message || 'Failed to fetch companies.'
// // // //         );
// // // //       }
// // // //     } catch (err: any) {
// // // //       setLoading(false);
// // // //       setBrandsLoading(false);
// // // //       console.error('Error fetching data:', err);
// // // //       const errorMessage =
// // // //         err.response?.data?.message ||
// // // //         err.message ||
// // // //         'An error occurred while fetching data.';
// // // //       setError(errorMessage);
// // // //     } finally {
// // // //       setLoading(false);
// // // //       setBrandsLoading(false);
// // // //     }
// // // //   };

// // // //   const handleBrandClick = (
// // // //     brandname: string,
// // // //     brandLogo: string,
// // // //     brandId: string
// // // //   ) => {
// // // //     const slug = brandname.toLowerCase().replace(/\s+/g, '');
// // // //     sessionStorage.setItem('brandLogo', brandLogo);
// // // //     // Corrected route: subcategory is part of the path, then brand slug, then brandId.
// // // //     // Example: /subcategory/electronics-accessories/brand-name/brandId
// // // //     // Assuming `subcategory` param is the subcategory slug.
// // // //     router.push(`/subcategory/${subcategory}/${slug}/${brandId}`);
// // // //   };

// // // //   const handleReviewsClick = (productId: string) => {
// // // //     router.push(`/reviews/${productId}`);
// // // //   };

// // // //   // Get background styles for featured product cards (original logic)
// // // //   const getCardBackgroundStyle = () => {
// // // //     if (!categoryInfo?.type) return { backgroundColor: getCategoryCardBackground(0).color }; // Default color
// // // //     const { color } = getCategoryCardBackground(categoryInfo.type);
// // // //     return { backgroundColor: color };
// // // //   };

// // // //   // Image slider handlers from category_page.tsx
// // // //   const handlePrevContentImage = () => {
// // // //     if (
// // // //       !selectedProduct?.background_image ||
// // // //       selectedProduct.background_image.length <= 1
// // // //     )
// // // //       return;
// // // //     const imageCount = selectedProduct.background_image.length;
// // // //     setCurrentImageSliderIndex(
// // // //       (prevIndex) => (prevIndex - 1 + imageCount) % imageCount
// // // //     );
// // // //   };

// // // //   const handleNextContentImage = () => {
// // // //     if (
// // // //       !selectedProduct?.background_image ||
// // // //       selectedProduct.background_image.length <= 1
// // // //     )
// // // //       return;
// // // //     const imageCount = selectedProduct.background_image.length;
// // // //     setCurrentImageSliderIndex((prevIndex) => (prevIndex + 1) % imageCount);
// // // //   };

// // // //   return (
// // // //     <div className="at-categories">
// // // //       {error && <p className="error-message">{error}</p>}
// // // //       <>
// // // //         <div className="at-pagesectiontitle mb-6 border-b pb-3">
// // // //           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 capitalize">
// // // //             {typeof subcategory === 'string'
// // // //               ? decodeURIComponent(subcategory).replace(/-/g, ' ')
// // // //               : 'SubCategory'}
// // // //           </h1>
// // // //         </div>

// // // //         <div className="at-pagesectiontitle">
// // // //           <h2>Shop by Brands</h2>
// // // //         </div>
// // // //         <div className="at-categoriesgrid">
// // // //           {brandsLoading &&
// // // //             Array.from({ length: 6 }).map((_, brandindex) => (
// // // //               <div className="at-branditem" key={brandindex}>
// // // //                 <Skeleton className="h-24 w-24 px-8 bg-[#d6dadb] gap-4" />
// // // //               </div>
// // // //             ))}
// // // //           {error && <p className="error-message">{error}</p>}
// // // //           {!brandsLoading && brands?.length === 0 && !error && (
// // // //             <p>No brands available.</p>
// // // //           )}
// // // //           {!brandsLoading &&
// // // //             brands.length > 0 &&
// // // //             brands.map((brand) => (
// // // //               <div
// // // //                 key={brand._id}
// // // //                 className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
// // // //                 onClick={(e) => {
// // // //                   e.preventDefault();
// // // //                   handleBrandClick(brand.name, brand.company_logo, brand._id);
// // // //                 }}
// // // //               >
// // // //                 <img
// // // //                   src={brand.company_logo || PRODUCT_PLACEHOLDER}
// // // //                   alt={brand.name}
// // // //                   className="max-h-full max-w-full object-contain"
// // // //                   onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PRODUCT_PLACEHOLDER;}}
// // // //                 />
// // // //               </div>
// // // //             ))}
// // // //         </div>

// // // //         <div className="at-giftcard">
// // // //           <div className="at-pagesectiontitle">
// // // //             <h2>Featured Products</h2>
// // // //           </div>
// // // //           <div className="at-cardgrid">
// // // //             {loading && ( // Changed from brandsLoading to general loading for products
// // // //               <>
// // // //                 {Array.from({ length: 5 }).map((_, index) => (
// // // //                   <div className="at-carditem" key={index}>
// // // //                     <Skeleton className="h-40 w-full" />
// // // //                     <Skeleton className="h-6 w-3/4 mt-2" />
// // // //                     <Skeleton className="h-4 w-1/2 mt-1" />
// // // //                   </div>
// // // //                 ))}
// // // //               </>
// // // //             )}
// // // //             {error && !loading && (
// // // //               <p className="error-message">{error}</p>
// // // //             )}
// // // //             {!loading &&
// // // //               !error &&
// // // //               Array.isArray(featuredProducts) &&
// // // //               featuredProducts?.length === 0 && <p>No featured products available.</p>}
// // // //             {!loading &&
// // // //               Array.isArray(featuredProducts) &&
// // // //               featuredProducts?.map((product) => {
// // // //                 const brand = brands.find((b) => b._id === product.company_id);
// // // //                 const cardImageSrc = product.sticker_path ? product.sticker_path : PRODUCT_PLACEHOLDER;
// // // //                 return (
// // // //                   <div
// // // //                     className="at-carditem cursor-pointer flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 bg-white"
// // // //                     key={product._id}
// // // //                     onClick={() => handleProductClick(product)}
// // // //                   >
// // // //                     <figure
// // // //                       className="at-giftimage flex-shrink-0 relative h-40 w-full"
// // // //                       style={getCardBackgroundStyle()} // Using original card background style
// // // //                     >
// // // //                       <img
// // // //                         src={cardImageSrc}
// // // //                         alt={product.name || 'Product Image'}
// // // //                         className="w-full h-full object-contain p-2"
// // // //                         onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PRODUCT_PLACEHOLDER;}}
// // // //                       />
// // // //                     </figure>
// // // //                     <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
// // // //                       <div>
// // // //                         <div className="at-gifttitle flex items-start justify-between w-full mb-1">
// // // //                           <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 flex-1 mr-2 truncate" title={product.name}>
// // // //                             {product.name}
// // // //                           </h3>
// // // //                           <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
// // // //                             Rs.{product.price}
// // // //                           </span>
// // // //                         </div>
// // // //                         {brand && (
// // // //                           <h4 className="font-semibold text-xs text-gray-500 truncate" title={brand.name}>
// // // //                             {brand.name}
// // // //                           </h4>
// // // //                         )}
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 );
// // // //               })}
// // // //           </div>
// // // //         </div>

// // // //         {isFirstModalOpen &&
// // // //                selectedProduct &&
// // // //                (() => {
// // // //                  const modalBackgroundStyle = getModalLeftPanelStyle(selectedProduct);
// // // //                  const contentImages = selectedProduct.background_image ?? [];
// // // //                  const hasContentSlider = contentImages.length > 1;
// // // //                  let currentContentImageSrc = PRODUCT_PLACEHOLDER;
// // // //                  if (
// // // //                    contentImages.length > 0 &&
// // // //                    currentImageSliderIndex < contentImages.length
// // // //                  ) {
// // // //                    currentContentImageSrc = `${BASE_URL}/${contentImages[currentImageSliderIndex]}`;
// // // //                  } else if (selectedProduct.sticker_path) {
// // // //                    currentContentImageSrc = `${selectedProduct.sticker_path}`;
// // // //                  } else if (selectedProduct.image_path) {
// // // //                    currentContentImageSrc = `${selectedProduct.image_path}`;
// // // //                  }

// // // //                  const currentProductBrand = brands.find(
// // // //                    (b) => b._id === selectedProduct.company_id
// // // //                  );

// // // //                  return (
// // // //                    <div
// // // //                      className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
// // // //                      onClick={closeModals}
// // // //                    >
// // // //                      <div
// // // //                        className="bg-white rounded-lg shadow-lg at-modaldailouge w-full max-w-3xl"
// // // //                        onClick={(e) => e.stopPropagation()}
// // // //                      >
// // // //                        <div className="flex flex-col md:flex-row">
// // // //                          {/* Left Side: Image Panel */}
// // // //                          <div
// // // //                            className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
// // // //                            style={modalBackgroundStyle}
// // // //                          >
// // // //                            <button
// // // //                              onClick={closeModals}
// // // //                              className="at-btnpopupclose at-btnpopupclosetwo"
// // // //                            >
// // // //                              <svg
// // // //                                width="32"
// // // //                                height="32"
// // // //                                viewBox="0 0 32 32"
// // // //                                fill="none"
// // // //                                xmlns="http://www.w3.org/2000/svg"
// // // //                              >
// // // //                                <g clipPath="url(#clip0_252_1556)">
// // // //                                  <path
// // // //                                    d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
// // // //                                    fill="#434343"
// // // //                                  />
// // // //                                  <path
// // // //                                    d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
// // // //                                    fill="#434343"
// // // //                                  />
// // // //                                  <path
// // // //                                    d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
// // // //                                    fill="#434343"
// // // //                                  />
// // // //                                </g>
// // // //                                <defs>
// // // //                                  <clipPath id="clip0_252_1556">
// // // //                                    <rect width="32" height="32" fill="white" />
// // // //                                  </clipPath>
// // // //                                </defs>
// // // //                              </svg>
// // // //                            </button>
// // // //                            <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
// // // //                              <img
// // // //                                src={currentContentImageSrc}
// // // //                                alt={`${selectedProduct.name} - Image ${
// // // //                                  currentImageSliderIndex + 1
// // // //                                }`}
// // // //                                className="object-contain w-full h-full"
// // // //                                onError={(e) => {
// // // //                                  e.currentTarget.onerror = null;
// // // //                                  e.currentTarget.src = PRODUCT_PLACEHOLDER;
// // // //                                }}
// // // //                              />
// // // //                              {hasContentSlider && (
// // // //                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
// // // //                                  {contentImages.map((_, index) => (
// // // //                                    <button
// // // //                                      key={`dot-${index}`}
// // // //                                      onClick={(e) => {
// // // //                                        e.stopPropagation();
// // // //                                        setCurrentImageSliderIndex(index);
// // // //                                      }}
// // // //                                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
// // // //                                        currentImageSliderIndex === index
// // // //                                          ? 'bg-white'
// // // //                                          : 'bg-gray-300 hover:bg-gray-100'
// // // //                                      }`}
// // // //                                      aria-label={`View image ${index + 1}`}
// // // //                                    />
// // // //                                  ))}
// // // //                                </div>
// // // //                              )}
// // // //                            </figure>
// // // //                            {/* Prev/Next buttons for slider, if desired, can be added here like pricefilter page - current page has them absolute on main modal div */}
// // // //                            {/* {hasContentSlider && (
// // // //                              <>
// // // //                                <button
// // // //                                  onClick={(e) => {
// // // //                                    e.stopPropagation();
// // // //                                    handlePrevContentImage();
// // // //                                  }}
// // // //                                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-opacity"
// // // //                                  aria-label="Previous image"
// // // //                                >
// // // //                                  <svg
// // // //                                    xmlns="http://www.w3.org/2000/svg"
// // // //                                    className="h-6 w-6"
// // // //                                    fill="none"
// // // //                                    viewBox="0 0 24 24"
// // // //                                    stroke="currentColor"
// // // //                                    strokeWidth="2"
// // // //                                  >
// // // //                                    <path
// // // //                                      strokeLinecap="round"
// // // //                                      strokeLinejoin="round"
// // // //                                      d="M15 19l-7-7 7-7"
// // // //                                    />
// // // //                                  </svg>
// // // //                                </button>
// // // //                                <button
// // // //                                  onClick={(e) => {
// // // //                                    e.stopPropagation();
// // // //                                    handleNextContentImage();
// // // //                                  }}
// // // //                                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-opacity"
// // // //                                  aria-label="Next image"
// // // //                                >
// // // //                                  <svg
// // // //                                    xmlns="http://www.w3.org/2000/svg"
// // // //                                    className="h-6 w-6"
// // // //                                    fill="none"
// // // //                                    viewBox="0 0 24 24"
// // // //                                    stroke="currentColor"
// // // //                                    strokeWidth="2"
// // // //                                  >
// // // //                                    <path
// // // //                                      strokeLinecap="round"
// // // //                                      strokeLinejoin="round"
// // // //                                      d="M9 5l7 7-7 7"
// // // //                                    />
// // // //                                  </svg>
// // // //                                </button>
// // // //                              </>
// // // //                            )} */}
// // // //                          </div>

// // // //                          {/* Right Side: Product Details */}
// // // //                          <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
// // // //                            <div>
// // // //                              {' '}
// // // //                              {/* Content wrapper */}
// // // //                              <div className="at-popuptitlebrandimg flex items-start mb-3">
// // // //                                {currentProductBrand?.company_logo && (
// // // //                                  <span className="w-12 h-12 mr-3 overflow-hidden flex-shrink-0 border rounded-md flex items-center justify-center bg-white">
// // // //                                    <img
// // // //                                      src={currentProductBrand.company_logo}
// // // //                                      alt={`${currentProductBrand.name} logo`}
// // // //                                      className="w-full h-full object-contain"
// // // //                                      onError={(e) => {
// // // //                                        (e.target as HTMLImageElement).src =
// // // //                                          PRODUCT_PLACEHOLDER;
// // // //                                      }}
// // // //                                    />
// // // //                                  </span>
// // // //                                )}
// // // //                                <div
// // // //                                  className="at-popupproducttitlerating flex-grow cursor-pointer"
// // // //                                  onClick={() =>
// // // //                                    handleReviewsClick(selectedProduct._id)
// // // //                                  }
// // // //                                  title="View Reviews"
// // // //                                >
// // // //                                  <h4 className="font-semibold text-lg text-gray-800">
// // // //                                    {currentProductBrand?.name || 'Brand Name'}
// // // //                                  </h4>
// // // //                                  <RatingStars
// // // //                                    rating={Math.round(selectedProduct.total_rating)}
// // // //                                  />
// // // //                                </div>
// // // //                              </div>
// // // //                              <div className="at-popupcolorprice flex justify-between items-start my-3">
// // // //                                <div className="at-popupcolor flex-grow mr-4">
// // // //                                  <h3 className="font-bold text-xl text-gray-900">
// // // //                                    {selectedProduct.name}
// // // //                                  </h3>
// // // //                                </div>
// // // //                                <div className="at-popupprice flex-shrink-0">
// // // //                                  <h3 className="font-bold text-xl text-[#40A574]">
// // // //                                    Rs. {selectedProduct.price + selectedSpecPrice}
// // // //                                  </h3>
// // // //                                </div>
// // // //                              </div>
// // // //                              <div className="at-popupdescription mb-4">
// // // //                                <p className="text-sm text-gray-600 leading-relaxed">
// // // //                                  {selectedProduct.description ||
// // // //                                    'No description available.'}
// // // //                                </p>
// // // //                              </div>
// // // //                              {selectedProduct.specification &&
// // // //                                selectedProduct.specification.length > 0 &&
// // // //                                selectedProduct.specification[0].values?.length > 0 && (
// // // //                                  <div className="at-productsize mb-4">
// // // //                                    <label className="block text-base font-medium text-gray-700 mb-1">
// // // //                                      {selectedProduct.specification[0].name ||
// // // //                                        'Options'}
// // // //                                    </label>
// // // //                                    <div className="overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-2 pb-1">
// // // //                                      {selectedProduct.specification[0].values.map(
// // // //                                        (specValue) => {
// // // //                                          const specPriceNum = Number(specValue.price);
// // // //                                          const displaySpecPrice =
// // // //                                            isNaN(specPriceNum) || specPriceNum === 0
// // // //                                              ? ''
// // // //                                              : ` (+${specPriceNum})`;
// // // //                                          return (
// // // //                                            <button
// // // //                                              key={specValue._id || specValue.value}
// // // //                                              onClick={() =>
// // // //                                                handleSelectSize(
// // // //                                                  specValue.value,
// // // //                                                  specPriceNum
// // // //                                                )
// // // //                                              }
// // // //                                              className={`px-5 py-3 border rounded-full text-base transition-colors duration-150 whitespace-nowrap snap-start ${
// // // //                                                selectedSize === specValue.value
// // // //                                                  ? 'bg-[#40A574] text-white border-[#40A574]'
// // // //                                                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
// // // //                                              }`}
// // // //                                            >
// // // //                                              {specValue.value}
// // // //                                              {displaySpecPrice}
// // // //                                            </button>
// // // //                                          );
// // // //                                        }
// // // //                                      )}
// // // //                                    </div>
// // // //                                  </div>
// // // //                                )}
// // // //                            </div>

// // // //                            {/* Action Buttons Area */}
// // // //                            {/* <div className="at-btnaddtocart mt-auto pt-4 border-t flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
// // // //                              {isInCart(selectedProduct._id) ? (
// // // //                                <button
// // // //                                  onClick={handleGoToCart}
// // // //                                  className="at-btn w-full sm:flex-1"
// // // //                                >
// // // //                                  Go to Cart
// // // //                                  <svg
// // // //                                    className="ml-2 inline-block"
// // // //                                    width="24"
// // // //                                    height="24"
// // // //                                    viewBox="0 0 24 24"
// // // //                                    fill="none"
// // // //                                    xmlns="http://www.w3.org/2000/svg"
// // // //                                  >
// // // //                                    <path
// // // //                                      d="M13.1625 4.1625L19.725 10.725C20.0125 11.0125 20.1875 11.4 20.1875 11.8125C20.1875 12.225 20.0125 12.6125 19.725 12.9L13.1625 19.4625C12.875 19.75 12.4875 19.925 12.075 19.925C11.6625 19.925 11.275 19.75 10.9875 19.4625C10.4125 18.8875 10.4125 17.9375 10.9875 17.3625L14.625 13.725H4.875C4.0375 13.725 3.375 13.0625 3.375 12.225V11.4C3.375 10.5625 4.0375 9.9 4.875 9.9H14.625L10.9875 6.2625C10.4125 5.6875 10.4125 4.7375 10.9875 4.1625C11.275 3.875 11.6625 3.7 12.075 3.7C12.4875 3.7 12.875 3.875 13.1625 4.1625Z"
// // // //                                      fill="white"
// // // //                                    />
// // // //                                  </svg>
// // // //                                </button>
// // // //                              ) : (
// // // //                                <button
// // // //                                  onClick={handleAddToCart}
// // // //                                  className="at-btn w-full sm:flex-1"
// // // //                                >
// // // //                                  Add to Cart
// // // //                                  <svg
// // // //                                    className="ml-2 inline-block"
// // // //                                    width="24"
// // // //                                    height="24"
// // // //                                    viewBox="0 0 32 32"
// // // //                                    xmlns="http://www.w3.org/2000/svg"
// // // //                                  >
// // // //                                    <circle
// // // //                                      cx="16"
// // // //                                      cy="16"
// // // //                                      r="15"
// // // //                                      fill="white"
// // // //                                      stroke="#40A574"
// // // //                                      strokeWidth="2"
// // // //                                    />
// // // //                                    <path
// // // //                                      d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
// // // //                                      fill="#40A574"
// // // //                                    />
// // // //                                  </svg>
// // // //                                </button>
// // // //                              )}
// // // //                              <button
// // // //                                className="at-btn at-btnpersonal w-full sm:flex-1"
// // // //                                onClick={(e) => {
// // // //                                  e.stopPropagation();
// // // //                                  handlePersonalize(selectedProduct._id);
// // // //                                }}
// // // //                              >
// // // //                                Personalize
// // // //                                <label
// // // //                                  className="custom-checkbox relative ml-2 top-[1px]"
// // // //                                  onClick={(e) => e.stopPropagation()}
// // // //                                >
// // // //                                  <input
// // // //                                    className="opacity-0 w-0 h-0 absolute" // Hidden but accessible
// // // //                                    type="checkbox"
// // // //                                    checked={hasPersonalization(selectedProduct._id)}
// // // //                                    readOnly
// // // //                                    tabIndex={-1}
// // // //                                  />
// // // //                                  <span
// // // //                                    className={`checkmark inline-block w-4 h-4 border-2 rounded-sm relative cursor-pointer transition-all ${
// // // //                                      hasPersonalization(selectedProduct._id)
// // // //                                        ? 'bg-[#40A574] border-[#40A574]'
// // // //                                        : 'bg-white border-gray-400 group-hover:border-gray-500'
// // // //                                    }`}
// // // //                                  >
// // // //                                    {hasPersonalization(selectedProduct._id) && (
// // // //                                      <svg
// // // //                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white"
// // // //                                        fill="none"
// // // //                                        stroke="currentColor"
// // // //                                        viewBox="0 0 24 24"
// // // //                                      >
// // // //                                        <path
// // // //                                          strokeLinecap="round"
// // // //                                          strokeLinejoin="round"
// // // //                                          strokeWidth="3"
// // // //                                          d="M5 13l4 4L19 7"
// // // //                                        ></path>
// // // //                                      </svg>
// // // //                                    )}
// // // //                                  </span>
// // // //                                </label>
// // // //                              </button>
// // // //                            </div> */}
// // // //                            <div className="at-btnaddtocart">
// // // //                              {isInCart(selectedProduct._id) ? (
// // // //                                <button onClick={handleGoToCart} className="at-btn">
// // // //                                  Go to Cart
// // // //                                  {/* SVG */}
// // // //                                  <svg
// // // //                                    className="mt-3"
// // // //                                    width="24"
// // // //                                    height="24"
// // // //                                    viewBox="0 0 32 32"
// // // //                                    fill="#ffffff"
// // // //                                    xmlns="http://www.w3.org/2000/svg"
// // // //                                  >
// // // //                                    <circle cx="16" cy="16" r="16" fill="white" />
// // // //                                    <path
// // // //                                      d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
// // // //                                      fill="#40A574"
// // // //                                    />
// // // //                                  </svg>
// // // //                                </button>
// // // //                              ) : (
// // // //                                <button onClick={handleAddToCart} className="at-btn">
// // // //                                  Add to Cart
// // // //                                  {/* SVG */}
// // // //                                  <svg
// // // //                                    className="mt-3"
// // // //                                    width="24"
// // // //                                    height="24"
// // // //                                    viewBox="0 0 32 32"
// // // //                                    fill="#ffffff"
// // // //                                    xmlns="http://www.w3.org/2000/svg"
// // // //                                  >
// // // //                                    <circle cx="16" cy="16" r="16" fill="white" />
// // // //                                    <path
// // // //                                      d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
// // // //                                      fill="#40A574"
// // // //                                    />
// // // //                                  </svg>
// // // //                                </button>
// // // //                              )}
// // // //                              <button
// // // //                                className="at-btn at-btnpersonal"
// // // //                                onClick={() => handlePersonalize(selectedProduct._id)}
// // // //                              >
// // // //                                Personalize
// // // //                                <label className="custom-checkbox top-2">
// // // //                                  <input
// // // //                                    className="align-middle"
// // // //                                    type="checkbox"
// // // //                                    checked={hasPersonalization(selectedProduct._id)}
// // // //                                    readOnly
// // // //                                  />
// // // //                                  <span className="checkmark"></span>
// // // //                                </label>
// // // //                              </button>
// // // //                            </div>
// // // //                          </div>
// // // //                        </div>
// // // //                      </div>
// // // //                    </div>
// // // //                  );
// // // //                })()}

// // // //              {/* Second Modal: Order Summary (Styled like PriceFilterResult) */}
// // // //             {isSecondModalOpen && selectedProduct && (
// // // //         <div
// // // //           className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
// // // //           onClick={closeModals}
// // // //         >
// // // //           <div
// // // //             className="bg-white rounded-lg shadow-lg at-modaldailouge"
// // // //             onClick={(e) => e.stopPropagation()}
// // // //           >
// // // //             <div className="flex justify-between items-center flex-col">
// // // //               {' '}
// // // //               {/* Changed: flex-col to match typical modal flow better */}
// // // //               <div className="at-modalcontent w-full">
// // // //                 {' '}
// // // //                 {/* Added w-full for consistency */}
// // // //                 <div
// // // //                 className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
// // // //                 style={getModalLeftPanelStyle()}
// // // //               >
// // // //                 <button
// // // //                   onClick={closeModals}
// // // //                   className="at-btnpopupclose at-btnpopupclosetwo"
// // // //                 >
// // // //                   {/* Close SVG */}
// // // //                   <svg
// // // //                     width="32"
// // // //                     height="32"
// // // //                     viewBox="0 0 32 32"
// // // //                     fill="none"
// // // //                     xmlns="http://www.w3.org/2000/svg"
// // // //                   >
// // // //                     <g clipPath="url(#clip0_252_1556)">
// // // //                       <path
// // // //                         d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
// // // //                         fill="#434343"
// // // //                       />
// // // //                       <path
// // // //                         d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
// // // //                         fill="#434343"
// // // //                       />
// // // //                       <path
// // // //                         d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
// // // //                         fill="#434343"
// // // //                       />
// // // //                     </g>
// // // //                     <defs>
// // // //                       <clipPath id="clip0_252_1556">
// // // //                         <rect width="32" height="32" fill="white" />
// // // //                       </clipPath>
// // // //                     </defs>
// // // //                   </svg>
// // // //                 </button>
// // // //                 <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
// // // //                   {selectedProduct.background_image &&
// // // //                   selectedProduct.background_image.length > 0 ? (
// // // //                     <>
// // // //                       <img
// // // //                         src={
// // // //                           selectedProduct.background_image[
// // // //                             currentImageSliderIndex
// // // //                           ] || PRODUCT_PLACEHOLDER
// // // //                         }
// // // //                         alt={`${selectedProduct.name} - image ${
// // // //                           currentImageSliderIndex + 1
// // // //                         }`}
// // // //                         className="object-contain w-full h-full"
// // // //                         onError={(e) => {
// // // //                           (e.target as HTMLImageElement).src =
// // // //                             PRODUCT_PLACEHOLDER;
// // // //                         }}
// // // //                       />
// // // //                       {selectedProduct.background_image.length > 1 && ( // Show dots only if more than 1 image
// // // //                         <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
// // // //                           {selectedProduct.background_image.map((_, index) => (
// // // //                             <button
// // // //                               key={index}
// // // //                               onClick={(e) => {
// // // //                                 e.stopPropagation();
// // // //                                 setCurrentImageSliderIndex(index);
// // // //                               }}
// // // //                               className={`w-2.5 h-2.5 rounded-full transition-colors ${
// // // //                                 currentImageSliderIndex === index
// // // //                                   ? 'bg-white'
// // // //                                   : 'bg-gray-300 hover:bg-gray-100'
// // // //                               }`}
// // // //                               aria-label={`View image ${index + 1}`}
// // // //                             />
// // // //                           ))}
// // // //                         </div>
// // // //                       )}
// // // //                     </>
// // // //                   ) : (
// // // //                     // Fallback if background_image array is somehow empty (shouldn't happen with ProductForModal transform)
// // // //                     <img
// // // //                       src={PRODUCT_PLACEHOLDER}
// // // //                       alt={selectedProduct.name}
// // // //                       className="object-contain w-full h-full"
// // // //                       onError={(e) => {
// // // //                         (e.target as HTMLImageElement).src =
// // // //                           PRODUCT_PLACEHOLDER;
// // // //                       }}
// // // //                     />
// // // //                   )}
// // // //                 </figure>
// // // //               </div>
// // // //                 <div className="at-popupcontentside p-6">
// // // //                   {' '}
// // // //                   {/* Added padding for consistency */}
// // // //                   <div className="at-popuptitlebrandimg at-modaltitleqnty">
// // // //                     <div className="at-popupproducttitlerating at-ordersummerytitlearea">
// // // //                       <h4>{selectedProduct.name}</h4>
// // // //                       <p>{selectedProduct.description}</p>
// // // //                     </div>
// // // //                     <div className="at-orderquntatiy">
// // // //                       <div className="at-btnquntatiyholder">
// // // //                         <button
// // // //                           onClick={decreaseQuantity}
// // // //                           disabled={quantity === 1}
// // // //                         >
// // // //                           -
// // // //                         </button>
// // // //                         <span>{quantity}</span>
// // // //                         <button onClick={increaseQuantity}>+</button>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                   <div className="at-ordersummery">
// // // //                     <h3>Order Summary</h3>
// // // //                     <ul>
// // // //                       <li>
// // // //                         <span>Item Price</span>
// // // //                       </li>
// // // //                       <li>
// // // //                         <span>
// // // //                           Rs.
// // // //                           {(selectedProduct.price + selectedSpecPrice).toFixed(
// // // //                             2
// // // //                           )}
// // // //                         </span>
// // // //                       </li>
// // // //                       <li>
// // // //                         <span>Quantity</span>
// // // //                       </li>
// // // //                       <li>
// // // //                         <span>{quantity}</span>
// // // //                       </li>
// // // //                       <li>
// // // //                         <span>Subtotal</span>
// // // //                       </li>
// // // //                       <li>
// // // //                         <span>
// // // //                           Rs.
// // // //                           {(
// // // //                             (selectedProduct.price + selectedSpecPrice) *
// // // //                             quantity
// // // //                           ).toFixed(2)}
// // // //                         </span>
// // // //                       </li>
// // // //                       <li>
// // // //                         <span>Sales Tax 17%</span>
// // // //                       </li>
// // // //                       <li>
// // // //                         <span>
// // // //                           Rs.
// // // //                           {(
// // // //                             (selectedProduct.price + selectedSpecPrice) *
// // // //                             quantity *
// // // //                             0.17
// // // //                           ).toFixed(2)}
// // // //                         </span>
// // // //                       </li>
// // // //                       <li>
// // // //                         <span>Grand Total</span>
// // // //                       </li>
// // // //                       <li>
// // // //                         <span>
// // // //                           Rs.
// // // //                           {(
// // // //                             (selectedProduct.price + selectedSpecPrice) *
// // // //                             quantity *
// // // //                             1.17
// // // //                           ).toFixed(2)}
// // // //                         </span>
// // // //                       </li>
// // // //                     </ul>
// // // //                   </div>
// // // //                   <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder pt-5">
// // // //                     {' '}
// // // //                     {/* Adjusted margin/padding */}
// // // //                     <button
// // // //                       type="button"
// // // //                       className="at-btn"
// // // //                       onClick={handlePlaceOrder}
// // // //                       disabled={processing}
// // // //                     >
// // // //                       {processing ? 'Processing...' : 'Place Order'}
// // // //                     </button>
// // // //                     <a href="/home">
// // // //                       {' '}
// // // //                       {/* Consider using router.push('/home') for SPA navigation */}
// // // //                       <button type="button" className="at-btn at-btncancel">
// // // //                         Continue Shopping
// // // //                       </button>
// // // //                     </a>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //       </>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SubCategoryPage;

// // // // src/app/components/Product/sub_category_page.tsx
// // // 'use client';
// // // import React, { useEffect, useState, useCallback } from 'react';
// // // import { useRouter, useParams } from 'next/navigation';
// // // import {
// // //   fetchSubCategoryList,
// // //   fetchCompanyList,
// // //   fetchProductDetails, // This fetches products for a company
// // //   placeOrder,
// // //   confirmOrder,
// // // } from '@/services/api.service';
// // // import { Skeleton } from '@/components/ui/skeleton';
// // // import { useCart } from '@/context/CartContext';
// // // import { toast } from 'react-toastify';
// // // import RatingStars from '../page-ui/rating_stars';
// // // import Link from 'next/link'; // Keep for "Continue Shopping" if not using router.push

// // // const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
// // // const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

// // // // Define type-based background settings (copied from pricefilter)
// // // const getCategoryBackground = (type?: number) => {
// // //   switch (type) {
// // //     case 1:
// // //       return { image: 'pd_bg_1.jpg', color: '#FFD05E' }; // Yellow
// // //     case 2:
// // //       return { image: 'pd_bg_2.jpg', color: '#FF834B' }; // Orange
// // //     case 3:
// // //       return { image: 'pd_bg_3.jpg', color: '#88C1FD' }; // Blue
// // //     case 4:
// // //       return { image: 'pd_bg_4.jpg', color: '#40A574' }; // Green
// // //     default:
// // //       // Fallback to type 1 style if type is undefined or not matched
// // //       return { image: 'pd_bg_1.jpg', color: '#D6D6DA' }; // Default fallback (Yellow in pricefilter, grey here)
// // //   }
// // // };

// // // const slugify = (str: string) =>
// // //   str
// // //     .toLowerCase()
// // //     .trim()
// // //     .replace(/&/g, 'and')
// // //     .replace(/[^\w\s-]/g, '')
// // //     .replace(/\s+/g, '-')
// // //     .replace(/-+/g, '-');

// // // const unslugify = (slug: string) => {
// // //   return slug
// // //     .replace(/-/g, ' ')
// // //     .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
// // //     .replace(/ And /gi, ' & '); // Replace 'and' with '&'
// // // };

// // // // Interfaces based on pricefilter/page.tsx for modal consistency
// // // interface CompanyForModal {
// // //   _id: string;
// // //   name: string;
// // //   company_logo: string; // Should be a full URL or resolvable path
// // // }

// // // interface CategoryInfoForModal {
// // //   _id: string;
// // //   name: string;
// // //   type: number;
// // // }

// // // interface ProductForModal {
// // //   _id: string;
// // //   name: string;
// // //   price: number;
// // //   description: string;
// // //   company_id: CompanyForModal;
// // //   category_id: CategoryInfoForModal;
// // //   background_images: string[]; // Array of full URLs or resolvable paths
// // //   sticker_path?: string; // Full URL or resolvable path
// // //   image_path?: string; // Full URL or resolvable path
// // //   specification: Array<{
// // //     name: string;
// // //     type: string;
// // //     values: Array<{
// // //       value: string;
// // //       additional_info?: string;
// // //       price: number; // Additional price for this spec value
// // //       _id: string;
// // //     }>;
// // //   }>;
// // //   total_rating: number;
// // //   rating_count: number;
// // // }

// // // interface PersonalizedMessage {
// // //   name: string;
// // //   message: string;
// // //   image_path: string;
// // //   image_id: string;
// // //   productId?: string;
// // // }

// // // // Original interfaces for SubCategoryPage data fetching
// // // interface Company {
// // //   _id: string;
// // //   name: string;
// // //   company_logo: string; // relative path
// // //   subcategory_ids: Array<{
// // //     _id: string;
// // //     name: string;
// // //     category_id: string;
// // //   }>;
// // // }

// // // interface Product {
// // //   _id: string;
// // //   name: string;
// // //   price: number;
// // //   image_path: string; // relative path
// // //   sticker_path: string; // relative path
// // //   description: string;
// // //   company_id: string; // ID of company
// // //   subcategory_id: string;
// // //   background_image: string; // relative path, assumed to be the main display image
// // //   is_featured: boolean;
// // //   total_rating: number;
// // //   // Optional fields that might come from API or need defaults
// // //   rating_count?: number;
// // //   // Assuming product_background_images might be an array of relative paths for a gallery
// // //   product_background_images?: string[];
// // //   specification?: ProductForModal['specification']; // If API provides it
// // // }

// // // // For category info of the current subcategory page
// // // interface PageCategoryInfo {
// // //   _id: string;
// // //   name: string;
// // //   type?: number; // This is the 'type' for background styling
// // // }

// // // const SubCategoryPage = () => {
// // //   const router = useRouter();
// // //   const params = useParams();
// // //   const { subcategory: subcategorySlug } = params;

// // //   const [brands, setBrands] = useState<Company[]>([]);
// // //   // const [products, setProducts] = useState<Product[]>([]); // All products, if needed beyond featured
// // //   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
// // //   const [loading, setLoading] = useState<boolean>(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
// // //   const [brandsLoading, setBrandsLoading] = useState<boolean>(true);
// // //   const [pageCategoryInfo, setPageCategoryInfo] =
// // //     useState<PageCategoryInfo | null>(null);

// // //   // --- Modal States (mirroring pricefilter) ---
// // //   const [processing, setProcessing] = useState(false);
// // //   const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
// // //   const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
// // //   const [selectedProduct, setSelectedProduct] =
// // //     useState<ProductForModal | null>(null);
// // //   // selectedProductCategoryInfo will be derived from selectedProduct.category_id for modal styling
// // //   const [quantity, setQuantity] = useState(1);
// // //   const [selectedSize, setSelectedSize] = useState<string>('M'); // Default size/spec
// // //   const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0);
// // //   const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

// // //   const cartContext = useCart();
// // //   const cartItems = cartContext?.cartItems ?? [];
// // //   const addToCart =
// // //     cartContext?.addToCart ??
// // //     (() => {
// // //       toast.error('Cart functionality is not available.');
// // //       console.error('addToCart not available');
// // //     });
// // //   const removeFromCart =
// // //     cartContext?.removeFromCart ??
// // //     (() => {
// // //       toast.error('Cart functionality is not available.');
// // //       console.error('removeFromCart not available');
// // //     });

// // //   const decreaseQuantity = () => {
// // //     if (quantity > 1) setQuantity(quantity - 1);
// // //   };
// // //   const increaseQuantity = () => {
// // //     setQuantity(quantity + 1);
// // //   };
// // //   const isInCart = (productId: string) =>
// // //     cartItems.some((item) => item._id === productId);

// // //   const [personalizedMessages, setPersonalizedMessages] = useState<{
// // //     [key: string]: PersonalizedMessage | undefined;
// // //   }>({});

// // //   const loadPersonalizedMessages = useCallback(() => {
// // //     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
// // //     try {
// // //       const messages = storedMessages ? JSON.parse(storedMessages) : {};
// // //       setPersonalizedMessages(
// // //         messages && typeof messages === 'object' && !Array.isArray(messages)
// // //           ? messages
// // //           : {}
// // //       );
// // //     } catch (error) {
// // //       console.error('Error parsing personalized messages:', error);
// // //       setPersonalizedMessages({});
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     loadPersonalizedMessages();
// // //     const handleStorageChange = (event: StorageEvent) => {
// // //       if (event.key === 'selectedPersonalizedMessages') {
// // //         loadPersonalizedMessages();
// // //       }
// // //     };
// // //     window.addEventListener('storage', handleStorageChange);
// // //     return () => window.removeEventListener('storage', handleStorageChange);
// // //   }, [loadPersonalizedMessages]);

// // //   const hasPersonalization = (productId: string) =>
// // //     !!personalizedMessages[productId];

// // //   const handlePersonalize = (productId: string) => {
// // //     localStorage.setItem('currentItemId', productId);
// // //     localStorage.setItem(
// // //       'returnPath',
// // //       window.location.pathname + window.location.search
// // //     ); // Current page
// // //     router.push('/messages');
// // //   };

// // //   const handleProductClick = (product: Product) => {
// // //     const companyData = brands.find((b) => b._id === product.company_id);

// // //     let PFGalleryImages: string[] = [];
// // //     // Use product_background_images if available and is an array
// // //     if (
// // //       Array.isArray(product.product_background_images) &&
// // //       product.product_background_images.length > 0
// // //     ) {
// // //       PFGalleryImages = product.product_background_images
// // //         .map((img) => (img ? `${img}` : ''))
// // //         .filter(Boolean);
// // //     }
// // //     // Fallback to individual images if gallery is not available or empty
// // //     if (PFGalleryImages.length === 0) {
// // //       const singleImages = [
// // //         product.background_image, // This is the 'background_image' field from Product interface
// // //       ];
// // //       PFGalleryImages = singleImages
// // //         .map((p) => (p ? `${p}` : ''))
// // //         .filter(Boolean);
// // //     }
// // //     // Ensure unique images and provide placeholder if none found
// // //     PFGalleryImages = [...new Set(PFGalleryImages)];
// // //     if (PFGalleryImages.length === 0) {
// // //       PFGalleryImages.push(PRODUCT_PLACEHOLDER);
// // //     }

// // //     const productForModal: ProductForModal = {
// // //       _id: product._id,
// // //       name: product.name || 'Unnamed Product',
// // //       price: product.price,
// // //       description: product.description || 'No description available.',
// // //       company_id: {
// // //         _id: companyData?._id || `company-default-${product._id}`,
// // //         name: companyData?.name || 'Brand Unavailable',
// // //         company_logo: companyData?.company_logo
// // //           ? `${companyData.company_logo}`
// // //           : PRODUCT_PLACEHOLDER,
// // //       },
// // //       category_id: {
// // //         _id: pageCategoryInfo?._id || 'cat-default-id',
// // //         name: pageCategoryInfo?.name || 'Category Unavailable',
// // //         type: pageCategoryInfo?.type ?? 1, // Default to type 1 if not set
// // //       },
// // //       background_images: PFGalleryImages,
// // //       sticker_path: product.sticker_path
// // //         ? `${product.sticker_path}`
// // //         : undefined,
// // //       image_path: product.image_path
// // //         ? `${product.image_path}`
// // //         : undefined,
// // //       specification: product.specification || [
// // //         // Default specification
// // //         {
// // //           name: 'Size',
// // //           type: 'button',
// // //           values: [
// // //             { value: 'M', price: 0, _id: `spec-default-${product._id}-m` },
// // //             // You can add more default sizes if needed e.g S, L with price 0
// // //             // { value: 'S', price: 0, _id: `spec-default-${product._id}-s` },
// // //             // { value: 'L', price: 0, _id: `spec-default-${product._id}-l` },
// // //           ],
// // //         },
// // //       ],
// // //       total_rating: Number(product.total_rating) || 0,
// // //       rating_count: Number(product.rating_count) || 0,
// // //     };

// // //     const firstSpecGroup = productForModal.specification?.[0];
// // //     const initialSpecValue = firstSpecGroup?.values?.[0]?.value || 'M';
// // //     const rawInitialSpecPrice = firstSpecGroup?.values?.[0]?.price;
// // //     const initialSpecPrice = Number(rawInitialSpecPrice);

// // //     setSelectedProduct(productForModal);
// // //     setQuantity(1);
// // //     setSelectedSize(initialSpecValue);
// // //     setSelectedSpecPrice(isNaN(initialSpecPrice) ? 0 : initialSpecPrice);
// // //     setCurrentImageIndex(0);
// // //     setIsFirstModalOpen(true);
// // //   };

// // //   const handleAddToCart = () => {
// // //     if (selectedProduct && cartContext) {
// // //       const itemToAdd = {
// // //         _id: selectedProduct._id,
// // //         price: selectedProduct.price + selectedSpecPrice, // Combined price
// // //         quantity,
// // //         image_path:
// // //           selectedProduct.background_images?.[0] || PRODUCT_PLACEHOLDER,
// // //         sticker_path: selectedProduct.sticker_path, // Already full URL or placeholder
// // //         name: selectedProduct.name,
// // //         description: selectedProduct.description,
// // //         company_id: selectedProduct.company_id, // This is CompanyForModal object
// // //         category_id: selectedProduct.category_id, // This is CategoryInfoForModal object
// // //         background_images: selectedProduct.background_images,
// // //         personalization: personalizedMessages[selectedProduct._id],
// // //         size: selectedSize,
// // //         // specPrice: selectedSpecPrice, // Optionally pass if cart needs it
// // //       };
// // //       addToCart(itemToAdd as any); // Cast to any if CartItem type is simpler
// // //       setIsFirstModalOpen(false);
// // //       setIsSecondModalOpen(true);
// // //     }
// // //   };

// // //   const handleGoToCart = () => {
// // //     closeModals();
// // //     router.push('/cart');
// // //   };

// // //   const handlePlaceOrder = async () => {
// // //     if (!selectedProduct) return;

// // //     try {
// // //       setProcessing(true);
// // //       const orderSpecification =
// // //         selectedSize && selectedProduct.specification?.[0]?.name
// // //           ? [
// // //               {
// // //                 name: selectedProduct.specification[0].name,
// // //                 values: [
// // //                   {
// // //                     value: selectedSize,
// // //                     price: selectedSpecPrice,
// // //                   },
// // //                 ],
// // //               },
// // //             ]
// // //           : null;

// // //       const orderData = {
// // //         cart_details: [
// // //           {
// // //             product_id: selectedProduct._id,
// // //             quantity: quantity,
// // //             personalized: personalizedMessages[selectedProduct._id] || null,
// // //             specification: orderSpecification,
// // //           },
// // //         ],
// // //       };

// // //       const orderResponse = await placeOrder(orderData);
// // //       if (!orderResponse.success) {
// // //         throw new Error(orderResponse.message || 'Failed to place order');
// // //       }

// // //       localStorage.setItem('order_id', orderResponse.data.order_id);
// // //       localStorage.setItem('payment_id', orderResponse.data.payment_id);
// // //       const orderId = orderResponse.data.order_id;

// // //       if (orderResponse.data.payment_type === 'free') {
// // //         const confirmResponse = await confirmOrder(
// // //           orderId,
// // //           orderResponse.data.payment_id
// // //         );
// // //         if (confirmResponse && confirmResponse.success) {
// // //           removeFromCart(selectedProduct._id);
// // //           const currentPersonalizations = { ...personalizedMessages };
// // //           delete currentPersonalizations[selectedProduct._id];
// // //           localStorage.setItem(
// // //             'selectedPersonalizedMessages',
// // //             JSON.stringify(currentPersonalizations)
// // //           );
// // //           setPersonalizedMessages(currentPersonalizations);
// // //           closeModals();
// // //           router.push('/thankyou');
// // //         } else {
// // //           throw new Error(
// // //             confirmResponse?.message || 'Order confirmation failed'
// // //           );
// // //         }
// // //         return;
// // //       }

// // //       const finalProductPrice = selectedProduct.price + selectedSpecPrice;
// // //       const totalAmountForPayment = finalProductPrice * quantity * 1.17;
// // //       const orderDate = new Date().toISOString().split('T')[0];

// // //       const merchantId = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID;
// // //       const securedKey = process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY;
// // //       const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Your Store';

// // //       if (!merchantId || !securedKey) {
// // //         throw new Error('PayFast merchant details are not configured.');
// // //       }

// // //       const tokenResponse = await fetch(
// // //         `/api/payfast?merchant_id=${merchantId}&secured_key=${securedKey}`
// // //       );
// // //       if (!tokenResponse.ok) {
// // //         const errorData = await tokenResponse.json().catch(() => ({}));
// // //         throw new Error(errorData.message || 'Failed to fetch PayFast token');
// // //       }
// // //       const tokenData = await tokenResponse.json();
// // //       const token = tokenData.ACCESS_TOKEN;
// // //       if (!token) throw new Error('Invalid token received from PayFast');

// // //       const generateSignature = (merchantIdSig: string): string => {
// // //         const timestamp = new Date().getTime();
// // //         return `SIG-${merchantIdSig}-${timestamp}`;
// // //       };

// // //       const formData: Record<string, string> = {
// // //         MERCHANT_ID: merchantId,
// // //         MERCHANT_NAME: storeName,
// // //         TOKEN: token,
// // //         PROCCODE: '00',
// // //         TXNAMT: totalAmountForPayment.toFixed(2),
// // //         CUSTOMER_MOBILE_NO: '03000000000',
// // //         CUSTOMER_EMAIL_ADDRESS: 'customer@example.com',
// // //         SIGNATURE: generateSignature(merchantId),
// // //         VERSION: 'PYMT_WEB_DI_1.0',
// // //         TXNDESC: `Order ${orderId} - ${selectedProduct.name}`,
// // //         SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
// // //         FAILURE_URL: `${window.location.origin}/failure?order_id=${orderId}`,
// // //         BASKET_ID: orderId,
// // //         ORDER_DATE: orderDate,
// // //         CHECKOUT_URL: `${window.location.origin}/confirm?order_id=${orderId}`,
// // //       };

// // //       const form = document.createElement('form');
// // //       form.method = 'POST';
// // //       form.action =
// // //         'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
// // //       form.style.display = 'none';
// // //       Object.entries(formData).forEach(([key, value]) => {
// // //         const input = document.createElement('input');
// // //         input.type = 'hidden';
// // //         input.name = key;
// // //         input.value = value;
// // //         form.appendChild(input);
// // //       });
// // //       document.body.appendChild(form);
// // //       form.submit();
// // //       document.body.removeChild(form);
// // //     } catch (error: any) {
// // //       console.error('Order placement error:', error);
// // //       toast.error(
// // //         error.message || 'An unexpected error occurred during checkout.'
// // //       );
// // //       setProcessing(false);
// // //     }
// // //   };

// // //   const closeModals = () => {
// // //     setIsFirstModalOpen(false);
// // //     setIsSecondModalOpen(false);
// // //     setSelectedProduct(null);
// // //     setQuantity(1);
// // //     setSelectedSize('M');
// // //     setSelectedSpecPrice(0);
// // //     setCurrentImageIndex(0);
// // //     setProcessing(false);
// // //   };

// // //   const getModalLeftPanelStyle = () => {
// // //     const type = selectedProduct?.category_id?.type ?? 1;
// // //     const { image: imageName } = getCategoryBackground(type);
// // //     const imageUrl = `/images/model-bg/${imageName}`;
// // //     return {
// // //       backgroundImage: `url('${imageUrl}')`,
// // //       backgroundSize: 'cover',
// // //       backgroundPosition: 'center',
// // //     };
// // //   };

// // //   const fetchPageSubCategoryInfo = async () => {
// // //     try {
// // //       const response = await fetchSubCategoryList(); // API returns array of all subcategories
// // //       if (response.success && Array.isArray(response.data)) {
// // //         // Find the current subcategory by slug
// // //         const currentSubCategory = response.data.find(
// // //           (sc: any) =>
// // //             sc.name.toLowerCase().replace(/\s+/g, '-') === subcategorySlug || // handle slugified names
// // //             sc.name.toLowerCase().replace(/\s+/g, '') === subcategorySlug // handle names without spaces
// // //         );

// // //         if (currentSubCategory) {
// // //           setSubCategoryId(currentSubCategory._id);
// // //           // Assuming category_id on subcategory object has the 'type'
// // //           setPageCategoryInfo({
// // //             _id: currentSubCategory.category_id._id,
// // //             name: currentSubCategory.category_id.name,
// // //             type: currentSubCategory.category_id.type ?? 1, // Default to type 1
// // //           });
// // //           fetchData(currentSubCategory._id); // Fetch brands and products for this subcategory
// // //         } else {
// // //           setError('Subcategory not found.');
// // //           setLoading(false);
// // //           setBrandsLoading(false);
// // //         }
// // //       } else {
// // //         throw new Error(response.message || 'Failed to fetch subcategories.');
// // //       }
// // //     } catch (err: any) {
// // //       console.error('Error fetching subcategory details:', err);
// // //       setError(err.message || 'Error fetching subcategory details.');
// // //       setLoading(false);
// // //       setBrandsLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (subcategorySlug) {
// // //       fetchPageSubCategoryInfo();
// // //     }
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [subcategorySlug]);

// // //   const fetchData = async (currentSubId: string) => {
// // //     setLoading(true);
// // //     setBrandsLoading(true);
// // //     setError(null);
// // //     try {
// // //       const companiesResponse = await fetchCompanyList();
// // //       if (companiesResponse.success && Array.isArray(companiesResponse.data)) {
// // //         const filteredCompanies = companiesResponse.data.filter(
// // //           (company: Company) =>
// // //             company.subcategory_ids.some((sc) => sc._id === currentSubId)
// // //         );
// // //         setBrands(filteredCompanies);

// // //         if (filteredCompanies.length > 0) {
// // //           // Fetch products for all relevant companies
// // //           // Note: fetchProductDetails(companyId) fetches products for ONE company.
// // //           // We might need to adjust if we want ALL products for the subcategory, or just featured.
// // //           // For now, let's assume we get featured products somehow or filter them client-side.

// // //           const productPromises = filteredCompanies.map(
// // //             (company: { _id: string }) => fetchProductDetails(company._id) // This API call fetches products for a specific company
// // //           );
// // //           const productResponses = await Promise.all(productPromises);

// // //           let allFetchedProducts: Product[] = [];
// // //           productResponses.forEach((res) => {
// // //             if (res.success && Array.isArray(res.data)) {
// // //               allFetchedProducts = [...allFetchedProducts, ...res.data];
// // //             }
// // //           });

// // //           // Filter for featured products from all fetched products for this subcategory
// // //           const featured = allFetchedProducts.filter(
// // //             (p) => p.is_featured && p.subcategory_id === currentSubId
// // //           );
// // //           setFeaturedProducts(featured);
// // //         } else {
// // //           setFeaturedProducts([]);
// // //         }
// // //       } else {
// // //         setError(companiesResponse.message || 'Failed to fetch companies.');
// // //       }
// // //     } catch (err: any) {
// // //       console.error('Error fetching data:', err);
// // //       setError(err.message || 'An error occurred while fetching data.');
// // //     } finally {
// // //       setLoading(false);
// // //       setBrandsLoading(false);
// // //     }
// // //   };

// // //   const handleBrandClick = (
// // //     brandname: string,
// // //     brandLogo: string, // relative path
// // //     brandId: string
// // //   ) => {
// // //     const slug = brandname.toLowerCase().replace(/\s+/g, '');
// // //     sessionStorage.setItem('brandLogo', `${brandLogo}`); // Store full path
// // //     // Adjust navigation path as needed
// // //     router.push(`/subcategory/${subcategorySlug}/${slug}/${brandId}`);
// // //   };

// // //   const handleReviewsClick = (productId: string | undefined) => {
// // //     if (productId) {
// // //       router.push(`/reviews/${productId}`);
// // //     } else {
// // //       toast.warn('Cannot view reviews for this product.');
// // //     }
// // //   };

// // //   // Card background style using page's category type
// // //   const getCardBackgroundStyle = () => {
// // //     const type = pageCategoryInfo?.type ?? 1; // Use page's category type
// // //     const { color } = getCategoryBackground(type);
// // //     return { backgroundColor: color };
// // //   };

// // //   const decodedSubcategoryName =
// // //     typeof subcategorySlug === 'string'
// // //       ? decodeURIComponent(subcategorySlug as string)
// // //           .replace(/-/g, ' ')
// // //           .replace(/\b\w/g, (l) => l.toUpperCase())
// // //       : 'Subcategory';

// // //   return (
// // //     <div className="at-categories at-maincontentwrapper">
// // //       {error && (
// // //         <p className="error-message text-center text-red-600 py-6">{error}</p>
// // //       )}
// // //       <>
// // //         <div className="at-pagesectiontitle mb-6 border-b pb-3">
// // //           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
// // //             {decodedSubcategoryName}
// // //           </h1>
// // //         </div>

// // //         <div className="at-pagesectiontitle">
// // //           <h2>Shop by Brands</h2>
// // //         </div>
// // //         <div className="at-categoriesgrid">
// // //           {brandsLoading &&
// // //             Array.from({ length: 6 }).map((_, brandindex) => (
// // //               <div className="at-branditem" key={`brandskel-${brandindex}`}>
// // //                 <Skeleton className="h-20 w-full px-8 bg-gray-200 rounded-lg" />
// // //               </div>
// // //             ))}
// // //           {!brandsLoading && !error && brands.length === 0 && (
// // //             <p className="col-span-full text-center text-gray-500 py-4">
// // //               No brands available for this subcategory.
// // //             </p>
// // //           )}
// // //           {!brandsLoading &&
// // //             brands.length > 0 &&
// // //             brands.map((brand) => (
// // //               <div
// // //                 key={brand._id}
// // //                 className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
// // //                 onClick={(e) => {
// // //                   e.preventDefault();
// // //                   handleBrandClick(brand.name, brand.company_logo, brand._id);
// // //                 }}
// // //               >
// // //                 <img
// // //                   src={
// // //                     brand.company_logo
// // //                       ? `${brand.company_logo}`
// // //                       : PRODUCT_PLACEHOLDER
// // //                   }
// // //                   alt={brand.name}
// // //                   className="max-h-full max-w-full object-contain"
// // //                   onError={(e) => {
// // //                     (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
// // //                   }}
// // //                 />
// // //               </div>
// // //             ))}
// // //         </div>

// // //         <div className="at-giftcard mt-8">
// // //           <div className="at-pagesectiontitle">
// // //             <h2>Featured Products</h2>
// // //           </div>
// // //           <div className="at-cardgrid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
// // //             {loading && ( // Use main loading for product skeletons
// // //               <>
// // //                 {Array.from({ length: 8 }).map((_, index) => (
// // //                   <div
// // //                     className="at-carditem rounded-lg overflow-hidden bg-white shadow-md"
// // //                     key={`prodskel-${index}`}
// // //                   >
// // //                     <Skeleton className="h-40 w-full bg-gray-200" />
// // //                     <div className="p-3">
// // //                       <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200" />
// // //                       <Skeleton className="h-4 w-1/2 bg-gray-200" />
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </>
// // //             )}
// // //             {!loading && !error && featuredProducts.length === 0 && (
// // //               <p className="col-span-full text-center text-gray-500 py-6">
// // //                 No featured products available.
// // //               </p>
// // //             )}
// // //             {!loading &&
// // //               !error &&
// // //               featuredProducts.map((product) => {
// // //                 const brand = brands.find((b) => b._id === product.company_id);
// // //                 // const displayImage = product.sticker_path || product.image_path || product.background_image;
// // //                 const displayImage = product.sticker_path;

// // //                 return (
// // //                   <div
// // //                     className="at-carditem cursor-pointer" // Ensure this class matches pricefilter style if needed
// // //                     key={product._id}
// // //                     onClick={() => handleProductClick(product)}
// // //                   >
// // //                     <figure
// // //                       className="at-giftimage flex-shrink-0 relative h-40" // Style from pricefilter
// // //                       style={getCardBackgroundStyle()} // Uses page's category type for bg color
// // //                     >
// // //                       <img
// // //                         src={
// // //                           displayImage
// // //                             ? `${product.sticker_path}`
// // //                             : PRODUCT_PLACEHOLDER
// // //                         }
// // //                         alt={product.name || 'Product Image'}
// // //                         onError={(e) => {
// // //                           (e.target as HTMLImageElement).src =
// // //                             PRODUCT_PLACEHOLDER;
// // //                         }}
// // //                         className="w-full h-full object-contain p-2"
// // //                       />
// // //                     </figure>
// // //                     <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
// // //                       <div className="at-gifttitle flex items-center justify-between w-full mb-1">
// // //                         <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 truncate flex-1 mr-2">
// // //                           {product.name || 'Product'}
// // //                         </h3>
// // //                         <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
// // //                           PKR {product.price}
// // //                         </span>
// // //                       </div>
// // //                       {brand?.name ? (
// // //                         <h4 className="font-semibold text-xs text-gray-600 truncate">
// // //                           {brand.name}
// // //                         </h4>
// // //                       ) : (
// // //                         <h4 className="font-semibold text-xs text-gray-400 truncate italic">
// // //                           {/* Brand not specified */}
// // //                         </h4>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 );
// // //               })}
// // //           </div>
// // //         </div>

// // //         {/* --- Modals (copied and adapted from pricefilter/page.tsx) --- */}
// // //         {/* First Modal (Product Details) */}
// // //         {isFirstModalOpen && selectedProduct && (
// // //           <div
// // //             className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
// // //             onClick={closeModals}
// // //           >
// // //             <div
// // //               className="bg-white rounded-lg shadow-lg at-modaldailouge" // max-w-4xl w-full max-h-[90vh] overflow-y-auto
// // //               onClick={(e) => e.stopPropagation()}
// // //             >
// // //               <div className="flex flex-col md:flex-row">
// // //                 {' '}
// // //                 {/* Ensure modal structure matches */}
// // //                 <div
// // //                   className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
// // //                   style={getModalLeftPanelStyle()}
// // //                 >
// // //                   <button
// // //                     onClick={closeModals}
// // //                     className="at-btnpopupclose at-btnpopupclosetwo"
// // //                   >
// // //                     <svg
// // //                       width="32"
// // //                       height="32"
// // //                       viewBox="0 0 32 32"
// // //                       fill="none"
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                     >
// // //                       <g clipPath="url(#clip0_252_1556)">
// // //                         <path
// // //                           d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
// // //                           fill="#434343"
// // //                         />
// // //                         <path
// // //                           d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
// // //                           fill="#434343"
// // //                         />
// // //                         <path
// // //                           d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
// // //                           fill="#434343"
// // //                         />
// // //                       </g>
// // //                       <defs>
// // //                         <clipPath id="clip0_252_1556">
// // //                           <rect width="32" height="32" fill="white" />
// // //                         </clipPath>
// // //                       </defs>
// // //                     </svg>
// // //                   </button>
// // //                   <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
// // //                     {selectedProduct.background_images &&
// // //                     selectedProduct.background_images.length > 0 ? (
// // //                       <>
// // //                         <img
// // //                           src={
// // //                             `${BASE_URL}/${selectedProduct.background_images[currentImageIndex]}` ||
// // //                             PRODUCT_PLACEHOLDER
// // //                           }
// // //                           alt={`${selectedProduct.name} - image ${
// // //                             currentImageIndex + 1
// // //                           }`}
// // //                           className="object-contain w-full h-full "
// // //                           onError={(e) => {
// // //                             (e.target as HTMLImageElement).src =
// // //                               PRODUCT_PLACEHOLDER;
// // //                           }}
// // //                         />
// // //                         {selectedProduct.background_images.length > 1 && (
// // //                           <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
// // //                             {selectedProduct.background_images.map(
// // //                               (_, index) => (
// // //                                 <button
// // //                                   key={index}
// // //                                   onClick={(e) => {
// // //                                     e.stopPropagation();
// // //                                     setCurrentImageIndex(index);
// // //                                   }}
// // //                                   className={`w-2.5 h-2.5 rounded-full transition-colors ${
// // //                                     currentImageIndex === index
// // //                                       ? 'bg-white'
// // //                                       : 'bg-gray-300 hover:bg-gray-100'
// // //                                   }`}
// // //                                   aria-label={`View image ${index + 1}`}
// // //                                 />
// // //                               )
// // //                             )}
// // //                           </div>
// // //                         )}
// // //                       </>
// // //                     ) : (
// // //                       <img
// // //                         src={PRODUCT_PLACEHOLDER}
// // //                         alt={selectedProduct.name}
// // //                         className="object-contain w-full h-full"
// // //                       />
// // //                     )}
// // //                   </figure>
// // //                 </div>
// // //                 <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
// // //                   <div>
// // //                     <div className="at-popuptitlebrandimg flex items-start mb-3">
// // //                       <span className="w-12 h-12 mr-3 overflow-hidden flex-shrink-0">
// // //                         <img
// // //                           src={
// // //                             selectedProduct.company_id?.company_logo ||
// // //                             PRODUCT_PLACEHOLDER
// // //                           }
// // //                           alt={`${
// // //                             selectedProduct.company_id?.name || 'Brand'
// // //                           } logo`}
// // //                           className="w-full h-full object-contain"
// // //                           onError={(e) => {
// // //                             (e.target as HTMLImageElement).src =
// // //                               PRODUCT_PLACEHOLDER;
// // //                           }}
// // //                         />
// // //                       </span>
// // //                       <div
// // //                         className="at-popupproduct titlerating flex-grow cursor-pointer"
// // //                         onClick={() => handleReviewsClick(selectedProduct._id)}
// // //                         title="View Reviews"
// // //                       >
// // //                         <h4 className="font-semibold text-lg text-gray-800">
// // //                           {selectedProduct.company_id?.name || 'Brand Name'}
// // //                         </h4>
// // //                         <div className="flex justify-start items-center">
// // //                           <RatingStars
// // //                             rating={Math.round(selectedProduct.total_rating)}
// // //                           />
// // //                           <p className="ml-1 text-sm text-gray-600">
// // //                             ({Math.round(selectedProduct.total_rating)})
// // //                           </p>
// // //                         </div>
// // //                       </div>
// // //                     </div>

// // //                     <div className="at-popupcolorprice flex justify-between items-start my-3">
// // //                       <div className="at-popupcolor flex-grow mr-4">
// // //                         <h3 className="font-bold text-xl text-gray-900">
// // //                           {selectedProduct.name}
// // //                         </h3>
// // //                       </div>
// // //                       <div className="at-popupprice flex-shrink-0">
// // //                         <h3 className="font-bold text-xl text-[#40A574]">
// // //                           Rs. {selectedProduct.price + selectedSpecPrice}
// // //                         </h3>
// // //                       </div>
// // //                     </div>

// // //                     <div className="at-popupdescription mb-4">
// // //                       <p className="text-sm text-gray-600 leading-relaxed">
// // //                         {selectedProduct.description}
// // //                       </p>
// // //                     </div>

// // //                     {selectedProduct.specification &&
// // //                       selectedProduct.specification.length > 0 &&
// // //                       selectedProduct.specification[0].values.length > 0 && (
// // //                         <div className="at-productsize mb-4">
// // //                           <label className="block text-base font-medium text-gray-700 mb-1">
// // //                             {selectedProduct.specification[0].name || 'Options'}
// // //                           </label>
// // //                           <div className="overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-2">
// // //                             {selectedProduct.specification[0].values.map(
// // //                               (specValue) => {
// // //                                 const specPriceNum = Number(specValue.price);
// // //                                 const displaySpecPrice =
// // //                                   isNaN(specPriceNum) || specPriceNum === 0
// // //                                     ? ''
// // //                                     : ` (+${specPriceNum})`;
// // //                                 return (
// // //                                   <button
// // //                                     key={specValue._id || specValue.value}
// // //                                     onClick={() => {
// // //                                       setSelectedSize(specValue.value);
// // //                                       setSelectedSpecPrice(
// // //                                         isNaN(specPriceNum) ? 0 : specPriceNum
// // //                                       );
// // //                                     }}
// // //                                     className={`px-5 py-3 border rounded-full text-base transition-colors duration-150 ${
// // //                                       selectedSize === specValue.value
// // //                                         ? 'bg-[#40A574] text-white border-[#40A574]'
// // //                                         : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
// // //                                     }`}
// // //                                   >
// // //                                     {specValue.value}
// // //                                     {displaySpecPrice}
// // //                                   </button>
// // //                                 );
// // //                               }
// // //                             )}
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                   </div>

// // //                   <div className="at-btnaddtocart">
// // //                     {isInCart(selectedProduct._id) ? (
// // //                       <button onClick={handleGoToCart} className="at-btn">
// // //                         Go to Cart
// // //                         <svg
// // //                           className="mt-3"
// // //                           width="24"
// // //                           height="24"
// // //                           viewBox="0 0 32 32"
// // //                           fill="#ffffff"
// // //                           xmlns="http://www.w3.org/2000/svg"
// // //                         >
// // //                           <circle cx="16" cy="16" r="16" fill="white" />
// // //                           <path
// // //                             d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
// // //                             fill="#40A574"
// // //                           />
// // //                         </svg>
// // //                       </button>
// // //                     ) : (
// // //                       <button onClick={handleAddToCart} className="at-btn">
// // //                         Add to Cart
// // //                         <svg
// // //                           className="mt-3"
// // //                           width="24"
// // //                           height="24"
// // //                           viewBox="0 0 32 32"
// // //                           fill="#ffffff"
// // //                           xmlns="http://www.w3.org/2000/svg"
// // //                         >
// // //                           <circle cx="16" cy="16" r="16" fill="white" />
// // //                           <path
// // //                             d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
// // //                             fill="#40A574"
// // //                           />
// // //                         </svg>
// // //                       </button>
// // //                     )}
// // //                     <button
// // //                       className="at-btn at-btnpersonal"
// // //                       onClick={() => handlePersonalize(selectedProduct._id)}
// // //                     >
// // //                       Personalize
// // //                       <label className="custom-checkbox top-2">
// // //                         <input
// // //                           className="align-middle"
// // //                           type="checkbox"
// // //                           checked={hasPersonalization(selectedProduct._id)}
// // //                           readOnly
// // //                         />
// // //                         <span className="checkmark"></span>
// // //                       </label>
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Second Modal (Order Summary) */}
// // //         {isSecondModalOpen && selectedProduct && (
// // //           <div
// // //             className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
// // //             onClick={closeModals}
// // //           >
// // //             <div
// // //               className="bg-white rounded-lg shadow-lg at-modaldailouge" // max-w-4xl w-full max-h-[90vh] overflow-y-auto
// // //               onClick={(e) => e.stopPropagation()}
// // //             >
// // //               <div className="flex flex-col md:flex-row">
// // //                 {' '}
// // //                 {/* Structure from pricefilter */}
// // //                 <div
// // //                   className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative" // md:order-first
// // //                   style={getModalLeftPanelStyle()}
// // //                 >
// // //                   <button
// // //                     onClick={closeModals}
// // //                     className="at-btnpopupclose at-btnpopupclosetwo"
// // //                   >
// // //                     <svg
// // //                       width="32"
// // //                       height="32"
// // //                       viewBox="0 0 32 32"
// // //                       fill="none"
// // //                       xmlns="http://www.w3.org/2000/svg"
// // //                     >
// // //                       <g clipPath="url(#clip0_252_1556)">
// // //                         <path
// // //                           d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z"
// // //                           fill="#434343"
// // //                         />
// // //                         <path
// // //                           d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
// // //                           fill="#434343"
// // //                         />
// // //                         <path
// // //                           d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
// // //                           fill="#434343"
// // //                         />
// // //                       </g>
// // //                       <defs>
// // //                         <clipPath id="clip0_252_1556">
// // //                           <rect width="32" height="32" fill="white" />
// // //                         </clipPath>
// // //                       </defs>
// // //                     </svg>
// // //                   </button>
// // //                   <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
// // //                     <img
// // //                       src={
// // //                         `${BASE_URL}/${selectedProduct.background_images[currentImageIndex]}` ||
// // //                         PRODUCT_PLACEHOLDER
// // //                       }
// // //                       alt={selectedProduct.name}
// // //                       className="object-contain w-full h-full"
// // //                       onError={(e) => {
// // //                         (e.target as HTMLImageElement).src =
// // //                           PRODUCT_PLACEHOLDER;
// // //                       }}
// // //                     />
// // //                     {/* No slider dots needed here usually, but can be added if design requires */}
// // //                   </figure>
// // //                 </div>
// // //                 <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
// // //                   {' '}
// // //                   {/* md:order-last */}
// // //                   <div>
// // //                     <div className="at-popuptitlebrandimg at-modaltitleqnty mb-4">
// // //                       {' '}
// // //                       {/* Adapted class for layout */}
// // //                       <div className="at-popupproducttitlerating at-ordersummerytitlearea flex-grow">
// // //                         <h4 className="font-bold text-lg text-gray-800">
// // //                           {selectedProduct.name}
// // //                         </h4>
// // //                         <p className="text-sm text-gray-600 truncate">
// // //                           {selectedProduct.description}
// // //                         </p>
// // //                       </div>
// // //                       <div className="at-orderquntatiy flex-shrink-0 ml-4">
// // //                         <div className="at-btnquntatiyholder flex items-center border rounded-md">
// // //                           <button
// // //                             onClick={decreaseQuantity}
// // //                             disabled={quantity <= 1}
// // //                             className="px-3 py-1 text-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
// // //                           >
// // //                             -
// // //                           </button>
// // //                           <span className="px-4 py-1 text-base text-gray-800">
// // //                             {quantity}
// // //                           </span>
// // //                           <button
// // //                             onClick={increaseQuantity}
// // //                             className="px-3 py-1 text-lg font-medium text-gray-700 hover:bg-gray-100"
// // //                           >
// // //                             +
// // //                           </button>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                     <div className="at-ordersummery border-t pt-4">
// // //                       <h3 className="font-semibold text-md text-gray-800 mb-2">
// // //                         Order Summary
// // //                       </h3>
// // //                       <ul className="space-y-1 text-sm">
// // //                         <li className="flex justify-between">
// // //                           <span>Item Price:</span>{' '}
// // //                           <span>
// // //                             Rs.{' '}
// // //                             {(
// // //                               selectedProduct.price + selectedSpecPrice
// // //                             ).toFixed(2)}
// // //                           </span>
// // //                         </li>
// // //                         <li className="flex justify-between">
// // //                           <span>Quantity:</span> <span>{quantity}</span>
// // //                         </li>
// // //                         <li className="flex justify-between">
// // //                           <span>Subtotal:</span>{' '}
// // //                           <span>
// // //                             Rs.{' '}
// // //                             {(
// // //                               (selectedProduct.price + selectedSpecPrice) *
// // //                               quantity
// // //                             ).toFixed(2)}
// // //                           </span>
// // //                         </li>
// // //                         <li className="flex justify-between">
// // //                           <span>Sales Tax (17%):</span>{' '}
// // //                           <span>
// // //                             Rs.{' '}
// // //                             {(
// // //                               (selectedProduct.price + selectedSpecPrice) *
// // //                               quantity *
// // //                               0.17
// // //                             ).toFixed(2)}
// // //                           </span>
// // //                         </li>
// // //                         <li className="flex justify-between font-bold text-md mt-2 border-t pt-2">
// // //                           <span>Grand Total:</span>{' '}
// // //                           <span>
// // //                             Rs.{' '}
// // //                             {(
// // //                               (selectedProduct.price + selectedSpecPrice) *
// // //                               quantity *
// // //                               1.17
// // //                             ).toFixed(2)}
// // //                           </span>
// // //                         </li>
// // //                       </ul>
// // //                     </div>
// // //                   </div>
// // //                   <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder pt-5 mt-auto">
// // //                     {' '}
// // //                     {/* Ensure buttons are at bottom */}
// // //                     <button
// // //                       type="button"
// // //                       className="at-btn w-full mb-2"
// // //                       onClick={handlePlaceOrder}
// // //                       disabled={processing}
// // //                     >
// // //                       {processing ? 'Processing...' : 'Place Order'}
// // //                     </button>
// // //                     <button
// // //                       type="button"
// // //                       className="at-btn at-btncancel w-full"
// // //                       onClick={() => router.push('/home')}
// // //                     >
// // //                       {' '}
// // //                       {/* Or closeModals() then router.push */}
// // //                       Continue Shopping
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </>
// // //     </div>
// // //   );
// // // };

// // // export default SubCategoryPage;

// src/app/components/Product/sub_category_page.tsx
'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  fetchSubCategoryList,
  fetchCompanyList,
  fetchProductDetails, // This fetches products for a company
  placeOrder,
  confirmOrder,
} from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import RatingStars from '../page-ui/rating_stars';
import Link from 'next/link'; // Keep for "Continue Shopping" if not using router.push

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''; // This might not be needed if paths are absolute/full

// Define type-based background settings (copied from pricefilter)
const getCategoryBackground = (type?: number) => {
  switch (type) {
    case 1:
      return { image: 'pd_bg_1.jpg', color: '#FFD05E' }; // Yellow
    case 2:
      return { image: 'pd_bg_2.jpg', color: '#FF834B' }; // Orange
    case 3:
      return { image: 'pd_bg_3.jpg', color: '#88C1FD' }; // Blue
    case 4:
      return { image: 'pd_bg_4.jpg', color: '#40A574' }; // Green
    default:
      // Fallback to type 1 style if type is undefined or not matched
      return { image: 'pd_bg_1.jpg', color: '#D6D6DA' }; // Default fallback (Yellow in pricefilter, grey here)
  }
};

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const unslugify = (slug: string) => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
    .replace(/ And /gi, ' & '); // Replace 'and' with '&'
};

// Interfaces based on pricefilter/page.tsx for modal consistency
interface CompanyForModal {
  _id: string;
  name: string;
  company_logo: string; // Should be a full URL or resolvable path
}

interface CategoryInfoForModal {
  _id: string;
  name: string;
  type: number;
}

interface ProductForModal {
  _id: string;
  name: string;
  price: number;
  description: string;
  company_id: CompanyForModal;
  category_id: CategoryInfoForModal;
  background_images: string[]; // Array of full URLs or resolvable paths
  sticker_path?: string; // Full URL or resolvable path
  image_path?: string; // Full URL or resolvable path
  specification: Array<{
    name: string;
    type: string;
    values: Array<{
      value: string;
      additional_info?: string;
      price: number; // Additional price for this spec value
      _id: string;
    }>;
  }>;
  total_rating: number;
  rating_count: number;
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

// Original interfaces for SubCategoryPage data fetching
interface Company {
  _id: string;
  name: string;
  company_logo: string; // relative path (or absolute/full if used directly)
  subcategory_ids: Array<{
    _id: string;
    name: string;
    category_id: string;
  }>;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image_path: string; // relative path (or absolute/full if used directly)
  sticker_path: string; // relative path (or absolute/full if used directly)
  description: string;
  company_id: string; // ID of company
  subcategory_id: string;
  background_image: string; // relative path (or absolute/full if used directly)
  is_featured: boolean;
  total_rating: number;
  // Optional fields that might come from API or need defaults
  rating_count?: number;
  // Assuming product_background_images might be an array of relative paths (or absolute/full) for a gallery
  product_background_images?: string[];
  specification?: ProductForModal['specification']; // If API provides it
}

// For category info of the current subcategory page
interface PageCategoryInfo {
  _id: string;
  name: string;
  type?: number; // This is the 'type' for background styling
}

const SubCategoryPage = () => {
  const router = useRouter();
  const params = useParams();
  const { subcategory: subcategorySlug } = params;

  const [brands, setBrands] = useState<Company[]>([]);
  // const [products, setProducts] = useState<Product[]>([]); // All products, if needed beyond featured
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
  const [brandsLoading, setBrandsLoading] = useState<boolean>(true);
  const [pageCategoryInfo, setPageCategoryInfo] =
    useState<PageCategoryInfo | null>(null);

  // --- Modal States (mirroring pricefilter) ---
  const [processing, setProcessing] = useState(false);
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductForModal | null>(null);
  // selectedProductCategoryInfo will be derived from selectedProduct.category_id for modal styling
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('M'); // Default size/spec
  const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const cartContext = useCart();
  const cartItems = cartContext?.cartItems ?? [];
  const addToCart =
    cartContext?.addToCart ??
    (() => {
      toast.error('Cart functionality is not available.');
      console.error('addToCart not available');
    });
  const removeFromCart =
    cartContext?.removeFromCart ??
    (() => {
      toast.error('Cart functionality is not available.');
      console.error('removeFromCart not available');
    });

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage | undefined;
  }>({});

  const loadPersonalizedMessages = useCallback(() => {
    const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
    try {
      const messages = storedMessages ? JSON.parse(storedMessages) : {};
      setPersonalizedMessages(
        messages && typeof messages === 'object' && !Array.isArray(messages)
          ? messages
          : {}
      );
    } catch (error) {
      console.error('Error parsing personalized messages:', error);
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
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadPersonalizedMessages]);

  const hasPersonalization = (productId: string) =>
    !!personalizedMessages[productId];

  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem(
      'returnPath',
      window.location.pathname + window.location.search
    ); // Current page
    router.push('/messages');
  };

  const handleProductClick = (product: Product) => {
    const companyData = brands.find((b) => b._id === product.company_id);

    let PFGalleryImages: string[] = [];
    // Use product_background_images if available and is an array
    // Assuming these paths are already full URLs or absolute paths like other image fields
    if (
      Array.isArray(product.product_background_images) &&
      product.product_background_images.length > 0
    ) {
      PFGalleryImages = product.product_background_images
        .map((img) => (img ? `${img}` : '')) // Keep as is
        .filter(Boolean);
    }
    // Fallback to individual images if gallery is not available or empty
    if (PFGalleryImages.length === 0) {
      const singleImages = [
        product.background_image, // This is the 'background_image' field from Product interface
      ];
      PFGalleryImages = singleImages
        .map((p) => (p ? `${p}` : '')) // Keep as is
        .filter(Boolean);
    }
    // Ensure unique images and provide placeholder if none found
    PFGalleryImages = [...new Set(PFGalleryImages)];
    if (PFGalleryImages.length === 0) {
      PFGalleryImages.push(PRODUCT_PLACEHOLDER);
    }

    const productForModal: ProductForModal = {
      _id: product._id,
      name: product.name || 'Unnamed Product',
      price: product.price,
      description: product.description || 'No description available.',
      company_id: {
        _id: companyData?._id || `company-default-${product._id}`,
        name: companyData?.name || 'Brand Unavailable',
        company_logo: companyData?.company_logo // Assumed to be full/absolute path
          ? `${companyData.company_logo}`
          : PRODUCT_PLACEHOLDER,
      },
      category_id: {
        _id: pageCategoryInfo?._id || 'cat-default-id',
        name: pageCategoryInfo?.name || 'Category Unavailable',
        type: pageCategoryInfo?.type ?? 1, // Default to type 1 if not set
      },
      background_images: PFGalleryImages, // These are now assumed to be full/absolute paths
      sticker_path: product.sticker_path // Assumed to be full/absolute path
        ? `${product.sticker_path}`
        : undefined,
      image_path: product.image_path // Assumed to be full/absolute path
        ? `${product.image_path}`
        : undefined,
      specification: product.specification || [
        // Default specification
        {
          name: 'Size',
          type: 'button',
          values: [
            { value: 'M', price: 0, _id: `spec-default-${product._id}-m` },
          ],
        },
      ],
      total_rating: Number(product.total_rating) || 0,
      rating_count: Number(product.rating_count) || 0,
    };

    const firstSpecGroup = productForModal.specification?.[0];
    const initialSpecValue = firstSpecGroup?.values?.[0]?.value || 'M';
    const rawInitialSpecPrice = firstSpecGroup?.values?.[0]?.price;
    const initialSpecPrice = Number(rawInitialSpecPrice);

    setSelectedProduct(productForModal);
    setQuantity(1);
    setSelectedSize(initialSpecValue);
    setSelectedSpecPrice(isNaN(initialSpecPrice) ? 0 : initialSpecPrice);
    setCurrentImageIndex(0);
    setIsFirstModalOpen(true);
  };

  const handleAddToCart = () => {
    if (selectedProduct && cartContext) {
      const itemToAdd = {
        _id: selectedProduct._id,
        price: selectedProduct.price + selectedSpecPrice, // Combined price
        quantity,
        image_path:
          selectedProduct.background_images?.[0] || PRODUCT_PLACEHOLDER, // Use first background image
        sticker_path: selectedProduct.sticker_path,
        name: selectedProduct.name,
        description: selectedProduct.description,
        company_id: selectedProduct.company_id,
        category_id: selectedProduct.category_id,
        background_images: selectedProduct.background_images,
        personalization: personalizedMessages[selectedProduct._id],
        size: selectedSize,
      };
      addToCart(itemToAdd as any);
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(true);
    }
  };

  const handleGoToCart = () => {
    closeModals();
    router.push('/cart');
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;

    try {
      setProcessing(true);
      const orderSpecification =
        selectedSize && selectedProduct.specification?.[0]?.name
          ? [
              {
                name: selectedProduct.specification[0].name,
                values: [
                  {
                    value: selectedSize,
                    price: selectedSpecPrice,
                  },
                ],
              },
            ]
          : null;

      const orderData = {
        cart_details: [
          {
            product_id: selectedProduct._id,
            quantity: quantity,
            personalized: personalizedMessages[selectedProduct._id] || null,
            specification: orderSpecification,
          },
        ],
      };

      const orderResponse = await placeOrder(orderData);
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to place order');
      }

      localStorage.setItem('order_id', orderResponse.data.order_id);
      localStorage.setItem('payment_id', orderResponse.data.payment_id);
      const orderId = orderResponse.data.order_id;

      if (orderResponse.data.payment_type === 'free') {
        const confirmResponse = await confirmOrder(
          orderId,
          orderResponse.data.payment_id
        );
        if (confirmResponse && confirmResponse.success) {
          removeFromCart(selectedProduct._id);
          const currentPersonalizations = { ...personalizedMessages };
          delete currentPersonalizations[selectedProduct._id];
          localStorage.setItem(
            'selectedPersonalizedMessages',
            JSON.stringify(currentPersonalizations)
          );
          setPersonalizedMessages(currentPersonalizations);
          closeModals();
          router.push('/thankyou');
        } else {
          throw new Error(
            confirmResponse?.message || 'Order confirmation failed'
          );
        }
        return;
      }

      const finalProductPrice = selectedProduct.price + selectedSpecPrice;
      const totalAmountForPayment = finalProductPrice * quantity * 1.17;
      const orderDate = new Date().toISOString().split('T')[0];

      const merchantId = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID;
      const securedKey = process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY;
      const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Your Store';

      if (!merchantId || !securedKey) {
        throw new Error('PayFast merchant details are not configured.');
      }

      const tokenResponse = await fetch(
        `/api/payfast?merchant_id=${merchantId}&secured_key=${securedKey}`
      );
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch PayFast token');
      }
      const tokenData = await tokenResponse.json();
      const token = tokenData.ACCESS_TOKEN;
      if (!token) throw new Error('Invalid token received from PayFast');

      const generateSignature = (merchantIdSig: string): string => {
        const timestamp = new Date().getTime();
        return `SIG-${merchantIdSig}-${timestamp}`;
      };

      const formData: Record<string, string> = {
        MERCHANT_ID: merchantId,
        MERCHANT_NAME: storeName,
        TOKEN: token,
        PROCCODE: '00',
        TXNAMT: totalAmountForPayment.toFixed(2),
        CUSTOMER_MOBILE_NO: '03000000000',
        CUSTOMER_EMAIL_ADDRESS: 'customer@example.com',
        SIGNATURE: generateSignature(merchantId),
        VERSION: 'PYMT_WEB_DI_1.0',
        TXNDESC: `Order ${orderId} - ${selectedProduct.name}`,
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
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(
        error.message || 'An unexpected error occurred during checkout.'
      );
      setProcessing(false);
    }
  };

  const closeModals = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedSize('M');
    setSelectedSpecPrice(0);
    setCurrentImageIndex(0);
    setProcessing(false);
  };

  const getModalLeftPanelStyle = () => {
    const type = selectedProduct?.category_id?.type ?? 1;
    const { image: imageName } = getCategoryBackground(type);
    const imageUrl = `/images/model-bg/${imageName}`;
    return {
      backgroundImage: `url('${imageUrl}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  };

  const fetchPageSubCategoryInfo = async () => {
    try {
      const response = await fetchSubCategoryList();
      if (response.success && Array.isArray(response.data)) {
        const currentSubCategory = response.data.find(
          (sc: any) =>
            sc.name.toLowerCase().replace(/\s+/g, '-') === subcategorySlug ||
            sc.name.toLowerCase().replace(/\s+/g, '') === subcategorySlug
        );

        if (currentSubCategory) {
          setSubCategoryId(currentSubCategory._id);
          setPageCategoryInfo({
            _id: currentSubCategory.category_id._id,
            name: currentSubCategory.category_id.name,
            type: currentSubCategory.category_id.type ?? 1,
          });
          fetchData(currentSubCategory._id);
        } else {
          setError('Subcategory not found.');
          setLoading(false);
          setBrandsLoading(false);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch subcategories.');
      }
    } catch (err: any) {
      console.error('Error fetching subcategory details:', err);
      setError(err.message || 'Error fetching subcategory details.');
      setLoading(false);
      setBrandsLoading(false);
    }
  };

  useEffect(() => {
    if (subcategorySlug) {
      fetchPageSubCategoryInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subcategorySlug]);

  const fetchData = async (currentSubId: string) => {
    setLoading(true);
    setBrandsLoading(true);
    setError(null);
    try {
      const companiesResponse = await fetchCompanyList();
      if (companiesResponse.success && Array.isArray(companiesResponse.data)) {
        const filteredCompanies = companiesResponse.data.filter(
          (company: Company) =>
            company.subcategory_ids.some((sc) => sc._id === currentSubId)
        );
        setBrands(filteredCompanies);

        if (filteredCompanies.length > 0) {
          const productPromises = filteredCompanies.map(
            (company: { _id: string }) => fetchProductDetails(company._id)
          );
          const productResponses = await Promise.all(productPromises);

          let allFetchedProducts: Product[] = [];
          productResponses.forEach((res) => {
            if (res.success && Array.isArray(res.data)) {
              allFetchedProducts = [...allFetchedProducts, ...res.data];
            }
          });

          const featured = allFetchedProducts.filter(
            (p) => p.is_featured && p.subcategory_id === currentSubId
          );
          setFeaturedProducts(featured);
        } else {
          setFeaturedProducts([]);
        }
      } else {
        setError(companiesResponse.message || 'Failed to fetch companies.');
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
      setBrandsLoading(false);
    }
  };

  const handleBrandClick = (
    brandname: string,
    brandLogo: string,
    brandId: string
  ) => {
    const slug = brandname.toLowerCase().replace(/\s+/g, '');
    sessionStorage.setItem('brandLogo', brandLogo); // Store path as is
    router.push(`/subcategory/${subcategorySlug}/${slug}/${brandId}`);
  };

  const handleReviewsClick = (productId: string | undefined) => {
    if (productId) {
      router.push(`/reviews/${productId}`);
    } else {
      toast.warn('Cannot view reviews for this product.');
    }
  };

  const getCardBackgroundStyle = () => {
    const type = pageCategoryInfo?.type ?? 1;
    const { color } = getCategoryBackground(type);
    return { backgroundColor: color };
  };

  const decodedSubcategoryName =
    typeof subcategorySlug === 'string'
      ? unslugify(decodeURIComponent(subcategorySlug as string))
          // .replace(/-/g, ' ')
          // .replace(/\b\w/g, (l) => l.toUpperCase())
      : 'Subcategory';

  return (
    <div className="at-categories">
      {error && (
        <p className="error-message text-center text-red-600 py-6">{error}</p>
      )}
      <>
        <div className="at-pagesectiontitle mb-6 border-b pb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {decodedSubcategoryName}
          </h1>
        </div>

        <div className="at-pagesectiontitle">
          <h2>Shop by Brands</h2>
        </div>
        <div className="at-categoriesgrid">
          {brandsLoading &&
            Array.from({ length: 6 }).map((_, brandindex) => (
              <div className="at-branditem" key={`brandskel-${brandindex}`}>
                <Skeleton className="h-20 w-full px-8 bg-gray-200 rounded-lg" />
              </div>
            ))}
          {!brandsLoading && !error && brands.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-4">
              No brands available for this subcategory.
            </p>
          )}
          {!brandsLoading &&
            brands.length > 0 &&
            brands.map((brand) => (
              <div
                key={brand._id}
                className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  handleBrandClick(brand.name, brand.company_logo, brand._id);
                }}
              >
                <img
                  src={brand.company_logo || PRODUCT_PLACEHOLDER} // Use directly
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
                  }}
                />
              </div>
            ))}
        </div>

        <div className="at-giftcard mt-8">
          <div className="at-pagesectiontitle">
            <h2>Featured Products</h2>
          </div>
          <div className="at-cardgrid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
            {loading && (
              <>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    className="at-carditem rounded-lg overflow-hidden bg-white shadow-md"
                    key={`prodskel-${index}`}
                  >
                    <Skeleton className="h-40 w-full bg-gray-200" />
                    <div className="p-3">
                      <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200" />
                      <Skeleton className="h-4 w-1/2 bg-gray-200" />
                    </div>
                  </div>
                ))}
              </>
            )}
            {!loading && !error && featuredProducts.length === 0 && (
              <p className="col-span-full text-center text-gray-500 py-6">
                No featured products available.
              </p>
            )}
            {!loading &&
              !error &&
              featuredProducts.map((product) => {
                const brand = brands.find((b) => b._id === product.company_id);
                const displayImage = product.sticker_path;

                return (
                  <div
                    className="at-carditem cursor-pointer"
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                  >
                    <figure
                      className="at-giftimage flex-shrink-0 relative h-40"
                      style={getCardBackgroundStyle()}
                    >
                      <img
                        src={displayImage || PRODUCT_PLACEHOLDER} // Use directly
                        alt={product.name || 'Product Image'}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            PRODUCT_PLACEHOLDER;
                        }}
                        className="w-full h-full object-contain p-2"
                      />
                    </figure>
                    <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
                      <div className="at-gifttitle flex items-center justify-between w-full mb-1">
                        <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 truncate flex-1 mr-2">
                          {product.name || 'Product'}
                        </h3>
                        <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
                          PKR {product.price}
                        </span>
                      </div>
                      {brand?.name ? (
                        <h4 className="font-semibold text-xs text-gray-600 truncate">
                          {brand.name}
                        </h4>
                      ) : (
                        <h4 className="font-semibold text-xs text-gray-400 truncate italic">
                          {/* Brand not specified */}
                        </h4>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* --- Modals (copied and adapted from pricefilter/page.tsx) --- */}
        {/* First Modal (Product Details) */}
        {isFirstModalOpen && selectedProduct && (
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
                    {/* SVG close icon */}
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_252_1556)"><path d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z" fill="#434343"/><path d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z" fill="#434343"/><path d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z" fill="#434343"/></g><defs><clipPath id="clip0_252_1556"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                  </button>
                  <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
                    {selectedProduct.background_images &&
                    selectedProduct.background_images.length > 0 ? (
                      <>
                        <img
                          src={ // MODIFIED HERE
                            // selectedProduct.background_images[currentImageIndex]
                            selectedProduct.background_images[currentImageIndex] || PRODUCT_PLACEHOLDER
                          }
                          alt={`${selectedProduct.name} - image ${
                            currentImageIndex + 1
                          }`}
                          className="object-contain w-full h-full "
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              PRODUCT_PLACEHOLDER;
                          }}
                        />
                        {selectedProduct.background_images.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
                            {selectedProduct.background_images.map(
                              (_, index) => (
                                <button
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentImageIndex(index);
                                  }}
                                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                    currentImageIndex === index
                                      ? 'bg-white'
                                      : 'bg-gray-300 hover:bg-gray-100'
                                  }`}
                                  aria-label={`View image ${index + 1}`}
                                />
                              )
                            )}
                          </div>
                        )}
                      </>
                     ) : (
                      <img
                        src={PRODUCT_PLACEHOLDER}
                        alt={selectedProduct.name}
                        className="object-contain w-full h-full"
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
                            selectedProduct.company_id?.company_logo ||
                            PRODUCT_PLACEHOLDER
                          }
                          alt={`${
                            selectedProduct.company_id?.name || 'Brand'
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
                        onClick={() => handleReviewsClick(selectedProduct._id)}
                        title="View Reviews"
                      >
                        <h4 className="font-semibold text-lg text-gray-800">
                          {selectedProduct.company_id?.name || 'Brand Name'}
                        </h4>
                        <div className="flex justify-start items-center">
                          <RatingStars
                            rating={Math.round(selectedProduct.total_rating)}
                          />
                          <p className="ml-1 text-sm text-gray-600">
                            ({Math.round(selectedProduct.total_rating)})
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="at-popupcolorprice flex justify-between items-start my-3">
                      <div className="at-popupcolor flex-grow mr-4">
                        <h3 className="font-bold text-xl text-gray-900">
                          {selectedProduct.name}
                        </h3>
                      </div>
                      <div className="at-popupprice flex-shrink-0">
                        <h3 className="font-bold text-xl text-[#40A574]">
                          Rs. {selectedProduct.price + selectedSpecPrice}
                        </h3>
                      </div>
                    </div>

                    <div className="at-popupdescription mb-4">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {selectedProduct.specification &&
                      selectedProduct.specification.length > 0 &&
                      selectedProduct.specification[0].values.length > 0 && (
                        <div className="at-productsize mb-4">
                          <label className="block text-base font-medium text-gray-700 mb-1">
                            {selectedProduct.specification[0].name || 'Options'}
                          </label>
                          <div className="overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-2">
                            {selectedProduct.specification[0].values.map(
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
                    {isInCart(selectedProduct._id) ? (
                      <button onClick={handleGoToCart} className="at-btn">
                        Go to Cart
                        {/* SVG icon */}
                        <svg className="mt-3" width="24" height="24" viewBox="0 0 32 32" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="white" /><path d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z" fill="#40A574" /></svg>
                      </button>
                    ) : (
                      <button onClick={handleAddToCart} className="at-btn">
                        Add to Cart
                        {/* SVG icon */}
                        <svg className="mt-3" width="24" height="24" viewBox="0 0 32 32" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="white" /><path d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z" fill="#40A574" /></svg>
                      </button>
                    )}
                    <button
                      className="at-btn at-btnpersonal"
                      onClick={() => handlePersonalize(selectedProduct._id)}
                    >
                      Personalize
                      <label className="custom-checkbox top-2">
                        <input
                          className="align-middle"
                          type="checkbox"
                          checked={hasPersonalization(selectedProduct._id)}
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

        {/* Second Modal (Order Summary) */}
        {isSecondModalOpen && selectedProduct && (
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
                    {/* SVG close icon */}
                     <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_252_1556)"><path d="M16 32C7.17725 32 0 24.8228 0 16C0 7.17725 7.17725 0 16 0C24.8228 0 32 7.17725 32 16C32 24.8228 24.8228 32 16 32ZM16 2C8.28003 2 2 8.28003 2 16C2 23.72 8.28003 30 16 30C23.72 30 30 23.72 30 16C30 8.28003 23.72 2 16 2Z" fill="#434343"/><path d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z" fill="#434343"/><path d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z" fill="#434343"/></g><defs><clipPath id="clip0_252_1556"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                  </button>
                  <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
                    <img
                      src={ // MODIFIED HERE
                        (selectedProduct.background_images && selectedProduct.background_images.length > currentImageIndex
                          ? selectedProduct.background_images[currentImageIndex]
                          : selectedProduct.background_images?.[0]) || PRODUCT_PLACEHOLDER
                      }
                      alt={selectedProduct.name}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          PRODUCT_PLACEHOLDER;
                      }}
                    />
                  </figure>
                </div>
                <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
                  <div>
                    <div className="at-popuptitlebrandimg at-modaltitleqnty mb-4">
                      <div className="at-popupproducttitlerating at-ordersummerytitlearea flex-grow">
                        <h4 className="font-bold text-lg text-gray-800">
                          {selectedProduct.name}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {selectedProduct.description}
                        </p>
                      </div>
                      <div className="at-orderquntatiy flex-shrink-0 ml-4">
                        <div className="at-btnquntatiyholder flex items-center border rounded-md">
                          <button
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                            className="px-3 py-1 text-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-base text-gray-800">
                            {quantity}
                          </span>
                          <button
                            onClick={increaseQuantity}
                            className="px-3 py-1 text-lg font-medium text-gray-700 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="at-ordersummery border-t pt-4">
                      <h3 className="font-semibold text-md text-gray-800 mb-2">
                        Order Summary
                      </h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span>Item Price:</span>{' '}
                          <span>
                            Rs.{' '}
                            {(
                              selectedProduct.price + selectedSpecPrice
                            ).toFixed(2)}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Quantity:</span> <span>{quantity}</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Subtotal:</span>{' '}
                          <span>
                            Rs.{' '}
                            {(
                              (selectedProduct.price + selectedSpecPrice) *
                              quantity
                            ).toFixed(2)}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span>Sales Tax (17%):</span>{' '}
                          <span>
                            Rs.{' '}
                            {(
                              (selectedProduct.price + selectedSpecPrice) *
                              quantity *
                              0.17
                            ).toFixed(2)}
                          </span>
                        </li>
                        <li className="flex justify-between font-bold text-md mt-2 border-t pt-2">
                          <span>Grand Total:</span>{' '}
                          <span>
                            Rs.{' '}
                            {(
                              (selectedProduct.price + selectedSpecPrice) *
                              quantity *
                              1.17
                            ).toFixed(2)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder pt-5 mt-auto">
                    <button
                      type="button"
                      className="at-btn w-full mb-2"
                      onClick={handlePlaceOrder}
                      disabled={processing}
                    >
                      {processing ? 'Processing...' : 'Place Order'}
                    </button>
                    <button
                      type="button"
                      className="at-btn at-btncancel w-full"
                      onClick={() => router.push('/home')}
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default SubCategoryPage;

// // src/app/components/Product/sub_category_page.tsx
// 'use client';
// import React, { useEffect, useState, useCallback } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import {
//   fetchSubCategoryList,
//   fetchCompanyList,
//   fetchProductDetails, // This fetches products for a company
//   placeOrder,
//   confirmOrder,
// } from '@/services/api.service';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useCart } from '@/context/CartContext';
// import { toast } from 'react-toastify';
// import RatingStars from '../page-ui/rating_stars';
// import Link from 'next/link'; // Keep for "Continue Shopping" if not using router.push

// const PRODUCT_PLACEHOLDER = '/images/logoicons.png';
// const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''; // This might not be needed if paths are absolute/full

// // Define type-based background settings (copied from pricefilter)
// const getCategoryBackground = (type?: number) => {
//   switch (type) {
//     case 1:
//       return { image: 'pd_bg_1.jpg', color: '#FFD05E' }; // Yellow
//     case 2:
//       return { image: 'pd_bg_2.jpg', color: '#FF834B' }; // Orange
//     case 3:
//       return { image: 'pd_bg_3.jpg', color: '#88C1FD' }; // Blue
//     case 4:
//       return { image: 'pd_bg_4.jpg', color: '#40A574' }; // Green
//     default:
//       // Fallback to type 1 style if type is undefined or not matched
//       return { image: 'pd_bg_1.jpg', color: '#D6D6DA' }; // Default fallback (Yellow in pricefilter, grey here)
//   }
// };

// const slugify = (str: string) =>
//   str
//     .toLowerCase()
//     .trim()
//     .replace(/&/g, 'and')
//     .replace(/[^\w\s-]/g, '')
//     .replace(/\s+/g, '-')
//     .replace(/-+/g, '-');

// const unslugify = (slug: string) => {
//   return slug
//     .replace(/-/g, ' ')
//     .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
//     .replace(/ And /gi, ' & '); // Replace 'and' with '&'
// };

// // Interfaces based on pricefilter/page.tsx for modal consistency
// interface CompanyForModal {
//   _id: string;
//   name: string;
//   company_logo: string; // Should be a full URL or resolvable path
// }

// interface CategoryInfoForModal {
//   _id: string;
//   name: string;
//   type: number;
// }

// interface ProductForModal {
//   _id: string;
//   name: string;
//   price: number;
//   description: string;
//   company_id: CompanyForModal;
//   category_id: CategoryInfoForModal;
//   background_images: string[]; // Array of full URLs or resolvable paths
//   sticker_path?: string; // Full URL or resolvable path
//   image_path?: string; // Full URL or resolvable path
//   specification: Array<{
//     name: string;
//     type: string;
//     values: Array<{
//       value: string;
//       additional_info?: string;
//       price: number; // Additional price for this spec value
//       _id: string;
//     }>;
//   }>;
//   total_rating: number;
//   rating_count: number;
// }

// interface PersonalizedMessage {
//   name: string;
//   message: string;
//   image_path: string;
//   image_id: string;
//   productId?: string;
// }

// // Original interfaces for SubCategoryPage data fetching
// interface Company {
//   _id: string;
//   name: string;
//   company_logo: string; // relative path (or absolute/full if used directly)
//   subcategory_ids: Array<{
//     _id: string;
//     name: string;
//     category_id: string;
//   }>;
// }

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   image_path: string; // relative path (or absolute/full if used directly)
//   sticker_path: string; // relative path (or absolute/full if used directly)
//   description: string;
//   company_id: string; // ID of company
//   subcategory_id: string;
//   background_image: string; // A single string, potentially comma-separated paths
//   is_featured: boolean;
//   total_rating: number;
//   // Optional fields that might come from API or need defaults
//   rating_count?: number;
//   // An array of strings, where each string could also be comma-separated
//   product_background_images?: string[];
//   specification?: ProductForModal['specification']; // If API provides it
// }

// // For category info of the current subcategory page
// interface PageCategoryInfo {
//   _id: string;
//   name: string;
//   type?: number; // This is the 'type' for background styling
// }

// const SubCategoryPage = () => {
//   const router = useRouter();
//   const params = useParams();
//   const { subcategory: subcategorySlug } = params;

//   const [brands, setBrands] = useState<Company[]>([]);
//   // const [products, setProducts] = useState<Product[]>([]); // All products, if needed beyond featured
//   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
//   const [brandsLoading, setBrandsLoading] = useState<boolean>(true);
//   const [pageCategoryInfo, setPageCategoryInfo] =
//     useState<PageCategoryInfo | null>(null);

//   // --- Modal States (mirroring pricefilter) ---
//   const [processing, setProcessing] = useState(false);
//   const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
//   const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] =
//     useState<ProductForModal | null>(null);
//   // selectedProductCategoryInfo will be derived from selectedProduct.category_id for modal styling
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState<string>('M'); // Default size/spec
//   const [selectedSpecPrice, setSelectedSpecPrice] = useState<number>(0);
//   const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

//   const cartContext = useCart();
//   const cartItems = cartContext?.cartItems ?? [];
//   const addToCart =
//     cartContext?.addToCart ??
//     (() => {
//       toast.error('Cart functionality is not available.');
//       console.error('addToCart not available');
//     });
//   const removeFromCart =
//     cartContext?.removeFromCart ??
//     (() => {
//       toast.error('Cart functionality is not available.');
//       console.error('removeFromCart not available');
//     });

//   const decreaseQuantity = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };
//   const increaseQuantity = () => {
//     setQuantity(quantity + 1);
//   };
//   const isInCart = (productId: string) =>
//     cartItems.some((item) => item._id === productId);

//   const [personalizedMessages, setPersonalizedMessages] = useState<{
//     [key: string]: PersonalizedMessage | undefined;
//   }>({});

//   const loadPersonalizedMessages = useCallback(() => {
//     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
//     try {
//       const messages = storedMessages ? JSON.parse(storedMessages) : {};
//       setPersonalizedMessages(
//         messages && typeof messages === 'object' && !Array.isArray(messages)
//           ? messages
//           : {}
//       );
//     } catch (error) {
//       console.error('Error parsing personalized messages:', error);
//       setPersonalizedMessages({});
//     }
//   }, []);

//   useEffect(() => {
//     loadPersonalizedMessages();
//     const handleStorageChange = (event: StorageEvent) => {
//       if (event.key === 'selectedPersonalizedMessages') {
//         loadPersonalizedMessages();
//       }
//     };
//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, [loadPersonalizedMessages]);

//   const hasPersonalization = (productId: string) =>
//     !!personalizedMessages[productId];

//   const handlePersonalize = (productId: string) => {
//     localStorage.setItem('currentItemId', productId);
//     localStorage.setItem(
//       'returnPath',
//       window.location.pathname + window.location.search
//     ); // Current page
//     router.push('/messages');
//   };

//   const handleProductClick = (product: Product) => {
//     const companyData = brands.find((b) => b._id === product.company_id);

//     let PFGalleryImages: string[] = [];

//     // Helper to split comma-separated strings and trim, then prefix with BASE_URL if needed
//     const processImageString = (imgStr: string): string[] => {
//       return imgStr
//         .split(',')
//         .map((s) => s.trim())
//         .filter(Boolean)
//         .map((p) =>
//           BASE_URL && !p.startsWith('http') && !p.startsWith('/')
//             ? BASE_URL + p
//             : p
//         ); // Add BASE_URL if path is relative and not already prefixed
//     };

//     // Try product_background_images (array) first
//     if (
//       Array.isArray(product.product_background_images) &&
//       product.product_background_images.length > 0
//     ) {
//       product.product_background_images.forEach((entry) => {
//         if (entry && typeof entry === 'string') {
//           PFGalleryImages.push(...processImageString(entry));
//         }
//       });
//     }

//     // If PFGalleryImages is still empty, try product.background_image (singular string)
//     if (
//       PFGalleryImages.length === 0 &&
//       product.background_image &&
//       typeof product.background_image === 'string'
//     ) {
//       PFGalleryImages.push(...processImageString(product.background_image));
//     }

//     // If PFGalleryImages is still empty, try product.image_path (singular string) as another fallback
//     if (
//       PFGalleryImages.length === 0 &&
//       product.image_path &&
//       typeof product.image_path === 'string'
//     ) {
//       PFGalleryImages.push(...processImageString(product.image_path));
//     }

//     // Ensure unique images and filter out any empty strings again after all processing
//     PFGalleryImages = [...new Set(PFGalleryImages.filter(Boolean))];

//     // If still no images after all attempts, use placeholder
//     if (PFGalleryImages.length === 0) {
//       PFGalleryImages.push(PRODUCT_PLACEHOLDER);
//     }

//     const productForModal: ProductForModal = {
//       _id: product._id,
//       name: product.name || 'Unnamed Product',
//       price: product.price,
//       description: product.description || 'No description available.',
//       company_id: {
//         _id: companyData?._id || `company-default-${product._id}`,
//         name: companyData?.name || 'Brand Unavailable',
//         company_logo: companyData?.company_logo // Assumed to be full/absolute path
//           ? `${companyData.company_logo}`
//           : PRODUCT_PLACEHOLDER,
//       },
//       category_id: {
//         _id: pageCategoryInfo?._id || 'cat-default-id',
//         name: pageCategoryInfo?.name || 'Category Unavailable',
//         type: pageCategoryInfo?.type ?? 1, // Default to type 1 if not set
//       },
//       background_images: PFGalleryImages,
//       sticker_path: product.sticker_path // Assumed to be full/absolute path
//         ? `${product.sticker_path}`
//         : undefined,
//       image_path: product.image_path // Assumed to be full/absolute path
//         ? `${product.image_path}` // Will be just one if not comma separated after processing above
//         : undefined,
//       specification: product.specification || [
//         // Default specification
//         {
//           name: 'Size',
//           type: 'button',
//           values: [
//             { value: 'M', price: 0, _id: `spec-default-${product._id}-m` },
//           ],
//         },
//       ],
//       total_rating: Number(product.total_rating) || 0,
//       rating_count: Number(product.rating_count) || 0,
//     };

//     const firstSpecGroup = productForModal.specification?.[0];
//     const initialSpecValue = firstSpecGroup?.values?.[0]?.value || 'M';
//     const rawInitialSpecPrice = firstSpecGroup?.values?.[0]?.price;
//     const initialSpecPrice = Number(rawInitialSpecPrice);

//     setSelectedProduct(productForModal);
//     setQuantity(1);
//     setSelectedSize(initialSpecValue);
//     setSelectedSpecPrice(isNaN(initialSpecPrice) ? 0 : initialSpecPrice);
//     setCurrentImageIndex(0);
//     setIsFirstModalOpen(true);
//   };

//   const handleAddToCart = () => {
//     if (selectedProduct && cartContext) {
//       const itemToAdd = {
//         _id: selectedProduct._id,
//         price: selectedProduct.price + selectedSpecPrice, // Combined price
//         quantity,
//         image_path:
//           selectedProduct.background_images?.[0] || PRODUCT_PLACEHOLDER, // Use first background image
//         sticker_path: selectedProduct.sticker_path,
//         name: selectedProduct.name,
//         description: selectedProduct.description,
//         company_id: selectedProduct.company_id,
//         category_id: selectedProduct.category_id,
//         background_images: selectedProduct.background_images,
//         personalization: personalizedMessages[selectedProduct._id],
//         size: selectedSize,
//       };
//       addToCart(itemToAdd as any);
//       setIsFirstModalOpen(false);
//       setIsSecondModalOpen(true);
//     }
//   };

//   const handleGoToCart = () => {
//     closeModals();
//     router.push('/cart');
//   };

//   const handlePlaceOrder = async () => {
//     if (!selectedProduct) return;

//     try {
//       setProcessing(true);
//       const orderSpecification =
//         selectedSize && selectedProduct.specification?.[0]?.name
//           ? [
//               {
//                 name: selectedProduct.specification[0].name,
//                 values: [
//                   {
//                     value: selectedSize,
//                     price: selectedSpecPrice,
//                   },
//                 ],
//               },
//             ]
//           : null;

//       const orderData = {
//         cart_details: [
//           {
//             product_id: selectedProduct._id,
//             quantity: quantity,
//             personalized: personalizedMessages[selectedProduct._id] || null,
//             specification: orderSpecification,
//           },
//         ],
//       };

//       const orderResponse = await placeOrder(orderData);
//       if (!orderResponse.success) {
//         throw new Error(orderResponse.message || 'Failed to place order');
//       }

//       localStorage.setItem('order_id', orderResponse.data.order_id);
//       localStorage.setItem('payment_id', orderResponse.data.payment_id);
//       const orderId = orderResponse.data.order_id;

//       if (orderResponse.data.payment_type === 'free') {
//         const confirmResponse = await confirmOrder(
//           orderId,
//           orderResponse.data.payment_id
//         );
//         if (confirmResponse && confirmResponse.success) {
//           removeFromCart(selectedProduct._id);
//           const currentPersonalizations = { ...personalizedMessages };
//           delete currentPersonalizations[selectedProduct._id];
//           localStorage.setItem(
//             'selectedPersonalizedMessages',
//             JSON.stringify(currentPersonalizations)
//           );
//           setPersonalizedMessages(currentPersonalizations);
//           closeModals();
//           router.push('/thankyou');
//         } else {
//           throw new Error(
//             confirmResponse?.message || 'Order confirmation failed'
//           );
//         }
//         return;
//       }

//       const finalProductPrice = selectedProduct.price + selectedSpecPrice;
//       const totalAmountForPayment = finalProductPrice * quantity * 1.17;
//       const orderDate = new Date().toISOString().split('T')[0];

//       const merchantId = process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID;
//       const securedKey = process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY;
//       const storeName = process.env.NEXT_PUBLIC_STORE_NAME || 'Your Store';

//       if (!merchantId || !securedKey) {
//         throw new Error('PayFast merchant details are not configured.');
//       }

//       const tokenResponse = await fetch(
//         `/api/payfast?merchant_id=${merchantId}&secured_key=${securedKey}`
//       );
//       if (!tokenResponse.ok) {
//         const errorData = await tokenResponse.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Failed to fetch PayFast token');
//       }
//       const tokenData = await tokenResponse.json();
//       const token = tokenData.ACCESS_TOKEN;
//       if (!token) throw new Error('Invalid token received from PayFast');

//       const generateSignature = (merchantIdSig: string): string => {
//         const timestamp = new Date().getTime();
//         return `SIG-${merchantIdSig}-${timestamp}`;
//       };

//       const formData: Record<string, string> = {
//         MERCHANT_ID: merchantId,
//         MERCHANT_NAME: storeName,
//         TOKEN: token,
//         PROCCODE: '00',
//         TXNAMT: totalAmountForPayment.toFixed(2),
//         CUSTOMER_MOBILE_NO: '03000000000',
//         CUSTOMER_EMAIL_ADDRESS: 'customer@example.com',
//         SIGNATURE: generateSignature(merchantId),
//         VERSION: 'PYMT_WEB_DI_1.0',
//         TXNDESC: `Order ${orderId} - ${selectedProduct.name}`,
//         SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
//         FAILURE_URL: `${window.location.origin}/failure?order_id=${orderId}`,
//         BASKET_ID: orderId,
//         ORDER_DATE: orderDate,
//         CHECKOUT_URL: `${window.location.origin}/confirm?order_id=${orderId}`,
//       };

//       const form = document.createElement('form');
//       form.method = 'POST';
//       form.action =
//         'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction';
//       form.style.display = 'none';
//       Object.entries(formData).forEach(([key, value]) => {
//         const input = document.createElement('input');
//         input.type = 'hidden';
//         input.name = key;
//         input.value = value;
//         form.appendChild(input);
//       });
//       document.body.appendChild(form);
//       form.submit();
//       document.body.removeChild(form);
//     } catch (error: any) {
//       console.error('Order placement error:', error);
//       toast.error(
//         error.message || 'An unexpected error occurred during checkout.'
//       );
//       setProcessing(false);
//     }
//   };

//   const closeModals = () => {
//     setIsFirstModalOpen(false);
//     setIsSecondModalOpen(false);
//     setSelectedProduct(null);
//     setQuantity(1);
//     setSelectedSize('M');
//     setSelectedSpecPrice(0);
//     setCurrentImageIndex(0);
//     setProcessing(false);
//   };

//   const getModalLeftPanelStyle = () => {
//     const type = selectedProduct?.category_id?.type ?? 1;
//     const { image: imageName } = getCategoryBackground(type);
//     const imageUrl = `/images/model-bg/${imageName}`;
//     return {
//       backgroundImage: `url('${imageUrl}')`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//     };
//   };

//   const fetchPageSubCategoryInfo = async () => {
//     try {
//       const response = await fetchSubCategoryList();
//       if (response.success && Array.isArray(response.data)) {
//         const currentSubCategory = response.data.find(
//           (sc: any) =>
//             slugify(sc.name || '') === subcategorySlug || sc.name.toLowerCase()
//         );

//         if (currentSubCategory) {
//           setSubCategoryId(currentSubCategory._id);
//           setPageCategoryInfo({
//             _id: currentSubCategory.category_id._id,
//             name: currentSubCategory.category_id.name,
//             type: currentSubCategory.category_id.type ?? 1,
//           });
//           fetchData(currentSubCategory._id);
//         } else {
//           setError('Subcategory not found.');
//           setLoading(false);
//           setBrandsLoading(false);
//         }
//       } else {
//         throw new Error(response.message || 'Failed to fetch subcategories.');
//       }
//     } catch (err: any) {
//       console.error('Error fetching subcategory details:', err);
//       setError(err.message || 'Error fetching subcategory details.');
//       setLoading(false);
//       setBrandsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (subcategorySlug) {
//       fetchPageSubCategoryInfo();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [subcategorySlug]);

//   const fetchData = async (currentSubId: string) => {
//     setLoading(true);
//     setBrandsLoading(true);
//     setError(null);
//     try {
//       const companiesResponse = await fetchCompanyList();
//       if (companiesResponse.success && Array.isArray(companiesResponse.data)) {
//         const filteredCompanies = companiesResponse.data.filter(
//           (company: Company) =>
//             company.subcategory_ids.some((sc) => sc._id === currentSubId)
//         );
//         setBrands(filteredCompanies);

//         if (filteredCompanies.length > 0) {
//           const productPromises = filteredCompanies.map(
//             (company: { _id: string }) => fetchProductDetails(company._id)
//           );
//           const productResponses = await Promise.all(productPromises);

//           let allFetchedProducts: Product[] = [];
//           productResponses.forEach((res) => {
//             if (res.success && Array.isArray(res.data)) {
//               allFetchedProducts = [...allFetchedProducts, ...res.data];
//             }
//           });

//           const featured = allFetchedProducts.filter(
//             (p) => p.is_featured && p.subcategory_id === currentSubId
//           );
//           setFeaturedProducts(featured);
//         } else {
//           setFeaturedProducts([]);
//         }
//       } else {
//         setError(companiesResponse.message || 'Failed to fetch companies.');
//       }
//     } catch (err: any) {
//       console.error('Error fetching data:', err);
//       setError(err.message || 'An error occurred while fetching data.');
//     } finally {
//       setLoading(false);
//       setBrandsLoading(false);
//     }
//   };

//   const handleBrandClick = (
//     brandname: string,
//     brandLogo: string,
//     brandId: string
//   ) => {
//     const slug = slugify(brandname);
//     sessionStorage.setItem('brandLogo', brandLogo); // Store path as is
//     router.push(`/subcategory/${subcategorySlug}/${slug}/${brandId}`);
//   };

//   const handleReviewsClick = (productId: string | undefined) => {
//     if (productId) {
//       router.push(`/reviews/${productId}`);
//     } else {
//       toast.warn('Cannot view reviews for this product.');
//     }
//   };

//   const getCardBackgroundStyle = () => {
//     const type = pageCategoryInfo?.type ?? 1;
//     const { color } = getCategoryBackground(type);
//     return { backgroundColor: color };
//   };

//   const decodedSubcategoryName =
//     typeof subcategorySlug === 'string'
//       ? unslugify(decodeURIComponent(subcategorySlug))
//       : 'Subcategory';

//   return (
//     <div className="at-categories">
//       {error && (
//         <p className="error-message text-center text-red-600 py-6">{error}</p>
//       )}
//       <>
//         <div className="at-pagesectiontitle mb-6 border-b pb-3">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//             {decodedSubcategoryName}
//           </h1>
//         </div>

//         <div className="at-pagesectiontitle">
//           <h2>Shop by Brands</h2>
//         </div>
//         <div className="at-categoriesgrid">
//           {brandsLoading &&
//             Array.from({ length: 6 }).map((_, brandindex) => (
//               <div className="at-branditem" key={`brandskel-${brandindex}`}>
//                 <Skeleton className="h-20 w-full px-8 bg-gray-200 rounded-lg" />
//               </div>
//             ))}
//           {!brandsLoading && !error && brands.length === 0 && (
//             <p className="col-span-full text-center text-gray-500 py-4">
//               No brands available for this subcategory.
//             </p>
//           )}
//           {!brandsLoading &&
//             brands.length > 0 &&
//             brands.map((brand) => (
//               <div
//                 key={brand._id}
//                 className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   handleBrandClick(unslugify(brand.name), brand.company_logo, brand._id);
//                 }}
//               >
//                 <img
//                   src={brand.company_logo || PRODUCT_PLACEHOLDER} // Use directly
//                   alt={unslugify(brand.name)}
//                   className="max-h-full max-w-full object-contain"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
//                   }}
//                 />
//               </div>
//             ))}
//         </div>

//         <div className="at-giftcard mt-8">
//           <div className="at-pagesectiontitle">
//             <h2>Featured Products</h2>
//           </div>
//           <div className="at-cardgrid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
//             {loading && (
//               <>
//                 {Array.from({ length: 8 }).map((_, index) => (
//                   <div
//                     className="at-carditem rounded-lg overflow-hidden bg-white shadow-md"
//                     key={`prodskel-${index}`}
//                   >
//                     <Skeleton className="h-40 w-full bg-gray-200" />
//                     <div className="p-3">
//                       <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200" />
//                       <Skeleton className="h-4 w-1/2 bg-gray-200" />
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}
//             {!loading && !error && featuredProducts.length === 0 && (
//               <p className="col-span-full text-center text-gray-500 py-6">
//                 No featured products available.
//               </p>
//             )}
//             {!loading &&
//               !error &&
//               featuredProducts.map((product) => {
//                 const brand = brands.find((b) => b._id === product.company_id);
//                 const displayImage = product.sticker_path;

//                 return (
//                   <div
//                     className="at-carditem cursor-pointer"
//                     key={product._id}
//                     onClick={() => handleProductClick(product)}
//                   >
//                     <figure
//                       className="at-giftimage flex-shrink-0 relative h-40"
//                       style={getCardBackgroundStyle()}
//                     >
//                       <img
//                         src={displayImage || PRODUCT_PLACEHOLDER} // Use directly
//                         alt={product.name || 'Product Image'}
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src =
//                             PRODUCT_PLACEHOLDER;
//                         }}
//                         className="w-full h-full object-contain p-2"
//                       />
//                     </figure>
//                     <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
//                       <div className="at-gifttitle flex items-center justify-between w-full mb-1">
//                         <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 truncate flex-1 mr-2">
//                           {product.name || 'Product'}
//                         </h3>
//                         <span className="text-right text-[#40A574] whitespace-nowrap font-bold text-sm">
//                           PKR {product.price}
//                         </span>
//                       </div>
//                       {brand?.name ? (
//                         <h4 className="font-semibold text-xs text-gray-600 truncate">
//                           {unslugify(brand.name)}
//                         </h4>
//                       ) : (
//                         <h4 className="font-semibold text-xs text-gray-400 truncate italic">
//                           {/* Brand not specified */}
//                         </h4>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>

//         {/* --- Modals (copied and adapted from pricefilter/page.tsx) --- */}
//         {/* First Modal (Product Details) */}
//         {isFirstModalOpen && selectedProduct && (
//           <div
//             className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
//             onClick={closeModals}
//           >
//             <div
//               className="bg-white rounded-lg shadow-lg at-modaldailouge"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex flex-col md:flex-row">
//                 <div
//                   className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
//                   style={getModalLeftPanelStyle()}
//                 >
//                   <button
//                     onClick={closeModals}
//                     className="at-btnpopupclose at-btnpopupclosetwo"
//                   >
//                     {/* SVG close icon */}
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
//                           d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
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
//                   <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
//                     <>
//                       <img
//                         src={
//                           // (selectedProduct.background_images && selectedProduct.background_images[currentImageIndex]) || PRODUCT_PLACEHOLDER
//                           selectedProduct.background_images[
//                             currentImageIndex
//                           ] || PRODUCT_PLACEHOLDER
//                         }
//                         alt={`${selectedProduct.name} - image ${
//                           currentImageIndex + 1
//                         }`}
//                         className="object-contain w-full h-full "
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src =
//                             PRODUCT_PLACEHOLDER;
//                         }}
//                       />
//                       {selectedProduct.background_images &&
//                         selectedProduct.background_images.length > 1 && (
//                           <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 p-1 bg-black bg-opacity-25 rounded-full">
//                             {selectedProduct.background_images.map(
//                               (_, index) => (
//                                 <button
//                                   key={index}
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     setCurrentImageIndex(index);
//                                   }}
//                                   className={`w-2.5 h-2.5 rounded-full transition-colors ${
//                                     currentImageIndex === index
//                                       ? 'bg-white'
//                                       : 'bg-gray-300 hover:bg-gray-100'
//                                   }`}
//                                   aria-label={`View image ${index + 1}`}
//                                 />
//                               )
//                             )}
//                           </div>
//                         )}
//                     </>
//                   </figure>
//                 </div>
//                 <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
//                   <div>
//                     <div className="at-popuptitlebrandimg flex items-start mb-3">
//                       <span className="w-12 h-12 mr-3 overflow-hidden flex-shrink-0">
//                         <img
//                           src={
//                             selectedProduct.company_id?.company_logo ||
//                             PRODUCT_PLACEHOLDER
//                           }
//                           alt={`${
//                             selectedProduct.company_id?.name || 'Brand'
//                           } logo`}
//                           className="w-full h-full object-contain"
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src =
//                               PRODUCT_PLACEHOLDER;
//                           }}
//                         />
//                       </span>
//                       <div
//                         className="at-popupproduct titlerating flex-grow cursor-pointer"
//                         onClick={() => handleReviewsClick(selectedProduct._id)}
//                         title="View Reviews"
//                       >
//                         <h4 className="font-semibold text-lg text-gray-800">
//                           {selectedProduct.company_id?.name || 'Brand Name'}
//                         </h4>
//                         <div className="flex justify-start items-center">
//                           <RatingStars
//                             rating={Math.round(selectedProduct.total_rating)}
//                           />
//                           <p className="ml-1 text-sm text-gray-600">
//                             ({Math.round(selectedProduct.total_rating)})
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="at-popupcolorprice flex justify-between items-start my-3">
//                       <div className="at-popupcolor flex-grow mr-4">
//                         <h3 className="font-bold text-xl text-gray-900">
//                           {selectedProduct.name}
//                         </h3>
//                       </div>
//                       <div className="at-popupprice flex-shrink-0">
//                         <h3 className="font-bold text-xl text-[#40A574]">
//                           Rs. {selectedProduct.price + selectedSpecPrice}
//                         </h3>
//                       </div>
//                     </div>

//                     <div className="at-popupdescription mb-4">
//                       <p className="text-sm text-gray-600 leading-relaxed">
//                         {selectedProduct.description}
//                       </p>
//                     </div>

//                     {selectedProduct.specification &&
//                       selectedProduct.specification.length > 0 &&
//                       selectedProduct.specification[0].values.length > 0 && (
//                         <div className="at-productsize mb-4">
//                           <label className="block text-base font-medium text-gray-700 mb-1">
//                             {selectedProduct.specification[0].name || 'Options'}
//                           </label>
//                           <div className="overflow-x-auto horizontal-scroll snap-x snap-mandatory flex gap-2">
//                             {selectedProduct.specification[0].values.map(
//                               (specValue) => {
//                                 const specPriceNum = Number(specValue.price);
//                                 const displaySpecPrice =
//                                   isNaN(specPriceNum) || specPriceNum === 0
//                                     ? ''
//                                     : ` (+${specPriceNum})`;
//                                 return (
//                                   <button
//                                     key={specValue._id || specValue.value}
//                                     onClick={() => {
//                                       setSelectedSize(specValue.value);
//                                       setSelectedSpecPrice(
//                                         isNaN(specPriceNum) ? 0 : specPriceNum
//                                       );
//                                     }}
//                                     className={`px-5 py-3 border rounded-full text-base transition-colors duration-150 ${
//                                       selectedSize === specValue.value
//                                         ? 'bg-[#40A574] text-white border-[#40A574]'
//                                         : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
//                                     }`}
//                                   >
//                                     {specValue.value}
//                                     {displaySpecPrice}
//                                   </button>
//                                 );
//                               }
//                             )}
//                           </div>
//                         </div>
//                       )}
//                   </div>

//                   <div className="at-btnaddtocart">
//                     {isInCart(selectedProduct._id) ? (
//                       <button onClick={handleGoToCart} className="at-btn">
//                         Go to Cart
//                         {/* SVG icon */}
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
//                         {/* SVG icon */}
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
//                       <label className="custom-checkbox top-2">
//                         <input
//                           className="align-middle"
//                           type="checkbox"
//                           checked={hasPersonalization(selectedProduct._id)}
//                           readOnly
//                         />
//                         <span className="checkmark"></span>
//                       </label>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Second Modal (Order Summary) */}
//         {isSecondModalOpen && selectedProduct && (
//           <div
//             className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
//             onClick={closeModals}
//           >
//             <div
//               className="bg-white rounded-lg shadow-lg at-modaldailouge"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex flex-col md:flex-row">
//                 <div
//                   className="at-modalleftside w-full md:w-[40%] flex-shrink-0 p-6 flex items-center justify-center relative"
//                   style={getModalLeftPanelStyle()}
//                 >
//                   <button
//                     onClick={closeModals}
//                     className="at-btnpopupclose at-btnpopupclosetwo"
//                   >
//                     {/* SVG close icon */}
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
//                           d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321  10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
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
//                   <figure className="at-productimg relative w-full h-full max-w-full flex items-center justify-center">
//                     <img
//                       src={
//                         // (selectedProduct.background_images && selectedProduct.background_images[0]) || PRODUCT_PLACEHOLDER // Display the first image
//                         selectedProduct.background_images[0] ||
//                         PRODUCT_PLACEHOLDER // Display the first image
//                       }
//                       alt={selectedProduct.name}
//                       className="object-contain w-full h-full"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src =
//                           PRODUCT_PLACEHOLDER;
//                       }}
//                     />
//                   </figure>
//                 </div>
//                 <div className="at-popupcontentside w-full md:w-[60%] p-6 flex flex-col justify-between">
//                   <div>
//                     <div className="at-popuptitlebrandimg at-modaltitleqnty mb-4">
//                       <div className="at-popupproducttitlerating at-ordersummerytitlearea flex-grow">
//                         <h4 className="font-bold text-lg text-gray-800">
//                           {selectedProduct.name}
//                         </h4>
//                         <p className="text-sm text-gray-600 truncate">
//                           {selectedProduct.description}
//                         </p>
//                       </div>
//                       <div className="at-orderquntatiy flex-shrink-0 ml-4">
//                         <div className="at-btnquntatiyholder flex items-center border rounded-md">
//                           <button
//                             onClick={decreaseQuantity}
//                             disabled={quantity <= 1}
//                             className="px-3 py-1 text-lg font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
//                           >
//                             -
//                           </button>
//                           <span className="px-4 py-1 text-base text-gray-800">
//                             {quantity}
//                           </span>
//                           <button
//                             onClick={increaseQuantity}
//                             className="px-3 py-1 text-lg font-medium text-gray-700 hover:bg-gray-100"
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="at-ordersummery border-t pt-4">
//                       <h3 className="font-semibold text-md text-gray-800 mb-2">
//                         Order Summary
//                       </h3>
//                       <ul className="space-y-1 text-sm">
//                         <li className="flex justify-between">
//                           <span>Item Price:</span>{' '}
//                           <span>
//                             Rs.{' '}
//                             {(
//                               selectedProduct.price + selectedSpecPrice
//                             ).toFixed(2)}
//                           </span>
//                         </li>
//                         <li className="flex justify-between">
//                           <span>Quantity:</span> <span>{quantity}</span>
//                         </li>
//                         <li className="flex justify-between">
//                           <span>Subtotal:</span>{' '}
//                           <span>
//                             Rs.{' '}
//                             {(
//                               (selectedProduct.price + selectedSpecPrice) *
//                               quantity
//                             ).toFixed(2)}
//                           </span>
//                         </li>
//                         <li className="flex justify-between">
//                           <span>Sales Tax (17%):</span>{' '}
//                           <span>
//                             Rs.{' '}
//                             {(
//                               (selectedProduct.price + selectedSpecPrice) *
//                               quantity *
//                               0.17
//                             ).toFixed(2)}
//                           </span>
//                         </li>
//                         <li className="flex justify-between font-bold text-md mt-2 border-t pt-2">
//                           <span>Grand Total:</span>{' '}
//                           <span>
//                             Rs.{' '}
//                             {(
//                               (selectedProduct.price + selectedSpecPrice) *
//                               quantity *
//                               1.17
//                             ).toFixed(2)}
//                           </span>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder pt-5 mt-auto">
//                     <button
//                       type="button"
//                       className="at-btn w-full mb-2"
//                       onClick={handlePlaceOrder}
//                       disabled={processing}
//                     >
//                       {processing ? 'Processing...' : 'Place Order'}
//                     </button>
//                     <button
//                       type="button"
//                       className="at-btn at-btncancel w-full"
//                       onClick={() => router.push('/home')}
//                     >
//                       Continue Shopping
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </>
//     </div>
//   );
// };

// export default SubCategoryPage;
