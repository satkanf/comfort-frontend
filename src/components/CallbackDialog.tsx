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
 const { t, language } = useLanguage();

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
    title: t('send.ok'),
    description: t('me.call'),
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
          {t('call')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
             {t('callback')}
          </DialogTitle>
          <DialogDescription>
               {t('contacts.leave')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="callback-name">
              {t('name')}
            </Label>
            <Input
              id="callback-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enter.name')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="callback-phone">
               {t('phone')}
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
             {t('send.form')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackDialog;
