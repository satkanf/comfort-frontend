import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
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

interface MultilangDoctor {
  id: number;
  title: { rendered: string };
  slug: string;
  acf?: any;
  _embedded?: any;
}

interface DoctorsBlock {
  acf_fc_layout: string;
  title?: string;
  description?: string;
  home_doctors_add?: Array<{
    ID: number;
    post_title: string;
    post_name: string;
  }>;
  [key: string]: any;
}

export const useMultilangDoctors = (acfFieldName: string = "home_doctors_add") => {
  const { language } = useLanguage();
  const [doctors, setDoctors] = useState<MultilangDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockData, setBlockData] = useState<{
    title: string;
    description?: string;
  } | null>(null);

  // Загружаем врачей напрямую из API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        // Загружаем данные из главной страницы для получения заголовка блока
        const baseUrl = getBaseUrl();
        const localizedSlug = getLocalizedSlug('golovna', language);

        let pageResponse;
        let pageData;
        // Используем только стандартный WordPress REST API
        const pageUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=${localizedSlug}&lang=${language}&_embed`;
        pageResponse = await fetch(pageUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        if (!pageResponse.ok) {
          throw new Error(`HTTP error! status: ${pageResponse.status}`);
        }
        pageData = await pageResponse.json();

        let doctorIds: number[] = [];
        let blockTitle = "Наші лікарі";
        let blockDescription = "";

        if (pageData) {
          const page = Array.isArray(pageData) ? pageData[0] : pageData;

          let doctorsBlock: DoctorsBlock | undefined = page.acf?.add_block?.find(
            (block: DoctorsBlock) =>
              block.acf_fc_layout === "home_doctors" ||
              !!block[acfFieldName] ||
              !!block.home_doctors_add
          );

          if (doctorsBlock) {
            blockTitle = doctorsBlock.home_doctors_title ||
                        doctorsBlock.title ||
                        doctorsBlock.acf?.home_doctors_title ||
                        doctorsBlock.acf?.title ||
                        "Наші лікарі";

            blockDescription = doctorsBlock.home_doctors_desc ||
                             doctorsBlock.description ||
                             doctorsBlock.acf?.home_doctors_desc ||
                             doctorsBlock.acf?.description ||
                             "";

            // Извлекаем ID врачей из блока
            const items = doctorsBlock.acf?.[acfFieldName] || doctorsBlock.acf?.home_doctors_add || doctorsBlock[acfFieldName] || doctorsBlock.home_doctors_add || [];

            if (Array.isArray(items)) {
              items.forEach((item: any) => {
                if (typeof item === 'number') {
                    // Прямое число (ID)
                    doctorIds.push(item);
                } else if (item && typeof item === 'object' && item.ID) {
                    // Объект с полем ID
                    doctorIds.push(item.ID);
                }
              });
            }
          } else {
            // Резервный механизм: оставляем doctorIds пустым, что приведет к загрузке всех врачей
          }
        }

        setBlockData({
          title: blockTitle,
          description: blockDescription,
        });


        // Если есть ID врачей, загружаем только их, иначе загружаем всех
        let doctorsUrl: string;
        if (doctorIds.length > 0) {
          doctorsUrl = `${baseUrl}/wp-json/wp/v2/doctors?include=${doctorIds.join(',')}&_embed=1&acf_format=standard&lang=${language}`;
        } else {
          doctorsUrl = `${baseUrl}/wp-json/wp/v2/doctors?per_page=20&_embed=1&acf_format=standard&lang=${language}`;
        }

        const response = await fetch(doctorsUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          console.error('useMultilangDoctors: API request failed with status:', response.status);
          console.error('useMultilangDoctors: Response text:', await response.text());
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDoctors(data);

      } catch (err: any) {
        setError(err.message || "Неизвестная ошибка");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [language, acfFieldName]);

  return {
    doctors,
    loading,
    error,
    blockData,
  };
};