import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Percent, ArrowLeft, CheckCircle, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBaseUrl } from "@/utils/baseUrl";
import BookingDialog from "@/components/BookingDialog";
import { getStaticTranslation } from '@/translations/static';

interface PromotionData {
  id: number;
  title: { rendered: string };
  slug: string;
  acf: {
    promotion_image?: number;
    promotion_except?: string;
    promotion_price?: {
      promotion_price_old: string;
      promotion_price_new: string;
      promotion_price_procent: string;
      promotion_date: string;
    };
    promotion_content?: Array<{
      acf_fc_layout: string;
      promotion_desc: string;
    }>;
  };
  translations?: { [key: string]: number };
}

const PromotionDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [promotion, setPromotion] = useState<PromotionData | null>(null);
  const [promotionImageUrl, setPromotionImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения URL изображения по ID
  const fetchPromotionImageUrl = async (imageId: number): Promise<string> => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/wp-json/wp/v2/media/${imageId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const mediaData = await response.json();
      return mediaData.guid?.rendered || mediaData.source_url || '';
    } catch (err) {
      return '';
    }
  };

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = getBaseUrl();

        // Сначала пробуем найти акцию по slug и текущему языку
        let requestUrl = `${baseUrl}/wp-json/wp/v2/promotion?slug=${slug}&lang=${language}&_embed`;

        let response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        let data = await response.json();

        // Если акция не найдена на текущем языке, ищем на другом языке и находим translation
        if (data.length === 0) {
          // Определяем другой язык
          const otherLanguage = language === 'uk' ? 'ru' : 'uk';

          // Ищем акцию на другом языке
          const fallbackUrl = `${baseUrl}/wp-json/wp/v2/promotion?slug=${slug}&lang=${otherLanguage}&_embed`;
          const fallbackResponse = await fetch(fallbackUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          });

          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.length > 0) {
              const fallbackPromotion = fallbackData[0];

              // Если есть translations, находим акцию на текущем языке
              if (fallbackPromotion.translations && fallbackPromotion.translations[language]) {
                const translatedId = fallbackPromotion.translations[language];
                const translationUrl = `${baseUrl}/wp-json/wp/v2/promotion/${translatedId}?_embed`;

                response = await fetch(translationUrl, {
                  method: 'GET',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  }
                });

                if (response.ok) {
                  data = [await response.json()];
                } else {
                  throw new Error('Failed to load translated promotion');
                }
              } else {
                throw new Error('No translation found for promotion');
              }
            } else {
              throw new Error('Promotion not found on any language');
            }
          } else {
            throw new Error('Promotion not found');
          }
        }

        if (data.length === 0) {
          throw new Error('Promotion not found');
        }

        const promotionData = data[0];
        setPromotion(promotionData);

        // Получаем URL изображения акции, если оно есть
        if (promotionData.acf?.promotion_image) {
          const imageUrl = await fetchPromotionImageUrl(promotionData.acf.promotion_image);
          setPromotionImageUrl(imageUrl);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch promotion');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPromotion();
    }
  }, [slug, language]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !promotion) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              {getStaticTranslation('promotions.notFound', language as "uk" | "ru")}
            </h1>
            <Button onClick={() => navigate("/promotion")}>
              {getStaticTranslation('promotions.backToPromotions', language as "uk" | "ru")}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[400px] overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20">
          {promotionImageUrl ? (
            <img
              src={promotionImageUrl}
              alt={promotion.title.rendered}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-primary/20 to-accent/20">
              <ImageIcon className="w-24 h-24 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container mx-auto px-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/promotion")}
                className="mb-4 text-white hover:text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getStaticTranslation('promotions.backToPromotionsAlt', language as "uk" | "ru")}
              </Button>
              <div className="flex items-start gap-4">
                {promotion.acf?.promotion_price?.promotion_price_procent && (
                  <Badge className="bg-primary text-white text-xl px-6 py-3 shadow-lg">
                    <Percent className="w-5 h-5 inline mr-2" />
                    {promotion.acf.promotion_price.promotion_price_procent}
                  </Badge>
                )}
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {promotion.title.rendered}
                  </h1>
                  {promotion.acf?.promotion_except && (
                    <p className="text-xl text-white/90">{promotion.acf.promotion_except}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                {promotion.acf?.promotion_content?.map((block, index) => (
                  <Card key={index}>
                    <CardContent className="p-8">
                      <div dangerouslySetInnerHTML={{ __html: block.promotion_desc }} />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="sticky top-4">
                  <CardContent className="p-6 space-y-6">
                    {promotion.acf?.promotion_price && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {getStaticTranslation('common.oldPrice', language as "uk" | "ru")}
                          </p>
                          <p className="text-2xl line-through text-muted-foreground">
                            {promotion.acf.promotion_price.promotion_price_old}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {getStaticTranslation('common.discountPrice', language as "uk" | "ru")}
                          </p>
                          <p className="text-4xl font-bold text-primary">
                            {promotion.acf.promotion_price.promotion_price_new}
                          </p>
                        </div>
                      </>
                    )}

                    {promotion.acf?.promotion_price?.promotion_date && (
                      <div className="flex items-center gap-2 text-muted-foreground py-4 border-y">
                        <Clock className="w-5 h-5" />
                        <div>
                          <p className="text-sm">{getStaticTranslation('common.validUntil', language as "uk" | "ru")}</p>
                          <p className="font-semibold">{promotion.acf.promotion_price.promotion_date}</p>
                        </div>
                      </div>
                    )}

                    <BookingDialog
                      triggerText={getStaticTranslation('common.bookAppointment', language as "uk" | "ru")}
                    />

                    <p className="text-xs text-muted-foreground text-center">
                      * {getStaticTranslation('promotions.notSummable', language as "uk" | "ru")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PromotionDetail;