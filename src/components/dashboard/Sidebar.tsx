'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useUser();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    {
      label: 'Мои курсы',
      href: '/dashboard',
      exact: true,
    },
    {
      label: 'История заказов',
      href: '/dashboard/orders',
    },
    {
      label: 'Список желаний',
      href: '/dashboard/wishlist',
    },
    {
      label: 'Настройки',
      href: '/dashboard/settings',
    },
  ];

  return (
    <div className={`w-full md:w-64 mb-8 md:mb-0 ${className}`}>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-medium mb-4">Мой аккаунт</h2>
        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded ${
                    (item.exact ? isActive(item.href) : pathname.startsWith(item.href))
                      ? 'bg-gray-100 dark:bg-gray-700 text-primary font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}
