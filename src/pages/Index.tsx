import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import DoctorsSection from "@/components/DoctorsSection";
import BookingForm from "@/components/BookingForm";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { useMultilangPage } from "@/hooks/useMultilangPage";
import ServicesSection from "@/components/Services.tsx";


const Index = () => {
  // const [pageData, setpageData] = useState(null);
    const { pageData, loading, error } = useMultilangPage('golovna');
     // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchHome = async () => {
  //     try {
  //       const response = await fetch("https://comfort.satkan.site/wp-json/custom/v1/page/golovna?_embed&lang=${language}");
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const data = await response.json();
  //       setpageData(data);
  //     } catch (err) {
  //       setError(err.message || "Ошибка при загрузке");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchHome();
  // }, []);
    if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!pageData) {
    return null;
  }

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

         {pageData.acf?.add_block.map((el, index) => {
          switch (el.acf_fc_layout) {

            case "gallery":
              return (
                <section key={index} className="py-12 bg-secondary/20">
                  <div className="container">
                    <div className="grid md:grid-cols-3 gap-6">
                      {el.gallery_add?.map((img, i) => (
                        <Card key={i} className="overflow-hidden">
                          <img
                            src={img}
                            alt="Інтер'єр клініки"
                            className="w-full h-64 object-cover"
                          />
                        </Card>
                      ))}
                    </div>
                  </div>
                </section>
              );

            case "about_services":
              return (
                <section key={index}>
                  <ServicesSection />
                </section>
              );

            case "home_doctors":
              return <DoctorsSection key={index} />;

            default:
              return null;
          }
        })}
        <BookingForm />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
