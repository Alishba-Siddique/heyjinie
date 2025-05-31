// // src/components/Product/personalize/personalized_messages.tsx

// 'use client';
// import { useState, useEffect } from 'react';
// import { Skeleton } from '@/components/ui/skeleton';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';

// const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// // Interface for a single message template/item
// interface PersonalizedMessageItem {
//   category?: string; // Category might exist on the template data
//   name: string;
//   message: string;
//   image_path: string;
//   image_id: string;
//   productId?: string; // productId might be added by handleSelectMessage when saving
// }

// // Props expected by this component
// interface PersonalizedMessagesProps {
//   personalizedList: {
//     // The list of AVAILABLE templates, likely categorized
//     [category: string]: PersonalizedMessageItem[];
//   };
//   loading: boolean;
//   error: string | null;
//   selectedMessages: PersonalizedMessageItem[]; // The initially selected message for THIS product (passed as [] or [item])
//   // Callback to signal selection/deselection is complete (triggers navigation in parent)
//   onSelectMessage: () => void;
// }

// const PersonalizedMessages: React.FC<PersonalizedMessagesProps> = ({
//   personalizedList,
//   loading,
//   error,
//   selectedMessages, // Comes from parent's 'initialSelectedMessage' state
//   onSelectMessage, // Parent's 'handleSelectionConfirmed' function
// }) => {
//   // State to track the ID of the currently checked message visually
//   const [checkedMessages, setCheckedMessages] = useState<Set<string>>(() => {
//     // Initialize the Set safely based on the initial prop value
//     const initialIds = Array.isArray(selectedMessages)
//       ? selectedMessages.map((msg) => msg.image_id)
//       : [];
//     return new Set(initialIds);
//   });

//   const router = useRouter();

//   // Effect to update local checked state if the initial selection prop changes
//   useEffect(() => {
//     const currentIds = Array.isArray(selectedMessages)
//       ? selectedMessages.map((msg) => msg.image_id)
//       : [];
//     setCheckedMessages(new Set(currentIds));
//   }, [selectedMessages]);

//   // --- Handles Clicking a Message Template ---
//   const handleSelectMessage = (
//     category: string, // Keep category for potential future use
//     message: PersonalizedMessageItem
//   ) => {
//     // --- Determine New Visual State ---
//     const updatedCheckedMessages = new Set<string>(); // Start fresh for single selection
//     const isNowChecked = !checkedMessages.has(message.image_id); // Was it previously unchecked?

//     if (isNowChecked) {
//       updatedCheckedMessages.add(message.image_id); // Check the new one
//     }
//     // If !isNowChecked, it means we are unchecking the current one, so the set remains empty.
//     setCheckedMessages(updatedCheckedMessages); // Update local visual state

//     // --- Get Product ID ---
//     const productId = localStorage.getItem('currentItemId');
//     if (!productId) {
//       toast.error('Please select a product first!');
//       router.push('/home')
//       console.error(
//         '[handleSelectMessage] CRITICAL: currentItemId not found in localStorage!'
//       );
//       // Optionally: Show an error message to the user via state
//       return;
//     }

//     // --- Robust localStorage Update for 'selectedPersonalizedMessages' ---
//     const storageKey = 'selectedPersonalizedMessages';
//     let allSelectedMessages: Record<string, PersonalizedMessageItem> = {}; // Target: { productId: messageItem }

//     const storedValue = localStorage.getItem(storageKey);
//     if (storedValue) {
//       try {
//         const parsed = JSON.parse(storedValue);
//         // VALIDATE: Ensure it's a non-null, non-array object
//         if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
//           allSelectedMessages = parsed;
//         } else {
//           console.warn(
//             `[handleSelectMessage] Stored '${storageKey}' was not an object. Resetting.`
//           );
//         }
//       } catch (e) {
//         console.error(
//           `[handleSelectMessage] Error parsing '${storageKey}'. Resetting.`,
//           e
//         );
//       }
//     }

//     // --- Update the Object Based on Selection ---
//     if (isNowChecked) {
//       // Add/update the entry for the current product ID
//       allSelectedMessages[productId] = { ...message, productId: productId }; // Add productId for clarity
//     } else {
//       // Remove the entry for the current product ID if it was unchecked
//       if (allSelectedMessages.hasOwnProperty(productId)) {
//         delete allSelectedMessages[productId];
//       }
//     }

//     // --- Save Back to localStorage ---
//     try {
//       const stringifiedData = JSON.stringify(allSelectedMessages);
//       localStorage.setItem(storageKey, stringifiedData);
//       window.dispatchEvent(new StorageEvent('storage', { key: storageKey })); // More specific event

//       // --- Signal Completion to Parent ---
//       // The parent component will handle navigation.
//       onSelectMessage();
//     } catch (e) {
//       console.error(
//         `[handleSelectMessage] CRITICAL ERROR stringifying or saving '${storageKey}'`,
//         e
//       );
//       // Optionally: Set an error state to inform the user
//     }
//   };

//   // --- Render Logic ---
//   return (
//     <>
//     <div className="text-3xl font-bold mb-6 ml-4">My Personalized Messages</div>
//       <div className="p-4 at-shopcategoriesgrid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {/* Skeletons for loading state */}
//         {loading && (
//           <>
//             {[...Array(8)].map((_, index) => (
//               <div
//                 className="at-shopcategorieitems border rounded-md p-2"
//                 key={index}
//               >
//                 <Skeleton className="h-40 w-full mb-2" />
//                 <Skeleton className="h-4 w-3/4 mb-1" />
//                 <Skeleton className="h-4 w-1/2" />
//               </div>
//             ))}
//           </>
//         )}
//         {error && <p className="col-span-full text-red-600">{error}</p>}

//         {!loading && Object.keys(personalizedList).length === 0 && !error ? (
//           <p className="col-span-full text-center text-gray-500">
//             No personalized message templates available.
//           </p>
//         ) : null}

//         {!loading &&
//           Object.entries(personalizedList).map(([category, messages]) => {
//             // <-- Iterates through keys (e.g., "Wedding")
//             const messageArray = Array.isArray(messages) ? messages : [];
//             // Map messages directly without category headers for this example
//             return messageArray.map((item, index) => (
//               <div
//                 key={`${item.image_id}-${index}`}
//                 className="at-shopcategorieitems cursor-pointer relative border rounded-md p-2 flex flex-col hover:shadow-md transition-shadow duration-200" // Added hover effect
//                 onClick={() => handleSelectMessage(category, item)} // Main click handler
//               >
//                 <div className="at-shopcategoryname">
//                   <h3>{category}</h3>
//                 </div>
//                 <figure className="mb-2 flex-shrink-0">
//                   <img
//                     className="w-full h-40 object-cover rounded"
//                     src={item.image_path || PRODUCT_PLACEHOLDER}
//                     alt={item.name}
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
//                     }}
//                   />
//                 </figure>

//                 <div className="at-message-details flex-grow mt-1">
//                   <h3
//                     className="font-semibold text-base mb-1 truncate"
//                     title={item.name}
//                   >
//                     {item.name}
//                   </h3>
//                   <p
//                     className="text-sm text-gray-600 line-clamp-2"
//                     title={item.message}
//                   >
//                     {item.message}
//                   </p>{' '}
//                   {/* Limit description lines */}
//                 </div>

//                 {/* Checkbox for visual feedback */}
//                 <input
//                   type="checkbox"
//                   checked={checkedMessages.has(item.image_id)}
//                   readOnly // Logic is handled by the div's onClick
//                   // Prevent checkbox click from doing anything itself or stopping the div click
//                   onClick={(e) => e.stopPropagation()}
//                   onChange={() => {}} // Required by React for controlled components if not readOnly
//                   className="absolute top-2 right-2 h-5 w-5 accent-[#40A574] cursor-pointer" // Ensure cursor indicates clickable area
//                 />
//               </div>
//             ));
//           })}
//       </div>
//     </>
//   );
// };

// export default PersonalizedMessages;


// src/components/Product/personalize/personalized_messages.tsx

'use client';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// Interface for a single message template/item
interface PersonalizedMessageItem {
  category?: string;
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

// Props expected by this component
interface PersonalizedMessagesProps {
  personalizedList: {
    [category: string]: PersonalizedMessageItem[];
  };
  loading: boolean;
  error: string | null;
  selectedMessages: PersonalizedMessageItem[];
  onSelectMessage: () => void;
}

const PersonalizedMessages: React.FC<PersonalizedMessagesProps> = ({
  personalizedList,
  loading,
  error,
  selectedMessages,
  onSelectMessage,
}) => {
  // State to track the ID of the currently checked message visually
  const [checkedMessages, setCheckedMessages] = useState<Set<string>>(() => {
    const initialIds = Array.isArray(selectedMessages)
      ? selectedMessages.map((msg) => msg.image_id)
      : [];
    return new Set(initialIds);
  });

  const router = useRouter();

  // Effect to update local checked state if the initial selection prop changes
  useEffect(() => {
    const currentIds = Array.isArray(selectedMessages)
      ? selectedMessages.map((msg) => msg.image_id)
      : [];
    setCheckedMessages(new Set(currentIds));
  }, [selectedMessages]);

  // --- Handles Clicking a Message Template ---
  const handleSelectMessage = (
    category: string,
    message: PersonalizedMessageItem
  ) => {
    // --- Determine New Visual State ---
    const updatedCheckedMessages = new Set<string>();
    const isNowChecked = !checkedMessages.has(message.image_id);

    if (isNowChecked) {
      updatedCheckedMessages.add(message.image_id);
    }
    setCheckedMessages(updatedCheckedMessages);

    // --- Get Product ID ---
    const productId = localStorage.getItem('currentItemId');
    if (!productId) {
      toast.error('Please select a product first!');
      router.push('/home');
      console.error(
        '[handleSelectMessage] CRITICAL: currentItemId not found in localStorage!'
      );
      return;
    }

    // --- Robust localStorage Update for 'selectedPersonalizedMessages' ---
    const storageKey = 'selectedPersonalizedMessages';
    let allSelectedMessages: Record<string, PersonalizedMessageItem> = {};

    const storedValue = localStorage.getItem(storageKey);
    if (storedValue) {
      try {
        const parsed = JSON.parse(storedValue);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          allSelectedMessages = parsed;
        } else {
          console.warn(
            `[handleSelectMessage] Stored '${storageKey}' was not an object. Resetting.`
          );
        }
      } catch (e) {
        console.error(
          `[handleSelectMessage] Error parsing '${storageKey}'. Resetting.`,
          e
        );
      }
    }

    // --- Update the Object Based on Selection ---
    if (isNowChecked) {
      allSelectedMessages[productId] = { ...message, productId: productId };
    } else {
      if (allSelectedMessages.hasOwnProperty(productId)) {
        delete allSelectedMessages[productId];
      }
    }

    // --- Save Back to localStorage ---
    try {
      const stringifiedData = JSON.stringify(allSelectedMessages);
      localStorage.setItem(storageKey, stringifiedData);
      window.dispatchEvent(new StorageEvent('storage', { key: storageKey }));
      onSelectMessage();
    } catch (e) {
      console.error(
        `[handleSelectMessage] CRITICAL ERROR stringifying or saving '${storageKey}'`,
        e
      );
    }
  };

  // --- Handle checkbox click separately to prevent event propagation ---
  const handleCheckboxClick = (
    e: React.MouseEvent<HTMLInputElement>,
    category: string,
    message: PersonalizedMessageItem
  ) => {
    e.stopPropagation(); // Prevent card click
    handleSelectMessage(category, message);
  };

  // --- Render Logic ---
  return (
    <>
      
      <div className="p-2 md:p-4">
        {/* Skeletons for loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {[...Array(8)].map((_, index) => (
              <div className="border rounded-md p-2" key={index}>
                <Skeleton className="h-32 md:h-40 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}
        
        {error && (
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && Object.keys(personalizedList).length === 0 && !error && (
          <div className="text-center">
            <p className="text-gray-500">
              No personalized message templates available.
            </p>
          </div>
        )}

        {!loading &&
          Object.entries(personalizedList).map(([category, messages]) => {
            const messageArray = Array.isArray(messages) ? messages : [];
            
            if (messageArray.length === 0) return null;

            return (
              <div key={category} className="mb-6 md:mb-8 bg-white rounded-lg p-4 shadow-md">
                {/* Category Header */}
                <div className="mb-3 md:mb-4 ">
                  <h2 className="text-lg md:text-xl font-semibold  pb-1 md:pb-2">
                    {category}
                  </h2>
                </div>

                {/* Messages Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 md:gap-3">
                  {messageArray.map((item, index) => (
                    <div
                      key={`${item.image_id}-${index}`}
                      className=" cursor-pointer relative border rounded-lg p-3 flex flex-col shadow-sm hover:shadow-lg hover:border-[#000000] transition-all duration-200 bg-white"
                      onClick={() => handleSelectMessage(category, item)}
                    >
                      {/* Image */}
                      <figure className="mb-3 flex-shrink-0">
                        <img
                          className="w-full h-full object-cover rounded-md"
                          src={item.image_path || PRODUCT_PLACEHOLDER}
                          alt={item.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
                          }}
                        />
                      </figure>

                      {/* Message Details */}
                      <div className="flex-grow">
                        <h3
                          className="font-semibold text-sm md:text-base mb-2 line-clamp-2"
                          title={item.name}
                        >
                          {item.name}
                        </h3>
                        <p
                          className="text-xs md:text-sm text-gray-600 line-clamp-3"
                          title={item.message}
                        >
                          {item.message}
                        </p>
                      </div>

                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={checkedMessages.has(item.image_id)}
                        onClick={(e) => handleCheckboxClick(e, category, item)}
                        onChange={() => {}} // Controlled by onClick
                        className="absolute top-2 right-2 h-4 w-4 md:h-5 md:w-5 accent-[#40A574] cursor-pointer"
                      />

                      {/* Selection Indicator */}
                      {checkedMessages.has(item.image_id) && (
                        <div className="absolute inset-0 bg-[#40A574] bg-opacity-10 rounded-lg border-2 border-[#40A574] pointer-events-none" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PersonalizedMessages;