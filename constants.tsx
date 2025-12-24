
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
  'Оплата',
  'Доставка',
  'Отзывы',
  'Помощь',
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
      <img src="/digital.svg" alt="Ракурс" className="h-20 w-auto" />
    )
  },
  {
    id: 'wide',
    title: 'ШИРОКОФОРМАТНАЯ ПЕЧАТЬ',
    icon: (
      <img src="/big_width.svg" alt="Ракурс" className="h-20 w-auto" />
    )
  },
  {
    id: 'plotter',
    title: 'ПЛОТТЕРНАЯ ПОДРЕЗКА',
    icon: (
      <img src="/plotter.svg" alt="Ракурс" className="h-20 w-auto" />
    )
  },
  {
    id: 'souvenirs',
    title: 'СУВЕНИРНАЯ ПРОДУКЦИЯ',
    icon: (
      <img src="/souvenirs.svg" alt="Ракурс" className="h-20 w-auto" />
    )
  },
  {
    id: 'address',
    title: 'АДРЕСНЫЕ ТАБЛИЧКИ',
    icon: (
      <img src="/address_tables.svg" alt="Ракурс" className="h-20 w-auto" />
    )
  },
  {
    id: 'letters',
    title: 'БУКВЫ',
    icon: (
      <img src="/letters.svg" alt="Ракурс" className="h-20 w-auto" />
    )
  }
];
