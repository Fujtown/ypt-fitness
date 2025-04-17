'use client';

import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AnimatedImage } from "@/components/ui/AnimatedImage";
import { ScrollingText, SimpleMarquee } from "@/components/ui/ScrollingText";
import { useLanguage } from "@/context/LanguageContext";
import { MobileApp } from "@/components/home/MobileApp";
import '@/styles/globals.css';

// Multilingual course data
const bestsellers = {
  ru: [
    {
      id: "zhiroszhiganie1",
      title: "Жиросжигание I",
      image: "/course1.png",
      price: 3000,
      rating: 5,
    },
    {
      id: "dlya-zala1",
      title: "Для зала I",
      image: "/course2.png",
      price: 3000,
      rating: 5,
    },
    {
      id: "funkcionalnyj-trening",
      title: "Функциональный 3D II",
      image: "/course3.png",
      price: 4500,
      rating: 5,
    },
  ],
  en: [
    {
      id: "zhiroszhiganie1",
      title: "Fat Burning I",
      image: "/course1.png",
      price: 3000,
      rating: 5,
    },
    {
      id: "dlya-zala1",
      title: "Gym Workout I",
      image: "/course2.png",
      price: 3000,
      rating: 5,
    },
    {
      id: "funkcionalnyj-trening",
      title: "Functional 3D II",
      image: "/course3.png",
      price: 4500,
      rating: 5,
    },
  ],
  ar: [
    {
      id: "zhiroszhiganie1",
      title: "حرق الدهون I",
      image: "/course1.png",
      price: 3000,
      rating: 5,
    },
    {
      id: "dlya-zala1",
      title: "تمارين الصالة الرياضية I",
      image: "/course2.png",
      price: 3000,
      rating: 5,
    },
    {
      id: "funkcionalnyj-trening",
      title: "تدريب ثلاثي الأبعاد II",
      image: "/course3.png",
      price: 4500,
      rating: 5,
    },
  ],
  
};

export default function Home() {
  const { t, language } = useLanguage();

  // Select the courses based on the current language
  const currentBestsellers = bestsellers[language];

  return (
    <div className="flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
     <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src="/main.png"
      alt="IRNBY CLUB Hero"
      fill
      quality={100}
      priority
      className="object-cover"
    />
    {/* Black overlay always visible */}
    <div className="absolute inset-0 bg-black opacity-20" />
  </div>

  {/* Foreground Content */}
  <AnimatedSection
  className="absolute top-0 left-0 w-full h-full  z-10 mt-5"
  variant="fadeIn"
  delay={0.2}
>
  <div className="text-white px-4">
    <h3 className="text-lg mb-2">{t('home.hero.subtitle')}</h3>
    <h1 className="text-3xl md:text-4xl font-light mb-6 whitespace-pre-line custom-heading">
      {t('home.hero.title')}
    </h1>
    <AnimatedButton href="/courses" variant="primary">
      {t('home.hero.cta')}
    </AnimatedButton>
  </div>
</AnimatedSection>

</section>

      {/* Scrolling text banner */}
      <SimpleMarquee
        text={t('home.marquee.text')}
        className="bg-primary text-black dark:text-white py-2"
      />

      {/* Bestsellers Section */}
      <section className="py-16 bg-white dark:bg-gray-950" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container-custom">
          <AnimatedSection variant="fadeIn">
            <h2 className="section-heading">{t('home.bestsellers.title')}</h2>
          </AnimatedSection>

          <AnimatedSection
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
            variant="stagger"
          >
            {currentBestsellers.map((product) => (
              <AnimatedItem key={product.id}>
                <ProductCard
                  id={product.id}
                  title={product.title}
                  image={product.image}
                  price={product.price}
                  rating={product.rating}
                />
              </AnimatedItem>
            ))}
          </AnimatedSection>
        </div>
      </section>

      <section className="divide-y border-t border-b border-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
  {[
    {
      title: t('home.info.courses.title'),
      description: t('home.info.courses.description'),
      href: '/courses',
    }
   
  ].map((item, index) => (
    <Link
      key={index}
      href={item.href}
      className="flex justify-between items-center py-20 px-6 hover:bg-gray-100 transition-colors group"
    >
      <div className="grid md:grid-cols-[200px_1fr] gap-8 w-full">
        <h3 className="text-xl font-medium">{item.title}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {item.description}
        </p>
      </div>
      <div className="ml-4 text-black group-hover:translate-x-1 transition-transform">
        <span className="text-xl">&rsaquo;</span> {/* Unicode right arrow › */}
      </div>
    </Link>
  ))}
</section>

<section className="w-full">
  <div className="relative w-full h-[100vh]">
    <Image
      src="/mymission.jpeg" // replace with your image path
      alt="Fitness Model"
      fill
      className="object-cover"
      quality={100}
      priority
    />
  </div>
</section>


      {/* Approach Section */}
      <section className="py-16 bg-black text-white dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container-custom">
          <AnimatedSection variant="fadeIn">
            <h2 className="section-heading">{t('home.approach.title')}</h2>
            <p className="text-lg mb-8">
              {t('home.approach.text')}
            </p>
            <AnimatedButton href="#join" variant="primary">
              {t('home.approach.cta')}
            </AnimatedButton>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-950 "  dir={language === 'ar' ? 'rtl' : 'ltr'}>
  <div className="container-custom">
    <AnimatedSection variant="fadeIn">
      <h2 className="text-3xl md:text-5xl font-light mb-16 whitespace-pre-line">
        {t('home.expect.title')}
      </h2>
    </AnimatedSection>

    <AnimatedSection className="grid grid-cols-2 gap-y-16" variant="stagger">
      {[
        {
          number: '01',
          title: t('home.expect.training.title'),
          text: t('home.expect.training.text'),
        },
        {
          number: '02',
          title: t('home.expect.nutrition.title'),
          text: t('home.expect.nutrition.text'),
        },
        {
          number: '03',
          title: t('home.expect.support.title'),
          text: t('home.expect.support.text'),
        },
        {
          number: '04',
          title: t('home.expect.results.title'),
          text: t('home.expect.results.text'),
        },
      ].map((item, index) => (
        <AnimatedItem key={index}>
          <div className="px-4 md:px-8">
            {/* Number + Line */}
            <div className="flex items-center text-sm text-black mb-3">
              <span className="mr-2">({item.number})</span>
              <div className="flex-1 border-t border-black" />
            </div>

            {/* Green Label */}
            <h3 className="text-md font-medium inline-block bg-neon-green text-black px-2 py-1 mb-2 uppercase tracking-wide">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed max-w-md">
              {item.text}
            </p>
          </div>
        </AnimatedItem>
      ))}
    </AnimatedSection>
  </div>
</section>

    </div>
  );
}
