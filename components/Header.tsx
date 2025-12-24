"use client"
import React from 'react';
import Link from 'next/link';
import { COLORS, NAVIGATION_LINKS } from '../constants';
import CartIcon from './CartIcon';

const NAV_LINK_ROUTES: Record<string, string> = {
  "Главная": "/",
  "Продукция": "/#products",
  "О нас": "/about",
  "Оплата": "/payment",
  "Доставка": "/delivery",
  "Отзывы": "/reviews",
  "Помощь": "/help",
  "Контакты": "/contacts",
};

const Header: React.FC = () => {
  return (
    <header className="w-full">
      {/* Top Green Contact Bar */}
      <div className="bg-[#00C16E] text-white py-2 px-4">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center text-xs sm:text-sm font-medium">
          <div className="flex items-center space-x-6 text-[#1f1f1f]">
            <span>Мы на связи с 9:00 до 17:00</span>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span className="font-bold">+7 978 78 78 788</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[#1f1f1f]">
              <a
                href="https://vk.com/reklama_feo?from=groups"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white/80 transition-colors"
              >
                VK
              </a>
              <span className="text-[#1f1f1f]">/</span>
              <a
                href="https://reklamnoe-agentstvo-rakurs.clients.site/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white/80 transition-colors"
              >
                Яндекс
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white py-4 px-4 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto flex items-center">
          <div className="flex items-center gap-5">
            <img src="/logo.svg" alt="Ракурс" className="h-24 w-auto" />
            <div className="h-14 w-[3px] bg-[#2f2f2f]" />
            <div className="text-[#006837] font-bold text-xl leading-tight">
              <div>Индивидуальные условия</div>
              <div>при постоянном сотрудничестве</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Green Navigation Menu */}
      <nav className="bg-[#006837] text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex items-center h-12 gap-6">
          <ul className="flex flex-1 items-center justify-between text-lg tracking-wide h-full pr-12">
            {NAVIGATION_LINKS.map((link) => {
              const href = NAV_LINK_ROUTES[link] ?? "/";
              return (
                <li key={link}>
                  <Link href={href} className="cursor-pointer hover:text-[#00C16E] transition-colors">
                    {link}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center space-x-2 shrink-0">
            <Link href="/search" className="cursor-pointer hover:text-[#00C16E] transition-colors p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link href="/cart">
              <CartIcon onClick={() => {}} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
