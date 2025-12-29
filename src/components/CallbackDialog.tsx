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
import { useMultilangForms } from "@/hooks/useMultilangForms";

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
  const { formTranslations } = useMultilangForms();

  const translations = formTranslations || {
    error: 'Помилка',
    errorSend: 'Не вдалося відправити',
    sendOk: 'Заявка відправлена!',
    meCall: 'Ми зв\'яжемося з вами найближчим часом',
    call: 'Зателефонувати',
    callback: 'Замовити зворотний дзвінок',
    contactsLeave: 'Залиште свої контактні дані, і ми зв\'яжемося з вами найближчим часом',
    name: "Ім'я",
    enterName: "Введіть ваше ім'я",
    phone: 'Телефон',
    sendForm: 'Відправити заявку'
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim() || !phone.trim()) {
    toast({
      title: t('error'),
      description: t('error.send'),
      variant: "destructive",
    });
    return;
  }

  const res = await fetch("https://comfort.satkan.site/wp-json/custom/v1/callback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone })
  });

  if (!res.ok) {
    toast({
      title: t('error'),
      description: t('error.send'),
      variant: "destructive",
    });
    return;
  }

  toast({
    title: translations.sendOk,
    description: translations.meCall,
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
          {translations.call}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
             {translations.callback}
          </DialogTitle>
          <DialogDescription>
               {translations.contactsLeave}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="callback-name">
              {translations.name}
            </Label>
            <Input
              id="callback-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={translations.enterName}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="callback-phone">
               {translations.phone}
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
             {translations.sendForm}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackDialog;
