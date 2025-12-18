import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";


interface Doctor {
  id: number;
  title: { rendered: string };
  acf?: {
    doctor_info?:
      {
        doctor_specialization?: string;
        doctor_experience?: string;
      }
    rating?: number;
    doctor_avatar?: string;
  };
  _embedded?: any;
 
}

interface DoctorsSectionProps {
  acfFieldName?: string; // по умолчанию "home_doctors_add"
}

const DoctorsSection = ({ acfFieldName = "home_doctors_add" }: DoctorsSectionProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [doctorIds, setDoctorIds] = useState<number[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Получаем ID врачей из главной страницы ACF
  useEffect(() => {
    const fetchDoctorIds = async () => {
      try {
        const response = await fetch(
          "https://comfort.satkan.site/wp-json/custom/v1/page/golovna?_embed"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const ids: number[] = data?.acf?.add_block
          ?.map((el: any) => el.home_doctors_add?.map((item: any) => item.ID) || [])
          .flat() || [];
        
        setDoctorIds(ids);
      } catch (err) {
        console.error("Ошибка при получении ID врачей:", err);
      }
    };

    fetchDoctorIds();
  }, [acfFieldName]);

  // 2️⃣ Загружаем всех врачей по массиву ID
  useEffect(() => {
    if (!doctorIds.length) {
      setLoading(false);
      return;
    }

    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `https://comfort.satkan.site/wp-json/wp/v2/doctors?include=${doctorIds.join(",")}&_embed`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        console.error("Ошибка при загрузке врачей:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [doctorIds]);

  if (loading) return null;
  if (!doctors.length) return null;

  return (

    <section className="py-20 bg-medical-gray-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {language === 'uk' ? 'Наші лікарі' : 'Наши врачи'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {language === 'uk' 
              ? 'Команда досвідчених фахівців з багаторічною практикою та високою кваліфікацією'
              : 'Команда опытных специалистов с многолетней практикой и высокой квалификацией'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {doctors.map((doctor, index) => {
            const image =
              doctor.acf?. doctor_avatar ||
              doctor._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
              "/placeholder.jpg";
            return (
               <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => navigate(`/doctors/${doctor.slug}`)}
                >
                
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={image}
                      alt={doctor.title.rendered}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-1" dangerouslySetInnerHTML={{ __html: doctor.title.rendered }}>{}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{}</p>
                    <div className="flex items-center gap-1">
                      
                      <span className="font-semibold">{doctor.acf?.doctor_info.doctor_specialization}</span>
                    </div>
                  </CardContent>
              </Card>
            )
          })}
         
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate("/likari")}
            className="px-8"
          >
            {language === 'uk' ? 'Всі лікарі' : 'Все врачи'}
          </Button>
        </div>
      </div>
    </section>

  );
};

 export default DoctorsSection;
