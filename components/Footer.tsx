
import React from 'react';
import { NAVIGATION_LINKS, SERVICE_LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#006837] text-white pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00C16E] rounded-lg flex items-center justify-center overflow-hidden">
                <div className="w-6 h-6 border-2 border-white rotate-45 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white"></div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tighter">РАКУРС</h2>
                <p className="text-[8px] font-bold uppercase -mt-1 leading-none text-[#7CFFBB]">Рекламно-производственная компания</p>
              </div>
            </div>
            <p className="text-sm text-gray-200 leading-relaxed">
              Мы создаем качественную рекламную продукцию, помогая вашему бизнесу выделяться. От визиток до объемных световых букв.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00C16E] cursor-pointer transition-colors">
                <span className="text-xs font-bold">VK</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#00C16E] cursor-pointer transition-colors">
                <span className="text-xs font-bold">TG</span>
              </div>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#7CFFBB]">Навигация</h3>
            <ul className="space-y-3">
              {NAVIGATION_LINKS.map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-gray-200 hover:text-[#00C16E] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-[#7CFFBB]">Услуги</h3>
            <ul className="space-y-3">
              {SERVICE_LINKS.map(service => (
                <li key={service}>
                  <a href="#" className="text-sm text-gray-200 hover:text-[#00C16E] transition-colors">{service}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-6 text-[#7CFFBB]">Контакты</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#00C16E] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-200">г. Симферополь,<br />ул. Примерная, д. 10</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#00C16E] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p className="text-sm font-bold text-white">+7 978 78 78 788</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-[#00C16E] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-200">Пн-Пт: 09:00 — 17:00<br />Сб-Вс: Выходной</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} РАКУРС. Все права защищены.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
