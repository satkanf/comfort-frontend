import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ArrowLeft, Calendar } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useLanguage } from "@/contexts/LanguageContext";

interface DoctorWP {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    doctor_info?: {
      doctor_experience?: string;
      doctor_specialization?: string;
    };
    doctor_add_info?:{
      doctor_list_title: string,
      doctor_list_value?: string,
    }
    doctor_about?: string;
    doctor_photo?: string; // сюда подставь поле для фото — нужно глянуть в API
  };
  _embedded?: any;
  category_names?: string[];
}


interface DoctorAddCertificatesProps {
  certificateIds: number[]; // массив ID из ACF
}

// Компонент для сертификатов
const DoctorCertificates = ({ certificateIds }: { certificateIds: number[] }) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const urls = await Promise.all(
          certificateIds.map(async (id) => {
            const res = await fetch(`https://comfort.satkan.site/wp-json/wp/v2/media/${id}`);
            const data = await res.json();
            return data.source_url; // получаем ссылку на изображение
          })
        );
        setImages(urls);
      } catch (error) {
        console.error("Ошибка при загрузке сертификатов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [certificateIds]);

  if (loading) return <div>Завантаження сертифікатів...</div>;
  if (!images.length) return null;

  return (
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
                {images.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="flex justify-center">
                      <img
                        src={url}
                        alt={`Сертифікат ${index + 1}`}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

const DoctorDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [doctor, setDoctor] = useState<DoctorWP | null>(null);
  const [loading, setLoading] = useState(true);


  
  useEffect(() => {
    if (!slug) return;

    fetch(`https://comfort.satkan.site/wp-json/wp/v2/doctors?slug=${slug}&_embed=1`)
      .then(res => res.json())
      .then(data => {
        setDoctor(data[0] || null);
        setLoading(false);
      });
  }, [slug]);
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Завантаження...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Лікаря не знайдено</h1>
            <Button onClick={() => navigate("/likari")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Повернутися до списку лікарів
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const name = doctor.title.rendered;
  const exp = doctor.acf?.doctor_info?.doctor_experience;
  const spec = doctor.acf?.doctor_info?.doctor_specialization;
  const about = doctor.acf?.doctor_about;
  const photo = doctor._embedded?.["wp:featuredmedia"]?.[0]?.source_url
  const doctorAdd = doctor.acf?.doctor_add_info;
  const cat =
  doctor._embedded?.["wp:term"]?.[0]?.find(
    (t: any) => t.taxonomy === "category-doctors"
  )?.name || "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-6 border-b bg-background">
          <div className="container">
            <Button variant="ghost" onClick={() => navigate("/likari")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back')}
            </Button>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-br from-medical-gray-light via-background to-secondary/30">
          <div className="container grid gap-8 md:grid-cols-3">
            <div>
              <Card className="overflow-hidden">
                <div className="relative h-96">
                  <img
                    src={photo}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                {cat && <Badge className="mb-3">{cat}</Badge>}
                <h1 className="text-4xl font-bold mb-2">{name}</h1>
                {exp && <p className="text-xl text-muted-foreground"><span className="text-foreground font-bold">{t('experience')}</span> {exp}</p>}
              </div>

              {spec && <p className="text-lg">{spec}</p>}

              <Button size="lg" className="w-full sm:w-auto">
                <Calendar className="mr-2 h-5 w-5" />
                {t('doctors.appointment')}
              </Button>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container">
            <h2 className="text-3xl font-bold mb-6">{t('about.doctor')}</h2>
            <Card>
              <CardContent className="pt-6">
                {about && <p className="text-lg leading-relaxed">{about}</p>}
              </CardContent>
            </Card>
          </div>
        </section>

{Array.isArray(doctorAdd) && doctorAdd.length > 0 &&
  doctorAdd.map((item, index) => {

    switch (item.acf_fc_layout) {

      case "doctor_add_certificates":
        return (
         <DoctorCertificates 
            key={index} 
            certificateIds={item.doctor_certificates || []} 
          />
        );

      default:
        return (
          <section
            className="py-12 bg-gradient-to-br from-primary/5 to-accent/5"
            key={index}
          >
            <div className="container">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                {item.doctor_list_title}
              </h2>

              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-4 gap-6">
                    {Array.isArray(item.doctor_list_repeater) &&
                      item.doctor_list_repeater.map((edu, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-base">{edu.doctor_list_value}</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        );
    }
  })
}


        
      </main>

      <Footer />
    </div>
  );
};

export default DoctorDetail;
