'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Cookies from 'js-cookie';

// Available languages
export type Language = 'ru' | 'en' | 'ar';

// Translation record type
type TranslationKeys =
  | 'nav.bestsellers' | 'nav.courses' | 'nav.challenge' | 'nav.home' | 'nav.marathon' | 'nav.app' | 'nav.about' | 'nav.faq'
  | 'home.hero.title' | 'home.info.courses.title' | 'home.info.courses.description' | 'home.info.marathon.title' | 
  'home.info.marathon.description' |'home.hero.subtitle' | 'home.hero.cta' | 'home.marquee.text' | 'home.bestsellers.title'
  | 'home.approach.title' | 'home.approach.text' | 'home.approach.cta' | 'home.expect.title'
  | 'home.expect.training.title' | 'home.expect.training.text' | 'home.expect.nutrition.title'
  | 'home.expect.nutrition.text' | 'home.expect.support.title' | 'home.expect.support.text'
  | 'home.expect.results.title' | 'home.expect.results.text' | 'courses.title' | 'courses.filter.price'
  | 'courses.filter.price.asc' | 'courses.filter.price.desc' | 'courses.filter.target'
  | 'courses.filter.target.all' | 'courses.filter.target.legs' | 'courses.filter.target.arms'
  | 'courses.filter.target.glutes' | 'courses.forhome' | 'courses.buy' | 'course.back'
  | 'course.buy' | 'course.cart' | 'course.details' | 'course.included' | 'course.benefits'
  | 'course.forwhom' | 'course.trainer' | 'course.reviews' | 'course.related' | 'about.title'
  | 'course.processing'
  | 'about.intro' | 'about.desc' | 'about.safety.title' | 'about.community.title'
  | 'about.expertise.title' | 'footer.offer' | 'footer.policy' | 'footer.copyright'
  | 'lang.ru' | 'lang.en' | 'lang.loading' | 'app.title' | 'app.subtitle' | 'app.features.title'
  | 'app.features.workout' | 'app.features.progress' | 'app.features.nutrition'
  | 'app.download.ios' | 'app.download.android' | 'app.download.title' | 'app.download.subtitle';

// Define translation record type
type TranslationRecord = Record<TranslationKeys, string>;

// Context type
interface LanguageContextType {
  language: Language;
  isChangingLanguage: boolean;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeys) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cookie name for language preference
const LANGUAGE_COOKIE_NAME = 'irnby_language';
// Cookie expiration in days
const COOKIE_EXPIRATION_DAYS = 30;

// Translations
export const translations: Record<Language, TranslationRecord> = {
  ru: {
    // Navigation
    'nav.home': 'домой',
    'nav.bestsellers': 'бестселлеры 2024',
    'nav.courses': 'курсы',
    'nav.challenge': 'чаллендж',
    'nav.marathon': 'марафон',
    'nav.app': 'приложение',
    'nav.about': 'о нас',
    'nav.faq': 'вопросы',

    // Homepage
    'home.hero.title': 'ФИТНЕС-ПЛАТФОРМА\nДЛЯ ТРЕНИРОВОК ДОМА\nИ В ЗАЛЕ',
    'home.hero.subtitle': 'Тренировки, меню, и отслеживание прогресса—all in one place.', 
    'home.info.courses.title': 'КУРСЫ',
    'home.info.courses.description': 'Поработанные тренировки для любой цели и уровня подготовки, стимулирующие рост и развитие. Можно тренироваться и дома и в зале.',
    'home.info.marathon.title': 'Марафон',
    'home.info.marathon.description': 'Марафон - это 30-дневная программа, которая поможет вам достигнуть ваших целей.',
    'home.hero.cta': 'ПОДРОБНЕЕ',
    'home.marquee.text': 'IRNBY TRAINING CLUB • ФИТНЕС-ПЛАТФОРМА • ТРЕНИРОВКИ ДОМА И В ЗАЛЕ',
    'home.bestsellers.title': 'БЕСТСЕЛЛЕРЫ 2024',
    'home.approach.title': 'УНИКАЛЬНЫЙ ПОДХОД К ТЕБЕ',
    'home.approach.text': 'Новый, свежий формат тренировок. Точно подходит Club тебе подойдет.',
    'home.approach.cta': 'УЗНАТЬ КАК',
    'home.expect.title': 'ЧТО ТЕБЯ ЖДЕТ У НАС?',
    'home.expect.training.title': 'ТРЕНИРОВКИ',
    'home.expect.training.text': 'Проработанные тренировки для любой цели и уровня подготовки, стимулирующие рост и развитие. Можно тренироваться и дома и в зале.',
    'home.expect.nutrition.title': 'ПИТАНИЕ',
    'home.expect.nutrition.text': 'Системы питания, подстроенные под ваши цели, меню для разных целей от снижения веса до набора массы.',
    'home.expect.support.title': 'ПОДДЕРЖКА',
    'home.expect.support.text': 'Команда экспертов отвечает на вопросы, внимательно относимся к каждому участнику, сопровождаем весь путь.',
    'home.expect.results.title': 'РЕЗУЛЬТАТЫ',
    'home.expect.results.text': 'Измеримый прогресс в формировании фигуры, здоровье, энергии и самочувствии, которые вы заметите с первой недели.',

    // Courses
    'courses.title': 'КУРСЫ',
    'courses.filter.price': 'СТОИМОСТЬ ▾',
    'courses.filter.price.asc': 'По возрастанию',
    'courses.filter.price.desc': 'По убыванию',
    'courses.filter.target': 'ЦЕЛЕВЫЕ ЗОНЫ ▾',
    'courses.filter.target.all': 'Все тело',
    'courses.filter.target.legs': 'Ноги',
    'courses.filter.target.arms': 'Руки',
    'courses.filter.target.glutes': 'Ягодицы',
    'courses.forhome': 'для дома',
    'courses.buy': 'КУПИТЬ',

    // Course details
    'course.back': '← Назад к курсам',
    'course.buy': 'КУПИТЬ СЕЙЧАС',
    'course.cart': 'ДОБАВИТЬ В КОРЗИНУ',
    'course.processing': 'ОБРАБОТКА...',
    'course.details': 'Детали курса:',
    'course.included': 'Что вы получите:',
    'course.benefits': 'Преимущества курса',
    'course.forwhom': 'Кому подойдет этот курс',
    'course.trainer': 'Ваш тренер',
    'course.reviews': 'Отзывы',
    'course.related': 'Вам также может понравиться',

    // About
    'about.title': 'О НАС',
    'about.intro': 'IRNBY TRAINING CLUB — это сообщество единомышленников, объединенных стремлением к здоровому образу жизни и гармоничному развитию личности.',
    'about.desc': 'Наш проект появился в 2017 году, когда идейный вдохновитель Анастасия Миронова решила создать уникальную концепцию фитнес-школы, в основе которой лежит комплексный подход к достижению желаемой физической формы и внутренней гармонии.',
    'about.safety.title': 'БЕЗОПАСНОСТЬ',
    'about.community.title': 'КОМЬЮНИТИ',
    'about.expertise.title': 'ЭКСПЕРТНОСТЬ',

    // Footer
    'footer.offer': 'Договор оферты',
    'footer.policy': 'Пользовательское соглашение',
    'footer.copyright': '© Миронова Анастасия 2025',

    // Language switcher
    'lang.ru': 'РУС',
    'lang.en': 'ENG',
    'lang.loading': 'Загрузка...',

    // Mobile App
    'app.title': 'МОБИЛЬНОЕ ПРИЛОЖЕНИЕ',
    'app.subtitle': 'Занимайтесь где угодно, отслеживайте прогресс',
    'app.features.title': 'ВОЗМОЖНОСТИ ПРИЛОЖЕНИЯ',
    'app.features.workout': 'Более 100 тренировок для любого уровня подготовки',
    'app.features.progress': 'Отслеживание прогресса и персональная статистика',
    'app.features.nutrition': 'Планы питания и рекомендации по диете',
    'app.download.title': 'НАЧНИТЕ ЗАНИМАТЬСЯ ПРЯМО СЕЙЧАС',
    'app.download.subtitle': 'Скачайте приложение IRNBY CLUB и получите доступ ко всем тренировкам',
    'app.download.ios': 'Скачать для iOS',
    'app.download.android': 'Скачать для Android'
  },
  en: {
    // Navigation
    'nav.home': 'home',
    'nav.bestsellers': 'bestsellers 2024',
    'nav.courses': 'courses',
    'nav.challenge': 'challenge',
    'nav.marathon': 'marathon',
    'nav.app': 'app',
    'nav.about': 'about us',
    'nav.faq': 'faq',

    // Homepage
    'home.hero.title': 'FITNESS PLATFORM\nFOR HOME AND GYM\nWORKOUTS',
    'home.hero.subtitle': 'Workouts, meal plans, and progress tracking—all in one place.',
    'home.info.courses.title': 'COURSES',
    'home.info.courses.description': 'Well-designed workouts for any goal and skill level, stimulating growth and development. You can train at home and in the gym.',
    'home.info.marathon.title': 'MARATHON',
    'home.info.marathon.description': 'A 30-day program that will help you reach your goals.',
    'home.hero.cta': 'LEARN MORE',
    'home.marquee.text': 'IRNBY TRAINING CLUB • FITNESS PLATFORM • HOME AND GYM WORKOUTS',
    'home.bestsellers.title': 'BESTSELLERS 2024',
    'home.approach.title': 'UNIQUE APPROACH TO YOU',
    'home.approach.text': 'A new, fresh workout format. The Club will definitely suit you.',
    'home.approach.cta': 'LEARN HOW',
    'home.expect.title': 'WHAT AWAITS YOU WITH US?',
    'home.expect.training.title': 'WORKOUTS',
    'home.expect.training.text': 'Well-designed workouts for any goal and skill level, stimulating growth and development. You can train at home and in the gym.',
    'home.expect.nutrition.title': 'NUTRITION',
    'home.expect.nutrition.text': 'Nutrition systems tailored to your goals, menus for different purposes from weight loss to muscle gain.',
    'home.expect.support.title': 'SUPPORT',
    'home.expect.support.text': 'Our team of experts answers questions, we pay attention to each participant and accompany you throughout your journey.',
    'home.expect.results.title': 'RESULTS',
    'home.expect.results.text': 'Measurable progress in body shaping, health, energy, and well-being that you\'ll notice from the first week.',

    // Courses
    'courses.title': 'COURSES',
    'courses.filter.price': 'PRICE ▾',
    'courses.filter.price.asc': 'Ascending',
    'courses.filter.price.desc': 'Descending',
    'courses.filter.target': 'TARGET AREAS ▾',
    'courses.filter.target.all': 'Full body',
    'courses.filter.target.legs': 'Legs',
    'courses.filter.target.arms': 'Arms',
    'courses.filter.target.glutes': 'Glutes',
    'courses.forhome': 'for home',
    'courses.buy': 'BUY',

    // Course details
    'course.back': '← Back to courses',
    'course.buy': 'BUY NOW',
    'course.cart': 'ADD TO CART',
    'course.processing': 'PROCESSING...',
    'course.details': 'Course details:',
    'course.included': 'What you get:',
    'course.benefits': 'Course benefits',
    'course.forwhom': 'Who is this course for',
    'course.trainer': 'Your trainer',
    'course.reviews': 'Reviews',
    'course.related': 'You may also like',

    // About
    'about.title': 'ABOUT US',
    'about.intro': 'IRNBY TRAINING CLUB is a community of like-minded people united by a desire for a healthy lifestyle and harmonious personal development.',
    'about.desc': 'Our project appeared in 2017 when the ideological inspirer Anastasia Mironova decided to create a unique concept of a fitness school based on an integrated approach to achieving the desired physical form and inner harmony.',
    'about.safety.title': 'SAFETY',
    'about.community.title': 'COMMUNITY',
    'about.expertise.title': 'EXPERTISE',

    // Footer
    'footer.offer': 'Offer Agreement',
    'footer.policy': 'Privacy Policy',
    'footer.copyright': '© Anastasia Mironova 2025',

    // Language switcher
    'lang.ru': 'RUS',
    'lang.en': 'ENG',
    'lang.loading': 'Loading...',

    // Mobile App
    'app.title': 'MOBILE APP',
    'app.subtitle': 'Work out anywhere, track your progress',
    'app.features.title': 'APP FEATURES',
    'app.features.workout': 'Over 100 workouts for any skill level',
    'app.features.progress': 'Progress tracking and personal statistics',
    'app.features.nutrition': 'Meal plans and diet recommendations',
    'app.download.title': 'START TRAINING RIGHT NOW',
    'app.download.subtitle': 'Download the IRNBY CLUB app and get access to all workouts',
    'app.download.ios': 'Download for iOS',
    'app.download.android': 'Download for Android'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.bestsellers': 'الأكثر مبيعًا 2024',
    'nav.courses': 'الدورات',
    'nav.challenge': 'تحدي',
    'nav.marathon': 'ماراثون',
    'nav.app': 'تطبيق',
    'nav.about': 'معلومات عنا',
    'nav.faq': 'الأسئلة الشائعة',
  
    // Homepage
    'home.hero.title': 'منصة اللياقة\nللتدريب في المنزل\nوفي الصالة الرياضية',
    'home.hero.subtitle': 'تمارين، وجبات غذائية، وتتبع التقدم—all in one place.',
    'home.info.courses.title': 'الدورات',
    'home.info.courses.description': 'تمارين مصممة جيدًا لأي هدف ومستوى، يمكنك التدريب في المنزل أو في الصالة.',
    'home.hero.cta': 'اكتشف المزيد',
    'home.marquee.text': 'نادي التدريب IRNBY • منصة اللياقة البدنية • التدريب في المنزل والصالة',
    'home.bestsellers.title': 'الأكثر مبيعًا 2024',
    'home.approach.title': 'نهجنا الفريد لك',
    'home.approach.text': 'تنسيق جديد ومنعش للتدريب. بالتأكيد يناسبك.',
    'home.approach.cta': 'اكتشف كيف',
    'home.expect.title': 'ما الذي ينتظرك معنا؟',
    'home.expect.training.title': 'التمارين',
    'home.expect.training.text': 'تدريبات مصممة جيدًا لأي هدف ومستوى، يمكنك التدريب في المنزل أو في النادي.',
    'home.expect.nutrition.title': 'التغذية',
    'home.expect.nutrition.text': 'أنظمة غذائية مصممة حسب أهدافك، من خسارة الوزن إلى بناء العضلات.',
    'home.expect.support.title': 'الدعم',
    'home.expect.support.text': 'نحن نقدم دعمًا فرديًا من خبرائنا طوال رحلتك.',
    'home.expect.results.title': 'النتائج',
    'home.expect.results.text': 'تقدم ملموس في اللياقة والطاقة والصحة، ستلاحظه من الأسبوع الأول.',
  
    // Courses
    'courses.title': 'الدورات',
    'courses.filter.price': 'السعر ▾',
    'courses.filter.price.asc': 'تصاعدي',
    'courses.filter.price.desc': 'تنازلي',
    'courses.filter.target': 'المناطق المستهدفة ▾',
    'courses.filter.target.all': 'الجسم بالكامل',
    'courses.filter.target.legs': 'الساقين',
    'courses.filter.target.arms': 'الذراعين',
    'courses.filter.target.glutes': 'الأرداف',
    'courses.forhome': 'للتدريب المنزلي',
    'courses.buy': 'اشترِ',
  
    // Course details
    'course.back': '← العودة إلى الدورات',
    'course.buy': 'اشترِ الآن',
    'course.cart': 'أضف إلى السلة',
    'course.processing': 'جارٍ المعالجة...',
    'course.details': 'تفاصيل الدورة:',
    'course.included': 'ماذا ستحصل:',
    'course.benefits': 'مزايا الدورة',
    'course.forwhom': 'لمن هذه الدورة؟',
    'course.trainer': 'مدربك',
    'course.reviews': 'المراجعات',
    'course.related': 'قد يعجبك أيضًا',
  
    // About
    'about.title': 'معلومات عنا',
    'about.intro': 'نادي التدريب IRNBY هو مجتمع من الأشخاص الطموحين الذين يسعون نحو حياة صحية وتطور شخصي متوازن.',
    'about.desc': 'بدأ مشروعنا في 2017 عندما قررت مؤسسة النادي إنشاء مدرسة لياقة فريدة تدمج بين الجسد والعقل.',
    'about.safety.title': 'السلامة',
    'about.community.title': 'المجتمع',
    'about.expertise.title': 'الخبرة',
  
    // Footer
    'footer.offer': 'اتفاقية العرض',
    'footer.policy': 'سياسة الخصوصية',
    'footer.copyright': '© أناستاسيا ميرونوفا 2025',
  
    // Language
    'lang.en': 'إنجليزي',
    'lang.ru': 'روسي',
    'lang.loading': 'جارٍ التحميل...',
  
    // App
    'app.title': 'تطبيق الهاتف',
    'app.subtitle': 'تدرب من أي مكان وتابع تقدمك',
    'app.features.title': 'ميزات التطبيق',
    'app.features.workout': 'أكثر من 100 تمرين لجميع المستويات',
    'app.features.progress': 'تتبع التقدم والإحصائيات الشخصية',
    'app.features.nutrition': 'خطط غذائية وتوصيات',
    'app.download.title': 'ابدأ التمرين الآن',
    'app.download.subtitle': 'حمل تطبيق IRNBY CLUB للوصول إلى كل التمارين',
    'app.download.ios': 'تحميل لـ iOS',
    'app.download.android': 'تحميل لـ Android'
  }
};

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with default language (Russian)
  const [language, setLanguageState] = useState<Language>('ru');
  // Add a loading state for language change
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Load saved language preference on component mount
  useEffect(() => {
    const loadLanguage = () => {
      // Try to get language from cookie first (for cross-session persistence)
      const cookieLanguage = Cookies.get(LANGUAGE_COOKIE_NAME) as Language | undefined;

      if (cookieLanguage && (cookieLanguage === 'ru' || cookieLanguage === 'en' || cookieLanguage === 'ar')) {
        setLanguageState(cookieLanguage);
        document.documentElement.lang = cookieLanguage;
        return;
      }

      // If no cookie, try localStorage (for backward compatibility)
      const localStorageLanguage = localStorage.getItem('language') as Language | null;
      if (localStorageLanguage && (localStorageLanguage === 'ru' || localStorageLanguage === 'en' || localStorageLanguage === 'ar')) {
        setLanguageState(localStorageLanguage);
        document.documentElement.lang = localStorageLanguage;
        return;
      }

      // If no stored preference, try to detect browser language
      const browserLanguage = navigator.language.split('-')[0];
      if (browserLanguage === 'ru') {
        setLanguageState('ru');
        document.documentElement.lang = 'ru';
        document.documentElement.dir = 'ltr';
      } else if (browserLanguage === 'en') {
        setLanguageState('en');
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
      } else if (browserLanguage === 'ar') {
        setLanguageState('ar');
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
      } else {
        setLanguageState('ru');
        document.documentElement.lang = 'ru';
        document.documentElement.dir = 'ltr';
      }
    };

    loadLanguage();
  }, []);

  // Save language preference when it changes
  const setLanguage = (newLanguage: Language) => {
    setIsChangingLanguage(true);
  
    // Use setTimeout to simulate loading and allow UI to update
    setTimeout(() => {
      setLanguageState(newLanguage);
  
      // Save to both cookie and localStorage
      Cookies.set(LANGUAGE_COOKIE_NAME, newLanguage, {
        expires: COOKIE_EXPIRATION_DAYS,
        sameSite: 'strict',
        secure: window.location.protocol === 'https:',
      });
      localStorage.setItem('language', newLanguage);
  
      // Update HTML attributes together
      document.documentElement.lang = newLanguage;
      document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
  
      setTimeout(() => {
        setIsChangingLanguage(false);
      }, 300);
    }, 500);
  };

  // Translation function
  const t = (key: TranslationKeys): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, isChangingLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
