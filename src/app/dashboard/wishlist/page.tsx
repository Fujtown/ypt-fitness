'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, type WishlistItem } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Sidebar from '@/components/dashboard/Sidebar';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, isLoading, getWishlist, removeFromWishlist } = useUser();
  const { addItem, isInCart } = useCart();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (user) {
      setWishlist(getWishlist());
    }
  }, [user, getWishlist]);

  // Handle going to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/dashboard');
    }
  }, [isLoading, user, router]);

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // Add to cart
  const handleAddToCart = (item: WishlistItem) => {
    if (!item.title || !item.price || !item.image) {
      console.error('Missing required item details');
      return;
    }

    addItem({
      courseId: item.courseId,
      title: item.title,
      price: item.price,
      image: item.image,
    });
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = (courseId: string) => {
    removeFromWishlist(courseId);
    setWishlist(prev => prev.filter(item => item.courseId !== courseId));
  };

  if (isLoading) {
    return (
      <div className="container-custom py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container-custom py-16 min-h-[60vh]">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-light">Список желаний</h1>

            <Link
              href="/courses"
              className="border border-gray-300 dark:border-gray-700 py-2 px-4 hover:border-primary transition duration-200"
            >
              Посмотреть все курсы
            </Link>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="flex justify-center mb-4">
                <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">У вас нет сохраненных курсов</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Добавьте интересующие вас курсы в список желаний, чтобы вернуться к ним позже</p>
              <Link
                href="/courses"
                className="bg-primary text-black dark:text-white py-3 px-6 hover:bg-primary/90 transition duration-200"
              >
                Найти курсы
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {wishlist.length} {wishlist.length === 1 ? 'курс' : wishlist.length < 5 ? 'курса' : 'курсов'} в вашем списке желаний
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => {
                  const inCart = isInCart(item.courseId);

                  return (
                    <div
                      key={item.courseId}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group overflow-hidden"
                    >
                      <div className="relative">
                        <Link href={`/courses/${item.courseId}`}>
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={item.image || '/course1.png'}
                              alt={item.title || item.courseId}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        </Link>

                        <button
                          onClick={() => handleRemoveFromWishlist(item.courseId)}
                          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>

                      <div className="p-4">
                        <Link href={`/courses/${item.courseId}`} className="block">
                          <h3 className="text-lg font-medium mb-2 hover:text-primary transition-colors">
                            {item.title || `Курс #${item.courseId}`}
                          </h3>
                        </Link>

                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">
                            {item.price ? `${item.price.toLocaleString()} ₽` : ''}
                          </span>
                          <span className="text-xs text-gray-500">
                            Добавлено {formatDate(item.dateAdded)}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <Link
                            href={`/courses/${item.courseId}`}
                            className="flex-1 bg-primary text-black dark:text-white py-2 px-4 text-center hover:bg-primary/90 transition duration-200"
                          >
                            Подробнее
                          </Link>

                          {inCart ? (
                            <Link
                              href="/cart"
                              className="flex items-center justify-center w-10 bg-primary/10 text-primary border border-primary hover:bg-primary/20 transition duration-200"
                              aria-label="Go to cart"
                            >
                              <ShoppingCart size={18} />
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="flex items-center justify-center w-10 border border-gray-300 dark:border-gray-700 hover:border-primary transition duration-200"
                              aria-label="Add to cart"
                              disabled={!item.title || !item.price || !item.image}
                            >
                              <ShoppingCart size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
