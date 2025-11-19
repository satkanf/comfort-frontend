import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface CallbackDialogProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const CallbackDialog = ({ variant = "outline", size = "default", className }: CallbackDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !phone.trim()) {
      toast({
        title: language === 'uk' ? "Помилка" : "Ошибка",
        description: language === 'uk' ? "Будь ласка, заповніть всі поля" : "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: language === 'uk' ? "Заявка відправлена!" : "Заявка отправлена!",
      description: language === 'uk' 
        ? "Ми зв'яжемося з вами найближчим часом" 
        : "Мы свяжемся с вами в ближайшее время",
    });
    
    setName("");
    setPhone("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Phone className="h-4 w-4" />
          {language === 'uk' ? 'Зателефонувати' : 'Позвонить'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'uk' ? 'Замовити зворотний дзвінок' : 'Заказать обратный звонок'}
          </DialogTitle>
          <DialogDescription>
            {language === 'uk' 
              ? 'Залиште свої контактні дані, і ми зв\'яжемося з вами найближчим часом' 
              : 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="callback-name">
              {language === 'uk' ? "Ім'я" : 'Имя'}
            </Label>
            <Input
              id="callback-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={language === 'uk' ? "Введіть ваше ім'я" : 'Введите ваше имя'}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="callback-phone">
              {language === 'uk' ? 'Телефон' : 'Телефон'}
            </Label>
            <Input
              id="callback-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+38 (0__) ___ __ __"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            {language === 'uk' ? 'Відправити заявку' : 'Отправить заявку'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackDialog;
