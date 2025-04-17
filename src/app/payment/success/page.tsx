// app/payment/success/page.tsx
import { Suspense } from 'react';
import PaymentSuccessContent from '@/components/PaymentSuccessContent';

export default function PaymentSuccessPage() {
  return (
    <div className="container-custom py-16 min-h-[60vh]">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
        <Suspense fallback={<div>Загрузка...</div>}>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
