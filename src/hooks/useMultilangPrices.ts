import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBaseUrl } from "@/utils/baseUrl";

interface PriceService {
  price_label: string;
  price_label_ru?: string;
  price_value: string;
}

interface PriceItem {
  id: number;
  title: {
    rendered: string;
  };
  acf?: {
    price_list?: PriceService[];
    category?: string;
    category_ru?: string;
  };
}

interface TransformedPriceCategory {
  id: string;
  category: string;
  categoryRu: string;
  services: Array<{
    name: string;
    nameRu: string;
    price: string;
  }>;
}

export const useMultilangPrices = () => {
  const { language } = useLanguage();
  const [priceCategories, setPriceCategories] = useState<TransformedPriceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);

        // Используем стандартный API цен WordPress
        const baseUrl = getBaseUrl();
        const requestUrl = `${baseUrl}/wp-json/wp/v2/price?per_page=100&_embed&lang=${language}`;

        const response = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const transformedData = transformAPIDataToCategories(data);
        setPriceCategories(transformedData);
        setError(null);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices data');
        setPriceCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [language]);

  // Функция для преобразования данных API в структуру категорий
  const transformAPIDataToCategories = (apiData: PriceItem[]): TransformedPriceCategory[] => {
    const categories: TransformedPriceCategory[] = [];

    apiData.forEach(item => {
      // Проверяем есть ли поле price_list
      if (item.acf?.price_list && Array.isArray(item.acf.price_list)) {

        // Используем заголовок как название категории
        const categoryName = item.title.rendered;
        const categoryNameRu = item.title.rendered; // Можно добавить отдельное поле для русского

        // Преобразуем price_list в массив услуг
        const services = item.acf.price_list
          .filter(priceItem => priceItem.price_label && priceItem.price_value)
          .map(priceItem => ({
            name: priceItem.price_label,
            nameRu: priceItem.price_label_ru || priceItem.price_label,
            price: priceItem.price_value
          }));

        // Если есть услуги, добавляем категорию
        if (services.length > 0) {
          const categoryId = categoryName.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-zа-яё0-9-]/gi, '');

          categories.push({
            id: categoryId,
            category: categoryName,
            categoryRu: categoryNameRu,
            services
          });
        }
      }
    });

    return categories;
  };

  return { priceCategories, loading, error };
};
