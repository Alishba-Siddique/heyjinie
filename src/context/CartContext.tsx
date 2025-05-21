// src/context/CartContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback, // Import useCallback
} from 'react';
import {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
} from '@/utils/localStorage';

// Define the personalization structure clearly
export interface PersonalizedMessage {
  name: string;
  message: string;
  image_path: string;
  image_id: string;
  productId?: string; // Optional: productId might be redundant if keyed by product ID elsewhere
}

// Define the Cart Item structure, including optional personalization
export interface CartItem {
  _id: string;
  price: number;
  quantity: number;
  image_path: string;
  name: string;
  description: string;
  personalization?: PersonalizedMessage; // Make it optional
}

// Define the shape of the context value
interface CartContextType {
  cartItems: CartItem[];
  orderHistory: CartItem[]; // Keep orderHistory if it's used elsewhere
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  // Add the new function signature
  updateItemPersonalization: (
    productId: string,
    personalizationData: PersonalizedMessage | null
  ) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<CartItem[]>([]); // Keep if used

  // Load initial state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCartItems = getLocalStorageItem('cartItems') as CartItem[]; // Add type safety
      const storedOrderHistory = getLocalStorageItem('orderHistory') as CartItem[]; // Add type safety
      if (storedCartItems) {
        console.log('[CartProvider] Loaded cartItems from localStorage:', storedCartItems);
        setCartItems(storedCartItems);
      }
      if (storedOrderHistory) {
        console.log('[CartProvider] Loaded orderHistory from localStorage:', storedOrderHistory);
        setOrderHistory(storedOrderHistory);
      }
    }
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i._id === item._id);
      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update quantity and potentially personalization if the added item has it
        updatedItems = prevItems.map((i, index) =>
          index === existingItemIndex
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                // Overwrite personalization if the newly added item has it defined
                // Or keep existing if the new one doesn't specify it
                personalization: item.personalization !== undefined ? item.personalization : i.personalization,
              }
            : i
        );
      } else {
        // Add new item
        updatedItems = [...prevItems, item];
      }

      console.log('[CartProvider] Updating cartItems (addToCart):', updatedItems);
      setLocalStorageItem('cartItems', updatedItems); // Persist changes
      return updatedItems;
    });
  }, []); // No dependencies, safe to use useCallback

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prevItems) => {
      // Keep orderHistory logic if needed
      const itemToRemove = prevItems.find((item) => item._id === id);
      if (itemToRemove) {
        setOrderHistory((prevHistory) => {
          if (!prevHistory.some((item) => item._id === itemToRemove._id)) {
            const updatedHistory = [...prevHistory, itemToRemove];
            console.log('[CartProvider] Updating orderHistory:', updatedHistory);
            setLocalStorageItem('orderHistory', updatedHistory);
            return updatedHistory;
          }
          return prevHistory;
        });
      }

      const updatedCartItems = prevItems.filter((item) => item._id !== id);
      console.log('[CartProvider] Updating cartItems (removeFromCart):', updatedCartItems);
      setLocalStorageItem('cartItems', updatedCartItems); // Persist changes
      return updatedCartItems;
    });
  }, []); // No dependencies, safe to use useCallback

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, quantity) } // Ensure quantity is at least 1
          : item
      );
      console.log('[CartProvider] Updating cartItems (updateQuantity):', updatedItems);
      setLocalStorageItem('cartItems', updatedItems); // Persist changes
      return updatedItems;
    });
  }, []); // No dependencies, safe to use useCallback

  // --- Implementation of the new function ---
  const updateItemPersonalization = useCallback(
    (productId: string, personalizationData: PersonalizedMessage | null) => {
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item._id === productId
            ? {
                ...item,
                // Set to the new data, or undefined if null is passed (to remove it)
                personalization: personalizationData || undefined,
              }
            : item
        );
        console.log(`[CartProvider] Updating personalization for ${productId}:`, updatedItems);
        setLocalStorageItem('cartItems', updatedItems); // Persist changes
        return updatedItems;
      });
    },
    [] // No dependencies, safe to use useCallback
  );
  // --- End of new function ---

  const clearCart = useCallback(() => {
    setCartItems([]);
    console.log('[CartProvider] Clearing cartItems.');
    removeLocalStorageItem('cartItems');
  }, []); // No dependencies, safe to use useCallback

  // Calculate cart count based on current items
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Provide all values including the new function
  const contextValue = {
    cartItems,
    orderHistory,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    updateItemPersonalization, // Add the new function here
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};