import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical.jpg";
import BookingDialog from "@/components/BookingDialog";
import { Link } from "react-router-dom";
import { useMultilangPage } from "@/hooks/useMultilangPage";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { language, t } = useLanguage();
  const { pageData, loading, error } = useMultilangPage('golovna');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  if (error || !pageData) {
    return null;
  }

  const heroData = pageData.acf?.hero 
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-medical-gray-light via-background to-secondary/30">
      <div className="container py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6">
            
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                 {heroData.hero_subtitle}
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                  {heroData.hero_title}
                </h1>
                <p className="text-lg text-muted-foreground max-w-[600px]">
                 {heroData.hero_desc}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <BookingDialog
                    triggerText={t(
                      "hero.bookAppointment",
                      language === "uk" ? "Записатися на прийом" : "Записаться на прием"
                    )}
                />
                <Button size="lg" variant="outline" className="text-base" asChild>
                  <Link to="/services">
                    {t(
                      "hero.ourServices",
                      language === "uk" ? "Наші послуги" : "Наши услуги"
                    )}
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'uk' ? 'Задоволених клієнтів' : 'Довольных клиентов'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'uk' ? 'Років досвіду' : 'Лет опыта'}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">
                    {language === 'uk' ? 'Видів послуг' : 'Видов услуг'}
                  </div>
                </div>
              </div>
              
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={heroImage}
                alt="Comfort Clinic - сучасна клініка краси та здоров'я"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-72 h-72 bg-accent/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
