import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoctorCard from "@/components/DoctorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";
import BookingDialog from "@/components/BookingDialog";
import CallbackDialog from "@/components/CallbackDialog";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  education: string;
  experience: string;
  rating: number;
  reviewCount: number;
  description: string;
}

const doctors: Doctor[] = [
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
  },
  {
    id: 5,
    name: "Світлана Морозова",
    specialty: "Педіатрія",
    image: doctor1,
    education: "Одеський національний медичний університет",
    experience: "15 років медичної практики",
    rating: 4.8,
    reviewCount: 203,
    description: "Досвідчений педіатр, спеціалізується на веденні дітей від народження, профілактиці та лікуванні.",
  },
  {
    id: 6,
    name: "Ігор Сидоренко",
    specialty: "Урологія",
    image: doctor2,
    education: "Дніпровський державний медичний університет",
    experience: "14 років медичної практики",
    rating: 4.7,
    reviewCount: 94,
    description: "Спеціаліст з урологічних захворювань, діагностики та лікування чоловічого здоров'я.",
  },
  {
    id: 7,
    name: "Наталія Бондаренко",
    specialty: "Косметологія",
    image: doctor3,
    education: "Інститут косметології та естетичної медицини",
    experience: "8 років медичної практики",
    rating: 4.9,
    reviewCount: 176,
    description: "Експерт з ін'єкційної косметології, апаратних процедур та комплексного омолодження.",
  },
  {
    id: 8,
    name: "Віктор Гриценко",
    specialty: "УЗД діагностика",
    image: doctor4,
    education: "Київська медична академія післядипломної освіти",
    experience: "16 років медичної практики",
    rating: 4.8,
    reviewCount: 112,
    description: "Провідний спеціаліст УЗД діагностики з експертним рівнем кваліфікації.",
  },
];

const specialties = [
  "Всі спеціальності",
  "Гінекологія",
  "Терапія",
  "Дерматологія",
  "Кардіологія",
  "Педіатрія",
  "Урологія",
  "Косметологія",
  "УЗД діагностика",
];

const Doctors = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("Всі спеціальності");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSpecialty =
      selectedSpecialty === "Всі спеціальності" || doctor.specialty === selectedSpecialty;
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-medical-gray-light via-background to-secondary/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Наші Лікарі</h1>
              <p className="text-lg text-muted-foreground">
                Команда висококваліфікованих фахівців з багаторічним досвідом та індивідуальним підходом до кожного пацієнта
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b bg-background sticky top-[112px] z-40">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <Button
                    key={specialty}
                    variant={selectedSpecialty === specialty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSpecialty(specialty)}
                  >
                    {specialty}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Пошук лікаря..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="py-16">
          <div className="container">
            {filteredDoctors.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor.id} {...doctor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Не знайдено лікарів за вашим запитом
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Потрібна консультація?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Зателефонуйте нам або заповніть форму онлайн-запису, і ми підберемо для вас найкращого спеціаліста
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookingDialog />
              <CallbackDialog  size="lg" variant="secondary" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;
