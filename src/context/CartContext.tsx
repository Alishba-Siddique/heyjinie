'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  setLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
} from '@/utils/localStorage';
import { toast } from 'react-toastify';

interface CartItem {
  _id: string;
  price: number;
  quantity: number;
  image_path: string;
  name: string;
  description: string;
  personalization?: {
    image_id: string;
    message: string;
    name: string;
    image_path: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  orderHistory: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCartItems = getLocalStorageItem('cartItems');
      const storedOrderHistory = getLocalStorageItem('orderHistory');
      if (storedCartItems) setCartItems(storedCartItems);
      if (storedOrderHistory) setOrderHistory(storedOrderHistory);
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i._id === item._id);
      const updatedItems = existingItem
        ? prevItems.map((i) =>
            i._id === item._id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
        : [...prevItems, item];

      setLocalStorageItem('cartItems', updatedItems);
      return updatedItems;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item._id === id);
      if (itemToRemove) {
        setOrderHistory((prevHistory) => {
          // Check if the item is already in orderHistory
          if (!prevHistory.some((item) => item._id === itemToRemove._id)) {
            const updatedHistory = [...prevHistory, itemToRemove];
            setLocalStorageItem('orderHistory', updatedHistory);
            return updatedHistory;
          }
          return prevHistory; // Return existing history if item already exists
        });
      }

      const updatedCartItems = prevItems.filter((item) => item._id !== id);
      setLocalStorageItem('cartItems', updatedCartItems);
      return updatedCartItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    removeLocalStorageItem('cartItems');
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        orderHistory,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
