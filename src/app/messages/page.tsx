// // src/app/messages/page.tsx
// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import PersonalizedMessages from '@/components/Product/personalize/personalized_messages';
// import withAuth from '@/hoc/withAuth';
// import Link from 'next/link';

// interface PersonalizedMessage {
//   category: string;
//   name: string;
//   message: string;
//   image_path: string;
//   image_id: string;
//   productId?: string;
// }

// const MessagesPage = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [personalizedMessages, setPersonalizedMessages] = useState<{
//     [key: string]: PersonalizedMessage[];
//   }>({});
//   const [currentProductId, setCurrentProductId] = useState<string | null>(null);
//   const [returnPath, setReturnPath] = useState<string>('/');
//   const [selectedMessagesForProduct, setSelectedMessagesForProduct] = useState<PersonalizedMessage[]>([]);

//   useEffect(() => {
//     const fetchPersonalizedMessages = async () => {
//       setLoading(true);
//       try {
//         const productId = localStorage.getItem('currentItemId');
//         const savedReturnPath = localStorage.getItem('returnPath');

//         const storedMessages = localStorage.getItem('personalizedMessages');
//         if (storedMessages) {
//           const parsedMessages = JSON.parse(storedMessages) as {
//             [key: string]: PersonalizedMessage[];
//           };
//           setPersonalizedMessages(parsedMessages);
//         }

//         if (productId) setCurrentProductId(productId);
//         if (savedReturnPath) setReturnPath(savedReturnPath);
//       } catch (error) {
//         console.error('Error loading messages:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPersonalizedMessages();
//   }, []);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       const storedMessages = localStorage.getItem('personalizedMessages');
//       if (storedMessages) {
//         const parsedMessages = JSON.parse(storedMessages) as {
//           [key: string]: PersonalizedMessage[];
//         };
//         setPersonalizedMessages(parsedMessages);
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   const handleSelectMessage = (message: PersonalizedMessage[]) => {
//     if (!currentProductId) return;

//     // Clean up
//     localStorage.removeItem('currentItemId');
//     localStorage.removeItem('returnPath');
//     window.dispatchEvent(new Event('storage'));
//     // Navigate back
//     router.push(returnPath);
//   };

//     useEffect(() => {
//         if (currentProductId) {
//             const storedSelectedMessages = localStorage.getItem('selectedPersonalizedMessages');
//             if (storedSelectedMessages) {
//                 try {
//                     const parsedMessages: PersonalizedMessage[] = JSON.parse(storedSelectedMessages);
//                     setSelectedMessagesForProduct(parsedMessages);
//                 } catch (error) {
//                     console.error("Error parsing selected messages:", error);
//                     setSelectedMessagesForProduct([]);
//                 }
//             } else {
//                 setSelectedMessagesForProduct([]);
//             }
//         }
//     }, [currentProductId]);

//   return (
//     <>
//       <div className="at-maincontentwrapper">
//         <PersonalizedMessages
//           personalizedList={personalizedMessages}
//           loading={loading}
//           error={null}
//           selectedMessages={selectedMessagesForProduct}
//           // onSelectMessage={(message: any) => {
//           //   handleSelectMessage(message);
//           // }}
//           onSelectMessage={() => handleSelectMessage([])}
//         />

//         <div className="flex justify-between mt-6">
//           <button
//             onClick={() => router.push(returnPath)}
//             className="at-btn secondary bg-[#42a674] hover:bg-[#42a674] text-white rounded-full"
//           >
//             Cancel
//           </button>
//           <Link href="/personalize">
//             <button className="at-btn bg-[#42a674] hover:bg-[#42a674] text-white rounded-full">
//               Create New Message
//             </button>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

// export default withAuth(MessagesPage);

// src/app/messages/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalizedMessages from '@/components/Product/personalize/personalized_messages';
import withAuth from '@/hoc/withAuth';
import Link from 'next/link';

interface PersonalizedMessage {
  category: string;
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

const MessagesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage[];
  }>({});
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [returnPath, setReturnPath] = useState<string>('/');
  const [selectedMessagesForProduct, setSelectedMessagesForProduct] = useState<
    PersonalizedMessage[]
  >([]);

  useEffect(() => {
    const fetchPersonalizedMessages = async () => {
      setLoading(true);
      try {
        const productId = localStorage.getItem('currentItemId');
        const savedReturnPath = localStorage.getItem('returnPath');

        const storedMessages = localStorage.getItem('personalizedMessages');
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages) as {
            [key: string]: PersonalizedMessage[];
          };
          setPersonalizedMessages(parsedMessages);
        }

        if (productId) setCurrentProductId(productId);
        if (savedReturnPath) setReturnPath(savedReturnPath);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonalizedMessages();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedMessages = localStorage.getItem('personalizedMessages');
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages) as {
          [key: string]: PersonalizedMessage[];
        };
        setPersonalizedMessages(parsedMessages);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSelectMessage = () => {
    if (!currentProductId) return;

    // Clean up
    localStorage.removeItem('currentItemId');
    localStorage.removeItem('returnPath');
    window.dispatchEvent(new Event('storage'));

    // Navigate back
    router.push(returnPath);
  };

  useEffect(() => {
    if (currentProductId) {
      const storedSelectedMessages = localStorage.getItem(
        'selectedPersonalizedMessages'
      );
      if (storedSelectedMessages) {
        try {
          // The stored structure is { productId: messageItem }
          const parsedMessages: Record<string, PersonalizedMessage> =
            JSON.parse(storedSelectedMessages);

          // Get the message for the current product
          const messageForCurrentProduct = parsedMessages[currentProductId];

          // Set as array for the component
          if (messageForCurrentProduct) {
            setSelectedMessagesForProduct([messageForCurrentProduct]);
          } else {
            setSelectedMessagesForProduct([]);
          }
        } catch (error) {
          console.error('Error parsing selected messages:', error);
          setSelectedMessagesForProduct([]);
        }
      } else {
        setSelectedMessagesForProduct([]);
      }
    }
  }, [currentProductId]);

  return (
    <>
      <div className="at-maincontentwrapper">
        <div className='flex justify-between align-middle items-center'>
        <div className="text-2xl md:text-3xl font-bold  ml-4">
          My Personalized Messages
        </div>
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-6 p-4">
          <button
            onClick={() => router.push(returnPath)}
            className="w-full sm:w-auto px-6 py-3 bg-[#000] hover:bg-neutral-600 text-white rounded-full font-medium transition-colors duration-200"
          >
            Cancel
          </button>

          <Link href="/personalize" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 bg-[#42a674] hover:bg-[#369963] text-white rounded-full font-medium transition-colors duration-200">
              Create New Message
            </button>
          </Link>
        </div>
        </div>
        <PersonalizedMessages
          personalizedList={personalizedMessages}
          loading={loading}
          error={null}
          selectedMessages={selectedMessagesForProduct}
          onSelectMessage={handleSelectMessage}
        />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4">
          <button
            onClick={() => router.push(returnPath)}
            className="w-full sm:w-auto px-6 py-3 bg-[#000] hover:bg-neutral-600 text-white rounded-full font-medium transition-colors duration-200"
          >
            Cancel
          </button>

          <Link href="/personalize" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 bg-[#42a674] hover:bg-[#369963] text-white rounded-full font-medium transition-colors duration-200">
              Create New Message
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default withAuth(MessagesPage);
