import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from "react-router-dom";
import { Percent, Clock, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/translations';
import { getBaseUrl } from "@/utils/baseUrl";

interface Promotion {
  id: number;
  slug: string;
  title?: {
    rendered: string;
  };
  content?: {
    rendered: string;
  };
  date?: string;
  modified?: string;
  acf?: {
    promotion_image?: string;
    promotion_description?: string;
    promotion_description_ru?: string;
    promotion_discount?: string;
    promotion_price?: {
      promotion_price_old?: string;
      promotion_date?: string;
      promotion_price_new?: string;
      promotion_price_procent?: string;
    }
    promotion_status?: string;
    promotion_except?: string; // Добавляем поле исключений
    promotion_except_ru?: string; // Русский вариант исключений
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}
interface  PagePromotion {
  id: number;
  acf?: {
    page_promotion_title: string,
    page_promotion_subtitle: string
  }
}

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [pagePromotion, setPagePromotion] = useState<PagePromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();

  const fetchPagePromotion = async () => {
    try {
      setLoading(true);

      const baseUrl = getBaseUrl();
      const requestUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=promotion&lang=${language}&_embed&acf_format=standard`;

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

      // API возвращает объект, а не массив, поэтому обрабатываем его как массив из одного элемента
      const dataArray = Array.isArray(data) ? data : [data];

      // Фильтруем некорректные данные
      const validPromotions = dataArray.filter((promo: any) =>
          promo && typeof promo === 'object' && (promo.title || promo.acf?.page_promotion_title)
      );

      setPagePromotion(validPromotions);

    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const fetchPromotions = async () => {
    try {
      setLoading(true);

      const baseUrl = getBaseUrl();
      const requestUrl = `${baseUrl}/wp-json/wp/v2/promotion?_embed&acf_format=standard&per_page=100&lang=${language}`;

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

      // Фильтруем некорректные данные
      const validPromotions = data.filter((promo: any) =>
        promo && typeof promo === 'object' && promo.title
      );

      setPromotions(validPromotions);

    } finally {
      setLoading(false);
    }
  };


  // Функция для безопасного получения строки
  const getSafeString = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') return Object.values(field).join(', ');
    return String(field || '');
  };

  // Функция для безопасного получения заголовка
  const getSafeTitle = (promo: Promotion): string => {
    return promo?.title?.rendered || translations.pages.promotions.defaultTitle[language];
  };

  // Функция для безопасного получения описания с учетом языка
  const getSafeDescription = (promo: Promotion): string => {
    const ruDescription = getSafeString(promo.acf?.promotion_description_ru);
    const ukDescription = getSafeString(promo.acf?.promotion_description);

    let description = '';
    if (language === 'ru' && ruDescription) {
      description = ruDescription;
    } else if (ukDescription) {
      description = ukDescription;
    } else if (ruDescription) {
      description = ruDescription; // Fallback на русский
    }

    if (description) return description;

    const content = promo.content?.rendered || '';
    return content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  };

  // Функция для получения исключений с учетом языка
  const getPromotionExcept = (promo: Promotion): string => {
    const ruExcept = getSafeString(promo.acf?.promotion_except_ru);
    const ukExcept = getSafeString(promo.acf?.promotion_except);

    if (language === 'ru' && ruExcept) {
      return ruExcept;
    }
    return ukExcept || ruExcept; // Fallback на русский если украинский пустой
  };

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Функция для получения изображения
  const getPromotionImage = (promotion: Promotion): string => {
    // Сначала пробуем получить из ACF поля
    const acfImage = getSafeString(promotion.acf?.promotion_image);
    if (acfImage) return acfImage;
    
    // Затем из featured media
    const featuredImage = promotion._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    if (featuredImage) return featuredImage;
    
    // Fallback изображение
    return '';
  };

  useEffect(() => {
    fetchPagePromotion();
    fetchPromotions();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="h-12 bg-muted rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-2/3 mx-auto animate-pulse"></div>
              </div>
            </div>
          </section>
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {[1, 2].map(i => (
                  <div key={i} className="bg-muted rounded-lg h-96 animate-pulse"></div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              {pagePromotion.length > 0 ? (
                  pagePromotion.map((promo, index) => {
                    const promotionTitle = getSafeString(promo.acf?.page_promotion_title);
                    const promotionSubtitle = getSafeString(promo.acf?.page_promotion_subtitle);

                    // Якщо немає заголовка, пропускаємо
                    if (!promotionTitle) return null;

                    return (
                        <div key={promo.id || `promo-${index}`} className="mb-8">
                          <h1 className="text-5xl font-bold text-foreground mb-4">
                            {promotionTitle}
                          </h1>
                          {promotionSubtitle && (
                              <p className="text-muted-foreground text-lg">
                                {promotionSubtitle}
                              </p>
                          )}
                        </div>
                    );
                  })
              ) : (
                  // Fallback заголовки, если API не вернул данные
                  <div className="mb-8">
                    <h1 className="text-5xl font-bold text-foreground mb-4">
                      {translations.pages.promotions.title[language]}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {translations.pages.promotions.subtitle[language]}
                    </p>
                  </div>
              )}
            </div>


          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            {promotions.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {promotions.map((promo) => {
                  const discount = getSafeString(promo.acf?.promotion_price?.promotion_price_procent);
                  const title = getSafeTitle(promo);
                  const description = getSafeDescription(promo);
                  const newPrice = getSafeString(promo.acf?.promotion_price?.promotion_price_new);
                  const oldPrice = getSafeString(promo.acf?.promotion_price?.promotion_price_old);
                  const endDate = getSafeString(promo.acf?.promotion_price?.promotion_date);
                  const except = getPromotionExcept(promo);
                  const image = getPromotionImage(promo);
                  return (
                    <Card
                      key={promo.id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-medical-gray-light to-secondary/30">
                        {image ? (
                          <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar className="w-16 h-16 text-primary/40" />
                          </div>
                        )}
                        {discount && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-primary text-white text-lg px-4 py-2">
                              <Percent className="w-4 h-4 inline mr-1" />
                              {discount}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-2xl">{title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 flex-grow">
                       
                        
                        {/* Блок с исключениями */}
                        {except && (
                          <p className="text-muted-foreground">{except}</p>
                        )}
                        
                        {(newPrice || oldPrice) && (
                          <div className="flex items-center gap-4">
                            <div>
                              {oldPrice && (
                                <span className="text-muted-foreground line-through text-sm">
                                  {oldPrice}
                                </span>
                              )}
                              {newPrice && (
                                <span className="text-2xl font-bold text-primary ml-3">
                                  {newPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {endDate && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{translations.pages.promotions.validUntil[language]} {endDate}</span>
                          </div>
                        )}

                        <Button
                          className="w-full mt-4"
                          onClick={() => navigate(`/promotion/${promo.slug}`)}
                        >
                          {translations.pages.promotions.details[language]}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {translations.pages.promotions.noPromotions[language]}
                </p>
              </div>
            )}

            <div className="mt-12 text-center max-w-2xl mx-auto">
              <p className="text-muted-foreground text-sm">
                {translations.pages.promotions.disclaimer[language]}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Promotions;