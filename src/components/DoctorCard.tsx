import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface DoctorCardData {
  id: number;
  title: {
    rendered: string;
  };
  slug?: string;
  _embedded?: any;
  acf?: {
    doctor_avatar?: string;
    doctor_info?: {
      doctor_specialization?: string;
      doctor_experience?: string;
    };
    doctor_info_ru?: string;
  };
  category_names?: string[];
}

interface DoctorCardProps {
  doctor: DoctorCardData;
  language?: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, language = "uk" }) => {
  const navigate = useNavigate();
  const { title, slug, acf, category_names } = doctor;
  // безопасное извлечение значений
  const getSafeString = (field: any): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') return Object.values(field).join(', ');
    return String(field || '');
  };

  // Выбираем данные в зависимости от языка
  const doctorInfo = language === 'ru' && acf?.doctor_info_ru
    ? acf.doctor_info_ru
    : acf?.doctor_info;

  const specialization = getSafeString(
    typeof doctorInfo === 'object'
      ? doctorInfo?.doctor_specialization
      : doctorInfo
  );
  const experience = getSafeString(
    typeof doctorInfo === 'object'
      ? doctorInfo?.doctor_experience
      : doctorInfo
  );
  const avatar =
  doctor.acf?.doctor_avatar ||
  doctor._embedded?.featured?.media_details?.sizes?.medium?.source_url ||
  doctor._embedded?.featured?.source_url ||
  "";
  const category = category_names?.[0] || '';
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col"
      onClick={() => navigate(`/doctors/${doctor.slug}`)} // ← переход по slug
    >
      {/* Изображение */}
      <div className="relative h-48 bg-gradient-to-br from-medical-gray-light to-secondary/30 flex-shrink-0">
        {avatar ? (
          
          <img
            src={avatar}
            alt={`${title.rendered} - ${specialization}`}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl text-primary/60">👨‍⚕️</div>
          </div>
        )}

        {category && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-white text-xs">
              {category}
            </Badge>
          </div>
        )}
      </div>

      {/* Заголовок */}
      <CardHeader className="p-4 pb-2 flex-grow-0">
        <div className="space-y-1">
          <h3 className="font-bold text-foreground line-clamp-1 text-base">
            {title.rendered}
          </h3>
          {specialization && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {specialization}
            </p>
          )}
        </div>
      </CardHeader>

      {/* Контент */}
      <CardContent className="p-4 pt-2 flex flex-col flex-grow min-h-0">

        {/* Experience */}
        <div className="space-y-2 flex-shrink-0">
          {experience && (
            <div className="flex items-start gap-2">
              <Calendar className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-grow">
                <p className="text-xs font-semibold text-foreground">
                  {language === "uk" ? "Досвід" : "Опыт"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {experience}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Кнопка — по slug */}
        <Button
          className="w-full mt-3 flex-shrink-0"
          size="sm"
          onClick={(e) => {
            e.stopPropagation(); // чтобы не сработал клик карточки
            navigate(`/doctors/${doctor.slug}`); // ← slug
          }}
        >
          {language === "uk" ? "Переглянути профіль" : "Посмотреть профиль"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
