'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, type CartItem, DISCOUNT_TIERS } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CartPage() {
  const { t } = useLanguage();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalItems, getApplicableDiscount, getDiscountAmount, getFinalPrice } = useCart();
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle checkout for cart items
  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (items.length === 0) {
        setError('Ваша корзина пуста');
        setIsLoading(false);
        return;
      }

      // Send entire cart to checkout session API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          totalQuantity: getTotalItems(),
          userId: user?.id || 'guest',
          userEmail: user?.email,
        }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to get checkout URL');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.courseId, newQuantity);
    }
  };

  return (
    <div className="container-custom py-16 min-h-[60vh]">
    <h1 className="text-3xl font-light mb-8">Cart</h1>

    {error && (
      <div className="bg-red-100 text-red-700 p-4 mb-6 rounded">
        {error}
      </div>
    )}

    {items.length === 0 ? (
      <div className="text-center py-16 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Your cart is empty</p>
        <Link
          href="/courses"
          className="bg-primary text-black dark:text-white py-3 px-6 hover:bg-primary/90 transition duration-200"
        >
          Browse Courses
        </Link>
      </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
                <div key={item.courseId} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
                  <div className="w-full sm:w-24 h-24 relative flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between mb-2">
                      <Link href={`/courses/${item.courseId}`} className="text-lg font-medium hover:text-primary">
                        {item.title}
                      </Link>
                      <button
                        onClick={() => removeItem(item.courseId)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="mb-2 sm:mb-0">
                        {item.discountedPrice ? (
                          <div>
                            <span className="text-gray-400 line-through me-2">
                              {item.price.toLocaleString()} ₽
                            </span>
                            <span className="text-primary font-medium">
                              {item.discountedPrice.toLocaleString()} ₽
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            {item.price.toLocaleString()} ₽
                          </p>
                        )}
                      </div>

                      <div className="flex items-center border border-gray-300 dark:border-gray-700">
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-10 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end mt-2">
                      <p className="font-medium">
                        {item.discountedPrice
                          ? (item.discountedPrice * item.quantity).toLocaleString()
                          : (item.price * item.quantity).toLocaleString()
                        } ₽
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={clearCart}
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
              >
                Clear Cart
              </button>

              <Link
                href="/courses"
                className="text-gray-600 dark:text-gray-400 hover:text-primary"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h2 className="text-xl font-light mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Items</span>
                  <span>{getTotalItems()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total</span>
                  <span>{getTotalPrice().toLocaleString()} ₽</span>
                </div>

                {/* Display applicable discount */}
                {getApplicableDiscount() && (
                  <div className="flex justify-between text-primary">
                    <span>Discount ({getApplicableDiscount()?.percentage}%)</span>
                    <span>-{getDiscountAmount().toLocaleString()} ₽</span>
                  </div>
                )}

                <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>{getFinalPrice().toLocaleString()} ₽</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading || items.length === 0}
                className="w-full bg-primary text-black dark:text-white py-3 px-6 hover:bg-primary/90 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed mb-4"
              >
                {isLoading ? 'Processing...' : 'Checkout'}
              </button>

              {/* Discount tiers information */}
              {items.length > 0 && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-sm font-medium mb-3">Available discounts:</h3>
                  <ul className="space-y-2 text-sm">
                    {DISCOUNT_TIERS.map((tier) => {
                      const isActive = getTotalItems() >= tier.threshold;
                      return (
                        <li
                          key={tier.threshold}
                          className={`flex items-center ${isActive ? 'text-primary font-medium' : 'text-gray-600 dark:text-gray-400'}`}
                        >
                          {isActive ? (
                            <svg className="w-4 h-4 mr-1.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0 0v-3" />
                            </svg>
                          )}
                          {tier.description}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {!user?.isAuthenticated && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <Link href="/dashboard" className="text-primary hover:underline">
                    Login
                  </Link>{' '}
                  to track your purchases
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
