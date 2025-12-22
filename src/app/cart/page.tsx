"use client"
import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';

const CartPage: React.FC = () => {
  const { items, removeItem, getTotalPrice, clearCart } = useCart();
  const total = getTotalPrice();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-[#006837] mb-8 uppercase">Корзина</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-32 h-32 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-2xl font-semibold mb-2">Корзина пуста</p>
            <p className="text-lg mb-8">Добавьте товары для оформления заказа</p>
            <Link
              href="/"
              className="bg-[#00C16E] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#00a85a] transition-colors"
            >
              Вернуться на главную
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Левая колонка - Список товаров */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#00C16E] transition-colors bg-white"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#006837] uppercase text-lg mb-2">
                        {item.type === 'VIZITKI' ? 'ВИЗИТКИ' : 'ФЛАЕРЫ'}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Формат:</span> {item.format} | {item.specs}
                        </p>
                        <p>
                          <span className="font-semibold">Тираж:</span> {item.quantity} шт.
                        </p>
                        {item.creasing && item.creasing > 0 && (
                          <p>
                            <span className="font-semibold">Биговка:</span> {item.creasing}
                          </p>
                        )}
                        {item.folding && (
                          <p>
                            <span className="font-semibold">Фальцовка:</span> да
                          </p>
                        )}
                        {item.extraCut && item.extraCut > 0 && (
                          <p>
                            <span className="font-semibold">Дополнительный рез:</span> да
                          </p>
                        )}
                        {item.holes && item.holes > 0 && (
                          <p>
                            <span className="font-semibold">Отверстия:</span> {item.holes} шт.
                          </p>
                        )}
                        {item.rounding && item.rounding > 0 && (
                          <p>
                            <span className="font-semibold">Скругление углов:</span> {item.rounding}
                          </p>
                        )}
                        {item.eyelets && item.eyelets > 0 && (
                          <p>
                            <span className="font-semibold">Люверсы:</span> {item.eyelets} шт. ({item.eyeletColor})
                          </p>
                        )}
                        {item.readyDate && (
                          <p className="text-[#00C16E] font-semibold mt-2">
                            Готовность: {item.readyDate}, {item.readyTime}
                          </p>
                        )}
                        {/* Информация о файлах */}
                        {(item.frontFile || item.backFile || item.previewFile) && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-semibold text-[#006837] mb-1">Загруженные файлы:</p>
                            {item.frontFile && (
                              <p className="text-xs text-gray-600">
                                ✓ Лицевая сторона: {item.frontFileName || 'файл'} 
                                {item.frontFileSize && ` (${(item.frontFileSize / 1024).toFixed(1)} KB)`}
                              </p>
                            )}
                            {item.backFile && (
                              <p className="text-xs text-gray-600">
                                ✓ Оборотная сторона: {item.backFileName || 'файл'}
                                {item.backFileSize && ` (${(item.backFileSize / 1024).toFixed(1)} KB)`}
                              </p>
                            )}
                            {item.previewFile && (
                              <p className="text-xs text-gray-600">
                                ✓ Превью: {item.previewFileName || 'файл'}
                                {item.previewFileSize && ` (${(item.previewFileSize / 1024).toFixed(1)} KB)`}
                              </p>
                            )}
                          </div>
                        )}
                        {item.comments && (
                          <p className="text-xs text-gray-500 mt-2 italic">
                            Комментарий: {item.comments}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 ml-4 transition-colors"
                      title="Удалить из корзины"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
                    <span className="text-sm text-gray-500">Цена за заказ:</span>
                    <span className="text-2xl font-bold text-[#006837]">{item.totalPrice} ₽</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Правая колонка - Итого и действия */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 border-2 border-[#006837] rounded-xl p-6 sticky top-4">
                <h2 className="text-xl font-bold text-[#006837] mb-6 uppercase">Сводка заказа</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Товаров в корзине:</span>
                    <span className="font-semibold text-[#006837]">{items.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-[#006837]">Итого:</span>
                    <span className="text-3xl font-bold text-[#006837]">{total} ₽</span>
                  </div>
                </div>

                <div className="border-t-2 border-[#006837] pt-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="block w-full bg-[#00C16E] text-white font-bold py-4 px-4 rounded-lg text-center uppercase hover:bg-[#00a85a] transition-colors text-lg"
                  >
                    Оформить заказ
                  </Link>
                  <button
                    onClick={clearCart}
                    className="block w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg text-center hover:bg-gray-300 transition-colors"
                  >
                    Очистить корзину
                  </button>
                  <Link
                    href="/"
                    className="block w-full text-center text-[#006837] font-semibold py-2 hover:text-[#00C16E] transition-colors"
                  >
                    Продолжить покупки
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;

