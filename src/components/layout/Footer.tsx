'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';


export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-black text-white dark:bg-gray-900 py-16"  dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/courses" className="text-white hover:text-primary text-sm">
                {t('nav.courses')}
              </Link>
              <Link href="#marathon" className="text-white hover:text-primary text-sm">
                {t('nav.marathon')}
              </Link>
              <Link href="https://t.me/+DgOJw_t-KIFkNDI6" className="text-white hover:text-primary text-sm md:hidden">
                Telegram
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-white hover:text-primary text-sm">
                {t('nav.about')}
              </Link>
              <Link href="/faq" className="text-white hover:text-primary text-sm">
                {t('nav.faq')}
              </Link>
              <Link href="mailto:support@irnbyclub.com" className="text-white hover:text-primary text-sm">
                support@irnbyclub.com
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/assets/documents/irnby_offer.pdf" className="text-white hover:text-primary text-sm">
                {t('footer.offer')}
              </Link>
              <Link href="/assets/documents/irnby_policy.pdf" className="text-white hover:text-primary text-sm">
                {t('footer.policy')}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-col space-y-6">
            <Link href="/" className="block w-fit">
              <Image
                src="/logo.svg"
                alt="IRNBY TRAINING CLUB"
                width={240}
                height={60}
                className="h-auto invert"
              />
            </Link>

            <div className="text-sm text-gray-400 space-y-1">
              <p>ИП МИРОНОВА АНАСТАСИЯ АЛЕКСАНДРОВНА</p>
              <p>ИНН 471612051418 ОГРНИП 316470400070685</p>
              <p>190068, Город Санкт-Петербург, наб Крюкова канала, д. 14, литера А</p>
            </div>

            <div className="text-xs text-gray-500">
              {t('footer.copyright')}
            </div>
          </div>
        </div>

        <div className="mt-8 md:hidden">
          <Link href="https://t.me/+DgOJw_t-KIFkNDI6" className="block w-8 h-8 bg-primary rounded-full" />

          <div className="mt-6">
            <Link href="/" className="block w-fit">
              <Image
                src="/logo.svg"
                alt="IRNBY TRAINING CLUB"
                width={180}
                height={45}
                className="h-auto invert"
              />
            </Link>

            <div className="text-sm text-gray-400 mt-4 space-y-1">
              <p>ИП МИРОНОВА АНАСТАСИЯ АЛЕКСАНДРОВНА</p>
              <p>ИНН 471612051418 ОГРНИП 316470400070685</p>
              <p>190068, Город Санкт-Петербург, наб Крюкова канала, д. 14, литера А</p>
            </div>

            <div className="text-xs text-gray-500 mt-4">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
