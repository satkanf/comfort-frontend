import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/useTranslations";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBaseUrl } from "@/utils/baseUrl";


interface Category {
  id: number;
  name: string;
  slug: string;
  acf?: {
    show_in_form?:boolean;
  }
  specialtyText: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  acf?: {
    show_in_form?: boolean;
  };
}

const BookingForm = () => {
  const { toast } = useToast();
  const { language } = useLanguage(); // Используем один источник языка

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    specialty: "",
    specialtyText: "",
  });

  // --- LOAD CATEGORIES ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Используем прокси в dev режиме, полный URL в production
        const baseUrl = getBaseUrl();
        const requestUrl = `${baseUrl}/wp-json/wp/v2/category-doctors?lang=${language}`;

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
        setCategories(data);
        setCatError(null);
      } catch (err: any) {
        setCatError(err.message);
        // Fallback: создаем пустые категории
        setCategories([]);
      } finally {
        setCatLoading(false);
      }
    };
    loadCategories();
  }, []);

  // --- LOAD HOME DATA ---
  const [homeData, setHomeData] = useState<any>({
    id: 1,
    title: { rendered: language === 'uk' ? 'Головна' : 'Главная' },
    acf: {
      add_block: [{
        acf_fc_layout: "home_form",
        home_form_title: language === 'uk' ? 'Записатися на прийом' : 'Записаться на прием',
        home_form_desc: language === 'uk'
          ? 'Оберіть зручний час та фахівця. Наші адміністратори зв\'яжуться з вами для підтвердження запису.'
          : 'Выберите удобное время и специалиста. Наши администраторы свяжутся с вами для подтверждения записи.',
        home_form_add_field: [
          {
            home_form_field_icon: "https://comfort.satkan.site/cms/wp-content/uploads/2025/12/icon-calendar.svg",
            home_form_field_name: language === 'uk' ? 'Гнучкий графік' : 'Гибкий график',
            home_form_field_desc: language === 'uk'
              ? 'Працюємо 7 днів на тиждень для вашої зручності'
              : 'Работаем 7 дней в неделю для вашего удобства'
          },
          {
            home_form_field_icon: "https://comfort.satkan.site/cms/wp-content/uploads/2025/12/icon-user.svg",
            home_form_field_name: language === 'uk' ? 'Досвідчені фахівці' : 'Опытные специалисты',
            home_form_field_desc: language === 'uk'
              ? 'Команда професіоналів з багаторічним досвідом'
              : 'Команда профессионалов с многолетним опытом'
          }
        ]
      }]
    }
  });
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);

  useEffect(() => {
    const loadHome = async () => {
      try {
        // Маппинг slugs для разных языков (как в useMultilangPage)
        const SLUG_MAPPING = {
          golovna: { uk: 'golovna', ru: 'glavnaya' }
        };

        const baseSlug = 'golovna';
        const localizedSlug = SLUG_MAPPING[baseSlug]?.[language] || baseSlug;

        // Используем WordPress API для получения данных формы
        const baseUrl = getBaseUrl();
        let data;

        let response;
        try {
          // Сначала пробуем кастомный endpoint
          const requestUrl = `${baseUrl}/wp-json/custom/v1/page/${localizedSlug}?_embed&lang=${language}`;
          response = await fetch(requestUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          data = await response.json();
        } catch (error) {
          console.warn('Custom endpoint failed, trying standard WP endpoint:', error);
          // Fallback на стандартный endpoint
          const standardUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=${localizedSlug}&lang=${language}&_embed`;
          response = await fetch(standardUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          data = await response.json();
        }

        // Если это массив (стандартный endpoint), берем первый элемент
        const processedData = Array.isArray(data) ? data[0] : data;

        setHomeData(processedData);
        setHomeError(null); // Сбрасываем ошибку при успешной загрузке
      } catch (err: any) {
        setHomeError(err.message);
        // Fallback: создаем тестовые данные с блоком home_form
        const fallbackData = {
          id: 1,
          title: { rendered: language === 'uk' ? 'Головна' : 'Главная' },
          acf: {
            add_block: [{
              acf_fc_layout: "home_form",
              home_form_title: language === 'uk' ? 'Записатися на прийом' : 'Записаться на прием',
              home_form_desc: language === 'uk'
                ? 'Оберіть зручний час та фахівця. Наші адміністратори зв\'яжуться з вами для підтвердження запису.'
                : 'Выберите удобное время и специалиста. Наши администраторы свяжутся с вами для подтверждения записи.',
              home_form_add_field: [
                {
                  home_form_field_icon: "https://comfort.satkan.site/cms/wp-content/uploads/2025/12/icon-calendar.svg",
                  home_form_field_name: language === 'uk' ? 'Гнучкий графік' : 'Гибкий график',
                  home_form_field_desc: language === 'uk'
                    ? 'Працюємо 7 днів на тиждень для вашої зручності'
                    : 'Работаем 7 дней в неделю для вашего удобства'
                },
                {
                  home_form_field_icon: "https://comfort.satkan.site/cms/wp-content/uploads/2025/12/icon-user.svg",
                  home_form_field_name: language === 'uk' ? 'Досвідчені фахівці' : 'Опытные специалисты',
                  home_form_field_desc: language === 'uk'
                    ? 'Команда професіоналів з багаторічним досвідом'
                    : 'Команда профессионалов с многолетним опытом'
                }
              ]
            }]
          }
        };
        setHomeData(fallbackData);
      } finally {
        setHomeLoading(false);
      }
    };
    loadHome();
  }, [language]);

  // --- GLOBAL LOADING STATE ---

  const getTranslations = () => {
    const defaultTranslations = {
      loading: {
        uk: 'Завантаження...',
        ru: 'Загрузка...'
      },
      error: {
        uk: 'Помилка',
        ru: 'Ошибка'
      },
      successTitle: {
        uk: 'Запис оформлено!',
        ru: 'Запись оформлена!'
      },
      successDescription: {
        uk: 'Ми зв\'яжемося з вами найближчим часом для підтвердження.',
        ru: 'Мы свяжемся с вами в ближайшее время для подтверждения.'
      },
      errorTitle: {
        uk: 'Помилка',
        ru: 'Ошибка'
      },
      formTitle: {
        uk: 'Записатися на прийом',
        ru: 'Записаться на прием'
      },
      formSubtitle: {
        uk: 'Заповніть форму нижче і ми зв\'яжемося з вами для підтвердження запису',
        ru: 'Заполните форму ниже и мы свяжемся с вами для подтверждения записи'
      },
      nameLabel: {
        uk: 'Ім\'я *',
        ru: 'Имя *'
      },
      namePlaceholder: {
        uk: 'Введіть ваше ім\'я',
        ru: 'Введите ваше имя'
      },
      phoneLabel: {
        uk: 'Телефон *',
        ru: 'Телефон *'
      },
      phonePlaceholder: {
        uk: '+38 (___) ___-__-__',
        ru: '+38 (___) ___-__-__'
      },
      dateLabel: {
        uk: 'Дата *',
        ru: 'Дата *'
      },
      timeLabel: {
        uk: 'Час *',
        ru: 'Время *'
      },
      specialtyLabel: {
        uk: 'Спеціальність',
        ru: 'Специальность'
      },
      specialtyPlaceholder: {
        uk: 'Оберіть спеціальність',
        ru: 'Выберите специальность'
      },
      submitButton: {
        uk: 'Відправити заявку',
        ru: 'Отправить заявку'
      },
      globalLoading: {
        uk: 'Завантаження...',
        ru: 'Загрузка...'
      },
      globalError: {
        uk: 'Помилка',
        ru: 'Ошибка'
      }
    };

    const currentLang = language || 'uk'; // fallback to 'uk' if language is undefined

    return {
      loading: defaultTranslations.loading[currentLang as "uk" | "ru"],
      error: defaultTranslations.error[currentLang as "uk" | "ru"],
      successTitle: defaultTranslations.successTitle[currentLang as "uk" | "ru"],
      successDescription: defaultTranslations.successDescription[currentLang as "uk" | "ru"],
      errorTitle: defaultTranslations.errorTitle[currentLang as "uk" | "ru"],
      formTitle: defaultTranslations.formTitle[currentLang as "uk" | "ru"],
      formSubtitle: defaultTranslations.formSubtitle[currentLang as "uk" | "ru"],
      nameLabel: defaultTranslations.nameLabel[currentLang as "uk" | "ru"],
      namePlaceholder: defaultTranslations.namePlaceholder[currentLang as "uk" | "ru"],
      phoneLabel: defaultTranslations.phoneLabel[currentLang as "uk" | "ru"],
      phonePlaceholder: defaultTranslations.phonePlaceholder[currentLang as "uk" | "ru"],
      dateLabel: defaultTranslations.dateLabel[currentLang as "uk" | "ru"],
      timeLabel: defaultTranslations.timeLabel[currentLang as "uk" | "ru"],
      specialtyLabel: defaultTranslations.specialtyLabel[currentLang as "uk" | "ru"],
      specialtyPlaceholder: defaultTranslations.specialtyPlaceholder[currentLang as "uk" | "ru"],
      submitButton: defaultTranslations.submitButton[currentLang as "uk" | "ru"],
      globalLoading: defaultTranslations.globalLoading[currentLang as "uk" | "ru"],
      globalError: defaultTranslations.globalError[currentLang as "uk" | "ru"]
    };
  };

  const translations = getTranslations();



  if (homeLoading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/30 to-background">
        <div className="container">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">{translations.loading}</div>
          </div>
        </div>
      </section>
    );
  }

  // Если homeData все еще null после загрузки, показываем ошибку
  if (!homeData) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/30 to-background">
        <div className="container">
          <div className="text-center">
            <div className="text-lg text-muted-foreground">{translations.error}: Данные формы не загружены</div>
          </div>
        </div>
      </section>
    );
  }
  if (catError) {
    // Fallback: показываем форму даже при ошибке загрузки категорий
    // return <div>{translations.error}: {catError}</div>;
  }
  if (homeError) {
    // Fallback: показываем форму даже при ошибке загрузки home данных
    // return <div>{translations.error}: {homeError}</div>;
  }

  // --- SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        // Гибридный подход: пробуем прокси, если не работает - прямые запросы
        const baseUrl = '';
      const requestUrl = `${baseUrl}/wp-json/custom/v1/booking`;

      const response = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          specialty: formData.specialtyText,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status} for booking submission:`, errorText.substring(0, 200));
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (json.success) {
        toast({
          title: translations.successTitle,
          description: translations.successDescription,
        });
      } else {
        toast({ title: translations.errorTitle });
      }
    } catch (error) {
      toast({
        title: translations.errorTitle,
        description: error.message || 'Произошла ошибка при отправке формы',
      });
    }
  };
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-secondary/30 to-background">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* LEFT CONTENT */}
          {homeData?.acf?.add_block?.map((el) =>
            el.acf_fc_layout === "home_form" ? (
              <div key={el.id || 'home-form'} className="space-y-6">
                <h2 className="text-3xl font-bold sm:text-4xl">{el.home_form_title}</h2>
                <p className="text-lg text-muted-foreground">{el.home_form_desc}</p>

                <div className="space-y-4">
                  {el.home_form_add_field?.map((it, index) => {
                    // Создаем уникальный key на основе имени или индекса
                    const uniqueKey = it?.home_form_field_name || `item-${index}`;

                    return (
                      <div key={uniqueKey} className="flex items-start gap-3">
                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <img src={it.home_form_field_icon} alt="" className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{it.home_form_field_name}</h3>
                          <p className="text-sm text-muted-foreground">{it.home_form_field_desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null
          )}

          {/* RIGHT: FORM */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{translations.formTitle}</CardTitle>
              <CardDescription>{translations.formSubtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* NAME */}
                <div className="space-y-2">
                  <Label>{translations.nameLabel}</Label>
                  <Input
                    placeholder={translations.namePlaceholder}
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* PHONE */}
                <div className="space-y-2">
                  <Label>{translations.phoneLabel}</Label>
                  <Input
                    placeholder={translations.phonePlaceholder}
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* DATE / TIME */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{translations.dateLabel}</Label>
                    <Input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{translations.timeLabel}</Label>
                    <Input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                {/* SPECIALTY */}
                <div className="space-y-2">
                  <Label>{translations.specialtyLabel}</Label>

                  <Select
                    value={formData.specialty}
                    onValueChange={(slug) => {
                      const selected = categories.find((c) => c.slug === slug);
                      setFormData({
                        ...formData,
                        specialty: slug,
                        specialtyText: selected?.name || "",
                      });
                    }}
                  >
                    <SelectTrigger>
                        <SelectValue placeholder={`${translations.specialtyPlaceholder} (${categories.length} options)`} />
                    </SelectTrigger>

                    <SelectContent>
                      {categories
                        .filter((c) => c.acf?.show_in_form)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.slug}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {translations.submitButton}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;