import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Category {
  id: number;
  name: string;
  slug: string;
  acf?: {
    show_in_form?:boolean;
  }
  specialtyText: string;
}

const BookingDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    specialty:"",
    specialtyText: ""
    
  });
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://comfort.satkan.site/wp-json/wp/v2/category-doctors");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message || "Ошибка при загрузке");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
    if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!categories) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("https://comfort.satkan.site/wp-json/custom/v1/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      ...formData,
      specialty: formData.specialtyText, // отправляем текст
    }),
    });

    const json = await response.json();
    
    if (json.success) toast({
      title: t('callback'),
      description: t('callback'),
    });
    else toast({title: "Помилка"})
    setOpen(false);
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          {t('doctors.appointment')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t('doctors.appointment')}
          </DialogTitle>
          <DialogDescription>
              {t('fill.form')}
          </DialogDescription>
          
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}*</Label>
            <Input
              id="name"
              placeholder={t('enter.name')}
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('phone')}*</Label>
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
              <Label htmlFor="date">{t('date')} *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">{t('time')} *</Label>
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
            <Label htmlFor="specialty">{t('specialty.doctor')}</Label>
            <Select value={formData.specialty} // здесь хранится slug
              onValueChange={(value) => {
                // найти объект категории по slug
                const selected = categories.find((c) => c.slug === value);
                // сохранить и slug, и текст
                setFormData({
                  ...formData,
                  specialty: value,          // slug для value
                  specialtyText: selected?.name || "", // текст для письма
                });
              }}>
              <SelectTrigger>
                <SelectValue placeholder={t('choose.specialist')} />
              </SelectTrigger>
              <SelectContent>
                {categories
                   .filter((specialty) => specialty.acf?.show_in_form === true) // только «Так»
                  .map((specialty) => (
                    <SelectItem key={specialty.id} value={specialty.slug}>
                      {specialty.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {t('receprion')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
    
  );
};

export default BookingDialog;
