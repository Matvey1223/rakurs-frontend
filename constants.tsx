
import React from 'react';

export const COLORS = {
  brightGreen: '#00C16E',
  darkGreen: '#006837',
  lightGreen: '#7CFFBB',
  grayBorder: '#E5E7EB',
  textDark: '#111827',
  textMuted: '#6B7280'
};

export const NAVIGATION_LINKS = [
  'Главная',
  'Продукция',
  'О нас',
  // 'Оплата',
  // 'Доставка',
  'Отзывы',
  // 'Помощь',
  'Контакты'
];

export const SERVICE_LINKS = [
  'Цифровая печать',
  'Широкоформатная печать',
  'Плоттерная подрезка',
  'Сувенирная продукция',
  'Адресные таблички',
  'Объемные буквы',
  'УФ печать'
];

export const HERO_POINTS = [
  'именные ручки',
  'кружки',
  'блокноты с фольгированием',
  'открытки и пригласительные на прозрачном пластике',
  'другое'
];

export const CATEGORIES = [
  {
    id: 'digital',
    title: 'ЦИФРОВАЯ ПЕЧАТЬ',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm10 12H6v-4h12v4zm2-6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
      </svg>
    )
  },
  {
    id: 'wide',
    title: 'ШИРОКОФОРМАТНАЯ ПЕЧАТЬ',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    )
  },
  {
    id: 'plotter',
    title: 'ПЛОТТЕРНАЯ ПОДРЕЗКА',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    )
  },
  {
    id: 'souvenirs',
    title: 'СУВЕНИРНАЯ ПРОДУКЦИЯ',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM12 2c-4.97 0-9 4.03-9 9 4.97 0 9-4.03 9-9z" />
      </svg>
    )
  },
  {
    id: 'address',
    title: 'АДРЕСНЫЕ ТАБЛИЧКИ',
    icon: (
      <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    )
  },
  {
    id: 'letters',
    title: 'БУКВЫ',
    icon: (
      <span className="text-6xl font-black">A</span>
    )
  }
];
