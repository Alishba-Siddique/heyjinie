// pages/payment/success.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';

export default function PaymentSuccess() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart
    clearCart();
    
    toast.success('Payment successful! Thank you for your order.');
    
    // Redirect to thank you page after a short delay
    setTimeout(() => {
      router.push('/thankyou');
    }, 2000);
  }, []);

  return (
    <div className="at-checkoutcontainer">
      <div className="at-checkoutpage text-center">
        <h2>Payment Successful!</h2>
        <p>Your order has been placed successfully. Redirecting...</p>
      </div>
    </div>
  );
}