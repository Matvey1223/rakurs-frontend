import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const aboutText = [
  "Мы предлагаем большой спектр услуг собственного производства:",
  "",
  "🏦Комплексное оформление торговых точек",
  "🚛Брендирование транспорта",
  "🅰Объемные буквы",
  "💡Световые короба/лайтбоксы",
  "🚩Широкоформатная печать",
  "📌Штендеры",
  "🛍 Все виды наклеек",
  "🏷 Полиграфия",
  "- Дизайн",
  "- Изготовление печатей и штампов",
  "- Нанесение на текстиль и керамику",
  "",
  "Изготовление качественной рекламы",
  "Монтаж любой сложности",
  "Гарантийное обслуживание",
  "",
  "Долгосрочное и результативное сотрудничество с каждым 🏆",
].join("\n");

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="max-w-[1200px] w-full mx-auto px-4 py-10 flex-grow">
        <div className="flex w-full mb-10 h-16">
          <div className="relative bg-[#00C16E] text-white font-bold text-sm sm:text-lg px-4 sm:px-8 flex items-center h-full z-10 w-fit shrink-0 uppercase">
            О НАС
            <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent" />
          </div>
          <div className="bg-[#006837] flex-grow flex items-center px-8 sm:px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-12 sm:pl-16">
            О НАС
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-8 shadow-sm bg-white">
          <div className="text-base leading-relaxed text-black whitespace-pre-line">{aboutText}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
