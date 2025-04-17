'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { ShoppingCart } from 'lucide-react';
import { UserIcon } from '@heroicons/react/24/outline'; // install Heroicons if not already


export function Header() {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { getTotalItems } = useCart();
  const { user } = useUser();
  const { language } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const cartItemCount = getTotalItems();

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 py-4 bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container-custom flex items-center justify-between">
        <div className="logo w-40">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="IRNBY TRAINING CLUB"
              width={160}
              height={40}
              className="h-auto dark:invert"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center">
        <nav
  className={cn(
    "fixed md:relative top-16 md:top-0 w-full  bg-white dark:bg-gray-950 md:bg-transparent z-50 md:flex transition-all duration-300 ease-in-out",
    isMenuOpen ? "block" : "hidden md:block",
    isHydrated && (language === 'ar' ? 'left-0' : 'right-0') // Aligning nav from the correct side
  )}
>
  <ul
    className={cn(
      "flex flex-col md:flex-row p-6 md:p-0",
      language === 'ar' ? "md:space-x-reverse md:space-x-8 space-y-4 md:space-y-0" : "md:space-x-8 space-y-4 md:space-y-0"
    )}
  >
    <li>
      <Link
        href="/"
        className="text-foreground hover:text-primary uppercase text-sm font-light tracking-wide"
      >
        {t('nav.home')}
      </Link>
    </li>
    <li>
      <Link
        href="/courses"
        className="text-foreground hover:text-primary uppercase text-sm font-light tracking-wide"
      >
        {t('nav.courses')}
      </Link>
    </li>
    <li>
      <Link
        href="/challenge"
        className="text-foreground hover:text-primary uppercase text-sm font-light tracking-wide"
      >
        {t('nav.challenge')}
      </Link>
    </li>
    <li>
      <Link
        href="/about"
        className="text-foreground hover:text-primary uppercase text-sm font-light tracking-wide"
      >
        {t('nav.about')}
      </Link>
    </li>
    <li>
      <Link
        href="/faq"
        className="text-foreground hover:text-primary uppercase text-sm font-light tracking-wide"
      >
        {t('nav.faq')}
      </Link>
    </li>
  </ul>
</nav>


          <LanguageSwitcher className="hidden md:flex mr-4" />

          <ThemeToggle />

          {/* Cart Icon */}
          <div className="ml-4 relative">
            <Link
              href="/cart"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-primary text-black text-xs rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

        {/* User Icon */}
        <div className="user-icon ml-4">
  <Link
    href={user?.isAuthenticated ? "/dashboard" : "/dashboard"}
    className="block w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center"
    aria-label="User account"
  >
    {user?.isAuthenticated ? (
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {user.name
          ? user.name.charAt(0).toUpperCase()
          : user.email.charAt(0).toUpperCase()}
      </span>
    ) : (
      <UserIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
    )}
  </Link>
</div>
          <button
            className="md:hidden ml-4 relative z-50 w-8 h-8 flex flex-col justify-center items-center"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={cn(
                "block w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ease-in-out",
                isMenuOpen ? "rotate-45 translate-y-1" : ""
              )}
            />
            <span
              className={cn(
                "block w-6 h-0.5 bg-black dark:bg-white mt-1.5 transition-all duration-300 ease-in-out",
                isMenuOpen ? "-rotate-45 -translate-y-1" : ""
              )}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
