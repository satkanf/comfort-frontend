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

interface AboutAdvantage {
  about_advantages_title: string;
  about_advantages_desc: string;
  about_advantages_icon: string;
}

interface AboutText {
  acf_fc_layout: string;
  '': string; // Содержимое текста
}

interface AboutBlock {
  about_title: string;
  about_title_desc: string;
  about_advantages: AboutAdvantage[];
  about_desc: AboutText[];
}

interface AboutData {
  about: AboutBlock;
}

export const useMultilangAbout = () => {
  const { language } = useLanguage();
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);

        const baseUrl = getBaseUrl();
        const localizedSlug = getLocalizedSlug('golovna', language);

        let data;
        // Используем только стандартный WordPress REST API
        const response = await fetch(`${baseUrl}/wp-json/wp/v2/pages?slug=${localizedSlug}&lang=${language}&_embed`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();

        // Если это массив (стандартный endpoint), берем первый элемент
        const page = Array.isArray(data) ? data[0] : data;

        // Извлекаем about блок из ACF данных
        const aboutBlock = page?.acf?.add_block?.find(
          (block: any) => block.acf_fc_layout === 'about_section' || block.about
        );

        if (aboutBlock) {
          setAboutData({
            about: {
              about_title: aboutBlock.about_title || aboutBlock.about?.about_title || '',
              about_title_desc: aboutBlock.about_title_desc || aboutBlock.about?.about_title_desc || '',
              about_advantages: aboutBlock.about_advantages || aboutBlock.about?.about_advantages || [],
              about_desc: aboutBlock.about_desc || aboutBlock.about?.about_desc || []
            }
          });
        } else {
          // Fallback данные если блок не найден
          setAboutData({
            about: {
              about_title: language === 'uk' ? 'Про нас' : 'О нас',
              about_title_desc: language === 'uk' ? 'Сучасна медицина та косметологія в центрі Ірпеня' : 'Современная медицина и косметология в центре Ирпеня',
              about_advantages: [
                {
                  about_advantages_title: language === 'uk' ? 'Досвід' : 'Опыт',
                  about_advantages_desc: language === 'uk' ? 'Багаторічний досвід роботи' : 'Многолетний опыт работы',
                  about_advantages_icon: '/icons/experience.svg'
                },
                {
                  about_advantages_title: language === 'uk' ? 'Якість' : 'Качество',
                  about_advantages_desc: language === 'uk' ? 'Високоякісні послуги' : 'Высококачественные услуги',
                  about_advantages_icon: '/icons/quality.svg'
                },
                {
                  about_advantages_title: language === 'uk' ? 'Інновації' : 'Инновации',
                  about_advantages_desc: language === 'uk' ? 'Сучасне обладнання' : 'Современное оборудование',
                  about_advantages_icon: '/icons/innovation.svg'
                },
                {
                  about_advantages_title: language === 'uk' ? 'Турбота' : 'Забота',
                  about_advantages_desc: language === 'uk' ? 'Індивідуальний підхід' : 'Индивидуальный подход',
                  about_advantages_icon: '/icons/care.svg'
                }
              ],
              about_desc: [
                {
                  acf_fc_layout: 'about_text',
                  '': language === 'uk'
                    ? '<p>Комфорт Медікал - це сучасна клініка, яка пропонує широкий спектр медичних та косметологічних послуг. Наша команда професіоналів гарантує високу якість обслуговування та турботу про кожного пацієнта.</p>'
                    : '<p>Комфорт Медикал - это современная клиника, которая предлагает широкий спектр медицинских и косметологических услуг. Наша команда профессионалов гарантирует высокое качество обслуживания и заботу о каждом пациенте.</p>'
                }
              ]
            }
          });
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch about data');

        // Устанавливаем fallback данные даже при ошибке
        setAboutData({
          about: {
            about_title: language === 'uk' ? 'Про нас' : 'О нас',
            about_title_desc: language === 'uk' ? 'Сучасна медицина та косметологія в центрі Ірпеня' : 'Современная медицина и косметология в центре Ирпеня',
            about_advantages: [
              {
                about_advantages_title: language === 'uk' ? 'Досвід' : 'Опыт',
                about_advantages_desc: language === 'uk' ? 'Багаторічний досвід роботи' : 'Многолетний опыт работы',
                about_advantages_icon: '/icons/experience.svg'
              },
              {
                about_advantages_title: language === 'uk' ? 'Якість' : 'Качество',
                about_advantages_desc: language === 'uk' ? 'Високоякісні послуги' : 'Высококачественные услуги',
                about_advantages_icon: '/icons/quality.svg'
              },
              {
                about_advantages_title: language === 'uk' ? 'Інновації' : 'Инновации',
                about_advantages_desc: language === 'uk' ? 'Сучасне обладнання' : 'Современное оборудование',
                about_advantages_icon: '/icons/innovation.svg'
              },
              {
                about_advantages_title: language === 'uk' ? 'Турбота' : 'Забота',
                about_advantages_desc: language === 'uk' ? 'Індивідуальний підхід' : 'Индивидуальный подход',
                about_advantages_icon: '/icons/care.svg'
              }
            ],
            about_desc: [
              {
                acf_fc_layout: 'about_text',
                '': language === 'uk'
                  ? '<p>Комфорт Медікал - це сучасна клініка, яка пропонує широкий спектр медичних та косметологічних послуг. Наша команда професіоналів гарантує високу якість обслуговування та турботу про кожного пацієнта.</p>'
                  : '<p>Комфорт Медикал - это современная клиника, которая предлагает широкий спектр медицинских и косметологических услуг. Наша команда профессионалов гарантирует высокое качество обслуживания и заботу о каждом пациенте.</p>'
              }
            ]
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [language]);

  return { aboutData, loading, error };
};


