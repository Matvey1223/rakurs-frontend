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
  const typeLabels: Record<string, string> = {
    VIZITKI: "ВИЗИТКИ",
    FLAERS: "ФЛАЕРЫ",
    PLOTTER: "ПЛОТТЕР",
    WIDE: "ШИРОКОФОРМАТНАЯ ПЕЧАТЬ",
    SOUVENIRS: "СУВЕНИРЫ",
    ADDRESS_SIGNS: "АДРЕСНЫЕ ТАБЛИЧКИ",
    LETTERS: "БУКВЫ",
  };
  const getTypeLabel = (type: string) => typeLabels[type] ?? type;

  // Функция конвертации base64 в Blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Подготавливаем данные для отправки
      const orderData = {
        customer: customerData,
        items: items.map(item => {
          const itemData: any = {
            id: item.id,
            type: item.type,
            format: item.format,
            quantity: item.quantity,
            basePrice: item.basePrice,
            specs: item.specs,
            totalPrice: item.totalPrice,
            creasing: item.creasing,
            folding: item.folding,
            extraCut: item.extraCut,
            holes: item.holes,
            rounding: item.rounding,
            eyelets: item.eyelets,
            eyeletColor: item.eyeletColor,
            deliveryAddress: item.deliveryAddress,
            comments: item.comments,
            checkLayout: item.checkLayout,
            readyDate: item.readyDate,
            readyTime: item.readyTime,
          };

          // Добавляем файлы (можно отправить как base64 или как File через FormData)
          // Вариант 1: Отправка base64 напрямую (если бэкенд принимает)
          if (item.frontFile) {
            itemData.frontFile = item.frontFile;
            itemData.frontFileName = item.frontFileName;
            itemData.frontFileSize = item.frontFileSize;
            itemData.frontFileType = item.frontFileType;
          }
          if (item.backFile) {
            itemData.backFile = item.backFile;
            itemData.backFileName = item.backFileName;
            itemData.backFileSize = item.backFileSize;
            itemData.backFileType = item.backFileType;
          }
          if (item.previewFile) {
            itemData.previewFile = item.previewFile;
            itemData.previewFileName = item.previewFileName;
            itemData.previewFileSize = item.previewFileSize;
            itemData.previewFileType = item.previewFileType;
          }

          return itemData;
        }),
        totalPrice: total,
      };

      // Отправка на бэкенд
      // Вариант 1: JSON с base64 (если бэкенд принимает base64)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      // Вариант 2: FormData с файлами (если бэкенд требует multipart/form-data)
      // Раскомментируйте этот код, если нужен вариант с FormData:
      /*
      const formData = new FormData();
      formData.append('customer', JSON.stringify(customerData));
      formData.append('totalPrice', total.toString());
      
      items.forEach((item, index) => {
        formData.append(`items[${index}][id]`, item.id);
        formData.append(`items[${index}][type]`, item.type);
        formData.append(`items[${index}][format]`, item.format);
        formData.append(`items[${index}][quantity]`, item.quantity.toString());
        formData.append(`items[${index}][basePrice]`, item.basePrice.toString());
        formData.append(`items[${index}][specs]`, item.specs);
        formData.append(`items[${index}][totalPrice]`, item.totalPrice.toString());
        
        if (item.frontFile) {
          const blob = base64ToBlob(item.frontFile, item.frontFileType || 'image/tiff');
          const file = new File([blob], item.frontFileName || 'front.tiff', { type: item.frontFileType || 'image/tiff' });
          formData.append(`items[${index}][frontFile]`, file);
        }
        if (item.backFile) {
          const blob = base64ToBlob(item.backFile, item.backFileType || 'image/tiff');
          const file = new File([blob], item.backFileName || 'back.tiff', { type: item.backFileType || 'image/tiff' });
          formData.append(`items[${index}][backFile]`, file);
        }
        if (item.previewFile) {
          const blob = base64ToBlob(item.previewFile, item.previewFileType || 'image/jpeg');
          const file = new File([blob], item.previewFileName || 'preview.jpg', { type: item.previewFileType || 'image/jpeg' });
          formData.append(`items[${index}][previewFile]`, file);
        }
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });
      */

      if (!response.ok) {
        throw new Error('Ошибка при отправке заказа');
      }

      const result = await response.json();
      console.log('Заказ успешно отправлен:', result);

      // Очищаем корзину и перенаправляем на страницу благодарности
      clearCart();
      setIsSubmitting(false);
      alert('Заказ успешно оформлен! Спасибо за ваш заказ.');
      router.push('/');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setIsSubmitting(false);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
    }
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
                          {getTypeLabel(item.type)}
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
                        {/* Информация о файлах */}
                        {(item.frontFile || item.backFile || item.previewFile) && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs font-semibold text-[#006837] mb-1">Файлы:</p>
                            {item.frontFile && (
                              <p className="text-xs text-gray-600">
                                ✓ {item.frontFileName || 'Лицевая сторона'}
                                {item.frontFileSize && ` (${(item.frontFileSize / 1024).toFixed(1)} KB)`}
                              </p>
                            )}
                            {item.backFile && (
                              <p className="text-xs text-gray-600">
                                ✓ {item.backFileName || 'Оборотная сторона'}
                                {item.backFileSize && ` (${(item.backFileSize / 1024).toFixed(1)} KB)`}
                              </p>
                            )}
                            {item.previewFile && (
                              <p className="text-xs text-gray-600">
                                ✓ {item.previewFileName || 'Превью'}
                                {item.previewFileSize && ` (${(item.previewFileSize / 1024).toFixed(1)} KB)`}
                              </p>
                            )}
                          </div>
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

