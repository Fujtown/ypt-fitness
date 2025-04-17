'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  isForHome?: boolean;
  rating?: number;
  href?: string;
}

export function ProductCard({
  id,
  title,
  image,
  price,
  isForHome = true,
  rating = 0,
  href = '/courses'
}: ProductCardProps) {
  const { t } = useLanguage();

  // Pre-define the stars array with fixed positions
  const stars = [1, 2, 3, 4, 5].map(position => (
    <span
      key={`star-${id}-${position}`}
      className={`w-5 h-5 text-xs flex items-center justify-center ${position <= rating ? 'text-primary' : 'text-gray-300 dark:text-gray-600'}`}
    >
      ★
    </span>
  ));

  return (
<div className="flex flex-col md:flex-row border border-gray-300 dark:border-gray-700 p-4">
  <Link href={`${href}/${id}`} className="md:w-1/2 w-full group relative overflow-hidden mb-4 md:mb-0 md:mr-4">
    <Image
      src={image}
      alt={title}
      width={400}
      height={200}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    {isForHome && (
      <div className="absolute top-3 left-3 bg-neon-green px-2 py-1 text-xs text-black">
        {t('courses.forhome')}
      </div>
    )}
  </Link>

  <div className="flex flex-col justify-between w-full">
    <div>
      <Link href={`${href}/${id}`} className="group">
        <h3 className="text-lg font-light mb-2 group-hover:text-primary transition-colors">{title}</h3>
      </Link>

      {rating > 0 && (
        <div className="flex space-x-1 mb-2">
          {stars}
        </div>
      )}

      <div className="text-lg font-light mb-4">{price.toLocaleString()} ₽</div>
    </div>

    <Link
      href={`${href}/${id}`}
      className="border border-gray-300 dark:border-gray-700 hover:border-primary text-center py-2 px-4 transition duration-200 ease-in-out"
    >
      {t('courses.buy')}
    </Link>
  </div>
</div>

  );
}
