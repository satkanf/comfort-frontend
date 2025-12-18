import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Heart, Star } from "lucide-react";
import clinicInterior1 from "@/assets/clinic-interior-1.jpg";
import clinicInterior2 from "@/assets/clinic-interior-2.jpg";
import medicalTeam from "@/assets/medical-team.jpg";
import heroMedical from "@/assets/hero-medical.jpg";

// const achievements = [
//   {
//     icon: Award,
//     title: "15 років досвіду",
//     description: "З 2009 року ми надаємо якісні медичні послуги",
//   },
//   {
//     icon: Users,
//     title: "50+ фахівців",
//     description: "Команда досвідчених лікарів різних спеціальностей",
//   },
//   {
//     icon: Heart,
//     title: "10 000+ пацієнтів",
//     description: "Довіра тисяч задоволених клієнтів",
//   },
//   {
//     icon: Star,
//     title: "Рейтинг 4.9",
//     description: "Високі оцінки та позитивні відгуки",
//   },
// ];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={heroMedical} 
              alt="Про Comfort Clinic" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/50" />
          </div>
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Про Comfort Clinic
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Ваше здоров'я — наш пріоритет. 15 років турботи про ваше благополуччя
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((item) => (
                <Card key={item.title} className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-8 pb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <AboutSection />

        {/* Image Gallery */}
        <section className="py-12 bg-background">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="overflow-hidden">
                <img
                  src={clinicInterior1}
                  alt="Інтер'єр клініки"
                  className="w-full h-64 object-cover"
                />
              </Card>
              <Card className="overflow-hidden">
                <img
                  src={medicalTeam}
                  alt="Наша команда"
                  className="w-full h-64 object-cover"
                />
              </Card>
              <Card className="overflow-hidden">
                <img
                  src={clinicInterior2}
                  alt="Медичне обладнання"
                  className="w-full h-64 object-cover"
                />
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Наша історія</h2>
              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg">
                  Comfort Clinic була заснована в 2009 році з метою надання якісних медичних послуг, які поєднують традиційні методи лікування з інноваційними технологіями. З самого початку наша місія полягала в тому, щоб зробити медичну допомогу доступною та комфортною для кожного.
                </p>
                <p className="text-lg">
                  За роки роботи ми розширили спектр наших послуг, залучили висококваліфікованих фахівців та обладнали клініку сучасним медичним обладнанням. Сьогодні Comfort Clinic — це сучасний медичний центр, який користується довірою тисяч пацієнтів.
                </p>
                <p className="text-lg">
                  Ми постійно вдосконалюємося, відвідуємо міжнародні конференції, проходимо навчання та впроваджуємо найкращі світові практики. Наша команда завжди готова надати вам професійну консультацію та ефективне лікування.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
