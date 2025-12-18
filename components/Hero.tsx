
import React from 'react';
import { HERO_POINTS } from '../constants';

const Hero: React.FC = () => {
  return (
    <div className="bg-[#00C16E] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg">
      <div className="max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-black mb-2 leading-tight">
          ПОДАРКИ НА ЛЮБЫЕ ПРАЗДНИКИ
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold mb-8 opacity-90">
          ЗАКАЗАТЬ ПРЯМО СЕЙЧАС
        </h3>
        
        <ul className="space-y-3">
          {HERO_POINTS.map((point, idx) => (
            <li key={idx} className="flex items-center space-x-3 text-lg md:text-xl font-medium">
              <span className="w-2 h-2 bg-white rounded-full flex-shrink-0"></span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Promo Image Placeholder */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-[350px] h-[300px]">
        <div className="w-full h-full border-8 border-white/20 rounded-2xl overflow-hidden shadow-2xl relative">
          <img 
            src="https://picsum.photos/400/350?random=1" 
            alt="Promotion" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <p className="text-xl font-bold italic">Для самых близких...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
