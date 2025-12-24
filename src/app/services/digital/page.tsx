"use client"
import React, { useState } from "react";
// Импортируй свои Header и Footer
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useCart, CartItem } from "../../../../context/CartContext";

// --- ТИПЫ ДАННЫХ ---
type ViewState = 'MAIN' | 'VIZITKI_FORMATS' | 'FLAERS_FORMATS' | 'ORDER_CONFIG';

// Интерфейс для данных заказа
interface SelectedOrderData {
    type: 'VIZITKI' | 'FLAERS';
    format: string;
    quantity: number;
    basePrice: number;
    specs: string;
}

// Тип для структуры цен флаеров (Колонка 1 и Колонка 2)
type FlyerPriceColumn = {
    title: string; // Например "ЛИСТОВКА А4 (210x297). 115гр/м². 4+0."
    specs: string; // "4+0" или "4+4"
    prices: number[];
    isPromo?: boolean;
}[];

const DigitalPrintingPage: React.FC = () => {
    // --- СОСТОЯНИЯ ---
    const { addItem } = useCart();
    const [activeTab, setActiveTab] = useState<ViewState>('MAIN');
    const [orderData, setOrderData] = useState<SelectedOrderData | null>(null);

    // Выбранные форматы
    const [selectedCardFormat, setSelectedCardFormat] = useState<"90x50" | "85x55">("90x50");
    // По умолчанию А4
    const [selectedFlyerFormat, setSelectedFlyerFormat] = useState<string>("A4");

    // Состояния формы оформления
    const [creasing, setCreasing] = useState(0);
    const [folding, setFolding] = useState(false);
    const [extraCut, setExtraCut] = useState(0);
    const [holes, setHoles] = useState(0);
    const [rounding, setRounding] = useState(0);
    const [eyelets, setEyelets] = useState(0);
    const [eyeletColor, setEyeletColor] = useState("SILVER");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [comments, setComments] = useState("");
    const [checkLayout, setCheckLayout] = useState(false);
    
    // Состояния для файлов
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [backFile, setBackFile] = useState<File | null>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    // Тиражи
    const quantities = [50, 100, 250, 500];

    // --- БАЗА ДАННЫХ ЦЕН (ВИЗИТКИ) ---
    const pricesVizitki90 = [
        { label: "ВИЗИТКА (90x50). 300гр/м². 4+0", specs: "4+0", prices: [250, 500, 1250, 2500] },
        { label: "ВИЗИТКА (90x50). 300гр/м². 4+4", specs: "4+4", prices: [400, 800, 2000, 4000] },
    ];
    const pricesVizitki85 = [
        { label: "ВИЗИТКА (85x55). 300гр/м². 4+0", specs: "4+0", prices: [350, 700, 1750, 3500] },
        { label: "ВИЗИТКА (85x55). 300гр/м². 4+4", specs: "4+4", prices: [600, 1200, 3000, 6000] },
    ];

    // --- БАЗА ДАННЫХ ЦЕН (ФЛАЕРЫ - ДИНАМИЧЕСКАЯ) ---
    // Данные взяты из твоих скриншотов
    const flyerPricingData: Record<string, { col1: FlyerPriceColumn, col2: FlyerPriceColumn }> = {
        "A4": {
            col1: [ // 115 гр
                { title: "ЛИСТОВКА А4 (210x297). 115гр/м². 4+0.", specs: "4+0", prices: [1750, 3500, 7500, 12500] },
                { title: "ЛИСТОВКА А4 (210x297). 115гр/м². 4+4.", specs: "4+4", prices: [3250, 6500, 13750, 22500] }
            ],
            col2: [ // 80 гр
                { title: "ЛИСТОВКА А4 (210x297). 80гр/м². 4+0.", specs: "4+0", prices: [1250, 2500, 5000, 7500], isPromo: true },
                { title: "ЛИСТОВКА А4 (210x297). 80гр/м². 4+4.", specs: "4+4", prices: [1750, 3500, 7500, 12500], isPromo: true }
            ]
        },
        "A5": {
            col1: [ // 115 гр
                { title: "ФЛАЕР А5 (148x210). 115гр/м². 4+0.", specs: "4+0", prices: [900, 1800, 4000, 7000] },
                { title: "ФЛАЕР А5 (148x210). 115гр/м². 4+4.", specs: "4+4", prices: [1650, 3300, 7500, 13000] }
            ],
            col2: [] // Пусто (на скрине не было данных для 80гр А5)
        },
        "EURO": {
            col1: [ // 115 гр
                { title: "ЕВРО (210x99). 115гр/м². 4+0.", specs: "4+0", prices: [600, 1200, 2750, 5000] },
                { title: "ЕВРО (210x99). 115гр/м². 4+4.", specs: "4+4", prices: [1100, 2200, 5000, 9000] }
            ],
            col2: []
        },
        "A6": {
            col1: [ // 115 гр
                { title: "ФЛАЕР А6 (105x148). 115гр/м². 4+0.", specs: "4+0", prices: [450, 900, 2000, 3500] },
                { title: "ФЛАЕР А6 (105x148). 115гр/м². 4+4.", specs: "4+4", prices: [850, 1700, 3750, 6500] }
            ],
            col2: []
        },
        "A7": {
            col1: [ // 115 гр
                { title: "ФЛАЕР А7 (74x105). 115гр/м². 4+0.", specs: "4+0", prices: [400, 800, 1750, 3000] },
                { title: "ФЛАЕР А7 (74x105). 115гр/м². 4+4.", specs: "4+4", prices: [700, 1400, 3000, 5000] }
            ],
            col2: []
        }
    };

    // --- ЛОГИКА ---
    const handlePriceClick = (price: number, quantity: number, type: 'VIZITKI' | 'FLAERS', format: string, specs: string) => {
        setOrderData({ type, format, quantity, basePrice: price, specs });
        // Сброс формы
        setCreasing(0); setFolding(false); setExtraCut(0); setHoles(0); setRounding(0);
        setEyelets(0); setEyeletColor("SILVER");
        setDeliveryAddress(""); setComments(""); setCheckLayout(false);
        // Сброс файлов
        setFrontFile(null); setBackFile(null); setPreviewFile(null);
        setActiveTab('ORDER_CONFIG');
        window.scrollTo(0, 0);
    };

    const calculateTotal = () => {
        if (!orderData) return 0;
        let total = orderData.basePrice;
        if (creasing > 0) total += creasing * 1 * orderData.quantity;
        if (extraCut > 0) total += 200;
        if (holes > 0) total += 300;
        if (rounding > 0) total += 300;
        return total;
    };
    const totalPrice = calculateTotal();

    // Функция конвертации File в base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Функция добавления в корзину
    const handleAddToCart = async () => {
        if (!orderData) return;

        try {
            // Дата готовности (+3 дня)
            const readyDate = new Date();
            readyDate.setDate(readyDate.getDate() + 3);
            const dateStr = readyDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
            const timeStr = "15:00";

            // Конвертируем файлы в base64
            let frontFileBase64: string | undefined;
            let backFileBase64: string | undefined;
            let previewFileBase64: string | undefined;

            try {
                if (frontFile) {
                    frontFileBase64 = await fileToBase64(frontFile);
                }
                if (backFile) {
                    backFileBase64 = await fileToBase64(backFile);
                }
                if (previewFile) {
                    previewFileBase64 = await fileToBase64(previewFile);
                }
            } catch (fileError) {
                console.error('Ошибка при конвертации файлов:', fileError);
                alert('Ошибка при обработке файлов. Товар будет добавлен без файлов.');
            }

            const cartItem: CartItem = {
                id: `${orderData.type}-${orderData.format}-${orderData.quantity}-${Date.now()}`,
                type: orderData.type,
                format: orderData.format,
                quantity: orderData.quantity,
                basePrice: orderData.basePrice,
                specs: orderData.specs,
                creasing: creasing > 0 ? creasing : undefined,
                folding: folding || undefined,
                extraCut: extraCut > 0 ? extraCut : undefined,
                holes: holes > 0 ? holes : undefined,
                rounding: rounding > 0 ? rounding : undefined,
                eyelets: eyelets > 0 ? eyelets : undefined,
                eyeletColor: eyelets > 0 ? eyeletColor : undefined,
                deliveryAddress: deliveryAddress || undefined,
                comments: comments || undefined,
                checkLayout: checkLayout || undefined,
                readyDate: dateStr,
                readyTime: timeStr,
                totalPrice: totalPrice,
                // Файлы в base64
                frontFile: frontFileBase64,
                backFile: backFileBase64,
                previewFile: previewFileBase64,
                // Метаданные файлов
                frontFileName: frontFile?.name,
                backFileName: backFile?.name,
                previewFileName: previewFile?.name,
                frontFileSize: frontFile?.size,
                backFileSize: backFile?.size,
                previewFileSize: previewFile?.size,
                frontFileType: frontFile?.type,
                backFileType: backFile?.type,
                previewFileType: previewFile?.type,
            };

            addItem(cartItem);
            
            // Показываем уведомление (можно заменить на toast)
            alert('Товар добавлен в корзину!');
            
            // Опционально: сброс формы или переход в корзину
            // setActiveTab('MAIN');
            // setOrderData(null);
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Произошла ошибка при добавлении товара в корзину. Пожалуйста, попробуйте еще раз.');
        }
    };

    // --- РЕНДЕРЫ ---

    const renderMainSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div onClick={() => setActiveTab('VIZITKI_FORMATS')} className="group cursor-pointer">
                <div className="rounded-xl border-2 border-[#006837] overflow-hidden bg-[#eef2f6] mb-4 h-64 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:border-[#00C16E]">
                    <span className="text-4xl font-bold text-[#006837]">Визитки</span>
                </div>
                <div>
                    <h3 className="font-bold text-[#006837] uppercase text-lg group-hover:text-[#00C16E] transition-colors">ВИЗИТКИ</h3>
                    <p className="text-gray-500 text-sm">плотность 300гр</p>
                </div>
            </div>
            <div onClick={() => setActiveTab('FLAERS_FORMATS')} className="group cursor-pointer">
                <div className="rounded-xl border-2 border-[#006837] overflow-hidden bg-[#eef2f6] mb-4 h-64 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:border-[#00C16E]">
                    <span className="text-4xl font-bold text-[#006837]">Флаеры</span>
                </div>
                <div>
                    <h3 className="font-bold text-[#006837] uppercase text-lg group-hover:text-[#00C16E] transition-colors">ФЛАЕРЫ / ЛИСТОВКИ</h3>
                    <p className="text-gray-500 text-sm">плотность 115гр</p>
                </div>
            </div>
        </div>
    );

    const renderVizitkiDetails = () => (
        <div className="animate-fade-in">
            <div className="flex flex-wrap items-start gap-12 mb-12">
                {/* ... Верстка визуализации визиток (без изменений) ... */}
                {/* 90x50 */}
                <div onClick={() => setSelectedCardFormat("90x50")} className={`cursor-pointer transition-opacity ${selectedCardFormat === "90x50" ? "opacity-100" : "opacity-60 hover:opacity-100"}`}>
                    <div className="flex">
                        <div className="text-[10px] w-4 relative"><div className="absolute bottom-0 left-0 -rotate-90 origin-bottom-left w-32 whitespace-nowrap text-sky-500 font-medium"><span className="text-red-500">52 мм</span> / <span className="text-[#00C16E]">50 мм</span> / <span className="text-sky-500">44 мм</span></div></div>
                        <div>
                            <div className="border border-red-500 p-1 bg-white"><div className="border border-[#00C16E] p-1"><div className="border border-sky-400 w-48 h-28 flex items-center justify-center"></div></div></div>
                            <div className="mt-1 text-center text-[10px] font-medium"><span className="text-red-500">92 мм</span> / <span className="text-[#00C16E]">90 мм</span> / <span className="text-sky-500">84 мм</span></div>
                        </div>
                    </div>
                </div>
                {/* 85x55 */}
                <div onClick={() => setSelectedCardFormat("85x55")} className={`cursor-pointer transition-opacity ${selectedCardFormat === "85x55" ? "opacity-100" : "opacity-60 hover:opacity-100"}`}>
                    <div className="flex">
                        <div className="text-[10px] w-4 relative"><div className="absolute bottom-0 left-0 -rotate-90 origin-bottom-left w-32 whitespace-nowrap text-sky-500 font-medium"><span className="text-red-500">57 мм</span> / <span className="text-[#00C16E]">55 мм</span> / <span className="text-sky-500">49 мм</span></div></div>
                        <div>
                            <div className="border border-red-500 p-1 bg-white"><div className="border border-[#00C16E] p-1"><div className="border border-sky-400 w-44 h-32 flex items-center justify-center"></div></div></div>
                            <div className="mt-1 text-center text-[10px] font-medium"><span className="text-red-500">87 мм</span> / <span className="text-[#00C16E]">85 мм</span> / <span className="text-sky-500">79 мм</span></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 ml-auto text-sm">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600"></div><span>дообрезной формат</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00C16E]"></div><span>размер изделия</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-500"></div><span>безопасная зона</span></div>
                </div>
            </div>

            <div className="w-full bg-[#00C16E] text-white py-2 px-6 mb-6 font-bold text-lg rounded-sm" style={{ clipPath: "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 2% 50%)" }}>
                🛒 Активный прайс-лист
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="grid grid-cols-5 gap-1 mb-2 text-white font-bold text-center text-xs"><div className="bg-[#00C16E] py-1">ТИРАЖ</div>{quantities.map(q => <div key={q} className="bg-[#00C16E] py-1">{q}</div>)}</div>
                    {pricesVizitki90.map((row, i) => (
                        <div key={i} className="mb-4">
                            <div className="font-bold text-[#006837] text-sm mb-1">{row.label}</div>
                            <div className="grid grid-cols-5 gap-1 text-center text-sm">
                                <div className="bg-gray-200 text-[9px] p-1 flex items-center justify-center font-bold text-gray-600">{row.specs}</div>
                                {row.prices.map((p, idx) => (
                                    <div key={idx} onClick={() => handlePriceClick(p, quantities[idx], 'VIZITKI', selectedCardFormat, row.specs)} className="bg-gray-200 hover:bg-[#00C16E] hover:text-white cursor-pointer py-2 font-bold text-gray-700 transition-colors">{p}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="grid grid-cols-5 gap-1 mb-2 text-white font-bold text-center text-xs"><div className="bg-[#00C16E] py-1">ТИРАЖ</div>{quantities.map(q => <div key={q} className="bg-[#00C16E] py-1">{q}</div>)}</div>
                    {pricesVizitki85.map((row, i) => (
                        <div key={i} className="mb-4">
                            <div className="font-bold text-[#006837] text-sm mb-1">{row.label}</div>
                            <div className="grid grid-cols-5 gap-1 text-center text-sm">
                                <div className="bg-gray-200 text-[9px] p-1 flex items-center justify-center font-bold text-gray-600">{row.specs}</div>
                                {row.prices.map((p, idx) => (
                                    <div key={idx} onClick={() => handlePriceClick(p, quantities[idx], 'VIZITKI', selectedCardFormat, row.specs)} className="bg-gray-200 hover:bg-[#00C16E] hover:text-white cursor-pointer py-2 font-bold text-gray-700 transition-colors">{p}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderFlyersDetails = () => {
        // 👇 ПОЛУЧАЕМ ЦЕНЫ ДЛЯ ВЫБРАННОГО ФОРМАТА
        // Если для формата (например A7) данных нет, берем пустой объект
        const currentData = flyerPricingData[selectedFlyerFormat] || { col1: [], col2: [] };

        return (
            <div className="animate-fade-in">
                {/* Выбор форматов */}
                <div className="flex flex-wrap items-end gap-4 mb-8">
                    {[
                        { id: "A4", w: "w-24", h: "h-36", label: "A4" },
                        { id: "A5", w: "w-20", h: "h-28", label: "A5" },
                        { id: "EURO", w: "w-16", h: "h-28", label: "ЕВРО" },
                        { id: "A6", w: "w-16", h: "h-24", label: "A6" },
                        { id: "A7", w: "w-12", h: "h-16", label: "A7" },
                    ].map((fmt) => (
                        <div key={fmt.id} onClick={() => setSelectedFlyerFormat(fmt.id)} className={`relative cursor-pointer flex flex-col items-center group transition-all ${selectedFlyerFormat === fmt.id ? 'opacity-100 scale-105' : 'opacity-70 hover:opacity-100'}`}>
                            <div className={`border border-red-500 p-[2px] bg-white ${selectedFlyerFormat === fmt.id ? 'shadow-md shadow-green-200' : ''}`}>
                                <div className="border border-[#00C16E] p-[2px]">
                                    <div className={`border border-sky-400 ${fmt.w} ${fmt.h} flex items-end justify-center pb-1`}><span className="font-bold text-[10px] text-[#006837]">{fmt.label}</span></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full bg-[#00C16E] text-white py-2 px-6 mb-6 font-bold text-lg rounded-sm" style={{ clipPath: "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 2% 50%)" }}>🛒 Активный прайс-лист</div>

                {/* Таблицы цен (ДИНАМИЧЕСКИЕ) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Левая колонка (Обычно 115гр) */}
                    <div>
                        <div className="grid grid-cols-5 gap-1 mb-2 text-white font-bold text-center text-xs"><div className="bg-[#00C16E] py-1">ТИРАЖ</div>{quantities.map(q => <div key={q} className="bg-[#00C16E] py-1">{q}</div>)}</div>

                        {/* Если данных нет, покажем заглушку или просто ничего */}
                        {currentData.col1.length > 0 ? currentData.col1.map((row, i) => (
                            <div key={i} className="mb-4">
                                <div className="font-bold text-[#006837] text-sm mb-1">{row.title}</div>
                                <div className="grid grid-cols-5 gap-1 text-center text-sm">
                                    <div className="bg-gray-200 text-[9px] p-1 flex items-center justify-center font-bold text-gray-600">СРОК 1-3 РАБОЧИХ ДНЯ</div>
                                    {row.prices.map((p, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handlePriceClick(p, quantities[idx], 'FLAERS', selectedFlyerFormat, row.specs)}
                                            className="bg-gray-200 hover:bg-[#00C16E] hover:text-white cursor-pointer py-2 font-bold text-gray-700 transition-colors"
                                        >
                                            {p}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) : <div className="text-gray-400 text-center py-4">Нет данных для выбранного формата</div>}
                    </div>

                    {/* Правая колонка (Обычно 80гр, или пустая для мелких форматов) */}
                    <div>
                        <div className="grid grid-cols-5 gap-1 mb-2 text-white font-bold text-center text-xs"><div className="bg-[#00C16E] py-1">ТИРАЖ</div>{quantities.map(q => <div key={q} className="bg-[#00C16E] py-1">{q}</div>)}</div>

                        {currentData.col2.length > 0 ? currentData.col2.map((row, i) => (
                            <div key={i} className="mb-4">
                                <div className="font-bold text-[#006837] text-sm mb-1">{row.title}</div>
                                <div className="grid grid-cols-5 gap-1 text-center text-sm">
                                    <div className="bg-gray-200 text-[9px] p-1 flex items-center justify-center font-bold text-gray-600">СРОК 1-3 РАБОЧИХ ДНЯ</div>
                                    {row.prices.map((p, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handlePriceClick(p, quantities[idx], 'FLAERS', selectedFlyerFormat, row.specs)}
                                            className={`bg-gray-200 hover:bg-[#00C16E] hover:text-white cursor-pointer py-2 font-bold text-gray-700 transition-colors ${row.isPromo ? 'bg-green-50' : ''}`}
                                        >
                                            {p}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) : (
                            // Если данных для второй колонки нет (как для A5, A6...), можно оставить пустоту или текст
                            <div className="flex items-center justify-center h-32 text-gray-400 text-sm italic">
                                Для этого формата доступен только вариант 115гр
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderOrderConfig = () => {
        if (!orderData) return null;

        // Дата готовности (+3 дня)
        const readyDate = new Date();
        readyDate.setDate(readyDate.getDate() + 3);
        const dateStr = readyDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

        // Время (хардкод 15:00 как на скрине)
        const timeStr = "15:00";

        return (
            <div className="animate-fade-in text-[#006837] w-full">

                {/* Используем Flex для разделения: Настройки (слева) и Калькулятор (справа) */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* --- ЛЕВАЯ КОЛОНКА (НАСТРОЙКИ ЗАКАЗА) --- */}
                    <div className="flex-grow w-full lg:w-2/3 space-y-10">

                        {/* 1. ЗАГРУЗИТЕ МАКЕТ */}
                        <div>
                            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4">
                                <h3 className="font-bold text-xl uppercase pt-2">ЗАГРУЗИТЕ МАКЕТ</h3>
                                <div className="flex flex-wrap gap-4 items-start">
                                    {/* Кнопка загрузки Лицо */}
                                    <div className="flex flex-col gap-1">
                                        <label className="cursor-pointer group">
                                            <div className={`border-2 ${frontFile ? 'border-[#00C16E] bg-[#f0fff8]' : 'border-[#006837]'} rounded bg-white px-3 py-1 flex items-center gap-2 hover:bg-[#f0fff8] transition-colors min-w-[140px]`}>
                                                <span className="text-2xl font-bold pb-1 text-[#006837]">📥</span>
                                                <span className="font-bold uppercase text-[#006837]">
                                                    {frontFile ? '✓ ЗАГРУЖЕНО' : 'ЗАГРУЗИТЬ'}
                                                </span>
                                            </div>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept=".tiff,.tif,.jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) setFrontFile(file);
                                                }}
                                            />
                                        </label>
                                        <span className="text-[9px] uppercase text-gray-500 leading-tight">
                                            ЛИЦЕВАЯ СТОРОНА<br/>(92x52 мм / 86x56мм)
                                            {frontFile && <span className="block text-[#00C16E] font-semibold">{frontFile.name}</span>}
                                        </span>
                                    </div>

                                    {/* Кнопка загрузки Оборот */}
                                    {orderData.specs.includes("4+4") && (
                                        <div className="flex flex-col gap-1">
                                            <label className="cursor-pointer group">
                                                <div className={`border-2 ${backFile ? 'border-[#00C16E] bg-[#f0fff8]' : 'border-[#006837]'} rounded bg-white px-3 py-1 flex items-center gap-2 hover:bg-[#f0fff8] transition-colors min-w-[140px]`}>
                                                    <span className="text-2xl font-bold pb-1 text-[#006837]">📥</span>
                                                    <span className="font-bold uppercase text-[#006837]">
                                                        {backFile ? '✓ ЗАГРУЖЕНО' : 'ЗАГРУЗИТЬ'}
                                                    </span>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="hidden"
                                                    accept=".tiff,.tif,.jpg,.jpeg,.png"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setBackFile(file);
                                                    }}
                                                />
                                            </label>
                                            <span className="text-[9px] uppercase text-gray-500 leading-tight">
                                                ОБОРОТНАЯ СТОРОНА<br/>(92x52 мм / 86x56мм)
                                                {backFile && <span className="block text-[#00C16E] font-semibold">{backFile.name}</span>}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4 mt-6">
                                <h3 className="font-bold text-xl uppercase pt-2">ПРЕВЬЮ МАКЕТА</h3>
                                <div className="flex flex-col gap-1">
                                    <label className="cursor-pointer group w-fit">
                                        <div className={`border-2 ${previewFile ? 'border-[#00C16E] bg-[#f0fff8]' : 'border-[#006837]'} rounded bg-white px-3 py-1 flex items-center gap-2 hover:bg-[#f0fff8] transition-colors min-w-[140px]`}>
                                            <span className="text-2xl font-bold pb-1 text-[#006837]">📥</span>
                                            <span className="font-bold uppercase text-[#006837]">
                                                {previewFile ? '✓ ЗАГРУЖЕНО' : 'ЗАГРУЗИТЬ'}
                                            </span>
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setPreviewFile(file);
                                            }}
                                        />
                                    </label>
                                    <span className="text-[9px] uppercase text-gray-500">
                                        ФОРМАТ JPEG
                                        {previewFile && <span className="block text-[#00C16E] font-semibold">{previewFile.name}</span>}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2. ПОСТПЕЧАТНАЯ ОБРАБОТКА */}
                        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4">
                            <div>
                                <h3 className="font-bold text-xl uppercase text-[#006837] leading-tight">ПОСТПЕЧАТНАЯ<br/>ОБРАБОТКА</h3>
                                <p className="text-[9px] text-[#00C16E] mt-2 leading-tight">
                                    ВНИМАНИЕ!<br/>
                                    При выборе постпечатной обработки срок заказа автоматически увеличивается на один день
                                </p>
                            </div>

                            <div className="space-y-3">
                                {/* Биговка */}
                                <div className="flex items-center gap-3">
                                    <select value={creasing} onChange={(e) => setCreasing(Number(e.target.value))} className="border-2 border-[#006837] rounded bg-white px-2 py-0 h-8 w-14 text-center font-bold outline-none">
                                        {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <span className="font-bold uppercase text-sm">БИГОВКА (канавка) <span className="text-[#00C16E]">1 руб./шт</span></span>
                                </div>

                                {/* Фальцовка */}
                                <div className="flex items-center gap-3">
                                    <div className="w-14 flex justify-center">
                                        <input type="checkbox" checked={folding} onChange={(e) => setFolding(e.target.checked)} className="w-6 h-6 border-2 border-[#006837] rounded accent-[#006837]" />
                                    </div>
                                    <span className="font-bold uppercase text-sm">нужна фальцовка</span>
                                </div>

                                {/* Доп рез */}
                                <div className="flex items-center gap-3">
                                    <select value={extraCut} onChange={(e) => setExtraCut(Number(e.target.value))} className="border-2 border-[#006837] rounded bg-white px-2 py-0 h-8 w-14 text-center font-bold outline-none">
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                    </select>
                                    <span className="font-bold uppercase text-sm">ДОПОЛНИТЕЛЬНЫЙ РЕЗ <span className="text-[#00C16E]">+ 200р./ тираж</span></span>
                                </div>

                                {/* Отверстие */}
                                <div className="flex items-center gap-3">
                                    <select value={holes} onChange={(e) => setHoles(Number(e.target.value))} className="border-2 border-[#006837] rounded bg-white px-2 py-0 h-8 w-14 text-center font-bold outline-none">
                                        {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <span className="font-bold uppercase text-sm">ОТВЕРСТИЕ d 5 мм <span className="text-[#00C16E]">+300 р./тираж</span></span>
                                </div>

                                {/* Скругление */}
                                <div className="flex items-center gap-3">
                                    <select value={rounding} onChange={(e) => setRounding(Number(e.target.value))} className="border-2 border-[#006837] rounded bg-white px-2 py-0 h-8 w-14 text-center font-bold outline-none">
                                        <option value={0}>0</option>
                                        <option value={4}>4</option>
                                    </select>
                                    <span className="font-bold uppercase text-sm">СКРУГЛЕНИЕ УГЛОВ <span className="text-[#00C16E]">+300 р./тираж</span></span>
                                </div>

                                {/* Люверсы */}
                                <div className="flex items-center gap-3">
                                    <select value={eyelets} onChange={(e) => setEyelets(Number(e.target.value))} className="border-2 border-[#006837] rounded bg-white px-2 py-0 h-8 w-14 text-center font-bold outline-none">
                                        {[0,1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <span className="font-bold uppercase text-sm">ЛЮВЕРСЫ <span className="text-[10px] text-[#00C16E] normal-case">(макс размер от края h - 140mm, L - 150mm)</span></span>
                                </div>

                                {/* Цвет Люверсов */}
                                <div className="flex items-center gap-3">
                                    <select value={eyeletColor} onChange={(e) => setEyeletColor(e.target.value)} className="border-2 border-[#006837] rounded bg-white px-2 py-0 h-8 w-14 text-center font-bold text-xs outline-none">
                                        <option value="SILVER">0</option>
                                        <option value="GOLD">1</option>
                                    </select>
                                    <div className="font-bold uppercase text-sm flex gap-2 items-center">
                                        ЦВЕТ ЛЮВЕРСОВ
                                        {/* Линия заглушка */}
                                        <div className="h-[1px] w-8 bg-gray-400"></div>
                                        <span className="text-gray-400 text-[10px] uppercase">СЕРЕБРО ИЛИ ЗОЛОТО</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* 3. СПОСОБ ДОСТАВКИ И КОММЕНТАРИИ */}
                        <div className="space-y-6 pt-2">
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <label className="font-bold uppercase w-[200px] shrink-0 pt-2">СПОСОБ ДОСТАВКИ</label>
                                <div className="flex-grow w-full relative">
                                    <input
                                        type="text"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="border-2 border-[#006837] rounded-md p-2 w-full h-10 font-medium focus:outline-none focus:border-[#00C16E]"
                                    />
                                    {/* <span className="absolute right-0 top-full text-xs text-sky-500 mt-1 cursor-pointer">ВЫБРАТЬ АДРЕС</span> - убрал, если на скрине просто поле */}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <label className="font-bold uppercase w-[200px] shrink-0 pt-2">КОММЕНТАРИИ<br/>К ЗАКАЗУ</label>
                                <textarea
                                    rows={2}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    className="border-2 border-[#006837] rounded-md p-2 w-full resize-none focus:outline-none focus:border-[#00C16E]"
                                />
                            </div>

                            <div className="flex items-center gap-3 mt-4 sm:pl-[216px]">
                                <input
                                    type="checkbox"
                                    checked={checkLayout}
                                    onChange={(e) => setCheckLayout(e.target.checked)}
                                    className="w-6 h-6 border-2 border-[#006837] rounded accent-[#006837]"
                                />
                                <span className="font-bold text-sm text-gray-800">Проверить макет на соответствие требований к печати</span>
                            </div>
                        </div>

                    </div>

                    {/* --- ПРАВАЯ КОЛОНКА (КАЛЬКУЛЯТОР) --- */}
                    <div className="w-full lg:w-1/3 min-w-[300px]">
                        <div className="border-2 border-[#006837] rounded-xl p-5 bg-white shadow-sm sticky top-4">

                            <h3 className="font-bold text-xl uppercase text-black mb-4">РАСЧЕТ:</h3>

                            <div className="space-y-1 text-sm font-bold text-black mb-8">
                                <div className="flex justify-between">
                                    <span>Сумма:</span>
                                    <span>{orderData.basePrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ваша скидка:</span>
                                    <span>0</span>
                                </div>
                                <div className="flex justify-between border-b-2 border-black pb-2 mb-2">
                                    <span>Цена за единицу:</span>
                                    <span>{(totalPrice / orderData.quantity).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span>Итого:</span>
                                    <span>{totalPrice}</span>
                                </div>
                            </div>

                            <div className="mb-6 text-black">
                                <div className="font-bold">Готовность:</div>
                                <div className="text-lg">{dateStr}, {timeStr}</div>
                                <div className="text-[10px] text-gray-500 leading-tight mt-1">
                                    Дата готовности — ориентировочная<br/>
                                    и может отличаться от фактической
                                </div>
                            </div>

                            {/* Кнопка Оформить заказ */}
                            <button
                                type="button"
                                className="flex rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity w-full"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddToCart();
                                }}
                            >
                                <div
                                    className="bg-[#00C16E] text-white font-bold py-3 px-6 flex-grow flex items-center justify-center uppercase text-lg relative z-10 -mr-4"
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

                </div>
            </div>
        );
    };

    // --- ОБНОВЛЕННЫЙ RETURN ОСНОВНОГО КОМПОНЕНТА ---
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />

            <main className="max-w-[1200px] w-full mx-auto px-4 py-8 flex-grow">

                {/* --- ВЕРХНИЙ БАННЕР (ШАПКА) --- */}
                <div className="flex w-full mb-10 h-16">
                    {/* Левая часть: Категория (Кликабельна для возврата) */}
                    <div
                        className="relative bg-[#00C16E] text-white font-bold text-xl px-8 flex items-center h-full z-10 w-fit shrink-0 cursor-pointer uppercase"
                        onClick={() => { setActiveTab('MAIN'); setOrderData(null); }}
                    >
                        {/* Если мы в конфиге, показываем тип заказа (Визитки/Флаеры), иначе "Цифровая печать" */}
                        {activeTab === 'ORDER_CONFIG' ? (orderData?.type === 'VIZITKI' ? "ВИЗИТКИ" : "ФЛАЕРЫ") : "ЦИФРОВАЯ\nПЕЧАТЬ"}

                        <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent"></div>
                    </div>

                    {/* Правая часть: Заголовок страницы */}
                    <div className="bg-[#006837] flex-grow flex items-center px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-16">
                        {activeTab === 'ORDER_CONFIG' ? "ОФОРМЛЕНИЕ ЗАКАЗА" : "ВИЗИТКИ / ФЛАЕРЫ"}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mb-16">

                    {/* БОКОВОЕ МЕНЮ (Слева) */}
                    <div className="w-full md:w-1/5 flex flex-col gap-4 text-xl font-bold uppercase text-[#006837]">
                        <button
                            onClick={() => { setActiveTab('VIZITKI_FORMATS'); setOrderData(null); }}
                            className={`text-left transition-colors hover:text-[#00C16E] ${activeTab === 'VIZITKI_FORMATS' || (orderData?.type === 'VIZITKI') ? "text-[#00C16E]" : ""}`}
                        >
                            ВИЗИТКИ
                        </button>
                        <button
                            onClick={() => { setActiveTab('FLAERS_FORMATS'); setOrderData(null); }}
                            className={`text-left transition-colors hover:text-[#00C16E] ${activeTab === 'FLAERS_FORMATS' || (orderData?.type === 'FLAERS') ? "text-[#00C16E]" : ""}`}
                        >
                            ФЛАЕРЫ
                        </button>

                        {/* Кнопка "Назад" */}
                        {(activeTab === 'ORDER_CONFIG' || activeTab.includes('_FORMATS')) && activeTab !== 'MAIN' && (
                            <button
                                onClick={() => {
                                    if(activeTab === 'ORDER_CONFIG') setActiveTab(orderData?.type === 'VIZITKI' ? 'VIZITKI_FORMATS' : 'FLAERS_FORMATS');
                                    else setActiveTab('MAIN');
                                    setOrderData(null);
                                }}
                                className="text-sm text-gray-400 text-left mt-4 normal-case hover:text-gray-600 flex items-center gap-2"
                            >
                                <div className="w-8 h-2 bg-gray-400" style={{clipPath: "polygon(0% 50%, 30% 0%, 30% 100%)"}}></div>
                                назад в категорию
                            </button>
                        )}
                    </div>

                    {/* ОСНОВНОЙ КОНТЕНТ (Справа) */}
                    <div className="w-full md:w-4/5">
                        {activeTab === 'MAIN' && renderMainSelection()}
                        {activeTab === 'VIZITKI_FORMATS' && renderVizitkiDetails()}
                        {activeTab === 'FLAERS_FORMATS' && renderFlyersDetails()}
                        {activeTab === 'ORDER_CONFIG' && renderOrderConfig()}
                    </div>
                </div>

                {/* НИЖНИЙ БАННЕР */}
                <div
                    className="w-full bg-[#006837] py-6 px-12 md:px-20 text-white relative min-h-[120px] flex items-center"
                    style={{ clipPath: "polygon(50px 0, 100% 0, 100% 100%, 50px 100%, 0 50%)" }}
                >
                    <div className="text-lg md:text-xl font-medium leading-relaxed">
                        <span className="text-[#FFD700] font-bold">ПОМЕТКИ * </span>
                        ТИРАЖ - количество штук. Визитки от 25 до 500шт. <br/>
                        Формат 90х50мм или 85х55мм. <br/>
                        Превью в формате jpeg. Макет в Tiff, CMYK, 300dpi.
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );


    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="max-w-[1200px] w-full mx-auto px-4 py-8 flex-grow">
                <div className="flex w-full mb-10 h-16">
                    <div className="relative bg-[#00C16E] text-white font-bold text-xl px-8 flex items-center h-full z-10 w-fit shrink-0 cursor-pointer" onClick={() => { setActiveTab('MAIN'); setOrderData(null); }}>
                        ЦИФРОВАЯ<br />ПЕЧАТЬ
                        <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent"></div>
                    </div>
                    <div className="bg-[#006837] flex-grow flex items-center px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-16">
                        {activeTab === 'ORDER_CONFIG' ? "ОФОРМЛЕНИЕ ЗАКАЗА" : "ВИЗИТКИ / ФЛАЕРЫ"}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mb-16">
                    <div className="w-full md:w-1/4 flex flex-col gap-4 text-xl font-bold uppercase text-[#006837]">
                        <button onClick={() => { setActiveTab('VIZITKI_FORMATS'); setOrderData(null); }} className={`text-left transition-colors hover:text-[#00C16E] ${activeTab === 'VIZITKI_FORMATS' || (orderData?.type === 'VIZITKI') ? "text-[#00C16E]" : ""}`}>ВИЗИТКИ</button>
                        <button onClick={() => { setActiveTab('FLAERS_FORMATS'); setOrderData(null); }} className={`text-left transition-colors hover:text-[#00C16E] ${activeTab === 'FLAERS_FORMATS' || (orderData?.type === 'FLAERS') ? "text-[#00C16E]" : ""}`}>ФЛАЕРЫ</button>
                        {activeTab === 'ORDER_CONFIG' && (<button onClick={() => { setActiveTab(orderData?.type === 'VIZITKI' ? 'VIZITKI_FORMATS' : 'FLAERS_FORMATS'); setOrderData(null); }} className="text-sm text-gray-400 text-left mt-4 normal-case hover:text-gray-600 flex items-center gap-2">назад в категорию</button>)}
                    </div>

                    <div className="w-full md:w-3/4">
                        {activeTab === 'MAIN' && renderMainSelection()}
                        {activeTab === 'VIZITKI_FORMATS' && renderVizitkiDetails()}
                        {activeTab === 'FLAERS_FORMATS' && renderFlyersDetails()}
                        {activeTab === 'ORDER_CONFIG' && renderOrderConfig()}
                    </div>
                </div>

                <div className="w-full bg-[#006837] py-6 px-12 md:px-20 text-white relative min-h-[120px] flex items-center" style={{ clipPath: "polygon(50px 0, 100% 0, 100% 100%, 50px 100%, 0 50%)" }}>
                    <div className="text-lg md:text-xl font-medium leading-relaxed">
                        <span className="text-[#FFD700] font-bold">ВАЖНО! </span>МАКЕТ ПРИНИМАЕТСЯ К ПЕЧАТИ В ФОРМАТЕ TIFF, <span className="font-bold"> РАЗМЕР 1:1</span>, CMYK, 300 dpi.
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DigitalPrintingPage;
