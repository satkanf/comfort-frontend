import { Link } from "react-router-dom";
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

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-hover">
            {language === 'uk' ? 'Послуги' : 'Услуги'}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-8">
                {serviceCategories.map((category) => (
                  <div key={category.title} className="space-y-4">
                    <Link 
                      to="/services" 
                      className="block font-bold text-base text-primary transition-colors"
                    >
                      {category.title}
                    </Link>
                    <ul className="space-y-2">
                      {category.services.map((service) => (
                        <li key={service.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/services/${service.id}`}
                              className={cn(
                                "block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              )}
                            >
                              {service.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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
