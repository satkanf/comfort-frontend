import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import BookingDialog from '@/components/BookingDialog';
import CallbackDialog from '@/components/CallbackDialog';
import DoctorCard from '@/components/DoctorCard';
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";
import { getBaseUrl } from "@/utils/baseUrl";

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
  slug?: string
}

const Doctors = ({ language: propLanguage = "uk" }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const { language } = useTranslations();
  const { language: currentLanguage } = useLanguage();

  const getTranslations = () => {
    return {
      pageTitle: translations.pages.doctors.allDoctors[language as "uk" | "ru"],
      pageSubtitle: 'Команда висококваліфікованих фахівців з багаторічним досвідом та індивідуальним підходом до кожного пацієнта',
      all: translations.common.all[language as "uk" | "ru"],
      searchPlaceholder: translations.pages.doctors.searchPlaceholder[language as "uk" | "ru"],
      filterBySpecialty: translations.pages.doctors.filterBySpecialty[language as "uk" | "ru"],
      experience: translations.pages.doctors.experience[language as "uk" | "ru"],
      bookAppointment: translations.pages.doctors.bookAppointment[language as "uk" | "ru"],
      noDoctors: translations.pages.doctors.noDoctors[language as "uk" | "ru"],
      needConsultation: language === 'ru' ? 'Нужна консультация?' : 'Потрібна консультація?',
      consultationText: language === 'ru'
        ? 'Позвоните нам или заполните форму онлайн-записи, и мы подберем для вас лучшего специалиста'
        : 'Зателефонуйте нам або заповніть форму онлайн-запису, і ми підберемо для вас найкращого спеціаліста'
    };
  };

  const pageTranslations = getTranslations();

  // Загружаем всех врачей из API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = getBaseUrl();
        const doctorsUrl = `${baseUrl}/wp-json/wp/v2/doctors?per_page=100&_embed=1&acf_format=standard&lang=${currentLanguage}`;
        const response = await fetch(doctorsUrl, {
          method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Обрабатываем данные - сохраняем featured_media для использования в компоненте
        const processedDoctors = data.map((doctor: any) => {
          const embeddedMedia = doctor._embedded?.["wp:featuredmedia"]?.[0];
          const categoryNames = doctor._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.name) || [];

          return {
            ...doctor,
            _embedded: {
              featured: embeddedMedia || null,
              featuredMediaId: doctor.featured_media || null
            },
            category_names: categoryNames,
          };
        });

        setDoctors(processedDoctors);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch doctors');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentLanguage]);

  // Получаем специальности из загруженных врачей
  const specialties = useMemo(() => {
    if (!doctors.length) return ['all'];

    const allSpecialties = new Set<string>();
    doctors.forEach((doctor) => {
      doctor.category_names?.forEach((spec) => allSpecialties.add(spec));
    });

    return ["all", ...Array.from(allSpecialties)];
  }, [doctors]);


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
        <Header postId="" />
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
      <Header postId="" />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-medical-gray-light via-background to-secondary/30">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {pageTranslations.pageTitle}
              </h1>
              <p className="text-lg text-muted-foreground">
                {pageTranslations.pageSubtitle}
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
                    {specialty === 'all' ? pageTranslations.all : specialty}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={pageTranslations.searchPlaceholder}
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
                  {pageTranslations.noDoctors}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              {pageTranslations.needConsultation}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {pageTranslations.consultationText}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookingDialog />
              <CallbackDialog size="lg" variant="outline" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Doctors;