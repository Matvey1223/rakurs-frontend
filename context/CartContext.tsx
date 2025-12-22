"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Типы для товара в корзине
export interface CartItem {
  id: string;
  type: 'VIZITKI' | 'FLAERS' | string;
  format: string;
  quantity: number;
  basePrice: number;
  specs: string;
  // Дополнительные опции
  creasing?: number;
  folding?: boolean;
  extraCut?: number;
  holes?: number;
  rounding?: number;
  eyelets?: number;
  eyeletColor?: string;
  deliveryAddress?: string;
  comments?: string;
  checkLayout?: boolean;
  // Файлы - хранятся как base64 для localStorage
  frontFile?: string; // base64 строка для localStorage
  backFile?: string; // base64 строка для localStorage
  previewFile?: string; // base64 строка для localStorage
  // Метаданные файлов (имя, размер, тип)
  frontFileName?: string;
  backFileName?: string;
  previewFileName?: string;
  frontFileSize?: number;
  backFileSize?: number;
  previewFileSize?: number;
  frontFileType?: string;
  backFileType?: string;
  previewFileType?: string;
  // Дата готовности
  readyDate?: string;
  readyTime?: string;
  // Итоговая цена
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Ключ для localStorage
const CART_STORAGE_KEY = 'rakurs_cart';

// Функция для загрузки корзины из localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Ошибка при загрузке корзины из localStorage:', error);
  }
  return [];
};

// Функция для сохранения корзины в localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Ошибка при сохранении корзины в localStorage:', error);
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Загружаем корзину из localStorage при инициализации
  const [items, setItems] = useState<CartItem[]>([]);

  // Загружаем данные из localStorage при монтировании компонента
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    if (savedItems.length > 0) {
      setItems(savedItems);
    }
  }, []);

  // Сохраняем корзину в localStorage при каждом изменении
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const newItems = [...prev, item];
      return newItems;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    // Очищаем localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getItemsCount = () => {
    return items.length;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        getTotalPrice,
        getItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

