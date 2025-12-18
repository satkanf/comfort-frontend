import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
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

interface Category {
  id: number;
  name: string;
  slug: string;
  acf?: {
    show_in_form?: boolean;
  };
}

const BookingForm = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    specialty: "",
    specialtyText: "",
  });

  // --- LOAD CATEGORIES ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const r = await fetch("https://comfort.satkan.site/wp-json/wp/v2/category-doctors");
        const data = await r.json();
        setCategories(data);
      } catch (err: any) {
        setCatError(err.message);
      } finally {
        setCatLoading(false);
      }
    };
    loadCategories();
  }, []);

  // --- LOAD HOME DATA ---
  const [homeData, setHomeData] = useState<any>(null);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const r = await fetch("https://comfort.satkan.site/wp-json/custom/v1/page/golovna?_embed");
        const data = await r.json();
        setHomeData(data);
      } catch (err: any) {
        setHomeError(err.message);
      } finally {
        setHomeLoading(false);
      }
    };
    loadHome();
  }, []);

  // --- GLOBAL LOADING STATE ---
  if (catLoading || homeLoading) return <div>Загрузка...</div>;
  if (catError) return <div>Ошибка: {catError}</div>;
  if (homeError) return <div>Ошибка: {homeError}</div>;

  // --- SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("https://comfort.satkan.site/wp-json/custom/v1/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        specialty: formData.specialtyText,
      }),
    });

    const json = await response.json();

    if (json.success) {
      toast({
        title: t('reception.ok'),
        description: t('me.call'),
      });
    } else {
      toast({ title: t('error') });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/30 to-background">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* LEFT CONTENT */}
          {homeData?.acf?.add_block?.map((el: any, i: number) =>
            el.acf_fc_layout === "home_form" ? (
              <div key={i} className="space-y-6">
                <h2 className="text-3xl font-bold sm:text-4xl">{el.home_form_title}</h2>
                <p className="text-lg text-muted-foreground">{el.home_form_desc}</p>

                <div className="space-y-4">
                  {el.home_form_add_field?.map((it: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <img src={it.home_form_field_icon} className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{it.home_form_field_name}</h3>
                        <p className="text-sm text-muted-foreground">{it.home_form_field_desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}

          {/* RIGHT: FORM */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t('form.title')}</CardTitle>
              <CardDescription>{t('form.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* NAME */}
                <div className="space-y-2">
                  <Label> {t('name')} *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* PHONE */}
                <div className="space-y-2">
                  <Label> {t('phone')} *</Label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* DATE / TIME */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>

                {/* SPECIALTY */}
                <div className="space-y-2">
                  <Label>{t('choose.specialist')}</Label>

                  <Select
                    value={formData.specialty}
                    onValueChange={(slug) => {
                      const selected = categories.find((c) => c.slug === slug);
                      setFormData({
                        ...formData,
                        specialty: slug,
                        specialtyText: selected?.name || "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('specialty.doctor')} />
                    </SelectTrigger>

                    <SelectContent>
                      {categories
                        .filter((c) => c.acf?.show_in_form)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.slug}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {t('receprion')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;