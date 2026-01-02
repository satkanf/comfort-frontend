import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import BookingDialog from "@/components/BookingDialog";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

interface Price {
  name: string;
  nameRu: string;
  price: string;
}

interface Doctor {
  id: number;
  name: string;
  nameRu: string;
  specialty: string;
  specialtyRu: string;
  image: string;
}

interface ServiceData {
  id: string;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  fullDescription: string;
  fullDescriptionRu: string;
  icon: string;
  image: string;
  layout: 'imageLeft' | 'imageRight' | 'imageTop' | 'standard';
  prices: Price[];
  doctors: Doctor[];
}



const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { language, t } = useTranslations();
  
  const service = serviceId ? servicesData[serviceId] : null;

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {t(
                "service.notFound",
                language === "uk" ? "Послугу не знайдено" : "Услуга не найдена"
              )}
            </h1>
            <Button onClick={() => navigate("/services")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t(
                "service.backToServices",
                language === "uk" ? "Повернутися до послуг" : "Вернуться к услугам"
              )}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = language === 'uk' ? service.title : service.titleRu;
  const description = language === 'uk' ? service.description : service.descriptionRu;
  const fullDescription = language === 'uk' ? service.fullDescription : service.fullDescriptionRu;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={title}
        description={description}
        canonical={`/services/${serviceId}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          "name": title,
          "description": fullDescription,
          "provider": {
            "@type": "MedicalClinic",
            "name": "Comfort Clinic",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "вул. Західна 6",
              "addressLocality": "Ірпінь",
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
              {t(
                "service.toAllServices",
                language === "uk" ? "До всіх послуг" : "Ко всем услугам"
              )}
            </Button>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-4">{service.icon}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              {/*<p className="text-xl text-muted-foreground mb-6">{description}</p>*/}
              {/*<BookingDialog preselectedService={serviceId} />*/}
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {service.layout === 'imageLeft' && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <img src={service.image} alt={title} className="w-full h-[400px] object-cover rounded-lg shadow-lg" />
                  <div>
                    <h2 className="text-3xl font-bold mb-4">
                      {t(
                        "service.about",
                        language === "uk" ? "Про послугу" : "Об услуге"
                      )}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {fullDescription}
                    </p>
                  </div>
                </div>
              )}
              
              {service.layout === 'imageRight' && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">
                      {language === 'uk' ? 'Про послугу' : 'Об услуге'}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {fullDescription}
                    </p>
                  </div>
                  <img src={service.image} alt={title} className="w-full h-[400px] object-cover rounded-lg shadow-lg" />
                </div>
              )}
              
              {service.layout === 'imageTop' && (
                <div className="space-y-8">
                  <img src={service.image} alt={title} className="w-full h-[500px] object-cover rounded-lg shadow-lg" />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-3xl">
                        {t(
                          "service.about",
                          language === "uk" ? "Про послугу" : "Об услуге"
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {fullDescription}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {service.layout === 'standard' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-3xl">
                      {t(
                        "service.about",
                        language === "uk" ? "Про послугу" : "Об услуге"
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {fullDescription}
                    </p>
                    <img src={service.image} alt={title} className="w-full h-[400px] object-cover rounded-lg shadow-lg" />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 bg-secondary/20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                {t(
                  "service.pricesTitle",
                  language === "uk" ? "Ціни на послуги" : "Цены на услуги"
                )}
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {service.prices.map((price, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b last:border-0"
                      >
                        <span className="text-base">
                          {language === 'uk' ? price.name : price.nameRu}
                        </span>
                        <Badge variant="secondary" className="text-base px-4 py-1">
                          {price.price}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                {t(
                  "service.ourDoctors",
                  language === "uk" ? "Наші лікарі" : "Наши врачи"
                )}
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {service.doctors.map((doctor) => (
                  <Card
                    key={doctor.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/doctors/${doctor.id}`)}
                  >
                    <div className="flex gap-4 p-6">
                      <img
                        src={doctor.image}
                        alt={language === 'uk' ? doctor.name : doctor.nameRu}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">
                          {language === 'uk' ? doctor.name : doctor.nameRu}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {language === 'uk' ? doctor.specialty : doctor.specialtyRu}
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/doctors/${doctor.id}`}>
                            {t(
                              "link.profile",
                              language === "uk" ? "Переглянути профіль" : "Посмотреть профиль"
                            )}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                {t(
                  "cta.readyToBook",
                  language === "uk" ? "Готові записатися на прийом?" : "Готовы записаться на прием?"
                )}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t(
                  "cta.supportText",
                  language === "uk"
                    ? "Наша команда фахівців готова надати вам кваліфіковану допомогу"
                    : "Наша команда специалистов готова предоставить вам квалифицированную помощь"
                )}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <BookingDialog 
                  preselectedService={serviceId}
                  triggerText={t(
                    "cta.bookConsultation",
                    language === "uk" ? "Записатися на консультацію" : "Записаться на консультацию"
                  )}
                />
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+380954220032">
                    <Clock className="mr-2 h-5 w-5" />
                    {t(
                      "call",
                      language === "uk" ? "Зателефонувати" : "Позвонить"
                    )}
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

export default ServiceDetail;
