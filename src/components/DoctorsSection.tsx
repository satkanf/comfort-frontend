import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";
import doctor4 from "@/assets/doctor-4.jpg";

const DoctorsSection = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const doctors = [
    {
      id: 1,
      name: "Олена Коваленко",
      specialty: language === 'uk' ? "Терапевт" : "Терапевт",
      image: doctor1,
      rating: 4.9,
    },
    {
      id: 2,
      name: "Дмитро Петренко",
      specialty: language === 'uk' ? "Кардіолог" : "Кардиолог",
      image: doctor2,
      rating: 4.8,
    },
    {
      id: 3,
      name: "Марія Сидоренко",
      specialty: language === 'uk' ? "Дерматолог" : "Дерматолог",
      image: doctor3,
      rating: 5.0,
    },
    {
      id: 4,
      name: "Андрій Іваненко",
      specialty: language === 'uk' ? "Хірург" : "Хирург",
      image: doctor4,
      rating: 4.9,
    },
  ];

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
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(`/doctors/${doctor.id}`)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{doctor.specialty}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{doctor.rating}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate("/doctors")}
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
