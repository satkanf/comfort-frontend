// components/ServicesSection.tsx
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMultilangServices } from "@/hooks/useMultilangServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hexagon } from "lucide-react";

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
  _embedded?: {
    'wp:term'?: Array<Array<TaxonomyTerm>>;
  };
}

interface ServiceSectionProps {
  acfFieldName?: string;
}

// Компонент для отображения одной карточки услуги
const ServiceCard = ({ service, language }: { service: Service; language: string }) => {
  const navigate = useNavigate();

  const title = service.title.rendered ||
      (language === 'uk' ? 'Без назви' :
          language === 'ru' ? 'Без названия' : 'No title');

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

  // Получаем иконку из ACF первой категории
  const getCategoryIcon = () => {
    if (categories.length > 0 && categories[0].acf?.category_icon) {
      return categories[0].acf.category_icon;
    }
    return null;
  };

  const categoryIcon = getCategoryIcon();

  return (
      <Card
          className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 cursor-pointer"
          onClick={() => navigate(`/services/${service.id}`)}
      >
        <CardHeader className="items-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            {categoryIcon ? (
                <img
                    src={categoryIcon}
                    alt={categories[0]?.name || "Icon"}
                    className="h-6 w-6"
                />
            ) : (
                <Hexagon className="h-6 w-6" />
            )}
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

const ServicesSection = ({ acfFieldName = "about_services_add" }: ServiceSectionProps) => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  // Используем хук для мультиязычных услуг
  const {
    services,
    loading,
    error,
    blockData,
    serviceIds
  } = useMultilangServices(acfFieldName);

  // Переводы для UI (используем данные из блока или дефолтные)
  const getTranslations = () => {
    const defaultTranslations = {
      title: {
        uk: 'Наші послуги',
        ru: 'Наши услуги',
        en: 'Our Services'
      },
      subtitle: {
        uk: 'Широкий спектр медичних послуг для турботи про ваше здоров\'я та красу',
        ru: 'Широкий спектр медицинских услуг для заботы о вашем здоровье и красоте',
        en: 'A wide range of medical services to care for your health and beauty'
      },
      allServices: {
        uk: 'Всі послуги',
        ru: 'Все услуги',
        en: 'All Services'
      },
      loading: {
        uk: 'Завантаження послуг...',
        ru: 'Загрузка услуг...',
        en: 'Loading services...'
      },
      error: {
        uk: 'Помилка завантаження',
        ru: 'Ошибка загрузки',
        en: 'Loading error'
      },
      noServices: {
        uk: 'Послуги відсутні',
        ru: 'Услуги отсутствуют',
        en: 'No services available'
      }
    };

    return {
      title: blockData?.title || defaultTranslations.title[language],
      subtitle: blockData?.description || defaultTranslations.subtitle[language],
      allServices: defaultTranslations.allServices[language],
      loading: defaultTranslations.loading[language],
      error: defaultTranslations.error[language],
      noServices: defaultTranslations.noServices[language]
    };
  };

  const translations = getTranslations();

  if (loading) {
    return (
        <div className="py-16 md:py-24 bg-background">
          <div className="container text-center">
            <p>{translations.loading}</p>
            <div className="mt-4 text-sm text-gray-500">
              Найдено ID услуг: {serviceIds.length}
            </div>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="py-16 md:py-24 bg-background">
          <div className="container text-center">
            <div className="max-w-md mx-auto p-6 border border-red-200 rounded-lg bg-red-50">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                {translations.error}
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
    );
  }

  if (!services.length) {
    console.log('No services found:', {
      serviceIds,
      servicesCount: services.length,
      language
    });

    return (
        <div className="py-16 md:py-24 bg-background">
          <div className="container text-center">
            <p className="text-gray-500">{translations.noServices}</p>
            <div className="mt-4 text-sm text-gray-400">
              Язык: {language}, Найдено ID: {serviceIds.length}
            </div>
          </div>
        </div>
    );
  }

  return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {translations.title}
            </h2>
            {translations.subtitle && (
                <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
                  {translations.subtitle}
                </p>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    language={language}
                />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/services")}
            >
              {translations.allServices}
            </Button>
          </div>
        </div>
      </section>
  );
};

export default ServicesSection;