import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingDialog from '@/components/BookingDialog';

interface PriceService {
  name: string;
  nameRu: string;
  price: string;
}

interface PriceCategory {
  id: string;
  category: string;
  categoryRu: string;
  services: PriceService[];
}

interface ACFPriceItem {
  id: number;
  title: {
    rendered: string;
  };
  acf?: {
    price_list?: Array<{
      price_label: string;
      price_label_ru?: string;
      price_value: string;
    }>;
    category?: string;
    category_ru?: string;
  };
}

const PricesPage = ({ language = "uk" }) => {
  const [priceCategories, setPriceCategories] = useState<PriceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для получения данных из API с ACF полями
  const fetchPricesFromAPI = async () => {
    try {
      setLoading(true);
      
      // Получаем данные из API
      const response = await fetch('https://comfort.satkan.site/wp-json/wp/v2/price?per_page=100');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Основные данные:', data);
      
      // Для каждого элемента получаем ACF поля
      const itemsWithACF = await Promise.all(
        data.map(async (item: any) => {
          try {
            // Пробуем получить ACF поля
            const acfResponse = await fetch(
              `https://comfort.satkan.site/wp-json/wp/v2/price/${item.id}?acf_format=standard`
            );
            
            if (acfResponse.ok) {
              const acfData = await acfResponse.json();
              console.log(`ACF данные для ${item.id}:`, acfData.acf);
              return {
                ...item,
                acf: acfData.acf || {}
              };
            }
            
            return {
              ...item,
              acf: {}
            };
          } catch (err) {
            console.error(`Ошибка загрузки ACF для ${item.id}:`, err);
            return {
              ...item,
              acf: {}
            };
          }
        })
      );
      
      // Преобразуем данные из API в структуру для компонента
      const transformedData = transformAPIDataToCategories(itemsWithACF);
      setPriceCategories(transformedData);
      
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      
    } finally {
      setLoading(false);
    }
  };

  // Функция для преобразования данных API в структуру категорий
  const transformAPIDataToCategories = (apiData: ACFPriceItem[]): PriceCategory[] => {
    const categories: PriceCategory[] = [];
    
    apiData.forEach(item => {
      // Проверяем есть ли поле price_list
      if (item.acf?.price_list && Array.isArray(item.acf.price_list)) {
        
        // Используем заголовок как название категории
        const categoryName = item.title.rendered;
        const categoryNameRu = item.title.rendered; // Можно добавить отдельное поле для русского
        
        // Преобразуем price_list в массив услуг
        const services: PriceService[] = item.acf.price_list
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

  useEffect(() => {
    fetchPricesFromAPI();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
                </div>
              </div>
            </div>
          </section>
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto text-center">
                <div className="h-6 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
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
              <h1 className="text-5xl font-bold text-foreground mb-4">
                {language === "uk" ? "Ціни на послуги" : "Цены на услуги"}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === "uk" 
                  ? "Прозорі ціни без прихованих платежів" 
                  : "Прозрачные цены без скрытых платежей"}
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            {priceCategories.length > 0 ? (
              <Tabs defaultValue={priceCategories[0]?.id} className="max-w-6xl mx-auto">
                <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 h-auto bg-transparent overflow-x-auto">
                  {priceCategories.map((category) => (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                    >
                      {language === "uk" ? category.category : category.categoryRu}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {priceCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-8">
                    <Card className="shadow-md">
                      {/* <CardHeader>
                        <CardTitle className="text-3xl">
                          {language === "uk" ? category.category : category.categoryRu}
                        </CardTitle>
                      </CardHeader> */}
                      <CardContent>
                        <div className="space-y-3">
                          {category.services.map((service, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-4 border-b last:border-0 hover:bg-muted/50 transition-colors px-4 rounded"
                            >
                              <span className="text-foreground font-medium flex-1">
                                {language === "uk" ? service.name : service.nameRu}
                              </span>
                              <span className="font-bold text-primary text-lg whitespace-nowrap ml-4">
                                {service.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="max-w-6xl mx-auto text-center">
                <Card className="shadow-md">
                  <CardContent className="py-12">
                    <p className="text-muted-foreground text-lg">
                      {language === "uk" 
                        ? "Наразі немає доступних цін" 
                        : "На данный момент нет доступных цен"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-6">
                {language === "uk" 
                  ? "* Ціни можуть змінюватися. Точну вартість уточнюйте при записі" 
                  : "* Цены могут меняться. Точную стоимость уточняйте при записи"}
              </p>
              <BookingDialog />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricesPage;