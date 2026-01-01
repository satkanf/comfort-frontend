import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FooterMenuMain, FooterMenuSecondary } from "./FooterMenu";
import { useMultilangNavigation } from "@/hooks/useMultilangNavigation";
import { useMultilangContacts } from "@/hooks/useMultilangContacts";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchImageUrls } from "@/utils/api";

const Footer = () => {
  const { navTranslations } = useMultilangNavigation();
  const { contactsData, loading: contactsLoading, error: contactsError } = useMultilangContacts();
  const [socialIcons, setSocialIcons] = useState<{[key: number]: string}>({});


  // Загружаем URL изображений социальных сетей
  useEffect(() => {
    const loadSocialIcons = async () => {
      // Проверяем оба возможных пути к данным
      const socialData = contactsData?.acf?.social || contactsData?.social;

      if (socialData && Array.isArray(socialData)) {
        const iconIds: (number | string)[] = [];
        socialData.forEach((social: any) => {
          if (social.social_icon) {
            iconIds.push(social.social_icon);
          }
        });

        if (iconIds.length > 0) {
          const iconUrls = await fetchImageUrls(iconIds);
          const iconMap: {[key: number]: string} = {};
          socialData.forEach((social: any, index: number) => {
            if (social.social_icon && iconUrls[index]) {
              iconMap[social.social_icon] = iconUrls[index];
            }
          });
          setSocialIcons(iconMap);
        }
      }
    };

    if (contactsData) {
      loadSocialIcons();
    }
  }, [contactsData]);

  const translations = navTranslations || {
    footerTitle: 'Комфорт Медікал',
    footerDescription: 'Сучасна медицина та косметологія в центрі Ірпеня',
    services: 'Послуги',
    doctors: 'Лікарі',
    contacts: 'Контакти',
    address: 'Адреса',
    phone: 'Телефон',
    email: 'Email',
    workingHours: 'Години роботи',
    allRights: 'Всі права захищені',
    footerTagline: 'Сучасний медичний центр з командою висококваліфікованих фахівців.',
    navigation: 'Навігація'
  };


  // Footer рендерится всегда, даже если данные контактов не загружены

  return (
    <footer className="border-t main-color">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 logo">
                <img src={logo} alt="" />
              </Link>
            </div>
            <p className="text-sm text-primary-foreground">
              {translations.footerTagline}
            </p>
            <div className="flex gap-4">
              {(contactsData?.acf?.social || contactsData?.social)?.map((item,index) => (
                <a key={index}
                  href={item.social_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-social bg-secondary/20 text-primary hover:bg-secondary/40 hover:text-white transition-colors"
                >
                  {socialIcons[item.social_icon] ? (
                    <img
                      src={socialIcons[item.social_icon]}
                      alt={item.social_name}
                      className="h-4 w-4 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        // Fallback to icon
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-primary text-sm">🔗</span>';
                      }}
                    />
                  ) : (
                    <span className="text-primary text-sm">🔗</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground text-xl">
              {translations?.navigation || 'Навігація'}
            </h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <FooterMenuMain />
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground text-xl">
              {translations?.services || 'Послуги'}
            </h3>
            <nav className="flex flex-col space-y-2 text-sm text-primary-foreground">
              <FooterMenuSecondary />
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground text-xl">{translations?.footerTitle || 'Контакти'}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-primary-foreground">
                  {contactsData?.location?.location_value}
                </span>
              </div>
              {contactsData?.phone.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href={`tel:${item.phone_value}`} className="text-primary-foreground text-hover transition-colors">
                    {item.phone_number}
                  </a>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`mailto:${contactsData?.email?.email_value || 'info@comfort.clinic'}`} className="text-primary-foreground text-hover transition-colors">
                  {contactsData?.email?.email_value || 'info@comfort.clinic'}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-primary-foreground">
          <p>&copy; {new Date().getFullYear()} Comfort Clinic. Всі права захищено.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
