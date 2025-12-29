import { useEffect, useState } from "react";
import { Heart, Award, Users, Clock } from "lucide-react";
import {useMultilangPage} from "@/hooks/useMultilangPage";

const AboutSection = () => {
    const { pageData, loading, error } = useMultilangPage('golovna');

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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">{pageData.acf?.about.about_title}</h2>
          <p className="text-muted-foreground text-lg">
            {pageData.acf?.about.about_title_desc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">

           {pageData.acf?.about.about_advantages.map((el, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  {/* <Heart className="w-8 h-8 text-primary" /> */}
                  <img src={el.about_advantages_icon} alt={el.about_advantages_title} className="w-8 h-8 text-primary" />

                </div>
                <h3 className="text-xl font-semibold mb-2"> {el.about_advantages_title}</h3>
                <p className="text-muted-foreground"> {el.about_advantages_desc}</p>
              </div>
           ))}
          

          
        </div>

        <div className="bg-card rounded-lg p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {pageData.acf?.about.about_desc.map((el, index) => {
              switch (el.acf_fc_layout) {
                case "about_text":
                  return (
                    <div key={index}>
                      <div dangerouslySetInnerHTML={{ __html: el[""] }} />
                    </div>
                  );
                default:
                  return null;
              }}

            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
