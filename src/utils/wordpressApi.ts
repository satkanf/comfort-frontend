// utils/wordpressApi.ts
const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://comfort.satkan.site';

export const fetchDoctorBySlug = async (slug: string, lang: string) => {
  try {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/doctors?slug=${slug}&lang=${lang}&_embed=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }
};

export const fetchDoctorTranslations = async (doctorId: number) => {
  try {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/polylang/v2/translations/${doctorId}?type=doctors`
    );
    
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching translations:', error);
    return null;
  }
};

export const fetchAllDoctors = async (lang: string) => {
  try {
    const response = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/doctors?lang=${lang}&per_page=100&_embed=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};