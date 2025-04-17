'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

// Dummy course content
const coursesData = {
  "zhiroszhiganie1": {
    id: "zhiroszhiganie1",
    title: "Жиросжигание I",
    image: "/course1.png",
    price: 3000,
    description: "Специальная жиросжигающая программа тренировок для запуска процесса похудения и формирования подтянутой фигуры.",
  },
  "dlya-zala1": {
    id: "dlya-zala1",
    title: "Для зала I",
    image: "/course2.png",
    price: 3000,
    description: "Комплексная программа тренировок для занятий в тренажерном зале, направленная на гармоничное развитие мышц всего тела.",
  },
  "funkcionalnyj-trening": {
    id: "funkcionalnyj-trening",
    title: "Функциональный 3D II",
    image: "/course3.png",
    price: 4500,
    description: "Продвинутая программа функциональных тренировок, направленная на всестороннее развитие физических качеств и проработку мышц во всех плоскостях движения.",
  }
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, login, isLoading, getPurchases } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (user) {
      setPurchases(getPurchases());
    }
  }, [user, getPurchases]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email) {
      setLoginError('Пожалуйста, введите email');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setLoginError('Ошибка входа. Пожалуйста, проверьте ваши данные');
    }
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
    return (
      <div className="container-custom py-16 min-h-[60vh]">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-light mb-6">Вход в аккаунт</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
                {loginError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Для демо-версии пароль не проверяется, просто введите email
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-black dark:text-white py-3 px-6 hover:bg-primary/90 transition duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              У вас нет аккаунта? <Link href="/register" className="text-primary hover:underline">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-16 min-h-[60vh]">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-light mb-2">Личный кабинет</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Добро пожаловать, {user.name || user.email}!
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/courses"
                className="border border-gray-300 dark:border-gray-700 py-2 px-4 hover:border-primary transition duration-200"
              >
                Все курсы
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 mb-10">
            <h2 className="text-xl font-light mb-4">Мои курсы</h2>

            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 mb-6">У вас еще нет купленных курсов</p>
                <Link
                  href="/courses"
                  className="bg-primary text-black dark:text-white py-3 px-6 hover:bg-primary/90 transition duration-200"
                >
                  Выбрать курс
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map((purchase) => {
                  const courseId = purchase.courseId;
                  const course = coursesData[courseId as keyof typeof coursesData];
                  if (!course) return null;

                  return (
                    <div
                      key={purchase.orderId}
                      className="border border-gray-200 dark:border-gray-700 overflow-hidden group"
                    >
                      <Link href={`/courses/${course.id}`}>
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-medium mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                              Куплено: {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </span>
                            <span className="text-primary">Открыть →</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-light">Последние заказы</h2>
            <Link href="/dashboard/orders" className="text-primary hover:underline text-sm">Показать все →</Link>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
            {purchases.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">У вас еще нет заказов</p>
              </div>
            ) : (
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
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {purchases.slice(0, 3).map((purchase) => {
                    const courseId = purchase.courseId;
                    const course = coursesData[courseId as keyof typeof coursesData];

                    return (
                      <tr key={purchase.orderId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative overflow-hidden">
                              <Image
                                src={course?.image || '/course1.png'}
                                alt={course?.title || 'Course'}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {course?.title || `Курс #${courseId}`}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                #{purchase.orderId.substring(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            {purchase.status || 'Completed'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
