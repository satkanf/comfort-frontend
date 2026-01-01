import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";

const Contacts = () => {
  const { toast } = useToast();
  const { language } = useTranslations();

  const getTranslations = () => {
    const defaultTranslations = {
      messageSent: {
        uk: 'Повідомлення відправлено!',
        ru: 'Сообщение отправлено!'
      },
      weWillReachOut: {
        uk: "Ми зв'яжемося з вами найближчим часом.",
        ru: 'Мы свяжемся с вами в ближайшее время.'
      },
      title: {
        uk: 'Контакти',
        ru: 'Контакты'
      },
      subtitle: {
        uk: 'Зв\'яжіться з нами будь-яким зручним способом',
        ru: 'Свяжитесь с нами любым удобным способом'
      },
      contactInfo: {
        uk: 'Контактна інформація',
        ru: 'Контактная информация'
      },
      workingHours: {
        uk: 'Години роботи',
        ru: 'Часы работы'
      },
      workingHoursText: {
        uk: 'Пн-Пт: 9:00-18:00<br />Сб: 9:00-15:00<br />Нд: вихідний',
        ru: 'Пн-Пт: 9:00-18:00<br />Сб: 9:00-15:00<br />Вс: выходной'
      },
      contactForm: {
        uk: 'Контактна форма',
        ru: 'Контактная форма'
      },
      name: {
        uk: "Ім'я *",
        ru: 'Имя *'
      },
      namePlaceholder: {
        uk: "Введіть ваше ім'я",
        ru: 'Введите ваше имя'
      },
      phone: {
        uk: 'Телефон *',
        ru: 'Телефон *'
      },
      phonePlaceholder: {
        uk: '+38 (___) ___-__-__',
        ru: '+38 (___) ___-__-__'
      },
      message: {
        uk: 'Повідомлення',
        ru: 'Сообщение'
      },
      messagePlaceholder: {
        uk: 'Введіть ваше повідомлення',
        ru: 'Введите ваше сообщение'
      },
      sendMessage: {
        uk: 'Відправити повідомлення',
        ru: 'Отправить сообщение'
      },
      messageLabel: {
        uk: 'Повідомлення *',
        ru: 'Сообщение *'
      },
      email: {
        uk: 'Email',
        ru: 'Email'
      },
      emailPlaceholder: {
        uk: 'your@email.com',
        ru: 'your@email.com'
      }
    };

    return {
      messageSent: defaultTranslations.messageSent[language as "uk" | "ru"],
      weWillReachOut: defaultTranslations.weWillReachOut[language as "uk" | "ru"],
      title: defaultTranslations.title[language as "uk" | "ru"],
      subtitle: defaultTranslations.subtitle[language as "uk" | "ru"],
      contactInfo: defaultTranslations.contactInfo[language as "uk" | "ru"],
      workingHours: defaultTranslations.workingHours[language as "uk" | "ru"],
      workingHoursText: defaultTranslations.workingHoursText[language as "uk" | "ru"],
      contactForm: defaultTranslations.contactForm[language as "uk" | "ru"],
      name: defaultTranslations.name[language as "uk" | "ru"],
      namePlaceholder: defaultTranslations.namePlaceholder[language as "uk" | "ru"],
      phone: defaultTranslations.phone[language as "uk" | "ru"],
      phonePlaceholder: defaultTranslations.phonePlaceholder[language as "uk" | "ru"],
      message: defaultTranslations.message[language as "uk" | "ru"],
      messagePlaceholder: defaultTranslations.messagePlaceholder[language as "uk" | "ru"],
      sendMessage: defaultTranslations.sendMessage[language as "uk" | "ru"],
      messageLabel: defaultTranslations.messageLabel[language as "uk" | "ru"],
      email: defaultTranslations.email[language as "uk" | "ru"],
      emailPlaceholder: defaultTranslations.emailPlaceholder[language as "uk" | "ru"]
    };
  };

  const translations = getTranslations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: translations.messageSent,
      description: translations.weWillReachOut,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header postId="" />
      <main className="flex-1">
        <section className="pt-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4">
                {translations.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {translations.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className=" bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">
                  {translations.contactForm}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      {translations.name}
                    </label>
                    <Input
                      id="name"
                      required
                      placeholder={translations.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      {translations.phone}
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+38 (___) ___-__-__"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      {translations.email}
                    </label>
                    <Input id="email" type="email" placeholder={translations.emailPlaceholder} />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      {translations.messageLabel}
                    </label>
                    <Textarea
                      id="message"
                      required
                      placeholder={translations.messagePlaceholder}
                      rows={5}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    {translations.sendMessage}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
