"use client"
import React, { useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    comments: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Здесь будет отправка данных на сервер
    // Пока просто симулируем отправку
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Очищаем корзину и перенаправляем на страницу благодарности
    clearCart();
    setIsSubmitting(false);
    alert('Заказ успешно оформлен! Спасибо за ваш заказ.');
    router.push('/');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="max-w-[1200px] mx-auto px-4 py-16 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#006837] mb-4">Корзина пуста</h1>
            <p className="text-gray-600 mb-8">Добавьте товары для оформления заказа</p>
            <a
              href="/"
              className="inline-block bg-[#00C16E] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#00a85a] transition-colors"
            >
              Вернуться на главную
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-[#006837] mb-8 uppercase">Оформление заказа</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Форма заказа */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Контактная информация */}
              <div className="bg-white border-2 border-[#006837] rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#006837] mb-4 uppercase">Контактная информация</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#006837] mb-2">
                      ФИО <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerData.name}
                      onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                      className="w-full border-2 border-[#006837] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00C16E]"
                      placeholder="Иванов Иван Иванович"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#006837] mb-2">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                      className="w-full border-2 border-[#006837] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00C16E]"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#006837] mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerData.email}
                      onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                      className="w-full border-2 border-[#006837] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00C16E]"
                      placeholder="example@mail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#006837] mb-2">
                      Адрес доставки
                    </label>
                    <input
                      type="text"
                      value={customerData.address}
                      onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                      className="w-full border-2 border-[#006837] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00C16E]"
                      placeholder="Город, улица, дом, квартира"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#006837] mb-2">
                      Комментарии к заказу
                    </label>
                    <textarea
                      rows={4}
                      value={customerData.comments}
                      onChange={(e) => setCustomerData({ ...customerData, comments: e.target.value })}
                      className="w-full border-2 border-[#006837] rounded-lg px-4 py-2 focus:outline-none focus:border-[#00C16E] resize-none"
                      placeholder="Дополнительная информация к заказу..."
                    />
                  </div>
                </div>
              </div>

              {/* Способ оплаты */}
              <div className="bg-white border-2 border-[#006837] rounded-xl p-6">
                <h2 className="text-xl font-bold text-[#006837] mb-4 uppercase">Способ оплаты</h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      defaultChecked
                      className="w-5 h-5 border-2 border-[#006837] accent-[#006837]"
                    />
                    <span className="font-semibold text-[#006837]">Наличными при получении</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      className="w-5 h-5 border-2 border-[#006837] accent-[#006837]"
                    />
                    <span className="font-semibold text-[#006837]">Банковской картой</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      className="w-5 h-5 border-2 border-[#006837] accent-[#006837]"
                    />
                    <span className="font-semibold text-[#006837]">Банковский перевод</span>
                  </label>
                </div>
              </div>

              {/* Кнопка отправки */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00C16E] text-white font-bold py-4 px-6 rounded-lg text-lg uppercase hover:bg-[#00a85a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Оформление...' : 'Подтвердить заказ'}
              </button>
            </form>
          </div>

          {/* Правая колонка - Сводка заказа */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border-2 border-[#006837] rounded-xl p-6 sticky top-4">
              <h2 className="text-xl font-bold text-[#006837] mb-4 uppercase">Ваш заказ</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#006837] text-sm uppercase">
                          {item.type === 'VIZITKI' ? 'ВИЗИТКИ' : 'ФЛАЕРЫ'}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Формат: {item.format} | {item.specs}
                        </p>
                        <p className="text-xs text-gray-600">
                          Тираж: {item.quantity} шт.
                        </p>
                        {item.creasing && item.creasing > 0 && (
                          <p className="text-xs text-gray-500">Биговка: {item.creasing}</p>
                        )}
                        {item.folding && (
                          <p className="text-xs text-gray-500">Фальцовка: да</p>
                        )}
                        {item.readyDate && (
                          <p className="text-xs text-[#00C16E] mt-2 font-semibold">
                            Готовность: {item.readyDate}, {item.readyTime}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-[#006837] ml-2">
                        {item.totalPrice} ₽
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-[#006837] pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Товаров:</span>
                  <span className="font-semibold text-[#006837]">{items.length}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-[#006837]">
                  <span>Итого:</span>
                  <span className="text-2xl">{total} ₽</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;

