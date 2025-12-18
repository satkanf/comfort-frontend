import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


import logo from "../assets/logo.png";
import FooterMenu from "./FooterMenu";

const Footer = () => {
  const [contactsData, setContactsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


   useEffect(() => {
      const fetchContacts = async () => {
        try {
          const response = await fetch("https://comfort.satkan.site/wp-json/custom/v1/page/contacts?_embed");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setContactsData(data);
        } catch (err) {
          setError(err.message || "Ошибка при загрузке");
        } finally {
          setLoading(false);
        }
      };
  
      fetchContacts();
    }, []);
     if (loading) {
      return <div></div>;
    }

    if (error) {
      return <div>Ошибка: {error}</div>;
    }

    if (!contactsData) {
      return null;
    }

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
              {contactsData.acf?.social.map((item,index) =>(
                <a key={index}
                  href={item.social_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-social bg-secondary/20 text-primary hover:bg-secondary/40 hover:text-white transition-colors"
                >
                  <img src={item.social_icon} alt={item.social_name} className="h-4 w-4 text-primary" />
                </a>
              ))}
              
              
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-primary-foreground text-xl">Навігація</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <FooterMenu />
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
            <h3 className="font-semibold text-primary-foreground text-xl">{contactsData.title}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-primary-foreground">{contactsData.acf?.location?.location_value}</span>
              </div>
              {contactsData.acf?.phone.map((item, index) => (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href={`tel:${item.phone_value}`} className="text-primary-foreground text-hover transition-colors">
                    {item.phone_number}
                  </a>
              </div>
              ))}
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href={`mailto:${contactsData?.acf?.email?.email_value}`} className="text-primary-foreground text-hover transition-colors">
                  {contactsData.acf?.email?.email_value}
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
