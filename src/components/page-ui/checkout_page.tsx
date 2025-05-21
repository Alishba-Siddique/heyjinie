// src/components/page-ui/checkout_page.tsx

'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import withAuth from '@/hoc/withAuth';
import { placeOrder, confirmOrder } from '@/services/api.service';
import { toast } from 'react-toastify';

interface CartItem {
  _id: string;
  price: number;
  quantity: number;
  personalized?: string; // Add this line
}

const CheckOutPage = () => {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  // Calculate sales tax and total amount
  const salesTaxRate = 0.17; // 17%
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const salesTax = subtotal * salesTaxRate;
  const totalAmount = subtotal + salesTax;

  const generateSignature = (merchantId: string, token: string): string => {
    const timestamp = new Date().getTime();
    return `SIG-${merchantId}-${timestamp}`;
  };

  // Handle direct checkout without PayFast for free orders
  const handleDirectCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    try {
      setProcessing(true);

      // Create the order data
      const orderData = {
        cart_details: cartItems.map((item: CartItem) => ({
          personalized: item.personalized || null,
          product_id: item._id,
          quantity: item.quantity,
        })),
      };

      // Place the order
      const orderResponse = await placeOrder(orderData);

      if (orderResponse.success) {
        // If it's a free product or order, confirm it immediately
        if (orderResponse.data.payment_type === 'free') {
          const confirmResponse = await confirmOrder(
            orderResponse.data.order_id,
            orderResponse.data.payment_id
          );

          if (confirmResponse) {
            clearCart();
            router.push('/thankyou');
          }
        }
      } else {
        toast.error('Failed to place order');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(
        error.message || 'An unexpected error occurred during checkout'
      );
    } finally {
      setProcessing(false);
    }
  };

  // Handle PayFast checkout for paid orders
  const handlePayFastCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    try {
      setProcessing(true);
      const orderId = `ORDER-${new Date().getTime()}`;
      const orderDate = new Date().toISOString().split('T')[0];

      // Create the order data first
      const orderData = {
        cart_details: cartItems.map((item: CartItem) => ({
          personalized: item.personalized || null,
          product_id: item._id,
          quantity: item.quantity,
        })),
      };

      // Place the order before redirecting to PayFast
      const orderResponse = await placeOrder(orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to place order');
      }

      // Store order and payment IDs for confirmation after payment
      localStorage.setItem('order_id', orderResponse.data.order_id);
      localStorage.setItem('payment_id', orderResponse.data.payment_id);

      // If payment is already marked as free, skip PayFast and go to confirmation
      if (orderResponse.data.payment_type === 'free') {
        await confirmOrder(
          orderResponse.data.order_id,
          orderResponse.data.payment_id
        );
        clearCart();
        router.push('/thankyou');
        return;
      }

      // Proceed with PayFast for paid orders
      const tokenResponse = await fetch(
        `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
      );

      if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
      const responseData = await tokenResponse.json();
      const token = responseData.ACCESS_TOKEN;
      if (!token) throw new Error('Invalid token response from PayFast');

      const formData = {
        MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
        MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'My Merchant',
        TOKEN: token,
        PROCCODE: '00',
        TXNAMT: totalAmount.toFixed(2),
        CUSTOMER_MOBILE_NO: '03000000000',
        CUSTOMER_EMAIL_ADDRESS: 'rizcmt195@gmail.com',
        SIGNATURE: generateSignature(
          process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
          token
        ),
        VERSION: 'MY_VER_1.0',
        TXNDESC: `Payment for Order #${orderResponse.data.order_id}`,
        SUCCESS_URL: `${window.location.origin}/success?order_id=${orderResponse.data.order_id}&payment_id=${orderResponse.data.payment_id}`,
        FAILURE_URL: `${window.location.origin}/failure`,
        BASKET_ID: orderResponse.data.order_id,
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

      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(
        error.message || 'An unexpected error occurred during checkout'
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckout = () => {
    // Check if all items are free
    const allItemsFree = cartItems.every((item) => item.price === 0);

    if (allItemsFree) {
      handleDirectCheckout();
    } else {
      handlePayFastCheckout();
    }
  };

  return (
    <div className="at-checkoutcontainer">
      {cartItems.length === 0 ? (
        <div className="at-empty-cart">
          <h2>Your Cart is Empty</h2>
          <p>Please add items to your cart before proceeding to checkout.</p>
          <button
            onClick={() => router.push('/shop')}
            className="at-btn at-btn-secondary mt-4"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="at-checkoutpage">
          <h2>Order Summary</h2>
          <ul className="at-checkout-items">
            {cartItems.map((item) => (
              <li key={item._id} className="at-checkout-item">
                <div className="at-itemimagedecriptionarea">
                  <figure className="at-cartproductimage">
                    <img src={item.image_path} alt={item.name} />
                  </figure>
                  <div className="at-cartproductname">
                    <h4>{item.name}</h4>
                    <em>{item.description}</em>
                    <span className="at-item-quantity">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="at-itemcheckoutprice">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="at-productcheckoutsummery">
            <p className="at-summary-row">
              <span className="at-summary-label">Subtotal:</span>
              <span className="at-summary-value">
                Rs. {subtotal.toFixed(2)}
              </span>
            </p>
            <p className="at-summary-row">
              <span className="at-summary-label">Sales Tax (17%):</span>
              <span className="at-summary-value">
                Rs. {salesTax.toFixed(2)}
              </span>
            </p>
            <p className="at-summary-row at-summary-total">
              <span className="at-summary-label">Total Amount:</span>
              <span className="at-summary-value">
                Rs. {totalAmount.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="at-payment-notice">
            <p>
              {totalAmount > 0
                ? 'You will be redirected to PayFast secure payment gateway to complete your payment.'
                : 'Your order is free and will be processed immediately.'}
            </p>
          </div>
          <div className="at-btnplaceholder at-btnaddtocart">
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="at-btn at-btn-lg text-center justify-center"
            >
              {processing
                ? 'Processing...'
                : totalAmount > 0
                ? 'Proceed to Payment'
                : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(CheckOutPage);
