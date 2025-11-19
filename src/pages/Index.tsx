import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import Services from "@/components/Services";
import DoctorsSection from "@/components/DoctorsSection";
import BookingForm from "@/components/BookingForm";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import clinicInterior1 from "@/assets/clinic-interior-1.jpg";
import clinicInterior2 from "@/assets/clinic-interior-2.jpg";
import medicalTeam from "@/assets/medical-team.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        structuredData={{
          "@context": "https://schema.org",
          "@type": "MedicalClinic",
          "name": "Comfort Clinic",
          "description": "Сучасна клініка краси та здоров'я в Ірпені",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "вул. Західна 6",
            "addressLocality": "Ірпінь",
            "addressCountry": "UA"
          },
          "telephone": "+380954220032"
        }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        
        {/* Gallery Section */}
        <section className="py-12 bg-secondary/20">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6">
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
                  alt="Команда лікарів"
                  className="w-full h-64 object-cover"
                />
              </Card>
              <Card className="overflow-hidden">
                <img
                  src={clinicInterior2}
                  alt="Медичний кабінет"
                  className="w-full h-64 object-cover"
                />
              </Card>
            </div>
          </div>
        </section>

        <Services />
        <DoctorsSection />
        <BookingForm />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
