// src/components/page-ui/checkout_page.tsx

'use client';
import { useState, useEffect } from 'react';
// Import PersonalizedMessage and CartItem (as CartContextItem) from your context
import { useCart, PersonalizedMessage, CartItem as CartContextItem } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import withAuth from '@/hoc/withAuth';
import { placeOrder, confirmOrder } from '@/services/api.service';
import { toast } from 'react-toastify';

// This interface should align with what CartContextItem provides,
// ensuring all fields used in the JSX are present.
interface CartItemForCheckout extends CartContextItem {
  // The 'personalized?: PersonalizedMessage' field will come from CartContextItem
  // Ensure image_path, name, description are part of CartContextItem
}

const CheckOutPage = () => {
  const { cartItems, clearCart } = useCart(); // cartItems are now CartContextItem[]
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  // Calculate sales tax and total amount
  const salesTaxRate = 0.17; // 17%
  const subtotal = cartItems.reduce(
    (total, item: CartItemForCheckout) => total + item.price * item.quantity,
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
        cart_details: cartItems.map((item: CartItemForCheckout) => ({
          personalized: item.personalization || null, // Accesses the PersonalizedMessage object
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

          // Assuming confirmOrder returns a success flag or throws on error
          if (confirmResponse && (confirmResponse as any).success !== false) { // Check for explicit failure if needed
            clearCart();
            router.push('/thankyou');
          } else {
            toast.error((confirmResponse as any)?.message || 'Failed to confirm free order.');
          }
        }
        // If not free and success, it implies payment_type wasn't 'free' but order placed.
        // This case might not happen if all paid orders go via PayFast path.
      } else {
        toast.error(orderResponse.message || 'Failed to place order');
      }
    } catch (error: any) {
      console.error('Checkout error (direct):', error);
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
      // const orderId = `ORDER-${new Date().getTime()}`; // Backend will generate order_id
      const orderDate = new Date().toISOString().split('T')[0];

      // Create the order data first
      const orderData = {
        cart_details: cartItems.map((item: CartItemForCheckout) => ({
          personalized: item.personalization || null, // Accesses the PersonalizedMessage object
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

      // If payment is already marked as free (e.g. total became 0 after discounts not shown here), skip PayFast
      if (orderResponse.data.payment_type === 'free') {
        const confirmResponse = await confirmOrder(
          orderResponse.data.order_id,
          orderResponse.data.payment_id
        );
        if (confirmResponse && (confirmResponse as any).success !== false) {
          clearCart();
          router.push('/thankyou');
        } else {
            toast.error((confirmResponse as any)?.message || 'Failed to confirm free order.');
        }
        return; // Important to return after handling free order
      }

      // Proceed with PayFast for paid orders
      const tokenResponse = await fetch(
        `/api/payfast?merchant_id=${process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID}&secured_key=${process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY}`
      );

      if (!tokenResponse.ok) throw new Error('Failed to fetch PayFast token');
      const responseData = await tokenResponse.json();
      const token = responseData.ACCESS_TOKEN;
      if (!token) throw new Error('Invalid token response from PayFast');

      const formData: Record<string, string> = { // Explicitly type formData
        MERCHANT_ID: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
        MERCHANT_NAME: process.env.NEXT_PUBLIC_STORE_NAME || 'My Merchant',
        TOKEN: token,
        PROCCODE: '00',
        TXNAMT: totalAmount.toFixed(2),
        CUSTOMER_MOBILE_NO: '03000000000', // Placeholder - should be dynamic
        CUSTOMER_EMAIL_ADDRESS: 'rizcmt195@gmail.com', // Placeholder - should be dynamic
        SIGNATURE: generateSignature(
          process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
          token
        ),
        VERSION: 'MY_VER_1.0', // Or 'PYMT_WEB_DI_1.0' as seen in price filter. Ensure consistency.
        TXNDESC: `Payment for Order #${orderResponse.data.order_id}`,
        SUCCESS_URL: `${window.location.origin}/success?order_id=${orderResponse.data.order_id}&payment_id=${orderResponse.data.payment_id}`,
        FAILURE_URL: `${window.location.origin}/failure?order_id=${orderResponse.data.order_id}`, // Added order_id for context
        BASKET_ID: orderResponse.data.order_id,
        ORDER_DATE: orderDate,
        CHECKOUT_URL: `${window.location.origin}/confirm?order_id=${orderResponse.data.order_id}`, // Merchant-side confirmation endpoint
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
      // No need to remove form, navigation will occur
    } catch (error: any) {
      console.error('Checkout error (PayFast):', error);
      toast.error(
        error.message || 'An unexpected error occurred during checkout'
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckout = () => {
    const allItemsFree = cartItems.every((item: CartItemForCheckout) => item.price === 0);

    if (allItemsFree && totalAmount === 0) { // Ensure totalAmount is also 0
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
            onClick={() => router.push('/home')}
            className="at-btn at-btn-secondary mt-4"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="at-checkoutpage">
          <h2>Order Summary</h2>
          <ul className="at-checkout-items">
            {cartItems.map((item: CartItemForCheckout) => (
              <li key={item._id} className="at-checkout-item">
                <div className="at-itemimagedecriptionarea">
                  <figure className="at-cartproductimage">
                    {/* Ensure item.image_path, item.name are available from CartContextItem */}
                    <img src={item.image_path} alt={item.name} />
                  </figure>
                  <div className="at-cartproductname">
                    <h4>{item.name}</h4>
                    {/* Ensure item.description is available from CartContextItem */}
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
              <br/><br/>
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