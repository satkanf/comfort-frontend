import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hexagon } from "lucide-react";
import BookingDialog from "@/components/BookingDialog";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { getBaseUrl } from "@/utils/baseUrl";

interface TaxonomyTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  acf?: {
    category_icon?: string;
  };
}

interface Service {
  id: number;
  title: { rendered: string };
  slug: string;
  services_caservices_catt?: number[];
  _embedded?: {
    'wp:term'?: Array<Array<TaxonomyTerm>>;
  };
}

interface ServiceSectionProps {
  acfFieldName?: string;
}

// Компонент для отображения одной карточки услуги
const ServiceCard = ({ service }: { service: Service }) => {
  const navigate = useNavigate();

  const title = service.title.rendered || "Без назви";

  const getServiceCategories = (): TaxonomyTerm[] => {
    if (!service._embedded?.["wp:term"]) return [];

    const allTerms = service._embedded["wp:term"] || [];

    for (const termArray of allTerms) {
      if (!termArray?.length) continue;

      const filtered = termArray.filter(
        (term) => term.taxonomy === "services-caservices-catt"
      );

      if (filtered.length > 0) return filtered;
    }

    return [];
  };

  const categories = getServiceCategories();

  return (
    <Card
      className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 cursor-pointer"
      onClick={() => navigate(`/services/${service.slug}`)}
    >
      <CardHeader className="items-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Hexagon className="h-6 w-6" />
        </div>

        <CardTitle
            className="text-xl text-center"
            dangerouslySetInnerHTML={{ __html: title }}
        />
      </CardHeader>

      <CardContent>
        <CardDescription className="text-base text-center">
          {categories.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {categories[0].name}
              </span>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const { language } = useTranslations();
  const { language: currentLanguage } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTranslations = () => {
    const lang = language || currentLanguage || 'uk';

    return {
      title: translations.pages.services.title[lang as "uk" | "ru"],
      subtitle: translations.pages.services.subtitle[lang as "uk" | "ru"],
      loading: translations.common.loading[lang as "uk" | "ru"],
      readyToBook: translations.pages.services.readyToBook[lang as "uk" | "ru"],
      supportText: translations.pages.services.supportText[lang as "uk" | "ru"]
    };
  };

  // Загружаем все услуги из API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = getBaseUrl();
        const servicesUrl = `${baseUrl}/wp-json/wp/v2/services?per_page=100&_embed=1&acf_format=standard&lang=${currentLanguage}`;
        const response = await fetch(servicesUrl, {
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

        // Обрабатываем данные - сохраняем featured_media для использования в компоненте
        const processedServices = data.map((service: any) => {
          const embeddedMedia = service._embedded?.["wp:featuredmedia"]?.[0];
          const categoryNames = service._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.name) || [];

          return {
            ...service,
            _embedded: {
              featured: embeddedMedia || null,
              featuredMediaId: service.featured_media || null,
              'wp:term': service._embedded?.['wp:term'] || []
            },
            category_names: categoryNames,
          };
        });

        setServices(processedServices);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [currentLanguage]);

  const pageTranslations = getTranslations();

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
              <div className="max-w-6xl mx-auto">
                <div className="h-6 bg-gray-300 rounded w-1/4 mx-auto mb-8"></div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="h-64 bg-gray-200 rounded"></div>
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="max-w-md mx-auto p-6 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Помилка завантаження
                  </h3>
                  <p className="text-red-600 text-sm mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    size="sm"
                  >
                    Спробувати знову
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="pt-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl font-bold text-foreground mb-4">
                  {pageTranslations.title}
                </h1>
                <p className="text-muted-foreground text-lg">
                  Послуги тимчасово недоступні
                </p>
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
      <Header postId="" />
      <main className="flex-1">
        <section className="pt-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4">
                {pageTranslations.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {pageTranslations.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              {pageTranslations.readyToBook}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {pageTranslations.supportText}
            </p>
            <BookingDialog />
          </div>
        </section>
      </main>
      <Footer />
    </div>
    
  );
};

export default ServicesPage;
 