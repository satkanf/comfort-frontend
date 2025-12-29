import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationTranslations {
  navHome: string;
  navAbout: string;
  navServices: string;
  navDoctors: string;
  navPrices: string;
  navPromotions: string;
  navBlog: string;
  navContacts: string;
  navAllServices: string;
  footerTitle: string;
  footerDescription: string;
  footerServices: string;
  footerDoctors: string;
  footerContacts: string;
  footerAddress: string;
  footerPhone: string;
  footerEmail: string;
  footerWorkingHours: string;
}

export const useMultilangNavigation = () => {
  const { language } = useLanguage();
  const [navTranslations, setNavTranslations] = useState<NavigationTranslations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNavigationTranslations = async () => {
      try {
        setLoading(true);

        // Пока используем статические переводы, но в будущем можно добавить загрузку из WordPress
        const translations: NavigationTranslations = {
          navHome: language === 'uk' ? 'Головна' : 'Главная',
          navAbout: language === 'uk' ? 'Про нас' : 'О нас',
          navServices: language === 'uk' ? 'Послуги' : 'Услуги',
          navDoctors: language === 'uk' ? 'Лікарі' : 'Врачи',
          navPrices: language === 'uk' ? 'Ціни' : 'Цены',
          navPromotions: language === 'uk' ? 'Акції' : 'Акции',
          navBlog: language === 'uk' ? 'Блог' : 'Блог',
          navContacts: language === 'uk' ? 'Контакти' : 'Контакты',
          navAllServices: language === 'uk' ? 'Всі послуги' : 'Все услуги',
          footerTitle: language === 'uk' ? 'Комфорт Медікал' : 'Комфорт Медикал',
          footerDescription: language === 'uk' ? 'Сучасна медицина та косметологія в центрі Ірпеня' : 'Современная медицина и косметология в центре Ирпеня',
          footerServices: language === 'uk' ? 'Послуги' : 'Услуги',
          footerDoctors: language === 'uk' ? 'Лікарі' : 'Врачи',
          footerContacts: language === 'uk' ? 'Контакти' : 'Контакты',
          footerAddress: language === 'uk' ? 'Адреса' : 'Адрес',
          footerPhone: language === 'uk' ? 'Телефон' : 'Телефон',
          footerEmail: language === 'uk' ? 'Email' : 'Email',
          footerWorkingHours: language === 'uk' ? 'Години роботи' : 'Часы работы'
        };

        setNavTranslations(translations);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load navigation translations');

        // Fallback переводы
        setNavTranslations({
          navHome: language === 'uk' ? 'Головна' : 'Главная',
          navAbout: language === 'uk' ? 'Про нас' : 'О нас',
          navServices: language === 'uk' ? 'Послуги' : 'Услуги',
          navDoctors: language === 'uk' ? 'Лікарі' : 'Врачи',
          navPrices: language === 'uk' ? 'Ціни' : 'Цены',
          navPromotions: language === 'uk' ? 'Акції' : 'Акции',
          navBlog: language === 'uk' ? 'Блог' : 'Блог',
          navContacts: language === 'uk' ? 'Контакти' : 'Контакты',
          navAllServices: language === 'uk' ? 'Всі послуги' : 'Все услуги',
          footerTitle: language === 'uk' ? 'Комфорт Медікал' : 'Комфорт Медикал',
          footerDescription: language === 'uk' ? 'Сучасна медицина та косметологія в центрі Ірпеня' : 'Современная медицина и косметология в центре Ирпеня',
          footerServices: language === 'uk' ? 'Послуги' : 'Услуги',
          footerDoctors: language === 'uk' ? 'Лікарі' : 'Врачи',
          footerContacts: language === 'uk' ? 'Контакти' : 'Контакты',
          footerAddress: language === 'uk' ? 'Адреса' : 'Адрес',
          footerPhone: language === 'uk' ? 'Телефон' : 'Телефон',
          footerEmail: language === 'uk' ? 'Email' : 'Email',
          footerWorkingHours: language === 'uk' ? 'Години роботи' : 'Часы работы'
        });
      } finally {
        setLoading(false);
      }
    };

    loadNavigationTranslations();
  }, [language]);

  return { navTranslations, loading, error };
};








