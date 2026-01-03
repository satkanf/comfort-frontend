import { Link } from "react-router-dom";
import ServicesMenu from "./ServicesMenu";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBaseUrl } from "@/utils/baseUrl";
import { getStaticTranslation } from '@/translations/static';



export  function FooterMenuMain() {
  const [menu, setMenu] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const baseUrl = getBaseUrl();
        const menuSuffix = getStaticTranslation('menu.suffix', language as "uk" | "ru");
        const requestUrl = `${baseUrl}/wp-json/menus/v1/menus/footer-menu${menuSuffix}`;

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
          const fallbackUrl = `${baseUrl}/wp-json/menus/v1/menus/footer-menu`;
          const fallbackResponse = await fetch(fallbackUrl, {
            method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
          });

          if (!fallbackResponse.ok) {
            throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
          }

          const fallbackData = await fallbackResponse.json();
          setMenu(fallbackData.items || []);
          console.warn('Fallback menu loading successful for footer.');
        } catch (fallbackError) {
        }
      }
    };

    fetchMenu();
  }, [language]);
  return (
    <>
        {menu.map((item, index) => (
            <Link
              key={item.ID || `footer-menu-${index}`}
              to={new URL(item.url).pathname}
              className="text-primary-foreground text-hover transition-colors"
            >
              {item.title}
            </Link>
        ))}
    </>
    
  )
}

export  function FooterMenuSecondary() {
  const [menuSec, setMenuSec] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const baseUrl = getBaseUrl();
        const menuSuffix = getStaticTranslation('menu.suffix', language as "uk" | "ru");
        const requestUrl = `${baseUrl}/wp-json/menus/v1/menus/footer-menu-2${menuSuffix}`;

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
        setMenuSec(data.items || []);
      } catch (error) {
        // При ошибке пробуем загрузить меню без языкового суффикса
        try {
          const baseUrl = getBaseUrl();
          const fallbackUrl = `${baseUrl}/wp-json/menus/v1/menus/footer-menu`;
          const fallbackResponse = await fetch(fallbackUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          });

          if (!fallbackResponse.ok) {
            throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
          }

          const fallbackData = await fallbackResponse.json();
          setMenuSec(fallbackData.items || []);
          console.warn('Fallback menu loading successful for footer.');
        } catch (fallbackError) {
        }
      }
    };

    fetchMenu();
  }, [language]);
  return (
      <>
        {menuSec.map((item, index) => (
            <Link
                key={item.ID || `footer-menu-2-${index}`}
                to={new URL(item.url).pathname}
                className="text-primary-foreground text-hover transition-colors"
            >
              {item.title}
            </Link>
        ))}
      </>

  )
}