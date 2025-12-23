"use client"
import React, { useEffect, useState } from 'react';
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import ServiceGrid from "../../components/ServiceGrid";
import Footer from "../../components/Footer";

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const scrollToProducts = () => {
      if (window.location.hash === "#products") {
        const section = document.getElementById("products");
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    scrollToProducts();
    window.addEventListener("hashchange", scrollToProducts);

    return () => {
      window.removeEventListener("hashchange", scrollToProducts);
    };
  }, []);

  return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />

        <main className="max-w-[1200px] mx-auto px-4 py-8 flex-grow">
          <Hero />

          {/* UV Printing Sub-Banner */}
          <div className="mt-8 mb-12 flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm p-4">
            <div
                className="flex-shrink-0 bg-[#00C16E] text-white px-8 py-4 rounded-lg font-bold text-2xl relative"
                style={{
                  clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)',
                  minWidth: '220px',
                  textAlign: 'center'
                }}
            >
              УФ печать
            </div>
            <div className="ml-8 text-sm">
              <p className="font-bold text-[#006837] mb-1">
                УФ печать на ручках, карандашах, ежедневниках, флешках, блокнотах, зажигалках, чехлах для телефонов и др.
              </p>
              <p className="text-gray-500">
                Современная технология для ярких и стойких изображений на различных материалах.
              </p>
            </div>
          </div>

          <div id="products">
            <ServiceGrid
                selectedId={selectedCategory}
                onSelect={(id) => setSelectedCategory(id)}
            />
          </div>

          {selectedCategory === 'digital' && (
              <div className="mt-12 p-8 border-t border-gray-100 bg-gray-50 rounded-2xl animate-fade-in">
                <h2 className="text-2xl font-bold text-[#006837] mb-4">ЦИФРОВАЯ ПЕЧАТЬ: ВИЗИТКИ / ФЛАЕРЫ</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-6">
                    <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center italic text-gray-400">Визитка</div>
                    <div>
                      <h3 className="font-bold text-[#00C16E]">ВИЗИТКИ</h3>
                      <p className="text-sm text-gray-500">плотность 300гр</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center space-x-6">
                    <div className="w-32 h-24 bg-gray-200 rounded flex items-center justify-center italic text-gray-400">Флаер</div>
                    <div>
                      <h3 className="font-bold text-[#00C16E]">ФЛАЕРЫ / ЛИСТОВКИ</h3>
                      <p className="text-sm text-gray-500">плотность 115гр</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-[#006837] text-white p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#00C16E]" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%, 0% 100%)' }}></div>
                  <p className="text-center font-bold">
                    <span className="text-[#00C16E]">ВАЖНО!</span> МАКЕТ ПРИНИМАЕТСЯ К ПЕЧАТИ В ФОРМАТЕ TIFF, РАЗМЕР 1:1, ЦВЕТОВОЙ МОДЕЛИ CMYK, КАЧЕСТВО МАКЕТА 300 dpi, БЕЗ ПОЗРАЧНОСТИ
                  </p>
                </div>
              </div>
          )}
        </main>

        <Footer />
      </div>
  );
};

export default App;
