import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuTree from "./MenuTree";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { getBaseUrl } from "@/utils/baseUrl";


const ServicesMenu = () => {
  const { language } = useLanguage();
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();

  const getTranslations = () => {
    const defaultTranslations = {
      allServices: {
        uk: 'Переглянути всі послуги',
        ru: 'Посмотреть все услуги'
      }
    };

    return {
      allServices: defaultTranslations.allServices[language as "uk" | "ru"]
    };
  };

  const translations = getTranslations();

  // serviceCategories пока не используются, оставляем на будущее или для возможной доработки

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const baseUrl = getBaseUrl();
        const menuSuffix = language === 'ru' ? '-ru' : '';
        const requestUrl = `${baseUrl}/wp-json/menus/v1/menus/header-menu${menuSuffix}`;

        const response = await fetch(requestUrl, {
          method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setMenu(data.items || []);
      } catch (error) {
        // При ошибке пробуем загрузить меню без языкового суффикса
        try {
          const baseUrl = getBaseUrl();
          const fallbackUrl = `${baseUrl}/wp-json/menus/v1/menus/header-menu`;

          const response = await fetch(fallbackUrl, {
              method: 'GET',
                headers: {
                  'Accept': 'application/json',
                }
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setMenu(data.items || []);
        } catch (fallbackError) {
          console.error('Fallback menu loading failed:', fallbackError);
        }
      }
    };

    fetchMenu();
  }, [language]);
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {menu
            .filter(item => item.classes?.includes("dropdown"))
            .map((item, index) => (
              <NavigationMenuTrigger key={item.ID || `dropdown-${index}`} className="text-hover"
                                     onClick={(e) => {
                                       e.stopPropagation(); // чтобы не сработал клик карточки
                                       navigate(`/services`); // ← slug
                                     }}>
                {item.title}
              </NavigationMenuTrigger>

          ))}
          <NavigationMenuContent>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-8">
                  {menu
                    .filter(item => item.classes?.includes("dropdown"))
                    .map((item, index) => (
                      <MenuTree key={item.ID || `tree-${index}`} items={item.child_items} />
                    ))
                  }
              </div>
              <div className="border-t mt-6 pt-4">
                <NavigationMenuLink asChild>
                  <Link
                    to="/services"
                    className={cn(
                      "block select-none rounded-md p-3 text-center font-semibold leading-none no-underline outline-none transition-colors hover:bg-primary hover:text-primary-foreground"
                    )}
                  >
                    {translations.allServices}
                  </Link>
                </NavigationMenuLink>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default ServicesMenu;
