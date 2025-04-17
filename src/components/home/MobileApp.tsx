'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { AnimatedSection, AnimatedItem } from '@/components/ui/AnimatedSection';
import { AnimatedImage } from '@/components/ui/AnimatedImage';

export function MobileApp() {
  const { t } = useLanguage();

  return (
    <section id="mobileApp" className="py-20 bg-black text-white dark:bg-gray-900">
      <div className="container-custom">
        <AnimatedSection variant="fadeIn">
          <h2 className="section-heading mb-4">{t('app.title')}</h2>
          <p className="text-lg mb-12 max-w-2xl">{t('app.subtitle')}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection variant="fadeInLeft" className="relative">
            <div className="relative h-[500px] lg:h-[600px] w-full">
              <AnimatedImage
                src="/images/app-mockup.png"
                alt="IRNBY CLUB Mobile App"
                fill
                className="object-contain object-center"
                imageEffect="zoomIn"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection variant="fadeInRight" className="space-y-10">
            <div>
              <h3 className="text-xl font-medium mb-6 text-primary">{t('app.features.title')}</h3>
              <ul className="space-y-4">
                <AnimatedItem>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 text-lg">→</span>
                    <span>{t('app.features.workout')}</span>
                  </li>
                </AnimatedItem>
                <AnimatedItem>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 text-lg">→</span>
                    <span>{t('app.features.progress')}</span>
                  </li>
                </AnimatedItem>
                <AnimatedItem>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 text-lg">→</span>
                    <span>{t('app.features.nutrition')}</span>
                  </li>
                </AnimatedItem>
              </ul>
            </div>

            <div className="pt-8">
              <h3 className="text-xl font-medium mb-3">{t('app.download.title')}</h3>
              <p className="text-gray-400 mb-6">{t('app.download.subtitle')}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#"
                  className="bg-primary text-black dark:text-white py-3 px-6 flex items-center space-x-2 w-fit"
                >
                  <Image
                    src="/images/app-store.png"
                    alt="App Store"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <span>{t('app.download.ios')}</span>
                </Link>

                <Link
                  href="#"
                  className="bg-primary text-black dark:text-white py-3 px-6 flex items-center space-x-2 w-fit"
                >
                  <Image
                    src="/images/play-store.png"
                    alt="Play Store"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <span>{t('app.download.android')}</span>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
