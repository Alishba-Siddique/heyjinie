// // 'use client';
// // import { useEffect, useState } from 'react';
// // import { useRouter, useSearchParams } from 'next/navigation';
// // import { confirmOrder } from '@/services/api.service';
// // import { useCart } from '@/context/CartContext';
// // import { toast } from 'react-toastify';

// // const PaymentSuccessPage = () => {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const { clearCart } = useCart();
// //   const [processing, setProcessing] = useState(true);

// //   useEffect(() => {
// //     const finalizeOrder = async () => {
// //       try {
// //         setProcessing(true);

// //         // Get order_id and payment_id from URL parameters
// //         const orderId = searchParams.get('order_id');
// //         const paymentId = searchParams.get('payment_id');

// //         // If parameters are missing, try to get from localStorage (fallback)
// //         const storedOrderId = localStorage.getItem('order_id');
// //         const storedPaymentId = localStorage.getItem('payment_id');

// //         // If we don't have the required IDs, redirect to checkout
// //         if ((!orderId || !paymentId) && (!storedOrderId || !storedPaymentId)) {
// //           toast.error('Order information is missing');
// //           router.push('/checkout');
// //           return;
// //         }

// //         // Confirm the order
// //         const response = await confirmOrder(
// //           orderId || storedOrderId || '',
// //           paymentId || storedPaymentId || ''
// //         );

// //         if (response) {
// //           // Clean up localStorage
// //           localStorage.removeItem('order_id');
// //           localStorage.removeItem('payment_id');

// //           // Clear cart and redirect to thank you page
// //           clearCart();
// //           router.push('/thankyou');
// //         } else {
// //           throw new Error('Order confirmation failed');
// //         }
// //       } catch (error: any) {
// //         console.error('Order confirmation error:', error);
// //         toast.error(error.message || 'Failed to confirm order');
// //         router.push('/checkout');
// //       } finally {
// //         setProcessing(false);
// //       }
// //     };

// //     finalizeOrder();
// //   }, []);

// //   return (
// //     <div className="at-maincontentwrapper flex flex-col items-center justify-center">
// //       {processing ? (
// //         <>
// //           {/* <Loader /> */}
// //           {
// //             <p className="mt-4 text-lg text-center">
// //               Finalizing your order, please wait...
// //             </p>
// //           }
// //         </>
// //       ) : (
// //         <p className="text-lg text-center">
// //           Redirecting to your order confirmation...
// //         </p>
// //       )}
// //     </div>
// //   );
// // };

// // export default PaymentSuccessPage;

// //src/app/success/page.tsx
// 'use client';
// import { useEffect, useState, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { confirmOrder } from '@/services/api.service';
// import { useCart } from '@/context/CartContext';
// import { toast } from 'react-toastify';
// import Loader from '@/components/page-ui/Loader';


// const PaymentSuccessPageContent = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { clearCart } = useCart();
//   const [processing, setProcessing] = useState(true);

//   useEffect(() => {
//     const finalizeOrder = async () => {
//       try {
//         setProcessing(true);
        
//         // Get order_id and payment_id from URL parameters
//         const orderId = searchParams.get('order_id');
//         const paymentId = searchParams.get('payment_id');
        
//         // If parameters are missing, try to get from localStorage (fallback)
//         const storedOrderId = localStorage.getItem('order_id');
//         const storedPaymentId = localStorage.getItem('payment_id');
        
//         if ((!orderId || !paymentId) && (!storedOrderId || !storedPaymentId)) {
//           toast.error('Order information is missing');
//           router.push('/checkout');
//           return;
//         }
        
//         // Confirm the order
//         const response = await confirmOrder(
//           orderId || storedOrderId || '',
//           paymentId || storedPaymentId || ''
//         );
        
//         if (response) {
//           localStorage.removeItem('order_id');
//           localStorage.removeItem('payment_id');
//           clearCart();
//           router.push('/thankyou');
//         } else {
//           throw new Error('Order confirmation failed');
//         }
//       } catch (error: any) {
//         console.error('Order confirmation error:', error);
//         toast.error(error.message || 'Failed to confirm order');
//         router.push('/checkout');
//       } finally {
//         setProcessing(false);
//       }
//     };

//     finalizeOrder();
//   }, []);

//   return (
//     <div className="at-maincontentwrapper min-h-screen flex flex-col items-center justify-center">
//       {processing ? (
//         <>
//           <p className="mt-4 text-xl text-center">Finalizing your order, please wait...</p>
//           {/* <Loader /> */}
//         </>
//       ) : (
//         <>
//         <p className="text-xl text-center">Redirecting to your order confirmation...</p>
//         {/* <Loader /> */}
//         </>
        
//       )}
//     </div>
//   );
// };

// // Wrap with Suspense
// const PaymentSuccessPage = () => (
//   <Suspense fallback={<p className="text-center"><Loader /></p>}>
//     <PaymentSuccessPageContent />
//   </Suspense>
// );

// export default PaymentSuccessPage;


// src/app/success/page.tsx
'use client';
import { useEffect, useState, Suspense, useRef } from 'react'; // Import useRef
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmOrder } from '@/services/api.service';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import Loader from '@/components/page-ui/Loader';

const PaymentSuccessPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [processing, setProcessing] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // State for error message
  const hasConfirmed = useRef(false); // Ref to track if confirmation was attempted

  useEffect(() => {
    const finalizeOrder = async () => {
      // --- Guard against multiple calls ---
      if (hasConfirmed.current) {
        console.log('Confirmation already attempted, skipping.');
        return;
      }
      hasConfirmed.current = true; // Mark as attempted immediately
      // --- End Guard ---

      setProcessing(true);
      setErrorMsg(null); // Clear previous errors

      try {
        const orderId = searchParams.get('order_id');
        const paymentId = searchParams.get('payment_id');
        const storedOrderId = localStorage.getItem('order_id');
        const storedPaymentId = localStorage.getItem('payment_id');

        const finalOrderId = orderId || storedOrderId;
        const finalPaymentId = paymentId || storedPaymentId;

        if (!finalOrderId || !finalPaymentId) {
          toast.error('Order information is missing. Cannot confirm.');
          setErrorMsg('Order information is missing.');
          // Maybe redirect differently if info is totally missing
          // router.push('/checkout');
          setProcessing(false); // Stop processing indicator
          return;
        }

        console.log(`Attempting to confirm order: ${finalOrderId}, payment: ${finalPaymentId}`); // Log IDs being used

        // Confirm the order
        const response = await confirmOrder(finalOrderId, finalPaymentId); // Assuming confirmOrder throws on error

        // If confirmOrder doesn't throw but returns a falsy value on failure:
        // if (!response || !response.success) { // Adjust based on actual return value
        //   throw new Error(response?.message || 'Order confirmation failed');
        // }

        // ---- Success Path ----
        console.log('Order confirmed successfully via API.');
        localStorage.removeItem('order_id');
        localStorage.removeItem('payment_id');
        clearCart();
        router.push('/thankyou');
        // No need to setProcessing(false) here as we are navigating away

      } catch (error: any) {
        console.error('Order confirmation error in finalizeOrder:', error);
        const message = error.message || 'Failed to confirm order. Please contact support if payment was successful.';
        toast.error(message);
        setErrorMsg(message); // Show error message to user
        // Don't redirect immediately on error, let the user see the message
        // router.push('/checkout');
        setProcessing(false); // Stop processing indicator
      }
      // Removed finally block as navigation handles the processing state on success
      // and the catch block handles it on error.
    };

    finalizeOrder();

    // Cleanup function (optional but good practice)
    return () => {
        console.log('Cleanup function for PaymentSuccessPageContent effect.');
        // You could potentially add logic here if needed when the component unmounts
    };

  // Removed router and searchParams from dependency array if they don't change
  // while the user is on this page. If they *could* change, add them back.
  // clearCart should be stable if from Context.
  }, [searchParams, router, clearCart]); // Add stable dependencies

  return (
    <div className="at-maincontentwrapper min-h-screen flex flex-col items-center justify-center p-4">
      {processing ? (
        <>
          <p className="mt-4 text-xl text-center">Finalizing your order, please wait...</p>
          <Loader />
        </>
      ) : errorMsg ? (
        <div className="text-center text-red-600">
           <p className="text-xl font-semibold">Order Confirmation Problem</p>
           <p className="mt-2">{errorMsg}</p>
           <p className="mt-2 text-sm text-gray-700">Your payment may have succeeded. Please check your email or contact support with Order ID if available.</p>
           <button
             onClick={() => router.push('/')} // Go home or to orders page
             className="at-btn at-btn-secondary mt-4"
           >
             Go to Homepage
           </button>
        </div>
      ) : (
         // This state might not be reachable if success navigates away
         <p className="text-xl text-center">Processing complete.</p>
      )}
    </div>
  );
};

// Wrap with Suspense
const PaymentSuccessPage = () => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader /></div>}>
    <PaymentSuccessPageContent />
  </Suspense>
);

export default PaymentSuccessPage;