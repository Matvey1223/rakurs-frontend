"use client";
import React, { useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useCart, CartItem } from "../../../../context/CartContext";

type GraphicType = "stacked" | "rect" | "shield" | "oval" | "arch" | "capsule";
type ViewState = "MAIN" | "CALCULATOR";

interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

interface AddressSize {
  id: string;
  size: string;
  type: GraphicType;
  title: string;
  number: string;
  subtitle?: string;
  formNote: string;
  prices: number[];
}

const materialColumns = [
  "ПВХ + ОРАКАЛ\n+ ЛАМИНАЦИЯ",
  "КОМПОЗИТ + ОРАКАЛ\n+ ЛАМИНАЦИЯ",
  "КОМПОЗИТ +\nПЛОТТЕРНАЯ ПОРЕЗКА",
  "АКРИЛ +\nПЛОТТЕРНАЯ ПОРЕЗКА",
  "КОМПОЗИТ +\nУФ ПЕЧАТЬ",
  "АКРИЛ +\nУФ ПЕЧАТЬ",
];

const addressColors: ColorOption[] = [
  { id: "black", name: "черный", hex: "#111111" },
  { id: "orange", name: "оранжевый", hex: "#f97316" },
  { id: "purple", name: "фиолетовый", hex: "#7c3aed" },
  { id: "green", name: "зеленый", hex: "#16a34a" },
  { id: "teal", name: "бирюза", hex: "#14b8a6" },
  { id: "yellow", name: "желтый", hex: "#facc15" },
  { id: "red", name: "красный", hex: "#dc2626" },
  { id: "white", name: "белый", hex: "#ffffff" },
];

const addressSizes: AddressSize[] = [
  {
    id: "800x225",
    size: "800 x 225 мм",
    type: "stacked",
    title: "Романовка",
    number: "15",
    formNote: "на фото тип 1/2/3/4",
    prices: [1050, 1350, 1555, 1700, 1325, 1885],
  },
  {
    id: "800x200",
    size: "800 x 200 мм",
    type: "rect",
    title: "ул. 8 Марта",
    number: "73",
    formNote: "на фото",
    prices: [975, 1235, 1420, 1550, 1200, 1695],
  },
  {
    id: "500x460",
    size: "500 x 460 мм",
    type: "shield",
    title: "Лихачева",
    number: "47",
    formNote: "на фото",
    prices: [1310, 1750, 2010, 2210, 1750, 1950],
  },
  {
    id: "500x500",
    size: "500 x 500 мм",
    type: "shield",
    title: "Булгакова",
    number: "51",
    formNote: "на фото",
    prices: [1310, 1750, 2010, 2210, 1750, 1950],
  },
  {
    id: "450x526",
    size: "450 x 526 мм",
    type: "oval",
    title: "Улица",
    number: "26",
    subtitle: "Гурдятова",
    formNote: "на фото",
    prices: [1310, 1750, 2010, 2210, 1750, 1950],
  },
  {
    id: "700x400",
    size: "700 x 400 мм",
    type: "rect",
    title: "Столярная",
    number: "19",
    formNote: "на фото",
    prices: [1435, 1895, 2220, 2440, 1970, 2840],
  },
  {
    id: "840x300",
    size: "840 x 300 мм",
    type: "capsule",
    title: "Менделеева",
    number: "15",
    formNote: "на фото",
    prices: [1375, 1800, 2105, 2315, 1840, 2650],
  },
  {
    id: "740x435",
    size: "740 x 435 мм",
    type: "arch",
    title: "Воровского",
    number: "56",
    formNote: "на фото",
    prices: [1615, 2150, 2510, 2770, 2215, 3200],
  },
  {
    id: "800x400",
    size: "800 x 400 мм",
    type: "rect",
    title: "Карпова",
    number: "85",
    subtitle: "бульвар",
    formNote: "на фото",
    prices: [1615, 2150, 2510, 2770, 2215, 3200],
  },
  {
    id: "800x520",
    size: "800 x 520 мм",
    type: "arch",
    title: "Калугина",
    number: "48",
    subtitle: "бульвар",
    formNote: "на фото",
    prices: [1615, 2150, 2510, 2770, 2215, 3200],
  },
  {
    id: "450x300",
    size: "450 x 300 мм",
    type: "shield",
    title: "Энергетиков",
    number: "62",
    subtitle: "пр-т",
    formNote: "на фото",
    prices: [830, 1060, 1220, 1330, 1010, 1440],
  },
];

const AddressGraphic: React.FC<{
  type: GraphicType;
  title: string;
  number: string;
  subtitle?: string;
}> = ({ type, title, number, subtitle }) => {
  const commonText = "fill-[#00C16E] font-bold uppercase";

  if (type === "stacked") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 px-4">
        {["тип 1", "тип 2", "тип 3", "тип 4"].map((label, index) => (
          <div
            key={label}
            className="w-full border-2 border-[#00C16E] rounded-md py-1 text-center"
          >
            <div className="text-[8px] text-[#00C16E] font-bold uppercase">{label}</div>
            <div className="text-[10px] text-[#00C16E] font-bold uppercase">
              {title}, {number}
            </div>
            {index === 1 && (
              <div className="text-[8px] text-[#00C16E] font-bold uppercase">Чекистов, 27</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (type === "rect") {
    return (
      <div className="w-[80%] h-[65%] border-2 border-[#00C16E] rounded-md flex flex-col items-center justify-center gap-1">
        {subtitle && <div className={`text-[9px] ${commonText}`}>{subtitle}</div>}
        <div className={`text-[12px] ${commonText}`}>{title}</div>
        <div className={`text-[20px] ${commonText}`}>{number}</div>
      </div>
    );
  }

  if (type === "oval") {
    return (
      <svg className="w-[85%] h-[70%]" viewBox="0 0 200 120">
        <ellipse cx="100" cy="60" rx="90" ry="50" fill="none" stroke="#00C16E" strokeWidth="6" />
        <text x="100" y="38" textAnchor="middle" className={`text-[12px] ${commonText}`}>
          {title}
        </text>
        <text x="100" y="74" textAnchor="middle" className={`text-[28px] ${commonText}`}>
          {number}
        </text>
        {subtitle && (
          <text x="100" y="100" textAnchor="middle" className={`text-[12px] ${commonText}`}>
            {subtitle}
          </text>
        )}
      </svg>
    );
  }

  if (type === "capsule") {
    return (
      <div className="w-[85%] h-[45%] border-2 border-[#00C16E] rounded-full flex flex-col items-center justify-center gap-1">
        <div className={`text-[10px] ${commonText}`}>{number}</div>
        <div className={`text-[12px] ${commonText}`}>{title}</div>
      </div>
    );
  }

  if (type === "arch") {
    return (
      <svg className="w-[85%] h-[75%]" viewBox="0 0 220 150">
        <path
          d="M20 130V70c0-35 30-55 90-55s90 20 90 55v60H20z"
          fill="none"
          stroke="#00C16E"
          strokeWidth="6"
        />
        <text x="110" y="70" textAnchor="middle" className={`text-[12px] ${commonText}`}>
          {subtitle ?? "улица"}
        </text>
        <text x="110" y="110" textAnchor="middle" className={`text-[32px] ${commonText}`}>
          {number}
        </text>
      </svg>
    );
  }

  return (
    <svg className="w-[80%] h-[75%]" viewBox="0 0 200 160">
      <path
        d="M100 10l70 30v40c0 40-30 60-70 75-40-15-70-35-70-75V40l70-30z"
        fill="none"
        stroke="#00C16E"
        strokeWidth="6"
      />
      {subtitle && (
        <text x="100" y="50" textAnchor="middle" className={`text-[10px] ${commonText}`}>
          {subtitle}
        </text>
      )}
      <text x="100" y="70" textAnchor="middle" className={`text-[12px] ${commonText}`}>
        {title}
      </text>
      <text x="100" y="115" textAnchor="middle" className={`text-[36px] ${commonText}`}>
        {number}
      </text>
    </svg>
  );
};

const AddressSignsPage: React.FC = () => {
  const { addItem } = useCart();
  const [viewState, setViewState] = useState<ViewState>("MAIN");
  const [activeSizeId, setActiveSizeId] = useState<string>(addressSizes[0]?.id ?? "");
  const [selectedPrice, setSelectedPrice] = useState<{
    key: string;
    label: string;
    price: number;
  } | null>(null);
  const [colorEnabled, setColorEnabled] = useState<boolean>(false);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [checkLayout, setCheckLayout] = useState<boolean>(false);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const activeSize = addressSizes.find((size) => size.id === activeSizeId) ?? addressSizes[0];

  const resetForm = () => {
    setSelectedPrice(null);
    setColorEnabled(false);
    setSelectedColorId(null);
    setDeliveryAddress("");
    setComments("");
    setCheckLayout(false);
    setFrontFile(null);
    setPreviewFile(null);
  };

  const handleMainView = () => {
    setViewState("MAIN");
    resetForm();
    window.scrollTo(0, 0);
  };

  const handleSizeSelect = (id: string) => {
    setActiveSizeId(id);
    setViewState("CALCULATOR");
    resetForm();
    window.scrollTo(0, 0);
  };

  const handlePriceSelect = (price: number, key: string, label: string) => {
    setSelectedPrice({ price, key, label });
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddToCart = async () => {
    if (!activeSize || !selectedPrice) {
      alert("Выберите материал для расчета стоимости.");
      return;
    }

    try {
      let frontFileBase64: string | undefined;
      let previewFileBase64: string | undefined;

      try {
        if (frontFile) {
          frontFileBase64 = await fileToBase64(frontFile);
        }
        if (previewFile) {
          previewFileBase64 = await fileToBase64(previewFile);
        }
      } catch (fileError) {
        console.error("Ошибка при конвертации файлов:", fileError);
        alert("Ошибка при обработке файлов. Товар будет добавлен без файлов.");
      }

      const colorName = selectedColorId
        ? addressColors.find((color) => color.id === selectedColorId)?.name ?? selectedColorId
        : "";
      const specsParts = [selectedPrice.label];
      if (colorEnabled && colorName) {
        specsParts.push(`Цвет: ${colorName}`);
      }

      const cartItem: CartItem = {
        id: `address-${activeSize.id}-${Date.now()}`,
        type: "ADDRESS_SIGNS",
        format: activeSize.size,
        quantity: 1,
        basePrice: displayUnitPrice,
        specs: specsParts.filter(Boolean).join(" / "),
        totalPrice: displayTotalPrice,
        deliveryAddress: deliveryAddress || undefined,
        comments: comments || undefined,
        checkLayout: checkLayout || undefined,
        readyDate: `${readyDayCapitalized}, ${readyDateStr}`,
        readyTime: "15:00",
        frontFile: frontFileBase64,
        previewFile: previewFileBase64,
        frontFileName: frontFile?.name,
        previewFileName: previewFile?.name,
        frontFileSize: frontFile?.size,
        previewFileSize: previewFile?.size,
        frontFileType: frontFile?.type,
        previewFileType: previewFile?.type,
      };

      addItem(cartItem);
      alert("Товар добавлен в корзину!");
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину:", error);
      alert("Произошла ошибка при добавлении товара в корзину. Пожалуйста, попробуйте еще раз.");
    }
  };

  const renderActivePriceBanner = () => (
    <div
      className="w-full bg-[#00C16E] text-white py-2 px-6 font-bold text-xs uppercase flex items-center gap-2"
      style={{
        clipPath: "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 2% 50%)",
      }}
    >
      <span className="text-base">🛒</span>
      <span>Активный прайс-лист. Для оформления заказа кликните цену.</span>
    </div>
  );

  const renderMaterialTable = (size: AddressSize) => {
    const gridTemplate = `200px repeat(${materialColumns.length}, minmax(0, 1fr))`;
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[760px] border border-[#00C16E] rounded-lg overflow-hidden">
          <div className="grid text-[10px] font-bold text-white uppercase" style={{ gridTemplateColumns: gridTemplate }}>
            <div className="bg-[#00C16E] py-2 text-center">МАТЕРИАЛ</div>
            {materialColumns.map((column) => (
              <div key={column} className="bg-[#00C16E] py-2 px-2 text-center whitespace-pre-line">
                {column}
              </div>
            ))}
          </div>
          <div className="grid text-[11px] font-bold text-[#006837]" style={{ gridTemplateColumns: gridTemplate }}>
            <div className="bg-[#dff3e7] px-2 py-2 uppercase whitespace-pre-line text-[9px]">
              ФОРМА ТАБЛИЧКИ
              <span className="block text-[8px] font-normal normal-case">{size.formNote}</span>
            </div>
            {size.prices.map((price, index) => {
              const cellKey = `${size.id}-${index}`;
              const isSelected = selectedPrice?.key === cellKey;
              return (
                <button
                  type="button"
                  key={cellKey}
                  onClick={() => handlePriceSelect(price, cellKey, materialColumns[index])}
                  className={`px-2 py-2 font-bold text-center transition-colors ${
                    isSelected
                      ? "bg-[#00C16E] text-white"
                      : "bg-[#dff3e7] text-[#006837] hover:bg-[#00C16E] hover:text-white"
                  }`}
                >
                  {price}р/шт
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderColorPalette = () => (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
      {addressColors.map((color) => {
        const isSelected = selectedColorId === color.id;
        return (
          <button
            type="button"
            key={color.id}
            onClick={() => setSelectedColorId(color.id)}
            className="flex flex-col items-center gap-1"
          >
            <span
              className={`w-7 h-7 rounded border-2 ${isSelected ? "border-[#00C16E]" : "border-[#006837]"}`}
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-[8px] uppercase font-bold text-[#006837]">{color.name}</span>
          </button>
        );
      })}
    </div>
  );

  const renderUploadBlock = () => (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-4 gap-x-8 mt-8">
      <div className="md:contents">
        <div className="hidden md:flex items-center font-bold text-[#006837] uppercase text-sm">
          ЗАГРУЗИТЕ МАКЕТ
        </div>
        <div className="flex flex-col gap-1 w-full max-w-[480px]">
          <span className="md:hidden font-bold uppercase text-xs text-[#006837]">ЗАГРУЗИТЕ МАКЕТ</span>
          <label className="cursor-pointer">
            <div
              className={`border-2 ${
                frontFile ? "border-[#00C16E] bg-[#f0fff8]" : "border-[#006837]"
              } rounded bg-white px-4 py-1 flex items-center gap-2 hover:bg-green-50 transition-colors w-fit min-w-[140px]`}
            >
              <span className="text-xl font-bold pb-1 text-[#006837]">📥</span>
              <span className="font-bold uppercase text-sm text-[#006837]">
                {frontFile ? "✓ ЗАГРУЖЕНО" : "ЗАГРУЗИТЬ"}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".eps,.pdf"
              onChange={(e) => setFrontFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <span className="text-[9px] font-bold text-[#006837] uppercase">ФОРМАТ EPS / PDF</span>
          {frontFile && (
            <span className="text-[9px] text-[#00C16E] font-semibold block truncate max-w-full">
              {frontFile.name}
            </span>
          )}
        </div>
      </div>

      <div className="md:contents">
        <div className="hidden md:flex items-center font-bold text-[#006837] uppercase text-sm">
          ПРЕВЬЮ МАКЕТА
        </div>
        <div className="flex flex-col gap-1 w-full max-w-[480px]">
          <span className="md:hidden font-bold uppercase text-xs text-[#006837]">ПРЕВЬЮ МАКЕТА</span>
          <label className="cursor-pointer">
            <div
              className={`border-2 ${
                previewFile ? "border-[#00C16E] bg-[#f0fff8]" : "border-[#006837]"
              } rounded bg-white px-4 py-1 flex items-center gap-2 hover:bg-green-50 transition-colors w-fit min-w-[140px]`}
            >
              <span className="text-xl font-bold pb-1 text-[#006837]">📥</span>
              <span className="font-bold uppercase text-sm text-[#006837]">
                {previewFile ? "✓ ЗАГРУЖЕНО" : "ЗАГРУЗИТЬ"}
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg"
              onChange={(e) => setPreviewFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <span className="text-[9px] font-bold text-[#006837] uppercase">ФОРМАТ JPEG</span>
          {previewFile && (
            <span className="text-[9px] text-[#00C16E] font-semibold block truncate max-w-full">
              {previewFile.name}
            </span>
          )}
        </div>
      </div>

      <div className="md:contents">
        <div className="hidden md:flex items-center font-bold text-[#006837] uppercase text-sm">
          СПОСОБ ДОСТАВКИ
        </div>
        <div className="w-full max-w-[480px]">
          <span className="md:hidden font-bold uppercase text-xs text-[#006837]">СПОСОБ ДОСТАВКИ</span>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="border-2 border-[#006837] rounded-xl w-full h-10 px-3 focus:outline-none text-black"
          />
        </div>
      </div>

      <div className="md:contents">
        <div className="hidden md:flex items-center font-bold text-[#006837] uppercase text-sm">
          КОММЕНТАРИИ
          <br />
          К ЗАКАЗУ
        </div>
        <div className="w-full max-w-[480px]">
          <span className="md:hidden font-bold uppercase text-xs text-[#006837]">КОММЕНТАРИИ К ЗАКАЗУ</span>
          <input
            type="text"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="border-2 border-[#006837] rounded-xl w-full h-10 px-3 focus:outline-none text-black"
          />
        </div>
      </div>

      <div className="md:col-span-2 flex items-center gap-2 pt-2">
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
  );

  const renderSummary = (fullWidth = false) => (
    <div className={fullWidth ? "w-full" : "w-full lg:w-[320px] shrink-0"}>
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
            <div
              className="bg-[#00C16E] text-white font-bold py-3 px-4 flex-grow flex items-center justify-center uppercase text-base relative z-10 -mr-4"
              style={{
                clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)",
              }}
            >
              ОФОРМИТЬ ЗАКАЗ
            </div>
            <div className="bg-[#006837] text-white w-16 flex items-center justify-center">
              <img src="/cart.svg" alt="Корзина" className="w-7 h-7" />
            </div>
          </button>
        </div>
      </div>
    );

  const renderMainView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
      {addressSizes.map((size) => (
        <button
          key={size.id}
          type="button"
          onClick={() => handleSizeSelect(size.id)}
          className="flex flex-col items-start gap-2 text-left group"
        >
          <div className="border-2 border-[#006837] rounded-lg bg-white w-full aspect-[4/3] flex items-center justify-center group-hover:border-[#00C16E] transition-colors">
            <AddressGraphic type={size.type} title={size.title} number={size.number} subtitle={size.subtitle} />
          </div>
          <div className="text-xs font-bold uppercase text-[#006837] group-hover:text-[#00C16E] transition-colors">
            {size.size}
          </div>
        </button>
      ))}
    </div>
  );

  const renderCalculatorView = () => {
    if (!activeSize) return null;
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
            <div className="flex flex-col items-start gap-3">
              <div className="w-[200px] h-[160px] border-2 border-[#006837] rounded-lg bg-white flex items-center justify-center">
                <AddressGraphic
                  type={activeSize.type}
                  title={activeSize.title}
                  number={activeSize.number}
                  subtitle={activeSize.subtitle}
                />
              </div>
              <div className="text-xs font-bold uppercase text-[#006837]">{activeSize.size}</div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-4">
                  {renderMaterialTable(activeSize)}
                  {renderActivePriceBanner()}
                </div>
                <div className="lg:pt-8" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={colorEnabled}
                onChange={(e) => setColorEnabled(e.target.checked)}
                className="w-5 h-5 border-2 border-[#006837] rounded accent-[#006837]"
              />
              <span className="text-xs font-bold uppercase text-[#006837]">ВЫБОР ЦВЕТА</span>
              <span className="text-xs text-[#006837]">▼</span>
            </div>
            {colorEnabled && renderColorPalette()}
          </div>

          {renderUploadBlock()}
        </div>

        {renderSummary(true)}
      </div>
    );
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
            АДРЕСНЫЕ
            <br />
            ТАБЛИЧКИ
            <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent" />
          </button>
          <div className="bg-[#006837] flex-grow flex items-center px-8 sm:px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-12 sm:pl-16">
            {viewState === "MAIN" ? "АДРЕСНЫЕ ТАБЛИЧКИ" : activeSize?.size}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 mb-12">
          <div className="w-full lg:w-[220px] shrink-0 text-[#006837] font-bold uppercase text-lg leading-relaxed flex flex-col gap-2">
            {addressSizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => handleSizeSelect(size.id)}
                className={`text-left transition-colors ${
                  activeSizeId === size.id ? "text-[#00C16E]" : "text-[#006837]"
                }`}
              >
                {size.size}
              </button>
            ))}
          </div>

          <div className="flex-1">{viewState === "MAIN" ? renderMainView() : renderCalculatorView()}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddressSignsPage;
