// src/components/cart_page/cart_page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import withAuth from '@/hoc/withAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string;
}

interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image_path: string;
  personalization?: PersonalizedMessage;
}

const CartPage = () => {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: PersonalizedMessage | undefined;
  }>({});

  useEffect(() => {
    calculateTotalPrice(cartItems);
  }, [cartItems]);

  const calculateTotalPrice = (items: CartItem[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  useEffect(() => {
    // Load selected messages from local storage on mount
    const storedSelectedMessages = localStorage.getItem(
      'selectedPersonalizedMessages'
    );
    if (storedSelectedMessages) {
      try {
        const parsedMessages: PersonalizedMessage[] = JSON.parse(
          storedSelectedMessages
        );
        const transformedMessages: { [key: string]: PersonalizedMessage } =
          parsedMessages.reduce(
            (acc: { [key: string]: PersonalizedMessage }, message) => {
              if (message.productId) {
                acc[message.productId] = message;
              }
              return acc;
            },
            {}
          );

        setPersonalizedMessages(transformedMessages);
      } catch (error) {
        console.error(
          'Error parsing or transforming selected personalized messages:',
          error
        );
      }
    }
  }, []);

  const hasPersonalization = (productId: string) => {
    return !!personalizedMessages[productId];
  };

  const handlePersonalizeClick = (item: CartItem) => {
    sessionStorage.setItem('currentItemId', item._id);
    sessionStorage.setItem('returnPath', '/cart');
    router.push('/messages');
  };

  const handleCheckoutClick = () => {
    sessionStorage.setItem('returnPath', '/cart');
    if (cartItems.length === 0) {
      toast.error(
        'Your cart is empty. Please add items to your cart before proceeding to checkout.'
      );
      return;
    }
    router.push('/checkout');
  };

  return (
    <main className="at-cartpagemainarea">
      <div className="at-carttable">
        <table className="at-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th className="text-left justify-start">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  No items in the cart.
                </td>
              </tr>
            ) : (
              cartItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <figure className="at-cartproductimage">
                      <img src={item.image_path} alt={item.name} />
                    </figure>
                    <div className="at-cartproductname">
                      <h4>{item.name}</h4>
                      <em>{item.description}</em>
                    </div>
                  </td>
                  <td>
                    <span>${item.price.toFixed(2)}</span>
                  </td>
                  <td>
                    <div className="at-btnquntatiyholder at-btnquntatityupdown">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                    <span className="at-removeitem ml-4">
                      <button onClick={() => removeFromCart(item._id)}>
                        Remove
                      </button>
                    </span>
                  </td>
                  <td>
                    <div className="at-btnaddtocart">
                      <button
                        className="at-btn at-btnpersonal"
                        onClick={() => handlePersonalizeClick(item)}
                      >
                        Personalize
                        <input
                          type="checkbox"
                          checked={hasPersonalization(item._id)}
                          readOnly
                          className="ml-2"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="at-btnaddtocart justify-center mt-4">
          <div className="flex gap-4">
            <button className="at-btn" onClick={handleCheckoutClick}>
              Go to Checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default withAuth(CartPage);
