import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Award, Calendar, ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";
import BookingDialog from "@/components/BookingDialog";
import CallbackDialog from "@/components/CallbackDialog";

interface Review {
  id: number;
  patientName: string;
  date: string;
  rating: number;
  comment: string;
}

interface Certification {
  title: string;
  organization: string;
  year: string;
}

interface WorkingHours {
  day: string;
  hours: string;
}

interface DoctorDetail {
  id: number;
  name: string;
  specialty: string;
  image: string;
  education: string;
  experience: string;
  rating: number;
  reviewCount: number;
  description: string;
  biography: string;
  detailedEducation: string[];
  certifications: Certification[];
  workingHours: WorkingHours[];
  reviews: Review[];
  phone: string;
  email: string;
  location: string;
}

const doctorsData: DoctorDetail[] = [
  {
    id: 1,
    name: "Олена Коваленко",
    specialty: "Гінекологія",
    image: doctor1,
    education: "Національний медичний університет ім. О.О. Богомольця",
    experience: "12 років медичної практики",
    rating: 4.9,
    reviewCount: 128,
    description: "Спеціалізується на веденні вагітності, лікуванні гінекологічних захворювань та репродуктивному здоров'ї жінок.",
    biography: "Олена Коваленко — досвідчений лікар-гінеколог з 12-річним стажем роботи. Закінчила Національний медичний університет імені О.О. Богомольця з відзнакою. Пройшла спеціалізацію в провідних медичних центрах України та Європи. Має великий досвід ведення вагітності, діагностики та лікування гінекологічних захворювань. Постійно підвищує кваліфікацію, бере участь у міжнародних конференціях та семінарах.",
    detailedEducation: [
      "2007-2013: Національний медичний університет ім. О.О. Богомольця, Лікувальна справа",
      "2013-2015: Інтернатура з акушерства та гінекології, НМУ ім. О.О. Богомольця",
      "2015-2017: Клінічна ординатура, спеціалізація \"Репродуктивне здоров'я\"",
      "2019: Стажування в клініці Charité, Берлін, Німеччина"
    ],
    certifications: [
      { title: "Сертифікат лікаря-гінеколога вищої категорії", organization: "МОЗ України", year: "2020" },
      { title: "Європейський сертифікат з ультразвукової діагностики", organization: "EFSUMB", year: "2018" },
      { title: "Сертифікат з лапароскопічної хірургії", organization: "ESGE", year: "2019" }
    ],
    workingHours: [
      { day: "Понеділок", hours: "09:00 - 17:00" },
      { day: "Вівторок", hours: "09:00 - 17:00" },
      { day: "Середа", hours: "09:00 - 17:00" },
      { day: "Четвер", hours: "09:00 - 17:00" },
      { day: "П'ятниця", hours: "09:00 - 15:00" },
      { day: "Субота", hours: "10:00 - 14:00" },
      { day: "Неділя", hours: "Вихідний" }
    ],
    reviews: [
      {
        id: 1,
        patientName: "Марія С.",
        date: "15.03.2025",
        rating: 5,
        comment: "Чудовий лікар! Олена Миколаївна дуже уважна, професійна та турботлива. Вела мою вагітність від початку до кінця. Завжди на зв'язку, відповідає на всі питання. Рекомендую!"
      },
      {
        id: 2,
        patientName: "Анна К.",
        date: "02.03.2025",
        rating: 5,
        comment: "Професіонал своєї справи. Допомогла вирішити складну проблему, з якою я мучилася роками. Дякую за турботу та уважність!"
      },
      {
        id: 3,
        patientName: "Ірина П.",
        date: "20.02.2025",
        rating: 5,
        comment: "Олена Миколаївна — найкращий лікар! Дуже уважна до деталей, все пояснює зрозумілою мовою. Відчуваєш себе в надійних руках."
      }
    ],
    phone: "+380 44 123 45 67",
    email: "o.kovalenko@comfortclinic.ua",
    location: "Кабінет 205, 2-й поверх"
  },
  {
    id: 2,
    name: "Дмитро Петренко",
    specialty: "Терапія",
    image: doctor2,
    education: "Київський медичний університет, вища категорія",
    experience: "18 років медичної практики",
    rating: 4.8,
    reviewCount: 156,
    description: "Експерт в діагностиці та лікуванні внутрішніх хвороб, профілактичній медицині та загальній терапії.",
    biography: "Дмитро Петренко — досвідчений терапевт з 18-річним стажем. Спеціалізується на діагностиці та лікуванні широкого спектру захворювань внутрішніх органів. Має вищу кваліфікаційну категорію. Автор наукових публікацій з питань профілактичної медицини.",
    detailedEducation: [
      "2001-2007: Київський національний медичний університет, Лікувальна справа",
      "2007-2009: Інтернатура з терапії, КНМУ",
      "2010-2012: Докторантура, спеціалізація \"Кардіологія\"",
      "2015: Стажування в Mayo Clinic, США"
    ],
    certifications: [
      { title: "Лікар-терапевт вищої категорії", organization: "МОЗ України", year: "2015" },
      { title: "Сертифікат з функціональної діагностики", organization: "Асоціація кардіологів України", year: "2017" },
      { title: "Сертифікат з доказової медицини", organization: "Oxford Medical School", year: "2019" }
    ],
    workingHours: [
      { day: "Понеділок", hours: "08:00 - 16:00" },
      { day: "Вівторок", hours: "08:00 - 16:00" },
      { day: "Середа", hours: "08:00 - 16:00" },
      { day: "Четвер", hours: "08:00 - 16:00" },
      { day: "П'ятниця", hours: "08:00 - 14:00" },
      { day: "Субота", hours: "Вихідний" },
      { day: "Неділя", hours: "Вихідний" }
    ],
    reviews: [
      {
        id: 1,
        patientName: "Олександр В.",
        date: "10.03.2025",
        rating: 5,
        comment: "Чудовий лікар! Дмитро Іванович дуже уважний, провів повне обстеження та призначив ефективне лікування."
      },
      {
        id: 2,
        patientName: "Наталія Г.",
        date: "25.02.2025",
        rating: 5,
        comment: "Професіонал найвищого рівня. Завжди знаходить час для пацієнта, все детально пояснює."
      }
    ],
    phone: "+380 44 123 45 68",
    email: "d.petrenko@comfortclinic.ua",
    location: "Кабінет 301, 3-й поверх"
  },
  {
    id: 3,
    name: "Марина Іванова",
    specialty: "Дерматологія",
    image: doctor3,
    education: "Харківський національний медичний університет",
    experience: "10 років медичної практики",
    rating: 4.9,
    reviewCount: 142,
    description: "Фахівець з лікування шкірних захворювань, косметологічних процедур та естетичної медицини.",
    biography: "Марина Іванова — дерматолог-косметолог з 10-річним досвідом роботи. Спеціалізується на лікуванні акне, псоріазу, екземи та інших захворювань шкіри. Експерт в естетичній медицині та anti-age терапії.",
    detailedEducation: [
      "2009-2015: Харківський національний медичний університет, Медицина",
      "2015-2017: Інтернатура з дерматології, ХНМУ",
      "2018: Курс естетичної медицини, Інститут косметології, Київ",
      "2020: Стажування в клініці L'Oréal Dermatology Center, Париж"
    ],
    certifications: [
      { title: "Сертифікат дерматолога-косметолога", organization: "МОЗ України", year: "2017" },
      { title: "Сертифікат з лазерної дерматології", organization: "European Society for Laser Dermatology", year: "2019" },
      { title: "Сертифікат з естетичної медицини", organization: "IMCAS", year: "2021" }
    ],
    workingHours: [
      { day: "Понеділок", hours: "10:00 - 18:00" },
      { day: "Вівторок", hours: "10:00 - 18:00" },
      { day: "Середа", hours: "Вихідний" },
      { day: "Четвер", hours: "10:00 - 18:00" },
      { day: "П'ятниця", hours: "10:00 - 18:00" },
      { day: "Субота", hours: "10:00 - 16:00" },
      { day: "Неділя", hours: "Вихідний" }
    ],
    reviews: [
      {
        id: 1,
        patientName: "Олена М.",
        date: "18.03.2025",
        rating: 5,
        comment: "Марина Олександрівна — чудовий спеціаліст! Допомогла позбутися проблем зі шкірою, які мучили мене роками."
      },
      {
        id: 2,
        patientName: "Світлана Д.",
        date: "05.03.2025",
        rating: 5,
        comment: "Дуже професійний підхід, сучасні методи лікування. Результат перевершив очікування!"
      }
    ],
    phone: "+380 44 123 45 69",
    email: "m.ivanova@comfortclinic.ua",
    location: "Кабінет 105, 1-й поверх"
  },
  {
    id: 4,
    name: "Андрій Шевченко",
    specialty: "Кардіологія",
    image: doctor4,
    education: "Львівський національний медичний університет",
    experience: "20 років медичної практики",
    rating: 5.0,
    reviewCount: 187,
    description: "Провідний кардіолог з діагностики та лікування серцево-судинних захворювань, профілактики інфарктів.",
    biography: "Андрій Шевченко — провідний кардіолог клініки з 20-річним стажем. Кандидат медичних наук, автор понад 40 наукових публікацій. Спеціалізується на діагностиці та лікуванні складних серцево-судинних захворювань, інтервенційній кардіології.",
    detailedEducation: [
      "1999-2005: Львівський національний медичний університет, Лікувальна справа",
      "2005-2007: Інтернатура з кардіології, ЛНМУ",
      "2007-2010: Аспірантура, кандидат медичних наук",
      "2012: Стажування в German Heart Center, Берлін",
      "2016: Стажування в Cleveland Clinic, США"
    ],
    certifications: [
      { title: "Лікар-кардіолог вищої категорії", organization: "МОЗ України", year: "2012" },
      { title: "Сертифікат з інтервенційної кардіології", organization: "European Society of Cardiology", year: "2014" },
      { title: "Сертифікат з ехокардіографії", organization: "European Association of Cardiovascular Imaging", year: "2016" }
    ],
    workingHours: [
      { day: "Понеділок", hours: "08:00 - 16:00" },
      { day: "Вівторок", hours: "08:00 - 16:00" },
      { day: "Середа", hours: "08:00 - 16:00" },
      { day: "Четвер", hours: "08:00 - 16:00" },
      { day: "П'ятниця", hours: "08:00 - 15:00" },
      { day: "Субота", hours: "Вихідний" },
      { day: "Неділя", hours: "Вихідний" }
    ],
    reviews: [
      {
        id: 1,
        patientName: "Петро К.",
        date: "12.03.2025",
        rating: 5,
        comment: "Андрій Васильович врятував мені життя! Професіонал найвищого класу, уважний та чуйний лікар."
      },
      {
        id: 2,
        patientName: "Віктор С.",
        date: "28.02.2025",
        rating: 5,
        comment: "Найкращий кардіолог! Провів повне обстеження, все детально пояснив, призначив ефективне лікування."
      },
      {
        id: 3,
        patientName: "Михайло Л.",
        date: "15.02.2025",
        rating: 5,
        comment: "Дуже вдячний за допомогу! Андрій Васильович — справжній професіонал з великої літери."
      }
    ],
    phone: "+380 44 123 45 70",
    email: "a.shevchenko@comfortclinic.ua",
    location: "Кабінет 401, 4-й поверх"
  }
];

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctorsData.find((d) => d.id === Number(id));

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Лікаря не знайдено</h1>
            <Button onClick={() => navigate("/doctors")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Повернутися до списку лікарів
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
        {/* Back Button */}
        <section className="py-6 border-b bg-background">
          <div className="container">
            <Button variant="ghost" onClick={() => navigate("/doctors")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Повернутися до списку лікарів
            </Button>
          </div>
        </section>

        {/* Doctor Profile Header */}
        <section className="py-12 bg-gradient-to-br from-medical-gray-light via-background to-secondary/30">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-1">
                <Card className="overflow-hidden">
                  <div className="relative h-96 bg-gradient-to-br from-medical-gray-light to-secondary/30">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <Badge className="mb-3">{doctor.specialty}</Badge>
                  <h1 className="text-4xl font-bold mb-2">{doctor.name}</h1>
                  <p className="text-xl text-muted-foreground">{doctor.experience}</p>
                </div>


                <p className="text-lg">{doctor.description}</p>


                <Button size="lg" className="w-full sm:w-auto">
                  <Calendar className="mr-2 h-5 w-5" />
                  Записатися на прийом
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Biography */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-3xl font-bold mb-6">Біографія</h2>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed">{doctor.biography}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Education - Full Width */}
        <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Award className="h-8 w-8 text-primary" />
              Освіта
            </h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-4 grid md:grid-cols-2 gap-6">
                  {doctor.detailedEducation.map((edu, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-base">{edu}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Certifications Slider - Full Width */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Award className="h-8 w-8 text-primary" />
              Сертифікати
            </h2>
            <Card>
              <CardContent className="pt-6">
                <Carousel className="w-full max-w-4xl mx-auto">
                  <CarouselContent>
                    <CarouselItem>
                      <div className="flex justify-center">
                        <img
                          src="/src/assets/certificate-1.jpg"
                          alt="Сертифікат 1"
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                    </CarouselItem>
                    <CarouselItem>
                      <div className="flex justify-center">
                        <img
                          src="/src/assets/certificate-2.jpg"
                          alt="Сертифікат 2"
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Готові записатися на прийом?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Зателефонуйте нам або заповніть форму онлайн-запису
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookingDialog  />
              <CallbackDialog  size="lg" variant="secondary" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DoctorDetail;
