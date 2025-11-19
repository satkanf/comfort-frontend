import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";


import logo from "../assets/logo.png";

const Footer = () => {
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
              Сучасний медичний центр з командою висококваліфікованих фахівців.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-social bg-secondary/20 text-primary hover:bg-secondary/40 hover:text-white transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-social bg-secondary/20 text-primary hover:bg-secondary/40 hover:text-white transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground text-xl">Навігація</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/" className="text-primary-foreground text-hover transition-colors">
                Головна
              </Link>
              <Link to="/about" className="text-primary-foreground text-hover transition-colors">
                Про нас
              </Link>
              <Link to="/services" className="text-primary-foreground text-hover transition-colors">
                Послуги
              </Link>
              <Link to="/doctors" className="text-primary-foreground text-hover transition-colors">
                Лікарі
              </Link>
              <Link to="/prices" className="text-primary-foreground text-hover transition-colors">
                Ціни
              </Link>
              <Link to="/contact" className="text-primary-foreground text-hover transition-colors">
                Контакти
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground text-xl">Послуги</h3>
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
              <Link to="/contact" className="text-primary-foreground text-hover transition-colors">
                Косметологія
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground text-xl">Контакти</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-primary-foreground">м. Ірпінь, вул. Західна 6 (вхід з вул. Джерельна)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="tel:+380954220032" className="text-primary-foreground text-hover transition-colors">
                  +38 (095) 422 00 32
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="tel:+380970970032" className="text-primary-foreground text-hover transition-colors">
                  +38 (097) 097 00 32
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:info@comfortclinic.com.ua" className="text-primary-foreground text-hover transition-colors">
                  info@comfortclinic.com.ua
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
