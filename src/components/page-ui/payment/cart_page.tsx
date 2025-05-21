// src/components/cart_page/cart_page.tsx

'use client';
import { useEffect, useState, useCallback } from 'react';
// Import PersonalizedMessage and CartItem (as CartContextItem) from your context
import {
  useCart,
  PersonalizedMessage,
  CartItem as CartContextItem,
} from '@/context/CartContext';
import withAuth from '@/hoc/withAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const PRODUCT_PLACEHOLDER = '/images/logoicons.png';

// This interface is for the structure of messages loaded from localStorage.
// It should match PersonalizedMessage from CartContext.
interface LocalStoragePersonalizedMessage extends PersonalizedMessage {}

// This interface represents the cart item as it comes from CartContext.
interface CartItemForDisplay extends CartContextItem {}

const CartPage = () => {
  const router = useRouter();
  // Destructure updateItemPersonalization from useCart
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateItemPersonalization,
    clearCart,
  } = useCart();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isClearCartDialogOpen, setIsClearCartDialogOpen] = useState(false);

  // Local state for personalized messages read from localStorage.
  // This is used for quick UI updates (checkbox) and as the source for syncing with context.
  const [localPersonalizedMessages, setLocalPersonalizedMessages] = useState<
    Record<string, LocalStoragePersonalizedMessage | undefined>
  >({});

  // --- Load personalized messages from localStorage into local state ---
  const loadPersonalizedMessagesFromStorage = useCallback(() => {
    const storedMessagesRaw = localStorage.getItem(
      'selectedPersonalizedMessages'
    );
    console.log(
      '[CartPage - loadPersonalizedMessagesFromStorage] Raw value from localStorage:',
      storedMessagesRaw
    );
    try {
      // Default to null if storedMessagesRaw is empty/null to avoid parsing "null"
      const messages = storedMessagesRaw ? JSON.parse(storedMessagesRaw) : {};
      console.log(
        '[CartPage - loadPersonalizedMessagesFromStorage] Parsed messages:',
        messages
      );
      console.log(
        '[CartPage - loadPersonalizedMessagesFromStorage] Type of parsed:',
        typeof messages,
        'Is Array:',
        Array.isArray(messages)
      );

      if (
        messages &&
        typeof messages === 'object' &&
        !Array.isArray(messages)
      ) {
        setLocalPersonalizedMessages(messages);
        console.log(
          '[CartPage - loadPersonalizedMessagesFromStorage] SUCCESS: Set localPersonalizedMessages state with OBJECT:',
          messages
        );
      } else {
        console.warn(
          '[CartPage - loadPersonalizedMessagesFromStorage] WARN: Parsed value is NOT a valid object. Setting empty state. Found:',
          messages
        );
        setLocalPersonalizedMessages({}); // Ensure state is reset to a valid empty object
      }
    } catch (error) {
      console.error(
        '[CartPage - loadPersonalizedMessagesFromStorage] ERROR parsing localStorage:',
        error,
        'Raw value was:',
        storedMessagesRaw
      );
      setLocalPersonalizedMessages({}); // Ensure state is reset on error
    }
  }, []);

  // --- Effect to load messages on mount and listen to storage changes ---
  useEffect(() => {
    loadPersonalizedMessagesFromStorage(); // Initial load

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'selectedPersonalizedMessages') {
        console.log(
          "[CartPage] Storage event detected for 'selectedPersonalizedMessages'. Reloading local state."
        );
        loadPersonalizedMessagesFromStorage();
      }
      // You also had a listener for 'personalizedMessages' - re-add if needed for other purposes
      // if (event.key === 'personalizedMessages') {
      //   console.log("[CartPage] Storage event triggered for 'personalizedMessages'");
      // }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadPersonalizedMessagesFromStorage]);

  // --- EFFECT TO SYNC CART CONTEXT WITH LOCALSTORAGE PERSONALIZATION ---
  useEffect(() => {
    if (
      cartItems.length > 0 &&
      typeof updateItemPersonalization === 'function'
    ) {
      console.log(
        '[CartPage Sync Effect] Attempting to sync CartContext with localPersonalizedMessages.'
      );
      let contextUpdated = false;
      cartItems.forEach((cartItem: CartItemForDisplay) => {
        const personalizationFromStorage =
          localPersonalizedMessages[cartItem._id];
        // Using JSON.stringify for simple comparison. For complex objects or order-sensitive cases, a deep-equal function is better.
        if (
          JSON.stringify(cartItem.personalization) !==
          JSON.stringify(personalizationFromStorage)
        ) {
          console.log(
            `[CartPage Sync Effect] Discrepancy found for ${cartItem._id}. Updating CartContext.`
          );
          updateItemPersonalization(
            cartItem._id,
            personalizationFromStorage || null
          ); // Pass null to clear if undefined in storage
          contextUpdated = true;
        }
      });
      if (contextUpdated) {
        console.log(
          '[CartPage Sync Effect] CartContext items were updated with new personalizations.'
        );
      } else {
        console.log(
          '[CartPage Sync Effect] No personalization discrepancies found requiring CartContext update.'
        );
      }
    }
  }, [cartItems, localPersonalizedMessages, updateItemPersonalization]); // Dependencies: run when these change.

  // --- Calculate total price ---
  useEffect(() => {
    calculateTotalPrice(cartItems);
  }, [cartItems]);

  const calculateTotalPrice = (items: CartItemForDisplay[]) => {
    const total = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  // --- Helper to check if an item has personalization (based on local state for checkbox) ---
  const hasPersonalization = (productId: string): boolean => {
    // This reflects the `localPersonalizedMessages` state, which is driven by localStorage.
    // The sync effect ensures the context eventually matches this.
    const storedMessages = localStorage.getItem('selectedPersonalizedMessages'); // Direct check for immediate UI consistency
    if (storedMessages) {
      try {
        const messages = JSON.parse(storedMessages);
        if (
          messages &&
          typeof messages === 'object' &&
          !Array.isArray(messages)
        ) {
          return messages.hasOwnProperty(productId);
        }
      } catch (e) {
        console.error(
          "Error parsing 'selectedPersonalizedMessages' in hasPersonalization:",
          e
        );
        return false;
      }
    }
    return false;
    // return !!localPersonalizedMessages[productId]; // Alternative: rely on local state if consistently updated
  };

  // --- Navigate to personalization page ---
  const handlePersonalize = (productId: string) => {
    localStorage.setItem('currentItemId', productId);
    localStorage.setItem('returnPath', window.location.pathname); // current path is /cart
    router.push('/messages');
  };

  // --- Navigate to checkout ---
  const handleCheckoutClick = () => {
    // localStorage.setItem('returnPath', '/cart'); // Not strictly necessary if already on /cart
    if (cartItems.length === 0) {
      toast.error(
        'Your cart is empty. Please add items to your cart before proceeding to checkout.'
      );
      return;
    }
    // The sync useEffect should have updated the cartItems in CartContext by this point.
    router.push('/checkout');
  };

  // --- Handle initiating cart clear with dialog ---
  const handleClearCartClick = () => {
    if (cartItems.length === 0) {
      toast.info('Your cart is already empty.');
      return;
    }
    setIsClearCartDialogOpen(true);
  };

  // --- Handle confirmed cart clear ---
  const handleConfirmClearCart = () => {
    clearCart();
    toast.success('All items have been removed from your cart.');
    setIsClearCartDialogOpen(false);
  };

  // --- Handle cancel cart clear ---
  const handleCancelClearCart = () => {
    setIsClearCartDialogOpen(false);
  };

  return (
    <main className="at-cartpagemainarea">
      <div className="flex justify-between at-btnaddtocart mb-6">
        <div className="text-3xl font-bold">Cart</div>
        {cartItems.length > 0 && (
          <button
            className="at-btn at-btn-danger"
            onClick={handleClearCartClick}
          >
            Remove All Items
          </button>
        )}
      </div>

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
              cartItems.map(
                (
                  item: CartItemForDisplay // item is from CartContext
                ) => (
                  <tr key={item._id}>
                    <td>
                      <figure className="at-cartproductimage">
                        {/* Ensure item.image_path, item.name, item.description are from CartContextItem */}
                        {item.image_path !== null ? (
                          <img
                            src={item.image_path || PRODUCT_PLACEHOLDER}
                            alt={item.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                PRODUCT_PLACEHOLDER;
                            }}
                          />
                        ) : (
                          <img
                            src={PRODUCT_PLACEHOLDER}
                            alt={item.name !== '' ? item.name : 'item Name'}
                          />
                        )}
                      </figure>
                      <div className="at-cartproductname">
                        <h4>{item.name}</h4>
                        <em>{item.description}</em>
                      </div>
                    </td>
                    <td>
                      <span>Rs.{item.price.toFixed(2)}</span>
                    </td>
                    <td>
                      <div className="at-btnquntatiyholder at-btnquntatityupdown">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1} // Prevent quantity from going below 1
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
                      <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
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
                          onClick={() => {
                            console.log(
                              'Personalizing product from cart page:',
                              item._id
                            );
                            handlePersonalize(item._id);
                          }}
                        >
                          Personalize
                          <label className="custom-checkbox top-2">
                            <input
                              className="align-middle"
                              type="checkbox"
                              // Use hasPersonalization which checks localPersonalizedMessages for immediate UI feedback
                              checked={hasPersonalization(item._id)}
                              readOnly // Checkbox is an indicator, not directly interactive
                            />
                            <span className="checkmark"></span>
                          </label>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
        <div className="at-btnaddtocart justify-center mt-4">
          <div className="flex gap-4">
            <button className="at-btn" onClick={handleCheckoutClick}>
              Go to Checkout
            </button>
            {cartItems.length > 0 && (
              <button
                className="at-btn at-btn-danger"
                onClick={handleClearCartClick}
              >
                Remove All Items
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={isClearCartDialogOpen}
        onOpenChange={setIsClearCartDialogOpen}
      >
        <DialogContent className="flex-column justify-center">
          <DialogHeader>
            <DialogTitle className="shadow-lg">
              <Image
                src="/images/logoIcons.png"
                alt="logo"
                width={70}
                height={70}
                className="mx-auto -mt-14"
              />
            </DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to remove all items from your cart?
            </DialogDescription>
          </DialogHeader>
          <div className="at-termsandcondition">
            <div className="at-btnsubmit at-btnhtermsandcondition at-btnorder">
              <button
                type="button"
                onClick={handleCancelClearCart}
                className="at-btn at-btncancel"
              >
                No
              </button>
              <button
                type="button"
                className="at-btn"
                onClick={handleConfirmClearCart}
              >
                Yes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default withAuth(CartPage);
