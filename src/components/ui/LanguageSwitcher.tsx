'use client';

import { useState } from 'react';
import { useLanguage, type Language } from '@/context/LanguageContext';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const languageOptions: { code: Language; label: string; icon: string }[] = [
  { code: 'en', label: 'English', icon: '/flags/en.png' },
  { code: 'ru', label: 'Русский', icon: '/flags/ru.png' },
  { code: 'ar', label: 'العربية', icon: '/flags/ar.png' },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, isChangingLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const current = languageOptions.find(l => l.code === language);

  const handleChange = (code: Language) => {
    if (code !== language && !isChangingLanguage) {
      setLanguage(code);
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-10 h-10 rounded-full flex items-center justify-center ring-1 ring-gray-300 dark:ring-gray-600 hover:ring-primary transition"
        aria-label="Change language"
      >
        <Image
          src={current?.icon || '/flags/en.png'}
          alt={current?.label || 'EN'}
          width={24}
          height={24}
          className="rounded-full object-cover"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 mt-10 left-0 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {languageOptions.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => handleChange(lang.code)}
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                    language === lang.code && "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  <Image
                    src={lang.icon}
                    alt={lang.label}
                    width={20}
                    height={20}
                    className="mr-2 rounded-full object-cover"
                  />
                  {lang.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
