// // // src/app/thankyou/page.tsx
// // 'use client';
// // import { useEffect, useState } from 'react';
// // import { toast } from 'react-toastify';
// // import { fetchOrderHistory } from '@/services/api.service';

// // interface PersonalizedMessage {
// //   name: string;
// //   message: string;
// //   image_path: string;
// //   image_id: string;
// //   productId?: string;
// // }

// // interface LatestOrder {
// //   productName: string | null;
// //   productImage: string | null;
// //   orderNumber: string;
// //   price: number;
// //   url: string;
// //   stickerPath: string | null;
// //   // description: string | null;
// //   customerName: string;
// //   companyName: string;
// //   created_at: string;
// //   personalized?: PersonalizedMessage | null;
// // }

// // const PLACEHOLDER_IMAGE = '/images/logoicons.png';

// // const ThankYou = () => {
// //   const [latestOrder, setLatestOrder] = useState<LatestOrder | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const getLatestOrder = async () => {
// //       try {
// //         const response = await fetchOrderHistory();
// //         if (response.success && response.data.length > 0) {
// //           // Get the most recent order
// //           const mostRecentOrder = response.data[0];
// //           const orderItem = mostRecentOrder.cart_details[0];

// //           // Try multiple ways to extract the personalized message
// //           let personalizedMessage = null;

// //           // Method 1: Check if personalized exists directly as an object or JSON string
// //           if (orderItem.personalized) {
// //             try {
// //               // If it's a string, try to parse it
// //               if (typeof orderItem.personalized === 'string') {
// //                 personalizedMessage = JSON.parse(orderItem.personalized);
// //               } else {
// //                 // If it's already an object
// //                 personalizedMessage = orderItem.personalized;
// //               }
// //             } catch (e) {
// //               console.error('Failed to parse personalized message:', e);
// //             }
// //           }

// //           // Method 2: Check if it's stored elsewhere in the order item
// //           if (
// //             !personalizedMessage &&
// //             orderItem.product_id &&
// //             orderItem.product_id._id
// //           ) {
// //             // Try to get from localStorage based on product ID
// //             const storedSelectedMessages =
// //               typeof window !== 'undefined'
// //                 ? localStorage.getItem('selectedPersonalizedMessages')
// //                 : null;
// //             if (storedSelectedMessages) {
// //               try {
// //                 const parsedMessages: PersonalizedMessage[] = JSON.parse(
// //                   storedSelectedMessages
// //                 );
// //                 personalizedMessage =
// //                   parsedMessages.find(
// //                     (msg) => msg.productId === orderItem.product_id._id
// //                   ) || null;
// //               } catch (e) {
// //                 console.error('Failed to parse stored messages:', e);
// //               }
// //             }
// //           }

// //           // Log for debugging
// //           console.log('Order data:', mostRecentOrder);
// //           console.log('Order item:', orderItem);
// //           console.log('Extracted personalized message:', personalizedMessage);

// //           setLatestOrder({
// //             productName:
// //               orderItem.product_id.name !== null
// //                 ? orderItem.product_id.name
// //                 : 'Product Name',
// //             productImage:
// //               orderItem.product_id.sticker_path !== null
// //                 ? orderItem.product_id.sticker_path
// //                 : PLACEHOLDER_IMAGE,
// //             orderNumber: orderItem.order_number,
// //             price: orderItem.orderPrice,
// //             url: orderItem.url,
// //             stickerPath: orderItem.product_id.sticker_path_2,
// //             customerName: mostRecentOrder.customer_id.full_name,
// //             companyName: orderItem.product_id.company_id.name,
// //             created_at: mostRecentOrder.created_at,
// //             personalized: personalizedMessage,
// //           });
// //           // description:
// //           //   orderItem.product_id.description || 'Product Description',
// //         } else {
// //           setError('No orders found');
// //         }
// //       } catch (error: any) {
// //         console.error('Error fetching order history:', error);
// //         setError(error.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     getLatestOrder();
// //   }, []);

// //   // Just after the component mounts, let's also check localStorage directly
// //   useEffect(() => {
// //     const storedSelectedMessages =
// //       typeof window !== 'undefined'
// //         ? localStorage.getItem('selectedPersonalizedMessages')
// //         : null;
// //     if (storedSelectedMessages) {
// //       console.log(
// //         'Found stored personalized messages:',
// //         storedSelectedMessages
// //       );
// //     } else {
// //       console.log('No stored personalized messages found in localStorage');
// //     }
// //   }, []);

// //   const handleShare = async (platform: string) => {
// //     if (!latestOrder) return;

// //     try {
// //       // Check localStorage one more time when sharing
// //       let personalizedText = '';

// //       if (latestOrder.personalized) {
// //         personalizedText = `\nPersonalized Message: "${latestOrder.personalized.message}" - From ${latestOrder.personalized.name}`;
// //       } else {
// //         // Fallback to localStorage if the personalized message wasn't loaded with the order
// //         const storedSelectedMessages =
// //           typeof window !== 'undefined'
// //             ? localStorage.getItem('selectedPersonalizedMessages')
// //             : null;
// //         if (storedSelectedMessages) {
// //           try {
// //             const parsedMessages = JSON.parse(storedSelectedMessages);
// //             // Get the first message or find one matching this product if possible
// //             const firstMessage = parsedMessages[0];
// //             if (firstMessage) {
// //               personalizedText = `\nPersonalized Message: "${firstMessage.message}" - From ${firstMessage.name}`;
// //             }
// //           } catch (e) {
// //             console.error('Error parsing stored messages during share:', e);
// //           }
// //         }
// //       }

// //       const shareText = `
// //       Check out this ${latestOrder.productName || 'Product'} from ${
// //         latestOrder.companyName || 'Company'
// //       }!
// //       Order #${latestOrder.orderNumber || 'Order Number'}
// //       Price: $${latestOrder.price.toFixed(2) || 'Price'}
// //       ${latestOrder.url || 'URL'}
// //       `;

// //       // ${latestOrder.description || 'Description'}${personalizedText}
      


// //       console.log('Sharing text:', shareText);

// //       switch (platform) {
// //         case 'whatsapp':
// //           const whatsappText = encodeURIComponent(shareText);
// //           window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
// //           break;

// //         case 'messenger':
// //           await navigator.clipboard.writeText(shareText);
// //           toast.success('Link copied! Opening Messenger...');

// //           // Include the personalized message in the messenger link if available
// //           const messengerQuote = personalizedText
// //             ? `&quote=${encodeURIComponent(personalizedText.trim())}`
// //             : '';

// //           const messengerAppUrl = `fb-messenger://share/?link=${encodeURIComponent(
// //             latestOrder.url
// //           )}${messengerQuote}`;

// //           window.location.href = messengerAppUrl;

// //           setTimeout(() => {
// //             window.open('https://www.messenger.com', '_blank');
// //           }, 1000);
// //           break;

// //         case 'instagram':
// //           await navigator.clipboard.writeText(shareText);
// //           toast.success('Link copied! Opening Instagram...');
// //           window.open('https://instagram.com/direct/inbox', '_blank');
// //           break;
// //       }
// //     } catch (error) {
// //       console.error('Error sharing:', error);
// //       toast.error('Failed to share');
// //     }
// //   };

// //   // Add a function to display personalized message from localStorage if needed
// //   const renderPersonalizedMessage = () => {
// //     // If we already have a personalized message in the order, use that
// //     if (latestOrder?.personalized) {
// //       return (
// //         <div className="text-center mb-6 max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg shadow-sm">
// //           <h3 className="text-lg font-semibold text-[#40A574] mb-2">
// //             Personalized Message
// //           </h3>
// //           <p className="text-gray-700 italic mb-2">
// //             "{latestOrder.personalized.message}"
// //           </p>
// //           <p className="text-gray-600 font-medium">
// //             - From {latestOrder.personalized.name}
// //           </p>
// //         </div>
// //       );
// //     }

// //     // Otherwise try to get it from localStorage
// //     const storedSelectedMessages =
// //       typeof window !== 'undefined'
// //         ? localStorage.getItem('selectedPersonalizedMessages')
// //         : null;
// //     if (storedSelectedMessages) {
// //       try {
// //         const parsedMessages = JSON.parse(storedSelectedMessages);
// //         if (parsedMessages.length > 0) {
// //           const message = parsedMessages[0];
// //           return (
// //             <div className="text-center mb-6 max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg shadow-sm">
// //               <h3 className="text-lg font-semibold text-[#40A574] mb-2">
// //                 Personalized Message
// //               </h3>
// //               <p className="text-gray-700 italic mb-2">"{message.message}"</p>
// //               <p className="text-gray-600 font-medium">- From {message.name}</p>
// //             </div>
// //           );
// //         }
// //       } catch (e) {
// //         console.error(
// //           'Error rendering personalized message from localStorage:',
// //           e
// //         );
// //       }
// //     }

// //     return null;
// //   };

// //   return (
// //     <div
// //       className="at-maincontentwrapper"
// //       style={{
// //         backgroundImage: 'url("/images/thankyoubg.png")',
// //         backgroundSize: 'contain',
// //         backgroundPosition: 'top',
// //         backgroundRepeat: 'no-repeat',
// //       }}
// //     >
// //       {/* Main content */}
// //       <div className="container mx-auto px-4 relative z-10">
// //         {/* Logo */}
// //         <div className="flex justify-center mb-4">
// //           <div className="w-24 h-24">
// //             <img
// //               src="/images/logoicons.png"
// //               alt="Hey Jinie Logo"
// //               className="w-full h-full object-contain"
// //             />
// //           </div>
// //         </div>

// //         {/* Thank you text */}
// //         <div className="text-center mb-4">
// //           <h1 className="text-4xl font-bold text-[#40A574] mb-2 font-[pacifico]">
// //             Thank you
// //           </h1>
// //           <p className=" text-lg font-bold text-[#434343]">
// //             For Placing your order
// //           </p>
// //         </div>

// //         {/* Product image */}
// //         <div className="flex justify-center mb-4">
// //           <div className="w-32">
// //             <img
// //               src={latestOrder?.productImage || PLACEHOLDER_IMAGE}
// //               alt="Product Image"
// //               className="w-full h-full object-contain"
// //             />
// //           </div>
// //         </div>

// //         {/* Description */}
// //         {/* {latestOrder && (
// //           <div className="text-center mb-4 max-w-2xl mx-auto">
// //             <p className="text-gray-700 text-lg">
// //               {latestOrder.description || 'Product Description'}
// //             </p>
// //           </div>
// //         )} */}

// //         {/* Personalized Message (if available) */}
// //         {renderPersonalizedMessage()}

// //         {/* Share section */}
// //         <div className="text-center">
// //           <h2 className="text-xl font-semibold text-[#434343] mb-6">
// //             Share With Gift As A Sticker
// //           </h2>
// //           <div className="flex justify-center gap-4">
// //             {/* WhatsApp */}
// //             <button
// //               onClick={() => handleShare('whatsapp')}
// //               className="w-16 h-16 rounded-2xl bg-[#88C1FD] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
// //             >
// //               <img
// //                 className="w-10 h-10"
// //                 src="/images/icon-whatsapp.svg"
// //                 alt="whatsapp"
// //               />
// //             </button>

// //             {/* Messenger */}
// //             <button
// //               onClick={() => handleShare('messenger')}
// //               className="w-16 h-16 rounded-2xl bg-[#FD9399] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
// //             >
// //               <img
// //                 className="w-10 h-10"
// //                 src="/images/icon-messenger.svg"
// //                 alt="messenger"
// //               />
// //             </button>

// //             {/* Instagram */}
// //             <button
// //               onClick={() => handleShare('instagram')}
// //               className="w-16 h-16 rounded-2xl bg-[#FFD05E] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
// //             >
// //               <img
// //                 className="w-10 h-10"
// //                 src="/images/icon-insta.svg"
// //                 alt="instagram"
// //               />
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ThankYou;


'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchOrderHistory } from '@/services/api.service';
import { getCookie } from '@/utils/cookieUtility';
import {sendGift} from '@/services/api.service';

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

interface LatestOrder {
  productName: string | null;
  productImage: string | null;
  orderNumber: string;
  price: number;
  url: string;
  stickerPath: string | null;
  customerName: string;
  companyName: string;
  created_at: string;
  personalized?: PersonalizedMessage | null;
}

const PLACEHOLDER_IMAGE = '/images/logoicons.png';

const ThankYou = () => {
  const [latestOrder, setLatestOrder] = useState<LatestOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLatestOrder = async () => {
      try {
        const response = await fetchOrderHistory();
        if (response.success && response.data.length > 0) {
          // Get the most recent order
          const mostRecentOrder = response.data[0];
          const orderItem = mostRecentOrder.cart_details[0];

          // Try multiple ways to extract the personalized message
          let personalizedMessage = null;

          // Method 1: Check if personalized exists directly as an object or JSON string
          if (orderItem.personalized) {
            try {
              // If it's a string, try to parse it
              if (typeof orderItem.personalized === 'string') {
                personalizedMessage = JSON.parse(orderItem.personalized);
              } else {
                // If it's already an object
                personalizedMessage = orderItem.personalized;
              }
            } catch (e) {
              console.error('Failed to parse personalized message:', e);
            }
          }

          // Method 2: Check if it's stored elsewhere in the order item
          if (
            !personalizedMessage &&
            orderItem.product_id &&
            orderItem.product_id._id
          ) {
            // Try to get from localStorage based on product ID
            const storedSelectedMessages =
              typeof window !== 'undefined'
                ? localStorage.getItem('selectedPersonalizedMessages')
                : null;
            if (storedSelectedMessages) {
              try {
                const parsedMessages = JSON.parse(storedSelectedMessages);
                
                // Check if parsedMessages is an array before using find
                if (Array.isArray(parsedMessages)) {
                  personalizedMessage =
                    parsedMessages.find(
                      (msg) => msg.productId === orderItem.product_id._id
                    ) || null;
                } else if (parsedMessages && typeof parsedMessages === 'object') {
                  // Handle case where parsedMessages might be a single object
                  if (parsedMessages.productId === orderItem.product_id._id) {
                    personalizedMessage = parsedMessages;
                  }
                }
              } catch (e) {
                console.error('Failed to parse stored messages:', e);
              }
            }
          }

          // Log for debugging
          console.log('Order data:', mostRecentOrder);
          console.log('Order item:', orderItem);
          console.log('Extracted personalized message:', personalizedMessage);

          setLatestOrder({
            productName:
              orderItem.product_id.name !== null
                ? orderItem.product_id.name
                : 'Product Name',
            productImage:
              orderItem.product_id.sticker_path !== null
                ? orderItem.product_id.sticker_path
                : PLACEHOLDER_IMAGE,
            orderNumber: orderItem.order_number,
            price: orderItem.orderPrice,
            url: orderItem.url,
            stickerPath: orderItem.product_id.sticker_path_2,
            customerName: mostRecentOrder.customer_id.full_name,
            companyName: orderItem.product_id.company_id.name,
            created_at: mostRecentOrder.created_at,
            personalized: personalizedMessage,
          });
        } else {
          setError('No orders found');
        }
      } catch (error: any) {
        console.error('Error fetching order history:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getLatestOrder();
  }, []);

  // Just after the component mounts, let's also check localStorage directly
  useEffect(() => {
    const storedSelectedMessages =
      typeof window !== 'undefined'
        ? localStorage.getItem('selectedPersonalizedMessages')
        : null;
    if (storedSelectedMessages) {
      console.log(
        'Found stored personalized messages:',
        storedSelectedMessages
      );
    } else {
      console.log('No stored personalized messages found in localStorage');
    }
  }, []);

  const handleShare = async (platform: string) => {
    if (!latestOrder) return;

    try {
      // Check localStorage one more time when sharing
      let personalizedText = '';

      if (latestOrder.personalized) {
        personalizedText = `\nPersonalized Message: "${latestOrder.personalized.message}" - From ${latestOrder.personalized.name}`;
      } else {
        // Fallback to localStorage if the personalized message wasn't loaded with the order
        const storedSelectedMessages =
          typeof window !== 'undefined'
            ? localStorage.getItem('selectedPersonalizedMessages')
            : null;
        if (storedSelectedMessages) {
          try {
            const parsedMessages = JSON.parse(storedSelectedMessages);
            
            // Handle both array and object formats
            if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
              // Get the first message if it's an array
              const firstMessage = parsedMessages[0];
              if (firstMessage) {
                personalizedText = `\nPersonalized Message: "${firstMessage.message}" - From ${firstMessage.name}`;
              }
            } else if (parsedMessages && typeof parsedMessages === 'object' && parsedMessages.message) {
              // Handle case where parsedMessages might be a single object
              personalizedText = `\nPersonalized Message: "${parsedMessages.message}" - From ${parsedMessages.name}`;
            }
          } catch (e) {
            console.error('Error parsing stored messages during share:', e);
          }
        }
      }

      const shareText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${latestOrder.url}`;


      console.log('Sharing text:', shareText);

      switch (platform) {
        case 'whatsapp':
          const whatsappText = encodeURIComponent(shareText);
          window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
          break;

        case 'messenger':
          await navigator.clipboard.writeText(shareText);
          toast.success('Link copied! Opening Messenger...');

          // Include the personalized message in the messenger link if available
          const messengerQuote = personalizedText
            ? `&quote=${encodeURIComponent(personalizedText.trim())}`
            : '';

          const messengerAppUrl = `fb-messenger://share/?link=${encodeURIComponent(
            latestOrder.url
          )}${messengerQuote}`;

          window.location.href = messengerAppUrl;

          setTimeout(() => {
            window.open('https://www.messenger.com', '_blank');
          }, 1000);
          break;

        case 'instagram':
          await navigator.clipboard.writeText(shareText);
          toast.success('Link copied! Opening Instagram...');
          window.open('https://instagram.com/direct/inbox', '_blank');
          break;
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  // Function to display personalized message from localStorage if needed
  const renderPersonalizedMessage = () => {
    // If we already have a personalized message in the order, use that
    if (latestOrder?.personalized) {
      return (
        <div className="text-center mb-6 max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-[#40A574] mb-2">
            Personalized Message
          </h3>
          <p className="text-gray-700 italic mb-2">
            "{latestOrder.personalized.message}"
          </p>
          <p className="text-gray-600 font-medium">
            - From {latestOrder.personalized.name}
          </p>
        </div>
      );
    }

    // Otherwise try to get it from localStorage
    const storedSelectedMessages =
      typeof window !== 'undefined'
        ? localStorage.getItem('selectedPersonalizedMessages')
        : null;
    if (storedSelectedMessages) {
      try {
        const parsedMessages = JSON.parse(storedSelectedMessages);
        
        // Handle both array and object formats
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          const message = parsedMessages[0];
          return (
            <div className="text-center mb-6 max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-[#40A574] mb-2">
                Personalized Message
              </h3>
              <p className="text-gray-700 italic mb-2">"{message.message}"</p>
              <p className="text-gray-600 font-medium">- From {message.name}</p>
            </div>
          );
        } else if (parsedMessages && typeof parsedMessages === 'object' && parsedMessages.message) {
          // Handle single object case
          return (
            <div className="text-center mb-6 max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-[#40A574] mb-2">
                Personalized Message
              </h3>
              <p className="text-gray-700 italic mb-2">"{parsedMessages.message}"</p>
              <p className="text-gray-600 font-medium">- From {parsedMessages.name}</p>
            </div>
          );
        }
      } catch (e) {
        console.error(
          'Error rendering personalized message from localStorage:',
          e
        );
      }
    }

    return null;
  };

  return (
    <div
      className="at-maincontentwrapper"
      style={{
        backgroundImage: 'url("/images/thankyoubg.png")',
        backgroundSize: 'contain',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Main content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24">
            <img
              src="/images/logoicons.png"
              alt="Hey Jinie Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Thank you text */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-[#40A574] mb-2 font-[pacifico]">
            Thank you
          </h1>
          <p className=" text-lg font-bold text-[#434343]">
            For Placing your order
          </p>
        </div>

        {/* Product image */}
        <div className="flex justify-center mb-4">
          <div className="w-32">
            <img
              src={latestOrder?.productImage || PLACEHOLDER_IMAGE}
              alt="Product Image"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Personalized Message (if available) */}
        {renderPersonalizedMessage()}

        {/* Loading and error states */}
        {loading && (
          <div className="text-center mb-6">
            <p>Loading your order details...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center mb-6 text-red-500">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Share section */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#434343] mb-6">
            Share With Gift As A Sticker
          </h2>
          <div className="flex justify-center gap-4">
            {/* WhatsApp */}
            <button
              onClick={() => handleShare('whatsapp')}
              className="w-16 h-16 rounded-2xl bg-[#88C1FD] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <img
                className="w-10 h-10"
                src="/images/icon-whatsapp.svg"
                alt="whatsapp"
              />
            </button>

            {/* Messenger */}
            <button
              onClick={() => handleShare('messenger')}
              className="w-16 h-16 rounded-2xl bg-[#FD9399] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <img
                className="w-10 h-10"
                src="/images/icon-messenger.svg"
                alt="messenger"
              />
            </button>

            {/* Instagram */}
            <button
              onClick={() => handleShare('instagram')}
              className="w-16 h-16 rounded-2xl bg-[#FFD05E] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
            >
              <img
                className="w-10 h-10"
                src="/images/icon-insta.svg"
                alt="instagram"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;

// src/app/thankyou/page.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { fetchOrderHistory, sendGift } from '@/services/api.service';
// import { getCookie } from '@/utils/cookieUtility';
// import { ShareSource, trackGiftShare } from '@/utils/shareTrackingUtility';

// interface PersonalizedMessage {
//   name: string;
//   message: string;
//   image_path: string;
//   image_id: string;
//   productId?: string;
// }

// interface LatestOrder {
//   productName: string | null;
//   productImage: string | null;
//   orderNumber: string;
//   price: number;
//   url: string;
//   stickerPath: string | null;
//   customerName: string;
//   companyName: string;
//   created_at: string;
//   personalized?: PersonalizedMessage | null;
//   productId?: string;
//   orderId?: string;
// }

// const PLACEHOLDER_IMAGE = '/images/logoicons.png';

// const ThankYou = () => {
//   const [latestOrder, setLatestOrder] = useState<LatestOrder | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const getLatestOrder = async () => {
//       try {
//         const response = await fetchOrderHistory();
//         if (response.success && response.data.length > 0) {
//           // Get the most recent order
//           const mostRecentOrder = response.data[0];
//           const orderItem = mostRecentOrder.cart_details[0];

//           // Try multiple ways to extract the personalized message
//           let personalizedMessage = null;

//           // Method 1: Check if personalized exists directly as an object or JSON string
//           if (orderItem.personalized) {
//             try {
//               // If it's a string, try to parse it
//               if (typeof orderItem.personalized === 'string') {
//                 personalizedMessage = JSON.parse(orderItem.personalized);
//               } else {
//                 // If it's already an object
//                 personalizedMessage = orderItem.personalized;
//               }
//             } catch (e) {
//               console.error('Failed to parse personalized message:', e);
//             }
//           }

//           // Method 2: Check if it's stored elsewhere in the order item
//           if (
//             !personalizedMessage &&
//             orderItem.product_id &&
//             orderItem.product_id._id
//           ) {
//             // Try to get from localStorage based on product ID
//             const storedSelectedMessages =
//               typeof window !== 'undefined'
//                 ? localStorage.getItem('selectedPersonalizedMessages')
//                 : null;
//             if (storedSelectedMessages) {
//               try {
//                 const parsedMessages = JSON.parse(storedSelectedMessages);
                
//                 // Check if parsedMessages is an array before using find
//                 if (Array.isArray(parsedMessages)) {
//                   personalizedMessage =
//                     parsedMessages.find(
//                       (msg) => msg.productId === orderItem.product_id._id
//                     ) || null;
//                 } else if (parsedMessages && typeof parsedMessages === 'object') {
//                   // Handle case where parsedMessages might be a single object
//                   if (parsedMessages.productId === orderItem.product_id._id) {
//                     personalizedMessage = parsedMessages;
//                   }
//                 }
//               } catch (e) {
//                 console.error('Failed to parse stored messages:', e);
//               }
//             }
//           }

//           // Log for debugging
//           console.log('Order data:', mostRecentOrder);
//           console.log('Order item:', orderItem);
//           console.log('Extracted personalized message:', personalizedMessage);

//           setLatestOrder({
//             productName:
//               orderItem.product_id.name !== null
//                 ? orderItem.product_id.name
//                 : 'Product Name',
//             productImage:
//               orderItem.product_id.sticker_path !== null
//                 ? orderItem.product_id.sticker_path
//                 : PLACEHOLDER_IMAGE,
//             orderNumber: orderItem.order_number,
//             price: orderItem.orderPrice,
//             url: orderItem.url,
//             stickerPath: orderItem.product_id.sticker_path_2,
//             customerName: mostRecentOrder.customer_id.full_name,
//             companyName: orderItem.product_id.company_id.name,
//             created_at: mostRecentOrder.created_at,
//             personalized: personalizedMessage,
//             productId: orderItem.product_id._id,
//             orderId: mostRecentOrder._id
//           });
//         } else {
//           setError('No orders found');
//         }
//       } catch (error: any) {
//         console.error('Error fetching order history:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getLatestOrder();
//   }, []);

//   // Just after the component mounts, let's also check localStorage directly
//   useEffect(() => {
//     const storedSelectedMessages =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('selectedPersonalizedMessages')
//         : null;
//     if (storedSelectedMessages) {
//       console.log(
//         'Found stored personalized messages:',
//         storedSelectedMessages
//       );
//     } else {
//       console.log('No stored personalized messages found in localStorage');
//     }
//   }, []);
//   // Mock sendGift function (you'll need to implement or import the actual one)


//   // const handleWhatsAppShare = async () => {
//   //   if (!latestOrder) return;

//   //   try {
//   //     // First register this share as a gift
//   //     if (latestOrder.orderId) {
//   //       try {
//   //         let recipientEmail = 'whatsapp-share';
//   //         const userDataCookie = getCookie('userData');
//   //         if (userDataCookie) {
//   //           try {
//   //             const userData = JSON.parse(userDataCookie);
//   //             if (userData.email) {
//   //               recipientEmail = userData.email;
//   //             }
//   //           } catch (error) {
//   //             console.error('Error parsing userData cookie:', error);
//   //           }
//   //         }
//   //         await sendGift(
//   //           latestOrder.orderId,
//   //           latestOrder.orderNumber,
//   //           recipientEmail
//   //         );
//   //       } catch (error) {
//   //         console.error('Error registering WhatsApp share as gift:', error);
//   //       }
//   //     }

//   //     // Simplified share message
//   //     const shareText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${latestOrder.url}`;

//   //     // Open WhatsApp with the prepared message
//   //     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
//   //     window.open(whatsappUrl, '_blank');
//   //   } catch (error) {
//   //     console.error('Error sharing via WhatsApp:', error);
//   //     toast.error('Failed to share on WhatsApp');
//   //   }
//   // };

//   // const handleFacebookMessengerShare = async () => {
//   //   if (!latestOrder) return;

//   //   try {
//   //     // First register this share as a gift
//   //     if (latestOrder.orderId) {
//   //       try {
//   //         let recipientEmail = 'messenger-share';
//   //         const userDataCookie = getCookie('userData');
//   //         if (userDataCookie) {
//   //           try {
//   //             const userData = JSON.parse(userDataCookie);
//   //             if (userData.email) {
//   //               recipientEmail = userData.email;
//   //             }
//   //           } catch (error) {
//   //             console.error('Error parsing userData cookie:', error);
//   //           }
//   //         }
//   //         await sendGift(
//   //           latestOrder.orderId,
//   //           latestOrder.orderNumber,
//   //           recipientEmail
//   //         );
//   //       } catch (error) {
//   //         console.error('Error registering Messenger share as gift:', error);
//   //       }
//   //     }

//   //     // Simplified share message
//   //     const messageText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${latestOrder.url}`;

//   //     // Copy to clipboard
//   //     await navigator.clipboard.writeText(messageText);
//   //     toast.success('Link copied! Opening Messenger...');

//   //     // Try to detect if opening the app will succeed
//   //     const now = Date.now();
//   //     const timeoutDuration = 1000; // 1 second

//   //     // Attempt to open the messenger app
//   //     window.location.href = `fb-messenger://share/?link=${encodeURIComponent(
//   //       latestOrder.url ?? PLACEHOLDER_IMAGE
//   //     )}`;

//   //     // Use a focus event to detect if the user returns to the browser quickly
//   //     const handleFocus = () => {
//   //       // If we get focus back quickly, the app probably didn't open
//   //       if (Date.now() - now < timeoutDuration) {
//   //         window.open('https://www.messenger.com', '_blank');
//   //       }
//   //       window.removeEventListener('focus', handleFocus);
//   //     };

//   //     window.addEventListener('focus', handleFocus);

//   //     // Fallback if focus event doesn't fire
//   //     setTimeout(() => {
//   //       window.removeEventListener('focus', handleFocus);
//   //       // Only open if we haven't recently regained focus
//   //       if (document.hasFocus() && Date.now() - now >= timeoutDuration) {
//   //         window.open('https://www.messenger.com', '_blank');
//   //       }
//   //     }, timeoutDuration);
//   //   } catch (error) {
//   //     console.error('Error sharing:', error);
//   //     toast.error('Failed to share');
//   //   }
//   // };

//   // const handleInstagramShare = async () => {
//   //   if (!latestOrder) return;

//   //   try {
//   //     // First register this share as a gift
//   //     if (latestOrder.orderId) {
//   //       try {
//   //         let recipientEmail = 'instagram-share';
//   //         const userDataCookie = getCookie('userData');
//   //         if (userDataCookie) {
//   //           try {
//   //             const userData = JSON.parse(userDataCookie);
//   //             if (userData.email) {
//   //               recipientEmail = userData.email;
//   //             }
//   //           } catch (error) {
//   //             console.error('Error parsing userData cookie:', error);
//   //           }
//   //         }
//   //         await sendGift(
//   //           latestOrder.orderId,
//   //           latestOrder.orderNumber,
//   //           recipientEmail
//   //         );
//   //       } catch (error) {
//   //         console.error('Error registering Instagram share as gift:', error);
//   //       }
//   //     }

//   //     // Simplified share message
//   //     const messageText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${latestOrder.url}`;

//   //     // Copy text to clipboard
//   //     await navigator.clipboard.writeText(messageText);
//   //     toast.success('Link copied! Opening Instagram...');

//   //     // Open Instagram direct messages
//   //     window.open('https://instagram.com/direct/inbox', '_blank');
//   //   } catch (error) {
//   //     console.error('Error copying link:', error);
//   //     toast.error('Failed to copy link');

//   //     // Still try to open Instagram even if copy fails
//   //     window.open('https://instagram.com/direct/inbox', '_blank');
//   //   }
//   // };

//   const handleWhatsAppShare = async () => {
//     if (!latestOrder) return;
  
//     try {
//       // First register this share as a gift using the existing API
//       if (latestOrder.orderId) {
//         try {
//           let recipientEmail = 'whatsapp-share';
//           const userDataCookie = getCookie('userData');
//           if (userDataCookie) {
//             try {
//               const userData = JSON.parse(userDataCookie);
//               if (userData.email) {
//                 recipientEmail = userData.email;
//               }
//             } catch (error) {
//               console.error('Error parsing userData cookie:', error);
//             }
//           }
          
//           // Use the existing sendGift API function
//           await sendGift(
//             latestOrder.orderId,
//             latestOrder.orderNumber,
//             recipientEmail
//           );
          
//           // Track the share source in localStorage
//           trackGiftShare(
//             latestOrder.orderId,
//             latestOrder.orderNumber, 
//             ShareSource.WHATSAPP
//           );
          
//           toast.success('Gift shared via WhatsApp!');
//         } catch (error) {
//           console.error('Error registering WhatsApp share as gift:', error);
//           toast.error('Failed to track share');
//         }
//       }
  
//       // Simplified share message
//       const shareText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${latestOrder.url}`;
  
//       // Open WhatsApp with the prepared message
//       const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
//       window.open(whatsappUrl, '_blank');
//     } catch (error) {
//       console.error('Error sharing via WhatsApp:', error);
//       toast.error('Failed to share on WhatsApp');
//     }
//   };
  
//   // Fixed Facebook Messenger share handler with debounce
//   let messengerShareInProgress = false;
  
//   const handleFacebookMessengerShare = async () => {
//     if (!latestOrder || messengerShareInProgress) return;
  
//     messengerShareInProgress = true;
//     setTimeout(() => { messengerShareInProgress = false; }, 2000); // Prevent multiple clicks
  
//     try {
//       // First register this share as a gift
//       if (latestOrder.orderId) {
//         try {
//           let recipientEmail = 'messenger-share';
//           const userDataCookie = getCookie('userData');
//           if (userDataCookie) {
//             try {
//               const userData = JSON.parse(userDataCookie);
//               if (userData.email) {
//                 recipientEmail = userData.email;
//               }
//             } catch (error) {
//               console.error('Error parsing userData cookie:', error);
//             }
//           }
          
//           // Use the existing sendGift API function
//           await sendGift(
//             latestOrder.orderId,
//             latestOrder.orderNumber,
//             recipientEmail
//           );
          
//           // Track the share source in localStorage
//           trackGiftShare(
//             latestOrder.orderId,
//             latestOrder.orderNumber, 
//             ShareSource.MESSENGER
//           );
//         } catch (error) {
//           console.error('Error registering Messenger share as gift:', error);
//         }
//       }
  
//       // Simplified share message
//       const messageText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${latestOrder.url}`;
  
//       // Copy to clipboard
//       await navigator.clipboard.writeText(messageText);
//       toast.success('Link copied! Opening Messenger...');
  
//       // Always open Messenger in a new tab to ensure it works
//       window.open('https://www.messenger.com', '_blank');
      
//     } catch (error) {
//       console.error('Error sharing:', error);
//       toast.error('Failed to share. Please try again.');
      
//       // Still try to open Messenger even if there was an error
//       window.open('https://www.messenger.com', '_blank');
//     }
//   };
  
//   // Instagram share handler - Same implementation but with debounce added
//   let instagramShareInProgress = false;
  
//   const handleInstagramShare = async () => {
//     if (!latestOrder || instagramShareInProgress) return;
  
//     instagramShareInProgress = true;
//     setTimeout(() => { instagramShareInProgress = false; }, 2000); // Prevent multiple clicks
    
//     try {
//       // First register this share as a gift
//       if (latestOrder.orderId) {
//         try {
//           let recipientEmail = 'instagram-share';
//           const userDataCookie = getCookie('userData');
//           if (userDataCookie) {
//             try {
//               const userData = JSON.parse(userDataCookie);
//               if (userData.email) {
//                 recipientEmail = userData.email;
//               }
//             } catch (error) {
//               console.error('Error parsing userData cookie:', error);
//             }
//           }
          
//           // Use the existing sendGift API function
//           await sendGift(
//             latestOrder.orderId,
//             latestOrder.orderNumber,
//             recipientEmail
//           );
          
//           // Track the share source in localStorage
//           trackGiftShare(
//             latestOrder.orderId,
//             latestOrder.orderNumber, 
//             ShareSource.INSTAGRAM
//           );
          
//           toast.success('Gift shared via Instagram!');
//         } catch (error) {
//           console.error('Error registering Instagram share as gift:', error);
//           toast.error('Failed to track share');
//         }
//       }
  
//       // Simplified share message
//       const messageText = `A little joy from HeyJinie! Tap the link to unwrap your surprise.\n ${latestOrder.url}`;
  
//       // Copy text to clipboard
//       await navigator.clipboard.writeText(messageText);
//       toast.success('Link copied! Opening Instagram...');
  
//       // Open Instagram direct messages in a new tab
//       window.open('https://instagram.com/direct/inbox', '_blank');
//     } catch (error) {
//       console.error('Error copying link:', error);
//       toast.error('Failed to copy link');
      
//       // Still try to open Instagram even if copy fails
//       window.open('https://instagram.com/direct/inbox', '_blank');
//     }
//   };

//   // Function to display personalized message from localStorage if needed
//   const renderPersonalizedMessage = () => {
//     // If we already have a personalized message in the order, use that
//     if (latestOrder?.personalized) {
//       return (
//         <div className="text-center mb-6 max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg shadow-sm">
//           <h3 className="text-lg font-semibold text-[#40A574] mb-2">
//             Personalized Message
//           </h3>
//           <p className="text-gray-700 italic mb-2">
//             "{latestOrder.personalized.message}"
//           </p>
//           <p className="text-gray-600 font-medium">
//             - From {latestOrder.personalized.name}
//           </p>
//         </div>
//       );
//     }

//     // Otherwise try to get it from localStorage
//     const storedSelectedMessages =
//       typeof window !== 'undefined'
//         ? localStorage.getItem('selectedPersonalizedMessages')
//         : null;
//     if (storedSelectedMessages) {
//       try {
//         const parsedMessages = JSON.parse(storedSelectedMessages);
        
//         // Handle both array and object formats
//         if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
//           const message = parsedMessages[0];
//           return (
//             <div className="text-center mb-6 max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold text-[#40A574] mb-2">
//                 Personalized Message
//               </h3>
//               <p className="text-gray-700 italic mb-2">"{message.message}"</p>
//               <p className="text-gray-600 font-medium">- From {message.name}</p>
//             </div>
//           );
//         } else if (parsedMessages && typeof parsedMessages === 'object' && parsedMessages.message) {
//           // Handle single object case
//           return (
//             <div className="text-center mb-6 max-w-2xl mx-auto bg-gray-50 p-4 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold text-[#40A574] mb-2">
//                 Personalized Message
//               </h3>
//               <p className="text-gray-700 italic mb-2">"{parsedMessages.message}"</p>
//               <p className="text-gray-600 font-medium">- From {parsedMessages.name}</p>
//             </div>
//           );
//         }
//       } catch (e) {
//         console.error(
//           'Error rendering personalized message from localStorage:',
//           e
//         );
//       }
//     }

//     return null;
//   };

//   return (
//     <div
//       className="at-maincontentwrapper"
//       style={{
//         backgroundImage: 'url("/images/thankyoubg.png")',
//         backgroundSize: 'contain',
//         backgroundPosition: 'top',
//         backgroundRepeat: 'no-repeat',
//       }}
//     >
//       {/* Main content */}
//       <div className="container mx-auto px-4 relative z-10">
//         {/* Logo */}
//         <div className="flex justify-center mb-4">
//           <div className="w-24 h-24">
//             <img
//               src="/images/logoicons.png"
//               alt="Hey Jinie Logo"
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>

//         {/* Thank you text */}
//         <div className="text-center mb-4">
//           <h1 className="text-4xl font-bold text-[#40A574] mb-2 font-[pacifico]">
//             Thank you
//           </h1>
//           <p className=" text-lg font-bold text-[#434343]">
//             For Placing your order
//           </p>
//         </div>

//         {/* Product image */}
//         <div className="flex justify-center mb-4">
//           <div className="w-32">
//             <img
//               src={latestOrder?.productImage || PLACEHOLDER_IMAGE}
//               alt="Product Image"
//               className="w-full h-full object-contain"
//             />
//           </div>
//         </div>

//         {/* Personalized Message (if available) */}
//         {renderPersonalizedMessage()}

//         {/* Loading and error states */}
//         {loading && (
//           <div className="text-center mb-6">
//             <p>Loading your order details...</p>
//           </div>
//         )}
        
//         {error && (
//           <div className="text-center mb-6 text-red-500">
//             <p>Error: {error}</p>
//           </div>
//         )}

//         {/* Share section */}
//         <div className="text-center">
//           <h2 className="text-xl font-semibold text-[#434343] mb-6">
//             Share With Gift As A Sticker
//           </h2>
//           <div className="flex justify-center gap-4">
//             {/* WhatsApp */}
//             <button
//               onClick={handleWhatsAppShare}
//               className="w-16 h-16 rounded-2xl bg-[#88C1FD] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
//             >
//               <img
//                 className="w-10 h-10"
//                 src="/images/icon-whatsapp.svg"
//                 alt="whatsapp"
//               />
//             </button>

//             {/* Messenger */}
//             <button
//               onClick={handleFacebookMessengerShare}
//               className="w-16 h-16 rounded-2xl bg-[#FD9399] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
//             >
//               <img
//                 className="w-10 h-10"
//                 src="/images/icon-messenger.svg"
//                 alt="messenger"
//               />
//             </button>

//             {/* Instagram */}
//             <button
//               onClick={handleInstagramShare}
//               className="w-16 h-16 rounded-2xl bg-[#FFD05E] text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
//             >
//               <img
//                 className="w-10 h-10"
//                 src="/images/icon-insta.svg"
//                 alt="instagram"
//               />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ThankYou;