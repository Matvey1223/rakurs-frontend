"use client";
import React, { useState } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useCart, CartItem } from "../../../../context/CartContext";

type ViewState = "MAIN" | "CATEGORY" | "CALCULATOR";
type SouvenirCategoryId =
  | "pens"
  | "mugs"
  | "paintings"
  | "magnets"
  | "diaries"
  | "notebooks"
  | "puzzles"
  | "keychains"
  | "badges"
  | "lanyards";
type CalculatorType =
  | "pen"
  | "mug-white"
  | "mug-color"
  | "painting"
  | "magnet"
  | "diary"
  | "notebook"
  | "puzzle"
  | "keychain"
  | "badge"
  | "lanyard";
type PriceTableValue = number | string;

interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

interface PriceListItem {
  label: string;
  price: number;
}

interface PriceTableRow {
  label: string;
  values: PriceTableValue[];
}

interface PriceTable {
  columns: string[];
  rows: PriceTableRow[];
}

interface CalculatorConfig {
  type: CalculatorType;
  basePrice?: number;
  colors?: ColorOption[];
  priceList?: PriceListItem[];
  priceTable?: PriceTable;
  applyMethods?: string[];
}

interface SouvenirVariant {
  id: string;
  title: string;
  image: string;
  calculator: CalculatorConfig;
}

interface SouvenirCategory {
  id: SouvenirCategoryId;
  title: string;
  icon: React.FC;
  variants: SouvenirVariant[];
}

const iconProps = {
  width: 72,
  height: 72,
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const PenIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M10 54l10-2 32-32-8-8-32 32-2 10z" />
    <path d="M36 8l8 8" />
  </svg>
);

const MugIcon: React.FC = () => (
  <svg {...iconProps}>
    <rect x="14" y="16" width="28" height="32" rx="4" />
    <path d="M42 20h6a10 10 0 0 1 0 20h-6" />
    <path d="M14 16h28" />
  </svg>
);

const CanvasIcon: React.FC = () => (
  <svg {...iconProps}>
    <rect x="12" y="10" width="40" height="44" rx="3" />
    <rect x="18" y="16" width="28" height="32" rx="2" />
    <path d="M22 42l8-10 6 8 6-6" />
  </svg>
);

const MagnetIcon: React.FC = () => (
  <svg {...iconProps}>
    <rect x="12" y="14" width="34" height="36" rx="3" />
    <path d="M38 22h10v20H38z" />
    <path d="M18 22h10v20H18z" />
  </svg>
);

const DiaryIcon: React.FC = () => (
  <svg {...iconProps}>
    <rect x="14" y="10" width="36" height="44" rx="3" />
    <path d="M22 10v44" />
    <path d="M26 20h18M26 28h18M26 36h18" />
  </svg>
);

const NotebookIcon: React.FC = () => (
  <svg {...iconProps}>
    <rect x="18" y="10" width="32" height="44" rx="3" />
    <path d="M14 14v36" />
    <path d="M12 16h4M12 22h4M12 28h4M12 34h4M12 40h4" />
  </svg>
);

const PuzzleIcon: React.FC = () => (
  <svg {...iconProps}>
    <path d="M20 20h8a4 4 0 0 0 8 0h8v8a4 4 0 0 0 0 8v8h-8a4 4 0 0 0-8 0h-8v-8a4 4 0 0 0 0-8z" />
  </svg>
);

const KeychainIcon: React.FC = () => (
  <svg {...iconProps}>
    <circle cx="20" cy="20" r="8" />
    <path d="M26 26l10 10" />
    <rect x="34" y="34" width="16" height="18" rx="3" />
  </svg>
);

const BadgeIcon: React.FC = () => (
  <svg {...iconProps}>
    <circle cx="32" cy="28" r="14" />
    <path d="M18 40l6 12 8-6 8 6 6-12" />
  </svg>
);

const LanyardIcon: React.FC = () => (
  <svg {...iconProps}>
    <rect x="20" y="22" width="24" height="30" rx="3" />
    <path d="M28 22v-6a4 4 0 0 1 8 0v6" />
    <path d="M24 30h16M24 36h16" />
  </svg>
);

const penColorsFull: ColorOption[] = [
  { id: "white", name: "белая", hex: "#ffffff" },
  { id: "black", name: "черная", hex: "#1f2937" },
  { id: "blue", name: "синяя", hex: "#2563eb" },
  { id: "red", name: "красная", hex: "#dc2626" },
  { id: "silver", name: "серебро", hex: "#9ca3af" },
  { id: "green", name: "зеленая", hex: "#16a34a" },
  { id: "orange", name: "оранжевая", hex: "#f97316" },
];

const penColorsShort: ColorOption[] = [
  { id: "white", name: "белая", hex: "#ffffff" },
  { id: "black", name: "черная", hex: "#1f2937" },
  { id: "blue", name: "синяя", hex: "#2563eb" },
  { id: "red", name: "красная", hex: "#dc2626" },
];

const mugColors: ColorOption[] = [
  { id: "beige", name: "бежевый", hex: "#d6b89f" },
  { id: "brown", name: "коричневый", hex: "#4b2e2b" },
  { id: "blue", name: "синий", hex: "#0b4f6c" },
  { id: "teal", name: "бирюза", hex: "#5f8575" },
  { id: "navy", name: "темно-синий", hex: "#13294b" },
  { id: "black", name: "черный", hex: "#111111" },
  { id: "purple", name: "фиолетовый", hex: "#4b3b4f" },
  { id: "yellow", name: "желтый", hex: "#e2c14e" },
  { id: "red", name: "красный", hex: "#b91c1c" },
  { id: "orange", name: "оранжевый", hex: "#d97706" },
  { id: "pink", name: "розовый", hex: "#d082a7" },
  { id: "green", name: "зеленый", hex: "#5b8f2d" },
  { id: "emerald", name: "изумруд", hex: "#0f766e" },
  { id: "wine", name: "бордовый", hex: "#4c0519" },
];

const paintingPrices: PriceListItem[] = [
  { label: "200x300", price: 750 },
  { label: "300x400", price: 1150 },
  { label: "400x500", price: 1600 },
  { label: "400x600", price: 1850 },
  { label: "500x700", price: 2450 },
  { label: "600x600", price: 2470 },
  { label: "600x800", price: 3100 },
  { label: "600x900", price: 3390 },
  { label: "800x1000", price: 4600 },
  { label: "900x1200", price: 5900 },
  { label: "1000x1500", price: 7750 },
];

const diaryPriceTable: PriceTable = {
  columns: ["1-2 шт", "3-5 шт", "5-10 шт", "10-50 шт", "50-100 шт", "от 100 шт"],
  rows: [
    {
      label: "до A7\nдо 70 кв.см (7x10см)",
      values: [400, 300, 100, 80, 30, "ПРОСЧЕТ ЧЕРЕЗ МЕНЕДЖЕРА"],
    },
    {
      label: "до A6\nдо 150 кв.см (10x15см)",
      values: [400, 300, 150, 100, 80, "ПРОСЧЕТ ЧЕРЕЗ МЕНЕДЖЕРА"],
    },
    {
      label: "до A5\nдо 315 кв.см (15x21см)",
      values: [500, 400, 250, 150, 100, "ПРОСЧЕТ ЧЕРЕЗ МЕНЕДЖЕРА"],
    },
    {
      label: "до A4\nдо 630 кв.см (21x30см)",
      values: [600, 500, 350, 200, 150, "ПРОСЧЕТ ЧЕРЕЗ МЕНЕДЖЕРА"],
    },
  ],
};

const notebookPriceTable: PriceTable = {
  columns: ["1-5 шт", "5-10 шт", "10-50 шт", "50-100 шт", "от 100 шт"],
  rows: [
    { label: "A6 (10x15см)", values: [205, 130, 100, 60, 56] },
    { label: "A5 (15x21см)", values: [266, 195, 99, 89, 86] },
    { label: "A4 (21x30см)", values: [365, 276, 162, 139, 134] },
    { label: "Евро (21x9,8см)", values: [227, 148, 107, 65, 56] },
  ],
};

const puzzlePriceTable: PriceTable = {
  columns: ["1-2 шт", "3-5 шт", "5-10 шт"],
  rows: [
    { label: "A4 картон", values: [700, 600, 500] },
    { label: "A3 картон", values: [1000, 900, 800] },
    { label: "A4 фанера", values: [2000, 1800, 1600] },
    { label: "A3 фанера", values: [2600, 2400, 2200] },
  ],
};

const lanyardTableNoPocket: PriceTable = {
  columns: ["1-5 шт", "5-10 шт", "от 10 шт"],
  rows: [{ label: "БЕЙДЖ БЕЗ КАРМАНА", values: [500, 450, 400] }],
};

const lanyardTablePocket: PriceTable = {
  columns: ["1-5 шт", "5-10 шт", "от 10 шт"],
  rows: [{ label: "БЕЙДЖ С КАРМАНОМ", values: [600, 550, 500] }],
};

const lanyardTableDouble: PriceTable = {
  columns: ["1-5 шт", "5-10 шт", "от 10 шт"],
  rows: [{ label: "БЕЙДЖ ДВУСТОРОННИЙ", values: [500, 450, 400] }],
};

const defaultNote = (
  <>
    <span className="text-[#FFD700] font-bold">ВАЖНО! </span>
    МАКЕТ ПРИНИМАЕТСЯ К ПЕЧАТИ В <span className="font-bold">ФОРМАТЕ TIFF</span>, РАЗМЕР
    <span className="font-bold"> 1:1</span>, ЦВЕТОВОЙ МОДЕЛИ <span className="font-bold">CMYK</span>, КАЧЕСТВО
    МАКЕТА <span className="font-bold">600 dpi</span>, КОНТУР РЕЗА ПРИНИМАЕТСЯ К ПЕЧАТИ В
    <span className="font-bold"> ФОРМАТЕ EPS</span>, РАЗМЕР <span className="font-bold">1:1</span>, ВСЕ ЭЛЕМЕНТЫ В
    КРИВЫХ, БЕЗ ПРОЗРАЧНОСТИ, ЗАЛИВОК И ДВОЙНЫХ КОНТУРОВ, ТОЛЩИНА ЛИНИИ -
    <span className="font-bold"> СВЕРХТОНКИЙ АБРИС</span>.
  </>
);

const paintingNote = (
  <>
    <span className="text-[#FFD700] font-bold">ВАЖНО! </span>
    МАКЕТ ПРИНИМАЕТСЯ К ПЕЧАТИ В <span className="font-bold">ФОРМАТЕ TIFF</span>, РАЗМЕР
    <span className="font-bold"> 1:1</span>, ЦВЕТОВОЙ МОДЕЛИ <span className="font-bold">CMYK</span>, КАЧЕСТВО
    МАКЕТА <span className="font-bold">600 dpi</span>. ЗАПАС ПО ПЕРИМЕТРУ ОСНОВНОГО ИЗОБРАЖЕНИЯ
    <span className="font-bold"> +60 мм</span>. НА УГЛАХ ИСКОМОГО РАЗМЕРА МЕТКИ ПОД УГЛЫ.
  </>
);

const souvenirCategories: SouvenirCategory[] = [
  {
    id: "pens",
    title: "РУЧКИ",
    icon: PenIcon,
    variants: [
      {
        id: "vivaldi",
        title: "VIVALDI",
        image: "https://placehold.co/260x200/ffffff/006837?text=VIVALDI",
        calculator: { type: "pen", basePrice: 100, colors: penColorsFull },
      },
      {
        id: "polo",
        title: "POLO",
        image: "https://placehold.co/260x200/ffffff/006837?text=POLO",
        calculator: { type: "pen", basePrice: 100, colors: penColorsFull },
      },
      {
        id: "global",
        title: "GLOBAL",
        image: "https://placehold.co/260x200/ffffff/006837?text=GLOBAL",
        calculator: { type: "pen", basePrice: 100, colors: penColorsShort },
      },
      {
        id: "europa",
        title: "EUROPA",
        image: "https://placehold.co/260x200/ffffff/006837?text=EUROPA",
        calculator: { type: "pen", basePrice: 100, colors: penColorsShort },
      },
    ],
  },
  {
    id: "mugs",
    title: "КРУЖКИ",
    icon: MugIcon,
    variants: [
      {
        id: "white-mug",
        title: "БЕЛЫЕ",
        image: "https://placehold.co/260x200/e5e7eb/006837?text=WHITE",
        calculator: { type: "mug-white", basePrice: 100 },
      },
      {
        id: "color-mug",
        title: "ЦВЕТНЫЕ",
        image: "https://placehold.co/260x200/e5e7eb/006837?text=COLOR",
        calculator: { type: "mug-color", basePrice: 120, colors: mugColors },
      },
    ],
  },
  {
    id: "paintings",
    title: "КАРТИНЫ",
    icon: CanvasIcon,
    variants: [
      {
        id: "paintings",
        title: "КАРТИНЫ",
        image: "https://placehold.co/260x200/ffffff/006837?text=CANVAS",
        calculator: { type: "painting", priceList: paintingPrices },
      },
    ],
  },
  {
    id: "magnets",
    title: "МАГНИТЫ",
    icon: MagnetIcon,
    variants: [
      {
        id: "magnets",
        title: "МАГНИТЫ",
        image: "https://placehold.co/260x200/ffffff/006837?text=MAGNET",
        calculator: { type: "magnet", basePrice: 100 },
      },
    ],
  },
  {
    id: "diaries",
    title: "ЕЖЕДНЕВНИКИ",
    icon: DiaryIcon,
    variants: [
      {
        id: "diaries",
        title: "ЕЖЕДНЕВНИКИ",
        image: "https://placehold.co/260x200/ffffff/006837?text=DIARY",
        calculator: { type: "diary", priceTable: diaryPriceTable },
      },
    ],
  },
  {
    id: "notebooks",
    title: "БЛОКНОТЫ",
    icon: NotebookIcon,
    variants: [
      {
        id: "notebooks",
        title: "БЛОКНОТЫ",
        image: "https://placehold.co/260x200/ffffff/006837?text=NOTE",
        calculator: { type: "notebook", priceTable: notebookPriceTable },
      },
    ],
  },
  {
    id: "puzzles",
    title: "ПАЗЛЫ",
    icon: PuzzleIcon,
    variants: [
      {
        id: "puzzles",
        title: "ПАЗЛЫ",
        image: "https://placehold.co/260x200/ffffff/006837?text=PUZZLE",
        calculator: { type: "puzzle", priceTable: puzzlePriceTable },
      },
    ],
  },
  {
    id: "keychains",
    title: "БРЕЛОКИ",
    icon: KeychainIcon,
    variants: [
      {
        id: "keychains",
        title: "БРЕЛОКИ",
        image: "https://placehold.co/260x200/ffffff/006837?text=KEYCHAIN",
        calculator: {
          type: "keychain",
          basePrice: 100,
          applyMethods: ["УФ печать", "Гравировка"],
        },
      },
    ],
  },
  {
    id: "badges",
    title: "ЗНАЧКИ",
    icon: BadgeIcon,
    variants: [
      {
        id: "badges",
        title: "ЗНАЧКИ ВАЛЬЦОВАННЫЕ",
        image: "https://placehold.co/260x200/ffffff/006837?text=BADGE",
        calculator: { type: "badge" },
      },
    ],
  },
  {
    id: "lanyards",
    title: "БЕЙДЖИ",
    icon: LanyardIcon,
    variants: [
      {
        id: "lanyard-no-pocket",
        title: "БЕЙДЖ БЕЗ КАРМАНА",
        image: "https://placehold.co/260x200/ffffff/006837?text=BADGE+NO+POCKET",
        calculator: { type: "lanyard", priceTable: lanyardTableNoPocket },
      },
      {
        id: "lanyard-pocket",
        title: "БЕЙДЖ С КАРМАНОМ",
        image: "https://placehold.co/260x200/ffffff/006837?text=BADGE+POCKET",
        calculator: { type: "lanyard", priceTable: lanyardTablePocket },
      },
      {
        id: "lanyard-double",
        title: "БЕЙДЖ ДВУСТОРОННИЙ",
        image: "https://placehold.co/260x200/ffffff/006837?text=BADGE+DOUBLE",
        calculator: { type: "lanyard", priceTable: lanyardTableDouble },
      },
    ],
  },
];

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold uppercase text-black">{label}</label>
    {children}
  </div>
);

const SouvenirsPage: React.FC = () => {
  const { addItem } = useCart();
  const [viewState, setViewState] = useState<ViewState>("MAIN");
  const [activeCategoryId, setActiveCategoryId] = useState<SouvenirCategoryId>("pens");
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const [quantity, setQuantity] = useState<string>("1");
  const [penColor, setPenColor] = useState<string>("");
  const [penColorId, setPenColorId] = useState<string | null>(null);
  const [mugColor, setMugColor] = useState<string>("");
  const [mugColorId, setMugColorId] = useState<string | null>(null);
  const [printPlace, setPrintPlace] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [width, setWidth] = useState<string>("");
  const [rounding, setRounding] = useState<boolean>(false);
  const [applyMethod, setApplyMethod] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<{
    key: string;
    label: string;
    price: number;
  } | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [comments, setComments] = useState<string>("");
  const [checkLayout, setCheckLayout] = useState<boolean>(false);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const activeCategory = souvenirCategories.find((cat) => cat.id === activeCategoryId) ?? souvenirCategories[0];
  const selectedVariant = selectedVariantId
    ? activeCategory.variants.find((variant) => variant.id === selectedVariantId)
    : activeCategory.variants[0];

  const resetForm = () => {
    setQuantity("1");
    setPenColor("");
    setPenColorId(null);
    setMugColor("");
    setMugColorId(null);
    setPrintPlace("");
    setLength("");
    setWidth("");
    setRounding(false);
    setApplyMethod("");
    setSelectedPrice(null);
    setDeliveryAddress("");
    setComments("");
    setCheckLayout(false);
    setFrontFile(null);
    setPreviewFile(null);
  };

  const handleMainView = () => {
    setViewState("MAIN");
    setSelectedVariantId(null);
    resetForm();
    window.scrollTo(0, 0);
  };

  const handleCategorySelect = (id: SouvenirCategoryId) => {
    setActiveCategoryId(id);
    setViewState("CATEGORY");
    setSelectedVariantId(null);
    resetForm();
    window.scrollTo(0, 0);
  };

  const handleVariantSelect = (id: string) => {
    setSelectedVariantId(id);
    setViewState("CALCULATOR");
    resetForm();
    window.scrollTo(0, 0);
  };

  const handlePriceSelect = (price: number, key: string, label: string) => {
    setSelectedPrice({ price, key, label });
  };

  const parseNumber = (value: string) => {
    const parsed = parseFloat(value.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const quantityValue = parseInt(quantity, 10) || 0;
  const lengthValue = parseNumber(length);
  const widthValue = parseNumber(width);
  const areaValue = lengthValue * widthValue;

  let unitPrice = 0;
  let totalPrice = 0;

  if (viewState === "CALCULATOR" && selectedVariant) {
    const config = selectedVariant.calculator;
    switch (config.type) {
      case "pen":
      case "mug-white":
      case "mug-color":
        unitPrice = quantityValue > 0 ? config.basePrice ?? 0 : 0;
        totalPrice = unitPrice * quantityValue;
        break;
      case "magnet":
      case "keychain": {
        const base = config.basePrice ?? 0;
        unitPrice = areaValue > 0 ? areaValue * base : base;
        totalPrice = unitPrice * quantityValue;
        break;
      }
      case "painting":
      case "diary":
      case "notebook":
      case "puzzle":
        unitPrice = selectedPrice?.price ?? 0;
        totalPrice = unitPrice;
        break;
      case "badge": {
        if (quantityValue >= 500) unitPrice = 25;
        else if (quantityValue >= 100) unitPrice = 30;
        else if (quantityValue > 0) unitPrice = 35;
        totalPrice = unitPrice * quantityValue;
        break;
      }
      case "lanyard":
        unitPrice = selectedPrice?.price ?? 0;
        totalPrice = unitPrice * quantityValue;
        break;
    }
  }

  const displayUnitPrice = Math.round(unitPrice || 0);
  const displayTotalPrice = Math.round(totalPrice || 0);

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

  const getColorName = (colors: ColorOption[] | undefined, colorId: string | null, fallback: string) => {
    if (!colors || !colorId) return fallback;
    return colors.find((color) => color.id === colorId)?.name ?? fallback;
  };

  const buildSpecs = () => {
    if (!selectedVariant) return "";
    const config = selectedVariant.calculator;
    const specs: string[] = [activeCategory.title, selectedVariant.title];
    switch (config.type) {
      case "pen": {
        const colorName = penColor || getColorName(config.colors, penColorId, "");
        if (colorName) specs.push(`Цвет ручки: ${colorName}`);
        if (printPlace) specs.push(`Место печати: ${printPlace}`);
        break;
      }
      case "mug-color": {
        const colorName = mugColor || getColorName(config.colors, mugColorId, "");
        if (colorName) specs.push(`Цвет: ${colorName}`);
        break;
      }
      case "painting":
      case "diary":
      case "notebook":
      case "puzzle":
      case "lanyard":
        if (selectedPrice?.label) specs.push(`Размер: ${selectedPrice.label}`);
        break;
      case "magnet":
      case "keychain": {
        if (length && width) specs.push(`Размер: ${length}x${width}м`);
        if (config.type === "keychain" && applyMethod) specs.push(`Нанесение: ${applyMethod}`);
        if (config.type === "magnet" && rounding) specs.push("Скругление: да");
        break;
      }
      case "badge":
        specs.push("Диаметр: 58мм");
        break;
      default:
        break;
    }
    return specs.filter(Boolean).join(" / ");
  };

  const resolveFormat = () => {
    if (!selectedVariant) return "";
    const config = selectedVariant.calculator;
    switch (config.type) {
      case "painting":
      case "diary":
      case "notebook":
      case "puzzle":
      case "lanyard":
        return selectedPrice?.label ?? selectedVariant.title;
      case "magnet":
      case "keychain":
        return length && width ? `${length}x${width}м` : selectedVariant.title;
      case "badge":
        return "d 58мм";
      default:
        return selectedVariant.title;
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    if (displayTotalPrice <= 0) {
      alert("Выберите параметры для расчета стоимости.");
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

      const config = selectedVariant.calculator;
      const usesQuantity = ["pen", "mug-white", "mug-color", "magnet", "keychain", "badge", "lanyard"].includes(
        config.type,
      );
      const finalQuantity = usesQuantity ? Math.max(quantityValue, 1) : 1;

      const cartItem: CartItem = {
        id: `souvenir-${selectedVariant.id}-${Date.now()}`,
        type: "SOUVENIRS",
        format: resolveFormat(),
        quantity: finalQuantity,
        basePrice: displayUnitPrice,
        specs: buildSpecs(),
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

  const renderActionButtons = (_className = "") => null;

  const renderImageBlock = (variant: SouvenirVariant) => (
    <div className="flex flex-col items-start gap-3">
      <div className="w-[200px] h-[160px] border-2 border-[#006837] rounded-lg overflow-hidden bg-white flex items-center justify-center">
        <img src={variant.image} alt={variant.title} className="w-full h-full object-cover" />
      </div>
      <span className="text-xs font-bold uppercase text-[#006837]">{variant.title}</span>
    </div>
  );

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

  const renderPriceList = (items: PriceListItem[], keyPrefix: string) => (
    <div className="border border-[#00C16E] rounded-lg overflow-hidden w-full max-w-sm">
      <div className="grid grid-cols-2 text-xs font-bold text-white uppercase">
        <div className="bg-[#00C16E] py-1 text-center">РАЗМЕР</div>
        <div className="bg-[#00C16E] py-1 text-center">СТОИМОСТЬ</div>
      </div>
      {items.map((item) => {
        const key = `${keyPrefix}-${item.label}`;
        const isSelected = selectedPrice?.key === key;
        return (
          <button
            type="button"
            key={item.label}
            onClick={() => handlePriceSelect(item.price, key, item.label)}
            className={`w-full grid grid-cols-2 text-xs font-bold text-center transition-colors ${
              isSelected
                ? "bg-[#00C16E] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-[#00C16E] hover:text-white"
            }`}
          >
            <span className="py-2">{item.label}</span>
            <span className="py-2">{item.price.toFixed(2).replace(".", ",")}</span>
          </button>
        );
      })}
    </div>
  );

  const renderPriceTable = (table: PriceTable, tableId: string) => {
    const gridTemplate = `180px repeat(${table.columns.length}, minmax(0, 1fr))`;
    return (
      <div className="overflow-x-auto">
        <div className="min-w-[560px] border border-[#00C16E] rounded-lg overflow-hidden">
          <div className="grid text-xs font-bold text-white uppercase" style={{ gridTemplateColumns: gridTemplate }}>
            <div className="bg-[#00C16E] py-1 text-center">ТИРАЖ</div>
            {table.columns.map((col) => (
              <div key={col} className="bg-[#00C16E] py-1 text-center">
                {col}
              </div>
            ))}
          </div>
          {table.rows.map((row, rowIndex) => (
            <div
              key={`${tableId}-row-${rowIndex}`}
              className="grid text-xs"
              style={{ gridTemplateColumns: gridTemplate }}
            >
              <div className="bg-gray-200 text-gray-700 font-bold px-2 py-2 whitespace-pre-line">
                {row.label}
              </div>
              {row.values.map((value, colIndex) => {
                const cellKey = `${tableId}-${rowIndex}-${colIndex}`;
                const isNumber = typeof value === "number";
                const isSelected = selectedPrice?.key === cellKey;
                const cellClass = isSelected
                  ? "bg-[#00C16E] text-white"
                  : isNumber
                    ? "bg-gray-200 text-gray-700 hover:bg-[#00C16E] hover:text-white"
                    : "bg-gray-100 text-gray-500";
                return (
                  <button
                    type="button"
                    key={cellKey}
                    className={`px-2 py-2 font-bold text-center transition-colors ${cellClass} ${
                      isNumber ? "cursor-pointer" : "cursor-default"
                    }`}
                    onClick={() => isNumber && handlePriceSelect(value as number, cellKey, row.label)}
                    disabled={!isNumber}
                  >
                    {isNumber ? `${value}р/шт` : value}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderColorPalette = (
    colors: ColorOption[],
    selectedId: string | null,
    onSelect: (color: ColorOption) => void,
    showLabels = true,
  ) => (
    <div className={`grid ${showLabels ? "grid-cols-4 sm:grid-cols-7" : "grid-cols-7"} gap-3`}>
      {colors.map((color) => {
        const isSelected = selectedId === color.id;
        return (
          <button
            type="button"
            key={color.id}
            onClick={() => onSelect(color)}
            className="flex flex-col items-center gap-1"
          >
            <span
              className={`w-9 h-9 rounded-md border-2 ${isSelected ? "border-[#00C16E]" : "border-gray-300"}`}
              style={{ backgroundColor: color.hex }}
            />
            {showLabels && (
              <span className="text-[9px] uppercase font-bold text-gray-600">{color.name}</span>
            )}
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
              accept=".tiff,.tif"
              onChange={(e) => setFrontFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <span className="text-[9px] font-bold text-[#006837] uppercase">ФОРМАТ TIFF</span>
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

  const renderPenCalculator = (variant: SouvenirVariant) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {renderImageBlock(variant)}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="ЦВЕТ РУЧКИ*">
              <input
                type="text"
                value={penColor}
                onChange={(e) => {
                  setPenColor(e.target.value);
                  setPenColorId(null);
                }}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
              />
            </FormField>
            <FormField label="КОЛИЧЕСТВО*">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
              />
            </FormField>
            <FormField label="МЕСТО ПЕЧАТИ*">
              <input
                type="text"
                value={printPlace}
                onChange={(e) => setPrintPlace(e.target.value)}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
              />
            </FormField>
          </div>
          {renderActionButtons()}
        </div>
      </div>
      {variant.calculator.colors && (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase text-[#006837]">Выберите цвет</div>
          {renderColorPalette(variant.calculator.colors, penColorId, (color) => {
            setPenColorId(color.id);
            setPenColor(color.name);
          })}
        </div>
      )}
    </div>
  );

  const renderMugCalculator = (variant: SouvenirVariant) => {
    const isColored = variant.calculator.type === "mug-color";
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {renderImageBlock(variant)}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="КОЛИЧЕСТВО*">
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
                />
              </FormField>
              {isColored && (
                <FormField label="ЦВЕТ*">
                  <input
                    type="text"
                    value={mugColor}
                    onChange={(e) => {
                      setMugColor(e.target.value);
                      setMugColorId(null);
                    }}
                    className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
                  />
                </FormField>
              )}
            </div>
            {renderActionButtons()}
          </div>
        </div>
        {isColored && (
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase text-[#006837]">Выберите цвет</div>
            {renderColorPalette(mugColors, mugColorId, (color) => {
              setMugColorId(color.id);
              setMugColor(color.name);
            }, false)}
          </div>
        )}
      </div>
    );
  };

  const renderPaintingCalculator = (variant: SouvenirVariant) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {renderImageBlock(variant)}
        <div className="space-y-4">
          {renderActivePriceBanner()}
          {variant.calculator.priceList && renderPriceList(variant.calculator.priceList, variant.id)}
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );

  const renderMagnetCalculator = (variant: SouvenirVariant) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {renderImageBlock(variant)}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="ТИРАЖ (шт)*">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
              />
            </FormField>
            <FormField label="ДЛИНА (м)*">
              <input
                type="number"
                step="0.01"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
              />
            </FormField>
            <FormField label="ШИРИНА (м)*">
              <input
                type="number"
                step="0.01"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
              />
            </FormField>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rounding}
              onChange={(e) => setRounding(e.target.checked)}
              className="w-5 h-5 border-2 border-[#006837] rounded accent-[#006837]"
            />
            <span className="text-sm font-bold uppercase text-[#006837]">Скруглить углы</span>
          </div>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );

  const renderPriceTableCalculator = (variant: SouvenirVariant) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {renderImageBlock(variant)}
        <div className="space-y-4">
          {renderActivePriceBanner()}
          {variant.calculator.priceTable && renderPriceTable(variant.calculator.priceTable, variant.id)}
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );

  const renderKeychainCalculator = (variant: SouvenirVariant) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {renderImageBlock(variant)}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="ТИРАЖ (шт)*">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
              />
            </FormField>
            <FormField label="СПОСОБ НАНЕСЕНИЯ*">
              <select
                value={applyMethod}
                onChange={(e) => setApplyMethod(e.target.value)}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black bg-white"
              >
                <option value="">Выберите</option>
                {variant.calculator.applyMethods?.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="ДЛИНА (м)*">
              <input
                type="number"
                step="0.01"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
              />
            </FormField>
            <FormField label="ШИРИНА (м)*">
              <input
                type="number"
                step="0.01"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
              />
            </FormField>
          </div>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );

  const renderBadgeCalculator = (variant: SouvenirVariant) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {renderImageBlock(variant)}
        <div className="space-y-4">
          <FormField label="ТИРАЖ (шт)*">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
            />
          </FormField>
          <div className="text-[10px] uppercase text-gray-500 font-bold">
            Размер только d 58мм · 1-100 шт = 35р/шт · 100-500 шт = 30р/шт · от 500 шт = 25р/шт
          </div>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );

  const renderLanyardCalculator = (variant: SouvenirVariant) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {renderImageBlock(variant)}
        <div className="space-y-4">
          {renderActivePriceBanner()}
          {variant.calculator.priceTable && renderPriceTable(variant.calculator.priceTable, variant.id)}
          <FormField label="ТИРАЖ (шт)*">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-sm focus:outline-none text-black"
            />
          </FormField>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );

  const renderCalculatorContent = () => {
    if (!selectedVariant) return null;
    switch (selectedVariant.calculator.type) {
      case "pen":
        return renderPenCalculator(selectedVariant);
      case "mug-white":
      case "mug-color":
        return renderMugCalculator(selectedVariant);
      case "painting":
        return renderPaintingCalculator(selectedVariant);
      case "magnet":
        return renderMagnetCalculator(selectedVariant);
      case "diary":
      case "notebook":
      case "puzzle":
        return renderPriceTableCalculator(selectedVariant);
      case "keychain":
        return renderKeychainCalculator(selectedVariant);
      case "badge":
        return renderBadgeCalculator(selectedVariant);
      case "lanyard":
        return renderLanyardCalculator(selectedVariant);
      default:
        return null;
    }
  };

  const renderCategoryNote = () => (
    <div
      className="w-full bg-[#006837] py-6 px-8 md:px-16 text-white relative min-h-[110px] flex items-center"
      style={{ clipPath: "polygon(50px 0, 100% 0, 100% 100%, 50px 100%, 0 50%)" }}
    >
      <div className="text-sm md:text-base font-medium leading-relaxed uppercase">
        {activeCategory.id === "paintings" ? paintingNote : defaultNote}
      </div>
    </div>
  );

  const renderMainView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 animate-fade-in">
      {souvenirCategories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => handleCategorySelect(category.id)}
            className="group text-left"
          >
            <div className="border-2 border-[#006837] rounded-xl bg-white p-6 flex items-center justify-center aspect-square group-hover:border-[#00C16E] transition-colors">
              <div className="text-[#006837] group-hover:text-[#00C16E] transition-colors">
                <Icon />
              </div>
            </div>
            <div className="mt-2 font-bold uppercase text-[#006837] text-sm group-hover:text-[#00C16E] transition-colors">
              {category.title}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderCategoryView = () => (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeCategory.variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => handleVariantSelect(variant.id)}
            className="group text-left"
          >
            <div className="border-2 border-[#006837] rounded-xl overflow-hidden bg-white aspect-[4/3] group-hover:border-[#00C16E] transition-colors">
              <img src={variant.image} alt={variant.title} className="w-full h-full object-cover" />
            </div>
            <div className="mt-2 font-bold uppercase text-[#006837] text-xs group-hover:text-[#00C16E] transition-colors">
              {variant.title}
            </div>
          </button>
        ))}
      </div>
      {renderCategoryNote()}
    </div>
  );

  const renderCalculatorView = () => (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      <div className="flex-1">
        {renderCalculatorContent()}
        {renderUploadBlock()}
      </div>
      {renderSummary()}
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="max-w-[1300px] w-full mx-auto px-4 py-8 flex-grow">
        <div className="flex w-full mb-10 h-16">
          <div
            className="relative bg-[#00C16E] text-white font-bold text-sm sm:text-lg px-4 sm:px-8 flex items-center h-full z-10 w-fit shrink-0 cursor-pointer uppercase leading-tight"
            onClick={handleMainView}
          >
            {viewState === "MAIN" ? (
              <>
                СУВЕНИРНАЯ
                <br />
                ПРОДУКЦИЯ
              </>
            ) : (
              <>
                БРЕНДИРОВАНИЕ
                <br />/ СУВЕНИРЫ
              </>
            )}
            <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent" />
          </div>
          <div className="bg-[#006837] flex-grow flex items-center px-8 sm:px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-12 sm:pl-16">
            {viewState === "MAIN" ? "БРЕНДИРОВАНИЕ / СУВЕНИРЫ" : activeCategory.title}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="w-full lg:w-[220px] shrink-0 flex flex-col gap-3 text-lg font-bold uppercase text-[#006837]">
            {souvenirCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category.id)}
                className={`text-left transition-colors ${
                  activeCategoryId === category.id ? "text-[#00C16E]" : "text-[#006837]"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {viewState === "MAIN" && renderMainView()}
            {viewState === "CATEGORY" && renderCategoryView()}
            {viewState === "CALCULATOR" && renderCalculatorView()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SouvenirsPage;

