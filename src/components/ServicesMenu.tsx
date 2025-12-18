import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MenuTree from "./MenuTree";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ServicesMenu = () => {
  const { language } = useLanguage();
  const [menu, setMenu] = useState([]);

  const serviceCategories = [
    {
      title: language === 'uk' ? 'Медичні послуги' : 'Медицинские услуги',
      services: [
        { id: 'gynecology', name: language === 'uk' ? 'Гінекологія' : 'Гинекология' },
        { id: 'therapy', name: language === 'uk' ? 'Терапія' : 'Терапия' },
        { id: 'pediatrics', name: language === 'uk' ? 'Педіатрія' : 'Педиатрия' },
        { id: 'cardiology', name: language === 'uk' ? 'Кардіологія' : 'Кардиология' },
      ]
    },
    {
      title: language === 'uk' ? 'Діагностика' : 'Диагностика',
      services: [
        { id: 'ultrasound', name: language === 'uk' ? 'УЗД діагностика' : 'УЗИ диагностика' },
      ]
    },
    {
      title: language === 'uk' ? 'Естетична медицина' : 'Эстетическая медицина',
      services: [
        { id: 'cosmetology', name: language === 'uk' ? 'Косметологія' : 'Косметология' },
        { id: 'dermatology', name: language === 'uk' ? 'Дерматологія' : 'Дерматология' },
      ]
    },
    {
      title: language === 'uk' ? 'Спеціалізовані послуги' : 'Специализированные услуги',
      services: [
        { id: 'ophthalmology', name: language === 'uk' ? 'Офтальмологія' : 'Офтальмология' },
      ]
    }
  ];

  useEffect(() => {
    fetch("https://comfort.satkan.site/wp-json/menus/v1/menus/header-menu")
      .then(res => res.json())
      .then(data => setMenu(data.items || []));
  }, []);
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {menu
            .filter(item => item.classes?.includes("dropdown"))
            .map((item, index) => (
              <NavigationMenuTrigger key={index} className="text-hover">
                {item.title}
              </NavigationMenuTrigger>
            
          ))}
          <NavigationMenuContent>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-8">
                  {menu
                    .filter(item => item.classes?.includes("dropdown"))
                    .map((item, index) => (
                      <MenuTree key={index} items={item.child_items} />
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
                    {language === 'uk' ? 'Переглянути всі послуги' : 'Посмотреть все услуги'}
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
