import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BookingForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    specialist: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Запис оформлено!",
      description: "Ми зв'яжемося з вами найближчим часом для підтвердження.",
    });
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/30 to-background">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Запишіться на прийом
            </h2>
            <p className="text-lg text-muted-foreground">
              Оберіть зручний час та фахівця. Наші адміністратори зв'яжуться з вами 
              для підтвердження запису.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Гнучкий графік</h3>
                  <p className="text-sm text-muted-foreground">
                    Працюємо 7 днів на тиждень для вашої зручності
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Досвідчені фахівці</h3>
                  <p className="text-sm text-muted-foreground">
                    Команда професіоналів з багаторічним досвідом
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Без черг</h3>
                  <p className="text-sm text-muted-foreground">
                    Прийом точно за записом, без очікування
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Форма запису</CardTitle>
              <CardDescription>
                Заповніть форму і ми зв'яжемося з вами найближчим часом
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Ім'я *</Label>
                  <Input
                    id="name"
                    placeholder="Введіть ваше ім'я"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+38 (___) ___ __ __"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Дата</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Час</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialist">Виберіть фахівця</Label>
                  <Select value={formData.specialist} onValueChange={(value) => setFormData({ ...formData, specialist: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Оберіть лікаря" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gynecologist">Гінеколог</SelectItem>
                      <SelectItem value="dermatologist">Дерматолог</SelectItem>
                      <SelectItem value="cardiologist">Кардіолог</SelectItem>
                      <SelectItem value="pediatrician">Педіатр</SelectItem>
                      <SelectItem value="therapist">Терапевт</SelectItem>
                      <SelectItem value="cosmetologist">Косметолог</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Записатися
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
