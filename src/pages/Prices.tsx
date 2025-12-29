import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import BookingDialog from '@/components/BookingDialog';
import { useMultilangPrices } from '@/hooks/useMultilangPrices';
import { useTranslations } from '@/hooks/useTranslations';
import { translations } from '@/translations';

const PricesPage = () => {
  const { priceCategories, loading, error } = useMultilangPrices();
  const { language } = useTranslations();

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
                {translations.pages.prices.title[language as "uk" | "ru"]}
              </h1>
              <p className="text-muted-foreground text-lg">
                {translations.pages.prices.subtitle[language as "uk" | "ru"]}
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
                      {category.category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {priceCategories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-8">
                    <Card className="shadow-md">
                      <CardContent>
                        <div className="space-y-3">
                          {category.services.map((service, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-4 border-b last:border-0 hover:bg-muted/50 transition-colors px-4 rounded"
                            >
                              <span className="text-foreground font-medium flex-1">
                                {service.name}
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
                      {translations.pages.prices.noPrices[language as "uk" | "ru"]}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-6">
                {translations.pages.prices.disclaimer[language as "uk" | "ru"]}
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