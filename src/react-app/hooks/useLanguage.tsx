import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'uk';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    appTitle: 'FlexoHub',
    appSubtitle: 'Flexographic Prepress Toolkit',
    
    // Distortion Calculator
    distortionCalculator: 'Distortion Calculator',
    printLength: 'Print Length (mm)',
    plateThickness: 'Plate Thickness (mm)',
    selectThickness: 'Select thickness',
    difference: 'Difference (%)',
    distortionCoefficient: 'Distortion Coefficient',
    plateLength: 'Plate Length',
    copyCoefficient: 'Copy coefficient',
    copied: 'Copied!',
    distortionTable: 'Distortion Table',
    thickness: 'Thickness (mm)',
    actions: 'Actions',
    remove: 'Remove',
    addEntry: 'Add Entry',
    close: 'Close',
    enterPrintLength: 'Enter print length',
    
    // Area Calculator
    areaCalculator: 'Plate Area Calculator',
    width: 'Width (mm)',
    height: 'Height (mm)',
    quantity: 'Quantity',
    cleanArea: 'Clean Area (m²)',
    bleedArea: 'Bleed Area (m²)',
    addRow: 'Add Row',
    calculate: 'Calculate',
    clear: 'Clear',
    total: 'Total:',
    
    // Barcode Generator
    barcodeGenerator: 'Barcode & QR Generator',
    codeType: 'Code Type',
    dataToEncode: 'Data to Encode',
    enterData: 'Enter text, URL, or data to encode',
    presets: 'Presets',
    presetName: 'Preset name',
    save: 'Save',
    bulkGeneration: 'Bulk Generation',
    bulkData: 'Data (one per line)',
    enterMultiple: 'Enter multiple data items, one per line',
    generateZip: 'Generate ZIP',
    
    // Quick Tools
    quickTools: 'Quick Tools',
    lengthConverter: 'Length Converter',
    millimeters: 'Millimeters (mm)',
    inches: 'Inches (in)',
    screenConverter: 'Screen Converter',
    linesPerInch: 'Lines Per Inch (LPI)',
    dotsPerInch: 'Dots Per Inch (DPI)',
    approximateConversion: 'Approximate conversion: DPI = LPI × 16',
    quickReference: 'Quick Reference',
    commonLpi: 'Common LPI Values',
    newsprint: 'Newsprint:',
    magazines: 'Magazines:',
    fineArt: 'Fine Art:',
    packaging: 'Packaging:',
    commonConversions: 'Common Conversions',
    
    // Footer
    footerText: 'FlexoHub - Professional flexographic prepress tools designed for efficiency and precision.',
    footerCopyright: '© 2025 FlexoHub. All tools work offline for maximum performance.',
    
    // Color Converter
    colorConverter: 'Color Converter',
    inputType: 'Input Type',
    colorValue: 'Color Value',
    colorResults: 'Color Results',
    pantoneCoated: 'Pantone Coated',
    pantoneUncoated: 'Pantone Uncoated',
    pantoneNote: 'Note: Pantone values are approximations for demonstration purposes only.',
    
    // Subscription
    loginRequired: 'Login Required',
    loginToAccess: 'Please log in to access FlexoHub tools',
    loginWithGoogle: 'Sign in with Google',
    subscriptionRequired: 'Subscription Required',
    trialExpired: 'Your free trial has expired.',
    subscriptionExpiredMessage: 'Subscribe to continue using FlexoHub tools.',
    flexohubPro: 'FlexoHub Pro',
    fullAccess: 'Full access to all professional tools',
    allCalculators: 'All calculation tools',
    allBarcodeTools: 'Barcode & QR generator',
    futureFeatures: 'Future feature updates',
    subscribe: 'Subscribe Now',
    securePayment: 'Secure payment powered by LemonSqueezy',
    loading: 'Loading...',
    upgrade: 'Upgrade',
    trialDaysLeft: 'Trial: {{days}} days left',
    trialEndsToday: 'Trial ends today',
    upgradeToKeepAccess: 'Upgrade to keep full access',
    signingIn: 'Signing you in...',
    pleaseWait: 'Please wait while we complete the authentication process.',
    
    // Shortcuts
    shortcuts: 'Tool Shortcuts',
    shortcutsDescription: 'Quick access to all FlexoHub tools',
    distortionDescription: 'Calculate plate distortion coefficients for flexographic printing',
    areaDescription: 'Calculate clean and bleed areas for printing plates',
    barcodeDescription: 'Generate QR codes, Code 128, and EAN-13 barcodes',
    quickToolsDescription: 'Quick converters for length and screen values',
    colorDescription: 'Convert colors between RGB, CMYK, HEX, and Pantone',
    openTool: 'Open Tool',
    backToHome: 'Back to Home',
    
    // Language
    language: 'Language',
    english: 'English',
    ukrainian: 'Українська'
  },
  uk: {
    // Header
    appTitle: 'FlexoHub',
    appSubtitle: 'Інструменти для флексографічної додрукарської підготовки',
    
    // Distortion Calculator
    distortionCalculator: 'Калькулятор дисторсії',
    printLength: 'Довжина друку (мм)',
    plateThickness: 'Товщина кліше (мм)',
    selectThickness: 'Оберіть товщину',
    difference: 'Різниця (%)',
    distortionCoefficient: 'Коефіцієнт дисторсії',
    plateLength: 'Довжина кліше',
    copyCoefficient: 'Копіювати коефіцієнт',
    copied: 'Скопійовано!',
    distortionTable: 'Таблиця дисторсії',
    thickness: 'Товщина (мм)',
    actions: 'Дії',
    remove: 'Видалити',
    addEntry: 'Додати запис',
    close: 'Закрити',
    enterPrintLength: 'Введіть довжину друку',
    
    // Area Calculator
    areaCalculator: 'Калькулятор площ форм',
    width: 'Ширина (мм)',
    height: 'Висота (мм)',
    quantity: 'Кількість',
    cleanArea: 'Чиста площа (м²)',
    bleedArea: 'Площа з bleed (м²)',
    addRow: 'Додати рядок',
    calculate: 'Розрахувати',
    clear: 'Очистити',
    total: 'Всього:',
    
    // Barcode Generator
    barcodeGenerator: 'Генератор штрих-кодів і QR',
    codeType: 'Тип коду',
    dataToEncode: 'Дані для кодування',
    enterData: 'Введіть текст, URL або дані для кодування',
    presets: 'Пресети',
    presetName: 'Назва пресету',
    save: 'Зберегти',
    bulkGeneration: 'Масове генерування',
    bulkData: 'Дані (по одному в рядку)',
    enterMultiple: 'Введіть кілька елементів даних, по одному в рядку',
    generateZip: 'Створити ZIP',
    
    // Quick Tools
    quickTools: 'Швидкі інструменти',
    lengthConverter: 'Конвертер довжини',
    millimeters: 'Міліметри (мм)',
    inches: 'Дюйми (дюйм)',
    screenConverter: 'Конвертер растру',
    linesPerInch: 'Ліній на дюйм (LPI)',
    dotsPerInch: 'Точок на дюйм (DPI)',
    approximateConversion: 'Приблизне перетворення: DPI = LPI × 16',
    quickReference: 'Швидка довідка',
    commonLpi: 'Поширені значення LPI',
    newsprint: 'Газетний папір:',
    magazines: 'Журнали:',
    fineArt: 'Мистецтво:',
    packaging: 'Упаковка:',
    commonConversions: 'Поширені перетворення',
    
    // Footer
    footerText: 'FlexoHub - Професійні інструменти для флексографічної додрукарської підготовки, розроблені для ефективності та точності.',
    footerCopyright: '© 2025 FlexoHub. Всі інструменти працюють офлайн для максимальної продуктивності.',
    
    // Color Converter
    colorConverter: 'Конвертер кольорів',
    inputType: 'Тип вводу',
    colorValue: 'Значення кольору',
    colorResults: 'Результати кольору',
    pantoneCoated: 'Pantone Coated',
    pantoneUncoated: 'Pantone Uncoated',
    pantoneNote: 'Примітка: Значення Pantone є приблизними лише для демонстрації.',
    
    // Subscription
    loginRequired: 'Потрібен вхід',
    loginToAccess: 'Будь ласка, увійдіть для доступу до інструментів FlexoHub',
    loginWithGoogle: 'Увійти через Google',
    subscriptionRequired: 'Потрібна підписка',
    trialExpired: 'Ваш безкоштовний пробний період закінчився.',
    subscriptionExpiredMessage: 'Оформіть підписку, щоб продовжити використання інструментів FlexoHub.',
    flexohubPro: 'FlexoHub Pro',
    fullAccess: 'Повний доступ до всіх професійних інструментів',
    allCalculators: 'Всі калькулятори',
    allBarcodeTools: 'Генератор штрих-кодів і QR',
    futureFeatures: 'Майбутні оновлення функцій',
    subscribe: 'Оформити підписку',
    securePayment: 'Безпечна оплата через LemonSqueezy',
    loading: 'Завантаження...',
    upgrade: 'Оновити',
    trialDaysLeft: 'Пробний період: залишилось {{days}} днів',
    trialEndsToday: 'Пробний період закінчується сьогодні',
    upgradeToKeepAccess: 'Оновіться, щоб зберегти повний доступ',
    signingIn: 'Входимо в систему...',
    pleaseWait: 'Будь ласка, зачекайте, поки ми завершимо процес автентифікації.',
    
    // Shortcuts
    shortcuts: 'Швидкий доступ до інструментів',
    shortcutsDescription: 'Швидкий доступ до всіх інструментів FlexoHub',
    distortionDescription: 'Розрахунок коефіцієнтів дисторсії кліше для флексографічного друку',
    areaDescription: 'Розрахунок чистих та bleed площ для друкарських форм',
    barcodeDescription: 'Генерація QR-кодів, Code 128 та EAN-13 штрих-кодів',
    quickToolsDescription: 'Швидкі конвертери для довжини та значень растру',
    colorDescription: 'Конвертація кольорів між RGB, CMYK, HEX та Pantone',
    openTool: 'Відкрити інструмент',
    backToHome: 'Назад на головну',
    
    // Language
    language: 'Мова',
    english: 'English',
    ukrainian: 'Українська'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
