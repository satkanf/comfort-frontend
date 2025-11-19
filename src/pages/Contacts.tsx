import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contacts = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Повідомлення відправлено!",
      description: "Ми зв'яжемося з вами найближчим часом.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4">Контакти</h1>
              <p className="text-muted-foreground text-lg">
                Зв'яжіться з нами зручним для вас способом
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Напишіть нам</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Ім'я *
                    </label>
                    <Input id="name" required placeholder="Ваше ім'я" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Телефон *
                    </label>
                    <Input id="phone" type="tel" required placeholder="+38 (___) ___-__-__" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="your@email.com" />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Повідомлення *
                    </label>
                    <Textarea
                      id="message"
                      required
                      placeholder="Опишіть ваше питання або проблему"
                      rows={5}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Відправити
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
