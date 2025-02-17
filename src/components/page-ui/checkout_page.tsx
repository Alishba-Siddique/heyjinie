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
import React from 'react';
import { useCart } from '@/context/CartContext'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation';
import withAuth from '@/hoc/withAuth';
import { placeOrder } from '@/services/api.service';
import { toast } from 'react-toastify';
import { initiatePayFastPayment } from '@/services/payment.service';

const CheckOutPage = () => {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

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

    // Map cart items to the required structure
    const cartDetails = cartItems.map((item) => ({
      product_id: item._id,
      quantity: item.quantity,
      personalization: item.personalization?.message || null, // Add personalization if available
    }));

    // Construct order data
    const orderData = {
      cart_details: cartDetails,
      personalized: cartDetails.map((item) => item.personalization), // Array of personalization messages
    };

    try {
      const response = await placeOrder(orderData);
      if (response.success) {
        toast.success('Order placed successfully!');
        clearCart();
  
        // Prepare PayFast payment data
        const payFastData = {
          merchant_id: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID,
          secured_key: process.env.NEXT_PUBLIC_PAYFAST_SECURED_KEY,
          basket_id: response.data.order_id,
          trans_amount: totalAmount.toFixed(2),
          currency_code: 'PKR',
          customer_email: 'customer@example.com', // Replace with actual customer email
          customer_mobile: '03000000000', // Replace with actual customer mobile number
          success_url: `${process.env.NEXT_PUBLIC_PAYFAST_PORT_URL}/success`,
          failure_url: `${process.env.NEXT_PUBLIC_PAYFAST_PORT_URL}/failure`,
          checkout_url: `${process.env.NEXT_PUBLIC_PAYFAST_PORT_URL}/checkout`,
          order_date: new Date().toISOString(),
          order_id: response.data.order_id,
          store_name: 'My Store', // Replace with your store name
          service_fee: '0.00', // Replace with actual service fee if applicable
        };
  
        // Redirect to PayFast WebView
        await initiatePayFastPayment(payFastData);
      } else {
        toast.error(response.message || 'Failed to place order.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="at-checkoutcontainer">
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. Please add items to your cart before proceeding to
          checkout.
        </p>
      ) : (
        <div className="at-checkoutpage">
          <h2>Order Summary</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                <div className="at-itemimagedecriptionarea">
                  <figure
                    className="at-cartproductimage"
                    style={{
                      width: '72px',
                      height: '66px',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      margin: '0 16px 0 0',
                    }}
                  >
                    <img src={item.image_path} alt={item.name} />
                  </figure>
                  <div className="at-cartproductname">
                    <h4>{item.name}</h4>
                    <em>{item.description}</em>
                    {item.personalization && (
                      <div>
                        <p>
                          Personalized Message: {item.personalization.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <span className="at-itemcheckoutprice">Rs.{item.price}</span>
              </li>
            ))}
          </ul>
          <div className="at-productcheckoutsummery pt-5">
            <p>
              <span>Subtotal: </span>
              <span>Rs. {subtotal.toFixed(2)}</span>
            </p>
            <p>
              <span>Sales Tax (17%): </span>
              <span>Rs. {salesTax.toFixed(2)}</span>
            </p>
            <p>
              <span>Total Amount: </span>
              <span>Rs. {totalAmount.toFixed(2)}</span>
            </p>
          </div>

          <div className="at-btnplaceholder at-btnaddtocart mt-8">
            <button
              onClick={handlePlaceOrder}
              className="at-btn at-btn-lg text-center justify-center"
            >
              Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(CheckOutPage);