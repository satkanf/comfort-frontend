import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Calendar } from "lucide-react";

interface DoctorCardProps {
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

const DoctorCard = ({
  id,
  name,
  specialty,
  image,
  education,
  experience,
  rating,
  reviewCount,
  description,
}: DoctorCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => navigate(`/doctors/${id}`)}>
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-medical-gray-light to-secondary/30">
        <img
          src={image}
          alt={`${name} - ${specialty}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary text-white">{specialty}</Badge>
        </div>
      </div>
      <CardHeader className="space-y-3 pb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{specialty}</p>
        </div>
       
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Освіта</p>
              <p className="text-xs text-muted-foreground">{education}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Досвід</p>
              <p className="text-xs text-muted-foreground">{experience}</p>
            </div>
          </div>
        </div>

        <Button 
          className="w-full mt-4"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/doctors/${id}`);
          }}
        >
          Переглянути профіль
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
