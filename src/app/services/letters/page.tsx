"use client";
import React, { useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useCart, CartItem } from "../../../../context/CartContext";

type LetterType = "flat" | "volume";
type ViewState = "MAIN" | "OPTIONS" | "CALCULATOR";

interface LetterCard {
  id: LetterType;
  title: string;
  image: string;
}

interface LetterOption {
  id: string;
  type: LetterType;
  title: string;
  headerTitle: string;
  label: string;
  image: string;
  priceTable: {
    columns: string[];
    rows: { label: string; values: number[] }[];
  };
  colorSeries: "641" | "8500";
}

const letterCards: LetterCard[] = [
  {
    id: "flat",
    title: "ПЛОСКИЕ",
    image: "https://placehold.co/260x180/ffffff/006837?text=ABC",
  },
  {
    id: "volume",
    title: "ОБЪЕМНЫЕ",
    image: "https://placehold.co/260x180/d1d5db/006837?text=ABC",
  },
];

const letterOptions: LetterOption[] = [
  {
    id: "flat-pvc",
    type: "flat",
    title: "ПВХ",
    headerTitle: "ПВХ",
    label: "ПВХ 4 ММ",
    image: "https://placehold.co/260x180/ffffff/006837?text=ABC",
    priceTable: {
      columns: ["h 100 мм", "h 200 мм", "h 300 мм", "h 400 мм"],
      rows: [
        { label: "БЕЛЫЕ", values: [130, 360, 650, 1050] },
        { label: "ЦВЕТНЫЕ", values: [165, 520, 990, 1600] },
      ],
    },
    colorSeries: "641",
  },
  {
    id: "flat-composite",
    type: "flat",
    title: "КОМПОЗИТ",
    headerTitle: "КОМПОЗИТ",
    label: "КОМПОЗИТ",
    image: "https://placehold.co/260x180/e5e7eb/006837?text=ABC",
    priceTable: {
      columns: ["h 100 мм", "h 200 мм", "h 300 мм", "h 400 мм"],
      rows: [
        { label: "БЕЛЫЕ", values: [160, 490, 930, 1500] },
        { label: "ЦВЕТНЫЕ", values: [200, 650, 1270, 2080] },
      ],
    },
    colorSeries: "641",
  },
  {
    id: "flat-acrylic",
    type: "flat",
    title: "АКРИЛ",
    headerTitle: "АКРИЛ",
    label: "АКРИЛ",
    image: "https://placehold.co/260x180/ffffff/006837?text=ABC",
    priceTable: {
      columns: ["h 100 мм", "h 200 мм", "h 300 мм", "h 400 мм"],
      rows: [
        { label: "БЕЛЫЕ", values: [200, 650, 1270, 2080] },
        { label: "ЦВЕТНЫЕ", values: [240, 810, 1610, 2660] },
      ],
    },
    colorSeries: "641",
  },
  {
    id: "volume-non-light",
    type: "volume",
    title: "НЕ СВЕТОВЫЕ\nБЕЛЫЕ / ЦВЕТНЫЕ",
    headerTitle: "ОБЪЕМНЫЕ",
    label: "КОМПОЗИТ НЕ СВЕТОВЫЕ",
    image: "https://placehold.co/260x180/ffffff/006837?text=ABC",
    priceTable: {
      columns: ["h 100 мм", "h 200 мм", "h 300 мм", "h 400 мм"],
      rows: [
        { label: "БЕЛЫЕ", values: [490, 1280, 2350, 3750] },
        { label: "ЦВЕТНЫЕ", values: [580, 1650, 3200, 5200] },
      ],
    },
    colorSeries: "641",
  },
  {
    id: "volume-light",
    type: "volume",
    title: "СВЕТОВЫЕ\nБЕЛЫЕ / ЦВЕТНЫЕ",
    headerTitle: "ОБЪЕМНЫЕ",
    label: "АКРИЛ СВЕТОВЫЕ",
    image: "https://placehold.co/260x180/d1d5db/006837?text=ABC",
    priceTable: {
      columns: ["h 100 мм", "h 200 мм", "h 300 мм", "h 400 мм"],
      rows: [
        { label: "БЕЛЫЕ", values: [820, 2700, 5400, 9050] },
        { label: "ЦВЕТНЫЕ", values: [950, 3000, 6200, 11000] },
      ],
    },
    colorSeries: "8500",
  },
];

const letterTitles: Record<LetterType, string> = {
  flat: "ПЛОСКИЕ",
  volume: "ОБЪЕМНЫЕ",
};

const alphabetRows = ["АБВГДЕЖЗ", "ИКЛМНОПР", "СТУФХЦЧШ", "ЩЪЫЬЭЮЯ"];

const oracal641Colors = [
  { code: "010", hex: "#ffffff" },
  { code: "020", hex: "#facc15" },
  { code: "021", hex: "#f59e0b" },
  { code: "032", hex: "#ef4444" },
  { code: "035", hex: "#fb923c" },
  { code: "031", hex: "#dc2626" },
  { code: "057", hex: "#22c55e" },
  { code: "068", hex: "#16a34a" },
  { code: "066", hex: "#14b8a6" },
  { code: "050", hex: "#2563eb" },
  { code: "086", hex: "#0ea5e9" },
  { code: "098", hex: "#1f2937" },
  { code: "070", hex: "#0f766e" },
  { code: "047", hex: "#a855f7" },
  { code: "045", hex: "#7c3aed" },
  { code: "040", hex: "#f97316" },
  { code: "027", hex: "#f43f5e" },
  { code: "018", hex: "#84cc16" },
  { code: "013", hex: "#fde047" },
  { code: "060", hex: "#15803d" },
  { code: "055", hex: "#0f172a" },
  { code: "053", hex: "#1d4ed8" },
  { code: "056", hex: "#38bdf8" },
  { code: "090", hex: "#6b7280" },
];

const oracal8500Colors = [
  { code: "100", hex: "#f59e0b" },
  { code: "101", hex: "#f97316" },
  { code: "102", hex: "#ef4444" },
  { code: "103", hex: "#dc2626" },
  { code: "104", hex: "#be123c" },
  { code: "105", hex: "#db2777" },
  { code: "106", hex: "#9333ea" },
  { code: "107", hex: "#7c3aed" },
  { code: "108", hex: "#2563eb" },
  { code: "109", hex: "#0ea5e9" },
  { code: "110", hex: "#06b6d4" },
  { code: "111", hex: "#14b8a6" },
  { code: "112", hex: "#10b981" },
  { code: "113", hex: "#22c55e" },
  { code: "114", hex: "#84cc16" },
  { code: "115", hex: "#a3e635" },
  { code: "116", hex: "#fde047" },
  { code: "117", hex: "#fbbf24" },
  { code: "118", hex: "#fb7185" },
  { code: "119", hex: "#4b5563" },
  { code: "120", hex: "#111827" },
  { code: "121", hex: "#d1d5db" },
  { code: "122", hex: "#f3f4f6" },
  { code: "123", hex: "#9ca3af" },
];

const getTextColor = (hex: string) => {
  const sanitized = hex.replace("#", "");
  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 160 ? "#111111" : "#ffffff";
};

const LettersPage: React.FC = () => {
  const { addItem } = useCart();
  const [viewState, setViewState] = useState<ViewState>("MAIN");
  const [activeType, setActiveType] = useState<LetterType>("flat");
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<{
    key: string;
    price: number;
    rowLabel: string;
    columnLabel: string;
  } | null>(null);
  const [chooseLetter, setChooseLetter] = useState<boolean>(false);
  const [chooseColor, setChooseColor] = useState<boolean>(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedColorCode, setSelectedColorCode] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [checkLayout, setCheckLayout] = useState<boolean>(false);

  const activeOption = letterOptions.find((option) => option.id === activeOptionId) ?? null;
  const optionsForType = letterOptions.filter((option) => option.type === activeType);

  const handleMainView = () => {
    setViewState("MAIN");
    setActiveOptionId(null);
    setSelectedPrice(null);
    setChooseLetter(false);
    setChooseColor(false);
    setSelectedLetter(null);
    setSelectedColorCode(null);
    setDeliveryAddress("");
    setComments("");
    setCheckLayout(false);
  };

  const handleTypeSelect = (type: LetterType) => {
    setActiveType(type);
    setViewState("OPTIONS");
    const nextOption = letterOptions.find((option) => option.type === type);
    setActiveOptionId(nextOption?.id ?? null);
    setSelectedPrice(null);
    setChooseLetter(false);
    setChooseColor(false);
    setSelectedLetter(null);
    setSelectedColorCode(null);
    setDeliveryAddress("");
    setComments("");
    setCheckLayout(false);
  };

  const handleOptionSelect = (id: string) => {
    setActiveOptionId(id);
    setViewState("CALCULATOR");
    setSelectedPrice(null);
    setChooseLetter(false);
    setChooseColor(false);
    setSelectedLetter(null);
    setSelectedColorCode(null);
    setDeliveryAddress("");
    setComments("");
    setCheckLayout(false);
  };

  const handlePriceSelect = (price: number, key: string, rowLabel: string, columnLabel: string) => {
    setSelectedPrice({ price, key, rowLabel, columnLabel });
  };

  const displayUnitPrice = Math.round(selectedPrice?.price ?? 0);
  const displayTotalPrice = displayUnitPrice;

  const readyDate = new Date();
  readyDate.setDate(readyDate.getDate() + 4);
  const readyDay = readyDate.toLocaleDateString("ru-RU", { weekday: "long" });
  const readyDayCapitalized = readyDay.charAt(0).toUpperCase() + readyDay.slice(1);
  const readyDateStr = readyDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const renderActivePriceBanner = () => (
    <div
      className="w-full bg-[#00C16E] text-white py-2 px-6 font-bold text-xs uppercase flex items-center gap-2"
      style={{ clipPath: "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 2% 50%)" }}
    >
      <span className="text-base">🛒</span>
      <span>Активный прайс-лист. Для оформления заказа кликните цену.</span>
    </div>
  );

  const renderPriceTable = (option: LetterOption) => {
    const gridTemplate = `140px repeat(${option.priceTable.columns.length}, minmax(0, 1fr))`;
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[520px] border border-[#00C16E] rounded-lg overflow-hidden">
          <div className="grid text-[10px] font-bold text-white uppercase" style={{ gridTemplateColumns: gridTemplate }}>
            <div className="bg-[#00C16E] py-2 text-center">РАЗМЕР</div>
            {option.priceTable.columns.map((col) => (
              <div key={col} className="bg-[#00C16E] py-2 text-center">
                {col}
              </div>
            ))}
          </div>
          {option.priceTable.rows.map((row, rowIndex) => {
            const baseBg = rowIndex % 2 === 0 ? "bg-gray-200" : "bg-gray-100";
            return (
              <div
                key={`${option.id}-row-${row.label}`}
                className="grid text-[11px] font-bold text-[#006837]"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                <div className={`${baseBg} px-2 py-2 uppercase text-[9px]`}>{row.label}</div>
                {row.values.map((value, colIndex) => {
                  const cellKey = `${option.id}-${rowIndex}-${colIndex}`;
                  const isSelected = selectedPrice?.key === cellKey;
                  return (
                    <button
                      type="button"
                      key={cellKey}
                      onClick={() =>
                        handlePriceSelect(value, cellKey, row.label, option.priceTable.columns[colIndex])
                      }
                      className={`px-2 py-2 font-bold text-center transition-colors ${
                        isSelected
                          ? "bg-[#00C16E] text-white"
                          : `${baseBg} text-[#006837] hover:bg-[#00C16E] hover:text-white`
                      }`}
                    >
                      {value}р/шт
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSummary = () => (
    <div className="w-full lg:w-[320px] shrink-0">
      <div className="border-2 border-[#006837] rounded-xl p-5 bg-white shadow-sm">
        <h3 className="font-bold text-xl uppercase text-black mb-4">РАСЧЕТ:</h3>
        <div className="space-y-1 text-sm font-bold text-black mb-6">
          <div className="flex justify-between">
            <span>Сумма:</span>
            <span>{displayTotalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Ваша скидка:</span>
            <span>0</span>
          </div>
          <div className="flex justify-between border-b-2 border-[#006837] pb-1 mb-1">
            <span>Цена за единицу:</span>
            <span>{displayUnitPrice}</span>
          </div>
          <div className="flex justify-between text-lg mt-2">
            <span>Итого:</span>
            <span>{displayTotalPrice}</span>
          </div>
        </div>

        <div className="mb-6 text-black">
          <div className="font-bold">Готовность:</div>
          <div className="text-base font-normal">
            {readyDayCapitalized}, {readyDateStr}, 15:00
          </div>
          <div className="text-[10px] text-gray-500 leading-tight mt-1">
            Дата готовности — ориентировочная и может отличаться от фактической
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAddToCart();
          }}
          className="flex rounded-md overflow-hidden w-full"
        >
          <div className="bg-[#00C16E] text-white font-bold py-3 px-4 flex-grow flex items-center justify-center uppercase text-base">
            ОФОРМИТЬ ЗАКАЗ
          </div>
          <div className="bg-[#006837] text-white w-14 flex items-center justify-center relative">
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#00C16E] transform -skew-x-12 origin-top-left" />
            <span className="text-2xl z-10 relative">🛒</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderNotesPalette = (colors: { code: string; hex: string }[]) => (
    <div className="flex flex-col sm:flex-row gap-3 items-start">
      <div className="grid grid-cols-12 gap-1 flex-1">
        {colors.map((color) => (
          <div
            key={color.code}
            className="h-6 rounded border border-gray-300 flex items-center justify-center text-[8px] font-bold"
            style={{ backgroundColor: color.hex, color: getTextColor(color.hex) }}
          >
            {color.code}
          </div>
        ))}
      </div>
      <div className="bg-red-600 text-white uppercase text-[9px] font-bold px-2 py-2 w-[140px]">
        !ВНИМАНИЕ!
        <br />
        ЦВЕТА ПРЕДСТАВЛЕННЫЕ
        <br />
        В РАСКЛАДКЕ - ОРИЕНТИРОВОЧНЫЕ!
      </div>
    </div>
  );

  const renderSelectablePalette = (colors: { code: string; hex: string }[]) => (
    <div className="flex flex-col sm:flex-row gap-3 items-start">
      <div className="grid grid-cols-12 gap-1 flex-1">
        {colors.map((color) => {
          const isSelected = selectedColorCode === color.code;
          return (
            <button
              type="button"
              key={color.code}
              onClick={() => setSelectedColorCode(color.code)}
              className={`h-6 rounded border flex items-center justify-center text-[8px] font-bold transition-colors ${
                isSelected ? "border-[#00C16E] ring-1 ring-[#00C16E]" : "border-gray-300"
              }`}
              style={{ backgroundColor: color.hex, color: getTextColor(color.hex) }}
            >
              {color.code}
            </button>
          );
        })}
      </div>
      <div className="bg-red-600 text-white uppercase text-[9px] font-bold px-2 py-2 w-[140px]">
        !ВНИМАНИЕ!
        <br />
        ЦВЕТА ПРЕДСТАВЛЕННЫЕ
        <br />
        В РАСКЛАДКЕ - ОРИЕНТИРОВОЧНЫЕ!
      </div>
    </div>
  );

  const renderAlphabet = () => (
    <div className="space-y-1 text-3xl font-black text-black" style={{ fontFamily: "Arial Black, Arial, sans-serif" }}>
      {alphabetRows.map((row) => (
        <div key={row} className="tracking-wider">
          {row}
        </div>
      ))}
    </div>
  );

  const renderAlphabetSelector = () => (
    <div className="space-y-2 text-3xl font-black" style={{ fontFamily: "Arial Black, Arial, sans-serif" }}>
      {alphabetRows.map((row) => (
        <div key={row} className="flex flex-wrap gap-2">
          {Array.from(row).map((letter) => {
            const isSelected = selectedLetter === letter;
            return (
              <button
                type="button"
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`leading-none transition-colors ${
                  isSelected ? "text-[#00C16E]" : "text-black"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  const handleAddToCart = async () => {
    if (!activeOption || !selectedPrice) {
      alert("Выберите параметры для расчета стоимости.");
      return;
    }

    try {
      const specsParts: string[] = [
        letterTitles[activeType],
        activeOption.label,
        selectedPrice.rowLabel,
        selectedPrice.columnLabel,
      ];

      if (chooseLetter && selectedLetter) {
        specsParts.push(`Буква: ${selectedLetter}`);
      }
      if (chooseColor && selectedColorCode) {
        specsParts.push(`Цвет: ${selectedColorCode} (оракал ${activeOption.colorSeries})`);
      }

      const cartItem: CartItem = {
        id: `letters-${activeOption.id}-${Date.now()}`,
        type: "LETTERS",
        format: selectedPrice.columnLabel,
        quantity: 1,
        basePrice: displayUnitPrice,
        specs: specsParts.filter(Boolean).join(" / "),
        totalPrice: displayTotalPrice,
        deliveryAddress: deliveryAddress || undefined,
        comments: comments || undefined,
        checkLayout: checkLayout || undefined,
        readyDate: `${readyDayCapitalized}, ${readyDateStr}`,
        readyTime: "15:00",
      };

      addItem(cartItem);
      alert("Товар добавлен в корзину!");
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину:", error);
      alert("Произошла ошибка при добавлении товара в корзину. Пожалуйста, попробуйте еще раз.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="max-w-[1300px] w-full mx-auto px-4 py-8 flex-grow">
        <div className="flex w-full mb-10 h-16">
          <button
            type="button"
            onClick={handleMainView}
            className="relative bg-[#00C16E] text-white font-bold text-sm sm:text-lg px-4 sm:px-8 flex items-center h-full z-10 w-fit shrink-0 uppercase leading-tight"
          >
            БУКВЫ
            <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent" />
          </button>
          <div className="bg-[#006837] flex-grow flex items-center px-8 sm:px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-12 sm:pl-16">
            {viewState === "MAIN"
              ? "БУКВЫ"
              : viewState === "OPTIONS"
                ? letterTitles[activeType]
                : activeOption?.headerTitle ?? letterTitles[activeType]}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          <div className="w-full lg:w-[220px] shrink-0 text-[#006837] font-bold uppercase text-lg leading-relaxed flex flex-col gap-3">
            {letterCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleTypeSelect(card.id)}
                className={`text-left transition-colors ${
                  activeType === card.id ? "text-[#00C16E]" : "text-[#006837]"
                }`}
              >
                {card.title}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {viewState === "MAIN" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {letterCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleTypeSelect(card.id)}
                    className="flex flex-col items-start gap-2 text-left group"
                  >
                    <div
                      className={`border-2 rounded-lg bg-white w-full aspect-[4/3] flex items-center justify-center transition-colors ${
                        activeType === card.id ? "border-[#00C16E]" : "border-[#006837]"
                      }`}
                    >
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                    </div>
                    <div
                      className={`text-xs font-bold uppercase transition-colors ${
                        activeType === card.id ? "text-[#00C16E]" : "text-[#006837]"
                      }`}
                    >
                      {card.title}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {viewState === "OPTIONS" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {optionsForType.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    className="flex flex-col items-start gap-2 text-left group"
                  >
                    <div
                      className={`border-2 rounded-lg bg-white w-full aspect-[4/3] flex items-center justify-center transition-colors ${
                        activeOptionId === option.id ? "border-[#00C16E]" : "border-[#006837]"
                      }`}
                    >
                      <img src={option.image} alt={option.title} className="w-full h-full object-cover" />
                    </div>
                    <div
                      className={`text-xs font-bold uppercase whitespace-pre-line transition-colors ${
                        activeOptionId === option.id ? "text-[#00C16E]" : "text-[#006837]"
                      }`}
                    >
                      {option.title}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {viewState === "CALCULATOR" && activeOption && (
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
                    <div className="flex flex-col items-start gap-3">
                      <div className="w-[200px] h-[160px] border-2 border-[#006837] rounded-lg bg-white flex items-center justify-center">
                        <img src={activeOption.image} alt={activeOption.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs font-bold uppercase text-[#006837]">{activeOption.label}</div>
                    </div>
                    <div className="space-y-4">
                      {renderPriceTable(activeOption)}
                      {renderActivePriceBanner()}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={chooseLetter}
                        onChange={(e) => setChooseLetter(e.target.checked)}
                        className="w-5 h-5 border-2 border-[#006837] rounded accent-[#006837]"
                      />
                      <span className="text-xs font-bold uppercase text-[#006837]">
                        ВЫБОР БУКВЫ (алфавит от А до Я)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={chooseColor}
                        onChange={(e) => setChooseColor(e.target.checked)}
                        className="w-5 h-5 border-2 border-[#006837] rounded accent-[#006837]"
                      />
                      <span className="text-xs font-bold uppercase text-[#006837]">
                        ВЫБОР ЦВЕТА (оракал {activeOption.colorSeries})
                      </span>
                    </div>
                  </div>

                  {chooseColor && (
                    <div className="space-y-2">
                      {renderSelectablePalette(
                        activeOption.colorSeries === "8500" ? oracal8500Colors : oracal641Colors,
                      )}
                    </div>
                  )}

                  {chooseLetter && (
                    <div className="space-y-2">
                      {renderAlphabetSelector()}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-4 gap-x-8">
                    <div className="hidden md:flex flex-col gap-6 font-bold text-[#006837] uppercase text-sm mt-1">
                      <div className="h-10 flex items-center">СПОСОБ ДОСТАВКИ</div>
                      <div className="h-10 flex items-center">
                        КОММЕНТАРИИ
                        <br />
                        К ЗАКАЗУ
                      </div>
                    </div>
                    <div className="space-y-4 w-full max-w-[420px]">
                      <div>
                        <span className="md:hidden font-bold uppercase text-xs text-[#006837]">СПОСОБ ДОСТАВКИ</span>
                        <input
                          type="text"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="border-2 border-[#006837] rounded-xl w-full h-10 px-3 focus:outline-none text-black"
                        />
                      </div>
                      <div>
                        <span className="md:hidden font-bold uppercase text-xs text-[#006837]">КОММЕНТАРИИ К ЗАКАЗУ</span>
                        <input
                          type="text"
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                          className="border-2 border-[#006837] rounded-xl w-full h-10 px-3 focus:outline-none text-black"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          checked={checkLayout}
                          onChange={(e) => setCheckLayout(e.target.checked)}
                          className="w-5 h-5 border-2 border-[#006837] rounded accent-[#006837]"
                        />
                        <span className="text-xs font-bold text-black">
                          Проверить макет на соответствие требований к печати
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {renderSummary()}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LettersPage;
