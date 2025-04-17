// components/PaymentErrorContent.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function PaymentErrorContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'Произошла ошибка при обработке платежа';

  return (
    <div className="text-center mb-8">
      <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <h1 className="text-3xl font-light mb-2">Ошибка оплаты</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{errorMessage}</p>
    </div>
  );
}
