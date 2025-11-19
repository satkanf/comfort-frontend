import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Percent } from "lucide-react";

const promotions = [
  {
    id: 1,
    title: "Комплексне обстеження",
    description: "Пройдіть повне медичне обстеження зі знижкою 30%",
    discount: "30%",
    oldPrice: "5000 грн",
    newPrice: "3500 грн",
    validUntil: "31 березня 2024",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Косметологія навесні",
    description: "Знижка 20% на всі косметологічні процедури",
    discount: "20%",
    oldPrice: "2000 грн",
    newPrice: "1600 грн",
    validUntil: "15 квітня 2024",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Діагностика серця",
    description: "ЕКГ + консультація кардіолога за спеціальною ціною",
    discount: "25%",
    oldPrice: "1000 грн",
    newPrice: "750 грн",
    validUntil: "30 березня 2024",
    image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Сімейний пакет",
    description: "Консультації для всієї родини зі знижкою 40%",
    discount: "40%",
    oldPrice: "3000 грн",
    newPrice: "1800 грн",
    validUntil: "10 квітня 2024",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=400&fit=crop",
  },
];

const Promotions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4">Акції та спеціальні пропозиції</h1>
              <p className="text-muted-foreground text-lg">
                Скористайтеся вигідними пропозиціями для турботи про своє здоров'я
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {promotions.map((promo) => (
                <Card
                  key={promo.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-white text-lg px-4 py-2">
                        <Percent className="w-4 h-4 inline mr-1" />
                        -{promo.discount}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{promo.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{promo.description}</p>
                    
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-muted-foreground line-through text-sm">
                          {promo.oldPrice}
                        </span>
                        <span className="text-2xl font-bold text-primary ml-3">
                          {promo.newPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Діє до {promo.validUntil}</span>
                    </div>

                    <Button className="w-full mt-4">
                      Записатися
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center max-w-2xl mx-auto">
              <p className="text-muted-foreground">
                * Акції не сумуються з іншими знижками. Детальні умови уточнюйте при записі.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Promotions;
