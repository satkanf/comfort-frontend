import { Link } from "react-router-dom";
import ServicesMenu from "./ServicesMenu";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBaseUrl } from "@/utils/baseUrl";

export function FooterMenuMain() {
  const [menu, setMenu] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const baseUrl = getBaseUrl();
        const requestUrl = `${baseUrl}/wp-json/wp/v2/menus/footer-menu`;

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
        console.error('Error loading footer menu:', error);
      }
    };

    fetchMenu();
  }, [language]);

  return (
    <>
        {menu.map((item, index) => (
            <Link
              key={item.ID || `footer-menu-${index}`}
              to={item.url ? new URL(item.url).pathname : `/${item.slug || ''}`}
              className="text-primary-foreground text-hover transition-colors"
            >
              {item.title}
            </Link>
        ))}
    </>
  )
}

export function FooterMenuSecondary() {
  const [menuSec, setMenuSec] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const baseUrl = getBaseUrl();
        const requestUrl = `${baseUrl}/wp-json/wp/v2/menus/footer-menu-2`;

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
        console.error('Error loading footer secondary menu:', error);
      }
    };

    fetchMenu();
  }, [language]);

  return (
      <>
        {menuSec.map((item, index) => (
            <Link
                key={item.ID || `footer-menu-2-${index}`}
                to={item.url ? new URL(item.url).pathname : `/${item.slug || ''}`}
                className="text-primary-foreground text-hover transition-colors"
            >
              {item.title}
            </Link>
        ))}
      </>
  )
}