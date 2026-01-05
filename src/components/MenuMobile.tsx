import { Link } from "react-router-dom";
import ServicesMenu from "./ServicesMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { getBaseUrl } from "@/utils/baseUrl";
import { ChevronDown, ChevronUp } from "lucide-react";
import MenuTree from "@/components/MenuTree.tsx";

export default function MenuMobile() {
    const { language } = useLanguage();
    const [menuSection, setMenuSection] = useState([]);
    const [servicesExpanded, setServicesExpanded] = useState(false);

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

                    if (!fallbackResponse.ok) {
                        throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
                    }

                    const data = await response.json();
                    setMenuSection(data.items || []);
                } catch (fallbackError) {
                    console.error('Error loading menu:', fallbackError);
                }
            }
        };

        fetchMenuSection();
    }, [language]);

    const toggleServices = () => {
        setServicesExpanded(!servicesExpanded);
    };

    return (
        <div className="flex flex-col space-y-6 flex-1">
            {menuSection.map((item, index) => (
                item.classes.includes("dropdown") ? (
                    <div key={`services-menu-${item.ID || index}`}>
                        <div className="flex items-center justify-between w-full text-left text-foreground hover:text-primary transition-colors py-4 text-lg font-medium">
                            <Link to="/services" className="flex-1">{item.title}</Link>
                            {servicesExpanded ? (
                                <button className="p-2" onClick={toggleServices}>
                                    <ChevronUp className="h-5 w-5"/>
                                </button>
                            ) : (
                                <button className="p-2" onClick={toggleServices}>
                                    <ChevronDown className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                        {servicesExpanded && (
                            <div className="ml-6 space-y-3 mt-4 border-l border-border pl-4">
                                <MenuTree items={item.child_items} level={1} />
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        key={item.ID || index}
                        to={new URL(item.url).pathname}
                        className="text-foreground hover:text-primary transition-colors py-4 block text-lg font-medium"
                    >
                        {item.title}
                    </Link>
                )
            ))}
        </div>
    );
}
