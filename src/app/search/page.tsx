"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

type SearchItem = {
  title: string;
  href: string;
  keywords: string[];
};

const SEARCH_ITEMS: SearchItem[] = [
  {
    title: "Цифровая печать",
    href: "/services/digital",
    keywords: ["цифровая", "печать", "визитки", "флаеры", "листовки", "digital"],
  },
  {
    title: "Широкоформатная печать",
    href: "/services/wide",
    keywords: ["широкоформатная", "баннер", "пленка", "бумага", "холст", "wide"],
  },
  {
    title: "Плоттерная подрезка",
    href: "/services/plotter",
    keywords: ["плоттер", "подрезка", "наклейки", "резка", "plotter"],
  },
  {
    title: "Сувенирная продукция",
    href: "/services/souvenirs",
    keywords: [
      "сувенирная",
      "сувениры",
      "ручки",
      "кружки",
      "картины",
      "магниты",
      "ежедневники",
      "блокноты",
      "пазлы",
      "брелоки",
      "значки",
      "бейджи",
    ],
  },
  {
    title: "Адресные таблички",
    href: "/services/address",
    keywords: ["адресные", "таблички", "табличка", "адрес"],
  },
  {
    title: "Буквы",
    href: "/services/letters",
    keywords: ["буквы", "объемные", "плоские", "letters"],
  },
  {
    title: "О нас",
    href: "/about",
    keywords: ["о нас", "компания", "about"],
  },
  {
    title: "Отзывы",
    href: "/reviews",
    keywords: ["отзывы", "review", "отзыв"],
  },
  {
    title: "Контакты",
    href: "/contacts",
    keywords: ["контакты", "контакт", "телефон", "email", "адрес"],
  },
  {
    title: "Корзина",
    href: "/cart",
    keywords: ["корзина", "cart"],
  },
];

const normalize = (value: string) => value.toLowerCase().trim();

const getScore = (item: SearchItem, query: string) => {
  if (!query) return 0;
  const q = normalize(query);
  const title = normalize(item.title);
  if (title === q) return 100;
  if (title.startsWith(q)) return 90;
  if (title.includes(q)) return 70;
  for (const keyword of item.keywords) {
    const k = normalize(keyword);
    if (k === q) return 80;
    if (k.startsWith(q)) return 60;
    if (k.includes(q)) return 50;
  }
  return 0;
};

const SearchPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState<string>(initialQuery);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    return SEARCH_ITEMS
      .map((item) => ({ item, score: getScore(item, q) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }, [query]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    if (results.length > 0) {
      router.push(results[0].href);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="max-w-[1200px] w-full mx-auto px-4 py-10 flex-grow">
        <div className="flex w-full mb-10 h-16">
          <div className="relative bg-[#00C16E] text-white font-bold text-sm sm:text-lg px-4 sm:px-8 flex items-center h-full z-10 w-fit shrink-0 uppercase">
            ПОИСК
            <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent" />
          </div>
          <div className="bg-[#006837] flex-grow flex items-center px-8 sm:px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-12 sm:pl-16">
            ПОИСК ПО ТОВАРАМ
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-8 shadow-sm bg-white space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Введите тип товара, например: кружки"
              className="flex-grow border-2 border-[#006837] rounded-xl h-11 px-4 focus:outline-none text-black"
            />
            <button
              type="submit"
              className="bg-[#00C16E] text-white font-bold uppercase px-6 h-11 rounded-xl hover:bg-[#00a860] transition-colors"
            >
              Найти
            </button>
          </form>

          <div className="space-y-2">
            {query.trim() && results.length === 0 && (
              <div className="text-sm text-gray-500">Ничего не найдено. Попробуйте другое название.</div>
            )}
            {results.map((result) => (
              <button
                key={result.href}
                type="button"
                onClick={() => router.push(result.href)}
                className="w-full text-left border border-[#006837] rounded-lg px-4 py-3 font-bold text-[#006837] hover:bg-[#00C16E] hover:text-white transition-colors"
              >
                {result.title}
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchPage;
