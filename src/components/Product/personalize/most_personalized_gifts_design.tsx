// // 'use client';
// // import { useEffect, useState } from 'react';
// // import { useRouter } from 'next/navigation';
// // import { useForm } from 'react-hook-form';
// // import {
// //   fetchMostUsedPersonalizedGifts,
// //   placeOrder,
// // } from '@/services/api.service';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { toast } from 'react-toastify';

// // const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// // // Renamed Interface
// // interface MostUsedPersonalizedGiftData {
// //   _id: string;
// //   name: string; // This name likely represents the occasion (Birthday, Wedding, etc.)
// //   icon_path: string;
// //   images: {
// //     image_id: string;
// //     image_path: string; // These images are the actual card templates
// //   }[];
// //   created_at: string;
// //   __v: number;
// // }

// // interface ApiResponse {
// //   success: boolean;
// //   message: string;
// //   data: MostUsedPersonalizedGiftData[]; // Use the renamed interface here
// // }

// // // Renamed Component Function
// // export default function MostUsedPersonalizedGifts() {
// //   // Renamed state variable
// //   const [mostUsedGifts, setMostUsedGifts] = useState<
// //   MostUsedPersonalizedGiftData[]
// //   >([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [error, setError] = useState<string | null>(null);
// //   // Renamed state variables for clarity
// //   const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
// //   const [selectedGift, setSelectedGift] =
// //   useState<MostUsedPersonalizedGiftData | null>(null);
// //   // This state stores user-entered messages, name is fine
// //   const [personalizedList, setPersonalizedList] = useState<
// //   { name: string; message: string; image_path: string; image_id: string }[]
// //   >([]);
// //   // State for the form inputs within the modal
// //   const [selectedName, setSelectedName] = useState<string>('');
// //   const [selectedMessage, setSelectedMessage] = useState<string>('');
  
// //   const {
// //     register,
// //     handleSubmit,
// //     formState: { errors },
// //     reset, // Added reset for clearing form after submission
// //   } = useForm<{
// //     name: string;
// //     message: string;
// //   }>();
  
// //   const router = useRouter();
// //   // Renamed modal open function
// //   const openGiftModal = (gift: MostUsedPersonalizedGiftData) => {
// //     setSelectedGift(gift);
// //     setSelectedName(''); // Clear previous input on opening
// //     setSelectedMessage(''); // Clear previous input on opening
// //     reset(); // Reset react-hook-form state as well
// //     setIsGiftModalOpen(true);
// //   };

// //   // Renamed modal close function
// //   const closeGiftModal = () => {
// //     reset();
// //     setIsGiftModalOpen(false);
// //     setSelectedGift(null); // Clear selected gift when closing
// //   };

// //   useEffect(() => {
// //     // Renamed internal function name for clarity
// //     const getMostUsedGiftsData = async () => {
// //       setLoading(true);
// //       setError(null); // Reset error state on new fetch
// //       try {
// //         // Call the original API fetch function
// //         const response: ApiResponse = await fetchMostUsedPersonalizedGifts();
// //         if (response && response.success) {
// //           // Use the renamed state setter
// //           setMostUsedGifts(response.data || []);
// //         } else {
// //           setError(response.message || 'Failed to fetch personalized gifts.');
// //         }
// //       } catch (err: any) {
// //         const errorMessage =
// //           err?.message ||
// //           err?.response?.data?.message ||
// //           'An error occurred while fetching personalized gifts.';
// //         console.error('Error fetching personalized gifts:', err);
// //         setError(errorMessage);
// //       } finally {
// //         setLoading(false);
// //       }

// //       // Load previously saved messages (logic remains the same)
// //       const storedMessages = localStorage.getItem('personalizedMessages');
// //       if (storedMessages) {
// //         try {
// //           const parsedMessages = JSON.parse(storedMessages);
// //           if (Array.isArray(parsedMessages)) {
// //             setPersonalizedList(parsedMessages);
// //           } else {
// //             console.warn('Stored personalizedMessages is not an array.');
// //             setPersonalizedList([]);
// //             localStorage.removeItem('personalizedMessages'); // Clear invalid data
// //           }
// //         } catch (e) {
// //           console.error(
// //             'Failed to parse personalizedMessages from localStorage',
// //             e
// //           );
// //           setPersonalizedList([]);
// //           localStorage.removeItem('personalizedMessages'); // Clear invalid data
// //         }
// //       } else {
// //         setPersonalizedList([]);
// //       }
// //     };

// //     getMostUsedGiftsData();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []); // Added dependency array comment to acknowledge potential linting rule

// //   const onSubmit = async (data: { name: string; message: string }) => {
// //     // Use the renamed state variable
// //     if (selectedGift) {
// //       // Ensure there's at least one image to use
// //       if (!selectedGift.images || selectedGift.images.length === 0) {
// //         toast.error('Selected gift has no images available.');
// //         setError('Selected gift has no images available.');
// //         return;
// //       }

// //       const orderData = {
// //         // 'data': '', // This seems unused or placeholder, consider removing if not needed
// //         cart_details: [
// //           // Use the renamed state variable
// //           { product_id: selectedGift._id, quantity: 1 },
// //         ],
// //         personalized: [
// //           {
// //             name: data.name, // Use data directly from react-hook-form submit
// //             message: data.message, // Use data directly from react-hook-form submit
// //             // Use the renamed state variable and safely access the first image
// //             image_path: selectedGift.images[0].image_path,
// //             image_id: selectedGift.images[0].image_id,
// //           },
// //         ],
// //       };

// //       // console.log('Placing order with data:', JSON.stringify(orderData, null, 2)); // Debug log

// //       try {
// //         // Call the original placeOrder function
// //         const response = await placeOrder(orderData);
// //         // console.log('Place order response:', response); // Debug log

// //         if (response.success) {
// //           const newMessage = {
// //             name: data.name, // Use form data
// //             message: data.message, // Use form data
// //             // Use the renamed state variable
// //             image_path: selectedGift.images[0].image_path,
// //             image_id: selectedGift.images[0].image_id,
// //           };

// //           // Update local storage list (logic remains the same)
// //           const updatedList = [...personalizedList, newMessage];
// //           setPersonalizedList(updatedList);
// //           localStorage.setItem(
// //             'personalizedMessages',
// //             JSON.stringify(updatedList)
// //           );

// //           // Clear state *after* successful submission
// //           setSelectedName('');
// //           setSelectedMessage('');
// //           closeGiftModal();
// //           router.push('/messages');
// //           toast.success('Personalization Message added successfully!'); // Changed message slightly for clarity
// //         } else {
// //           toast.error(response.message || 'Failed to place order.');
// //           setError(response.message || 'Failed to place order.');
// //         }
// //       } catch (err: any) {
// //         const errorMessage =
// //           err?.response?.data?.message ||
// //           err?.message ||
// //           'An error occurred while placing the order.';
// //         console.error('Error placing order:', err);
// //         toast.error(errorMessage);
// //         setError(errorMessage); // Set error state for potential display
// //       }
// //     } else {
// //       console.error('Submit handler called without a selected gift.');
// //       toast.error('No gift selected. Please try again.');
// //     }
// //   };

// //   // ----- UI Rendering (No structural or style changes) -----
// //   return (
// //     <>
// //       {/* Class names remain the same to preserve UI */}
// //       <div className="at-shopcategories ">
// //         <div className="at-shopcategoriesgrid image-paths-scroll horizontal-scroll">
// //           {/* Loading Skeleton */}
// //           {loading &&
// //             Array.from({ length: 5 }).map((_, index) => (
// //               <div className="at-shopcategorieitems" key={`skeleton-${index}`}>
// //                 <Skeleton className="h-40 w-full bg-gray-300 animate-pulse rounded-lg" />
// //               </div>
// //             ))}

// //           {/* Error Message Display */}
// //           {error && !loading && (
// //             <div className="w-full text-center text-red-600 p-4">
// //               <p>Error: {error}</p>
// //             </div>
// //           )}

// //           {/* No Data Message */}
// //           {!loading && mostUsedGifts.length === 0 && !error && (
// //             <div className="w-full text-center text-gray-500 p-4">
// //               <p>No personalized gifts available at the moment.</p>
// //             </div>
// //           )}

// //           {/* Display Gifts - Use renamed state variable */}
// //           {!loading &&
// //             mostUsedGifts.map((gift, index) => (
// //               <div
// //                 className="at-shopcategoriesgriditem cursor-pointer image-path-item"
// //                 key={`${gift._id}-${index}`} // Fixed key issue by adding index
// //                 onClick={() => openGiftModal(gift)} // Use renamed handler and variable
// //               >
// //                 <figure>
// //                   {/* Check if the first image exists and has a path */}
// //                   {gift.images &&
// //                   gift.images.length > 0 &&
// //                   gift.images[0]?.image_path ? (
// //                     <img
// //                       src={gift.images[0].image_path}
// //                       alt={gift.name || 'Personalized Gift'} // Use gift.name, provide default alt text
// //                       onError={(e) =>
// //                         (e.currentTarget.src = PRODUCT_PLACEHOLDER)
// //                       } // Add onError fallback
// //                     />
// //                   ) : (
// //                     <img
// //                       src={PRODUCT_PLACEHOLDER}
// //                       alt={gift.name || 'Personalized Gift Placeholder'}
// //                     />
// //                   )}
// //                   {/* Consider adding gift.name as a caption below the image if needed */}
// //                   {/* <figcaption className="text-center text-sm mt-1">{gift.name}</figcaption> */}
// //                 </figure>
// //               </div>
// //             ))}
// //         </div>
// //       </div>

// //       {/* Modal - Use renamed state variable */}
// //       {isGiftModalOpen && (
// //         <div
// //           className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
// //           onClick={closeGiftModal} // Use renamed handler
// //         >
// //           {/* Modal Content - class names remain the same */}
// //           <div
// //             className="bg-white rounded-lg shadow-lg at-modaldailouge"
// //             onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
// //           >
// //             <div className="flex justify-between items-center">
// //               <div className="at-modalcontent p-0">
// //                 {/* Close Button */}
// //                 <button
// //                   onClick={closeGiftModal} // Use renamed handler
// //                   className="at-btnpopupclose at-btnpopupclosetwo"
// //                   aria-label="Close personalization modal" // Added aria-label for accessibility
// //                 >
// //                   {/* SVG remains the same */}
// //                   <svg
// //                     width="32"
// //                     height="32"
// //                     viewBox="0 0 32 32"
// //                     fill="none"
// //                     xmlns="http://www.w3.org/2000/svg"
// //                   >
// //                     <circle cx="16" cy="16" r="16" fill="white" />
// //                     <path
// //                       d="M11.0508 21.9492C10.7947 21.9492 10.5386 21.8521 10.344 21.656C9.95337 21.2654 9.95337 20.6321 10.344 20.2415L20.2439 10.3413C20.6348 9.95068 21.2681 9.95068 21.6587 10.3413C22.0493 10.7319 22.0493 11.3652 21.6587 11.7561L11.7585 21.656C11.5613 21.8521 11.3054 21.9492 11.0508 21.9492Z"
// //                       fill="#434343"
// //                     />
// //                     <path
// //                       d="M20.9492 21.9492C20.6933 21.9492 20.4372 21.8521 20.2426 21.656L10.3427 11.7573C9.95184 11.3667 9.95184 10.7334 10.3427 10.3428C10.7333 9.9519 11.3666 9.9519 11.7573 10.3428L21.6572 20.2427C22.048 20.6333 22.048 21.2666 21.6572 21.6572C21.4614 21.8521 21.2053 21.9492 20.9492 21.9492Z"
// //                       fill="#434343"
// //                     />
// //                   </svg>
// //                 </button>

// //                 {/* Modal Left Side (Image) - Use renamed state variable */}
// //                 <div className="at-modalleftside p-0">
// //                   {selectedGift && (
// //                     <figure className="at-productimg p-0 m-0">
// //                       {/* Check image existence */}
// //                       {selectedGift.images &&
// //                       selectedGift.images.length > 0 &&
// //                       selectedGift.images[0]?.image_path ? (
// //                         <img
// //                           src={selectedGift.images[0].image_path}
// //                           alt={
// //                             selectedGift.name || 'Selected Personalized Gift'
// //                           }
// //                           onError={(e) =>
// //                             (e.currentTarget.src = PRODUCT_PLACEHOLDER)
// //                           } // Add onError fallback
// //                         />
// //                       ) : (
// //                         <img
// //                           src={PRODUCT_PLACEHOLDER}
// //                           alt={
// //                             selectedGift.name || 'Personalized Gift Placeholder'
// //                           }
// //                         />
// //                       )}
// //                     </figure>
// //                   )}
// //                 </div>

// //                 {/* Modal Right Side (Form) */}
// //                 <div className="at-popupcontentside">
// //                   <div className="at-popupproducttitlerating mb-3">
// //                     {/* Title remains generic */}
// //                     <h4>Personalize your Gift</h4>
// //                     {/* Display the type of gift being personalized */}
// //                     {selectedGift && (
// //                       <p className="text-sm text-gray-600 mt-1">
// //                         Template: {selectedGift.name}
// //                       </p>
// //                     )}
// //                   </div>
// //                   {/* Form uses react-hook-form */}
// //                   <form onSubmit={handleSubmit(onSubmit)}>
// //                     <div className="at-popupproducttitlerating at-widthfull">
// //                       <div className="form-group at-inputshadow">
// //                         {/* Name Input */}
// //                         <label
// //                           htmlFor="personalizedName"
// //                           className="block text-sm font-medium text-gray-700 mb-1"
// //                         >
// //                           Name
// //                         </label>
// //                         <input
// //                           id="personalizedName"
// //                           type="text"
// //                           placeholder="Enter name for the card"
// //                           className={`w-full p-2 border rounded ${
// //                             errors.name ? 'border-red-500' : 'border-gray-300'
// //                           }`} // Basic styling for visibility
// //                           {...register('name', {
// //                             required: 'Name is required',
// //                             maxLength: {
// //                               value: 50,
// //                               message: 'Name cannot exceed 50 characters',
// //                             },
// //                           })}
// //                           // Removed value and onChange, let react-hook-form control it
// //                           // value={selectedName}
// //                           // onChange={(e) => setSelectedName(e.target.value)}
// //                           aria-invalid={errors.name ? 'true' : 'false'} // Accessibility
// //                         />
// //                         {errors.name && (
// //                           <span className="text-red-600 text-xs mt-1 block">
// //                             {errors.name.message}
// //                           </span>
// //                         )}

// //                         {/* Message Textarea */}
// //                         <label
// //                           htmlFor="personalizedMessage"
// //                           className="block text-sm font-medium text-gray-700 mt-4 mb-1"
// //                         >
// //                           Message
// //                         </label>
// //                         <textarea
// //                           id="personalizedMessage"
// //                           placeholder="Enter your message"
// //                           rows={4} // Give it a bit more default height
// //                           className={`w-full p-2 border rounded ${
// //                             errors.message
// //                               ? 'border-red-500'
// //                               : 'border-gray-300'
// //                           }`} // Basic styling
// //                           {...register('message', {
// //                             required: 'Message is required',
// //                             maxLength: {
// //                               value: 300,
// //                               message: 'Message cannot exceed 300 characters',
// //                             },
// //                           })}
// //                           // Removed value and onChange
// //                           // value={selectedMessage}
// //                           // onChange={(e) => setSelectedMessage(e.target.value)}
// //                           aria-invalid={errors.message ? 'true' : 'false'} // Accessibility
// //                         />
// //                         {errors.message && (
// //                           <span className="text-red-600 text-xs mt-1 block">
// //                             {errors.message.message}
// //                           </span>
// //                         )}
// //                       </div>
// //                     </div>
// //                     {/* Submit Button */}
// //                     <div className="at-btnaddtocart mt-6">
// //                       {' '}
// //                       {/* Adjusted margin slightly */}
// //                       <button
// //                         type="submit"
// //                         className="at-btn at-btnpersonal w-full md:w-auto"
// //                       >
// //                         {' '}
// //                         {/* Make full width on small screens */}
// //                         Add Personalization
// //                       </button>
// //                     </div>
// //                   </form>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // }



// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import {
//   fetchMostUsedPersonalizedGifts,
//   placeOrder,
// } from '@/services/api.service';
// import { Skeleton } from '@/components/ui/skeleton';
// import { toast } from 'react-toastify';

// const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// interface MostUsedPersonalizedGiftData {
//   _id: string;
//   name: string; // This name likely represents the occasion (Birthday, Wedding, etc.)
//   icon_path: string;
//   images: {
//     image_id: string;
//     image_path: string; // These images are the actual card templates
//   }[];
//   created_at: string;
//   __v: number;
// }

// // Add matching structure with MessagesPage
// interface PersonalizedMessage {
//   category: string;  // Adding category field to match MessagesPage
//   name: string;
//   message: string;
//   image_path: string;
//   image_id: string;
//   productId?: string;
// }

// interface ApiResponse {
//   success: boolean;
//   message: string;
//   data: MostUsedPersonalizedGiftData[];
// }

// export default function MostUsedPersonalizedGifts() {
//   const [mostUsedGifts, setMostUsedGifts] = useState<MostUsedPersonalizedGiftData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
//   const [selectedGift, setSelectedGift] = useState<MostUsedPersonalizedGiftData | null>(null);
  
//   // Updated to match the structure expected in MessagesPage
//   const [personalizedMessages, setPersonalizedMessages] = useState<{
//     [key: string]: PersonalizedMessage[];
//   }>({});
  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<{
//     name: string;
//     message: string;
//   }>();
  
//   const router = useRouter();
  
//   const openGiftModal = (gift: MostUsedPersonalizedGiftData) => {
//     setSelectedGift(gift);
//     reset();
//     setIsGiftModalOpen(true);
//   };

//   const closeGiftModal = () => {
//     reset();
//     setIsGiftModalOpen(false);
//     setSelectedGift(null);
//   };

//   useEffect(() => {
//     const getMostUsedGiftsData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response: ApiResponse = await fetchMostUsedPersonalizedGifts();
//         if (response && response.success) {
//           setMostUsedGifts(response.data || []);
//         } else {
//           setError(response.message || 'Failed to fetch personalized gifts.');
//         }
//       } catch (err: any) {
//         const errorMessage =
//           err?.message ||
//           err?.response?.data?.message ||
//           'An error occurred while fetching personalized gifts.';
//         console.error('Error fetching personalized gifts:', err);
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }

//       // Load previously saved messages with updated structure
//       const storedMessages = localStorage.getItem('personalizedMessages');
//       if (storedMessages) {
//         try {
//           // Try to parse as the new object structure
//           const parsedMessages = JSON.parse(storedMessages);
//           if (typeof parsedMessages === 'object' && !Array.isArray(parsedMessages)) {
//             setPersonalizedMessages(parsedMessages);
//           } else if (Array.isArray(parsedMessages)) {
//             // If it's still an array, convert to the expected object format
//             // Use a generic product ID since we don't have specific ones
//             const convertedMessages = {
//               'generic': parsedMessages.map(msg => ({
//                 ...msg,
//                 category: 'Custom', // Add a default category
//                 productId: 'generic'
//               }))
//             };
//             setPersonalizedMessages(convertedMessages);
//             // Update localStorage with the new structure
//             localStorage.setItem('personalizedMessages', JSON.stringify(convertedMessages));
//           } else {
//             console.warn('Stored personalizedMessages is not valid.');
//             setPersonalizedMessages({});
//             localStorage.removeItem('personalizedMessages');
//           }
//         } catch (e) {
//           console.error(
//             'Failed to parse personalizedMessages from localStorage',
//             e
//           );
//           setPersonalizedMessages({});
//           localStorage.removeItem('personalizedMessages');
//         }
//       } else {
//         setPersonalizedMessages({});
//       }
//     };

//     getMostUsedGiftsData();
//   }, []);

//   const onSubmit = async (data: { name: string; message: string }) => {
//     if (selectedGift) {
//       if (!selectedGift.images || selectedGift.images.length === 0) {
//         toast.error('Selected gift has no images available.');
//         setError('Selected gift has no images available.');
//         return;
//       }

//       const orderData = {
//         cart_details: [
//           { product_id: selectedGift._id, quantity: 1 },
//         ],
//         personalized: [
//           {
//             name: data.name,
//             message: data.message,
//             image_path: selectedGift.images[0].image_path,
//             image_id: selectedGift.images[0].image_id,
//           },
//         ],
//       };

//       try {
//         const response = await placeOrder(orderData);

//         if (response.success) {
//           // Create new message with the structure expected by MessagesPage
//           const newMessage: PersonalizedMessage = {
//             category: selectedGift.name || 'Custom', // Use gift name as category
//             name: data.name,
//             message: data.message,
//             image_path: selectedGift.images[0].image_path,
//             image_id: selectedGift.images[0].image_id,
//             productId: selectedGift._id
//           };

//           // Update localStorage with the new structure
//           const productId = selectedGift._id;
//           const updatedMessages = { ...personalizedMessages };
          
//           if (!updatedMessages[productId]) {
//             updatedMessages[productId] = [];
//           }
          
//           updatedMessages[productId].push(newMessage);
//           setPersonalizedMessages(updatedMessages);
//           localStorage.setItem('personalizedMessages', JSON.stringify(updatedMessages));

//           closeGiftModal();
//           router.push('/messages');
//           toast.success('Personalization Message added successfully!');
//         } else {
//           toast.error(response.message || 'Failed to place order.');
//           setError(response.message || 'Failed to place order.');
//         }
//       } catch (err: any) {
//         const errorMessage =
//           err?.response?.data?.message ||
//           err?.message ||
//           'An error occurred while placing the order.';
//         console.error('Error placing order:', err);
//         toast.error(errorMessage);
//         setError(errorMessage);
//       }
//     } else {
//       console.error('Submit handler called without a selected gift.');
//       toast.error('No gift selected. Please try again.');
//     }
//   };

//   // UI Rendering (No structural or style changes)
//   return (
//     <>
//       <div className="at-shopcategories ">
//         <div className="at-shopcategoriesgrid image-paths-scroll horizontal-scroll">
//           {loading &&
//             Array.from({ length: 5 }).map((_, index) => (
//               <div className="at-shopcategorieitems" key={`skeleton-${index}`}>
//                 <Skeleton className="h-40 w-full bg-gray-300 animate-pulse rounded-lg" />
//               </div>
//             ))}

//           {error && !loading && (
//             <div className="w-full text-center text-red-600 p-4">
//               <p>Error: {error}</p>
//             </div>
//           )}

//           {!loading && mostUsedGifts.length === 0 && !error && (
//             <div className="w-full text-center text-gray-500 p-4">
//               <p>No personalized gifts available at the moment.</p>
//             </div>
//           )}

//           {!loading &&
//             mostUsedGifts.map((gift, index) => (
//               <div
//                 className="at-shopcategoriesgriditem cursor-pointer image-path-item"
//                 key={`${gift._id}-${index}`}
//                 onClick={() => openGiftModal(gift)}
//               >
//                 <figure>
//                   {gift.images &&
//                   gift.images.length > 0 &&
//                   gift.images[0]?.image_path ? (
//                     <img
//                       src={gift.images[0].image_path}
//                       alt={gift.name || 'Personalized Gift'} 
//                       onError={(e) => (e.currentTarget.src = PRODUCT_PLACEHOLDER)}
//                     />
//                   ) : (
//                     <img
//                       src={PRODUCT_PLACEHOLDER}
//                       alt={gift.name || 'Personalized Gift Placeholder'}
//                     />
//                   )}
//                 </figure>
//               </div>
//             ))}
//         </div>
//       </div>

//       {isGiftModalOpen && (
//         <div
//           className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
//           onClick={closeGiftModal}
//         >
//           <div
//             className="bg-white rounded-lg shadow-lg at-modaldailouge"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center">
//               <div className="at-modalcontent p-0">
//                 <button
//                   onClick={closeGiftModal}
//                   className="at-btnpopupclose at-btnpopupclosetwo"
//                   aria-label="Close personalization modal"
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
//                   {selectedGift && (
//                     <figure className="at-productimg p-0 m-0">
//                       {selectedGift.images &&
//                       selectedGift.images.length > 0 &&
//                       selectedGift.images[0]?.image_path ? (
//                         <img
//                           src={selectedGift.images[0].image_path}
//                           alt={selectedGift.name || 'Selected Personalized Gift'}
//                           onError={(e) => (e.currentTarget.src = PRODUCT_PLACEHOLDER)}
//                         />
//                       ) : (
//                         <img
//                           src={PRODUCT_PLACEHOLDER}
//                           alt={selectedGift.name || 'Personalized Gift Placeholder'}
//                         />
//                       )}
//                     </figure>
//                   )}
//                 </div>

//                 <div className="at-popupcontentside">
//                   <div className="at-popupproducttitlerating mb-3">
//                     <h4>Personalize your Gift</h4>
//                     {selectedGift && (
//                       <p className="text-sm text-gray-600 mt-1">
//                         Template: {selectedGift.name}
//                       </p>
//                     )}
//                   </div>
//                   <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className="at-popupproducttitlerating at-widthfull">
//                       <div className="form-group at-inputshadow">
//                         <label
//                           htmlFor="personalizedName"
//                           className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                           Name
//                         </label>
//                         <input
//                           id="personalizedName"
//                           type="text"
//                           placeholder="Enter name for the card"
//                           className={`w-full p-2 border rounded ${
//                             errors.name ? 'border-red-500' : 'border-gray-300'
//                           }`}
//                           {...register('name', {
//                             required: 'Name is required',
//                             maxLength: {
//                               value: 50,
//                               message: 'Name cannot exceed 50 characters',
//                             },
//                           })}
//                           aria-invalid={errors.name ? 'true' : 'false'}
//                         />
//                         {errors.name && (
//                           <span className="text-red-600 text-xs mt-1 block">
//                             {errors.name.message}
//                           </span>
//                         )}

//                         <label
//                           htmlFor="personalizedMessage"
//                           className="block text-sm font-medium text-gray-700 mt-4 mb-1"
//                         >
//                           Message
//                         </label>
//                         <textarea
//                           id="personalizedMessage"
//                           placeholder="Enter your message"
//                           rows={4}
//                           className={`w-full p-2 border rounded ${
//                             errors.message ? 'border-red-500' : 'border-gray-300'
//                           }`}
//                           {...register('message', {
//                             required: 'Message is required',
//                             maxLength: {
//                               value: 300,
//                               message: 'Message cannot exceed 300 characters',
//                             },
//                           })}
//                           aria-invalid={errors.message ? 'true' : 'false'}
//                         />
//                         {errors.message && (
//                           <span className="text-red-600 text-xs mt-1 block">
//                             {errors.message.message}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="at-btnaddtocart mt-6">
//                       <button
//                         type="submit"
//                         className="at-btn at-btnpersonal w-full md:w-auto"
//                       >
//                         Add Personalization
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  fetchMostUsedPersonalizedGifts,
  placeOrder,
} from '@/services/api.service';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

interface MostUsedPersonalizedGiftData {
  _id: string;
  name: string; // This name likely represents the occasion (Birthday, Wedding, etc.)
  icon_path: string;
  images: {
    image_id: string;
    image_path: string; // These images are the actual card templates
  }[];
  created_at: string;
  __v: number;
}

// Add matching structure with MessagesPage
interface PersonalizedMessage {
  category: string;  // Adding category field to match MessagesPage
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: MostUsedPersonalizedGiftData[];
}

export default function MostUsedPersonalizedGifts() {
  const [mostUsedGifts, setMostUsedGifts] = useState<MostUsedPersonalizedGiftData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<MostUsedPersonalizedGiftData | null>(null);
  
  // Updated to match the structure expected in MessagesPage
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage[];
  }>({});
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    name: string;
    message: string;
  }>();
  
  const router = useRouter();
  
  const openGiftModal = (gift: MostUsedPersonalizedGiftData) => {
    setSelectedGift(gift);
    reset();
    setIsGiftModalOpen(true);
  };

  const closeGiftModal = () => {
    reset();
    setIsGiftModalOpen(false);
    setSelectedGift(null);
  };

  useEffect(() => {
    const getMostUsedGiftsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: ApiResponse = await fetchMostUsedPersonalizedGifts();
        if (response && response.success) {
          setMostUsedGifts(response.data || []);
        } else {
          setError(response.message || 'Failed to fetch personalized gifts.');
        }
      } catch (err: any) {
        const errorMessage =
          err?.message ||
          err?.response?.data?.message ||
          'An error occurred while fetching personalized gifts.';
        console.error('Error fetching personalized gifts:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }

      // Load previously saved messages with updated structure
      const storedMessages = localStorage.getItem('personalizedMessages');
      if (storedMessages) {
        try {
          // Try to parse as object structure (gift name -> messages)
          const parsedMessages = JSON.parse(storedMessages);
          if (typeof parsedMessages === 'object' && !Array.isArray(parsedMessages)) {
            setPersonalizedMessages(parsedMessages);
          } else if (Array.isArray(parsedMessages)) {
            // If it's still an array (old format), convert to object with gift name as key
            const convertedMessages = {
              'Custom Gift': parsedMessages.map(msg => ({
                ...msg,
                category: 'Custom', // Add a default category
              }))
            };
            setPersonalizedMessages(convertedMessages);
            // Update localStorage with the new structure
            localStorage.setItem('personalizedMessages', JSON.stringify(convertedMessages));
          } else {
            console.warn('Stored personalizedMessages is not valid.');
            setPersonalizedMessages({});
            localStorage.removeItem('personalizedMessages');
          }
        } catch (e) {
          console.error(
            'Failed to parse personalizedMessages from localStorage',
            e
          );
          setPersonalizedMessages({});
          localStorage.removeItem('personalizedMessages');
        }
      } else {
        setPersonalizedMessages({});
      }
    };

    getMostUsedGiftsData();
  }, []);

  const onSubmit = async (data: { name: string; message: string }) => {
    if (selectedGift) {
      if (!selectedGift.images || selectedGift.images.length === 0) {
        toast.error('Selected gift has no images available.');
        setError('Selected gift has no images available.');
        return;
      }

      const orderData = {
        cart_details: [
          { product_id: selectedGift._id, quantity: 1 },
        ],
        personalized: [
          {
            name: data.name,
            message: data.message,
            image_path: selectedGift.images[0].image_path,
            image_id: selectedGift.images[0].image_id,
          },
        ],
      };

      try {
        const response = await placeOrder(orderData);

        if (response.success) {
          // Create new message with the structure expected by MessagesPage
          const newMessage: PersonalizedMessage = {
            category: selectedGift.name || 'Custom', // Use gift name as category
            name: data.name,
            message: data.message,
            image_path: selectedGift.images[0].image_path,
            image_id: selectedGift.images[0].image_id,
            productId: selectedGift._id
          };

          // Update localStorage using the GIFT NAME as the key (not the ID)
          // This matches how the product detail page stores messages
          const giftName = selectedGift.name || 'Custom Gift';
          const updatedMessages = { ...personalizedMessages };
          
          if (!updatedMessages[giftName]) {
            updatedMessages[giftName] = [];
          }
          
          updatedMessages[giftName].push(newMessage);
          setPersonalizedMessages(updatedMessages);
          localStorage.setItem('personalizedMessages', JSON.stringify(updatedMessages));

          // Also store the selected gift name for reference
          localStorage.setItem('selectedGiftName', giftName);
          
          closeGiftModal();
          router.push('/messages');
          toast.success('Personalization Message added successfully!');
        } else {
          toast.error(response.message || 'Failed to place order.');
          setError(response.message || 'Failed to place order.');
        }
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          'An error occurred while placing the order.';
        console.error('Error placing order:', err);
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } else {
      console.error('Submit handler called without a selected gift.');
      toast.error('No gift selected. Please try again.');
    }
  };

  // UI Rendering (No structural or style changes)
  return (
    <>
      <div className="at-shopcategories ">
        <div className="at-shopcategoriesgrid image-paths-scroll horizontal-scroll">
          {loading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div className="at-shopcategorieitems" key={`skeleton-${index}`}>
                <Skeleton className="h-40 w-full bg-gray-300 animate-pulse rounded-lg" />
              </div>
            ))}

          {error && !loading && (
            <div className="w-full text-center text-red-600 p-4">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && mostUsedGifts.length === 0 && !error && (
            <div className="w-full text-center text-gray-500 p-4">
              <p>No personalized gifts available at the moment.</p>
            </div>
          )}

          {!loading &&
            mostUsedGifts.map((gift, index) => (
              <div
                className="at-shopcategoriesgriditem cursor-pointer image-path-item"
                key={`${gift._id}-${index}`}
                onClick={() => openGiftModal(gift)}
              >
                <figure>
                  {gift.images &&
                  gift.images.length > 0 &&
                  gift.images[0]?.image_path ? (
                    <img
                      src={gift.images[0].image_path}
                      alt={gift.name || 'Personalized Gift'} 
                      onError={(e) => (e.currentTarget.src = PRODUCT_PLACEHOLDER)}
                    />
                  ) : (
                    <img
                      src={PRODUCT_PLACEHOLDER}
                      alt={gift.name || 'Personalized Gift Placeholder'}
                    />
                  )}
                </figure>
              </div>
            ))}
        </div>
      </div>

      {isGiftModalOpen && (
        <div
          className="fixed inset-0 z-[99] p-5 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeGiftModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg at-modaldailouge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div className="at-modalcontent p-0">
                <button
                  onClick={closeGiftModal}
                  className="at-btnpopupclose at-btnpopupclosetwo"
                  aria-label="Close personalization modal"
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
                  {selectedGift && (
                    <figure className="at-productimg p-0 m-0">
                      {selectedGift.images &&
                      selectedGift.images.length > 0 &&
                      selectedGift.images[0]?.image_path ? (
                        <img
                          src={selectedGift.images[0].image_path}
                          alt={selectedGift.name || 'Selected Personalized Gift'}
                          onError={(e) => (e.currentTarget.src = PRODUCT_PLACEHOLDER)}
                        />
                      ) : (
                        <img
                          src={PRODUCT_PLACEHOLDER}
                          alt={selectedGift.name || 'Personalized Gift Placeholder'}
                        />
                      )}
                    </figure>
                  )}
                </div>

                <div className="at-popupcontentside">
                  <div className="at-popupproducttitlerating mb-3">
                    <h4>Personalize your Gift</h4>
                    {selectedGift && (
                      <p className="text-sm text-gray-600 mt-1">
                        Template: {selectedGift.name}
                      </p>
                    )}
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="at-popupproducttitlerating at-widthfull">
                      <div className="form-group at-inputshadow">
                        <label
                          htmlFor="personalizedName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          id="personalizedName"
                          type="text"
                          placeholder="Enter name for the card"
                          className={`w-full p-2 border rounded ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          {...register('name', {
                            required: 'Name is required',
                            maxLength: {
                              value: 50,
                              message: 'Name cannot exceed 50 characters',
                            },
                          })}
                          aria-invalid={errors.name ? 'true' : 'false'}
                        />
                        {errors.name && (
                          <span className="text-red-600 text-xs mt-1 block">
                            {errors.name.message}
                          </span>
                        )}

                        <label
                          htmlFor="personalizedMessage"
                          className="block text-sm font-medium text-gray-700 mt-4 mb-1"
                        >
                          Message
                        </label>
                        <textarea
                          id="personalizedMessage"
                          placeholder="Enter your message"
                          rows={4}
                          className={`w-full p-2 border rounded ${
                            errors.message ? 'border-red-500' : 'border-gray-300'
                          }`}
                          {...register('message', {
                            required: 'Message is required',
                            maxLength: {
                              value: 300,
                              message: 'Message cannot exceed 300 characters',
                            },
                          })}
                          aria-invalid={errors.message ? 'true' : 'false'}
                        />
                        {errors.message && (
                          <span className="text-red-600 text-xs mt-1 block">
                            {errors.message.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="at-btnaddtocart mt-6">
                      <button
                        type="submit"
                        className="at-btn at-btnpersonal w-full md:w-auto"
                      >
                        Add Personalization
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}