
import React from 'react';
import { COLORS, NAVIGATION_LINKS } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="w-full">
      {/* Top Green Contact Bar */}
      <div className="bg-[#00C16E] text-white py-2 px-4">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center text-xs sm:text-sm font-medium">
          <div className="flex items-center space-x-6">
            <span>Мы на связи с 9:00 до 17:00</span>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              <span className="font-bold">+7 978 78 78 788</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>VK / Яндекс</span>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="bg-white py-4 px-4 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#006837] rounded-lg flex items-center justify-center overflow-hidden">
                <div className="w-8 h-8 border-2 border-white rotate-45 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white"></div>
                </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#006837] tracking-tighter">РАКУРС</h1>
              <p className="text-[9px] font-bold text-[#006837] uppercase -mt-1 leading-none">Рекламно-производственная компания</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#006837] font-bold text-sm leading-tight">Индивидуальные условия</p>
            <p className="text-[#006837] text-sm leading-tight">при постоянном сотрудничестве</p>
          </div>
        </div>
      </div>

      {/* Dark Green Navigation Menu */}
      <nav className="bg-[#006837] text-white">
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center h-12">
          <ul className="flex space-x-8 text-sm font-semibold tracking-wide h-full items-center">
            {NAVIGATION_LINKS.map((link) => (
              <li key={link} className="cursor-pointer hover:text-[#00C16E] transition-colors">
                {link}
              </li>
            ))}
          </ul>
          <div className="cursor-pointer hover:text-[#00C16E] transition-colors p-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
