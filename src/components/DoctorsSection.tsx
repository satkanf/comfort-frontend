import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMultilangDoctors } from "@/hooks/useMultilangDoctors";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/translations";

interface DoctorsSectionProps {
  acfFieldName?: string; // по умолчанию "home_doctors_add"
}

const DoctorsSection = ({ acfFieldName = "home_doctors_add" }: DoctorsSectionProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const {
    doctors,
    loading,
    error,
    blockData,
  } = useMultilangDoctors(acfFieldName);


  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-medical-gray-light/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600 text-sm mb-2">Помилка завантаження лікарів</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>
      </section>
    );
  }

  if (!doctors.length) {
    return (
      <section className="py-20 bg-medical-gray-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {blockData?.title}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {blockData?.description}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Список лікарів тимчасово недоступний.
            </p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section className="py-20 bg-medical-gray-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {blockData?.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {blockData?.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {doctors.map((doctor: any) => {
            // Извлекаем фото - используем тот же подход, что и в DoctorCard
            const featured = doctor._embedded?.featured;
            
            // Проверяем, не является ли это ошибкой доступа
            const hasError = featured && (featured.code === "rest_forbidden" || featured.message);
            
            // Извлекаем фото аналогично DoctorCard
            let avatar = "";
            
            // 1. Из featured media_details sizes (если нет ошибки)
            if (!hasError && featured) {
              avatar =
                featured.media_details?.sizes?.medium?.source_url ||
                featured.media_details?.sizes?.full?.source_url ||
                featured.source_url ||
                "";
            }
            
            // 2. Из ACF поля doctor_avatar (fallback)
            if (!avatar && doctor.acf?.doctor_avatar) {
              const acfAvatar = doctor.acf.doctor_avatar;
              if (typeof acfAvatar === "string" && acfAvatar.startsWith("http")) {
                avatar = acfAvatar;
              } else if (acfAvatar?.url) {
                avatar = acfAvatar.url;
              }
            }
            
            // 3. Если есть ошибка доступа, но есть featured_media ID, используем guid
            if (!avatar && hasError && featured?.guid?.rendered) {
              avatar = featured.guid.rendered;
            }

            const image = avatar || "/placeholder.jpg";

            const specialization =
              doctor.acf?.doctor_info?.doctor_specialization ||
              doctor.acf?.doctor_specialization ||
              "";

            return (
              <Card
                key={doctor.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(`/doctors/${doctor.slug || doctor.id}`)}
              >
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-medical-gray-light to-secondary/30">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={doctor.title?.rendered}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Если изображение не загрузилось, скрываем его
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-4xl text-primary/60">👨‍⚕️</div>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3
                    className="text-xl font-bold text-foreground mb-1"
                    dangerouslySetInnerHTML={{ __html: doctor.title?.rendered || "" }}
                  />
                  {specialization && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{specialization}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate("/likari")}
            className="px-8"
          >
            {translations.pages.home.doctors.allDoctors[language as "uk" | "ru"]}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;

