// app/payment/error/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import PaymentErrorContent from '@/components/PaymentErrorContent';

export default function PaymentErrorPage() {
  return (
    <div className="container-custom py-16 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
        <Suspense fallback={<div>Загрузка...</div>}>
          <PaymentErrorContent />
        </Suspense>

        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded mb-8">
          <h2 className="font-medium mb-2">Что делать дальше:</h2>
          <ul className="space-y-1 text-sm list-disc pl-5">
            <li>Проверьте, что на вашей карте достаточно средств</li>
            <li>Убедитесь, что ваша карта принимает онлайн-платежи</li>
            <li>Попробуйте использовать другую карту или способ оплаты</li>
            <li>Если проблема сохраняется, свяжитесь с нашей службой поддержки</li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4">
          <Link href="/courses" className="bg-primary text-black dark:text-white py-3 px-6 hover:bg-primary/90 transition duration-200 text-center">
            Вернуться к курсам
          </Link>
          <Link href="/" className="border border-gray-300 dark:border-gray-700 py-3 px-6 hover:border-primary transition duration-200 text-center">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
