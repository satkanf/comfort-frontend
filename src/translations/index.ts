// Файл переводов для всего приложения
// Разбит по группам для удобства редактирования

export const translations = {
  // ===== HEADER =====
  headerTranslations: {
    navHome: { uk: 'Головна', ru: 'Главная' },
    navAbout: { uk: 'Про нас', ru: 'О нас' },
    navServices: { uk: 'Послуги', ru: 'Услуги' },
    navDoctors: { uk: 'Лікарі', ru: 'Врачи' },
    navPrices: { uk: 'Ціни', ru: 'Цены' },
    navPromotions: { uk: 'Акції', ru: 'Акции' },
    navBlog: { uk: 'Блог', ru: 'Блог' },
    navContacts: { uk: 'Контакти', ru: 'Контакты' },
    navAllServices: { uk: 'Всі послуги', ru: 'Все услуги' },
  },

  // ===== ОБЩИЕ ПЕРЕВОДЫ =====
  common: {
    loading: {
      uk: 'Завантаження...',
      ru: 'Загрузка...'
    },
    error: {
      uk: 'Помилка',
      ru: 'Ошибка'
    },
    all: {
      uk: 'Всі',
      ru: 'Все'
    },
    back: {
      uk: 'Назад',
      ru: 'Назад'
    },
    close: {
      uk: 'Закрити',
      ru: 'Закрыть'
    },
    save: {
      uk: 'Зберегти',
      ru: 'Сохранить'
    },
    cancel: {
      uk: 'Скасувати',
      ru: 'Отменить'
    }
  },



  // ===== СТРАНИЦЫ =====
  pages: {
    // Главная страница
    home: {

      services: {
        title: {
          uk: 'Наші послуги',
          ru: 'Наши услуги'
        },
        subtitle: {
          uk: 'Широкий спектр медичних послуг для турботи про ваше здоров\'я та красу',
          ru: 'Широкий спектр медицинских услуг для заботы о вашем здоровье и красоте'
        },
        allServices: {
          uk: 'Переглянути всі послуги',
          ru: 'Посмотреть все услуги'
        }
      },
      doctors: {
        allDoctors: {
          uk: 'Всі лікарі',
          ru: 'Все врачи'
        }
      },
      booking: {

        form: {
          title: {
            uk: 'Записатися на прийом',
            ru: 'Записаться на прием'
          },
          subtitle: {
            uk: 'Заповніть форму і ми зв\'яжемося з вами найближчим часом',
            ru: 'Заполните форму и мы свяжемся с вами в ближайшее время'
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
          successTitle: {
            uk: 'Запис оформлено!',
            ru: 'Запись оформлена!'
          },
          successDescription: {
            uk: 'Ми зв\'яжемося з вами найближчим часом для підтвердження.',
            ru: 'Мы свяжемся с вами в ближайшее время для подтверждения.'
          },
          errorTitle: {
            uk: 'Помилка відправки',
            ru: 'Ошибка отправки'
          }
        }
      }
    },

    // Страница услуг
    services: {
      readyToBook: {
        uk: 'Готові записатися на прийом?',
        ru: 'Готовы записаться на прием?'
      },
      supportText: {
        uk: 'Наша команда фахівців готова надати вам кваліфіковану допомогу',
        ru: 'Наша команда специалистов готова предоставить вам квалифицированную помощь'
      }
    },

    // Страница врачей
    doctors: {

      allDoctors: {
        uk: 'Всі лікарі',
        ru: 'Все врачи'
      },
      filterBySpecialty: {
        uk: 'Фільтр за спеціальністю',
        ru: 'Фильтр по специальности'
      },
      searchPlaceholder: {
        uk: 'Пошук лікаря...',
        ru: 'Поиск врача...'
      },
      experience: {
        uk: 'Досвід:',
        ru: 'Опыт:'
      },
      bookAppointment: {
        uk: 'Записатися на прийом',
        ru: 'Записаться на прием'
      },
      noDoctors: {
        uk: 'Лікарі не знайдені',
        ru: 'Врачи не найдены'
      },
      aboutDoctor: {
        uk: 'Про лікаря',
        ru: 'О враче'
      },
      workSchedule: {
        uk: 'Графік роботи',
        ru: 'График работы'
      },
      education: {
        uk: 'Освіта',
        ru: 'Образование'
      },
      certificates: {
        uk: 'Сертифікати та досягнення',
        ru: 'Сертификаты и достижения'
      },
      notFound: {
        uk: 'Лікар не знайдений',
        ru: 'Врач не найден'
      }
    },

    // Страница цен
    prices: {
      noPrices: {
        uk: 'Наразі немає доступних цін',
        ru: 'На данный момент нет доступных цен'
      },
      disclaimer: {
        uk: '* Ціни можуть змінюватися. Точну вартість уточнюйте при записі',
        ru: '* Цены могут меняться. Точную стоимость уточняйте при записи'
      }
    },

    // Страница акций
    promotions: {
      title: {
        uk: 'Акції та знижки',
        ru: 'Акции и скидки'
      },
      subtitle: {
        uk: 'Спеціальні пропозиції та знижки на наші послуги',
        ru: 'Специальные предложения и скидки на наши услуги'
      },
      noPromotions: {
        uk: 'Наразі немає активних акцій',
        ru: 'На данный момент нет активных акций'
      },
      loadingError: {
        uk: 'Помилка завантаження',
        ru: 'Ошибка загрузки'
      },
      validUntil: {
        uk: 'Діє до',
        ru: 'Действует до'
      },
      details: {
        uk: 'Детальніше',
        ru: 'Подробнее'
      },
      disclaimer: {
        uk: '* Акції не сумуються з іншими знижками. Детальні умови уточнюйте при записі.',
        ru: '* Акции не суммируются с другими скидками. Детальные условия уточняйте при записи.'
      },
      defaultTitle: {
        uk: 'Акція',
        ru: 'Акция'
      }
    }
  },

  // ===== КОМПОНЕНТЫ =====
  components: {
    // DoctorCard
    doctorCard: {
      experience: {
        uk: 'Досвід',
        ru: 'Опыт'
      },
      profile: {
        uk: 'Переглянути профіль',
        ru: 'Посмотреть профиль'
      }
    },

    // MapSection
    mapSection: {
      address: {
        uk: 'Адреса',
        ru: 'Адрес'
      },
      phone: {
        uk: 'Телефон',
        ru: 'Телефон'
      },
      hours: {
        uk: 'Години роботи',
        ru: 'Часы работы'
      },
      email: {
        uk: 'Email',
        ru: 'Email'
      },
      social: {
        uk: 'Ми в соціальних мережах',
        ru: 'Мы в социальных сетях'
      }
    },

    // BookingDialog
    bookingDialog: {
      title: {
        uk: 'Записатися на прийом',
        ru: 'Записаться на прием'
      },
      subtitle: {
        uk: 'Заповніть форму і ми зв\'яжемося з вами найближчим часом',
        ru: 'Заполните форму и мы свяжемся с вами в ближайшее время'
      },
      // ... остальные поля из booking формы
    },

    // LanguageSwitcher
    languageSwitcher: {
      ukrainian: {
        uk: 'Українська',
        ru: 'Украинский'
      },
      russian: {
        uk: 'Російська',
        ru: 'Русский'
      }
    }
  },

  // ===== СПЕЦИАЛЬНОСТИ ВРАЧЕЙ =====

};

// Типы для TypeScript
export type Language = 'uk' | 'ru';

export type TranslationKey = string;

// Функция для получения перевода
export const getTranslation = (key: string, language: Language): string => {
  const keys = key.split('.');
  let value: any = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Возвращаем ключ, если перевод не найден
    }
  }

  if (typeof value === 'object' && value[language]) {
    return value[language];
  }

  return typeof value === 'string' ? value : key;
};

// Функция для получения группы переводов
export const getTranslationGroup = (groupKey: string, language: Language): any => {
  const keys = groupKey.split('.');
  let value: any = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return {};
    }
  }

  if (typeof value === 'object') {
    // Рекурсивно заменяем все объекты с переводами на строки для выбранного языка
    const translateObject = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj;
      }
      if (Array.isArray(obj)) {
        return obj.map(translateObject);
      }
      if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const [key, val] of Object.entries(obj)) {
          if (typeof val === 'object' && val !== null && (val.uk || val.ru)) {
            result[key] = val[language] || val.uk || val.ru || key;
          } else {
            result[key] = translateObject(val);
          }
        }
        return result;
      }
      return obj;
    };

    return translateObject(value);
  }

  return {};
};
