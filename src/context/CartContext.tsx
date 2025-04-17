'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Define the cart item interface
export interface CartItem {
  courseId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  discountedPrice?: number;
}

// Define discount tiers
export interface DiscountTier {
  threshold: number;
  percentage: number;
  description: string;
}

// List of quantity-based discount tiers
export const DISCOUNT_TIERS: DiscountTier[] = [
  { threshold: 2, percentage: 5, description: '5% скидка при покупке 2 курсов' },
  { threshold: 3, percentage: 10, description: '10% скидка при покупке 3 курсов' },
  { threshold: 5, percentage: 15, description: '15% скидка при покупке 5 курсов' },
];

// Define the context type
interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (courseId: string) => boolean;
  getApplicableDiscount: () => DiscountTier | null;
  getDiscountAmount: () => number;
  getFinalPrice: () => number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cookie name for cart
const CART_COOKIE_NAME = 'irnby_cart';

// CartProvider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart data from cookie on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartCookie = Cookies.get(CART_COOKIE_NAME);
        if (cartCookie) {
          const cartData = JSON.parse(cartCookie);
          setItems(cartData);
        }
      } catch (error) {
        console.error('Error loading cart data:', error);
      }
    };

    loadCart();
  }, []);

  // Save cart to cookie whenever it changes
  useEffect(() => {
    Cookies.set(CART_COOKIE_NAME, JSON.stringify(items), { expires: 7 });
  }, [items]);

  // Calculate all prices with discount logic
  const recalculatePrices = (currentItems: CartItem[]): CartItem[] => {
    // Calculate total quantity for quantity-based discounts
    const totalQuantity = currentItems.reduce((total, item) => total + item.quantity, 0);

    // Find the applicable discount tier
    const discountTier = DISCOUNT_TIERS.filter(tier => totalQuantity >= tier.threshold)
      .sort((a, b) => b.threshold - a.threshold)[0] || null;

    // If no discount applies, return items unchanged
    if (!discountTier) {
      return currentItems.map(item => ({ ...item, discountedPrice: undefined }));
    }

    // Apply discounts to each item
    return currentItems.map(item => {
      const discountedPrice = Math.round(item.price * (1 - discountTier.percentage / 100));
      return { ...item, discountedPrice };
    });
  };

  // Add an item to the cart
  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Check if the item is already in the cart
      const existingItem = prevItems.find(i => i.courseId === item.courseId);

      if (existingItem) {
        // If it exists, update the quantity
        const updatedItems = prevItems.map(i =>
          i.courseId === item.courseId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );

        // Recalculate all prices with discounts
        return recalculatePrices(updatedItems);
      }

      // Otherwise add it as a new item
      const updatedItems = [...prevItems, { ...item, quantity: 1 }];

      // Recalculate all prices with discounts
      return recalculatePrices(updatedItems);
    });
  };

  // Remove an item from the cart
  const removeItem = (courseId: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.courseId !== courseId);
      return recalculatePrices(updatedItems);
    });
  };

  // Update the quantity of an item
  const updateQuantity = (courseId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(courseId);
      return;
    }

    setItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.courseId === courseId
          ? { ...item, quantity }
          : item
      );
      return recalculatePrices(updatedItems);
    });
  };

  // Clear the entire cart
  const clearCart = () => {
    setItems([]);
  };

  // Get the total number of items in the cart
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get the total price of all items in the cart (without discounts)
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get the applicable discount tier
  const getApplicableDiscount = (): DiscountTier | null => {
    const totalQuantity = getTotalItems();

    // Find the highest applicable discount
    return DISCOUNT_TIERS.filter(tier => totalQuantity >= tier.threshold)
      .sort((a, b) => b.threshold - a.threshold)[0] || null;
  };

  // Get the discount amount in currency
  const getDiscountAmount = (): number => {
    const totalPrice = getTotalPrice();
    const discount = getApplicableDiscount();

    if (!discount) return 0;

    return Math.round(totalPrice * (discount.percentage / 100));
  };

  // Get the final price after discounts
  const getFinalPrice = (): number => {
    return getTotalPrice() - getDiscountAmount();
  };

  // Check if a course is in the cart
  const isInCart = (courseId: string) => {
    return items.some(item => item.courseId === courseId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getApplicableDiscount,
        getDiscountAmount,
        getFinalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
