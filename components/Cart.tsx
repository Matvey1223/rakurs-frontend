"use client"
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { COLORS } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, getTotalPrice, clearCart } = useCart();
  const total = getTotalPrice();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-[#006837] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold uppercase">Корзина</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-[#00C16E] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-lg font-semibold">Корзина пуста</p>
              <p className="text-sm mt-2">Добавьте товары для оформления заказа</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#00C16E] transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-[#006837] uppercase text-sm">
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
                      {item.extraCut && item.extraCut > 0 && (
                        <p className="text-xs text-gray-500">Доп. рез: да</p>
                      )}
                      {item.holes && item.holes > 0 && (
                        <p className="text-xs text-gray-500">Отверстия: {item.holes}</p>
                      )}
                      {item.rounding && item.rounding > 0 && (
                        <p className="text-xs text-gray-500">Скругление: {item.rounding}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Цена:</span>
                    <span className="font-bold text-[#006837]">{item.totalPrice} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Actions */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-[#006837]">Итого:</span>
              <span className="text-2xl font-bold text-[#006837]">{total} ₽</span>
            </div>
            <div className="space-y-2">
              <a
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-[#00C16E] text-white font-bold py-3 px-4 rounded-lg text-center uppercase hover:bg-[#00a85a] transition-colors"
              >
                Оформить заказ
              </a>
              <button
                onClick={clearCart}
                className="block w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg text-center hover:bg-gray-300 transition-colors"
              >
                Очистить корзину
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;

