import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import ServicesMenu from "./ServicesMenu";
import BookingDialog from "./BookingDialog";
import CallbackDialog from "./CallbackDialog";
import MenuSection from "./Menu.tsx"
import logo from "../assets/logo.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBaseUrl } from "@/utils/baseUrl";

interface HeaderProps {
  postId: string;
}

const Header = ({ postId }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const { language, t } = useLanguage();





  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Используем WordPress API для получения таксономий
        const baseUrl = getBaseUrl();
        const requestUrl = `${baseUrl}/wp-json/wp/v2/services-caservices-catt?per_page=10`;

        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setServices(data);
      } catch (error) {
      }
    };

    fetchServices();
  }, []);
 

  return (
    <header className="sticky top-0 z-50 w-full border-b main-color">
      {/* Top bar */}
      <div className="border-b bg-secondary/90">
        <div className="container flex h-12 items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+380954220032" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">+38 (095) 422 00 32</span>
            </a>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>м. Ірпінь, вул. Західна 6</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="hidden sm:flex fl-center gap-2">
              <CallbackDialog variant="outline" size="sm" />
              <BookingDialog />
            </div>
          </div>
        </div>
      </div>
      

      {/* Main navigation */}
      <div className="container relative flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 logo">
          <img src={logo} alt="" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-base font-medium">
          <MenuSection />
        </nav>


        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col space-y-4 py-4">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              {translations.navHome}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              {translations.navAbout}
            </Link>
            <div className="space-y-2">
              <div className="text-foreground font-medium">{translations.navServices}</div>
              <div className="pl-4 space-y-2">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    to={`/services/${service.id}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                ))}
                <Link
                  to="/services"
                  className="block text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {translations.navAllServices}
                </Link>
              </div>
            </div>
            <Link to="/doctors" className="text-foreground hover:text-primary transition-colors">
              {translations.navDoctors}
            </Link>
            <Link to="/prices" className="text-foreground hover:text-primary transition-colors">
              {translations.navPrices}
            </Link>
            <Link to="/promotion" className="text-foreground hover:text-primary transition-colors">
              {translations.navPromotions}
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              {translations.navBlog}
            </Link>
            <Link to="/contacts" className="text-foreground hover:text-primary transition-colors">
              {translations.navContacts}
            </Link>
            <div className="flex flex-col gap-3 mt-4">
              <CallbackDialog className="w-full" />
              <BookingDialog />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
