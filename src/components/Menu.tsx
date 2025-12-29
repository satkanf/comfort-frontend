import { Link } from "react-router-dom";
import ServicesMenu from "./ServicesMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import {useEffect, useState} from "react";
import { getBaseUrl } from "@/utils/baseUrl";


export default function MenuSection() {
    const { language } = useLanguage();
    const [menuSection, setMenuSection] = useState([]);


    useEffect(() => {
        const fetchMenuSection = async () => {
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
                setMenuSection(data.items || []);
            } catch (error) {
                // При ошибке пробуем загрузить меню без языкового суффикса
                try {
                    const baseUrl = getBaseUrl();
                    const fallbackUrl = `${baseUrl}/wp-json/menus/v1/menus/header-menu`;

                    const response = await fetch(fallbackUrl, {
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
                    setMenuSection(data.items || []);
                } catch (fallbackError) {
                }
            }
        };

        fetchMenuSection();
    }, [language]);
    return (
        <>
            {menuSection.map((item, index) => (
                item.classes.includes("dropdown") ? (
                    <ServicesMenu key={`services-menu-${item.ID || index}`} />
                ) : (
                    <Link
                        key={item.ID || index}
                        to={new URL(item.url).pathname}
                        className="text-primary-foreground text-hover transition-colors duration-200"
                    >
                        {item.title}
                    </Link>
                )
            ))}
        </>
    );
}