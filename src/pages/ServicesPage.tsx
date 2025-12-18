import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Stethoscope, Syringe, Microscope, Baby, Eye, Pill, ActivitySquare, Hexagon } from "lucide-react";
import BookingDialog from "@/components/BookingDialog";

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
      onClick={() => navigate(`/services/${service.id}`)}
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
        <CardDescription className="text-base"></CardDescription>
      </CardContent>
    </Card>
  );
};

const ServicesPage = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await fetch("https://comfort.satkan.site/wp-json/wp/v2/services");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHomeData(data);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке");
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);
    if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!homeData) {
    return null;
  }


  return (
   
       <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4">Наші послуги</h1>
              <p className="text-muted-foreground text-lg">
                Широкий спектр медичних послуг для вашого здоров'я та краси
              </p>
            </div>
          </div>
        </section>

        <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {homeData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Готові записатися на прийом?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Наша команда фахівців готова надати вам кваліфіковану допомогу
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
 