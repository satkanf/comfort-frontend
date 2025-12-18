import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import BookingDialog from '@/components/BookingDialog';
import CallbackDialog from '@/components/CallbackDialog';
import DoctorCard from '@/components/DoctorCard';
import { useLanguage } from "@/contexts/LanguageContext";

interface DoctorData {
  id: number;
  title: {
    rendered: string;
  };
  categories: number[];
  acf?: {
    doctor_avatar?: string | number;
    doctor_info?: string;
    doctor_info_ru?: string;
    doctor_specialization?: string | any;
    doctor_experience?: string | any;
  };
  category_names?: string[];
   _embedded?: any;
  slug: string
}

const Doctors = ({ language = "uk" }) => {
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [specialties, setSpecialties] = useState<string[]>(['all']);
  const { t } = useLanguage();

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://comfort.satkan.site/wp-json/wp/v2/doctors?per_page=100&_embed=1&acf_format=standard"
      );

      if (!response.ok) {
        throw new Error("Error fetching doctors");
      }

      const data = await response.json();

      const processedDoctors: DoctorData[] = data.map((doctor: any) => {
        const categoryNames =
          doctor._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.name) || [];

        return {
          id: doctor.id,
          title: doctor.title,
          categories: doctor.categories || [],
          acf: doctor.acf || {},
          category_names: categoryNames,
          slug: doctor.slug,

          // ⬇⬇⬇ Главное исправление — вытягиваем фото врача из featured_media
          _embedded: {
            featured: doctor._embedded?.["wp:featuredmedia"]?.[0] || null
          }
        };
      });

      setDoctors(processedDoctors);

      const allSpecialties = new Set<string>();
      processedDoctors.forEach((doctor) => {
        doctor.category_names?.forEach((spec) => allSpecialties.add(spec));
      });

      setSpecialties(["all", ...Array.from(allSpecialties)]);
    } catch (err) {
      console.error("Ошибка загрузки докторов:", err);

      setDoctors(getFallbackDoctors());
      setSpecialties(["all", "Косметологи", "Дерматологи", "Трихологи"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const getFallbackDoctors = (): DoctorData[] => {
    return [
      {
        id: 1,
        title: { rendered: "Доктор Іванова Ольга" },
        categories: [1],
        acf: {
          doctor_avatar: "",
          doctor_info: "Лікар-косметолог з 10-річним досвідом. Спеціалізація: ін'єкційна косметологія, лікування акне.",
          doctor_info_ru: "Врач-косметолог с 10-летним опытом. Специализация: инъекционная косметология, лечение акне.",
          doctor_specialization: "Косметолог",
          doctor_experience: "10 років"
        },
        category_names: ["Косметологи"]
      },
      {
        id: 2,
        title: { rendered: "Доктор Петренко Максим" },
        categories: [2],
        acf: {
          doctor_avatar: "",
          doctor_info: "Спеціаліст з апаратної косметології. Досвід роботи 8 років.",
          doctor_info_ru: "Специалист по аппаратной косметологии. Опыт работы 8 лет.",
          doctor_specialization: "Апаратна косметологія",
          doctor_experience: "8 років"
        },
        category_names: ["Апаратні косметологи"]
      }
    ];
  };

  // useEffect(() => {
  //   fetchDoctors();
  // }, []);

  // Фильтрация докторов
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.title.rendered.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            (doctor.category_names && doctor.category_names.includes(selectedSpecialty));
    
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-16 bg-gradient-to-br from-medical-gray-light via-background to-secondary/30">
            <div className="container">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <div className="h-12 bg-muted rounded w-1/2 mx-auto animate-pulse"></div>
                <div className="h-6 bg-muted rounded w-2/3 mx-auto animate-pulse"></div>
              </div>
            </div>
          </section>
          
          <section className="py-16">
            <div className="container">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-background rounded-lg border border-border h-80 animate-pulse"></div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-medical-gray-light via-background to-secondary/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {language === "uk" ? "Наші Лікарі" : "Наши Врачи"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {language === "uk" 
                  ? "Команда висококваліфікованих фахівців з багаторічним досвідом та індивідуальним підходом до кожного пацієнта"
                  : "Команда высококвалифицированных специалистов с многолетним опытом и индивидуальным подходом к каждому пациенту"}
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 border-b bg-background">
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
                    {specialty === 'all' ? t('all') : specialty}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('search.doc')}
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
                  <DoctorCard 
                    key={doctor.id} 
                    doctor={doctor}
                    language={language}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {language === "uk" 
                    ? "Не знайдено лікарів за вашим запитом"
                    : "Не найдено врачей по вашему запросу"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              {language === "uk" ? "Потрібна консультація?" : "Нужна консультация?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {language === "uk" 
                ? "Зателефонуйте нам або заповніть форму онлайн-запису, і ми підберемо для вас найкращого спеціаліста"
                : "Позвоните нам или заполните форму онлайн-записи, и мы подберем для вас лучшего специалиста"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookingDialog />
              <CallbackDialog size="lg" variant="secondary" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;