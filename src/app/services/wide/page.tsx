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
    const [soldering, setSoldering] = useState<string>(""); // Пропайка
    const [eyelets, setEyelets] = useState<string>("");
    const [valves, setValves] = useState<string>("");
    const [isCutting, setIsCutting] = useState<boolean>(false);

    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [comments, setComments] = useState("");
    const [checkLayout, setCheckLayout] = useState(false);
    
    // Состояния для файлов
    const [frontFile, setFrontFile] = useState<File | null>(null);
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    
    const { addItem } = useCart();

    // --- ДАННЫЕ МАТЕРИАЛОВ ---
    const bannerMaterials: Material[] = [
        {
            id: "laminated",
            title: "ЛАМИНИРОВАННЫЙ",
            subtitle: "плотность 440гр",
            pricePerSqM: 650,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=Ламинированный" // Замени на свое фото
        },
        {
            id: "cast",
            title: "ЛИТОЙ",
            subtitle: "плотность 510гр",
            pricePerSqM: 750,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=Литой" // Замени на свое фото
        },
        {
            id: "mesh",
            title: "ПЕРФОРИРОВАННЫЙ",
            subtitle: "плотность 360гр", // Сетка
            pricePerSqM: 750,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=Сетка" // Замени на свое фото
        }
    ];

    const filmMaterials: Material[] = [
        {
            id: "orafol",
            title: "ОРАФОЛ",
            subtitle: "",
            pricePerSqM: 650,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=ОРАФОЛ" // Замени на свое фото
        },
        {
            id: "blackout",
            title: "БЛЕКАУТ",
            subtitle: "",
            pricePerSqM: 750,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=БЛЕКАУТ" // Замени на свое фото
        },
        {
            id: "perfofilm",
            title: "ПЕРФОПЛЕНКА",
            subtitle: "", // Сетка
            pricePerSqM: 750,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=ПЕРФОПЛЕНКА" // Замени на свое фото
        },
        {
            id: "holographic_film",
            title: "ГОЛОГРАФИЧЕСКАЯ",
            subtitle: "плотность 360гр", // Сетка
            pricePerSqM: 750,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=ГОЛОГРАФИЧЕСКАЯ" // Замени на свое фото
        }
    ];

    const paperMaterials: Material[] = [
        {
            id: "blueback",
            title: "БЛЮБЭК",
            subtitle: "",
            pricePerSqM: 650,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=БЛЮБЭК" // Замени на свое фото
        },
        {
            id: "backlit",
            title: "БЭКЛИТ",
            subtitle: "",
            pricePerSqM: 750,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=БЭКЛИТ" // Замени на свое фото
        },
    ];

    const canvasMaterials: Material[] = [
        {
            id: "canvas",
            title: "ХОЛСТ",
            subtitle: "",
            pricePerSqM: 650,
            image: "https://placehold.co/400x300/e2e8f0/006837?text=ХОЛСТ" // Замени на свое фото
        },
    ];

    // --- ЛОГИКА ---

    // Переход к оформлению
    const handleMaterialSelect = (mat: Material) => {
        setSelectedMaterial(mat);
        setViewState('ORDER_CONFIG');
        // Сброс полей
        setWidth(""); setHeight(""); setQuantity("1");
        setSoldering(""); setEyelets(""); setValves(""); setIsCutting(false);
        setDeliveryAddress(""); setComments(""); setCheckLayout(false);
        // Сброс файлов
        setFrontFile(null); setPreviewFile(null);
        window.scrollTo(0, 0);
    };
    
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
            const dateStr = readyDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
            const formattedDay = new Date().toLocaleDateString('ru-RU', { weekday: 'long' });
            const dayStr = formattedDay.charAt(0).toUpperCase() + formattedDay.slice(1);
            const timeStr = "15:00";
            
            // Конвертируем файлы в base64
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
                console.error('Ошибка при конвертации файлов:', fileError);
                alert('Ошибка при обработке файлов. Товар будет добавлен без файлов.');
            }
            
            const cartItem: CartItem = {
                id: `wide-${selectedMaterial.id}-${Date.now()}`,
                type: 'WIDE_FORMAT',
                format: `${width}x${height}м`,
                quantity: parseInt(quantity) || 1,
                basePrice: totalPrice,
                specs: selectedMaterial.title,
                totalPrice: totalPrice,
                deliveryAddress: deliveryAddress || undefined,
                comments: comments || undefined,
                checkLayout: checkLayout || undefined,
                readyDate: `${dayStr}, ${dateStr}`,
                readyTime: timeStr,
                // Файлы
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
            alert('Товар добавлен в корзину!');
        } catch (error) {
            console.error('Ошибка при добавлении в корзину:', error);
            alert('Произошла ошибка при добавлении товара в корзину. Пожалуйста, попробуйте еще раз.');
        }
    };

    // Калькулятор стоимости
    const calculateTotal = () => {
        if (!selectedMaterial) return 0;

        const w = parseFloat(width.replace(',', '.')) || 0;
        const h = parseFloat(height.replace(',', '.')) || 0;
        const qty = parseInt(quantity) || 0;

        const area = w * h; // Площадь одного изделия
        const totalArea = area * qty; // Общая площадь

        // 1. Стоимость печати
        let total = totalArea * selectedMaterial.pricePerSqM;

        // 2. Доп услуги (цены из скриншота "ПОМЕТКИ")
        // Пропайка (100р/пог.м) - берем введенное значение длины пропайки
        const solderLen = parseFloat(soldering.replace(',', '.')) || 0;
        total += solderLen * 100;

        // Люверсы (25р/шт)
        const eyeletsCount = parseInt(eyelets) || 0;
        total += eyeletsCount * 25;

        // Клапаны (50р/шт)
        const valvesCount = parseInt(valves) || 0;
        total += valvesCount * 50;

        // Подрезка по периметру (30р/пог.м)
        // Периметр = (w + h) * 2 * кол-во
        if (isCutting) {
            const perimeter = (w + h) * 2 * qty;
            total += perimeter * 30;
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
                        <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white aspect-[4/3] mb-4 relative shadow-sm group-hover:border-[#00C16E] group-hover:shadow-lg transition-all">
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
                        <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white aspect-[4/3] mb-4 relative shadow-sm group-hover:border-[#00C16E] group-hover:shadow-lg transition-all">
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
                        <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white aspect-[4/3] mb-4 relative shadow-sm group-hover:border-[#00C16E] group-hover:shadow-lg transition-all">
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
                        <div className="rounded-xl border-2 border-gray-300 overflow-hidden bg-white aspect-[4/3] mb-4 relative shadow-sm group-hover:border-[#00C16E] group-hover:shadow-lg transition-all">
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
        const dateStr = readyDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
        // День недели с большой буквы
        const dayOfWeek = new Date().toLocaleDateString('ru-RU', { weekday: 'long' });
        const formattedDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

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

                            {/* 2. Инпуты размеров */}
                            <div className="flex flex-col gap-4 w-full md:w-[220px]">
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
                                        value={width}
                                        onChange={e => setWidth(e.target.value)}
                                        className="w-full border-2 border-[#006837] rounded-xl h-9 px-3 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#00C16E]"
                                    />
                                </div>
                            </div>

                            {/* 3. Кнопка "Заказать макет" */}
                            <div className="mt-6">
                                <button className="bg-[#006837] hover:bg-[#00522b] text-white uppercase font-bold text-sm px-6 py-2 rounded transition-colors whitespace-nowrap">
                                    ЗАКАЗАТЬ МАКЕТ
                                </button>
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
                                    <span>100</span>
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
                                <div className="text-base font-normal">{formattedDay}, {dateStr}, 15:00</div>
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
                                <div className="bg-[#00C16E] hover:bg-[#00a860] text-white font-bold flex-grow flex items-center justify-center uppercase text-base transition-colors">
                                    ДОБАВИТЬ В КОРЗИНУ
                                </div>

                                {/* Разделитель и иконка */}
                                <div className="relative w-16 bg-[#006837]">
                                    {/* Косой срез */}
                                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-[#00C16E] hover:bg-[#00a860] origin-top-left transform -skew-x-[20deg] -ml-3 transition-colors"></div>
                                    {/* Иконка корзины */}
                                    <div className="relative z-10 h-full flex items-center justify-center text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="absolute top-2 right-3 text-[10px] font-bold leading-none">+</span>
                                    </div>
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
                        <span className="text-[#FFD700] font-bold">ВАЖНО! </span>
                        МАКЕТ ПРИНИМАЕТСЯ К ПЕЧАТИ В <span className="font-bold">ФОРМАТЕ TIFF</span>, РАЗМЕР <span className="font-bold">1:1</span>, ЦВЕТОВОЙ МОДЕЛИ <span className="font-bold">CMYK</span>,<br className="hidden md:block"/>
                        КАЧЕСТВО МАКЕТА <span className="font-bold">НЕ НИЖЕ 36 dpi</span> ПРИ БОЛЬШИХ РАЗМЕРАХ ИЗДЕЛИЯ,<br className="hidden md:block"/>
                        В ОСТАЛЬНЫХ СЛУЧАЯХ КАЧЕСТВО МАКЕТА ДОЛЖНО БЫТЬ <span className="font-bold">300 dpi</span>.<br className="hidden md:block"/>
                        <span className="text-[#FFD700]">РАЗМЕЩЕНИЕ ЛЮВЕРСОВ И КЛАПАНОВ ОБЯЗАТЕЛЬНО УКАЗЫВАЕТСЯ НА МАКЕТЕ.</span>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
};

export default WideFormatPage;