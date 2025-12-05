import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../data/menuData';

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: 'norm' | 'perhe' | 'pannu' | 'single';
  selectedPrice: number;
  notes?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem, size?: 'norm' | 'perhe' | 'pannu' | 'single', notes?: string) => void;
  removeFromCart: (itemId: number, size?: string) => void;
  updateQuantity: (itemId: number, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('victoryPizzaCart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('victoryPizzaCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (item: MenuItem, size?: 'norm' | 'perhe' | 'pannu' | 'single', notes?: string) => {
    const selectedSize = size || (item.prices.single !== undefined ? 'single' : 'norm');
    const selectedPrice = item.prices[selectedSize] || 0;

    setCartItems(prev => {
      const existingItem = prev.find(
        i => i.id === item.id && i.selectedSize === selectedSize
      );

      if (existingItem) {
        return prev.map(i =>
          i.id === item.id && i.selectedSize === selectedSize
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1, selectedSize, selectedPrice, notes }];
    });
  };

  const removeFromCart = (itemId: number, size?: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.id === itemId && item.selectedSize === size)
    ));
  };

  const updateQuantity = (itemId: number, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(itemId, size);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.selectedPrice * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
