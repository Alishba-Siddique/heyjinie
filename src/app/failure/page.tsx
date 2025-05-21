// pages/payment/failure.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Loader from '@/components/page-ui/Loader';

export default function PaymentFailure() {
  const router = useRouter();

  useEffect(() => {
    toast.error('Payment failed. Please try again.');
    
    // Redirect back to checkout after a short delay
    // setTimeout(() => {
      router.push('/checkout');
    // }, 2000);
  }, []);

  return (
    <div className="at-maincontentwrapper min-h-screen flex items-center justify-center">
      <div className="at-checkoutpage text-center">
        <h2>Payment Failed</h2>
        <p>Sorry, your payment could not be processed. Redirecting back to checkout...</p>
        <Loader />
      </div>
    </div>
  );
}