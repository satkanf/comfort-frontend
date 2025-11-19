import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

const priceCategories = [
  {
    id: "consultations",
    category: "Консультації",
    categoryRu: "Консультации",
    services: [
      { name: "Прийом терапевта", nameRu: "Прием терапевта", price: "500 грн" },
      { name: "Прийом кардіолога", nameRu: "Прием кардиолога", price: "700 грн" },
      { name: "Прийом дерматолога", nameRu: "Прием дерматолога", price: "600 грн" },
      { name: "Прийом хірурга", nameRu: "Прием хирурга", price: "650 грн" },
      { name: "Прийом гінеколога", nameRu: "Прием гинеколога", price: "600 грн" },
      { name: "Прийом педіатра", nameRu: "Прием педиатра", price: "550 грн" },
      { name: "Прийом офтальмолога", nameRu: "Прием офтальмолога", price: "600 грн" },
    ],
  },
  {
    id: "diagnostics",
    category: "Діагностика",
    categoryRu: "Диагностика",
    services: [
      { name: "ЕКГ", nameRu: "ЭКГ", price: "300 грн" },
      { name: "УЗД органів черевної порожнини", nameRu: "УЗИ органов брюшной полости", price: "550 грн" },
      { name: "УЗД серця", nameRu: "УЗИ сердца", price: "650 грн" },
      { name: "УЗД малого тазу", nameRu: "УЗИ малого таза", price: "500 грн" },
      { name: "УЗД щитоподібної залози", nameRu: "УЗИ щитовидной железы", price: "450 грн" },
      { name: "УЗД молочних залоз", nameRu: "УЗИ молочных желез", price: "500 грн" },
      { name: "Холтер ЕКГ (добовий)", nameRu: "Холтер ЭКГ (суточный)", price: "900 грн" },
      { name: "ЕхоКГ", nameRu: "ЭхоКГ", price: "800 грн" },
      { name: "Дерматоскопія", nameRu: "Дерматоскопия", price: "350 грн" },
    ],
  },
  {
    id: "laboratory",
    category: "Лабораторія",
    categoryRu: "Лаборатория",
    services: [
      { name: "Загальний аналіз крові", nameRu: "Общий анализ крови", price: "250 грн" },
      { name: "Біохімічний аналіз крові", nameRu: "Биохимический анализ крови", price: "400 грн" },
      { name: "Аналіз сечі", nameRu: "Анализ мочи", price: "150 грн" },
      { name: "Аналіз крові на цукор", nameRu: "Анализ крови на сахар", price: "120 грн" },
      { name: "Гормональні дослідження", nameRu: "Гормональные исследования", price: "від 300 грн" },
      { name: "Взяття мазка на флору", nameRu: "Взятие мазка на флору", price: "150 грн" },
    ],
  },
  {
    id: "cosmetology",
    category: "Косметологія",
    categoryRu: "Косметология",
    services: [
      { name: "Чистка обличчя", nameRu: "Чистка лица", price: "800 грн" },
      { name: "Мезотерапія", nameRu: "Мезотерапия", price: "1500 грн" },
      { name: "Ботокс (1 зона)", nameRu: "Ботокс (1 зона)", price: "2000 грн" },
      { name: "Філлери", nameRu: "Филлеры", price: "від 3000 грн" },
      { name: "Пілінг", nameRu: "Пилинг", price: "1200 грн" },
      { name: "Біоревіталізація", nameRu: "Биоревитализация", price: "2500 грн" },
      { name: "Контурна пластика", nameRu: "Контурная пластика", price: "від 3500 грн" },
    ],
  },
  {
    id: "procedures",
    category: "Процедури",
    categoryRu: "Процедуры",
    services: [
      { name: "Масаж спини", nameRu: "Массаж спины", price: "600 грн" },
      { name: "Фізіотерапія (1 сеанс)", nameRu: "Физиотерапия (1 сеанс)", price: "400 грн" },
      { name: "Інфузійна терапія", nameRu: "Инфузионная терапия", price: "1000 грн" },
      { name: "Перев'язка", nameRu: "Перевязка", price: "200 грн" },
      { name: "Ін'єкції", nameRu: "Инъекции", price: "100 грн" },
      { name: "Крапельниці", nameRu: "Капельницы", price: "від 500 грн" },
    ],
  },
  {
    id: "gynecology",
    category: "Гінекологія",
    categoryRu: "Гинекология",
    services: [
      { name: "Первинна консультація", nameRu: "Первичная консультация", price: "600 грн" },
      { name: "Повторна консультація", nameRu: "Повторная консультация", price: "500 грн" },
      { name: "Кольпоскопія", nameRu: "Кольпоскопия", price: "400 грн" },
      { name: "УЗД вагітності", nameRu: "УЗИ беременности", price: "500 грн" },
    ],
  },
  {
    id: "pediatrics",
    category: "Педіатрія",
    categoryRu: "Педиатрия",
    services: [
      { name: "Консультація педіатра", nameRu: "Консультация педиатра", price: "550 грн" },
      { name: "Профілактичний огляд", nameRu: "Профилактический осмотр", price: "500 грн" },
      { name: "Вакцинація", nameRu: "Вакцинация", price: "від 400 грн" },
      { name: "Виклик педіатра додому", nameRu: "Вызов педиатра на дом", price: "800 грн" },
    ],
  },
  {
    id: "dermatology",
    category: "Дерматологія",
    categoryRu: "Дерматология",
    services: [
      { name: "Консультація дерматолога", nameRu: "Консультация дерматолога", price: "600 грн" },
      { name: "Видалення новоутворень", nameRu: "Удаление новообразований", price: "від 800 грн" },
      { name: "Лікування акне", nameRu: "Лечение акне", price: "1200 грн" },
      { name: "Лікування псоріазу", nameRu: "Лечение псориаза", price: "від 1500 грн" },
    ],
  },
];

const Prices = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4">
                {language === "uk" ? "Ціни на послуги" : "Цены на услуги"}
              </h1>
              <p className="text-muted-foreground text-lg">
                {language === "uk" 
                  ? "Прозорі ціни без прихованих платежів" 
                  : "Прозрачные цены без скрытых платежей"}
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <Tabs defaultValue={priceCategories[0].id} className="max-w-6xl mx-auto">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 h-auto bg-transparent">
                {priceCategories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {language === "uk" ? category.category : category.categoryRu}
                  </TabsTrigger>
                ))}
              </TabsList>

              {priceCategories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-8">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-3xl">
                        {language === "uk" ? category.category : category.categoryRu}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {category.services.map((service, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center py-4 border-b last:border-0 hover:bg-muted/50 transition-colors px-4 rounded"
                          >
                            <span className="text-foreground font-medium">
                              {language === "uk" ? service.name : service.nameRu}
                            </span>
                            <span className="font-bold text-primary text-lg">
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

            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-6">
                {language === "uk" 
                  ? "* Ціни можуть змінюватися. Точну вартість уточнюйте при записі" 
                  : "* Цены могут меняться. Точную стоимость уточняйте при записи"}
              </p>
              <Button size="lg">
                {language === "uk" ? "Записатися на прийом" : "Записаться на прием"}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Prices;