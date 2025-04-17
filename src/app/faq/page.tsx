'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext'; // if you want to make it multilingual

const categories = ['ИСПОЛЬЗОВАНИЕ', 'ОПЛАТА', 'ТРЕНИРОВКИ', 'ПИТАНИЕ'];

const faqItems = [
  {
    category: 'ИСПОЛЬЗОВАНИЕ',
    question: 'Как начать заниматься с вами?',
    answer: 'Выберите курс, оплатите и начните тренироваться в личном кабинете.',
  },
  {
    category: 'ИСПОЛЬЗОВАНИЕ',
    question: 'Сколько времени отводится на активацию курса?',
    answer: 'Курс активируется автоматически после оплаты.',
  },
  {
    category: 'ИСПОЛЬЗОВАНИЕ',
    question: 'Что делать, если я активировала курс, но не успеваю его пройти?',
    answer: 'Курс остаётся доступным навсегда — вы можете продолжить в удобное время.',
  },
  {
    category: 'ИСПОЛЬЗОВАНИЕ',
    question: 'Могу ли я использовать личный кабинет с компьютера и телефона?',
    answer: 'Да, личный кабинет доступен с любого устройства.',
  },
  {
    category: 'ИСПОЛЬЗОВАНИЕ',
    question: 'У меня не работает приложение / сайт / чаты, что мне делать?',
    answer: 'Напишите нам на support@irnbyclub.com или в Telegram, и мы поможем.',
  },
  {
    category: 'ИСПОЛЬЗОВАНИЕ',
    question: 'Как я могу сменить пароль от личного кабинета?',
    answer: 'Воспользуйтесь функцией восстановления пароля на странице входа.',
  },
  {
    category: 'ИСПОЛЬЗОВАНИЕ',
    question: 'Будет ли у меня доступ к программе тренировок после окончания курса?',
    answer: 'Да, доступ остаётся с вами навсегда.',
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('ИСПОЛЬЗОВАНИЕ');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredItems = faqItems.filter((item) => item.category === activeCategory);

  return (
    <div className="py-16">
      <div className="container-custom">
        <h1 className="section-heading">Q/A</h1>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 mt-12">
          {/* Left sidebar with categories */}
          <div className="space-y-4 text-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`block text-left font-medium uppercase ${
                  cat === activeCategory
                    ? 'text-black'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion FAQ Items */}
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.question}
                className="border-b border-gray-300 pb-3"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left text-sm flex justify-between items-center font-medium"
                >
                  {item.question}
                  <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && (
                  <p className="mt-3 text-sm text-gray-700">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="mb-4">Не нашли ответ на свой вопрос?</p>
          <Link href="mailto:support@irnbyclub.com" className="btn-primary inline-block">
            НАПИШИТЕ НАМ
          </Link>
        </div>
      </div>
    </div>
  );
}
