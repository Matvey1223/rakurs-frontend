"use client"
import React, { useState, useEffect } from "react";
// Импортируйте ваши Header и Footer
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

// --- ТИПЫ ДАННЫХ ---
type PlotterCategory = 'COLOR_FILM' | 'PRINT_CUT' | 'STICKERS';
type ViewState = 'MAIN_SELECTION' | 'ORDER_CONFIG';

interface Material {
    id: string;
    title: string;
    category: PlotterCategory;
    image: string;
    priceBase: number;
    priceFull: number;
    hasColorPalette: boolean;
    maxWidthInfo: string;
    limitWidth: number;
    limitHeight?: number;
    isUV?: boolean;
}

// --- ДАННЫЕ ПАЛИТРЫ ---
const PALETTE_ROWS = [
    [
        { id: '010', hex: '#FFFFFF', text: 'black' }, { id: '020', hex: '#FFAE00' }, { id: '019', hex: '#E59F00' },
        { id: '021', hex: '#FFCC00' }, { id: '022', hex: '#FFD700' }, { id: '025', hex: '#FFEE00' },
        { id: '312', hex: '#800000' }, { id: '030', hex: '#B30000' }, { id: '031', hex: '#D60000' },
        { id: '032', hex: '#FF0000' }, { id: '047', hex: '#FF4500' }, { id: '034', hex: '#FF6600' },
        { id: '036', hex: '#FF8C00' }, { id: '035', hex: '#FF7F50' }, { id: '404', hex: '#4B0082' },
        { id: '040', hex: '#800080' }, { id: '043', hex: '#9932CC' }, { id: '042', hex: '#C8A2C8' },
        { id: '041', hex: '#C71585' }, { id: '045', hex: '#FF69B4' }, { id: '562', hex: '#191970' }, { id: '518', hex: '#000080' }
    ],
    [
        { id: '050', hex: '#00008B' }, { id: '065', hex: '#0000CD' }, { id: '049', hex: '#4169E1' },
        { id: '086', hex: '#1E90FF' }, { id: '067', hex: '#00BFFF' }, { id: '057', hex: '#87CEEB' },
        { id: '051', hex: '#0000FF' }, { id: '098', hex: '#4682B4' }, { id: '052', hex: '#6495ED' },
        { id: '084', hex: '#87CEFA' }, { id: '053', hex: '#ADD8E6' }, { id: '056', hex: '#B0E0E6' },
        { id: '066', hex: '#008080' }, { id: '054', hex: '#20B2AA' }, { id: '055', hex: '#40E0D0' },
        { id: '060', hex: '#2E8B57' }, { id: '613', hex: '#006400' }, { id: '061', hex: '#008000' },
        { id: '068', hex: '#228B22' }, { id: '062', hex: '#32CD32' }, { id: '064', hex: '#7CFC00' }, { id: '063', hex: '#7FFF00' }
    ],
    [
        { id: '800', hex: '#4B3621' }, { id: '083', hex: '#8B4513' }, { id: '081', hex: '#CD853F' },
        { id: '082', hex: '#D2B48C' }, { id: '023', hex: '#F5DEB3' }, { id: '070', hex: '#000000' },
        { id: '073', hex: '#696969' }, { id: '071', hex: '#808080' }, { id: '076', hex: '#A9A9A9' },
        { id: '074', hex: '#C0C0C0' }, { id: '072', hex: '#D3D3D3' }, { id: '090', hex: '#E0E0E0' },
        { id: '091', hex: '#B8860B' }, { id: '092', hex: '#DAA520' }
    ]
];

// Компонент обертка поля
const FormField = ({ label, error, children }: { label: string, error?: boolean, children: React.ReactNode }) => (
    <div className="flex flex-col w-full">
        <label className={`font-bold text-[10px] uppercase mb-1 h-3 flex items-center ${error ? 'text-red-600' : 'text-black'}`}>
            {label} {error && " (!)"}
        </label>
        {children}
    </div>
);

const WideFormatPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<PlotterCategory>('COLOR_FILM');
    const [viewState, setViewState] = useState<ViewState>('MAIN_SELECTION');
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    const [width, setWidth] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("1");
    const [includeWeeding, setIncludeWeeding] = useState<boolean>(false);
    const [colorCode, setColorCode] = useState<string>("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [comments, setComments] = useState("");
    const [sizeError, setSizeError] = useState<string | null>(null);

    // --- БАЗА ДАННЫХ ---
    const colorFilmMats: Material[] = [
        { id: "oracal_641", title: "ОРАКАЛ СЕРИИ 641", category: 'COLOR_FILM', image: "https://placehold.co/400x300/white/006837?text=641", priceBase: 2350, priceFull: 3150, hasColorPalette: true, maxWidthInfo: "плёнок 641 и 8500 по 0,9м", limitWidth: 0.9 },
        { id: "oracal_8500", title: "ОРАКАЛ СЕРИИ 8500", category: 'COLOR_FILM', image: "https://placehold.co/400x300/white/006837?text=8500", priceBase: 3350, priceFull: 4150, hasColorPalette: true, maxWidthInfo: "плёнок 641 и 8500 по 0,9м", limitWidth: 0.9 },
        { id: "holographic", title: "ГОЛОГРАФИЧЕСКАЯ ПЛЕНКА", category: 'COLOR_FILM', image: "https://placehold.co/400x300/white/006837?text=HOLO", priceBase: 2250, priceFull: 3050, hasColorPalette: false, maxWidthInfo: "голографической плёнки по 1,2м", limitWidth: 1.2 }
    ];

    const printCutMats: Material[] = [
        { id: "print_orajet", title: "ПЕЧАТЬ ОРАДЖЕТ", category: 'PRINT_CUT', image: "https://placehold.co/400x300/white/006837?text=Orajet", priceBase: 1150, priceFull: 2000, hasColorPalette: false, maxWidthInfo: "ораджет пленки по 1,2м", limitWidth: 1.2 },
        { id: "uv_oracal_641", title: "УФ ПЕЧАТЬ ОРАКАЛ СЕРИИ 641", category: 'PRINT_CUT', image: "https://placehold.co/400x300/white/006837?text=UV+641", priceBase: 3900, priceFull: 4700, hasColorPalette: false, maxWidthInfo: "уф по полю: 850х550мм", limitWidth: 0.85, limitHeight: 0.55, isUV: true },
        { id: "print_holographic", title: "ПЕЧАТЬ ГОЛОГРАФИЧЕСКАЯ ПЛЕНКА", category: 'PRINT_CUT', image: "https://placehold.co/400x300/white/006837?text=Print+Holo", priceBase: 1400, priceFull: 2200, hasColorPalette: false, maxWidthInfo: "1,2м", limitWidth: 1.2 }
    ];

    const stickersMats: Material[] = [
        { id: "st_orajet", title: "ПЕЧАТЬ ОРАДЖЕТ", category: 'STICKERS', image: "https://placehold.co/400x300/white/006837?text=Sticker+Orajet", priceBase: 1150, priceFull: 2000, hasColorPalette: false, maxWidthInfo: "1,2м", limitWidth: 1.2 },
        { id: "st_oracal", title: "ПЕЧАТЬ ОРАКАЛ", category: 'STICKERS', image: "https://placehold.co/400x300/white/006837?text=Sticker+Oracal", priceBase: 1250, priceFull: 2100, hasColorPalette: false, maxWidthInfo: "1,2м", limitWidth: 1.2 },
        { id: "st_holo", title: "ПЕЧАТЬ ГОЛОГРАФИЧЕСКАЯ ПЛЕНКА", category: 'STICKERS', image: "https://placehold.co/400x300/white/006837?text=Sticker+Holo", priceBase: 1400, priceFull: 2400, hasColorPalette: false, maxWidthInfo: "1,2м", limitWidth: 1.2 },
        { id: "st_uv_complex", title: "УФ ПЕЧАТЬ ОРАДЖЕТ / ОРАКАЛ СЕРИИ 641 / ГОЛОГРАФИЧЕСКАЯ ПЛЕНКА", category: 'STICKERS', image: "https://placehold.co/400x300/white/006837?text=UV+Mix", priceBase: 1500, priceFull: 2500, hasColorPalette: false, maxWidthInfo: "уф по полю: 850х550мм", limitWidth: 0.85, limitHeight: 0.55, isUV: true }
    ];

    // --- ЛОГИКА ---
    const getCurrentMaterials = () => {
        switch (activeCategory) {
            case 'COLOR_FILM': return colorFilmMats;
            case 'PRINT_CUT': return printCutMats;
            case 'STICKERS': return stickersMats;
            default: return [];
        }
    };

    const getHeaderText = () => {
        switch (activeCategory) {
            case 'COLOR_FILM': return "ЦВЕТНАЯ ПЛЕНКА / ПОДРЕЗКА / ВЫБОРКА / МОНТАЖНАЯ ПЛЕНКА";
            case 'PRINT_CUT': return "ПЕЧАТЬ / ПОДРЕЗКА / ВЫБОРКА / МОНТАЖНАЯ ПЛЕНКА";
            case 'STICKERS': return "НАКЛЕЙКИ С ПОДРЕЗКОЙ < 50 ММ";
            default: return "";
        }
    };

    const handleMaterialSelect = (mat: Material) => {
        setSelectedMaterial(mat);
        setViewState('ORDER_CONFIG');
        setWidth(""); setHeight(""); setQuantity("1");
        setIncludeWeeding(false); setColorCode("");
        setSizeError(null);
        window.scrollTo(0, 0);
    };

    // ВАЛИДАЦИЯ
    useEffect(() => {
        if (!selectedMaterial) return;
        const w = parseFloat(width.replace(',', '.')) || 0;
        const h = parseFloat(height.replace(',', '.')) || 0;

        if (w === 0 || h === 0) {
            setSizeError(null);
            return;
        }

        if (selectedMaterial.isUV) {
            const fitNormal = w <= selectedMaterial.limitWidth && h <= (selectedMaterial.limitHeight || 0);
            const fitRotated = h <= selectedMaterial.limitWidth && w <= (selectedMaterial.limitHeight || 0);
            if (!fitNormal && !fitRotated) {
                setSizeError(`Макс: ${selectedMaterial.limitWidth}x${selectedMaterial.limitHeight}м`);
            } else {
                setSizeError(null);
            }
        } else {
            const minSide = Math.min(w, h);
            if (minSide > selectedMaterial.limitWidth) {
                setSizeError(`Макс. ширина: ${selectedMaterial.limitWidth}м`);
            } else {
                setSizeError(null);
            }
        }
    }, [width, height, selectedMaterial]);

    const calculateTotal = () => {
        if (!selectedMaterial || sizeError) return 0;
        const w = parseFloat(width.replace(',', '.')) || 0;
        const h = parseFloat(height.replace(',', '.')) || 0;
        const qty = parseInt(quantity) || 0;
        const area = w * h * qty;
        const pricePerSqM = includeWeeding ? selectedMaterial.priceFull : selectedMaterial.priceBase;
        return Math.round(area * pricePerSqM);
    };

    const totalPrice = calculateTotal();
    const pricePerUnit = quantity && parseInt(quantity) > 0 ? (totalPrice / parseInt(quantity)).toFixed(0) : 0;

    const readyDate = new Date();
    readyDate.setDate(readyDate.getDate() + 4);
    const dateStr = readyDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedDay = new Date().toLocaleDateString('ru-RU', { weekday: 'long' }).charAt(0).toUpperCase() + new Date().toLocaleDateString('ru-RU', { weekday: 'long' }).slice(1);

    // --- РЕНДЕРЫ ---
    const renderMaterialSelection = () => {
        const materials = getCurrentMaterials();
        const gridClass = activeCategory === 'STICKERS'
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 items-start"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 items-start";

        return (
            <div className={`${gridClass} animate-fade-in`}>
                {materials.map((mat) => (
                    <div key={mat.id} onClick={() => handleMaterialSelect(mat)} className="cursor-pointer group flex flex-col w-full">
                        <div className="rounded-[20px] border border-black overflow-hidden aspect-square mb-3 relative bg-white shadow-sm group-hover:shadow-md transition-shadow">
                            <img src={mat.image} alt={mat.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-[#006837] uppercase text-sm leading-tight max-w-[240px]">
                            {mat.title.includes('/') ? mat.title.split(' / ').map((t, i) => <div key={i}>{t}{i < mat.title.split(' / ').length -1 && ' /'}</div>) : mat.title}
                        </h3>
                    </div>
                ))}
            </div>
        );
    };

    const renderPalette = () => (
        <div className="flex w-full mb-8 items-stretch overflow-x-auto pb-2">
            <div className="flex flex-col gap-1 flex-grow min-w-[600px]">
                {PALETTE_ROWS.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-[2px]">
                        {row.map((c) => (
                            <div key={c.id} className="w-8 h-10 relative border border-[#006837]/30 cursor-pointer hover:scale-110 transition-transform bg-white overflow-hidden"
                                 style={{ backgroundColor: c.hex }} title={`Цвет ${c.id}`} onClick={() => setColorCode(c.id)}>
                                <span className={`absolute bottom-0 right-1 text-[9px] font-bold origin-bottom-right transform -rotate-90 whitespace-nowrap ${c.text === 'black' ? 'text-black' : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'}`}>{c.id}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="bg-[#D60000] text-white flex flex-col justify-center items-center px-4 py-2 ml-2 max-w-[200px] shrink-0 h-auto self-stretch">
                <div className="text-3xl font-bold mb-1 leading-none">!ВНИМАНИЕ!</div>
                <div className="text-xs font-bold leading-tight text-center">ЦВЕТА<br/>ПРЕДСТАВЛЕННЫЕ<br/>В РАСКЛАДКЕ -<br/>ОРИЕНТИРОВОЧНЫЕ!</div>
            </div>
        </div>
    );

    // --- РЕНДЕР: ФОРМА ЗАКАЗА (КАЛЬКУЛЯТОР СНИЗУ) ---
    const renderOrderConfig = () => {
        if (!selectedMaterial) return null;

        return (
            <div className="w-full text-[#006837] animate-fade-in">
                <button onClick={() => setViewState('MAIN_SELECTION')} className="mb-6 flex items-center gap-2 text-sm font-bold uppercase hover:underline">← Назад к выбору</button>

                {/* ВЕРТИКАЛЬНЫЙ СТЕК: Сначала форма, потом расчет */}
                <div className="flex flex-col gap-10">

                    {/* БЛОК 1: ФОРМА (ЛЕВАЯ ЧАСТЬ) */}
                    <div className="w-full">
                        <div className="flex flex-col md:flex-row gap-8 mb-4">
                            {/* ФОТО */}
                            <div className="w-full md:w-[200px] shrink-0">
                                <div className="rounded border border-black overflow-hidden aspect-square bg-white mb-2 shadow-sm">
                                    <img src={selectedMaterial.image} alt={selectedMaterial.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-black uppercase text-xs leading-tight">{selectedMaterial.title}</h3>
                            </div>

                            {/* ИНПУТЫ */}
                            <div className="flex-grow flex flex-col gap-6">
                                {/* РЯД 1 */}
                                <div className="flex flex-col sm:flex-row gap-8">
                                    <div className="w-full sm:w-1/2">
                                        <FormField label="ТИРАЖ (шт)*">
                                            <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-lg focus:outline-none" />
                                        </FormField>
                                    </div>
                                    <div className="w-full sm:w-1/2 flex gap-4 items-end">
                                        <div className="flex-grow">
                                            <FormField label="ПЛОТТЕРНАЯ ПОРЕЗКА*">
                                                <div className="w-full border-2 border-[#006837] rounded-lg h-10 px-3 flex items-center text-gray-500 font-bold text-sm bg-gray-50 truncate">ВКЛЮЧЕНО</div>
                                            </FormField>
                                        </div>
                                        <button className="bg-[#006837] hover:bg-[#00522b] text-white uppercase font-bold text-xs px-4 rounded h-10 transition-colors shrink-0 mb-0">ЗАКАЗАТЬ МАКЕТ</button>
                                    </div>
                                </div>
                                {/* РЯД 2 */}
                                <div className="flex flex-col sm:flex-row gap-8">
                                    <div className="w-full sm:w-1/2">
                                        <FormField label="ДЛИНА (м)*" error={!!sizeError}>
                                            <input type="number" step="0.01" value={height} onChange={e => setHeight(e.target.value)} className={`w-full border-2 rounded-lg h-10 px-3 font-bold text-lg focus:outline-none ${sizeError ? 'border-red-500 bg-red-50' : 'border-[#006837]'}`} />
                                        </FormField>
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <FormField label="ВЫБОРКА, МОНТАЖНАЯ ПЛЕНКА*">
                                            <div onClick={() => setIncludeWeeding(!includeWeeding)} className="w-full border-2 border-[#006837] rounded-lg h-10 px-3 flex items-center font-bold text-lg cursor-pointer select-none transition-colors hover:bg-green-50">
                                                <span className={includeWeeding ? "text-[#006837]" : "text-gray-400"}>{includeWeeding ? "ДА" : "НЕТ"}</span>
                                            </div>
                                        </FormField>
                                    </div>
                                </div>
                                {/* РЯД 3 */}
                                <div className="flex flex-col sm:flex-row gap-8">
                                    <div className="w-full sm:w-1/2">
                                        <FormField label="ШИРИНА (м)*" error={!!sizeError}>
                                            <input type="number" step="0.01" value={width} onChange={e => setWidth(e.target.value)} className={`w-full border-2 rounded-lg h-10 px-3 font-bold text-lg focus:outline-none ${sizeError ? 'border-red-500 bg-red-50' : 'border-[#006837]'}`} />
                                        </FormField>
                                        {sizeError && <div className="text-red-600 text-xs font-bold mt-1 uppercase">{sizeError}</div>}
                                    </div>
                                    <div className="w-full sm:w-1/2">
                                        <FormField label="ЦВЕТ*">
                                            <input type="text" value={colorCode} onChange={e => setColorCode(e.target.value)} placeholder={selectedMaterial.hasColorPalette ? "Например: 063" : ""} disabled={!selectedMaterial.hasColorPalette} className="w-full border-2 border-[#006837] rounded-lg h-10 px-3 font-bold text-lg focus:outline-none placeholder:text-gray-300 disabled:bg-gray-100 disabled:border-gray-300" />
                                        </FormField>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedMaterial.hasColorPalette && renderPalette()}
                        {selectedMaterial.hasColorPalette && (
                            <div className="font-bold text-black uppercase text-xs mb-8">
                                ОРАКАЛ СЕРИИ {selectedMaterial.id.includes('641') ? '641' : '8500'}
                            </div>
                        )}

                        {/* Нижний блок загрузки */}
                        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-y-4 gap-x-8 items-start">
                            <div className="space-y-6 hidden md:block font-bold text-[#006837] uppercase text-sm mt-1">
                                <div className="h-10 flex items-center">ЗАГРУЗИТЕ МАКЕТ</div>
                                <div className="h-10 flex items-center pt-6">ЗАГРУЗИТЕ КОНТУР<br/>ПОДРЕЗКИ</div>
                                <div className="h-10 flex items-center pt-10">ПРЕВЬЮ МАКЕТА</div>
                                <div className="h-10 flex items-center pt-14">СПОСОБ ДОСТАВКИ</div>
                                <div className="h-10 flex items-center pt-10">КОММЕНТАРИИ<br/>К ЗАКАЗУ</div>
                            </div>
                            <div className="space-y-4 w-full max-w-[500px]">
                                {/* Инпуты загрузки... (сокращено, аналогично предыдущим версиям) */}
                                <div className="flex flex-col gap-1">
                                    <label className="cursor-pointer border-2 border-[#006837] rounded-md bg-white px-4 py-1 flex items-center gap-2 w-fit hover:bg-green-50 transition-colors">
                                        <span className="text-xl font-bold pb-1 text-[#006837]">📥</span>
                                        <span className="font-bold uppercase text-sm text-[#006837]">ЗАГРУЗИТЬ</span>
                                        <input type="file" className="hidden" />
                                    </label>
                                    <span className="text-[9px] font-bold text-[#006837] uppercase">ФОРМАТ TIFF</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="cursor-pointer border-2 border-[#006837] rounded-md bg-white px-4 py-1 flex items-center gap-2 w-fit hover:bg-green-50 transition-colors">
                                        <span className="text-xl font-bold pb-1 text-[#006837]">📥</span>
                                        <span className="font-bold uppercase text-sm text-[#006837]">ЗАГРУЗИТЬ</span>
                                        <input type="file" className="hidden" />
                                    </label>
                                    <span className="text-[9px] font-bold text-[#006837] uppercase">ФОРМАТ EPS</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="cursor-pointer border-2 border-[#006837] rounded-md bg-white px-4 py-1 flex items-center gap-2 w-fit hover:bg-green-50 transition-colors">
                                        <span className="text-xl font-bold pb-1 text-[#006837]">📥</span>
                                        <span className="font-bold uppercase text-sm text-[#006837]">ЗАГРУЗИТЬ</span>
                                        <input type="file" className="hidden" />
                                    </label>
                                    <span className="text-[9px] font-bold text-[#006837] uppercase">ФОРМАТ JPEG</span>
                                </div>
                                <div><input type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className="border-2 border-[#006837] rounded-xl w-full h-10 px-3 focus:outline-none" /></div>
                                <div><input value={comments} onChange={e => setComments(e.target.value)} className="border-2 border-[#006837] rounded-xl w-full h-10 px-3 focus:outline-none" /></div>
                                <div className="flex items-center gap-2 pt-2"><input type="checkbox" className="w-5 h-5 border-2 border-[#006837] rounded accent-[#006837]" /><span className="text-xs font-bold text-black">Проверить макет на соответствие требований к печати</span></div>
                            </div>
                        </div>
                    </div>

                    {/* БЛОК 2: РАСЧЕТ (ТЕПЕРЬ СНИЗУ) */}
                    <div className="w-full border-2 border-[#006837] rounded-xl p-6 bg-white shadow-sm mt-4">
                        <h3 className="font-bold text-xl uppercase text-black mb-6">РАСЧЕТ:</h3>

                        {/* Горизонтальная раскладка на десктопе */}
                        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8">

                            {/* Цены */}
                            <div className="space-y-1 text-sm font-bold text-black min-w-[200px]">
                                <div className="flex justify-between gap-4"><span>Сумма:</span><span>{totalPrice}</span></div>
                                <div className="flex justify-between gap-4"><span>Ваша скидка:</span><span>0</span></div>
                                <div className="flex justify-between gap-4 border-b-2 border-[#006837] pb-1 mb-1"><span>Цена за единицу:</span><span>{pricePerUnit}</span></div>
                                <div className="flex justify-between gap-4 text-lg mt-2"><span>Итого:</span><span>{totalPrice}</span></div>
                            </div>

                            {/* Дата готовности */}
                            <div className="mb-2 text-black flex-grow lg:text-center">
                                <div className="font-bold">Готовность:</div>
                                <div className="text-base font-normal">{formattedDay}, {dateStr}, 15:00</div>
                                <div className="text-[10px] text-gray-500 leading-tight mt-1">Дата готовности — ориентировочная и может отличаться от фактической</div>
                            </div>

                            {/* Кнопка */}
                            <div className={`flex rounded-md overflow-hidden cursor-pointer transition-opacity h-12 lg:w-1/3 max-w-sm ${sizeError ? 'opacity-50 pointer-events-none' : 'hover:opacity-90'}`}>
                                <div className={`bg-[#00C16E] text-white font-bold px-4 flex-grow flex items-center justify-center uppercase text-lg text-center ${sizeError ? 'bg-gray-400' : ''}`}>
                                    {sizeError ? "НЕВЕРНЫЙ РАЗМЕР" : "ОФОРМИТЬ ЗАКАЗ"}
                                </div>
                                <div className={`bg-[#006837] text-white w-14 flex items-center justify-center relative ${sizeError ? 'bg-gray-600' : ''}`}>
                                    <div className={`absolute left-0 top-0 bottom-0 w-4 transform -skew-x-12 origin-top-left ${sizeError ? 'bg-gray-400' : 'bg-[#00C16E]'}`}></div>
                                    <span className="text-2xl z-10 relative">🛒</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    const renderFooterInfo = () => {
        return (
            <div className="w-full bg-white text-black py-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b-2 border-[#E53935] pb-2">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#E53935] uppercase">ПОМЕТКИ *</h2>
                    {selectedMaterial?.maxWidthInfo && (
                        <h3 className="text-xl font-bold text-black max-w-sm text-right mt-2 md:mt-0 leading-tight">
                            {selectedMaterial.isUV ? "Предельный размер УФ по полю:" : "Предельный размер по ширине:"} <br/>{selectedMaterial.maxWidthInfo}
                        </h3>
                    )}
                </div>
                <div className="text-sm font-medium leading-relaxed uppercase">
                    ТИРАЖ - количество штук одного макета<br/>
                    Размеры считаются в м : Длина/ширина<br/>
                    Плоттерная порезка/выборка и монтажная пленка в м - по размеру макета<br/>
                    {selectedMaterial?.hasColorPalette && "Цвет - выбирается из представленной внизу раскладке. нужно сделать чтобы в графе выбора высвечивался номер цвета и сам цвет\n"}
                    Превью в формате jpeg<br/>
                    Макет загружается в формате EPS, размер 1:1, без прозрачности.

                    {selectedMaterial && (
                        <div className="mt-4">
                            <h4 className="text-[#E53935] font-bold mb-2">Калькулятор стоимости:</h4>

                            {selectedMaterial.isUV ? (
                                <p className="mb-2 font-bold normal-case">Площадь считается по размеру макета разложенного на поле 0,85х0,55м</p>
                            ) : (
                                <p className="mb-2 normal-case">Площадь пленки в кв.м (длина x ширина), площадь считается по размеру макета</p>
                            )}

                            <p>
                                {selectedMaterial.title.replace('СЕРИИ', 'серии').toLowerCase()} + плоттерная порезка = {selectedMaterial.priceBase}р/кв.м<br/>
                                {selectedMaterial.title.replace('СЕРИИ', 'серии').toLowerCase()} + плоттерная порезка + выборка и монтажная пленка = {selectedMaterial.priceFull}р/кв.м
                            </p>
                            <p className="mt-4 font-bold text-[#00C16E]">Срок готовности 3-5 рабочих дней</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="max-w-[1300px] w-full mx-auto px-4 py-8 flex-grow">
                <div className="flex w-full mb-10 h-16 filter drop-shadow-sm">
                    <div className="bg-[#00C16E] text-white font-bold text-xl px-10 flex items-center h-full relative z-10 cursor-pointer uppercase tracking-wide" onClick={() => { setViewState('MAIN_SELECTION'); setSelectedMaterial(null); }}>
                        ПЛОТТЕР
                        <div className="absolute top-0 right-[-30px] w-0 h-0 border-t-[32px] border-t-transparent border-l-[30px] border-l-[#00C16E] border-b-[32px] border-b-transparent z-20"></div>
                    </div>
                    <div className="bg-[#006837] flex-grow flex items-center h-full text-white font-bold text-lg md:text-xl uppercase tracking-wider pl-16 pr-8 truncate">
                        {viewState === 'ORDER_CONFIG' && selectedMaterial ? selectedMaterial.title : getHeaderText()}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 mb-16">
                    <div className="w-full lg:w-[240px] shrink-0 flex flex-col gap-8 text-[#00C16E] font-bold text-lg leading-tight uppercase">
                        <button onClick={() => { setActiveCategory('COLOR_FILM'); setViewState('MAIN_SELECTION'); }} className={`text-left transition-colors ${activeCategory === 'COLOR_FILM' ? "text-[#00C16E]" : "text-[#00C16E]/60"}`}>ЦВЕТНАЯ ПЛЕНКА<br/>ПОДРЕЗКА<br/>ВЫБОРКА<br/>МОНТАЖНАЯ<br/>ПЛЕНКА</button>
                        <button onClick={() => { setActiveCategory('PRINT_CUT'); setViewState('MAIN_SELECTION'); }} className={`text-left transition-colors ${activeCategory === 'PRINT_CUT' ? "text-[#00C16E]" : "text-[#00C16E]/60"}`}>ПЕЧАТЬ<br/>ПОДРЕЗКА<br/>ВЫБОРКА<br/>МОНТАЖНАЯ<br/>ПЛЕНКА</button>
                        <button onClick={() => { setActiveCategory('STICKERS'); setViewState('MAIN_SELECTION'); }} className={`text-left transition-colors ${activeCategory === 'STICKERS' ? "text-[#00C16E]" : "text-[#00C16E]/60"}`}>НАКЛЕЙКИ<br/>С ПОДРЕЗКОЙ<br/>&lt; 50мм</button>
                    </div>

                    <div className="flex-grow">
                        {viewState === 'MAIN_SELECTION' && renderMaterialSelection()}
                        {viewState === 'ORDER_CONFIG' && renderOrderConfig()}
                    </div>
                </div>
                {viewState === 'ORDER_CONFIG' && renderFooterInfo()}
            </main>
            <Footer />
        </div>
    );
};

export default WideFormatPage;