import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uk' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  uk: {
    // Header
    'nav.home': 'Головна',
    'nav.about': 'Про нас',
    'nav.services': 'Послуги',
    'nav.doctors': 'Лікарі',
    'nav.prices': 'Ціни',
    'nav.promotions': 'Акції',
    'nav.blog': 'Блог',
    'nav.contacts': 'Контакти',
    'nav.book': 'Записатися',
    
    // Services
    'service.gynecology': 'Гінекологія',
    'service.dermatology': 'Дерматологія',
    'service.cardiology': 'Кардіологія',
    'service.ultrasound': 'УЗД діагностика',
    'service.pediatrics': 'Педіатрія',
    'service.therapy': 'Терапія',
    'service.cosmetology': 'Косметологія',
    'service.ophthalmology': 'Офтальмологія',
    
    // Common
    'common.readMore': 'Детальніше',
    'common.back': 'Назад',
    'common.viewProfile': 'Переглянути профіль',
    'common.experience': 'років медичної практики',
    'common.reviewsCount': 'відгуків',
    'common.biography': 'Біографія',
    'common.education': 'Освіта та кваліфікація',
    'common.certifications': 'Сертифікати',
    'common.reviews': 'Відгуки пацієнтів',
    'common.ourDoctors': 'Наші лікарі',
    'common.prices': 'Ціни на послуги',
  },
  ru: {
    // Header
    'nav.home': 'Главная',
    'nav.about': 'О нас',
    'nav.services': 'Услуги',
    'nav.doctors': 'Врачи',
    'nav.prices': 'Цены',
    'nav.promotions': 'Акции',
    'nav.blog': 'Блог',
    'nav.contacts': 'Контакты',
    'nav.book': 'Записаться',
    
    // Services
    'service.gynecology': 'Гинекология',
    'service.dermatology': 'Дерматология',
    'service.cardiology': 'Кардиология',
    'service.ultrasound': 'УЗИ диагностика',
    'service.pediatrics': 'Педиатрия',
    'service.therapy': 'Терапия',
    'service.cosmetology': 'Косметология',
    'service.ophthalmology': 'Офтальмология',
    
    // Common
    'common.readMore': 'Подробнее',
    'common.back': 'Назад',
    'common.viewProfile': 'Посмотреть профиль',
    'common.experience': 'лет медицинской практики',
    'common.reviewsCount': 'отзывов',
    'common.biography': 'Биография',
    'common.education': 'Образование и квалификация',
    'common.certifications': 'Сертификаты',
    'common.reviews': 'Отзывы пациентов',
    'common.ourDoctors': 'Наши врачи',
    'common.prices': 'Цены на услуги',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('uk');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
