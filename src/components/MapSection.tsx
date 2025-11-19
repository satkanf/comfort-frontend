import { MapPin, Phone, Clock, Mail } from "lucide-react";

const MapSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Як нас знайти</h2>
          <p className="text-muted-foreground text-lg">
            Ми знаходимось в центрі міста і завжди раді вас бачити
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.5638074897594!2d30.523424776867657!3d50.45035797158518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce56b2456d45%3A0xa1c442c7235eb18e!2z0KXRgNC10YnQsNGC0LjQuiwg0JrQuNGX0LIsIDAyMDAw!5e0!3m2!1suk!2sua!4v1710000000000!5m2!1suk!2sua"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Comfort Clinic Location"
            ></iframe>
          </div>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Адреса</h3>
                  <p className="text-muted-foreground">
                    м. Київ, вул. Хрещатик, 36
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Телефон</h3>
                  <a href="tel:+380442345678" className="text-muted-foreground hover:text-primary transition-colors">
                    +38 (044) 234-56-78
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <a href="mailto:info@comfortclinic.com.ua" className="text-muted-foreground hover:text-primary transition-colors">
                    info@comfortclinic.com.ua
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Години роботи</h3>
                  <div className="text-muted-foreground space-y-1">
                    <p>Понеділок - П'ятниця: 8:00 - 20:00</p>
                    <p>Субота: 9:00 - 18:00</p>
                    <p>Неділя: 10:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
