import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Stethoscope, Syringe, Microscope, Baby, Eye, Pill, ActivitySquare } from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "Гінекологія",
    description: "Комплексна діагностика та лікування жіночого здоров'я",
  },
  {
    icon: Microscope,
    title: "Дерматологія",
    description: "Сучасні методи лікування шкіри та косметологічні процедури",
  },
  {
    icon: Heart,
    title: "Кардіологія",
    description: "Профілактика та лікування серцево-судинних захворювань",
  },
  {
    icon: ActivitySquare,
    title: "УЗД діагностика",
    description: "Точна діагностика на новітньому обладнанні",
  },
  {
    icon: Baby,
    title: "Педіатрія",
    description: "Медичний догляд за здоров'ям дітей усіх вікових груп",
  },
  {
    icon: Pill,
    title: "Терапія",
    description: "Загальна діагностика та лікування внутрішніх захворювань",
  },
  {
    icon: Syringe,
    title: "Косметологія",
    description: "Ін'єкційна косметологія та естетична медицина",
  },
  {
    icon: Eye,
    title: "Офтальмологія",
    description: "Діагностика та лікування захворювань очей",
  },
];

const Services = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Наші послуги</h2>
          <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
            Широкий спектр медичних послуг для турботи про ваше здоров'я та красу
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline">
            Всі послуги
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
