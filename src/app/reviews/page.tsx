import React from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const ReviewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="max-w-[1200px] w-full mx-auto px-4 py-10 flex-grow">
        <div className="flex w-full mb-10 h-16">
          <div className="relative bg-[#00C16E] text-white font-bold text-sm sm:text-lg px-4 sm:px-8 flex items-center h-full z-10 w-fit shrink-0 uppercase">
            ОТЗЫВЫ
            <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent" />
          </div>
          <div className="bg-[#006837] flex-grow flex items-center px-8 sm:px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-12 sm:pl-16">
            ОТЗЫВЫ
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-8 shadow-sm bg-white">
          <p className="text-base text-black mb-4">
            Будем рады вашему отзыву о работе с нами.
          </p>
          <a
            href="https://yandex.ru/sprav/42014679576/p/edit/reviews/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-bold text-[#006837] hover:text-[#00C16E] transition-colors"
          >
            Оставить отзыв на Яндексе
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReviewsPage;
