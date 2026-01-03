import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBaseUrl } from '@/utils/baseUrl';
import { fetchImageUrls, fetchPriceData, fetchDoctorData } from '@/utils/api';
import DoctorCard from '@/components/DoctorCard';
import BookingDialog from '@/components/BookingDialog';
import SEO from "@/components/SEO.tsx";

interface ServiceData {
  id: number;
  title: { rendered: string };
  slug: string;
  content?: { rendered: string };
  featured_media: number;
  acf?: {
    service_content?: Array<{
      acf_fc_layout: string;

      // Текст с изображением (изображение + текст)
      service_tx_image?: any; // Изображение
      service_text_im?: string; // Текст
      service_tx_im_mr?: string;

      // Изображение с текстом (изображение + текст)
      service_image_tx?: any; // Изображение
      service_im_text?: string; // Текст
      service_im_tx_mk?: string;

      service_img_top?: any;
      service_text_bt?: string;

      service_txt_top?: string;
      service_img_bt?: any;

      // Цена услуги
      service_price_add?: string;

      // Врачи для услуги
      service_doctors_add?: number[] | string;

      // Простой текст
      service_text_add?: string;

      // Баннер услуги
      service_banner_image?: any; // Изображение
    }>;
  };
  translations?: { [key: string]: number };
}

const ServicesDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Декодируем slug на случай, если он содержит специальные символы
  const decodedSlug = slug ? decodeURIComponent(slug) : '';
  console.log('ServicesDetail: Original slug:', slug, 'Decoded slug:', decodedSlug);
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<{[key: number]: string}>({});
  const [priceData, setPriceData] = useState<{[key: number]: any}>({});
  const [doctorData, setDoctorData] = useState<{[key: number]: any}>({});
  const [doctorImageUrls, setDoctorImageUrls] = useState<{[key: number]: string}>({});

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = getBaseUrl();

        // Сначала пробуем найти услугу по slug и текущему языку
        let requestUrl = `${baseUrl}/wp-json/wp/v2/services?slug=${decodedSlug}&lang=${language}&_embed`;

        let response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        let data = await response.json();

        // Если услуга не найдена на текущем языке, ищем на другом языке и находим translation
        if (data.length === 0) {
          // Определяем другой язык
          const otherLanguage = language === 'uk' ? 'ru' : 'uk';

          // Ищем услугу на другом языке
          const fallbackUrl = `${baseUrl}/wp-json/wp/v2/services?slug=${decodedSlug}&lang=${otherLanguage}&_embed`;
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
              const fallbackService = fallbackData[0];

              // Если есть translations, находим услугу на текущем языке
              if (fallbackService.translations && fallbackService.translations[language]) {
                const translatedId = fallbackService.translations[language];
                const translationUrl = `${baseUrl}/wp-json/wp/v2/services/${translatedId}?_embed`;

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
                  throw new Error('Failed to load translated service');
                }
              } else {
                throw new Error('No translation found for service');
              }
            } else {
              throw new Error('Service not found on any language');
            }
          } else {
            throw new Error('Service not found');
          }
        }

        if (data.length === 0) {
          throw new Error('Service not found');
        }

        const serviceData = data[0];
        setService(serviceData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch service');
      } finally {
        setLoading(false);
      }
    };

    if (decodedSlug) {
      fetchService();
    }
  }, [decodedSlug, language]);

  // Извлекаем данные из service объекта
  const serviceId = service?.id;
  const serviceTitle = service?.title?.rendered;
  const serviceSlug = service?.slug;
  const serviceContent = service?.content?.rendered;
  const serviceFeaturedMedia = service?.featured_media;

  // ACF данные
  const serviceAcf = service?.acf;
  const serviceContentBlocks = serviceAcf?.service_content;

  // Загружаем URL изображений
  useEffect(() => {
    const loadImageUrls = async () => {
      console.log('Loading images for service:', service?.title?.rendered);

      if (serviceContentBlocks && Array.isArray(serviceContentBlocks)) {
        const imageIds: number[] = [];

        serviceContentBlocks.forEach((block, index) => {
          console.log(`Processing block ${index}:`, block.acf_fc_layout);

          // Собираем только числовые ID изображений (не URL)
          if (block.acf_fc_layout === 'service_tx_im' && block.service_tx_image && typeof block.service_tx_image === 'number') {
            console.log('Found service_tx_image ID:', block.service_tx_image);
            imageIds.push(block.service_tx_image);
          }

          if (block.acf_fc_layout === 'service_im_tx' && block.service_image_tx && typeof block.service_image_tx === 'number') {
            console.log('Found service_image_tx ID:', block.service_image_tx);
            imageIds.push(block.service_image_tx);
          }

          if (block.acf_fc_layout === 'service_banner' && block.service_banner_image && typeof block.service_banner_image === 'number') {
            console.log('Found service_banner_image ID:', block.service_banner_image);
            imageIds.push(block.service_banner_image);
          }

          if (block.acf_fc_layout === 'service_image_top' && block.service_img_top && typeof block.service_img_top === 'number') {
            console.log('Found service_img_top ID:', block.service_img_top);
            imageIds.push(block.service_img_top);
          }
        });

        // Собираем ID цен для загрузки
        const priceIds: number[] = [];
        serviceContentBlocks.forEach((block) => {
          if (block.acf_fc_layout === 'service_price' && block.service_price_add) {
            // service_price_add может быть числом или массивом чисел
            if (typeof block.service_price_add === 'number') {
              console.log('Found service_price ID:', block.service_price_add);
              priceIds.push(block.service_price_add);
            } else if (Array.isArray(block.service_price_add)) {
              console.log('Found service_price IDs array:', block.service_price_add);
              block.service_price_add.forEach((priceId: number) => {
                if (typeof priceId === 'number') {
                  priceIds.push(priceId);
                }
              });
            }
          }
        });

        // Собираем ID врачей для загрузки
        const doctorIds: number[] = [];
        serviceContentBlocks.forEach((block) => {
          if (block.acf_fc_layout === 'service_doctors' && block.service_doctors_add) {
            // service_doctors_add может быть числом, массивом чисел или строкой
            if (typeof block.service_doctors_add === 'number') {
              console.log('Found service_doctor ID:', block.service_doctors_add);
              doctorIds.push(block.service_doctors_add);
            } else if (Array.isArray(block.service_doctors_add)) {
              console.log('Found service_doctor IDs array:', block.service_doctors_add);
              block.service_doctors_add.forEach((doctorId: number) => {
                if (typeof doctorId === 'number') {
                  doctorIds.push(doctorId);
                }
              });
            }
          }
        });

        console.log('Total image IDs found:', imageIds.length);

        if (imageIds.length > 0) {
          try {
            const urls = await fetchImageUrls(imageIds);
            console.log('Loaded image URLs:', urls);

            // Создаем объект, где ключ - ID изображения, значение - URL
            const imageUrlsMap: {[key: number]: string} = {};
            imageIds.forEach((id, index) => {
              if (typeof id === 'number' && urls[index]) {
                imageUrlsMap[id] = urls[index];
              }
            });

            setImageUrls(imageUrlsMap);
          } catch (err) {
            console.error('Error loading image URLs:', err);
          }
        } else {
          console.log('No image IDs found');
        }
      } else {
        console.log('No service content blocks found');
      }
    };

    if (service) {
      loadImageUrls();
    }
  }, [service]);

  // Загружаем цены
  useEffect(() => {
    const loadPrices = async () => {
      console.log('Loading prices for service:', service?.title?.rendered);

      if (serviceContentBlocks && Array.isArray(serviceContentBlocks)) {
        const priceIds: number[] = [];

        serviceContentBlocks.forEach((block) => {
          if (block.acf_fc_layout === 'service_price' && block.service_price_add) {
            // service_price_add может быть числом или массивом чисел
            if (typeof block.service_price_add === 'number') {
              console.log('Found service_price ID:', block.service_price_add);
              priceIds.push(block.service_price_add);
            } else if (Array.isArray(block.service_price_add)) {
              console.log('Found service_price IDs array:', block.service_price_add);
              block.service_price_add.forEach((priceId: number) => {
                if (typeof priceId === 'number') {
                  priceIds.push(priceId);
                }
              });
            }
          }
        });

        console.log('Total price IDs found:', priceIds.length);

        if (priceIds.length > 0) {
          try {
            const priceDataArray = await fetchPriceData(priceIds, language);
            console.log('Loaded price data:', priceDataArray);

            // Создаем объект, где ключ - ID цены, значение - данные цены
            const priceDataMap: {[key: number]: any} = {};
            priceIds.forEach((id, index) => {
              if (priceDataArray[index]) {
                priceDataMap[id] = priceDataArray[index];
              }
            });

            setPriceData(priceDataMap);
          } catch (err) {
            console.error('Error loading price data:', err);
          }
        } else {
          console.log('No price IDs found');
        }
      } else {
        console.log('No service content blocks found');
      }
    };

    if (service) {
      loadPrices();
    }
  }, [service]);

  // Загружаем данные врачей
  useEffect(() => {
    const loadDoctors = async () => {
      console.log('Loading doctors for service:', service?.title?.rendered);

      if (serviceContentBlocks && Array.isArray(serviceContentBlocks)) {
        const doctorIds: number[] = [];

        serviceContentBlocks.forEach((block) => {
          if (block.acf_fc_layout === 'service_doctors' && block.service_doctors_add) {
            // service_doctors_add может быть числом, массивом чисел или строкой
            if (typeof block.service_doctors_add === 'number') {
              console.log('Found service_doctor ID:', block.service_doctors_add);
              doctorIds.push(block.service_doctors_add);
            } else if (Array.isArray(block.service_doctors_add)) {
              console.log('Found service_doctor IDs array:', block.service_doctors_add);
              block.service_doctors_add.forEach((doctorId: number) => {
                if (typeof doctorId === 'number') {
                  doctorIds.push(doctorId);
                }
              });
            }
          }
        });

        console.log('Total doctor IDs found:', doctorIds.length);

        if (doctorIds.length > 0) {
          try {
            const doctorDataArray = await fetchDoctorData(doctorIds, language);
            console.log('Loaded doctor data:', doctorDataArray);

            // Обрабатываем данные врачей как на странице Doctors
            const processedDoctors = doctorDataArray.map((doctor: any) => {
              if (!doctor) return null;

              // Обрабатываем embedded медиа данные
              const embeddedMedia = doctor._embedded?.["wp:featuredmedia"]?.[0];
              const categoryNames = doctor._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.name) || [];

              return {
                ...doctor,
                _embedded: {
                  ...doctor._embedded,
                  featured: embeddedMedia || null,
                  featuredMediaId: doctor.featured_media || null
                },
                category_names: categoryNames,
              };
            }).filter(Boolean);

            // Создаем объект, где ключ - ID врача, значение - обработанные данные врача
            const doctorDataMap: {[key: number]: any} = {};
            doctorIds.forEach((id, index) => {
              if (processedDoctors[index]) {
                doctorDataMap[id] = processedDoctors[index];
              }
            });

            setDoctorData(doctorDataMap);

            console.log('Doctor data processed, images should be in _embedded:', doctorDataArray.map(d => ({
              id: d?.id,
              title: d?.title?.rendered,
              has_embedded_featured: !!d?._embedded?.featured,
              featured_source_url: d?._embedded?.featured?.source_url
            })));

          } catch (err) {
            console.error('Error loading doctor data:', err);
          }
        } else {
          console.log('No doctor IDs found');
        }
      } else {
        console.log('No service content blocks found');
      }
    };

    if (service) {
      loadDoctors();
    }
  }, [service, language]);

  // Если есть блоки контента, извлекаем данные из каждого блока
  let serviceTextBlocks: Array<{layout: string, text?: string, imageId?: number, imageText?: string}> = [];
  let serviceImageBlocks: Array<{imageId: number, text?: string}> = [];

  if (serviceContentBlocks && Array.isArray(serviceContentBlocks)) {
    serviceContentBlocks.forEach(block => {
      console.log(`Extracting data from block:`, block.acf_fc_layout);

      if (block.acf_fc_layout === 'service_text' && block.service_text_add) {
        serviceTextBlocks.push({
          layout: block.acf_fc_layout,
          text: block.service_text_add
        });
        console.log('Added text block:', block.service_text_add?.substring(0, 50) + '...');
      }

      else if (block.acf_fc_layout === 'service_tx_im') {
        serviceImageBlocks.push({
          imageId: block.service_tx_image,
          text: block.service_text_im
        });
        console.log('Added image-text block - Image ID:', block.service_tx_image, 'Text length:', block.service_text_im?.length);
      }

      else if (block.acf_fc_layout === 'service_im_tx') {
        serviceImageBlocks.push({
          imageId: block.service_image_tx,
          text: block.service_im_text
        });
        console.log('Added image-text block - Image ID:', block.service_image_tx, 'Text length:', block.service_im_text?.length);
      }

      else if (block.acf_fc_layout === 'service_price' && block.service_price_add) {
        console.log('Found price block:', block.service_price_add);
      }

      else if (block.acf_fc_layout === 'service_doctors' && block.service_doctors_add) {
        console.log('Found doctors block, length:', block.service_doctors_add.length);
      }

      else if (block.acf_fc_layout === 'service_banner' && block.service_banner_image) {
        console.log('Found banner block, image ID:', block.service_banner_image);
      }
    });
  }

  // Формируем описание из первого текстового блока
  const description = serviceTextBlocks.length > 0 ? serviceTextBlocks[0].text : '';
  const fullDescription = serviceTextBlocks.length > 1 ? serviceTextBlocks.slice(1).map(block => block.text).join('\n') : '';

  // Заголовок для SEO и страницы
  const title = serviceTitle || 'Услуга';
  const pageDescription = description ? description.replace(/<[^>]*>/g, '').substring(0, 160) : 'Медицинская услуга клиники Comfort';

  // Translations
  const serviceTranslations = service?.translations;

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

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              {language === 'ru' ? 'Услуга не найдена' : 'Послугу не знайдено'}
            </h1>
            <Button onClick={() => navigate("/services")}>
              {language === 'ru' ? 'Вернуться к услугам' : 'Повернутися до послуг'}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={title}
        description={pageDescription}
        canonical={`/services/${serviceSlug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          "name": title,
          "description": pageDescription,
          "provider": {
            "@type": "MedicalClinic",
            "name": "Comfort Clinic",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": language === 'ru' ? "ул. Западная 6" : "вул. Західна 6",
              "addressLocality": language === 'ru' ? "Ирпень" : "Ірпінь",
              "addressCountry": "UA"
            }
          }
        }}
      />
      <Header />
      <main className="flex-1">
        <section className="py-6 border-b bg-background">
          <div className="container">
            <Button variant="ghost" onClick={() => navigate("/services")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "ru" ? "Ко всем услугам" : "До всіх послуг"}
            </Button>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            </div>
          </div>
        </section>

        {/* Контент услуги из ACF блоков */}
        <section className="py-12 bg-background service-style">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {serviceContentBlocks && serviceContentBlocks.map((block, index) => {
                // Простой текстовый блок
                if (block.acf_fc_layout === 'service_text' && block.service_text_add) {
                  return (
                    <Card key={index} className="mb-8">
                      <CardContent className="p-8">
                        <div className="text-lg text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: block.service_text_add }} />
                      </CardContent>
                    </Card>
                  );
                }

                // Блок: Текст с изображением (сначала изображение, потом текст)
                else if (block.acf_fc_layout === 'service_tx_im' && (block.service_tx_image || block.service_text_im || block.service_tx_im_mr)) {
                  return (
                    <Card key={index} className="mb-8">
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Текст */}
                          {block.service_text_im && (
                              <div className="text-lg text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: block.service_text_im }} />
                          )}
                          {/* Изображение */}
                          {block.service_tx_image && (
                            <img
                              src={typeof block.service_tx_image === 'string' && block.service_tx_image.startsWith('http')
                                ? block.service_tx_image  // Прямой URL
                                : imageUrls[block.service_tx_image] || '/placeholder-image.svg'  // URL из API
                              }
                              alt={title}
                              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                              onError={(e) => {
                                console.log('Image failed to load:', block.service_tx_image);
                                e.currentTarget.src = '/placeholder-image.svg';
                              }}
                            />
                          )}
                          {block.service_tx_im_mr && (
                              <div className="col-span-2  text-lg text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: block.service_tx_im_mr }} />
                          )}


                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                // Блок: Изображение с текстом (сначала изображение, потом текст)
                else if (block.acf_fc_layout === 'service_im_tx' && (block.service_image_tx || block.service_im_text || block.service_im_tx_mk)) {
                  return (
                    <Card key={index} className="mb-8">
                      <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                          {block.service_image_tx && (
                            <img
                              src={typeof block.service_image_tx === 'string' && block.service_image_tx.startsWith('http')
                                ? block.service_image_tx  // Прямой URL
                                : imageUrls[block.service_image_tx] || '/placeholder-image.svg'  // URL из API
                              }
                              alt={title}
                              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                              onError={(e) => {
                                console.log('Image failed to load:', block.service_image_tx);
                                e.currentTarget.src = '/placeholder-image.svg';
                              }}
                            />
                          )}
                          {block.service_im_text && (
                              <div className="text-lg text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: block.service_im_text }} />
                          )}
                          {block.service_im_tx_mk && (
                            <div className="col-span-2" dangerouslySetInnerHTML={{ __html: block.service_im_tx_mk }} />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                else if (block.acf_fc_layout === 'service_text_top' && (block.service_txt_top || block.service_img_bt)) {
                  return (
                      <div className="space-y-8">
                        <Card key={index} className="mb-8">
                          <CardContent className="p-8">

                              {block.service_txt_top && (
                                  <div className="text-lg text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{__html: block.service_txt_top}}/>
                              )}
                            <img src={imageUrls[block.service_img_bt] || '/placeholder-image.svg'} alt={title} className="w-full h-[500px] object-cover rounded-lg shadow-lg" />
                          </CardContent>
                        </Card>

                      </div>
                  );
                }
                else if (block.acf_fc_layout === 'service_image_top' && (block.service_img_top || block.service_text_bt)) {
                  return (
                      <div className="space-y-8">

                        <Card key={index} className="mb-8">
                          <CardContent className="p-8">
                            {block.service_img_top && (
                              <img
                                src={typeof block.service_img_top === 'string' && block.service_img_top.startsWith('http')
                                  ? block.service_img_top  // Прямой URL
                                  : imageUrls[block.service_img_top] || '/placeholder-image.svg'  // URL из API
                                }
                                alt={title}
                                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                                onError={(e) => {
                                  console.log('Image failed to load:', block.service_img_top);
                                  e.currentTarget.src = '/placeholder-image.svg';
                                }}
                              />
                            )}
                            {block.service_text_bt && (
                                <div className="text-lg text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{__html: block.service_text_bt}}/>
                            )}

                          </CardContent>
                        </Card>

                      </div>
                  );
                }

                // Блок: Цена услуги
                else if (block.acf_fc_layout === 'service_price' && block.service_price_add) {
                  // Получаем все данные цен для отображения
                  const priceItems: any[] = [];
                  if (typeof block.service_price_add === 'number') {
                    const priceItem = priceData[block.service_price_add];
                    if (priceItem) priceItems.push(priceItem);
                  } else if (Array.isArray(block.service_price_add)) {
                    block.service_price_add.forEach((priceId: number) => {
                      const priceItem = priceData[priceId];
                      if (priceItem) priceItems.push(priceItem);
                    });
                  }

                  // Если нет данных о ценах, показываем сообщение о загрузке
                  if (priceItems.length === 0) {
                    return (
                      <Card key={index} className="mb-8">
                        <CardHeader>
                          <CardTitle className="text-2xl text-primary">
                            {language === 'ru' ? 'Стоимость услуги' : 'Вартість послуги'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                          <div className="text-center py-8">
                            <div className="animate-pulse">
                              <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
                              <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }

                  // Группируем цены по категориям для отображения в табах
                  const priceCategories: Array<{
                    id: string;
                    category: string;
                    services: Array<{
                      name: string;
                      price?: string;
                    }>;
                  }> = [];

                  priceItems.forEach((priceItem) => {
                    if (priceItem.acf?.price_list && Array.isArray(priceItem.acf.price_list)) {
                      const categoryName = priceItem.title?.rendered || 'Цены';
                      const categoryId = categoryName.toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-zа-яё0-9-]/gi, '');

                      const services = priceItem.acf.price_list
                        .filter((priceItem: any) => priceItem.price_label)
                        .map((priceItem: any) => ({
                          name: priceItem.price_label,
                          price: priceItem.price_value || ""
                        }));

                      if (services.length > 0) {
                        priceCategories.push({
                          id: categoryId,
                          category: categoryName,
                          services
                        });
                      }
                    }
                  });

                  return (
                    <Card key={index} className="mt-24">
                      <CardHeader>
                        <CardTitle className="text-3xl text-primary text-center">
                          {language === 'ru' ? 'Стоимость услуги' : 'Вартість послуги'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 pt-0">
                        {priceCategories.length > 0 ? (
                          <Tabs defaultValue={priceCategories[0]?.id} className="w-full">

                            {priceCategories.map((category) => (
                              <TabsContent key={category.id} value={category.id} className="mt-4">
                                <Card className="shadow-sm border">
                                  <CardContent className="p-6">
                                    <div className="space-y-3">
                                      {category.services.map((service, serviceIndex) => (
                                        <div
                                          key={serviceIndex}
                                          className="flex justify-between items-center py-3 border-b last:border-0 hover:bg-muted/50 transition-colors px-4 rounded"
                                        >
                                          <span
                                            className="text-foreground font-medium flex-1"
                                            dangerouslySetInnerHTML={{ __html: service.name }}
                                          />
                                          <div
                                            className="flex items-center gap-3 font-bold text-primary text-lg whitespace-nowrap ml-4"
                                            dangerouslySetInnerHTML={{
                                              __html: service.price || ""
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            ))}
                          </Tabs>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">
                              {language === 'ru' ? 'Цены загружаются...' : 'Ціни завантажуються...'}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                }

                // Блок: Врачи для услуги
                else if (block.acf_fc_layout === 'service_doctors' && block.service_doctors_add) {
                  // Получаем всех врачей для отображения
                  const doctorItems: any[] = [];
                  if (typeof block.service_doctors_add === 'number') {
                    const doctorItem = doctorData[block.service_doctors_add];
                    if (doctorItem) doctorItems.push(doctorItem);
                  } else if (Array.isArray(block.service_doctors_add)) {
                    block.service_doctors_add.forEach((doctorId: number) => {
                      const doctorItem = doctorData[doctorId];
                      if (doctorItem) doctorItems.push(doctorItem);
                    });
                  }

                  // Если есть данные о врачах, показываем их карточки
                  if (doctorItems.length > 0) {
                    const renderDoctors = () => {
                      if (doctorItems.length > 3) {
                        // Слайдер для большого количества врачей
                        return (
                          <div className="relative">
                            <Swiper
                              modules={[Navigation, Pagination, Autoplay]}
                              spaceBetween={20}
                              slidesPerView={1}
                              breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                              }}
                              navigation={{
                                nextEl: '.doctors-swiper-next',
                                prevEl: '.doctors-swiper-prev',
                              }}
                              pagination={{
                                clickable: true,
                                el: '.doctors-pagination',
                              }}
                              autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                              }}
                              loop={doctorItems.length > 3}
                              className="doctors-swiper"
                            >
                              {doctorItems.map((doctor) => (
                                <SwiperSlide key={doctor.id}>
                                  <DoctorCard
                                    doctor={doctor}
                                    language={language}
                                  />
                                </SwiperSlide>
                              ))}
                            </Swiper>

                            {/* Навигационные кнопки */}
                            <button className="doctors-swiper-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200">
                              <ChevronLeft className="h-5 w-5 text-primary" />
                            </button>
                            <button className="doctors-swiper-next absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200">
                              <ChevronRight className="h-5 w-5 text-primary" />
                            </button>

                            {/* Пагинация */}
                            <div className="doctors-pagination flex justify-center mt-6 space-x-2"></div>
                          </div>
                        );
                      } else {
                        // Сетка для небольшого количества врачей
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {doctorItems.map((doctor) => (
                              <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                language={language}
                              />
                            ))}
                          </div>
                        );
                      }
                    };

                    return (
                      <Card key={index} className="mt-24">
                        <CardHeader>
                          <CardTitle className="text-3xl text-primary text-center">
                            {language === 'ru' ? 'Наши специалисты' : 'Наші фахівці'}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                          {renderDoctors()}
                        </CardContent>
                      </Card>
                    );
                  }

                  // Если данных о врачах нет, показываем сообщение о загрузке
                  return (
                    <Card key={index} className="mb-8">
                      <CardHeader>
                        <CardTitle className="text-2xl text-primary">
                          {language === 'ru' ? 'Наши специалисты' : 'Наші фахівці'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="text-center py-8">
                          <div className="animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-gray-200 rounded"></div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }

                // Блок: Баннер услуги
                else if (block.acf_fc_layout === 'service_banner' && block.service_banner_image) {
                  return (
                    <Card key={index} className="mb-8">
                      <CardContent className="p-0">
                        {block.service_banner_image && (
                          <img
                            src={typeof block.service_banner_image === 'string' && block.service_banner_image.startsWith('http')
                              ? block.service_banner_image  // Прямой URL
                              : imageUrls[block.service_banner_image] || '/placeholder-image.svg'  // URL из API
                            }
                            alt={title}
                            className="w-full h-96 object-cover rounded-lg"
                            onError={(e) => {
                              console.log('Banner image failed to load:', block.service_banner_image);
                              e.currentTarget.src = '/placeholder-image.svg';
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </section>

        {/* CTA секция */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                {language === "ru" ? "Готовы записаться на прием?" : "Готові записатися на прийом?"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {language === "ru"
                  ? "Наша команда специалистов готова предоставить вам квалифицированную помощь"
                  : "Наша команда фахівців готова надати вам кваліфіковану допомогу"}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <BookingDialog
                  triggerText={language === "ru" ? "Записаться на консультацию" : "Записатися на консультацію"}
                />
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+380954220032">
                    <Phone className="mr-2 h-5 w-5" />
                    {language === "ru" ? "Позвонить" : "Зателефонувати"}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Стили для слайдера врачей
const styles = `
  .doctors-swiper .swiper-slide {
    height: auto;
  }

  .doctors-swiper-prev,
  .doctors-swiper-next {
    display: none;
  }

  @media (min-width: 768px) {
    .doctors-swiper-prev,
    .doctors-swiper-next {
      display: flex;
    }
  }

  .doctors-pagination .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    background: #e5e7eb;
    opacity: 0.5;
  }

  .doctors-pagination .swiper-pagination-bullet-active {
    background: hsl(var(--primary));
    opacity: 1;
  }
`;

export default ServicesDetail;
