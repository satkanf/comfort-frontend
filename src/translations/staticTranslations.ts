import { Language } from "@/contexts/LanguageContext";

interface StaticTranslations {
  loading: Record<Language, string>;
  error: Record<Language, string>;
  // Global UI translations
  readMore: Record<Language, string>;
  viewAll: Record<Language, string>;
  bookAppointment: Record<Language, string>;
  // MapSection translations
  mapSection: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    addressTitle: Record<Language, string>;
    phoneTitle: Record<Language, string>;
    hoursTitle: Record<Language, string>;
    hoursText: Record<Language, string>;
    emailTitle: Record<Language, string>;
    mapTitle: Record<Language, string>;
    mapSubtitle: Record<Language, string>;
  };
  // BookingForm translations
  bookingForm: {
    successTitle: Record<Language, string>;
    successDescription: Record<Language, string>;
    errorTitle: Record<Language, string>;
    formTitle: Record<Language, string>;
    formSubtitle: Record<Language, string>;
    nameLabel: Record<Language, string>;
    namePlaceholder: Record<Language, string>;
    phoneLabel: Record<Language, string>;
    phonePlaceholder: Record<Language, string>;
    dateLabel: Record<Language, string>;
    timeLabel: Record<Language, string>;
    specialtyLabel: Record<Language, string>;
    specialtyPlaceholder: Record<Language, string>;
    submitButton: Record<Language, string>;
    globalLoading: Record<Language, string>;
    globalError: Record<Language, string>;
  };
  // Hero Section translations
  heroSection: {
    buttonText: Record<Language, string>;
  };
  // Header translations
  header: {
    contactButton: Record<Language, string>;
    navigation: {
      home: Record<Language, string>;
      about: Record<Language, string>;
      services: Record<Language, string>;
      doctors: Record<Language, string>;
      prices: Record<Language, string>;
      promotions: Record<Language, string>;
      blog: Record<Language, string>;
      contacts: Record<Language, string>;
      allServices: Record<Language, string>;
    };
  };
  // Footer translations
  footer: {
    address: Record<Language, string>;
    phone: Record<Language, string>;
    email: Record<Language, string>;
    workingHours: Record<Language, string>;
    workingHoursText: Record<Language, string>;
  };
  // Services Section translations
  servicesSection: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
  };
  // Doctors Section translations
  doctorsSection: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
  };
  // Promotions Section translations
  promotionsSection: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
  };
  // Contacts Page translations
  contactsPage: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
  };
  // Doctors Page translations
  doctorsPage: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    allSpecialties: Record<Language, string>;
  };
  // Services Page translations
  servicesPage: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
  };
  // Doctor Detail Page translations
  doctorDetailPage: {
    experience: Record<Language, string>;
    appointment: Record<Language, string>;
  };
  // Prices Page translations
  pricesPage: {
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
  };
}

export const staticTranslations: StaticTranslations = {
  loading: {
    uk: "Завантаження...",
    ru: "Загрузка...",
  },
  error: {
    uk: "Помилка",
    ru: "Ошибка",
  },
  readMore: {
    uk: "Детальніше",
    ru: "Подробнее",
  },
  viewAll: {
    uk: "Переглянути всі",
    ru: "Посмотреть все",
  },
  bookAppointment: {
    uk: "Записатися на прийом",
    ru: "Записаться на прием",
  },
  mapSection: {
    title: {
      uk: "Контактна інформація",
      ru: "Контактная информация",
    },
    subtitle: {
      uk: "Знайдіть нас за адресою нижче або скористайтеся контактними даними для зв'язку",
      ru: "Найдите нас по адресу ниже или воспользуйтесь контактными данными для связи",
    },
    addressTitle: {
      uk: "Адреса",
      ru: "Адрес",
    },
    phoneTitle: {
      uk: "Телефон",
      ru: "Телефон",
    },
    hoursTitle: {
      uk: "Години роботи",
      ru: "Часы работы",
    },
    hoursText: {
      uk: "Пн-Пт: 9:00-18:00<br />Сб: 9:00-15:00<br />Нд: вихідний",
      ru: "Пн-Пт: 9:00-18:00<br />Сб: 9:00-15:00<br />Вс: выходной",
    },
    emailTitle: {
      uk: "Email",
      ru: "Email",
    },
    mapTitle: {
      uk: "Як нас знайти",
      ru: "Как нас найти",
    },
    mapSubtitle: {
      uk: "Ми розташовані в центрі міста, недалеко від основних транспортних розв'язок",
      ru: "Мы расположены в центре города, недалеко от основных транспортных развязок",
    },
  },
  bookingForm: {
    successTitle: {
      uk: "Запис оформлено!",
      ru: "Запись оформлена!",
    },
    successDescription: {
      uk: "Ми зв'яжемося з вами найближчим часом для підтвердження.",
      ru: "Мы свяжемся с вами в ближайшее время для подтверждения.",
    },
    errorTitle: {
      uk: "Помилка",
      ru: "Ошибка",
    },
    formTitle: {
      uk: "Записатися на прийом",
      ru: "Записаться на прием",
    },
    formSubtitle: {
      uk: "Заповніть форму нижче і ми зв'яжемося з вами для підтвердження запису",
      ru: "Заполните форму ниже и мы свяжемся с вами для подтверждения записи",
    },
    nameLabel: {
      uk: "Ім'я *",
      ru: "Имя *",
    },
    namePlaceholder: {
      uk: "Введіть ваше ім'я",
      ru: "Введите ваше имя",
    },
    phoneLabel: {
      uk: "Телефон *",
      ru: "Телефон *",
    },
    phonePlaceholder: {
      uk: "+38 (___) ___-__-__",
      ru: "+38 (___) ___-__-__",
    },
    dateLabel: {
      uk: "Дата *",
      ru: "Дата *",
    },
    timeLabel: {
      uk: "Час *",
      ru: "Время *",
    },
    specialtyLabel: {
      uk: "Спеціальність",
      ru: "Специальность",
    },
    specialtyPlaceholder: {
      uk: "Оберіть спеціальність",
      ru: "Выберите специальность",
    },
    submitButton: {
      uk: "Відправити заявку",
      ru: "Отправить заявку",
    },
    globalLoading: {
      uk: "Завантаження...",
      ru: "Загрузка...",
    },
    globalError: {
      uk: "Помилка",
      ru: "Ошибка",
    },
  },
  heroSection: {
    buttonText: {
      uk: "Дізнатись більше",
      ru: "Узнать больше",
    },
  },
  header: {
    contactButton: {
      uk: "Зателефонувати",
      ru: "Позвонить",
    },
    navigation: {
      home: { uk: "Головна", ru: "Главная" },
      about: { uk: "Про нас", ru: "О нас" },
      services: { uk: "Послуги", ru: "Услуги" },
      doctors: { uk: "Лікарі", ru: "Врачи" },
      prices: { uk: "Ціни", ru: "Цены" },
      promotions: { uk: "Акції", ru: "Акции" },
      blog: { uk: "Блог", ru: "Блог" },
      contacts: { uk: "Контакти", ru: "Контакты" },
      allServices: { uk: "Всі послуги", ru: "Все услуги" },
    },
  },
  callbackDialog: {
    error: {
      uk: "Помилка",
      ru: "Ошибка",
    },
    errorSend: {
      uk: "Не вдалося відправити",
      ru: "Не удалось отправить",
    },
    sendOk: {
      uk: "Заявка відправлена!",
      ru: "Заявка отправлена!",
    },
    meCall: {
      uk: "Ми зв'яжемося з вами найближчим часом",
      ru: "Мы свяжемся с вами в ближайшее время",
    },
    callback: {
      uk: "Замовити зворотний дзвінок",
      ru: "Заказать обратный звонок",
    },
    contactsLeave: {
      uk: "Залиште свої контактні дані, і ми зв'яжемося з вами найближчим часом",
      ru: "Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время",
    },
    name: {
      uk: "Ім'я",
      ru: "Имя",
    },
    enterName: {
      uk: "Введіть ваше ім'я",
      ru: "Введите ваше имя",
    },
    phone: {
      uk: "Телефон",
      ru: "Телефон",
    },
    sendForm: {
      uk: "Відправити заявку",
      ru: "Отправить заявку",
    },
  },
  bookingDialog: {
    bookingButton: {
      uk: "Записатися на прийом",
      ru: "Записаться на прием",
    },
    formTitle: {
      uk: "Записатися на прийом",
      ru: "Записаться на прием",
    },
    formSubtitle: {
      uk: "Заповніть форму і ми зв'яжемося з вами найближчим часом",
      ru: "Заполните форму и мы свяжемся с вами в ближайшее время",
    },
    name: {
      uk: "Ім'я *",
      ru: "Имя *",
    },
    enterName: {
      uk: "Введіть ваше ім'я",
      ru: "Введите ваше имя",
    },
    phone: {
      uk: "Телефон *",
      ru: "Телефон *",
    },
    date: {
      uk: "Дата *",
      ru: "Дата *",
    },
    time: {
      uk: "Час *",
      ru: "Время *",
    },
    specialtyDoctor: {
      uk: "Спеціальність лікаря",
      ru: "Специальность врача",
    },
    chooseSpecialist: {
      uk: "Оберіть фахівця",
      ru: "Выберите специалиста",
    },
    reception: {
      uk: "Записатися",
      ru: "Записаться",
    },
    error: {
      uk: "Помилка",
      ru: "Ошибка",
    },
    successTitle: {
      uk: "Запис оформлено!",
      ru: "Запись оформлена!",
    },
    successDescription: {
      uk: "Ми зв'яжемося з вами найближчим часом для підтвердження.",
      ru: "Мы свяжемся с вами в ближайшее время для подтверждения.",
    },
  },
  footer: {
    address: {
      uk: "Адреса",
      ru: "Адрес",
    },
    phone: {
      uk: "Телефон",
      ru: "Телефон",
    },
    email: {
      uk: "Email",
      ru: "Email",
    },
    workingHours: {
      uk: "Години роботи",
      ru: "Часы работы",
    },
    workingHoursText: {
      uk: "Пн-Пт: 9:00-18:00<br />Сб: 9:00-15:00<br />Нд: вихідний",
      ru: "Пн-Пт: 9:00-18:00<br />Сб: 9:00-15:00<br />Вс: выходной",
    },
  },
  servicesSection: {
    title: {
      uk: "Наші послуги",
      ru: "Наши услуги",
    },
    subtitle: {
      uk: "Ми пропонуємо широкий спектр медичних послуг",
      ru: "Мы предлагаем широкий спектр медицинских услуг",
    },
  },
  doctorsSection: {
    title: {
      uk: "Наші лікарі",
      ru: "Наши врачи",
    },
    subtitle: {
      uk: "Найкращі спеціалісти в своїй справі",
      ru: "Лучшие специалисты в своем деле",
    },
  },
  promotionsSection: {
    title: {
      uk: "Акції та спеціальні пропозиції",
      ru: "Акции и специальные предложения",
    },
    subtitle: {
      uk: "Не пропустіть вигідні пропозиції від нашої клініки",
      ru: "Не пропустите выгодные предложения от нашей клиники",
    },
  },
  contactsPage: {
    title: {
      uk: "Контакти",
      ru: "Контакты",
    },
    subtitle: {
      uk: "Зв'яжіться з нами або відвідайте нашу клініку",
      ru: "Свяжитесь с нами или посетите нашу клинику",
    },
  },
  doctorsPage: {
    title: {
      uk: "Наші лікарі",
      ru: "Наши врачи",
    },
    subtitle: {
      uk: "Ознайомтеся з нашим штатом висококваліфікованих спеціалістів",
      ru: "Ознакомьтесь с нашим штатом высококвалифицированных специалистов",
    },
    allSpecialties: {
      uk: "Всі спеціальності",
      ru: "Все специальности",
    },
  },
  servicesPage: {
    title: {
      uk: "Наші послуги",
      ru: "Наши услуги",
    },
    subtitle: {
      uk: "Ми пропонуємо широкий спектр медичних послуг для вашого здоров'я",
      ru: "Мы предлагаем широкий спектр медицинских услуг для вашего здоровья",
    },
  },
  doctorDetailPage: {
    experience: {
      uk: "Досвід роботи",
      ru: "Опыт работы",
    },
    appointment: {
      uk: "Записатися на прийом",
      ru: "Записаться на прием",
    },
  },
  pricesPage: {
    title: {
      uk: "Прайс-лист",
      ru: "Прайс-лист",
    },
    subtitle: {
      uk: "Детальна інформація про вартість наших послуг",
      ru: "Подробная информация о стоимости наших услуг",
    },
  },
};

