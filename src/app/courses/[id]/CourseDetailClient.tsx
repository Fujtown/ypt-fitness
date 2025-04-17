'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { Heart } from "lucide-react";

// Define the Course interface
interface Course {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  description: string;
  details: string[];
  benefits: string[];
  forWhom: string;
  includes: string[];
  trainerInfo: {
    name: string;
    credential: string;
    image: string;
  };
  reviews: {
    name: string;
    text: string;
    rating: number;
  }[];
}

// Define the props for this component
interface CourseDetailClientProps {
  course: Course;
}

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, hasPurchased, isInWishlist, addToWishlist, removeFromWishlist } = useUser();
  const { addItem, isInCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistUpdating, setWishlistUpdating] = useState(false);

  // Check if course is in wishlist
  const inWishlist = isInWishlist(course.id);

  // Helper function to render star ratings
  const renderStars = (rating: number, prefix: string) => {
    return [1, 2, 3, 4, 5].map((position) => (
      <span
        key={`${prefix}-star-${position}`}
        className={`text-lg ${position <= rating ? 'text-primary' : 'text-gray-300 dark:text-gray-600'}`}
      >
        ★
      </span>
    ));
  };

  // Function to handle checkout with Stripe
  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // Create a checkout session via the API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          courseName: course.title,
          price: course.price,
          quantity: 1,
          userId: user?.id || 'guest',
          userEmail: user?.email,
        }),
      });

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('Failed to get checkout URL');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Something went wrong during checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle adding the course to the cart
  const handleAddToCart = () => {
    addItem({
      courseId: course.id,
      title: course.title,
      price: course.price,
      image: course.image,
    });

    setAddedToCart(true);

    // Reset the added to cart state after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  // Function to handle the wishlist toggle
  const handleWishlistToggle = () => {
    if (!user?.isAuthenticated) {
      router.push('/dashboard');
      return;
    }

    setWishlistUpdating(true);

    if (inWishlist) {
      removeFromWishlist(course.id);
    } else {
      addToWishlist({
        courseId: course.id,
        title: course.title,
        price: course.price,
        image: course.image,
        dateAdded: new Date().toISOString(),
      });
    }

    // Reset updating state after a short delay for UI feedback
    setTimeout(() => {
      setWishlistUpdating(false);
    }, 300);
  };

  const isItemInCart = isInCart(course.id);

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="mb-8">
          <Link href="/courses" className="text-gray-600 hover:text-primary">
            {t('course.back')}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Course Image */}
          <div>
            <div className="relative aspect-square overflow-hidden mb-4">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 bg-neon-green px-2 py-1 text-xs">
                {t('courses.forhome')}
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex mr-4">
                {renderStars(course.rating, 'course')}
              </div>
              <span className="text-sm text-gray-500">
                {course.reviews.length} отзыва
              </span>
            </div>
          </div>

          {/* Course Details */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-light">{course.title}</h1>

              {/* Wishlist button */}
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistUpdating || hasPurchased(course.id)}
                className={`p-2 rounded-full transition-colors duration-300 ${
                  inWishlist
                    ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${hasPurchased(course.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart
                  size={24}
                  className={`transition-transform duration-300 ${
                    wishlistUpdating ? 'scale-110' : ''
                  }`}
                  fill={inWishlist ? "currentColor" : "none"}
                />
              </button>
            </div>

            <p className="text-xl font-light mb-6">{course.price.toLocaleString()} ₽</p>

            <div className="mb-8">
              <p className="text-gray-800 dark:text-gray-200 mb-6">{course.description}</p>

              {hasPurchased(course.id) ? (
                <Link
                  href="/dashboard"
                  className="w-full bg-green-600 text-white py-3 px-6 hover:bg-green-700 transition duration-200 mb-4 flex items-center justify-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Уже куплено
                </Link>
              ) : (
                <button
                  className={`w-full bg-primary text-black dark:text-white py-3 px-6 hover:bg-primary/90 transition duration-200 mb-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? t('course.processing') : t('course.buy')}
                </button>
              )}

              <button
                className={`w-full border ${isItemInCart ? 'border-primary text-primary' : 'border-gray-300 dark:border-gray-700'} py-3 px-6 hover:border-primary transition duration-200`}
                onClick={handleAddToCart}
                disabled={isLoading || addedToCart || hasPurchased(course.id)}
              >
                {isItemInCart
                  ? addedToCart
                    ? 'Добавлено в корзину ✓'
                    : 'В корзине'
                  : addedToCart
                    ? 'Добавлено в корзину ✓'
                    : t('course.cart')}
              </button>

              {isItemInCart && !addedToCart && (
                <div className="mt-2 text-center">
                  <Link href="/cart" className="text-primary hover:underline text-sm">
                    Перейти в корзину
                  </Link>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-light mb-4">{t('course.details')}</h2>
              <ul className="space-y-2 list-disc pl-5">
                {course.details.map((detail) => (
                  <li key={`detail-${detail.split(' ').slice(0, 2).join('-')}`} className="text-gray-700 dark:text-gray-300">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-light mb-4">{t('course.included')}</h2>
              <ul className="space-y-2 list-disc pl-5">
                {course.includes.map((item) => (
                  <li key={`includes-${item.split(' ').slice(0, 2).join('-')}`} className="text-gray-700 dark:text-gray-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="my-16">
          <h2 className="section-heading">{t('course.benefits')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {course.benefits.map((benefit) => (
              <div key={`benefit-${benefit.split(' ').slice(0, 2).join('-')}`} className="p-6 border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors duration-200">
                <h3 className="text-lg font-light mb-2">{benefit}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* For Whom Section */}
        <div className="my-16">
          <h2 className="section-heading">{t('course.forwhom')}</h2>
          <div className="max-w-3xl">
            <p className="text-lg text-gray-700 dark:text-gray-300">{course.forWhom}</p>
          </div>
        </div>

        {/* Trainer Info Section */}
        <div className="my-16">
          <h2 className="section-heading">{t('course.trainer')}</h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 relative overflow-hidden rounded-full">
              <Image
                src={course.trainerInfo.image}
                alt={course.trainerInfo.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-medium">{course.trainerInfo.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{course.trainerInfo.credential}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="my-16">
          <h2 className="section-heading">{t('course.reviews')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {course.reviews.map((review) => (
              <div key={`review-${review.name}`} className="border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex mb-3">
                  {renderStars(review.rating, `review-${review.name}`)}
                </div>
                <p className="mb-4 italic text-gray-700 dark:text-gray-300">"{review.text}"</p>
                <p className="font-medium">{review.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Courses Section */}
        <div className="my-16">
          <h2 className="section-heading">{t('course.related')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* This would typically fetch related courses from a context or API */}
            {/* For this example, we're not implementing this section in full */}
            <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
              {t('courses.title')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
