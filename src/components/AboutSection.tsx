import { useEffect, useState } from "react";
import { Heart, Award, Users, Clock } from "lucide-react";
import {useMultilangPage} from "@/hooks/useMultilangPage";
import { fetchImageUrls } from "@/utils/api";

const AboutSection = () => {
    const { pageData, loading, error } = useMultilangPage('golovna');
    const [advantageIcons, setAdvantageIcons] = useState<{[key: number]: string}>({});

    // Загружаем иконки преимуществ
    useEffect(() => {
        const loadAdvantageIcons = async () => {
            if (pageData?.acf?.about?.about_advantages && Array.isArray(pageData.acf.about.about_advantages)) {
                const iconIds: (number | string)[] = [];
                pageData.acf.about.about_advantages.forEach((advantage: any, index: number) => {
                    if (advantage.about_advantages_icon) {
                        iconIds.push(advantage.about_advantages_icon);
                    }
                });

                if (iconIds.length > 0) {
                    const iconUrls = await fetchImageUrls(iconIds);
                    const iconMap: {[key: number]: string} = {};
                    pageData.acf.about.about_advantages.forEach((advantage: any, index: number) => {
                        if (advantage.about_advantages_icon && iconUrls[index]) {
                            iconMap[advantage.about_advantages_icon] = iconUrls[index];
                        }
                    });
                    setAdvantageIcons(iconMap);
                }
            }
        };

        if (pageData) {
            loadAdvantageIcons();
        }
    }, [pageData]);

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
                  {advantageIcons[el.about_advantages_icon] ? (
                    <img
                      src={advantageIcons[el.about_advantages_icon]}
                      alt={el.about_advantages_title}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        // Fallback to icon
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"><span class="text-primary text-sm">★</span></div>';
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary text-sm">★</span>
                    </div>
                  )}
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
                      <div dangerouslySetInnerHTML={{ __html: el.about_content }} />
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
