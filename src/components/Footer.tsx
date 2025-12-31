import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import FooterMenu from "./FooterMenu";
import { useMultilangNavigation } from "@/hooks/useMultilangNavigation";
import { useMultilangContacts } from "@/hooks/useMultilangContacts";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchImageUrls } from "@/utils/api";

const Footer = () => {
  const { navTranslations } = useMultilangNavigation();
  const { contactsData, loading: contactsLoading, error: contactsError } = useMultilangContacts();
  const [socialIcons, setSocialIcons] = useState<{[key: number]: string}>({});

  console.log('Footer: contactsData:', contactsData);
  console.log('Footer: acf exists:', !!contactsData?.acf);
  console.log('Footer: social data (acf):', contactsData?.acf?.social);
  console.log('Footer: social data (direct):', contactsData?.social);
  console.log('Footer: socialIcons state:', socialIcons);

  // Загружаем URL изображений социальных сетей
  useEffect(() => {
    const loadSocialIcons = async () => {
      console.log('Footer: Loading social icons...');

      // Проверяем оба возможных пути к данным
      const socialData = contactsData?.acf?.social || contactsData?.social;
      console.log('Footer: Using social data from:', socialData === contactsData?.acf?.social ? 'acf.social' : 'direct social');

      if (socialData && Array.isArray(socialData)) {
        console.log('Footer: Found social data:', socialData);
        const iconIds: (number | string)[] = [];
        socialData.forEach((social: any) => {
          if (social.social_icon) {
            console.log('Footer: Adding social icon ID:', social.social_icon);
            iconIds.push(social.social_icon);
          }
        });

        console.log('Footer: Icon IDs to load:', iconIds);

        if (iconIds.length > 0) {
          const iconUrls = await fetchImageUrls(iconIds);
          console.log('Footer: Loaded icon URLs:', iconUrls);
          const iconMap: {[key: number]: string} = {};
          socialData.forEach((social: any, index: number) => {
            if (social.social_icon && iconUrls[index]) {
              iconMap[social.social_icon] = iconUrls[index];
              console.log('Footer: Mapped icon', social.social_icon, 'to URL:', iconUrls[index]);
            }
          });
          console.log('Footer: Final icon map:', iconMap);
          setSocialIcons(iconMap);
        }
      } else {
        console.log('Footer: No social data found');
      }
    };

    if (contactsData) {
      loadSocialIcons();
    } else {
      console.log('Footer: No contactsData yet');
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
              {(contactsData?.acf?.social || contactsData?.social)?.map((item,index) => {
                console.log('Footer: Rendering social item:', item, 'icon URL:', socialIcons[item.social_icon]);
                return (
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
                          console.log('Footer: Image failed to load for', item.social_name);
                          e.currentTarget.style.display = 'none';
                          // Fallback to icon
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-primary text-sm">🔗</span>';
                        }}
                      />
                    ) : (
                      <span className="text-primary text-sm">🔗</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground text-xl">
              {translations?.navigation || 'Навігація'}
            </h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <FooterMenu />
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground text-xl">
              {translations?.services || 'Послуги'}
            </h3>
            <nav className="flex flex-col space-y-2 text-sm text-primary-foreground">
               <Link to="/" className="text-primary-foreground text-hover transition-colors">
                Гінекологія
              </Link>
              <Link to="/about" className="text-primary-foreground text-hover transition-colors">
                Дерматологія
              </Link>
              <Link to="/services" className="text-primary-foreground text-hover transition-colors">
                Кардіологія
              </Link>
              <Link to="/doctors" className="text-primary-foreground text-hover transition-colors">
                УЗД діагностика
              </Link>
              <Link to="/prices" className="text-primary-foreground text-hover transition-colors">
                Педіатрія
              </Link>
              <Link to="/contacts" className="text-primary-foreground text-hover transition-colors">
                Косметологія
              </Link>
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
