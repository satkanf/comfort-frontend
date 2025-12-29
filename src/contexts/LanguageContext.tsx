// import { createContext, useContext, useState, ReactNode } from 'react';
//
// type Language = 'uk' | 'ru';
//
// interface LanguageContextType {
//   language: Language;
//   setLanguage: (lang: Language) => void;
//   t: (key: string) => string;
// }
//
// const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
//
// const translations: Record<Language, Record<string, string>> = {
//   uk: {
//
//     'call': 'Зателефонувати',
//     'doctors.appointment': 'Записатись на прийом',
//     'your.services': 'Наші послуги',
//     'all.services': 'Переглянути всі послуги',
//     'price.info': '* Ціни можуть змінюватися. Точну вартість уточнюйте при записі',
//     'nav': 'Навігація',
//     'service': 'Послуги',
//     'contacts': 'Контакти',
//     'address': 'Адреса',
//     'phone': 'Телефон',
//     'work.hours': 'Години роботи',
//     'all': 'Всі',
//     'back': 'Повернутися до списку лікарів',
//     'more': 'Детальніше',
//     'link.profile': 'Переглянути профіль',
//     'experience': 'Досвід:',
//     'error': 'Помилка',
//     'error.send': 'Не вдалося відправити',
//     'send.ok': 'Заявка відправлена!',
//     'me.call': "Ми зв'яжемося з вами найближчим часом",
//     'callback': 'Замовити зворотний дзвінок',
//     'contacts.leave': 'Залиште свої контактні дані, і ми зв\'яжемося з вами найближчим часом',
//     'name': "Ім'я",
//     'enter.name': "Введіть ваше ім'я",
//     'send.form': 'Відправити заявку',
//     'reception.ok': 'Запис оформлено!',
//     'callback.ok': "Ми зв'яжемося з вами найближчим часом для підтвердження.",
//     'date': 'Дата',
//     'receprion': 'Записатися',
//     'choose.specialist': 'Оберіть фахівця',
//     'specialty.doctor': 'Спеціальність лікаря',
//     'time': 'Час',
//     'fill.form': "Заповніть форму і ми зв'яжемося з вами найближчим часом",
//     'form.title': 'Форма запису',
//     'form.subtitle': "Заповніть форму і ми зв'яжемося з вами",
//     'search.doc':'Пошук лікаря . . .',
//     'about.doctor': 'Про лікаря'
//
//
//
//   },
//   ru: {
//
//     'call': 'Позвонить',
//     'doctors.appointment': 'Записаться на прийом',
//     'your.services': 'Нашы услуги',
//     'all.services': 'Просмотерть все услуги',
//     'price.info': '* Цены могут изменяться. Точную стоимость уточняйте при записи',
//     'nav': 'Навигация',
//     'service': 'Услуги',
//     'contacts': 'Контакты',
//     'address': 'Адресса',
//     'phone': 'Телефон',
//     'work.hours': 'Время работы',
//     'all': 'Все',
//     'back': 'Вернуться к списку врачей',
//     'more': 'Подробнее',
//     'link.profile': 'Просмотерть профиль',
//     'experience': 'Опыт:',
//     'error': 'Ошибка',
//     'error.send': 'Не удалось отправить',
//     'send.ok': 'Заявка отправлена!',
//     'me.call': "Мы свяжемся с вами в ближайшее время",
//     'callback': 'Заказать обратный звонок',
//     'contacts.leave': 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время',
//     'name': "Имя",
//     'enter.name': "Введите ваше имя",
//     'send.form': 'Отправить заявку',
//     'reception.ok': 'Запись оформлена!',
//     'callback.ok': "Мы свяжемся с вами в ближайшее время для подтверждения.",
//     'date': 'Дата',
//     'receprion': 'Записаться',
//     'choose.specialist': 'Выберите специальность',
//     'specialty.doctor': 'Специальность врача',
//     'time': 'Время',
//     'fill.form': "Заполните форму и мы свяжемся с вами в ближайшее время",
//     'form.title': 'Форма записи',
//     'form.subtitle': 'Заполните форму и мы свяжемся с вами',
//     'search.doc':'Поиск врача . . .',
//     'about.doctor': 'О враче'
//
//   }
// };
//
// export const LanguageProvider = ({ children }: { children: ReactNode }) => {
//   const [language, setLanguage] = useState<Language>('uk');
//
//   const t = (key: string): string => {
//     return translations[language][key] || key;
//   };
//
//   return (
//     <LanguageContext.Provider value={{ language, setLanguage, t }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };
//
// export const useLanguage = () => {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// };
// LanguageContext.jsx
// contexts/LanguageContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, defaultValue?: string, params?: Record<string, string>) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLang?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
                                                                    children,
                                                                    defaultLang = 'uk'
                                                                  }) => {
  const [language, setLanguage] = useState<string>(defaultLang);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Инициализация языка
  useEffect(() => {
    const detectLanguageFromUrl = () => {
      const path = window.location.pathname;

      // Проверяем префикс языка в URL (например /ru/page или /uk/page)
      const langMatch = path.match(/^\/(uk|ru)(\/|$)/);
      if (langMatch) {
        return langMatch[1]; // 'uk' или 'ru'
      }

      // Проверяем поддомен (ru.example.com или uk.example.com)
      const hostname = window.location.hostname;
      const subdomainMatch = hostname.match(/^(uk|ru)\./);
      if (subdomainMatch) {
        return subdomainMatch[1]; // 'uk' или 'ru'
      }

      return null;
    };

    // Приоритет: URL > localStorage > браузер > по умолчанию
    const urlLang = detectLanguageFromUrl();
    const savedLang = localStorage.getItem('preferred_language');
    const browserLang = navigator.language.split('-')[0];

    if (urlLang && ['uk', 'ru'].includes(urlLang)) {
      setLanguage(urlLang);
    } else if (savedLang && ['uk', 'ru'].includes(savedLang)) {
      setLanguage(savedLang);
    } else if (browserLang === 'uk' || browserLang === 'ru') {
      setLanguage(browserLang);
    }
    // else остается defaultLang = 'uk'
  }, []);

  // Загрузка переводов - отключена, используем статические переводы в компонентах
  const loadTranslations = async (lang: string) => {
    if (translations[lang]) return; // Уже загружены

    setIsLoading(true);
    try {
      // Пока используем только локальные переводы
      // В будущем можно добавить загрузку с сервера
      setTranslations(prev => ({
        ...prev,
        [lang]: {}
      }));
    } catch (error) {
      console.error('Error loading translations:', error);
      setTranslations(prev => ({
        ...prev,
        [lang]: {}
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка переводов при смене языка - отключена
  // useEffect(() => {
  //   loadTranslations(language);
  // }, [language]);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('preferred_language', lang);
    document.documentElement.lang = lang; // Для accessibility

    // В клиентском приложении просто меняем язык без редиректа
    // WordPress на сервере будет обрабатывать URL с языковыми префиксами
    // Пользователь может вручную перейти на /ru/golovna для просмотра русской версии
  };

  // Функция перевода
  const t = (
      key: string,
      defaultValue: string = key,
      params?: Record<string, string>
  ): string => {
    let translation = translations[language]?.[key] || defaultValue;

    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }

    return translation;
  };

  return (
      <LanguageContext.Provider value={{
        language,
        changeLanguage,
        t,
        isLoading
      }}>
        {children}
      </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};