import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface BookingDialogProps {
  triggerText?: string;
  preselectedService?: string;
  preselectedDoctor?: string;
}

const BookingDialog = ({ triggerText, preselectedService, preselectedDoctor }: BookingDialogProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    specialty: preselectedService || "",
    doctor: preselectedDoctor || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'uk' ? "Запис оформлено!" : "Запись оформлена!",
      description: language === 'uk' 
        ? "Ми зв'яжемося з вами найближчим часом для підтвердження." 
        : "Мы свяжемся с вами в ближайшее время для подтверждения.",
    });
    setOpen(false);
    setFormData({
      name: "",
      phone: "",
      date: "",
      time: "",
      specialty: preselectedService || "",
      doctor: preselectedDoctor || "",
    });
  };

  const specialties = [
    { value: "therapist", label: language === 'uk' ? "Терапевт" : "Терапевт" },
    { value: "cardiologist", label: language === 'uk' ? "Кардіолог" : "Кардиолог" },
    { value: "dermatologist", label: language === 'uk' ? "Дерматолог" : "Дерматолог" },
    { value: "gynecologist", label: language === 'uk' ? "Гінеколог" : "Гинеколог" },
    { value: "pediatrician", label: language === 'uk' ? "Педіатр" : "Педиатр" },
    { value: "ophthalmologist", label: language === 'uk' ? "Офтальмолог" : "Офтальмолог" },
    { value: "cosmetologist", label: language === 'uk' ? "Косметолог" : "Косметолог" },
    { value: "ultrasound", label: language === 'uk' ? "УЗД спеціаліст" : "УЗИ специалист" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          {triggerText || (language === 'uk' ? "Записатися на прийом" : "Записаться на прием")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'uk' ? "Записатися на прийом" : "Записаться на прием"}
          </DialogTitle>
          <DialogDescription>
            {language === 'uk' 
              ? "Заповніть форму і ми зв'яжемося з вами найближчим часом" 
              : "Заполните форму и мы свяжемся с вами в ближайшее время"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{language === 'uk' ? "Ім'я" : "Имя"} *</Label>
            <Input
              id="name"
              placeholder={language === 'uk' ? "Введіть ваше ім'я" : "Введите ваше имя"}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{language === 'uk' ? "Телефон" : "Телефон"} *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+38 (___) ___ __ __"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">{language === 'uk' ? "Дата" : "Дата"} *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">{language === 'uk' ? "Час" : "Время"} *</Label>
              <Input
                id="time"
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty">{language === 'uk' ? "Спеціальність лікаря" : "Специальность врача"}</Label>
            <Select value={formData.specialty} onValueChange={(value) => setFormData({ ...formData, specialty: value })}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'uk' ? "Оберіть спеціальність" : "Выберите специальность"} />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {language === 'uk' ? "Записатися" : "Записаться"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
