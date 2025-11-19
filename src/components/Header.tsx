import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import ServicesMenu from "./ServicesMenu";
import BookingDialog from "./BookingDialog";
import CallbackDialog from "./CallbackDialog";
import { useLanguage } from "@/contexts/LanguageContext";

import logo from "../assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  const services = [
    { id: 'gynecology', name: language === 'uk' ? 'Гінекологія' : 'Гинекология' },
    { id: 'dermatology', name: language === 'uk' ? 'Дерматологія' : 'Дерматология' },
    { id: 'cardiology', name: language === 'uk' ? 'Кардіологія' : 'Кардиология' },
    { id: 'ultrasound', name: language === 'uk' ? 'УЗД діагностика' : 'УЗИ диагностика' },
    { id: 'pediatrics', name: language === 'uk' ? 'Педіатрія' : 'Педиатрия' },
    { id: 'therapy', name: language === 'uk' ? 'Терапія' : 'Терапия' },
    { id: 'cosmetology', name: language === 'uk' ? 'Косметологія' : 'Косметология' },
    { id: 'ophthalmology', name: language === 'uk' ? 'Офтальмологія' : 'Офтальмология' },
  ];

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
          <Link to="/" className="text-primary-foreground text-hover transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/about" className="text-primary-foreground text-hover  transition-colors">
            {t('nav.about')}
          </Link>
          <ServicesMenu />
          <Link to="/doctors" className="text-primary-foreground text-hover  transition-colors">
            {t('nav.doctors')}
          </Link>
          <Link to="/prices" className="text-primary-foreground text-hover  transition-colors">
            {t('nav.prices')}
          </Link>
          <Link to="/promotions" className="text-primary-foreground text-hover transition-colors">
            {t('nav.promotions')}
          </Link>
          <Link to="/contacts" className="text-primary-foreground text-hover  transition-colors">
            {t('nav.contacts')}
          </Link>
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
              {t('nav.home')}
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <div className="space-y-2">
              <div className="text-foreground font-medium">{t('nav.services')}</div>
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
                  {language === 'uk' ? 'Всі послуги' : 'Все услуги'}
                </Link>
              </div>
            </div>
            <Link to="/doctors" className="text-foreground hover:text-primary transition-colors">
              {t('nav.doctors')}
            </Link>
            <Link to="/prices" className="text-foreground hover:text-primary transition-colors">
              {t('nav.prices')}
            </Link>
            <Link to="/promotions" className="text-foreground hover:text-primary transition-colors">
              {t('nav.promotions')}
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              {t('nav.blog')}
            </Link>
            <Link to="/contacts" className="text-foreground hover:text-primary transition-colors">
              {t('nav.contacts')}
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
