import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBaseUrl } from "@/utils/baseUrl";

// Маппинг slug'ов для разных языков
const SLUG_MAPPING = {
    golovna: {
        uk: 'golovna',
        ru: 'glavnaya'
    }
};

const getLocalizedSlug = (baseSlug, language) => {
    const mapping = SLUG_MAPPING[baseSlug];
    return mapping ? mapping[language] : baseSlug;
};

interface HeroStats {
  stats_value: string;
  stats_name: string;
}

interface HeroBlock {
  hero_title: string;
  hero_subtitle: string;
  hero_desc: string;
  hero_title_desc?: string;
  stats: HeroStats[];
}

interface HeroData {
  hero: HeroBlock;
}

export const useMultilangHero = () => {
  const { language } = useLanguage();
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        setLoading(true);

        const baseUrl = getBaseUrl();

        // Получаем правильный slug для текущего языка
        const localizedSlug = getLocalizedSlug('golovna', language);

        let data;
        // Используем только стандартный WordPress REST API
        const response = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=${localizedSlug}&lang=${language}&_embed`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          data = await response.json();
        }

        // Если это массив (стандартный endpoint), берем первый элемент
        const page = Array.isArray(data) ? data[0] : data;

        // Извлекаем hero блок из ACF данных
        const heroBlock = page?.acf?.add_block?.find(
          (block: any) => block.acf_fc_layout === 'hero_section' || block.hero
        );

        if (heroBlock) {
          setHeroData({
            hero: {
              hero_title: heroBlock.hero_title || heroBlock.hero?.hero_title || '',
              hero_subtitle: heroBlock.hero_subtitle || heroBlock.hero?.hero_subtitle || '',
              hero_desc: heroBlock.hero_desc || heroBlock.hero?.hero_desc || '',
              hero_title_desc: heroBlock.hero_title_desc || heroBlock.hero?.hero_title_desc,
              stats: heroBlock.stats || heroBlock.hero?.stats || []
            }
          });
        } else {
          // Fallback данные если блок не найден
          setHeroData({
            hero: {
              hero_title: language === 'uk' ? 'Сучасна медицина та краса' : 'Современная медицина и красота',
              hero_subtitle: language === 'uk' ? 'Професійна допомога' : 'Профессиональная помощь',
              hero_desc: language === 'uk' ? 'Ми пропонуємо широкий спектр медичних та косметологічних послуг для турботи про ваше здоров\'я та красу.' : 'Мы предлагаем широкий спектр медицинских и косметологических услуг для заботы о вашем здоровье и красоте.',
              stats: [
                { stats_value: '500+', stats_name: language === 'uk' ? 'Клієнтів' : 'Клиентов' },
                { stats_value: '10+', stats_name: language === 'uk' ? 'Літ досвіду' : 'Лет опыта' },
                { stats_value: '50+', stats_name: language === 'uk' ? 'Процедур' : 'Процедур' },
                { stats_value: '24/7', stats_name: language === 'uk' ? 'Підтримка' : 'Поддержка' }
              ]
            }
          });
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching hero data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch hero data');

        // Устанавливаем fallback данные даже при ошибке
        setHeroData({
          hero: {
            hero_title: language === 'uk' ? 'Сучасна медицина та краса' : 'Современная медицина и красота',
            hero_subtitle: language === 'uk' ? 'Професійна допомога' : 'Профессиональная помощь',
            hero_desc: language === 'uk' ? 'Ми пропонуємо широкий спектр медичних та косметологічних послуг для турботи про ваше здоров\'я та красу.' : 'Мы предлагаем широкий спектр медицинских и косметологических услуг для заботы о вашем здоровье и красоте.',
            stats: [
              { stats_value: '500+', stats_name: language === 'uk' ? 'Клієнтів' : 'Клиентов' },
              { stats_value: '10+', stats_name: language === 'uk' ? 'Літ досвіду' : 'Лет опыта' },
              { stats_value: '50+', stats_name: language === 'uk' ? 'Процедур' : 'Процедур' },
              { stats_value: '24/7', stats_name: language === 'uk' ? 'Підтримка' : 'Поддержка' }
            ]
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, [language]);

  return { heroData, loading, error };
};


