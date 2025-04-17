// components/PaymentSuccessContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface OrderDetails {
  id: string;
  status: string;
  date: string;
}

export default function PaymentSuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const simulateVerification = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrderDetails({
          id: sessionId || 'DEMO-ORDER-123',
          status: 'paid',
          date: new Date().toLocaleString(),
        });
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      simulateVerification();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-light mb-4">Проверка оплаты...</h1>
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-light mb-2">Оплата успешна!</h1>
      <p className="text-gray-600 dark:text-gray-300">Спасибо за покупку! Ваш заказ был успешно оплачен.</p>
      {orderDetails && (
        <div className="mt-4">
          <p>Номер заказа: {orderDetails.id}</p>
          <p>Статус: {orderDetails.status}</p>
          <p>Дата: {orderDetails.date}</p>
        </div>
      )}
    </div>
  );
}
