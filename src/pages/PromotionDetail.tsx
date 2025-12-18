import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Percent, ArrowLeft, CheckCircle } from "lucide-react";
import BookingDialog from "@/components/BookingDialog";



const PromotionDetail = () => {
  const navigate = useNavigate();
  
 

  if () {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Акцію не знайдено</h1>
            <Button onClick={() => navigate("/promotions")}>
              Повернутися до акцій
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[400px] overflow-hidden">
          <img
            src={promotion.image}
            alt={promotion.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container mx-auto px-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/promotions")}
                className="mb-4 text-white hover:text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад до акцій
              </Button>
              <div className="flex items-start gap-4">
                <Badge className="bg-primary text-white text-xl px-6 py-3 shadow-lg">
                  <Percent className="w-5 h-5 inline mr-2" />
                  -{promotion.discount}
                </Badge>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {promotion.title}
                  </h1>
                  <p className="text-xl text-white/90">{promotion.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">Про акцію</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {promotion.fullDescription}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Що входить</h2>
                    <ul className="space-y-3">
                      {promotion.includes.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Умови акції</h2>
                    <ul className="space-y-3">
                      {promotion.conditions.map((condition, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                          <span className="text-muted-foreground">{condition}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="sticky top-4">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Стара ціна</p>
                      <p className="text-2xl line-through text-muted-foreground">
                        {promotion.oldPrice}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Ціна за акцією</p>
                      <p className="text-4xl font-bold text-primary">
                        {promotion.newPrice}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground py-4 border-y">
                      <Clock className="w-5 h-5" />
                      <div>
                        <p className="text-sm">Діє до</p>
                        <p className="font-semibold">{promotion.validUntil}</p>
                      </div>
                    </div>

                    <BookingDialog triggerText="Записатися на прийом" />

                    <p className="text-xs text-muted-foreground text-center">
                      * Акція не сумується з іншими знижками
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PromotionDetail;