import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useMultilangContacts } from "@/hooks/useMultilangContacts";

const MapSection = () => {
  const { contactsData, loading, error } = useMultilangContacts();

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (error || !contactsData) {
    return null;
  }

const location = contactsData?.location;
const email = contactsData?.email;
const workingHours = contactsData?.working_hours;
const titleBlock = contactsData?.block_contacts;
const social = contactsData?.social;


  return (

    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
  
          <div className="text-center mb-12"  >
          <h2 className="text-4xl font-bold text-foreground mb-4">{titleBlock?.block_contacts_title}</h2>
          <p className="text-muted-foreground text-lg">
          {titleBlock?.block_contacts_subtitle}
          </p>
        </div>
        
        
          <div className="grid lg:grid-cols-2 gap-8" >
            <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.5638074897594!2d30.523424776867657!3d50.45035797158518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce56b2456d45%3A0xa1c442c7235eb18e!2z0KXRgNC10YnQsNGC0LjQuiwg0JrQuNGX0LIsIDAyMDAw!5e0!3m2!1suk!2sua!4v1710000000000!5m2!1suk!2sua"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Розташування клініки Comfort"
              ></iframe>
            </div>

            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{location?.location_address}</h3>
                      <p className="text-muted-foreground">
                        {location?.location_value}
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
                    {contactsData?.phone?.map((item,index) => (
                      <a key={index} href={`tel:${item.phone_value}`} style={{ display: 'block' }} className="text-muted-foreground hover:text-primary transition-colors">
                        {item.phone_number}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{email?.email_address}</h3>
                    <a href={`mailto:${email?.email_value}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {email?.email_value}
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
                    <h3 className="font-semibold text-lg mb-2">{workingHours?.working_hours_name}</h3>
                    <div className="text-muted-foreground space-y-1">
                      {workingHours?.working_hours_value &&
                        workingHours.working_hours_value
                          .split('\n')
                          .map((line, i) => (
                            <p key={i}>{line}</p>
                          ))
                      }
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
