import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  type?: string;
  structuredData?: object;
}

const SEO = ({
  title,
  description,
  keywords,
  ogImage = "https://lovable.dev/opengraph-image-p98pqg.png",
  canonical,
  type = "website",
  structuredData,
}: SEOProps) => {
  const { language } = useLanguage();
  
  const defaultTitle = language === 'uk' 
    ? "Comfort Clinic - Клініка краси та здоров'я в Ірпені"
    : "Comfort Clinic - Клиника красоты и здоровья в Ирпене";
    
  const defaultDescription = language === 'uk'
    ? "Сучасна клініка краси та здоров'я Comfort Clinic в Ірпені. Професійні медичні послуги: гінекологія, дерматологія, косметологія, УЗД діагностика. Запишіться на прийом онлайн."
    : "Современная клиника красоты и здоровья Comfort Clinic в Ирпене. Профессиональные медицинские услуги: гинекология, дерматология, косметология, УЗИ диагностика. Запишитесь на прием онлайн.";
    
  const defaultKeywords = language === 'uk'
    ? "клініка Ірпінь, медичний центр, косметологія, гінеколог, дерматолог, УЗД діагностика, Comfort Clinic"
    : "клиника Ирпень, медицинский центр, косметология, гинеколог, дерматолог, УЗИ диагностика, Comfort Clinic";

  const siteUrl = window.location.origin;
  const fullTitle = title ? `${title} | Comfort Clinic` : defaultTitle;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : window.location.href;

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={language === 'uk' ? 'uk_UA' : 'ru_RU'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
