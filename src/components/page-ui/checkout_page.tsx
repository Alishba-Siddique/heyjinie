// // src/components/checkout_page/checkout_page.tsx
// 'use client';
// import React from 'react';
// import { useCart} from '@/context/CartContext'; // Adjust the import path as necessary
// import { useRouter } from 'next/navigation';
// import withAuth from '@/hoc/withAuth';
// import { placeOrder } from '@/services/api.service';
// import { toast } from 'react-toastify';

// const CheckOutPage = () => {
//   const { cartItems, clearCart } = useCart();
//   const router = useRouter();

//   // Calculate sales tax and total amount
//   const salesTaxRate = 0.17; // 17%
//   const subtotal = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );
//   const salesTax = subtotal * salesTaxRate;
//   const totalAmount = subtotal + salesTax;

//   // Handle checkout submission (you can implement your own logic here)

//   const handlePlaceOrder = async () => {
//     if (!cartItems || cartItems.length === 0) {
//       toast.error('Your cart is empty!');
//       return;
//     }

//     // Map cart items to the required structure
//     const cartDetails = cartItems.map((item) => ({
//       product_id: item._id,
//       quantity: item.quantity,
//       personalization: item.personalization?.message || null, // Add personalization if available
//     }));

//     // Construct order data
//     const orderData = {
//       cart_details: cartDetails,
//       personalized: cartDetails.map((item) => item.personalization), // Array of personalization messages
//     };

//     try {
//       const response = await placeOrder(orderData);
//       // console.log('Place Order Response:', response);
//       if (response.success) {
//         toast.success('Order placed successfully!');
//         // Clear the cart
//         clearCart();

//         router.push('/thankyou');
//       } else {
//         toast.error(response.message || 'Failed to place order.');
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'An unexpected error occurred.');
//     }
//   };

//   return (
//     <div className="at-checkoutcontainer">
//       {/* <h1>Checkout</h1> */}
//       {cartItems.length === 0 ? (
//         <p>
//           Your cart is empty. Please add items to your cart before proceeding to
//           checkout.
//         </p>
//       ) : (
//         <div className="at-checkoutpage">
//           <h2>Order Summary</h2>
//           <ul>
//             {cartItems.map((item) => (
//               <li key={item._id}>
//                 <div className="at-itemimagedecriptionarea">
//                   <figure
//                     className="at-cartproductimage"
//                     style={{
//                       width: '72px',
//                       height: '66px',
//                       display: 'inline-block',
//                       verticalAlign: 'middle',
//                       margin: '0 16px 0 0',
//                     }}
//                   >
//                     <img src={item.image_path} alt={item.name} />
//                   </figure>
//                   <div className="at-cartproductname">
//                     <h4>{item.name}</h4>
//                     <em>{item.description}</em>
//                     {item.personalization && (
//                       <div>
//                         <p>
//                           Personalized Message: {item.personalization.message}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <span className="at-itemcheckoutprice">Rs.{item.price}</span>
//                 {/* {item.name} - Rs.{item.price} x {item.quantity} */}
//               </li>
//             ))}
//           </ul>
//           <div className="at-productcheckoutsummery pt-5">
//             <p>
//               <span>Subtotal: </span>
//               <span>Rs. {subtotal.toFixed(2)}</span>
//             </p>
//             <p>
//               <span>Sales Tax (17%): </span>
//               <span>Rs. {salesTax.toFixed(2)}</span>
//             </p>
//             <p>
//               <span>Total Amount: </span>
//               <span>Rs. {totalAmount.toFixed(2)}</span>
//             </p>
//           </div>

//           <div className="at-btnplaceholder at-btnaddtocart mt-8">
//             {/* <a href="javascript: void(0);" className="at-btn at-btn-lg">Place Order</a> */}
//             <button
//               onClick={handlePlaceOrder}
//               className="at-btn at-btn-lg text-center justify-center"
//             >
//               Place Order
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default withAuth(CheckOutPage);


// src/components/checkout_page/checkout_page.tsx
'use client';
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import withAuth from '@/hoc/withAuth';
import { placeOrder } from '@/services/api.service';
import { initiatePayFastPayment } from '@/services/payment.service';
import { toast } from 'react-toastify';

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

  const handlePlaceOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    try {
      setProcessing(true);
      
      // Map cart items to the required structure
      const cartDetails = cartItems.map((item) => ({
        product_id: item._id,
        quantity: item.quantity,
        personalization: item.personalization?.message || null,
      }));

      // Construct order data
      const orderData = {
        cart_details: cartDetails,
        personalized: cartItems
          .filter(item => item.personalization?.message)
          .map(item => ({ 
            product_id: item._id, 
            message: item.personalization?.message 
          })),
      };

      // Place order through API
      const response = await placeOrder(orderData);
      
      if (response.success) {
        // Get current date in ISO format
        const currentDate = new Date().toISOString();
        
        // Generate a unique basket ID using order ID
        const basketId = `ORDER-${response.data.order_id}`;
        
        // Prepare PayFast payment data
        const payFastData = {
          merchant_id: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
          secured_key: process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY || '',
          basket_id: basketId,
          trans_amount: totalAmount.toFixed(2),
          currency_code: 'PKR',
          customer_email: response.data.customer?.email || 'customer@example.com',
          customer_mobile: response.data.customer?.phone || '03000000000',
          success_url: `http:localhost:3000/success`,
          failure_url: `http:localhost:3000/failure`,
          checkout_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
          order_date: currentDate,
          store_name: process.env.NEXT_PUBLIC_STORE_NAME || 'Online Store',
          txndesc: `Payment for Order #${response.data.order_id}`,
        };

        // Save order ID to localStorage for reference
        localStorage.setItem('current_order_id', response.data.order_id);
        
        // Clear cart after successful order placement
        clearCart();
        
        // Redirect to PayFast payment gateway
        await initiatePayFastPayment(payFastData);
      } else {
        toast.error(response.message || 'Failed to place order');
        setProcessing(false);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'An unexpected error occurred during checkout');
      setProcessing(false);
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
                    <span className="at-item-quantity">Qty: {item.quantity}</span>
                    {item.personalization && (
                      <div className="at-personalization">
                        <p className="at-personalization-message">
                          <span>Personalized:</span> {item.personalization.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <span className="at-itemcheckoutprice">Rs. {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          
          <div className="at-productcheckoutsummery">
            <p className="at-summary-row">
              <span className="at-summary-label">Subtotal:</span>
              <span className="at-summary-value">Rs. {subtotal.toFixed(2)}</span>
            </p>
            <p className="at-summary-row">
              <span className="at-summary-label">Sales Tax (17%):</span>
              <span className="at-summary-value">Rs. {salesTax.toFixed(2)}</span>
            </p>
            <p className="at-summary-row at-summary-total">
              <span className="at-summary-label">Total Amount:</span>
              <span className="at-summary-value">Rs. {totalAmount.toFixed(2)}</span>
            </p>
          </div>

          <div className="at-payment-notice">
            <p>You will be redirected to PayFast secure payment gateway to complete your payment.</p>
          </div>

          <div className="at-btnplaceholder at-btnaddtocart">
            <button
              onClick={handlePlaceOrder}
              disabled={processing}
              className="at-btn at-btn-lg text-center justify-center"
            >
              {processing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(CheckOutPage);