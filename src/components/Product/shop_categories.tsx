// // src/components/Product/shop_categories.tsx
// 'use client';
// import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   fetchSubCategoryList,
//   fetchCategoryList,
//   fetchCompanyList,
//   fetchProductDetails,
//   placeOrder,
//   confirmOrder,
// } from '@/services/api.service';
// import { Skeleton } from '@/components/ui/skeleton';
// import { useCart } from '@/context/CartContext';
// import { toast } from 'react-toastify';
// import RatingStars from '@/components/page-ui/rating_stars';
// import Link from 'next/link';

// const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// interface SubCategory {
//   _id: string;
//   name: string;
//   category_id: {
//     _id: string;
//     name: string;
//     type: number;
//   };
//   description: string;
//   image_path: string;
// }

// interface Company {
//   _id: string;
//   name: string;
//   company_logo: string;
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
//   image_path: string;
//   sticker_path?: string | null;
//   category_id: string;
//   company_id: string;
//   subcategory_id: string;
//   background_image?: string[];
//   description: string;
//   is_featured: boolean;
//   total_rating: number;
// }

// // Category Interface
// interface Category {
//   _id: string;
//   name: string;
//   description: string;
//   search_type: string;
//   image_path: string;
//   is_active: boolean;
//   product_type: string;
//   type: number;
//   created_at: string;
//   __v: number;
// }

// interface PersonalizedMessage {
//   name: string;
//   message: string;
//   image_path: string;
//   image_id: string;
//   productId?: string;
// }

// const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
// const ShopCategories = () => {
//   const router = useRouter();
//   const { cartItems, addToCart, removeFromCart } = useCart();
//   const [allCategories, setAllCategories] = useState<Category[]>([]);
//   const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
//   const [brands, setBrands] = useState<Company[]>([]);
//   const [allProducts, setAllProducts] = useState<Product[]>([]);
//   const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [subCategoryLoading, setSubCategoryLoading] = useState<boolean>(true);
//   const [brandsLoading, setBrandsLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
//     null
//   );

//   // Modal states and product selection
//   const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
//   const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [processing, setProcessing] = useState(false);
//   const [selectedSize, setSelectedSize] = useState<string>('M');
//   const [categoryId, setCategoryId] = useState<string | null>(null);

//   const [personalizedMessages, setPersonalizedMessages] = useState<{
//     [key: string]: PersonalizedMessage | undefined; // Make sure to import PersonalizedMessage type
//   }>({});

//   // --- Personalized Messages ---
//   const loadPersonalizedMessages = useCallback(() => {
//     // --- Read IMMEDIATELY ---
//     const storedMessagesImmediately = localStorage.getItem(
//       'selectedPersonalizedMessages'
//     );
//     console.log(
//       '[loadPersonalizedMessages] START - Raw value:',
//       storedMessagesImmediately
//     );

//     // Optional: Add a tiny delay to see if it helps visibility (use for debugging only)
//     // setTimeout(() => {
//     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
//     console.log(
//       '[loadPersonalizedMessages] Reading localStorage value:',
//       storedMessages
//     );
//     try {
//       // Default to null if storedMessages is empty/null to avoid parsing "null"
//       const messages = storedMessages ? JSON.parse(storedMessages) : {};
//       console.log('[loadPersonalizedMessages] Parsed messages:', messages);
//       console.log(
//         '[loadPersonalizedMessages] Type of parsed:',
//         typeof messages,
//         'Is Array:',
//         Array.isArray(messages)
//       );

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
//         setPersonalizedMessages({}); // Ensure state is reset
//       }
//     } catch (error) {
//       console.error(
//         '[loadPersonalizedMessages] ERROR parsing localStorage:',
//         error,
//         'Raw value was:',
//         storedMessages
//       );
//       setPersonalizedMessages({}); // Ensure state is reset on error
//     }
//     // }, 50); // 50ms delay - REMOVE after testing
//   }, []);

//   useEffect(() => {
//     fetchAllData();
//     loadPersonalizedMessages(); // Initial load

//     const handleStorageChange = (event: StorageEvent) => {
//       if (event.key === 'selectedPersonalizedMessages') {
//         console.log(
//           "Storage event triggered for 'selectedPersonalizedMessages' in ShopCategories"
//         );
//         loadPersonalizedMessages(); // Reload state from localStorage
//         // setStorageChangeKey(prevKey => prevKey + 1); // Keep this if loadPersonalizedMessages doesn't trigger re-render reliably
//       }
//       // Add listener for the other key if needed
//       if (event.key === 'personalizedMessages') {
//         console.log("Storage event triggered for 'personalizedMessages'");
//         // Decide if you need to react to changes in this key as well
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);

//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//     // Add dependencies if fetchAllData or loadPersonalizedMessages depend on props/state
//     // }, [loadPersonalizedMessages]); // Make sure loadPersonalizedMessages is stable (useCallback)
//   }, [loadPersonalizedMessages]);

//   const hasPersonalization = (productId: string) => {
//     const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
//     if (storedMessages) {
//       try {
//         const messages = JSON.parse(storedMessages);

//         // Check if it's the expected object format (non-null, object, not an array)
//         if (
//           messages &&
//           typeof messages === 'object' &&
//           !Array.isArray(messages)
//         ) {
//           return messages.hasOwnProperty(productId);
//         } else {
//           // Log a warning if the format is unexpected
//           console.warn(
//             `'selectedPersonalizedMessages' in localStorage is not the expected object format for product ID ${productId}. Found:`,
//             messages
//           );
//           return false; // Treat unexpected format as 'not personalized' for this check
//         }
//       } catch (e) {
//         console.error(
//           "Error parsing 'selectedPersonalizedMessages' from localStorage:",
//           e
//         );
//         return false;
//       }
//     }
//     return false;
//   };

//   const handlePersonalize = (productId: string) => {
//     localStorage.setItem('currentItemId', productId);
//     localStorage.setItem('returnPath', window.location.pathname);
//     router.push('/messages');
//   };

//   // ---End Personalized Messages ---

//  // --- Background Color Logic ---
//   const getProductBackgroundColor = useCallback(
//     (prodCategoryId?: string): string => {
//       if (!prodCategoryId || allCategories.length === 0) {
//         return '#FFFFFF'; // Default white
//       }
//       const categoryData = allCategories.find(
//         (cat) => cat._id === prodCategoryId
//       );
//       if (!categoryData) {
//         // console.warn(`Category not found for ID: ${prodCategoryId} in allCategories list.`);
//         return '#FFFFFF'; // Default if category not found
//       }
//       switch (categoryData.type) {
//         case 1:
//           return '#FFD05E';
//         case 2:
//           return '#FF834B';
//         case 3:
//           return '#88C1FD';
//         case 4:
//           return '#40A574';
//         default:
//           return '#FFFFFF';
//       }
//     },
//     [allCategories]
//   ); // Depend on the fetched allCategories state
//   // --- End Background Color Logic ---

//   // --- Initial Data Fetching ---
//     // --- Initial Data Fetching ---
//     useEffect(() => {
//       const fetchInitialCategoryData = async () => {
//         setSubCategoryLoading(true);
//         setBrandsLoading(true);
//         setLoading(true);
//         setError(null);
//         setCurrentCategoryId(null);
//         setAllCategories([]); // Reset
//   I
//         const categorySlug = typeof categoryId === 'string' ? categoryId : null;
//         if (!categorySlug) {
//           setError('Category slug not found in URL.');
//           setSubCategoryLoading(false);
//           setBrandsLoading(false);
//           setLoading(false);
//           return;
//         }

//         try {
//           // Fetch all categories list first to find the ID and get types for colors
//           const categoriesResponse = await fetchCategoryList();
//           if (categoriesResponse.success && categoriesResponse.data) {
//             setAllCategories(categoriesResponse.data); // Store all categories for color lookup

//             // Find the specific category matching the slug
//             const currentCat = categoriesResponse.data.find(
//               (cat: Category) =>
//                 cat.name.toLowerCase().replace(/\s+/g, '') === categorySlug
//             );

//             if (currentCat) {
//               setCurrentCategoryId(currentCat._id);
//               // Trigger subsequent fetches now that we have the ID
//               fetchSubcategoriesAndBrands(currentCat._id);
//             } else {
//               setError('Category not found.');
//               setSubCategoryLoading(false);
//               setBrandsLoading(false);
//               setLoading(false);
//             }
//           } else {
//             throw new Error(
//               categoriesResponse.message || 'Failed to fetch categories.'
//             );
//           }
//         } catch (err: any) {
//           console.error('Error fetching initial category data:', err);
//           setError(
//             err.message || 'An error occurred while fetching category data.'
//           );
//           setSubCategoryLoading(false);
//           setBrandsLoading(false);
//           setsLoading(false);
//         }
//       };

//       fetchInitialCategoryData();
//     }, [categoryId]); // Re-run only if the category slug changes

//   const fetchAllData = async () => {
//     setLoading(true);
//     setSubCategoryLoading(true);
//     setBrandsLoading(true);

//     try {
//       // Fetch all subcategories
//       const subcategoriesResponse = await fetchSubCategoryList();
//       if (subcategoriesResponse.success) {
//         setSubCategories(subcategoriesResponse.data);
//         setSubCategoryLoading(false);
//       }

//       // Fetch all companies/brands
//       const companiesResponse = await fetchCompanyList();
//       if (companiesResponse.success) {
//         setBrands(companiesResponse.data);

//         // Fetch products for all companies
//         const allProductsPromises = companiesResponse.data.map(
//           (company: Company) => fetchProductDetails(company._id)
//         );

//         const responses = await Promise.all(allProductsPromises);

//         // Separate featured products
//         const featuredProductsList = responses.flatMap((response) =>
//           response.success
//             ? response.data.filter((product: Product) => product.is_featured)
//             : []
//         );

//         // Get all products regardless of featured status
//         const allProductsList = responses.flatMap((response) =>
//           response.success ? response.data : []
//         );

//         setFeaturedProducts(featuredProductsList);
//         setAllProducts(allProductsList);
//         setBrandsLoading(false);
//       }
//     } catch (err: any) {
//       console.error('Error fetching data:', err);
//       setError('An error occurred while fetching data.');
//     } finally {
//       setLoading(false);
//       setSubCategoryLoading(false);
//       setBrandsLoading(false);
//     }
//   };

//   const decreaseQuantity = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const increaseQuantity = () => {
//     setQuantity(quantity + 1);
//   };

//   const isInCart = (productId: string) =>
//     cartItems.some((item) => item._id === productId);

//   const handleProductClick = (product: Product) => {
//     setSelectedProduct(product);
//     setIsFirstModalOpen(true);
//   };

//   const closeModals = () => {
//     setIsFirstModalOpen(false);
//     setIsSecondModalOpen(false);
//     setSelectedProduct(null);
//     setQuantity(1);
//     setSelectedSize('M');
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

//   const handlePlaceOrder = async () => {
//     if (!selectedProduct) return;

//     try {
//       // Show processing state
//       setProcessing(true);

//       // Create order data
//       const orderData = {
//         cart_details: [
//           {
//             product_id: selectedProduct._id,
//             quantity: quantity,
//             personalized: personalizedMessages[selectedProduct._id] || null,
//           },
//         ],
//       };

//       // Place the order first (this creates the order in the database)
//       const orderResponse = await placeOrder(orderData);

//       if (!orderResponse.success) {
//         throw new Error(orderResponse.message || 'Failed to place order');
//       }

//       // Store order and payment IDs for confirmation after payment
//       localStorage.setItem('order_id', orderResponse.data.order_id);
//       localStorage.setItem('payment_id', orderResponse.data.payment_id);

//       // If it's a free product, confirm the order immediately and redirect
//       if (orderResponse.data.payment_type === 'free') {
//         const confirmResponse = await confirmOrder(
//           orderResponse.data.order_id,
//           orderResponse.data.payment_id
//         );

//         if (confirmResponse) {
//           removeFromCart(selectedProduct._id);
//           closeModals();
//           router.push('/thankyou');
//         } else {
//           throw new Error('Order confirmation failed');
//         }
//         return;
//       }

//       // For paid products, prepare PayFast payment
//       const totalAmount = selectedProduct.price * quantity * 1.17; // Price + 17% tax
//       const orderId = orderResponse.data.order_id;
//       const orderDate = new Date().toISOString().split('T')[0];

//       // Get PayFast token
//       const tokenResponse = await fetch(
//         `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
//       );

//       if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
//       const responseData = await tokenResponse.json();
//       const token = responseData.ACCESS_TOKEN;

//       if (!token) throw new Error('Invalid token response from PayFast');

//       // Generate signature
//       const generateSignature = (merchantId: string, token: string): string => {
//         const timestamp = new Date().getTime();
//         return `SIG-${merchantId}-${timestamp}`;
//       };

//       // Create form data for PayFast
//       const formData = {
//         MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
//         MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'My Merchant',
//         TOKEN: token,
//         PROCCODE: '00',
//         TXNAMT: totalAmount.toFixed(2),
//         CUSTOMER_MOBILE_NO: '03000000000', // This should ideally come from user profile
//         CUSTOMER_EMAIL_ADDRESS: 'rizcmt195@gmail.com', // This should ideally come from user profile
//         SIGNATURE: generateSignature(
//           process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
//           token
//         ),
//         VERSION: 'MY_VER_1.0',
//         TXNDESC: `Payment for ${selectedProduct.name}`,
//         SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
//         FAILURE_URL: `${window.location.origin}/failure`,
//         BASKET_ID: orderId,
//         ORDER_DATE: orderDate,
//         CHECKOUT_URL: `${window.location.origin}/confirm`,
//       };

//       // Create and submit form to PayFast
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

//       // Add form to document and submit
//       document.body.appendChild(form);
//       form.submit();

//       // Clear the cart item after submission
//       removeFromCart(selectedProduct._id);
//     } catch (error: any) {
//       console.error('Order placement error:', error);
//       toast.error(
//         error.message || 'An unexpected error occurred during checkout'
//       );
//       setProcessing(false);
//     }
//   };

//   const handleSubCategoryClick = (subcategory: SubCategory) => {
//     const subCategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, '');
//     router.push(`/subcategory/${subCategorySlug}`);
//   };

//   const handleBrandClick = (
//     brandname: string,
//     brandLogo: string,
//     brandId: string
//   ) => {
//     const slug = brandname.toLowerCase().replace(/\s+/g, '');
//     sessionStorage.setItem('brandLogo', brandLogo);
//     router.push(`/${slug}/${brandId}`);
//   };

//   const handleReviewsClick = (productId: string) => {
//     router.push(`/reviews/${productId}`);
//   };

//   return (
//     <div className="at-categories">
//       {error && <p className="error-message">{error}</p>}
//       <>
//         <div className="at-pagesectiontitle">
//           <h2>Browse by Sub Category</h2>
//         </div>
//         <div className="at-categoriesgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory  flex gap-4 ">
//           {subCategoryLoading && (
//             <div className="at-categoryitem flex gap-4 items-center">
//               {[...Array(5)].map((_, index) => (
//                 <div key={index} className="flex flex-col items-center">
//                   <Skeleton className="h-24 w-24 rounded-full bg-[#d6dadb]" />
//                 </div>
//               ))}
//             </div>
//           )}

//           {error && <p className="error-message">{error}</p>}
//           {!subCategoryLoading && subcategories.length === 0 && !error && (
//             <p>No sub categories available.</p>
//           )}

//           {!subCategoryLoading &&
//             subcategories?.length > 0 &&
//             subcategories?.map((subcategory: any) => (
//               <div
//                 key={subcategory?._id}
//                 className="at-categoryitem cursor-pointer"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleSubCategoryClick(subcategory);
//                 }}
//               >
//                 <figure className="flex flex-col items-center">
//                   <span className="at-imageparent">
//                     {subcategory.image_path !== null ? (
//                       <img
//                         src={`${BASE_URL}/${subcategory.image_path}`}
//                         alt={subcategory.name}
//                       />
//                     ) : (
//                       <img
//                         src={PRODUCT_PLACEHOLDER}
//                         alt={
//                           subcategory.name !== ''
//                             ? subcategory.name
//                             : 'Sub Category Name'
//                         }
//                       />
//                     )}
//                   </span>
//                   <figcaption className="at-categorycontent text-center">
//                     <h3 className="at-categorytitle font-bold text-[14px]">
//                       {subcategory?.name}
//                     </h3>
//                   </figcaption>
//                 </figure>
//               </div>
//             ))}
//         </div>

//         {/*
//           Shop by Brands
//         */}
//         <div className="at-pagesectiontitle">
//           <h2>
//             <br />
//             <br />
//             Shop by Brands
//           </h2>
//         </div>
//         <div className="at-categoriesgrid  overflow-x-auto horizontal-scroll snap-x snap-mandatory">
//           {brandsLoading && (
//             <div className="at-categoryitem flex gap-4 items-center">
//               {[...Array(5)].map((_, index) => (
//                 <div key={index} className="flex flex-col items-center">
//                   <Skeleton className="h-24 w-24 px-5 py-3 bg-[#d6dadb]" />
//                 </div>
//               ))}
//             </div>
//           )}
//           {error && <p className="error-message">{error}</p>}
//           {!brandsLoading && brands?.length === 0 && !error && (
//             <p>No brands available.</p>
//           )}
//           {!brandsLoading &&
//             brands?.length > 0 &&
//             brands?.map((brand) => (
//               <div
//                 key={brand._id}
//                 className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleBrandClick(brand.name, brand.company_logo, brand._id);
//                 }}
//               >
//                 <img src={brand.company_logo} alt={brand.name} />
//               </div>
//             ))}
//         </div>

//         {/*
//         Featured Products
//          */}
//         <div className="at-pagesectiontitle mt-5">
//           <h2>Featured Products</h2>
//         </div>

//         <div className="at-cardgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory">
//           {loading ? (
//             [...Array(4)].map((_, index) => (
//               <div className="at-carditem" key={index}>
//                 <Skeleton className="h-40 w-full" />
//                 <Skeleton className="h-6 w-3/4 mt-2" />
//                 <Skeleton className="h-4 w-1/2 mt-1" />
//               </div>
//             ))
//           ) : featuredProducts.length > 0 ? (
//             featuredProducts.map((product) => {
//               const brand = brands.find((b) => b._id === product.company_id);
//               return (
//                 <div
//                   key={product._id}
//                   className="at-carditem cursor-pointer"
//                   onClick={() => handleProductClick(product)}
//                 >
//                   <figure className="at-giftimage">
//                     {product.image_path !== null ? (
//                       <img src={product.image_path} alt={product.name} />
//                     ) : (
//                       <img
//                         src={PRODUCT_PLACEHOLDER}
//                         alt={
//                           product.name !== '' ? product.name : 'Product Name'
//                         }
//                       />
//                     )}
//                   </figure>
//                   <div className="at-gifttitle flex items-center justify-between w-full font-bold">
//                     <h3 className="font-bold text-[14px] m-0">
//                       {product.name}
//                     </h3>
//                     <span className="text-right text-[#40A574]">
//                       Rs.{product.price}
//                     </span>
//                   </div>
//                   {brand && (
//                     <h4 className="font-bold text-[10px]">{brand.name}</h4>
//                   )}
//                 </div>
//               );
//             })
//           ) : (
//             <p>No featured products available.</p>
//           )}
//         </div>

//         <div className="at-pagesectiontitle mt-5">
//           <h2>All Products</h2>
//         </div>

//         <div className="at-cardgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory ">
//           {loading ? (
//             [...Array(4)].map((_, index) => (
//               <div
//                 className="at-carditem  "
//                 key={`all-product-skeleton-${index}`}
//               >
//                 <Skeleton className="h-40 w-full" />
//                 <Skeleton className="h-6 w-3/4 mt-2" />
//                 <Skeleton className="h-4 w-1/2 mt-1" />
//               </div>
//             ))
//           ) : allProducts.length > 0 ? (
//             allProducts.map((product) => {
//               const brand = brands.find((b) => b._id === product.company_id);
//               return (
//                 <div
//                   key={`all-${product._id}`}
//                   className="at-carditem cursor-pointer"
//                   onClick={() => handleProductClick(product)}
//                 >
//                   <figure className="at-giftimage">
//                     {product.image_path !== null ? (
//                       <img src={product.image_path} alt={product.name} />
//                     ) : (
//                       <img
//                         src={PRODUCT_PLACEHOLDER}
//                         alt={
//                           product.name !== '' ? product.name : 'Product Name'
//                         }
//                       />
//                     )}
//                   </figure>
//                   <div className="at-gifttitle flex items-center justify-between w-full font-bold">
//                     <h3 className="font-bold text-[14px] m-0">
//                       {product.name}
//                     </h3>
//                     <span className="text-right text-[#40A574]">
//                       Rs.{product.price}
//                     </span>
//                   </div>
//                   {brand && (
//                     <h4 className="font-bold text-[10px]">{brand.name}</h4>
//                   )}
//                 </div>
//               );
//             })
//           ) : (
//             <p>No products available.</p>
//           )}
//         </div>

//         {/* First Modal */}
//         {/* Personalization Modal */}
//         {isFirstModalOpen && selectedProduct && (
//           <div
//             className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
//             onClick={() => setIsFirstModalOpen(false)}
//           >
//             <div
//               className="bg-white rounded-lg shadow-lg at-modaldailouge"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center relative">
//                 <div className="at-modalcontent p-0">
//                   <button
//                     onClick={() => setIsFirstModalOpen(false)}
//                     className="at-btnpopupclose at-btnpopupclosetwo"
//                   >
//                     <svg
//                       width="32"
//                       height="32"
//                       viewBox="0 0 32 32"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <circle cx="16" cy="16" r="16" fill="white" />
//                       <path
//                         d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
//                         fill="#434343"
//                       />
//                       <path
//                         d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
//                         fill="#434343"
//                       />
//                     </svg>
//                   </button>
//                   <div className="at-modalleftside p-0">
//                     <figure className="at-productimg p-0 m-0">
//                       {selectedProduct.background_image ? (
//                         <img
//                           src={
//                             `${BASE_URL}/${selectedProduct.background_image[0]}` ||
//                             PRODUCT_PLACEHOLDER
//                           }
//                           alt={selectedProduct.name}
//                           className="w-full h-1/2 rounded-lg object-contain"
//                         />
//                       ) : (
//                         <img
//                           src={PRODUCT_PLACEHOLDER}
//                           alt="Product Name"
//                           className="w-full sm:w-24 h-24 rounded-lg object-cover"
//                         />
//                       )}
//                     </figure>
//                   </div>
//                   <div className="at-popupcontentside">
//                     <div className="at-popuptitlebrandimg">
//                       <span>
//                         <img
//                           src={
//                             brands.find(
//                               (b) => b._id === selectedProduct.company_id
//                             )?.company_logo
//                           }
//                           alt=""
//                         />
//                       </span>
//                       <div
//                         className="at-popupproducttitlerating"
//                         onClick={() => handleReviewsClick(selectedProduct._id)}
//                       >
//                         <h4>
//                           {
//                             brands.find(
//                               (b) => b._id === selectedProduct.company_id
//                             )?.name
//                           }
//                         </h4>
//                         <p>3.1 km from you</p>
//                         <RatingStars
//                           rating={Math.round(selectedProduct.total_rating)}
//                         />
//                       </div>
//                     </div>
//                     <div className="at-popupdescription">
//                       <p>{selectedProduct.description}</p>
//                     </div>
//                     <div className="at-popupcolorprice">
//                       <div className="at-popupcolor">
//                         <h3>{selectedProduct.name}</h3>
//                         <span>300ml/530 kcal</span>
//                       </div>
//                       <div className="at-popupprice">
//                         <h3>Rs. {selectedProduct.price}</h3>
//                       </div>
//                     </div>

//                     <div className="at-productsize">
//                       {['S', 'M', 'L'].map((size) => (
//                         <span
//                           key={size}
//                           onClick={() => setSelectedSize(size)}
//                           className={
//                             selectedSize === size
//                               ? 'bg-[#40A574] text-white'
//                               : 'bg-gray-200'
//                           }
//                         >
//                           {size}
//                         </span>
//                       ))}
//                     </div>

//                     <div className="at-btnaddtocart">
//                       {isInCart(selectedProduct._id) ? (
//                         <button onClick={handleGoToCart} className="at-btn">
//                           Go to Cart
//                           <svg
//                             width="24"
//                             height="24"
//                             viewBox="0 0 128 128"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               d="M64 0.3C28.7 0.3 0 28.8 0 64C0 99.2 28.7 127.7 64 127.7C99.3 127.7 128 99.2 128 64C128 28.8 99.3 0.3 64 0.3ZM64 121.3C32.2 121.3 6.4 95.7 6.4 64C6.4 32.3 32.2 6.7 64 6.7C95.8 6.7 121.6 32.4 121.6 64C121.6 95.7 95.8 121.3 64 121.3ZM38.4 58.9V66C38.4 68.2 40.2 69.9 42.3 69.9L57.6 57.7V86.4C57.6 88.6 59.9 89.6 62 89.6H66C68.2 89.6 69.9 87.8 69.9 85.7V57.2L85.7 69.9C87.9 69.9 89.6 68.1 89.6 66V58.9L64 32.2L38.4 58.9Z"
//                               fill="#FFFFFF"
//                             />
//                           </svg>
//                         </button>
//                       ) : (
//                         <button onClick={handleAddToCart} className="at-btn">
//                           Add to Cart
//                           <svg
//                             className="mt-3"
//                             width="24"
//                             height="24"
//                             viewBox="0 0 32 32"
//                             fill="#ffffff"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <circle cx="16" cy="16" r="16" fill="white" />
//                             <path
//                               d="M24 16C24 16.3537 23.8644 16.6957 23.6108 16.9433C23.3631 17.1968 23.021 17.3382 22.6672 17.3382H17.3358V22.6677C17.3358 23.0214 17.1943 23.3633 16.9407 23.6109C16.693 23.8585 16.3568 24 16.0029 24C15.6491 24 15.307 23.8585 15.0593 23.6109C14.8058 23.3633 14.6642 23.0214 14.6642 22.6677V17.3382H9.33284C8.97899 17.3382 8.63693 17.1968 8.38924 16.9433C8.14154 16.6957 8 16.3537 8 16C8 15.6463 8.14154 15.3102 8.38924 15.0567C8.63693 14.8091 8.97899 14.6676 9.33284 14.6676H14.6642V9.33825C14.6642 8.98452 14.8058 8.64259 15.0593 8.39499C15.307 8.14149 15.6491 8 16.0029 8C16.3568 8 16.693 8.14149 16.9407 8.39499C17.1943 8.64259 17.3358 8.98452 17.3358 9.33825V14.6676H22.6672C23.021 14.6676 23.3631 14.8091 23.6108 15.0567C23.8644 15.3102 24 15.6463 24 16Z"
//                               fill="#40A574"
//                             />
//                           </svg>
//                         </button>
//                       )}
//                       <button
//                         className="at-btn at-btnpersonal"
//                         onClick={() => {
//                           console.log(
//                             'Personalizing product:',
//                             selectedProduct._id
//                           );
//                           handlePersonalize(selectedProduct._id);
//                         }}
//                       >
//                         Personalize
//                         <label className="custom-checkbox top-2">
//                           <input
//                             className="align-middle"
//                             type="checkbox"
//                             checked={hasPersonalization(selectedProduct._id)}
//                             readOnly
//                           />
//                           <span className="checkmark"></span>
//                         </label>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Second Modal */}

//         {isSecondModalOpen && selectedProduct && (
//           <div
//             className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
//             onClick={closeModals}
//           >
//             <div
//               className="bg-white rounded-lg shadow-lg at-modaldailouge"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center flex-col">
//                 <div className="at-modalcontent p-0">
//                   <button
//                     onClick={closeModals}
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
//                   <div className="at-modalleftside at-modalordersummeryleft p-0">
//                     <figure className="at-productimg p-0 m-0">
//                       {selectedProduct.background_image ? (
//                         <img
//                           src={`${BASE_URL}/${selectedProduct.background_image}`}
//                           alt={selectedProduct.name}
//                         />
//                       ) : (
//                         <img
//                           src={PRODUCT_PLACEHOLDER}
//                           alt={
//                             selectedProduct.name !== ''
//                               ? selectedProduct.name
//                               : 'Product Name'
//                           }
//                         />
//                       )}
//                     </figure>
//                   </div>
//                   <div className="at-popupcontentside">
//                     <div className="at-popuptitlebrandimg at-modaltitleqnty">
//                       <div className="at-popupproducttitlerating at-ordersummerytitlearea">
//                         <h4>{selectedProduct.name}</h4>
//                         <p>{selectedProduct.description}</p>
//                       </div>
//                       <div className="at-orderquntatiy">
//                         <div className="at-btnquntatiyholder">
//                           <button
//                             onClick={decreaseQuantity}
//                             disabled={quantity === 1}
//                           >
//                             -
//                           </button>
//                           <span className="">{quantity}</span>
//                           <button onClick={increaseQuantity} className="">
//                             +
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="at-ordersummery">
//                       <h3>Order Summary</h3>
//                       <ul>
//                         <li>
//                           <span>Item</span>
//                         </li>
//                         <li>
//                           <span>Rs.{selectedProduct.price}</span>
//                         </li>
//                         <li>
//                           <span>Sales Tax 17%</span>
//                         </li>
//                         <li>
//                           <span>
//                             Rs.
//                             {(selectedProduct.price * 0.17 * quantity).toFixed(
//                               2
//                             )}
//                           </span>
//                         </li>
//                         <li>
//                           <span>Grand Total</span>
//                         </li>
//                         <li>
//                           <span>
//                             Rs.
//                             {(
//                               selectedProduct.price * quantity +
//                               selectedProduct.price * 0.17 * quantity
//                             ).toFixed(2)}
//                           </span>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="at-btnsubmitcontact at-btnprofile at-btnplaceorder">
//                   <button
//                     type="button"
//                     className="at-btn"
//                     onClick={handlePlaceOrder}
//                     disabled={processing}
//                   >
//                     {processing ? 'Processing...' : 'Place Order'}
//                   </button>
//                   <Link href="/home">
//                     <button type="button" className="at-btn at-btncancel">
//                       Continue Shopping
//                     </button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </>
//     </div>
//   );
// };

// export default ShopCategories;

'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  fetchSubCategoryList,
  fetchCategoryList,
  fetchCompanyList,
  fetchProductDetails,
  placeOrder,
  confirmOrder,
} from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import RatingStars from '@/components/page-ui/rating_stars';
import Link from 'next/link';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

interface SubCategory {
  _id: string;
  name: string;
  category_id: {
    _id: string;
    name: string;
    type: number;
  };
  description: string;
  image_path: string;
}

interface Company {
  _id: string;
  name: string;
  company_logo: string;
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
  image_path: string;
  sticker_path?: string | null;
  category_id: string;
  company_id: string;
  subcategory_id: string;
  background_image?: string[];
  description: string;
  is_featured: boolean;
  total_rating: number;
}

// Category Interface
interface Category {
  _id: string;
  name: string;
  description: string;
  search_type: string;
  image_path: string;
  is_active: boolean;
  product_type: string;
  type: number;
  created_at: string;
  __v: number;
}

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const ShopCategories = () => {
  const router = useRouter();
  const { cartItems, addToCart, removeFromCart } = useCart();
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [brands, setBrands] = useState<Company[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [subCategoryLoading, setSubCategoryLoading] = useState<boolean>(true);
  const [brandsLoading, setBrandsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null
  );

  // Modal states and product selection
  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage | undefined;
  }>({});

  // --- Personalized Messages ---
  const loadPersonalizedMessages = useCallback(() => {
    // --- Read IMMEDIATELY ---
    const storedMessagesImmediately = localStorage.getItem(
      'selectedPersonalizedMessages'
    );
    console.log(
      '[loadPersonalizedMessages] START - Raw value:',
      storedMessagesImmediately
    );

    // Optional: Add a tiny delay to see if it helps visibility (use for debugging only)
    // setTimeout(() => {
    const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
    console.log(
      '[loadPersonalizedMessages] Reading localStorage value:',
      storedMessages
    );
    try {
      // Default to null if storedMessages is empty/null to avoid parsing "null"
      const messages = storedMessages ? JSON.parse(storedMessages) : {};
      console.log('[loadPersonalizedMessages] Parsed messages:', messages);
      console.log(
        '[loadPersonalizedMessages] Type of parsed:',
        typeof messages,
        'Is Array:',
        Array.isArray(messages)
      );

      if (
        messages &&
        typeof messages === 'object' &&
        !Array.isArray(messages)
      ) {
        setPersonalizedMessages(messages);
        console.log(
          '[loadPersonalizedMessages] SUCCESS: Set state with OBJECT:',
          messages
        );
      } else {
        console.warn(
          '[loadPersonalizedMessages] WARN: Parsed value is NOT an object. Setting empty state. Found:',
          messages
        );
        setPersonalizedMessages({}); // Ensure state is reset
      }
    } catch (error) {
      console.error(
        '[loadPersonalizedMessages] ERROR parsing localStorage:',
        error,
        'Raw value was:',
        storedMessages
      );
      setPersonalizedMessages({}); // Ensure state is reset on error
    }
    // }, 50); // 50ms delay - REMOVE after testing
  }, []);

  // --- Background Color Logic ---
  const getProductBackgroundColor = useCallback(
    (prodCategoryId?: string): string => {
      if (!prodCategoryId || allCategories.length === 0) {
        return '#FFFFFF'; // Default white
      }
      const categoryData = allCategories.find(
        (cat) => cat._id === prodCategoryId
      );
      if (!categoryData) {
        // console.warn(`Category not found for ID: ${prodCategoryId} in allCategories list.`);
        return '#FFFFFF'; // Default if category not found
      }
      switch (categoryData.type) {
        case 1:
          return '#FFD05E';
        case 2:
          return '#FF834B';
        case 3:
          return '#88C1FD';
        case 4:
          return '#40A574';
        default:
          return '#FFFFFF';
      }
    },
    [allCategories]
  ); // Depend on the fetched allCategories state

  // --- Initial Data Fetching ---
  useEffect(() => {
    const fetchInitialCategoryData = async () => {
      setSubCategoryLoading(true);
      setBrandsLoading(true);
      setLoading(true);
      setError(null);
      setCurrentCategoryId(null);
      setAllCategories([]); // Reset

      const categorySlug = typeof categoryId === 'string' ? categoryId : null;
      if (!categorySlug) {
        setSubCategoryLoading(false);
        setBrandsLoading(false);
        setLoading(false);
        return;
      }

      try {
        // Fetch all categories list first to find the ID and get types for colors
        const categoriesResponse = await fetchCategoryList();
        if (categoriesResponse.success && categoriesResponse.data) {
          setAllCategories(categoriesResponse.data); // Store all categories for color lookup

          // Find the specific category matching the slug
          const currentCat = categoriesResponse.data.find(
            (cat: Category) =>
              cat.name.toLowerCase().replace(/\s+/g, '') === categorySlug
          );

          if (currentCat) {
            setCurrentCategoryId(currentCat._id);
            // Trigger subsequent fetches now that we have the ID
            fetchSubcategoriesAndBrands(currentCat._id);
          } else {
            setError('Category not found.');
            setSubCategoryLoading(false);
            setBrandsLoading(false);
            setLoading(false);
          }
        } else {
          throw new Error(
            categoriesResponse.message || 'Failed to fetch categories.'
          );
        }
      } catch (err: any) {
        console.error('Error fetching initial category data:', err);
        setError(
          err.message || 'An error occurred while fetching category data.'
        );
        setSubCategoryLoading(false);
        setBrandsLoading(false);
        setLoading(false);
      }
    };

    fetchInitialCategoryData();
  }, [categoryId]); // Re-run only if the category slug changes

  // Add the missing fetchSubcategoriesAndBrands function
  const fetchSubcategoriesAndBrands = async (categoryId: string) => {
    try {
      // Fetch subcategories for this category
      const subcategoriesResponse = await fetchSubCategoryList();
      if (subcategoriesResponse.success) {
        const filteredSubcategories = subcategoriesResponse.data.filter(
          (sub: SubCategory) =>
            sub.category_id && sub.category_id._id === categoryId
        );
        setSubCategories(filteredSubcategories);
        setSubCategoryLoading(false);
      }

      // Fetch all companies/brands
      const companiesResponse = await fetchCompanyList();
      if (companiesResponse.success) {
        setBrands(companiesResponse.data);

        // Fetch products for all companies
        const allProductsPromises = companiesResponse.data.map(
          (company: Company) => fetchProductDetails(company._id)
        );

        const responses = await Promise.all(allProductsPromises);

        // Separate featured products and filter by category if needed
        const featuredProductsList = responses.flatMap((response) =>
          response.success
            ? response.data.filter(
                (product: Product) =>
                  product.is_featured &&
                  (!categoryId || product.category_id === categoryId)
              )
            : []
        );

        // Get all products regardless of featured status, filtered by category if needed
        const allProductsList = responses.flatMap((response) =>
          response.success
            ? response.data.filter(
                (product: Product) =>
                  !categoryId || product.category_id === categoryId
              )
            : []
        );

        setFeaturedProducts(featuredProductsList);
        setAllProducts(allProductsList);
        setBrandsLoading(false);
      }
    } catch (err: any) {
      console.error('Error fetching subcategories and brands:', err);
      setError('An error occurred while fetching subcategories and brands.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    loadPersonalizedMessages(); // Initial load

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'selectedPersonalizedMessages') {
        console.log(
          "Storage event triggered for 'selectedPersonalizedMessages' in ShopCategories"
        );
        loadPersonalizedMessages(); // Reload state from localStorage
      }
      // Add listener for the other key if needed
      if (event.key === 'personalizedMessages') {
        console.log("Storage event triggered for 'personalizedMessages'");
        // Decide if you need to react to changes in this key as well
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadPersonalizedMessages]);

  const fetchAllData = async () => {
    setLoading(true);
    setSubCategoryLoading(true);
    setBrandsLoading(true);

    try {
      // Fetch all categories for background colors
      const categoriesResponse = await fetchCategoryList();
      if (categoriesResponse.success) {
        setAllCategories(categoriesResponse.data);
      }

      // Fetch all subcategories
      const subcategoriesResponse = await fetchSubCategoryList();
      if (subcategoriesResponse.success) {
        setSubCategories(subcategoriesResponse.data);
        setSubCategoryLoading(false);
      }

      // Fetch all companies/brands
      const companiesResponse = await fetchCompanyList();
      if (companiesResponse.success) {
        setBrands(companiesResponse.data);

        // Fetch products for all companies
        const allProductsPromises = companiesResponse.data.map(
          (company: Company) => fetchProductDetails(company._id)
        );

        const responses = await Promise.all(allProductsPromises);

        // Separate featured products
        const featuredProductsList = responses.flatMap((response) =>
          response.success
            ? response.data.filter((product: Product) => product.is_featured)
            : []
        );

        // Get all products regardless of featured status
        const allProductsList = responses.flatMap((response) =>
          response.success ? response.data : []
        );

        setFeaturedProducts(featuredProductsList);
        setAllProducts(allProductsList);
        setBrandsLoading(false);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
      setSubCategoryLoading(false);
      setBrandsLoading(false);
    }
  };

  const hasPersonalization = (productId: string) => {
    const storedMessages = localStorage.getItem('selectedPersonalizedMessages');
    if (storedMessages) {
      try {
        const messages = JSON.parse(storedMessages);

        // Check if it's the expected object format (non-null, object, not an array)
        if (
          messages &&
          typeof messages === 'object' &&
          !Array.isArray(messages)
        ) {
          return messages.hasOwnProperty(productId);
        } else {
          // Log a warning if the format is unexpected
          console.warn(
            `'selectedPersonalizedMessages' in localStorage is not the expected object format for product ID ${productId}. Found:`,
            messages
          );
          return false; // Treat unexpected format as 'not personalized' for this check
        }
      } catch (e) {
        console.error(
          "Error parsing 'selectedPersonalizedMessages' from localStorage:",
          e
        );
        return false;
      }
    }
    return false;
  };

  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem('returnPath', window.location.pathname);
    router.push('/messages');
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const isInCart = (productId: string) =>
    cartItems.some((item) => item._id === productId);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsFirstModalOpen(true);
  };

  const closeModals = () => {
    setIsFirstModalOpen(false);
    setIsSecondModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setSelectedSize('M');
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      const itemToAdd = {
        _id: selectedProduct._id,
        price: selectedProduct.price,
        quantity,
        image_path: selectedProduct.image_path,
        name: selectedProduct.name,
        description: selectedProduct.description,
        personalization: personalizedMessages[selectedProduct._id],
      };
      addToCart(itemToAdd);
      setIsFirstModalOpen(false);
      setIsSecondModalOpen(true);
    }
  };

  const handleGoToCart = () => {
    setIsFirstModalOpen(false);
    router.push('/cart');
  };

  const handlePlaceOrder = async () => {
    if (!selectedProduct) return;

    try {
      // Show processing state
      setProcessing(true);

      // Create order data
      const orderData = {
        cart_details: [
          {
            product_id: selectedProduct._id,
            quantity: quantity,
            personalized: personalizedMessages[selectedProduct._id] || null,
          },
        ],
      };

      // Place the order first (this creates the order in the database)
      const orderResponse = await placeOrder(orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to place order');
      }

      // Store order and payment IDs for confirmation after payment
      localStorage.setItem('order_id', orderResponse.data.order_id);
      localStorage.setItem('payment_id', orderResponse.data.payment_id);

      // If it's a free product, confirm the order immediately and redirect
      if (orderResponse.data.payment_type === 'free') {
        const confirmResponse = await confirmOrder(
          orderResponse.data.order_id,
          orderResponse.data.payment_id
        );

        if (confirmResponse) {
          removeFromCart(selectedProduct._id);
          closeModals();
          router.push('/thankyou');
        } else {
          throw new Error('Order confirmation failed');
        }
        return;
      }

      // For paid products, prepare PayFast payment
      const totalAmount = selectedProduct.price * quantity * 1.17; // Price + 17% tax
      const orderId = orderResponse.data.order_id;
      const orderDate = new Date().toISOString().split('T')[0];

      // Get PayFast token
      const tokenResponse = await fetch(
        `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
      );

      if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
      const responseData = await tokenResponse.json();
      const token = responseData.ACCESS_TOKEN;

      if (!token) throw new Error('Invalid token response from PayFast');

      // Generate signature
      const generateSignature = (merchantId: string, token: string): string => {
        const timestamp = new Date().getTime();
        return `SIG-${merchantId}-${timestamp}`;
      };

      // Create form data for PayFast
      const formData = {
        MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
        MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'My Merchant',
        TOKEN: token,
        PROCCODE: '00',
        TXNAMT: totalAmount.toFixed(2),
        CUSTOMER_MOBILE_NO: '03000000000', // This should ideally come from user profile
        CUSTOMER_EMAIL_ADDRESS: 'rizcmt195@gmail.com', // This should ideally come from user profile
        SIGNATURE: generateSignature(
          process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
          token
        ),
        VERSION: 'MY_VER_1.0',
        TXNDESC: `Payment for ${selectedProduct.name}`,
        SUCCESS_URL: `${window.location.origin}/success?order_id=${orderId}&payment_id=${orderResponse.data.payment_id}`,
        FAILURE_URL: `${window.location.origin}/failure`,
        BASKET_ID: orderId,
        ORDER_DATE: orderDate,
        CHECKOUT_URL: `${window.location.origin}/confirm`,
      };

      // Create and submit form to PayFast
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

      // Add form to document and submit
      document.body.appendChild(form);
      form.submit();

      // Clear the cart item after submission
      removeFromCart(selectedProduct._id);
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(
        error.message || 'An unexpected error occurred during checkout'
      );
      setProcessing(false);
    }
  };

  const handleSubCategoryClick = (subcategory: SubCategory) => {
    const subCategorySlug = subcategory.name.toLowerCase().replace(/\s+/g, '');
    router.push(`/subcategory/${subCategorySlug}`);
  };

  const handleBrandClick = (
    brandname: string,
    brandLogo: string,
    brandId: string
  ) => {
    const slug = brandname.toLowerCase().replace(/\s+/g, '');
    sessionStorage.setItem('brandLogo', brandLogo);
    router.push(`/${slug}/${brandId}`);
  };

  const handleReviewsClick = (productId: string) => {
    router.push(`/reviews/${productId}`);
  };

  return (
    <div className="at-categories">
      {/* {error && <p className="error-message">{error}</p>} */}
      <div className="text-4xl font-bold mb-6">Shop</div>
      <>
        <div className="at-pagesectiontitle">
          <h2>Browse by Sub Category</h2>
        </div>
        <div className="at-categoriesgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory  flex gap-4 ">
          {subCategoryLoading && (
            <div className="at-categoryitem flex gap-4 items-center">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 rounded-full bg-[#d6dadb]" />
                </div>
              ))}
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          {!subCategoryLoading && subcategories.length === 0 && !error && (
            <p>No sub categories available.</p>
          )}

          {!subCategoryLoading &&
            subcategories?.length > 0 &&
            subcategories?.map((subcategory: any) => (
              <div
                key={subcategory?._id}
                className="at-categoryitem cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubCategoryClick(subcategory);
                }}
              >
                <figure className="flex flex-col items-center">
                  <span className="at-imageparent">
                    {subcategory.image_path !== null ? (
                      <img
                        src={`${BASE_URL}/${subcategory.image_path}`}
                        alt={subcategory.name}
                      />
                    ) : (
                      <img
                        src={PRODUCT_PLACEHOLDER}
                        alt={
                          subcategory.name !== ''
                            ? subcategory.name
                            : 'Sub Category Name'
                        }
                      />
                    )}
                  </span>
                  <figcaption className="at-categorycontent text-center">
                    <h3 className="at-categorytitle font-bold text-[14px]">
                      {subcategory?.name}
                    </h3>
                  </figcaption>
                </figure>
              </div>
            ))}
        </div>

        {/*
          Shop by Brands
        */}
        <div className="at-pagesectiontitle">
          <h2>
            <br />
            <br />
            Shop by Brands
          </h2>
        </div>
        <div className="at-categoriesgrid  overflow-x-auto horizontal-scroll snap-x snap-mandatory">
          {brandsLoading && (
            <div className="at-categoryitem flex gap-4 items-center">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="h-24 w-24 px-5 py-3 bg-[#d6dadb]" />
                </div>
              ))}
            </div>
          )}
          {error && <p className="error-message">{error}</p>}
          {!brandsLoading && brands?.length === 0 && !error && (
            <p>No brands available.</p>
          )}
          {!brandsLoading &&
            brands?.length > 0 &&
            brands?.map((brand) => (
              <div
                key={brand._id}
                className="at-branditem flex items-center justify-center px-4 py-4 h-20 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md hover:border-gray-400 transition-all duration-200 bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleBrandClick(brand.name, brand.company_logo, brand._id);
                }}
              >
                <img src={brand.company_logo} alt={brand.name} />
              </div>
            ))}
        </div>

        {/*
        Featured Products
         */}
        <div className="at-pagesectiontitle mt-5">
          <h2>Featured Products</h2>
        </div>

        <div className="at-cardgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div className="at-carditem" key={index}>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-6 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => {
              const brand = brands.find((b) => b._id === product.company_id);
              // Apply background color based on category
              const bgColor = getProductBackgroundColor(product.category_id);
              return (
                <div
                  key={product._id}
                  className="at-carditem cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <figure
                    className="at-giftimage"
                    style={{ backgroundColor: bgColor }}
                  >
                    {product.sticker_path !== null ? (
                      <img src={product.sticker_path} alt={product.name} />
                    ) : (
                      <img
                        src={PRODUCT_PLACEHOLDER}
                        alt={
                          product.name !== '' ? product.name : 'Product Name'
                        }
                      />
                    )}
                  </figure>
                  <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
                    {' '}
                    {/* Padding and flex for content */}
                    <div>
                      {' '}
                      {/* Content wrapper */}
                      <div className="at-gifttitle flex items-start justify-between w-full mb-1">
                        <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 flex-1 mr-2 truncate">
                          {' '}
                          {/* Name styling */}
                          {product.name}
                        </h3>
                        <span className="text-right text-green-600 whitespace-nowrap font-bold text-sm">
                          {' '}
                          {/* Price styling */}
                          Rs.{product.price}
                        </span>
                      </div>
                      {brand && (
                        <h4 className="font-bold text-[10px]">{brand.name}</h4>
                      )}
                    </div>
                    {/* Optional: Display rating stars on card */}
                    {/* <RatingStars rating={Math.round(topPick.total_rating || 0)} size="small" /> */}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No featured products available.</p>
          )}
        </div>

        <div className="at-pagesectiontitle mt-5">
          <h2>All Products</h2>
        </div>

        <div className="at-cardgrid overflow-x-auto horizontal-scroll snap-x snap-mandatory ">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div
                className="at-carditem"
                key={`all-product-skeleton-${index}`}
              >
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-6 w-3/4 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </div>
            ))
          ) : allProducts.length > 0 ? (
            allProducts.map((product) => {
              const brand = brands.find((b) => b._id === product.company_id);
              // Apply background color based on category
              const bgColor = getProductBackgroundColor(product.category_id);
              return (
                <div
                  key={`all-${product._id}`}
                  className="at-carditem cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <figure
                    className="at-giftimage"
                    style={{ backgroundColor: bgColor }}
                  >
                    {product.sticker_path !== null ? (
                      <img src={product.sticker_path} alt={product.name} />
                    ) : (
                      <img
                        src={PRODUCT_PLACEHOLDER}
                        alt={
                          product.name !== '' ? product.name : 'Product Name'
                        }
                      />
                    )}
                  </figure>
                  {/* <div className="at-gifttitle flex items-center justify-between w-full font-bold">
                    <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 flex-1 mr-2 truncate">
                      {product.name}
                    </h3>
                    <span className="text-right text-[#40A574]">
                      Rs.{product.price}
                    </span>
                  </div> */}
                  <div className="at-giftdetails p-3 flex-grow flex flex-col justify-between">
                    {' '}
                    {/* Padding and flex for content */}
                    <div>
                      {' '}
                      {/* Content wrapper */}
                      <div className="at-gifttitle flex items-start justify-between w-full mb-1">
                        <h3 className="font-bold text-sm m-0 leading-tight text-gray-800 flex-1 mr-2 truncate">
                          {' '}
                          {/* Name styling */}
                          {product.name}
                        </h3>
                        <span className="text-right text-green-600 whitespace-nowrap font-bold text-sm">
                          {' '}
                          {/* Price styling */}
                          Rs.{product.price}
                        </span>
                      </div>
                      {brand && (
                        <h4 className="font-bold text-[10px]">{brand.name}</h4>
                      )}
                    </div>
                    {/* Optional: Display rating stars on card */}
                    {/* <RatingStars rating={Math.round(topPick.total_rating || 0)} size="small" /> */}
                  </div>
                 
                </div>
              );
            })
          ) : (
            <p>No products available.</p>
          )}
        </div>

        {/* First Modal */}
        {/* Personalization Modal */}
        {isFirstModalOpen &&
          selectedProduct &&
          (() => {
            const bgFirstModalColor = getProductBackgroundColor(
              selectedProduct.category_id
            );
            return (
              <div
                className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
                onClick={() => setIsFirstModalOpen(false)}
              >
                <div
                  className="bg-white rounded-lg shadow-lg at-modaldailouge"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center relative">
                    <div className="at-modalcontent p-0">
                      <div
                        className="at-modalleftside p-0"
                        style={{ backgroundColor: bgFirstModalColor }}
                      >
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
                        <figure className="at-productimg p-0 m-0">
                          {selectedProduct.background_image ? (
                            <img
                              src={
                                `${BASE_URL}/${selectedProduct.background_image[0]}` ||
                                PRODUCT_PLACEHOLDER
                              }
                              alt={selectedProduct.name}
                              className="w-full h-1/2 rounded-lg object-contain"
                            />
                          ) : (
                            <img
                              src={PRODUCT_PLACEHOLDER}
                              alt="Product Name"
                              className="w-full sm:w-24 h-24 rounded-lg object-cover"
                            />
                          )}
                        </figure>
                      </div>
                      <div className="at-popupcontentside">
                        <div className="at-popuptitlebrandimg">
                          <span>
                            <img
                              src={
                                brands.find(
                                  (b) => b._id === selectedProduct.company_id
                                )?.company_logo
                              }
                              alt=""
                            />
                          </span>
                          <div
                            className="at-popupproducttitlerating"
                            onClick={() =>
                              handleReviewsClick(selectedProduct._id)
                            }
                          >
                            <h4>
                              {
                                brands.find(
                                  (b) => b._id === selectedProduct.company_id
                                )?.name
                              }
                            </h4>
                            <p>3.1 km from you</p>
                            <RatingStars
                              rating={Math.round(selectedProduct.total_rating)}
                            />
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
                            <h3>Rs. {selectedProduct.price}</h3>
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
                                width="24"
                                height="24"
                                viewBox="0 0 128 128"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M64 0.3C28.7 0.3 0 28.8 0 64C0 99.2 28.7 127.7 64 127.7C99.3 127.7 128 99.2 128 64C128 28.8 99.3 0.3 64 0.3ZM64 121.3C32.2 121.3 6.4 95.7 6.4 64C6.4 32.3 32.2 6.7 64 6.7C95.8 6.7 121.6 32.4 121.6 64C121.6 95.7 95.8 121.3 64 121.3ZM38.4 58.9V66C38.4 68.2 40.2 69.9 42.3 69.9L57.6 57.7V86.4C57.6 88.6 59.9 89.6 62 89.6H66C68.2 89.6 69.9 87.8 69.9 85.7V57.2L85.7 69.9C87.9 69.9 89.6 68.1 89.6 66V58.9L64 32.2L38.4 58.9Z"
                                  fill="#FFFFFF"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={handleAddToCart}
                              className="at-btn"
                            >
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
                            onClick={() => {
                              console.log(
                                'Personalizing product:',
                                selectedProduct._id
                              );
                              handlePersonalize(selectedProduct._id);
                            }}
                          >
                            Personalize
                            <label className="custom-checkbox top-2">
                              <input
                                className="align-middle"
                                type="checkbox"
                                checked={hasPersonalization(
                                  selectedProduct._id
                                )}
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
              </div>
            );
          })()}

        {/* Second Modal */}

        {isSecondModalOpen &&
          selectedProduct &&
          (() => {
            const bgSecondModalColor = getProductBackgroundColor(
              selectedProduct.category_id
            );
            return (
              <div
                className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
                onClick={closeModals}
              >
                <div
                  className="bg-white rounded-lg shadow-lg at-modaldailouge"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center flex-col">
                    <div className="at-modalcontent p-0">
                      <div
                        className="at-modalleftside at-modalordersummeryleft p-0"
                        style={{ backgroundColor: bgSecondModalColor }}
                      >
                        <button
                          onClick={closeModals}
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
                        <figure className="at-productimg p-0 m-0">
                          {selectedProduct.background_image ? (
                            <img
                              src={`${BASE_URL}/${selectedProduct.background_image[0]}`}
                              alt={selectedProduct.name}
                            />
                          ) : (
                            <img
                              src={PRODUCT_PLACEHOLDER}
                              alt={
                                selectedProduct.name !== ''
                                  ? selectedProduct.name
                                  : 'Product Name'
                              }
                            />
                          )}
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
                            </li>
                            <li>
                              <span>Rs.{selectedProduct.price}</span>
                            </li>
                            <li>
                              <span>Sales Tax 17%</span>
                            </li>
                            <li>
                              <span>
                                Rs.
                                {(
                                  selectedProduct.price *
                                  0.17 *
                                  quantity
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
                        disabled={processing}
                      >
                        {processing ? 'Processing...' : 'Place Order'}
                      </button>
                      <Link href="/home">
                        <button type="button" className="at-btn at-btncancel">
                          Continue Shopping
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
      </>
    </div>
  );
};

export default ShopCategories;
