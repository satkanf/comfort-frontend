import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getBaseUrl } from "@/utils/baseUrl";

interface ContactPhone {
  phone_number: string;
  phone_value: string;
}

interface ContactSocial {
  social_name: string;
  social_link: string;
  social_icon: string;
}

interface ContactLocation {
  location_address: string;
  location_value: string;
}

interface ContactEmail {
  email_address: string;
  email_value: string;
}

interface ContactWorkingHours {
  working_hours_name: string;
  working_hours_value: string;
}

interface ContactBlock {
  block_contacts_title: string;
  block_contacts_subtitle: string;
}

interface ContactsData {
  location: ContactLocation;
  phone: ContactPhone[];
  email: ContactEmail;
  social: ContactSocial[];
  working_hours: ContactWorkingHours;
  block_contacts: ContactBlock;
}

export const useMultilangContacts = () => {
  const { language } = useLanguage();
  const [contactsData, setContactsData] = useState<ContactsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactsData = async () => {
      try {
        setLoading(true);

        // Маппинг slugs для разных языков - обе версии используют slug 'contacts'
        const SLUG_MAPPING = {
          contacts: { uk: 'contacts', ru: 'contacts' }
        };

        const baseSlug = 'contacts';
        const baseUrl = getBaseUrl();
        const localizedSlug = SLUG_MAPPING[baseSlug]?.[language] || baseSlug;

        // Сначала получаем ID страницы по slug, затем запрашиваем страницу с ACF по ID
        const slugRequestUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=${localizedSlug}&lang=${language}&_fields=id`;

        const slugResponse = await fetch(slugRequestUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (!slugResponse.ok) {
            throw new Error(`Failed to get page ID: ${slugResponse.status}`);
        }

        const slugData = await slugResponse.json();

        if (!Array.isArray(slugData) || slugData.length === 0) {
            throw new Error('Page not found by slug');
        }

        const pageId = slugData[0].id;

        // Теперь запрашиваем страницу по ID с ACF данными
        const requestUrl = `${baseUrl}/wp-json/wp/v2/pages/${pageId}?_embed`;

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
        setContactsData(data.acf);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contacts data');
        setContactsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContactsData();
  }, [language]);

  return { contactsData, loading, error };
};


