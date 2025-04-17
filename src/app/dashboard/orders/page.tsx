'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser, type Purchase } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import Sidebar from '@/components/dashboard/Sidebar';

// Mock course data for image lookup
const courseImages: Record<string, string> = {
  'zhiroszhiganie1': '/course1.png',
  'dlya-zala1': '/course2.png',
  'funkcionalnyj-trening': '/course3.png',
};

export default function OrderHistoryPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, isLoading, getOrderHistory } = useUser();
  const [orders, setOrders] = useState<Purchase[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Purchase | null>(null);

  useEffect(() => {
    if (user) {
      setOrders(getOrderHistory());
    }
  }, [user, getOrderHistory]);

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

  // Render status badge with appropriate color
  const renderStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusMap: Record<string, { bg: string; text: string }> = {
      'completed': { bg: 'bg-green-100 text-green-800', text: 'Оплачен' },
      'pending': { bg: 'bg-yellow-100 text-yellow-800', text: 'В обработке' },
      'failed': { bg: 'bg-red-100 text-red-800', text: 'Ошибка' },
    };

    const { bg, text } = statusMap[status] || { bg: 'bg-gray-100 text-gray-800', text: status };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg}`}>
        {text}
      </span>
    );
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
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl font-light mb-6">История заказов</h1>

          {orders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">У вас еще нет заказов</p>
              <Link
                href="/courses"
                className="bg-primary text-black dark:text-white py-2 px-4 hover:bg-primary/90 transition duration-200"
              >
                Посмотреть курсы
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Order List */}
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Заказ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Дата
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Стоимость
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${selectedOrder?.orderId === order.orderId ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                      onClick={() => setSelectedOrder(selectedOrder?.orderId === order.orderId ? null : order)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden">
                            <Image
                              src={courseImages[order.courseId] || '/course1.png'}
                              alt={order.title || ''}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {order.title || `Курс #${order.courseId}`}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              #{order.orderId.substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(order.purchaseDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {order.price ? `${order.price.toLocaleString()} ₽` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Order Details */}
              {selectedOrder && (
                <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-4">Детали заказа #{selectedOrder.orderId.substring(0, 8)}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Информация о заказе</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Номер заказа:</span>
                          <span>{selectedOrder.orderId}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Дата:</span>
                          <span>{formatDate(selectedOrder.purchaseDate)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Статус:</span>
                          <span>{renderStatusBadge(selectedOrder.status)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Метод оплаты:</span>
                          <span>{selectedOrder.paymentMethod || 'Банковская карта'}</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Содержимое заказа</h4>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 relative overflow-hidden">
                          <Image
                            src={courseImages[selectedOrder.courseId] || '/course1.png'}
                            alt={selectedOrder.title || ''}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">
                            {selectedOrder.title || `Курс #${selectedOrder.courseId}`}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ID курса: {selectedOrder.courseId}
                          </div>
                          <div className="text-sm font-medium">
                            {selectedOrder.price ? `${selectedOrder.price.toLocaleString()} ₽` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link
                          href={`/courses/${selectedOrder.courseId}`}
                          className="text-primary hover:underline text-sm"
                        >
                          Перейти к курсу →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
