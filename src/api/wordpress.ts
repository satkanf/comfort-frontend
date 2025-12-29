const WORDPRESS_BASE_URL = "https://comfort.satkan.site/wp-json";

interface WordpressPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  acf?: any;
  _embedded?: any;
  lang?: string;
}

interface WordpressCategory {
  id: number;
  name: string;
  slug: string;
  acf?: {
    show_in_form?: boolean;
    category_icon?: string;
    category_color?: string;
  };
}

interface WordpressPost {
  id: number;
  title: { rendered: string };
  slug: string;
  acf?: any;
  _embedded?: any;
}

interface WordpressDoctor extends WordpressPost {
  acf?: {
    doctor_info?: {
      doctor_specialization?: string;
      doctor_experience?: string;
    };
    doctor_info_ru?: { // For direct RU translation, if used
      doctor_specialization?: string;
      doctor_experience?: string;
    };
  };
}

interface WordpressService extends WordpressPost {
  acf?: {
    service_price?: string;
    service_duration?: string;
  };
}

// Helper to fetch data with error handling
async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status} for URL: ${url}`);
      // Try to parse error message if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (jsonError) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }
    }
    const data: T = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Error fetching from ${url}:`, error.message);
    return null;
  }
}

// --- Page Endpoints ---

// Fetch a single page (multilang custom endpoint or fallback to WP standard)
export async function fetchMultilangPage(slug: string, lang: string): Promise<WordpressPage | null> {
  let pageData: WordpressPage | null = null;
  const customUrl = `${WORDPRESS_BASE_URL}/multilang/v1/page/${slug}?lang=${lang}&embed=true`;
  const standardUrl = `${WORDPRESS_BASE_URL}/wp/v2/pages?slug=${slug}&lang=${lang}&_embed`;

  try {
    pageData = await fetchData<WordpressPage>(customUrl);
    if (pageData && (Array.isArray(pageData) && pageData.length > 0)) { // Handle array response from custom endpoint if it happens
      return Array.isArray(pageData) ? pageData[0] : pageData;
    }
    if (pageData) return pageData; // If custom endpoint worked and returned object
  } catch (e) {
    console.warn(`Custom multilang page endpoint failed for ${slug} (${lang}), trying standard WP endpoint.`, e);
  }

  // Fallback to standard WP pages endpoint
  if (!pageData) {
    const standardPageData = await fetchData<WordpressPage[]>(standardUrl);
    if (standardPageData && standardPageData.length > 0) {
      return standardPageData[0];
    }
  }

  return null;
}

// Fetch general contact data (from custom endpoint with fallback)
export async function fetchContactData(lang: string): Promise<WordpressPage | null> {
  const url = `${WORDPRESS_BASE_URL}/custom/v1/page/contacts?_embed&lang=${lang}`;
  // Fallback to hardcoded data if API fails
  const fallbackData: WordpressPage = {
    id: 1,
    title: { rendered: 'Контакти' },
    content: { rendered: '<p>Контактная информация</p>' },
    acf: {
      location: {
        location_address: 'Адреса',
        location_value: 'м. Ірпінь, вул. Західна 6'
      },
      phone: [{
        phone_number: '+38 (095) 422 00 32',
        phone_value: '+380954220032'
      }],
      email: {
        email_address: 'Email',
        email_value: 'info@comfort.clinic'
      },
      working_hours: {
        working_hours_name: 'Години роботи',
        working_hours_value: 'Пн-Пт: 9:00-18:00\nСб: 9:00-15:00\nНд: вихідний'
      },
      block_contacts: {
        block_contacts_title: 'Контактна інформація',
        block_contacts_subtitle: 'Знайдіть нас за адресою нижче або скористайтеся контактними даними для зв'язку'
      },
      social: []
    },
    _embedded: {}
  };

  const data = await fetchData<WordpressPage>(url);
  return data || fallbackData;
}

// Fetch dynamic translations from WordPress
export async function fetchTranslations(lang: string): Promise<Record<string, string> | null> {
  const url = `${WORDPRESS_BASE_URL}/custom/v1/translations/${lang}`;
  // Fallback to empty object if API fails, as static translations are used as primary fallback
  const data = await fetchData<Record<string, string>>(url);
  return data || {};
}


// --- Menu Endpoints ---
export async function fetchMenu(menuSlug: string): Promise<any | null> {
  const url = `${WORDPRESS_BASE_URL}/menus/v1/menus/${menuSlug}`;
  return fetchData<any>(url);
}


// --- Category Endpoints ---
export async function fetchDoctorCategories(lang: string): Promise<WordpressCategory[] | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/category-doctors?lang=${lang}`;
  return fetchData<WordpressCategory[]>(url);
}

export async function fetchServiceCategories(lang: string): Promise<WordpressCategory[] | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/services-caservices-catt?per_page=100&lang=${lang}`;
  return fetchData<WordpressCategory[]>(url);
}

export async function fetchServiceCategoryById(id: number, lang: string): Promise<WordpressCategory | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/services-caservices-catt/${id}?_fields=acf&lang=${lang}`;
  return fetchData<WordpressCategory>(url);
}

// --- Posts/Custom Post Types Endpoints ---
export async function fetchServices(ids: number[], lang: string): Promise<WordpressService[] | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/services?include=${ids.join(",")}&_embed&lang=${lang}`;
  return fetchData<WordpressService[]>(url);
}

export async function fetchAllServices(lang: string): Promise<WordpressService[] | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/services?per_page=100&_embed&lang=${lang}`;
  return fetchData<WordpressService[]>(url);
}

export async function fetchDoctors(ids: number[], lang: string): Promise<WordpressDoctor[] | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/doctors?include=${ids.join(",")}&_embed=1&lang=${lang}`;
  return fetchData<WordpressDoctor[]>(url);
}

export async function fetchAllDoctors(lang: string): Promise<WordpressDoctor[] | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/doctors?per_page=100&_embed=1&lang=${lang}`;
  return fetchData<WordpressDoctor[]>(url);
}

export async function fetchDoctorBySlug(slug: string, lang: string): Promise<WordpressDoctor | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/doctors?slug=${slug}&_embed=1&lang=${lang}`;
  const doctors = await fetchData<WordpressDoctor[]>(url);
  return doctors && doctors.length > 0 ? doctors[0] : null;
}

export async function fetchPrices(lang: string): Promise<any[] | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/price?per_page=100&lang=${lang}`;
  return fetchData<any[]>(url);
}

export async function fetchPriceById(id: number): Promise<any | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/price/${id}?acf_format=standard`;
  return fetchData<any>(url);
}

export async function fetchPromotions(lang: string): Promise<any[] | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/promotion?_embed&acf_format=standard&per_page=100&lang=${lang}`;
  return fetchData<any[]>(url);
}


// --- Form Endpoints ---
export async function submitBookingForm(formData: any): Promise<{ success: boolean; message?: string }> {
  const url = `${WORDPRESS_BASE_URL}/custom/v1/booking`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const json = await response.json();
    return json;
  } catch (error: any) {
    console.error("Error submitting booking form:", error.message);
    return { success: false, message: error.message };
  }
}

export async function submitCallbackForm(formData: any): Promise<{ success: boolean; message?: string }> {
  const url = `${WORDPRESS_BASE_URL}/custom/v1/callback`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const json = await response.json();
    return json;
  } catch (error: any) {
    console.error("Error submitting callback form:", error.message);
    return { success: false, message: error.message };
  }
}

// --- Media Endpoints ---
export async function fetchMediaById(id: number): Promise<any | null> {
  const url = `${WORDPRESS_BASE_URL}/wp/v2/media/${id}`;
  return fetchData<any>(url);
}
