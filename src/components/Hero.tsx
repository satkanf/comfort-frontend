import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-medical.jpg";
import { ArrowRight } from "lucide-react";
import BookingDialog from "@/components/BookingDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const Hero = () => {
  const { language } = useLanguage();
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-medical-gray-light via-background to-secondary/30">
      <div className="container py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                {language === 'uk' ? 'Новий рівень медицини' : 'Новый уровень медицины'}
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                {language === 'uk' ? 'Клініка краси та здоров\'я' : 'Клиника красоты и здоровья'}{" "}
                <span className="text-primary">Comfort Clinic</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-[600px]">
                {language === 'uk' 
                  ? 'Сучасний медичний центр з командою висококваліфікованих фахівців в області медицини і косметології. Професійна допомога, новітні технології та індивідуальний підхід.'
                  : 'Современный медицинский центр с командой высококвалифицированных специалистов в области медицины и косметологии. Профессиональная помощь, новейшие технологии и индивидуальный подход.'
                }
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <BookingDialog 
                triggerText={language === 'uk' ? 'Записатися на прийом' : 'Записаться на прием'}
              />
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link to="/services">
                  {language === 'uk' ? 'Наші послуги' : 'Наши услуги'}
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <div className="text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'uk' ? 'Років досвіду' : 'Лет опыта'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'uk' ? 'Фахівців' : 'Специалистов'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'uk' ? 'Пацієнтів' : 'Пациентов'}
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
