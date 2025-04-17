'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Define the purchase interface
export interface Purchase {
  courseId: string;
  orderId: string;
  purchaseDate: string;
  price?: number;
  title?: string;
  status?: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
}

// Define the wishlist item interface
export interface WishlistItem {
  courseId: string;
  dateAdded: string;
  title?: string;
  price?: number;
  image?: string;
}

// Define the user interface
export interface User {
  id: string;
  email: string;
  name?: string;
  purchases: Purchase[];
  wishlist: WishlistItem[];
  isAuthenticated: boolean;
}

// Define the context type
interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  addPurchase: (purchase: Purchase) => void;
  getPurchases: () => Purchase[];
  hasPurchased: (courseId: string) => boolean;
  getOrderHistory: () => Purchase[];
  getOrderDetails: (orderId: string) => Purchase | undefined;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (courseId: string) => void;
  getWishlist: () => WishlistItem[];
  isInWishlist: (courseId: string) => boolean;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Sample dummy purchase data for demonstration
const dummyPurchases: Purchase[] = [
  {
    courseId: 'zhiroszhiganie1',
    orderId: 'ord_123456',
    purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    price: 3000,
    title: 'Жиросжигание I',
    status: 'completed',
    paymentMethod: 'card',
  },
  {
    courseId: 'dlya-zala1',
    orderId: 'ord_789012',
    purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    price: 3000,
    title: 'Для зала I',
    status: 'completed',
    paymentMethod: 'card',
  },
];

// Sample dummy wishlist items for demonstration
const dummyWishlist: WishlistItem[] = [
  {
    courseId: 'funkcionalnyj-trening',
    dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    title: 'Функциональный 3D II',
    price: 4500,
    image: '/course3.png',
  },
];

// Cookie name for user session
const USER_COOKIE_NAME = 'irnby_user_session';

// UserProvider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from cookie on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userCookie = Cookies.get(USER_COOKIE_NAME);
        if (userCookie) {
          const userData = JSON.parse(userCookie);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // This is a mock login - in a real app, you'd validate with a server
      // Always succeeds in this demo if email is provided
      if (email) {
        const newUser: User = {
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
          email,
          purchases: [...dummyPurchases],
          wishlist: [...dummyWishlist],
          isAuthenticated: true,
        };

        setUser(newUser);
        // Save to cookie
        Cookies.set(USER_COOKIE_NAME, JSON.stringify(newUser), { expires: 7 });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // This is a mock registration - in a real app, you'd validate and create a user on the server
      if (email && password) {
        const newUser: User = {
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
          email,
          name,
          purchases: [],
          wishlist: [],
          isAuthenticated: true,
        };

        setUser(newUser);
        // Save to cookie
        Cookies.set(USER_COOKIE_NAME, JSON.stringify(newUser), { expires: 7 });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    Cookies.remove(USER_COOKIE_NAME);
    setUser(null);
  };

  // Add a purchase to the user
  const addPurchase = (purchase: Purchase) => {
    if (!user) return;

    // Check if purchase already exists
    if (user.purchases.some(p => p.orderId === purchase.orderId)) {
      return;
    }

    const updatedUser = {
      ...user,
      purchases: [...user.purchases, purchase],
    };

    setUser(updatedUser);
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(updatedUser), { expires: 7 });
  };

  // Get all purchases
  const getPurchases = (): Purchase[] => {
    return user?.purchases || [];
  };

  // Check if user has purchased a specific course
  const hasPurchased = (courseId: string): boolean => {
    if (!user) return false;
    return user.purchases.some(purchase => purchase.courseId === courseId);
  };

  // Get order history
  const getOrderHistory = (): Purchase[] => {
    if (!user) return [];

    // Sort by purchase date, newest first
    return [...user.purchases].sort((a, b) => {
      return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
    });
  };

  // Get order details
  const getOrderDetails = (orderId: string): Purchase | undefined => {
    if (!user) return undefined;
    return user.purchases.find(purchase => purchase.orderId === orderId);
  };

  // Add to wishlist
  const addToWishlist = (item: WishlistItem) => {
    if (!user) return;

    // Check if item is already in wishlist
    if (user.wishlist.some(wishItem => wishItem.courseId === item.courseId)) {
      return;
    }

    const updatedUser = {
      ...user,
      wishlist: [...user.wishlist, item],
    };

    setUser(updatedUser);
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(updatedUser), { expires: 7 });
  };

  // Remove from wishlist
  const removeFromWishlist = (courseId: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      wishlist: user.wishlist.filter(item => item.courseId !== courseId),
    };

    setUser(updatedUser);
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(updatedUser), { expires: 7 });
  };

  // Get the wishlist
  const getWishlist = (): WishlistItem[] => {
    return user?.wishlist || [];
  };

  // Check if a course is in the wishlist
  const isInWishlist = (courseId: string): boolean => {
    if (!user) return false;
    return user.wishlist.some(item => item.courseId === courseId);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
        addPurchase,
        getPurchases,
        hasPurchased,
        getOrderHistory,
        getOrderDetails,
        addToWishlist,
        removeFromWishlist,
        getWishlist,
        isInWishlist,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
}
