
import React from 'react';
import { HERO_POINTS } from '../constants';

const Hero: React.FC = () => {
  return (
    <div className="bg-[#00C16E] rounded-2xl p-6 md:p-10 text-white shadow-lg">
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
        <div className="flex-1 max-w-2xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight text-[#1f1f1f] uppercase">
            ПОДАРКИ НА ЛЮБЫЕ ПРАЗДНИКИ
          </h2>
          <h3 className="text-2xl md:text-3xl font-medium mt-4 mb-6 uppercase tracking-wide">
            ЗАКАЗАТЬ ПРЯМО СЕЙЧАС
          </h3>

          <ul className="space-y-2 text-lg md:text-xl font-medium">
            {HERO_POINTS.map((point, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[#1f1f1f] rounded-full flex-shrink-0"></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full lg:w-[360px]">
          <div className="bg-white border-[6px] border-white rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://picsum.photos/520/360?random=2"
              alt="Подарки"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
