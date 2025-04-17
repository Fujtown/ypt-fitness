'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register, isLoading } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password || !name) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    const success = await register(email, password, name);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Ошибка при регистрации. Пожалуйста, попробуйте снова');
    }
  };

  return (
    <div className="container-custom py-16 min-h-[60vh]">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-light mb-6">Регистрация</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium">
              Имя
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              required
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
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
              Подтверждение пароля
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 rounded-md"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Для демо-версии пароль не сохраняется
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-black dark:text-white py-3 px-6 hover:bg-primary/90 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Уже есть аккаунт? <Link href="/dashboard" className="text-primary hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
