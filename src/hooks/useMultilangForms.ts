import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormTranslations {
  // Общие для всех форм
  error: string;
  errorSend: string;
  sendOk: string;
  meCall: string;
  name: string;
  enterName: string;
  phone: string;
  sendForm: string;

  // BookingDialog
  callback: string;
  doctorsAppointment: string;
  fillForm: string;
  date: string;
  time: string;
  specialtyDoctor: string;
  chooseSpecialist: string;
  reception: string;

  // CallbackDialog
  call: string;
  callbackRequest: string;
  contactsLeave: string;
}

export const useMultilangForms = () => {
  const { language } = useLanguage();
  const [formTranslations, setFormTranslations] = useState<FormTranslations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFormTranslations = async () => {
      try {
        setLoading(true);

        // Пока используем статические переводы, но в будущем можно добавить загрузку из WordPress
        const translations: FormTranslations = {
          // Общие
          error: language === 'uk' ? 'Помилка' : 'Ошибка',
          errorSend: language === 'uk' ? 'Не вдалося відправити' : 'Не удалось отправить',
          sendOk: language === 'uk' ? 'Заявка відправлена!' : 'Заявка отправлена!',
          meCall: language === 'uk' ? 'Ми зв\'яжемося з вами найближчим часом' : 'Мы свяжемся с вами в ближайшее время',
          name: language === 'uk' ? "Ім'я" : 'Имя',
          enterName: language === 'uk' ? "Введіть ваше ім'я" : 'Введите ваше имя',
          phone: language === 'uk' ? 'Телефон' : 'Телефон',
          sendForm: language === 'uk' ? 'Відправити заявку' : 'Отправить заявку',

          // BookingDialog
          callback: language === 'uk' ? 'Записатися на прийом' : 'Записаться на прием',
          doctorsAppointment: language === 'uk' ? 'Записатися на прийом' : 'Записаться на прием',
          fillForm: language === 'uk' ? 'Заповніть форму і ми зв\'яжемося з вами найближчим часом' : 'Заполните форму и мы свяжемся с вами в ближайшее время',
          date: language === 'uk' ? 'Дата' : 'Дата',
          time: language === 'uk' ? 'Час' : 'Время',
          specialtyDoctor: language === 'uk' ? 'Спеціальність лікаря' : 'Специальность врача',
          chooseSpecialist: language === 'uk' ? 'Оберіть фахівця' : 'Выберите специалиста',
          reception: language === 'uk' ? 'Записатися' : 'Записаться',

          // CallbackDialog
          call: language === 'uk' ? 'Зателефонувати' : 'Позвонить',
          callbackRequest: language === 'uk' ? 'Замовити зворотний дзвінок' : 'Заказать обратный звонок',
          contactsLeave: language === 'uk' ? 'Залиште свої контактні дані, і ми зв\'яжемося з вами найближчим часом' : 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время'
        };

        setFormTranslations(translations);
        setError(null);
      } catch (err) {
        console.error('Error loading form translations:', err);
        setError(err instanceof Error ? err.message : 'Failed to load form translations');

        // Fallback переводы
        setFormTranslations({
          error: language === 'uk' ? 'Помилка' : 'Ошибка',
          errorSend: language === 'uk' ? 'Не вдалося відправити' : 'Не удалось отправить',
          sendOk: language === 'uk' ? 'Заявка відправлена!' : 'Заявка отправлена!',
          meCall: language === 'uk' ? 'Ми зв\'яжемося з вами найближчим часом' : 'Мы свяжемся с вами в ближайшее время',
          name: language === 'uk' ? "Ім'я" : 'Имя',
          enterName: language === 'uk' ? "Введіть ваше ім'я" : 'Введите ваше имя',
          phone: language === 'uk' ? 'Телефон' : 'Телефон',
          sendForm: language === 'uk' ? 'Відправити заявку' : 'Отправить заявку',
          callback: language === 'uk' ? 'Записатися на прийом' : 'Записаться на прием',
          doctorsAppointment: language === 'uk' ? 'Записатися на прийом' : 'Записаться на прием',
          fillForm: language === 'uk' ? 'Заповніть форму і ми зв\'яжемося з вами найближчим часом' : 'Заполните форму и мы свяжемся с вами в ближайшее время',
          date: language === 'uk' ? 'Дата' : 'Дата',
          time: language === 'uk' ? 'Час' : 'Время',
          specialtyDoctor: language === 'uk' ? 'Спеціальність лікаря' : 'Специальность врача',
          chooseSpecialist: language === 'uk' ? 'Оберіть фахівця' : 'Выберите специалиста',
          reception: language === 'uk' ? 'Записатися' : 'Записаться',
          call: language === 'uk' ? 'Зателефонувати' : 'Позвонить',
          callbackRequest: language === 'uk' ? 'Замовити зворотний дзвінок' : 'Заказать обратный звонок',
          contactsLeave: language === 'uk' ? 'Залиште свої контактні дані, і ми зв\'яжемося з вами найближчим часом' : 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время'
        });
      } finally {
        setLoading(false);
      }
    };

    loadFormTranslations();
  }, [language]);

  return { formTranslations, loading, error };
};











