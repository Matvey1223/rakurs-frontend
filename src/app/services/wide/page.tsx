"use client"
import React, { useState, useEffect } from "react";
// Импортируй свои Header и Footer
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { useCart, CartItem } from "../../../../context/CartContext";

// --- ТИПЫ ДАННЫХ ---
type CategoryType = 'BANNER' | 'FILM' | 'PAPER' | 'CANVAS';
type ViewState = 'MAIN_SELECTION' | 'ORDER_CONFIG';

// Интерфейс материала (Ламинированный, Литой и т.д.)
interface Material {
    id: string;
    title: string;
    subtitle: string; // "плотность 440гр"
    pricePerSqM: number; // Цена за кв.м.
    image: string; // URL картинки
    maxWidth?: number; // Максимальная ширина для пленок
}

// Интерфейс данных заказа
interface OrderData {
    category: CategoryType;
    material: Material;
    width: number; // метры
    height: number; // метры
    quantity: number; // штуки
    soldering: number; // метры (пропайка)
    eyelets: number; // штуки
    valves: number; // штуки (клапаны)
    isCutting: boolean; // подрезка по периметру
}

const WideFormatPage: React.FC = () => {
    // --- СОСТОЯНИЯ ---
    const [activeCategory, setActiveCategory] = useState<CategoryType>('BANNER');
    const [viewState, setViewState] = useState<ViewState>('MAIN_SELECTION');

    // Выбранный материал для заказа
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

    // Поля формы калькулятора
    const [width, setWidth] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [quantity, setQuantity] = useState<string>("1");
    const [soldering, setSoldering] = useState<string>(""); // Пропайка - для баннеров
    const [solderingType, setSolderingType] = useState<string>(""); // Тип пропайки для баннеров
    const [eyelets, setEyelets] = useState<string>(""); // Люверсы - для баннеров
    const [valves, setValves] = useState<string>(""); // Клапаны - для баннеров
    const [isCutting, setIsCutting] = useState<boolean>(false); // Подрезка по периметру
    const [widthError, setWidthError] = useState<string | null>(null);
    
    // Дополнительные поля для пленок
    const [lamination, setLamination] = useState<boolean>(false); // Ламинация
    const [plotterCutting, setPlotterCutting] = useState<boolean>(false); // Плоттерная порезка
    const [weeding, setWeeding] = useState<boolean>(false); // Выборка/монтажная пленка

    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [comments, setComments] = useState("");
    const [checkLayout, setCheckLayout] = useState(false);
    
    // Состояния для файлов
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [cuttingFile, setCuttingFile] = useState<File | null>(null); // Контур подрезки (EPS) - для пленок
    
    const { addItem } = useCart();

    // --- ДАННЫЕ МАТЕРИАЛОВ ---
    const bannerMaterials: Material[] = [
        {
            id: "laminated",
            title: "ЛАМИНИРОВАННЫЙ",
            subtitle: "плотность 440гр",
            pricePerSqM: 650,
            image: "/large_format/banner/laminated.jpg" // Замени на свое фото
        },
        {
            id: "cast",
            title: "ЛИТОЙ",
            subtitle: "плотность 510гр",
            pricePerSqM: 750,
            image: "/large_format/banner/cast.jpg" // Замени на свое фото
        },
        {
            id: "mesh",
            title: "ПЕРФОРИРОВАННЫЙ",
            subtitle: "плотность 360гр", // Сетка
            pricePerSqM: 750,
            image: "/large_format/banner/perforated.jpg" // Замени на свое фото
        }
    ];

    const filmMaterials: Material[] = [
        {
            id: "orafol",
            title: "ОРАФОЛ",
            subtitle: "",
            pricePerSqM: 750, // Орафол/ораджет = 750р/кв.м
            maxWidth: 1.58, // Орафол/ораджет под печать 1,58м
            image: "/large_format/film/orafol.jpg"
        },
        {
            id: "blackout",
            title: "БЛЕКАУТ",
            subtitle: "",
            pricePerSqM: 750, // Блекаут (используем базовую цену)
            maxWidth: 1.26, // Блекаут 1,26м
            image: "/large_format/film/blackout.jpg"
        },
        {
            id: "perfofilm",
            title: "ПЕРФОПЛЕНКА",
            subtitle: "",
            pricePerSqM: 850, // Перфорированная пленка = 850р/кв.м
            maxWidth: 1.35, // Перфорация 1,35м
            image: "/large_format/film/perfofilm.jpg"
        },
        {
            id: "holographic_film",
            title: "ГОЛОГРАФИЧЕСКАЯ",
            subtitle: "",
            pricePerSqM: 1000, // Голографическая пленка = 1000р/кв.м
            maxWidth: 1.18, // Голографическая 1,18м
            image: "/large_format/film/holographic.jpg"
        }
    ];

    const paperMaterials: Material[] = [
        {
            id: "blueback",
            title: "БЛЮБЭК",
            subtitle: "",
            pricePerSqM: 500,
            maxWidth: 1.54,
            image: "/large_format/paper/blueback.png" // Замени на свое фото
        },
        {
            id: "backlit",
            title: "БЭКЛИТ",
            subtitle: "",
            pricePerSqM: 600,
            maxWidth: 1.18,
            image: "/large_format/paper/backlit.png" // Замени на свое фото
        },
    ];

    const canvasMaterials: Material[] = [
        {
            id: "canvas",
            title: "ХОЛСТ",
            subtitle: "",
            pricePerSqM: 2500,
            maxWidth: 1.25,
            image: "/large_format/canvas/canvas.png" // Замени на свое фото
        },
    ];

    // --- ЛОГИКА ---

    // Переход к оформлению
    const handleMaterialSelect = (mat: Material) => {
        setSelectedMaterial(mat);
        setViewState('ORDER_CONFIG');
        // Сброс полей
        setWidth(""); setHeight(""); setQuantity("1");
        setSoldering(""); setSolderingType(""); setEyelets(""); setValves(""); setIsCutting(false);
        setLamination(false); setPlotterCutting(false); setWeeding(false);
        setDeliveryAddress(""); setComments(""); setCheckLayout(false);
        setWidthError(null);
        // Сброс файлов
        setFrontFile(null); setPreviewFile(null); setCuttingFile(null);
        window.scrollTo(0, 0);
    };
    
    // Валидация ширины (зависит от категории и материала)
    useEffect(() => {
        if (!width || !selectedMaterial) {
            setWidthError(null);
            return;
        }

        const w = parseFloat(width.replace(',', '.')) || 0;
        const maxWidth = selectedMaterial.maxWidth ?? 3.1;
        const maxWidthLabel = maxWidth.toString().replace('.', ',');

        if (w > maxWidth) {
            setWidthError(`Максимальная ширина: ${maxWidthLabel}м`);
        } else {
            setWidthError(null);
        }
    }, [width, selectedMaterial, activeCategory]);
    
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
        if (!selectedMaterial) return;
        
        try {
            const readyDate = new Date();
            readyDate.setDate(readyDate.getDate() + 4);
            const dayOfWeek = readyDate.toLocaleDateString('ru-RU', { weekday: 'long' });
            const formattedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
            const dateStr = readyDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
            const fullDateStr = `${formattedDay}, ${dateStr}г.`;
            const timeStr = "15:00";
            
            // Конвертируем файлы в base64
            let frontFileBase64: string | undefined;
            let previewFileBase64: string | undefined;
            let cuttingFileBase64: string | undefined;
            
            try {
                if (frontFile) {
                    frontFileBase64 = await fileToBase64(frontFile);
                }
                if (previewFile) {
                    previewFileBase64 = await fileToBase64(previewFile);
                }
                if (cuttingFile) {
                    cuttingFileBase64 = await fileToBase64(cuttingFile);
                }
            } catch (fileError) {
                console.error('Ошибка при конвертации файлов:', fileError);
                alert('Ошибка при обработке файлов. Товар будет добавлен без файлов.');
            }
            
            const cartItem: CartItem = {
                id: `wide-${activeCategory}-${selectedMaterial.id}-${Date.now()}`,
                type: activeCategory === 'FILM' ? 'FILM' : 'WIDE_FORMAT',
                format: `${width}x${height}м`,
                quantity: parseInt(quantity) || 1,
                basePrice: totalPrice,
                specs: selectedMaterial.title,
                totalPrice: totalPrice,
                deliveryAddress: deliveryAddress || undefined,
                comments: comments || undefined,
                checkLayout: checkLayout || undefined,
                readyDate: fullDateStr,
                readyTime: timeStr,
                // Файлы
                frontFile: frontFileBase64,
                backFile: cuttingFileBase64, // Используем backFile для контура подрезки
                previewFile: previewFileBase64,
                frontFileName: frontFile?.name,
                backFileName: cuttingFile?.name,
                previewFileName: previewFile?.name,
                frontFileSize: frontFile?.size,
                backFileSize: cuttingFile?.size,
                previewFileSize: previewFile?.size,
                frontFileType: frontFile?.type,
                backFileType: cuttingFile?.type,
                previewFileType: previewFile?.type,
            };
            
            addItem(cartItem);
            alert('Товар добавлен в корзину!');
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Произошла ошибка при добавлении товара в корзину. Пожалуйста, попробуйте еще раз.');
        }
    };

    // Калькулятор стоимости
    const calculateTotal = () => {
        if (!selectedMaterial || widthError) return 0;

        const w = parseFloat(width.replace(',', '.')) || 0;
        const h = parseFloat(height.replace(',', '.')) || 0;
        const qty = parseInt(quantity) || 0;

        if (w === 0 || h === 0 || qty === 0) return 0;

        // Площадь считается с учетом запаса под подрезку (для пленок) или пропайку (для баннеров)
        const area = w * h; // Площадь одного изделия
        const totalArea = area * qty; // Общая площадь

        let total = 0;

        if (activeCategory === 'FILM') {
            // === РАСЧЕТ ДЛЯ ПЛЕНОК ===
            
            // 1. Стоимость печати пленки
            total = totalArea * selectedMaterial.pricePerSqM;

            // 2. Ламинация пленки (850р/кв.м) - считается по площади пленки под печать
            if (lamination) {
                total += totalArea * 850;
            }

            // 3. Плоттерная порезка (400р/кв.м) - считается по площади пленки под печать
            if (plotterCutting) {
                total += totalArea * 400;
            }

            // 4. Выборка/монтажная пленка - считается по площади пленки под печать
            // Стандартная = 400р/кв.м (элементы >= 5см)
            // Мелкие элементы (< 5см) = 800р/кв.м
            // Пока используем стандартную цену, так как нет фильтра для определения размера элементов
            if (weeding) {
                total += totalArea * 400; // Стандартная цена
            }

            // 5. Подрезка по периметру (25р/пог.м)
            if (isCutting) {
                const perimeter = (w + h) * 2 * qty;
                total += perimeter * 25;
            }

        } else if (activeCategory === 'PAPER') {
            // === РАСЧЕТ ДЛЯ БУМАГИ ===

            // 1. Стоимость печати бумаги
            total = totalArea * selectedMaterial.pricePerSqM;

            // 2. Ламинация бумаги (800р/кв.м) - считается по площади бумаги под печать
            if (lamination) {
                total += totalArea * 800;
            }

            // 3. Подрезка по периметру (25р/пог.м)
            if (isCutting) {
                const perimeter = (w + h) * 2 * qty;
                total += perimeter * 25;
            }
        } else if (activeCategory === 'CANVAS') {
            // === РАСЧЕТ ДЛЯ ХОЛСТА ===

            // 1. Стоимость печати холста
            total = totalArea * selectedMaterial.pricePerSqM;

            // 2. Подрезка по периметру (30р/пог.м)
            if (isCutting) {
                const perimeter = (w + h) * 2 * qty;
                total += perimeter * 30;
            }
        } else {
            // === РАСЧЕТ ДЛЯ БАННЕРОВ ===
            
            // 1. Стоимость печати
            total = totalArea * selectedMaterial.pricePerSqM;

            // 2. Пропайка (100р/пог.м) - считается по длине выбранной стороны
            let solderLen = 0;
            if (solderingType) {
                const shortSide = Math.min(w, h);
                const longSide = Math.max(w, h);
                
                switch(solderingType) {
                    case "1 КОРОТКАЯ СТОРОНА":
                        solderLen = shortSide;
                        break;
                    case "2 КОРОТКИХ СТОРОНЫ":
                        solderLen = shortSide * 2;
                        break;
                    case "1 ДЛИННАЯ СТОРОНА":
                        solderLen = longSide;
                        break;
                    case "2 ДЛИННЫХ СТОРОНЫ":
                        solderLen = longSide * 2;
                        break;
                    case "ПО ПЕРИМЕТРУ":
                        solderLen = (w + h) * 2;
                        break;
                }
                solderLen = solderLen * qty;
            } else if (soldering) {
                solderLen = parseFloat(soldering.replace(',', '.')) || 0;
            }
            total += solderLen * 100;

            // Люверсы (25р/шт)
            const eyeletsCount = parseInt(eyelets) || 0;
            total += eyeletsCount * 25;

            // Клапаны (50р/шт)
            const valvesCount = parseInt(valves) || 0;
            total += valvesCount * 50;

            // Подрезка по периметру (30р/пог.м)
            if (isCutting) {
                const perimeter = (w + h) * 2 * qty;
                total += perimeter * 30;
            }
        }

        return Math.round(total);
    };

    const totalPrice = calculateTotal();
    const pricePerUnit = quantity && parseInt(quantity) > 0 ? (totalPrice / parseInt(quantity)).toFixed(0) : 0;

    // --- РЕНДЕРЫ ---

    // 1. Выбор материала (3 карточки)
    const renderMaterialSelection = () => (
        <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-[#006837] uppercase mb-6 border-b-2 border-[#006837] pb-2 inline-block">
                {activeCategory === 'BANNER' ? 'БАННЕР' : activeCategory}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeCategory === 'BANNER' && bannerMaterials.map((mat) => (
                    <div key={mat.id} onClick={() => handleMaterialSelect(mat)} className="group cursor-pointer flex flex-col">
                        <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white aspect-[4/4] mb-4 relative shadow-sm group-hover:border-[#00C16E] group-hover:shadow-lg transition-all">
                            <img src={mat.image} alt={mat.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-[#006837] uppercase text-lg group-hover:text-[#00C16E] transition-colors leading-tight">
                            {mat.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">{mat.subtitle}</p>
                    </div>
                ))}

                {/* Заглушки для других категорий */}
                {activeCategory === 'FILM' && filmMaterials.map((mat) => (
                    <div key={mat.id} onClick={() => handleMaterialSelect(mat)} className="group cursor-pointer flex flex-col">
                        <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white aspect-[4/4] mb-4 relative shadow-sm group-hover:border-[#00C16E] group-hover:shadow-lg transition-all">
                            <img src={mat.image} alt={mat.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-[#006837] uppercase text-lg group-hover:text-[#00C16E] transition-colors leading-tight">
                            {mat.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">{mat.subtitle}</p>
                    </div>
                ))}

                {activeCategory === 'PAPER' && paperMaterials.map((mat) => (
                    <div key={mat.id} onClick={() => handleMaterialSelect(mat)} className="group cursor-pointer flex flex-col">
                        <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white aspect-[4/4] mb-4 relative shadow-sm group-hover:border-[#00C16E] group-hover:shadow-lg transition-all">
                            <img src={mat.image} alt={mat.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-[#006837] uppercase text-lg group-hover:text-[#00C16E] transition-colors leading-tight">
                            {mat.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">{mat.subtitle}</p>
                    </div>
                ))}

                {activeCategory === 'CANVAS' && canvasMaterials.map((mat) => (
                    <div key={mat.id} onClick={() => handleMaterialSelect(mat)} className="group cursor-pointer flex flex-col">
                        <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white aspect-[4/4] mb-4 relative shadow-sm group-hover:border-[#00C16E] group-hover:shadow-lg transition-all">
                            <img src={mat.image} alt={mat.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-[#006837] uppercase text-lg group-hover:text-[#00C16E] transition-colors leading-tight">
                            {mat.title}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium">{mat.subtitle}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    // 2. Оформление заказа (Инпуты + Калькулятор)
    const renderOrderConfig = () => {
        if (!selectedMaterial) return null;

        // Расчет даты (как в исходном коде)
        const readyDate = new Date();
        readyDate.setDate(readyDate.getDate() + 4);
        const dayOfWeek = readyDate.toLocaleDateString('ru-RU', { weekday: 'long' });
        const formattedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
        const dateStr = readyDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
        const fullDateStr = `${formattedDay}, ${dateStr}г., 15:00`;
        const maxWidthValue = selectedMaterial.maxWidth ?? 3.1;
        const maxWidthLabel = maxWidthValue.toString().replace('.', ',');

        return (
            <div className="w-full max-w-[1200px] mx-auto text-[#006837] font-sans">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* --- ЛЕВАЯ КОЛОНКА (ФОРМА) --- */}
                    <div className="flex-grow w-full lg:w-3/4">

                        {/* ВЕРХНИЙ БЛОК: Фото, Размеры, Кнопка макета */}
                        <div className="flex flex-col md:flex-row gap-6 mb-10">

                            {/* 1. Изображение и название */}
                            <div className="w-full md:w-[180px] shrink-0 flex flex-col gap-2">
                                <div className="rounded-md border border-gray-300 overflow-hidden aspect-square bg-gray-100 shadow-inner">
                                    <img
                                        src={selectedMaterial.image}
                                        alt={selectedMaterial.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-bold text-black lowercase text-sm">{selectedMaterial.title}</h3>
                            </div>

                            {/* 2. Инпуты размеров в два столбца */}
                            <div className="flex-grow flex flex-col gap-4">
                                {/* Два столбца инпутов */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Левый столбец */}
                                    <div className="flex flex-col gap-4">
                                        {/* Тираж */}
                                        <div>
                                            <label className="font-bold text-[10px] uppercase mb-1 block text-black">ТИРАЖ (шт)*</label>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={e => setQuantity(e.target.value)}
                                                className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#00C16E]"
                                            />
                                        </div>
                                        {/* Длина */}
                                        <div>
                                            <label className="font-bold text-[10px] uppercase mb-1 block text-black">ДЛИНА (м)*</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={height}
                                                onChange={e => setHeight(e.target.value)}
                                                className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#00C16E]"
                                            />
                                        </div>
                                        {/* Ширина */}
                                        <div>
                                            <label className="font-bold text-[10px] uppercase mb-1 block text-black">ШИРИНА (м)*</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                max={maxWidthValue}
                                                value={width}
                                                onChange={e => setWidth(e.target.value)}
                                                className={`w-full border-2 ${widthError ? 'border-red-500 bg-red-50' : 'border-[#006837]'} rounded-xl h-9 px-3 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#00C16E]`}
                                            />
                                            {widthError && (
                                                <span className="text-[9px] text-red-600 font-bold mt-1 block">
                                                    Макс: {maxWidthLabel}м
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Правый столбец - зависит от категории */}
                                    {activeCategory === 'FILM' ? (
                                        <div className="flex flex-col gap-4">
                                            {/* Ламинация */}
                                            <div>
                                                <label className="font-bold text-[10px] uppercase mb-1 block text-black">ЛАМИНАЦИЯ*</label>
                                                <div 
                                                    onClick={() => setLamination(!lamination)}
                                                    className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 flex items-center font-bold text-lg cursor-pointer select-none transition-colors hover:bg-green-50"
                                                >
                                                    <span className={lamination ? "text-[#006837]" : "text-gray-400"}>{lamination ? "ДА" : "НЕТ"}</span>
                                                </div>
                                            </div>
                                            {/* Плоттерная порезка */}
                                            <div>
                                                <label className="font-bold text-[10px] uppercase mb-1 block text-black">ПЛОТТЕРНАЯ ПОРЕЗКА*</label>
                                                <div 
                                                    onClick={() => setPlotterCutting(!plotterCutting)}
                                                    className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 flex items-center font-bold text-lg cursor-pointer select-none transition-colors hover:bg-green-50"
                                                >
                                                    <span className={plotterCutting ? "text-[#006837]" : "text-gray-400"}>{plotterCutting ? "ДА" : "НЕТ"}</span>
                                                </div>
                                            </div>
                                            {/* Выборка/монтажная пленка */}
                                            <div>
                                                <label className="font-bold text-[10px] uppercase mb-1 block text-black">ВЫБОРКА, МОНТАЖНАЯ ПЛЕНКА*</label>
                                                <div 
                                                    onClick={() => setWeeding(!weeding)}
                                                    className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 flex items-center font-bold text-lg cursor-pointer select-none transition-colors hover:bg-green-50"
                                                >
                                                    <span className={weeding ? "text-[#006837]" : "text-gray-400"}>{weeding ? "ДА" : "НЕТ"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : activeCategory === 'PAPER' ? (
                                        <div className="flex flex-col gap-4">
                                            {/* Ламинация */}
                                            <div>
                                                <label className="font-bold text-[10px] uppercase mb-1 block text-black">ЛАМИНАЦИЯ*</label>
                                                <div 
                                                    onClick={() => setLamination(!lamination)}
                                                    className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 flex items-center font-bold text-lg cursor-pointer select-none transition-colors hover:bg-green-50"
                                                >
                                                    <span className={lamination ? "text-[#006837]" : "text-gray-400"}>{lamination ? "ДА" : "НЕТ"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : activeCategory === 'CANVAS' ? null : (
                                        <div className="flex flex-col gap-4">
                                            {/* Пропайка - выпадающий список (для баннеров) */}
                                            <div>
                                                <label className="font-bold text-[10px] uppercase mb-1 block text-black">ПРОПАЙКА СТОРОНЫ*</label>
                                                <select
                                                    value={solderingType}
                                                    onChange={e => setSolderingType(e.target.value)}
                                                    className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#00C16E] bg-white"
                                                >
                                                    <option value="">Выберите вариант</option>
                                                    <option value="1 КОРОТКАЯ СТОРОНА">1 КОРОТКАЯ СТОРОНА</option>
                                                    <option value="2 КОРОТКИХ СТОРОНЫ">2 КОРОТКИХ СТОРОНЫ</option>
                                                    <option value="1 ДЛИННАЯ СТОРОНА">1 ДЛИННАЯ СТОРОНА</option>
                                                    <option value="2 ДЛИННЫХ СТОРОНЫ">2 ДЛИННЫХ СТОРОНЫ</option>
                                                    <option value="ПО ПЕРИМЕТРУ">ПО ПЕРИМЕТРУ</option>
                                                </select>
                                            </div>
                                            {/* Люверсы */}
                                            <div>
                                                <label className="font-bold text-[10px] uppercase mb-1 block text-black">ЛЮВЕРСЫ (шт)*</label>
                                                <input
                                                    type="number"
                                                    value={eyelets}
                                                    onChange={e => setEyelets(e.target.value)}
                                                    className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#00C16E]"
                                                />
                                            </div>
                                            {/* Клапаны */}
                                            <div>
                                                <label className="font-bold text-[10px] uppercase mb-1 block text-black">КЛАПАНЫ (шт)*</label>
                                                <input
                                                    type="number"
                                                    value={valves}
                                                    onChange={e => setValves(e.target.value)}
                                                    className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#00C16E]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* НИЖНИЙ БЛОК: Сетка настроек (Labels left, Inputs right) */}
                        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-y-6 items-start">

                            {/* ROW 1: Загрузка TIFF */}
                            <div className="font-bold uppercase text-sm pt-2 hidden md:block">ЗАГРУЗИТЕ МАКЕТ</div>
                            <div className="flex flex-col">
                                <span className="md:hidden font-bold uppercase text-sm mb-1">ЗАГРУЗИТЕ МАКЕТ</span>
                                <div className="flex flex-col items-start gap-1">
                                    <label className="cursor-pointer">
                                        <div className={`border-2 ${frontFile ? 'border-[#00C16E] bg-[#f0fff8]' : 'border-[#006837]'} rounded bg-white px-3 py-1 flex items-center gap-2 hover:bg-gray-50 transition-colors w-fit min-w-[140px]`}>
                                            <span className="text-xl font-bold text-[#006837] leading-none pb-1">📥</span>
                                            <span className="font-bold uppercase text-[#006837] text-sm">
                                                {frontFile ? '✓ ЗАГРУЖЕНО' : 'ЗАГРУЗИТЬ'}
                                            </span>
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept=".tiff,.tif"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setFrontFile(file);
                                            }}
                                        />
                                    </label>
                                    {frontFile && (
                                        <span className="text-[9px] text-[#00C16E] font-semibold ml-1 block mt-1">
                                            {frontFile.name}
                                        </span>
                                    )}
                                    <span className="text-[10px] uppercase text-[#006837] font-bold ml-1">ФОРМАТ TIFF</span>
                                </div>
                            </div>

                            {/* ROW 2: Подрезка */}
                            <div className="font-bold uppercase text-sm pt-1 hidden md:block">ПОДРЕЗКА ПО ПЕРИМЕТРУ</div>
                            <div className="flex items-center gap-3">
                                <span className="md:hidden font-bold uppercase text-sm">ПОДРЕЗКА ПО ПЕРИМЕТРУ</span>
                                <input
                                    type="checkbox"
                                    checked={isCutting}
                                    onChange={e => setIsCutting(e.target.checked)}
                                    className="w-6 h-6 border-2 border-[#006837] rounded md:ml-0 accent-[#006837] cursor-pointer"
                                />
                            </div>

                            {/* ROW 2.5: Загрузка контура подрезки (только для пленок) */}
                            {activeCategory === 'FILM' && (
                                <>
                                    <div className="font-bold uppercase text-sm pt-2 hidden md:block">ЗАГРУЗИТЕ КОНТУР<br/>ПОДРЕЗКИ</div>
                                    <div className="flex flex-col">
                                        <span className="md:hidden font-bold uppercase text-sm mb-1">ЗАГРУЗИТЕ КОНТУР ПОДРЕЗКИ</span>
                                        <div className="flex flex-col items-start gap-1">
                                            <label className="cursor-pointer">
                                                <div className={`border-2 ${cuttingFile ? 'border-[#00C16E] bg-[#f0fff8]' : 'border-[#006837]'} rounded bg-white px-3 py-1 flex items-center gap-2 hover:bg-gray-50 transition-colors w-fit min-w-[140px]`}>
                                                    <span className="text-xl font-bold text-[#006837] leading-none pb-1">📥</span>
                                                    <span className="font-bold uppercase text-[#006837] text-sm">
                                                        {cuttingFile ? '✓ ЗАГРУЖЕНО' : 'ЗАГРУЗИТЬ'}
                                                    </span>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept=".eps"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setCuttingFile(file);
                                                    }}
                                                />
                                            </label>
                                            {cuttingFile && (
                                                <span className="text-[9px] text-[#00C16E] font-semibold ml-1 block mt-1">
                                                    {cuttingFile.name}
                                                </span>
                                            )}
                                            <span className="text-[10px] uppercase text-[#006837] font-bold ml-1">ФОРМАТ EPS</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ROW 3: Превью JPEG */}
                            <div className="font-bold uppercase text-sm pt-2 hidden md:block">ПРЕВЬЮ МАКЕТА</div>
                            <div className="flex flex-col">
                                <span className="md:hidden font-bold uppercase text-sm mb-1">ПРЕВЬЮ МАКЕТА</span>
                                <div className="flex flex-col items-start gap-1">
                                    <label className="cursor-pointer">
                                        <div className={`border-2 ${previewFile ? 'border-[#00C16E] bg-[#f0fff8]' : 'border-[#006837]'} rounded bg-white px-3 py-1 flex items-center gap-2 hover:bg-gray-50 transition-colors w-fit min-w-[140px]`}>
                                            <span className="text-xl font-bold text-[#006837] leading-none pb-1">📥</span>
                                            <span className="font-bold uppercase text-[#006837] text-sm">
                                                {previewFile ? '✓ ЗАГРУЖЕНО' : 'ЗАГРУЗИТЬ'}
                                            </span>
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept=".jpg,.jpeg"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) setPreviewFile(file);
                                            }}
                                        />
                                    </label>
                                    {previewFile && (
                                        <span className="text-[9px] text-[#00C16E] font-semibold ml-1 block mt-1">
                                            {previewFile.name}
                                        </span>
                                    )}
                                    <span className="text-[10px] uppercase text-[#006837] font-bold ml-1">ФОРМАТ JPEG</span>
                                </div>
                            </div>

                            {/* ROW 4: Способ доставки */}
                            <div className="font-bold uppercase text-sm pt-2 hidden md:block">СПОСОБ ДОСТАВКИ</div>
                            <div className="w-full max-w-md">
                                <span className="md:hidden font-bold uppercase text-sm mb-1 block">СПОСОБ ДОСТАВКИ</span>
                                <input
                                    type="text"
                                    value={deliveryAddress}
                                    onChange={e => setDeliveryAddress(e.target.value)}
                                    className="border-2 border-[#006837] rounded-xl w-full h-9 px-3 focus:outline-none focus:ring-2 focus:ring-[#00C16E]"
                                />
                            </div>

                            {/* ROW 5: Комментарии */}
                            <div className="font-bold uppercase text-sm pt-2 hidden md:block">КОММЕНТАРИИ<br/>К ЗАКАЗУ</div>
                            <div className="w-full max-w-md">
                                <span className="md:hidden font-bold uppercase text-sm mb-1 block">КОММЕНТАРИИ К ЗАКАЗУ</span>
                                <input
                                    value={comments}
                                    onChange={e => setComments(e.target.value)}
                                    className="border-2 border-[#006837] rounded-xl w-full h-9 px-3 focus:outline-none focus:ring-2 focus:ring-[#00C16E]"
                                />
                            </div>

                            {/* ROW 6: Нижний чекбокс */}
                            <div className="col-span-1 md:col-span-2 mt-2">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={checkLayout}
                                        onChange={(e) => setCheckLayout(e.target.checked)}
                                        className="w-6 h-6 border-2 border-[#006837] rounded accent-[#006837] shrink-0 cursor-pointer"
                                    />
                                    <span className="font-bold text-xs text-black">Проверить макет на соответствие требований к печати</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* --- ПРАВАЯ КОЛОНКА (РАСЧЕТ) --- */}
                    <div className="w-full lg:w-1/4 min-w-[280px]">
                        <div className="border-[3px] border-[#006837] rounded-xl p-5 bg-white relative">

                            <h3 className="font-bold text-xl uppercase text-black mb-4">РАСЧЕТ:</h3>

                            <div className="space-y-1 text-sm font-bold text-black mb-6">
                                <div className="flex justify-between">
                                    <span>Сумма:</span>
                                    <span>{totalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ваша скидка:</span>
                                    <span>0</span>
                                </div>
                                <div className="flex justify-between border-b-[3px] border-[#006837] pb-1 mb-1">
                                    <span>Цена за единицу:</span>
                                    <span>{pricePerUnit}</span>
                                </div>
                                <div className="flex justify-between text-lg mt-2">
                                    <span>Итого:</span>
                                    <span>{totalPrice}</span>
                                </div>
                            </div>

                            <div className="mb-6 text-black">
                                <div className="font-bold">Готовность:</div>
                                <div className="text-base font-normal">{fullDateStr}</div>
                                <div className="text-[10px] text-gray-500 leading-tight mt-2">
                                    Дата готовности — ориентировочная<br/>и может отличаться от фактической
                                </div>
                            </div>

                            {/* Кнопка Оформить заказ */}
                            <button 
                                type="button"
                                className="w-full flex h-12 rounded overflow-hidden group"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddToCart();
                                }}
                            >
                                {/* Левая часть (Текст) */}
                                  <div
                                      className="bg-[#00C16E] hover:bg-[#00a860] text-white font-bold flex-grow flex items-center justify-center uppercase text-base transition-colors relative z-10 -mr-4"
                                      style={{
                                          clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%)",
                                      }}
                                  >
                                      ОФОРМИТЬ ЗАКАЗ
                                  </div>

                                  <div className="w-16 bg-[#006837] flex items-center justify-center">
                                      <img src="/cart.svg" alt="Корзина" className="w-7 h-7" />
                                  </div>
                              </button>

                        </div>
                    </div>

                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header />
            <main className="max-w-[1200px] w-full mx-auto px-4 py-8 flex-grow">

                {/* --- HEADER --- */}
                <div className="flex w-full mb-10 h-16">
                    <div
                        className="relative bg-[#00C16E] text-white font-bold text-sm sm:text-lg px-4 sm:px-8 flex items-center h-full z-10 w-fit shrink-0 cursor-pointer uppercase leading-tight"
                        onClick={() => { setViewState('MAIN_SELECTION'); setSelectedMaterial(null); }}
                    >
                        ШИРОКОФОРМАТНАЯ<br />ПЕЧАТЬ
                        <div className="absolute top-0 -right-8 w-0 h-0 border-t-[32px] border-t-transparent border-l-[32px] border-l-[#00C16E] border-b-[32px] border-b-transparent"></div>
                    </div>
                    <div className="bg-[#006837] flex-grow flex items-center px-8 sm:px-12 h-full text-white font-bold text-xl uppercase tracking-wider pl-12 sm:pl-16">
                        {viewState === 'ORDER_CONFIG' ? "ОФОРМЛЕНИЕ ЗАКАЗА" : "БАННЕР"}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 mb-16">
                    {/* --- SIDEBAR --- */}
                    <div className="w-full lg:w-1/5 flex flex-col gap-4 text-xl font-bold uppercase text-[#006837]">
                        <button onClick={() => { setActiveCategory('BANNER'); setViewState('MAIN_SELECTION'); setSelectedMaterial(null); }} className={`text-left transition-colors hover:text-[#00C16E] ${activeCategory === 'BANNER' ? "text-[#00C16E]" : ""}`}>БАННЕР</button>
                        <button onClick={() => { setActiveCategory('FILM'); setViewState('MAIN_SELECTION'); setSelectedMaterial(null); }} className={`text-left transition-colors hover:text-[#00C16E] ${activeCategory === 'FILM' ? "text-[#00C16E]" : ""}`}>ПЛЕНКА</button>
                        <button onClick={() => { setActiveCategory('PAPER'); setViewState('MAIN_SELECTION'); setSelectedMaterial(null); }} className={`text-left transition-colors hover:text-[#00C16E] ${activeCategory === 'PAPER' ? "text-[#00C16E]" : ""}`}>БУМАГА</button>
                        <button onClick={() => { setActiveCategory('CANVAS'); setViewState('MAIN_SELECTION'); setSelectedMaterial(null); }} className={`text-left transition-colors hover:text-[#00C16E] ${activeCategory === 'CANVAS' ? "text-[#00C16E]" : ""}`}>ХОЛСТ</button>

                        {viewState === 'ORDER_CONFIG' && (
                            <button onClick={() => { setViewState('MAIN_SELECTION'); setSelectedMaterial(null); }} className="text-sm text-gray-400 text-left mt-4 normal-case hover:text-gray-600 flex items-center gap-2">
                                <div className="w-8 h-2 bg-gray-400" style={{clipPath: "polygon(0% 50%, 30% 0%, 30% 100%)"}}></div>
                                ПЕРЕХОДИМ В КАТЕГОРИЮ {activeCategory === 'BANNER' ? 'БАННЕР' : '...'}
                            </button>
                        )}
                    </div>

                    {/* --- CONTENT --- */}
                    <div className="w-full lg:w-4/5">
                        {viewState === 'MAIN_SELECTION' && renderMaterialSelection()}
                        {viewState === 'ORDER_CONFIG' && renderOrderConfig()}
                    </div>
                </div>

                {/* --- FOOTER INFO --- */}
                <div className="w-full bg-[#006837] py-6 px-8 md:px-16 text-white relative min-h-[120px] flex items-center" style={{ clipPath: "polygon(50px 0, 100% 0, 100% 100%, 50px 100%, 0 50%)" }}>
                    <div className="text-sm md:text-base font-medium leading-relaxed">
                        {activeCategory === 'FILM' ? (
                            <>
                                <span className="text-[#FFD700] font-bold">ВАЖНО! </span>
                                МАКЕТ ПРИНИМАЕТСЯ К ПЕЧАТИ В <span className="font-bold">ФОРМАТЕ TIFF</span>, РАЗМЕР <span className="font-bold">1:1</span>, ЦВЕТОВОЙ МОДЕЛИ <span className="font-bold">CMYK</span>, БЕЗ ПРОЗРАЧНОСТИ.<br className="hidden md:block"/>
                                КАЧЕСТВО <span className="font-bold">НЕ НИЖЕ 300 dpi</span> - ДЛЯ ПЕЧАТИ ПЛЕНКИ + КОНТУР ПОДРЕЗКИ В ФОРМАТЕ <span className="font-bold">EPS</span>, СВЕРХТОНКИЙ АБРИС, БЕЗ ЗАЛИВКИ И ПРОЗРАЧНОСТИ.<br className="hidden md:block"/>
                                <span className="text-[#FFD700]">ПРЕДЕЛЬНЫЙ РАЗМЕР ПО ШИРИНЕ:</span> ОРАКАЛ 641 И 8500 = 0,98М, ОРАФОЛ/ОРАДЖЕТ ПОД ПЕЧАТЬ = 1,58М, БЛЕКАУТ = 1,26М, ГОЛОГРАФИЧЕСКАЯ = 1,18М, ПОД ПОРЕЗКУ НА ПЛОТТЕРЕ = 1,18М, ПЕРФОРАЦИЯ = 1,35М
                            </>
                        ) : activeCategory === 'PAPER' ? (
                            <>
                                <span className="text-[#FFD700] font-bold">ВАЖНО! </span>
                                МАКЕТ ПРИНИМАЕТСЯ К ПЕЧАТИ В <span className="font-bold">ФОРМАТЕ TIFF</span>, РАЗМЕР <span className="font-bold">1:1</span>, ЦВЕТОВОЙ МОДЕЛИ <span className="font-bold">CMYK</span>, БЕЗ ПРОЗРАЧНОСТИ.<br className="hidden md:block"/>
                                КАЧЕСТВО <span className="font-bold">НЕ НИЖЕ 300 dpi</span>.<br className="hidden md:block"/>
                                ПРЕВЬЮ В <span className="font-bold">ФОРМАТЕ JPEG</span>.<br className="hidden md:block"/>
                                <span className="text-[#FFD700]">ПРЕДЕЛЬНЫЙ РАЗМЕР ПО ШИРИНЕ ПО БУМАГЕ:</span> СИТИК (БЭКЛИТ) = 1,18М, БЛЮБЭК = 1,54М
                            </>
                        ) : activeCategory === 'CANVAS' ? (
                            <>
                                <span className="text-[#FFD700] font-bold">ВАЖНО! </span>
                                МАКЕТ ПРИНИМАЕТСЯ К ПЕЧАТИ В <span className="font-bold">ФОРМАТЕ TIFF</span>, РАЗМЕР <span className="font-bold">1:1</span>, ЦВЕТОВОЙ МОДЕЛИ <span className="font-bold">CMYK</span>, БЕЗ ПРОЗРАЧНОСТИ.<br className="hidden md:block"/>
                                КАЧЕСТВО <span className="font-bold">НЕ НИЖЕ 300 dpi</span>. ПРЕВЬЮ В <span className="font-bold">ФОРМАТЕ JPEG</span>.<br className="hidden md:block"/>
                                РАЗМЕРЫ УКАЗЫВАЙТЕ С ЗАПАСОМ <span className="font-bold">60 ММ ПО ПЕРИМЕТРУ</span>.<br className="hidden md:block"/>
                                <span className="text-[#FFD700]">ПРЕДЕЛЬНЫЙ РАЗМЕР ПО ШИРИНЕ:</span> ХОЛСТ 1,25М С УЧЕТОМ ЗАПАСА НА ЗАВОРОТ
                            </>
                        ) : (
                            <>
                                <span className="text-[#FFD700] font-bold">ВАЖНО! </span>
                                МАКЕТ ПРИНИМАЕТСЯ К ПЕЧАТИ В <span className="font-bold">ФОРМАТЕ TIFF</span>, РАЗМЕР <span className="font-bold">1:1</span>, ЦВЕТОВОЙ МОДЕЛИ <span className="font-bold">CMYK</span>,<br className="hidden md:block"/>
                                КАЧЕСТВО МАКЕТА <span className="font-bold">НЕ НИЖЕ 36 dpi</span> ПРИ БОЛЬШИХ РАЗМЕРАХ ИЗДЕЛИЯ,<br className="hidden md:block"/>
                                В ОСТАЛЬНЫХ СЛУЧАЯХ КАЧЕСТВО МАКЕТА ДОЛЖНО БЫТЬ <span className="font-bold">300 dpi</span>.<br className="hidden md:block"/>
                                <span className="text-[#FFD700]">РАЗМЕЩЕНИЕ ЛЮВЕРСОВ И КЛАПАНОВ ОБЯЗАТЕЛЬНО УКАЗЫВАЕТСЯ НА МАКЕТЕ.</span><br className="hidden md:block"/>
                                <span className="font-bold">ПРЕДЕЛЬНЫЙ РАЗМЕР ПО ШИРИНЕ: ВСЕ БАННЕРЫ ПО 3,1М</span>
                            </>
                        )}
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default WideFormatPage;
