import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingDialog from "@/components/BookingDialog";
import SEO from "@/components/SEO";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";
import serviceGynecology from "@/assets/service-gynecology.jpg";
import serviceDermatology from "@/assets/service-dermatology.jpg";
import serviceCardiology from "@/assets/service-cardiology.jpg";
import serviceUltrasound from "@/assets/service-ultrasound.jpg";
import servicePediatrics from "@/assets/service-pediatrics.jpg";
import serviceTherapy from "@/assets/service-therapy.jpg";
import serviceCosmetology from "@/assets/service-cosmetology.jpg";
import serviceOphthalmology from "@/assets/service-ophthalmology.jpg";
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

const servicesData: Record<string, ServiceData> = {
  gynecology: {
    id: 'gynecology',
    title: 'Гінекологія',
    titleRu: 'Гинекология',
    description: 'Комплексна діагностика та лікування жіночого здоров\'я',
    descriptionRu: 'Комплексная диагностика и лечение женского здоровья',
    fullDescription: 'Наше відділення гінекології пропонує повний спектр послуг для жінок будь-якого віку. Ми спеціалізуємося на профілактиці, діагностиці та лікуванні гінекологічних захворювань, веденні вагітності, плануванні сім\'ї та репродуктивному здоров\'ї. Наші лікарі використовують найсучасніше обладнання та новітні методики лікування, забезпечуючи індивідуальний підхід до кожної пацієнтки.',
    fullDescriptionRu: 'Наше отделение гинекологии предлагает полный спектр услуг для женщин любого возраста. Мы специализируемся на профилактике, диагностике и лечении гинекологических заболеваний, ведении беременности, планировании семьи и репродуктивном здоровье. Наши врачи используют самое современное оборудование и новейшие методики лечения, обеспечивая индивидуальный подход к каждой пациентке.',
    icon: '🔬',
    image: serviceGynecology,
    layout: 'imageLeft',
    prices: [
      { name: 'Первинна консультація гінеколога', nameRu: 'Первичная консультация гинеколога', price: '600 грн' },
      { name: 'Повторна консультація гінеколога', nameRu: 'Повторная консультация гинеколога', price: '500 грн' },
      { name: 'УЗД органів малого тазу', nameRu: 'УЗИ органов малого таза', price: '450 грн' },
      { name: 'Кольпоскопія', nameRu: 'Кольпоскопия', price: '400 грн' },
      { name: 'Взяття мазка на флору', nameRu: 'Взятие мазка на флору', price: '150 грн' },
    ],
    doctors: [
      { id: 1, name: 'Олена Коваленко', nameRu: 'Елена Коваленко', specialty: 'Гінекологія', specialtyRu: 'Гинекология', image: doctor1 },
    ]
  },
  dermatology: {
    id: 'dermatology',
    title: 'Дерматологія',
    titleRu: 'Дерматология',
    description: 'Сучасні методи лікування шкіри та косметологічні процедури',
    descriptionRu: 'Современные методы лечения кожи и косметологические процедуры',
    fullDescription: 'Наш дерматологічний центр надає повний спектр послуг з діагностики та лікування захворювань шкіри, волосся та нігтів. Ми використовуємо передові технології для лікування акне, псоріазу, екземи та інших дерматологічних проблем.',
    fullDescriptionRu: 'Наш дерматологический центр предоставляет полный спектр услуг по диагностике и лечению заболеваний кожи, волос и ногтей. Мы используем передовые технологии для лечения акне, псориаза, экземы и других дерматологических проблем.',
    icon: '🔬',
    image: serviceDermatology,
    layout: 'imageRight',
    prices: [
      { name: 'Консультація дерматолога', nameRu: 'Консультация дерматолога', price: '550 грн' },
      { name: 'Дерматоскопія', nameRu: 'Дерматоскопия', price: '350 грн' },
      { name: 'Видалення новоутворень', nameRu: 'Удаление новообразований', price: 'від 800 грн' },
      { name: 'Лікування акне', nameRu: 'Лечение акне', price: 'від 500 грн' },
    ],
    doctors: [
      { id: 3, name: 'Марія Сидоренко', nameRu: 'Мария Сидоренко', specialty: 'Дерматологія', specialtyRu: 'Дерматология', image: doctor3 },
    ]
  },
  cardiology: {
    id: 'cardiology',
    title: 'Кардіологія',
    titleRu: 'Кардиология',
    description: 'Діагностика та лікування серцево-судинних захворювань',
    descriptionRu: 'Диагностика и лечение сердечно-сосудистых заболеваний',
    fullDescription: 'Кардіологічне відділення нашої клініки спеціалізується на діагностиці, лікуванні та профілактиці серцево-судинних захворювань. Ми проводимо комплексне обстеження серця, ЕКГ, холтерівське моніторування та інші сучасні дослідження.',
    fullDescriptionRu: 'Кардиологическое отделение нашей клиники специализируется на диагностике, лечении и профилактике сердечно-сосудистых заболеваний. Мы проводим комплексное обследование сердца, ЭКГ, холтеровское мониторирование и другие современные исследования.',
    icon: '❤️',
    image: serviceCardiology,
    layout: 'imageTop',
    prices: [
      { name: 'Консультація кардіолога', nameRu: 'Консультация кардиолога', price: '650 грн' },
      { name: 'ЕКГ', nameRu: 'ЭКГ', price: '200 грн' },
      { name: 'ЕхоКГ', nameRu: 'ЭхоКГ', price: '600 грн' },
      { name: 'Холтерівське моніторування', nameRu: 'Холтеровское мониторирование', price: '800 грн' },
    ],
    doctors: [
      { id: 4, name: 'Віктор Іваненко', nameRu: 'Виктор Иваненко', specialty: 'Кардіологія', specialtyRu: 'Кардиология', image: doctor4 },
    ]
  },
  ultrasound: {
    id: 'ultrasound',
    title: 'УЗД діагностика',
    titleRu: 'УЗИ диагностика',
    description: 'Сучасна ультразвукова діагностика на новітньому обладнанні',
    descriptionRu: 'Современная ультразвуковая диагностика на новейшем оборудовании',
    fullDescription: 'Наш центр УЗД діагностики оснащений найсучаснішим обладнанням для проведення всіх видів ультразвукових досліджень. Ми гарантуємо високу точність діагностики та швидкість отримання результатів.',
    fullDescriptionRu: 'Наш центр УЗИ диагностики оснащен самым современным оборудованием для проведения всех видов ультразвуковых исследований. Мы гарантируем высокую точность диагностики и скорость получения результатов.',
    icon: '📋',
    image: serviceUltrasound,
    layout: 'standard',
    prices: [
      { name: 'УЗД органів черевної порожнини', nameRu: 'УЗИ органов брюшной полости', price: '450 грн' },
      { name: 'УЗД нирок та сечового міхура', nameRu: 'УЗИ почек и мочевого пузыря', price: '400 грн' },
      { name: 'УЗД щитовидної залози', nameRu: 'УЗИ щитовидной железы', price: '350 грн' },
      { name: 'УЗД серця (ЕхоКГ)', nameRu: 'УЗИ сердца (ЭхоКГ)', price: '600 грн' },
    ],
    doctors: [
      { id: 1, name: 'Олена Коваленко', nameRu: 'Елена Коваленко', specialty: 'УЗД діагностика', specialtyRu: 'УЗИ диагностика', image: doctor1 },
    ]
  },
  pediatrics: {
    id: 'pediatrics',
    title: 'Педіатрія',
    titleRu: 'Педиатрия',
    description: 'Професійна медична допомога для дітей',
    descriptionRu: 'Профессиональная медицинская помощь для детей',
    fullDescription: 'Наші педіатри забезпечують повний спектр медичних послуг для дітей від народження до 18 років. Ми проводимо профілактичні огляди, діагностику та лікування дитячих захворювань з турботою про комфорт маленьких пацієнтів.',
    fullDescriptionRu: 'Наши педиатры обеспечивают полный спектр медицинских услуг для детей от рождения до 18 лет. Мы проводим профилактические осмотры, диагностику и лечение детских заболеваний с заботой о комфорте маленьких пациентов.',
    icon: '👶',
    image: servicePediatrics,
    layout: 'imageLeft',
    prices: [
      { name: 'Консультація педіатра', nameRu: 'Консультация педиатра', price: '500 грн' },
      { name: 'Профілактичний огляд', nameRu: 'Профилактический осмотр', price: '450 грн' },
      { name: 'Вакцинація', nameRu: 'Вакцинация', price: 'від 300 грн' },
      { name: 'Патронаж новонародженого', nameRu: 'Патронаж новорожденного', price: '600 грн' },
    ],
    doctors: [
      { id: 2, name: 'Дмитро Петренко', nameRu: 'Дмитрий Петренко', specialty: 'Педіатрія', specialtyRu: 'Педиатрия', image: doctor2 },
    ]
  },
  therapy: {
    id: 'therapy',
    title: 'Терапія',
    titleRu: 'Терапия',
    description: 'Загальна медична практика та лікування внутрішніх хвороб',
    descriptionRu: 'Общая медицинская практика и лечение внутренних болезней',
    fullDescription: 'Наші терапевти надають первинну медичну допомогу, проводять діагностику та лікування широкого спектра захворювань. Комплексний підхід дозволяє виявити проблеми на ранніх стадіях.',
    fullDescriptionRu: 'Наши терапевты предоставляют первичную медицинскую помощь, проводят диагностику и лечение широкого спектра заболеваний. Комплексный подход позволяет выявить проблемы на ранних стадиях.',
    icon: '🩺',
    image: serviceTherapy,
    layout: 'imageRight',
    prices: [
      { name: 'Консультація терапевта', nameRu: 'Консультация терапевта', price: '500 грн' },
      { name: 'Повторна консультація', nameRu: 'Повторная консультация', price: '400 грн' },
      { name: 'Комплексний огляд', nameRu: 'Комплексный осмотр', price: '800 грн' },
      { name: 'Виклик лікаря додому', nameRu: 'Вызов врача на дом', price: '1200 грн' },
    ],
    doctors: [
      { id: 4, name: 'Віктор Іваненко', nameRu: 'Виктор Иваненко', specialty: 'Терапія', specialtyRu: 'Терапия', image: doctor4 },
    ]
  },
  cosmetology: {
    id: 'cosmetology',
    title: 'Косметологія',
    titleRu: 'Косметология',
    description: 'Сучасні косметологічні процедури для вашої краси',
    descriptionRu: 'Современные косметологические процедуры для вашей красоты',
    fullDescription: 'Косметологічний центр пропонує широкий спектр процедур для догляду за шкірою обличчя та тіла. Наші фахівці використовують сертифіковані препарати та сучасні методики для досягнення найкращих результатів.',
    fullDescriptionRu: 'Косметологический центр предлагает широкий спектр процедур для ухода за кожей лица и тела. Наши специалисты используют сертифицированные препараты и современные методики для достижения лучших результатов.',
    icon: '✨',
    image: serviceCosmetology,
    layout: 'imageTop',
    prices: [
      { name: 'Чистка обличчя', nameRu: 'Чистка лица', price: '800 грн' },
      { name: 'Пілінг', nameRu: 'Пилинг', price: 'від 600 грн' },
      { name: 'Мезотерапія', nameRu: 'Мезотерапия', price: 'від 1200 грн' },
      { name: 'Біоревіталізація', nameRu: 'Биоревитализация', price: 'від 1500 грн' },
    ],
    doctors: [
      { id: 3, name: 'Марія Сидоренко', nameRu: 'Мария Сидоренко', specialty: 'Косметологія', specialtyRu: 'Косметология', image: doctor3 },
    ]
  },
  ophthalmology: {
    id: 'ophthalmology',
    title: 'Офтальмологія',
    titleRu: 'Офтальмология',
    description: 'Діагностика та лікування захворювань очей',
    descriptionRu: 'Диагностика и лечение заболеваний глаз',
    fullDescription: 'Офтальмологічне відділення надає повний спектр послуг з діагностики, лікування та профілактики захворювань органів зору. Сучасне обладнання дозволяє проводити точну діагностику та ефективне лікування.',
    fullDescriptionRu: 'Офтальмологическое отделение предоставляет полный спектр услуг по диагностике, лечению и профилактике заболеваний органов зрения. Современное оборудование позволяет проводить точную диагностику и эффективное лечение.',
    icon: '👁️',
    image: serviceOphthalmology,
    layout: 'standard',
    prices: [
      { name: 'Консультація офтальмолога', nameRu: 'Консультация офтальмолога', price: '550 грн' },
      { name: 'Перевірка зору', nameRu: 'Проверка зрения', price: '300 грн' },
      { name: 'Підбір окулярів', nameRu: 'Подбор очков', price: '400 грн' },
      { name: 'Лікування кон\'юнктивіту', nameRu: 'Лечение конъюнктивита', price: 'від 500 грн' },
    ],
    doctors: [
      { id: 2, name: 'Дмитро Петренко', nameRu: 'Дмитрий Петренко', specialty: 'Офтальмологія', specialtyRu: 'Офтальмология', image: doctor2 },
    ]
  }
};

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const service = serviceId ? servicesData[serviceId] : null;

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              {language === 'uk' ? 'Послугу не знайдено' : 'Услуга не найдена'}
            </h1>
            <Button onClick={() => navigate("/services")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'uk' ? 'Повернутися до послуг' : 'Вернуться к услугам'}
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
              {language === 'uk' ? 'До всіх послуг' : 'Ко всем услугам'}
            </Button>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-b from-secondary/30 to-background">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-4">{service.icon}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{description}</p>
              <BookingDialog preselectedService={serviceId} />
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
                      {language === 'uk' ? 'Про послугу' : 'Об услуге'}
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
                        {language === 'uk' ? 'Про послугу' : 'Об услуге'}
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
                      {language === 'uk' ? 'Про послугу' : 'Об услуге'}
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
                {language === 'uk' ? 'Ціни на послуги' : 'Цены на услуги'}
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
                {language === 'uk' ? 'Наші лікарі' : 'Наши врачи'}
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
                            {language === 'uk' ? 'Переглянути профіль' : 'Посмотреть профиль'}
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
                {language === 'uk' ? 'Готові записатися на прийом?' : 'Готовы записаться на прием?'}
              </h2>
              <p className="text-muted-foreground mb-8">
                {language === 'uk' 
                  ? 'Наша команда фахівців готова надати вам кваліфіковану допомогу'
                  : 'Наша команда специалистов готова предоставить вам квалифицированную помощь'}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <BookingDialog 
                  preselectedService={serviceId}
                  triggerText={language === 'uk' ? 'Записатися на консультацію' : 'Записаться на консультацию'}
                />
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+380954220032">
                    <Clock className="mr-2 h-5 w-5" />
                    {language === 'uk' ? 'Зателефонувати' : 'Позвонить'}
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
