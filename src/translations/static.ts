// Статические переводы приложения
// Группированы по категориям для избежания дубликатов

export const staticTranslations = {
    // ===== ОБЩИЕ СООБЩЕНИЯ =====
    common: {
        notFound: {
            uk: 'не знайдено',
            ru: 'не найден'
        },
        backToList: {
            uk: 'Повернутися до',
            ru: 'Вернуться к'
        },
        backTo: {
            uk: 'Назад до',
            ru: 'Назад к'
        },
        loading: {
            uk: 'Завантаження...',
            ru: 'Загрузка...'
        },
        oldPrice: {
            uk: 'Стара ціна',
            ru: 'Старая цена'
        },
        discountPrice: {
            uk: 'Ціна за акцією',
            ru: 'Цена по акции'
        },
        validUntil: {
            uk: 'Діє до',
            ru: 'Действует до'
        },
        bookAppointment: {
            uk: 'Записатися на прийом',
            ru: 'Записаться на прием'
        },
        priceLoading: {
            uk: 'Ціни завантажуються...',
            ru: 'Цены загружаются...'
        },
        doctorsLoading: {
            uk: 'Лікарі завантажуються...',
            ru: 'Врачи загружаются...'
        }
    },

    // ===== ДОКТОРА =====
    doctors: {
        subtitle: {
            uk: 'Команда висококваліфікованих фахівців з багаторічним досвідом та індивідуальним підходом до кожного пацієнта',
            ru: 'Команда высококвалифицированных специалистов с многолетним опытом и индивидуальным подходом к каждому пациенту'
        },
        needConsultation: {
            uk: 'Потрібна консультація?',
            ru: 'Нужна консультация?'
        },
        consultationText: {
            uk: 'Зателефонуйте нам або заповніть форму онлайн-запису, і ми підберемо для вас найкращого спеціаліста',
            ru: 'Позвоните нам или заполните форму онлайн-записи, и мы подберем для вас лучшего специалиста'
        },
        ourDoctors: {
            uk: 'Наші фахівці',
            ru: 'Наши специалисты'
        },
        ourDoctorsTitle: {
            uk: 'Наші лікарі',
            ru: 'Наши врачи'
        }
    },

    // ===== УСЛУГИ =====
    services: {
        notFound: {
            uk: 'Послугу не знайдено',
            ru: 'Услуга не найдена'
        },
        backToServices: {
            uk: 'Повернутися до послуг',
            ru: 'Вернуться к услугам'
        },
        costTitle: {
            uk: 'Вартість послуги',
            ru: 'Стоимость услуги'
        },
        defaultTitle: {
            uk: 'Услуга',
            ru: 'Услуга'
        },
        defaultDescription: {
            uk: 'Медицинська послуга клініки Comfort',
            ru: 'Медицинская услуга клиники Comfort'
        },
        pricesTitle: {
            uk: 'Ціни',
            ru: 'Цены'
        }
    },

    // ===== АКЦИИ =====
    promotions: {
        notFound: {
            uk: 'Акцію не знайдено',
            ru: 'Акция не найдена'
        },
        backToPromotions: {
            uk: 'Повернутися до акцій',
            ru: 'Вернуться к акциям'
        },
        backToPromotionsAlt: {
            uk: 'Назад до акцій',
            ru: 'Назад к акциям'
        },
        notSummable: {
            uk: 'Акція не сумується з іншими знижками',
            ru: 'Акция не суммируется с другими скидками'
        }
    },

    // ===== АДРЕС И КОНТАКТЫ =====
    contacts: {
        streetAddress: {
            uk: 'вул. Західна 6',
            ru: 'ул. Западная 6'
        },
        addressLocality: {
            uk: 'Ірпінь',
            ru: 'Ирпень'
        }
    },

    // ===== МЕНЮ =====
    menu: {
        suffix: {
            uk: '',
            ru: '-ru'
        }
    }
};

// Типы для TypeScript
export type Language = 'uk' | 'ru';

// Функция для получения статического перевода
export const getStaticTranslation = (key: string, language: Language): string => {
    const keys = key.split('.');
    let value: any = staticTranslations;

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