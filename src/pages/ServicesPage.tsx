import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4">Наші послуги</h1>
              <p className="text-muted-foreground text-lg">
                Широкий спектр медичних послуг для вашого здоров'я та краси
              </p>
            </div>
          </div>
        </section>

        <Services />

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Готові записатися на прийом?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Наша команда фахівців готова надати вам кваліфіковану допомогу
            </p>
            <Button size="lg" onClick={() => navigate("/#booking")}>
              Записатися на консультацію
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
