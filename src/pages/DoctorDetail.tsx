import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Clock, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BookingDialog from '@/components/BookingDialog';
import { translations } from '@/translations';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getBaseUrl } from "@/utils/baseUrl";

interface DoctorData {
    id: number;
    title: { rendered: string };
    slug: string;
    content?: { rendered: string };
    category_names?: string[];
    'category-doctors'?: number[];
    acf?: {
        doctor_avatar?: string;
        doctor_info?: {
            doctor_specialization?: string;
            doctor_experience?: string;
        };
        doctor_info_ru?: string;
        doctor_phone?: string;
        doctor_email?: string;
        doctor_schedule?: string;
        doctor_education?: string;
        doctor_certificates?: number[] | string[];
        doctor_about?: string;
        doctor_add_info?: Array<{
            acf_fc_layout: string;
            doctor_list_title?: string;
            doctor_list_repeater?: Array<{
                doctor_list_value: string;
            }>;
        }>;
    };
    _embedded?: {
        'wp:term'?: any[][];
        'wp:featuredmedia'?: Array<{
            source_url: string;
            alt_text: string;
        }>;
    };
}

const DoctorDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [doctor, setDoctor] = useState<DoctorData | null>(null);
    const [certificates, setCertificates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Функция для получения URL сертификатов по ID
    const fetchCertificateUrls = async (certificateIds: number[]): Promise<string[]> => {
        try {
            const baseUrl = getBaseUrl();
            const certificatePromises = certificateIds.map(async (id) => {
                try {
                    const mediaResponse = await fetch(`${baseUrl}/wp-json/wp/v2/media/${id}`, {
                        method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
                    });
                    if (!mediaResponse.ok) {
                        throw new Error(`HTTP error! status: ${mediaResponse.status}`);
                    }
                    const mediaData = await mediaResponse.json();
                    return mediaData.guid?.rendered || '';
                } catch (err) {
                    return '';
                }
            });

            const urls = await Promise.all(certificatePromises);
            return urls.filter(url => url !== '');
        } catch (err) {
            return [];
        }
    };

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true);
                setError(null);

                const baseUrl = getBaseUrl();

                // Сначала пробуем найти врача по slug и текущему языку
                let requestUrl = `${baseUrl}/wp-json/wp/v2/doctors?slug=${slug}&lang=${language}&_embed&acf_format=standard`;

                let response = await fetch(requestUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });

                let data = await response.json();

                // Если врач не найден на текущем языке, ищем на другом языке и находим translation
                if (data.length === 0) {
                    console.log(`Doctor not found for slug "${slug}" and language "${language}". Trying to find translation.`);

                    // Определяем другой язык
                    const otherLanguage = language === 'uk' ? 'ru' : 'uk';

                    // Ищем врача на другом языке
                    const fallbackUrl = `${baseUrl}/wp-json/wp/v2/doctors?slug=${slug}&lang=${otherLanguage}&_embed&acf_format=standard`;
                    const fallbackResponse = await fetch(fallbackUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        }
                    });

                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        if (fallbackData.length > 0) {
                            const fallbackDoctor = fallbackData[0];
                            console.log(`Found doctor on other language:`, fallbackDoctor.translations);

                            // Если есть translations, находим врача на текущем языке
                            if (fallbackDoctor.translations && fallbackDoctor.translations[language]) {
                                const translatedId = fallbackDoctor.translations[language];
                                console.log(`Found translation ID: ${translatedId} for language ${language}`);

                                const translationUrl = `${baseUrl}/wp-json/wp/v2/doctors/${translatedId}?_embed&acf_format=standard`;
                                response = await fetch(translationUrl, {
                                    method: 'GET',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    }
                                });

                                if (response.ok) {
                                    data = [await response.json()];
                                    console.log(`Successfully loaded translated doctor:`, data[0]?.title?.rendered);
                                } else {
                                    throw new Error('Failed to load translated doctor');
                                }
                            } else {
                                throw new Error('No translation found for doctor');
                            }
                        } else {
                            throw new Error('Doctor not found on any language');
                        }
                    } else {
                        throw new Error('Doctor not found');
                    }
                }

                if (data.length === 0) {
                    throw new Error('Doctor not found');
                }

                // Обрабатываем данные врача - извлекаем названия категорий
                const doctorData = data[0];
                const categoryNames = doctorData._embedded?.["wp:term"]?.[0]?.map((cat: any) => cat.name) || [];

                const processedDoctor = {
                    ...doctorData,
                    category_names: categoryNames
                };

                setDoctor(processedDoctor);

                // Получаем URL сертификатов, если они есть как ID
                if (processedDoctor.acf?.doctor_certificates && Array.isArray(processedDoctor.acf.doctor_certificates)) {
                    // Проверяем, являются ли элементы массива числами (ID)
                    const certificateIds = processedDoctor.acf.doctor_certificates.filter((item): item is number =>
                        typeof item === 'number'
                    );

                    if (certificateIds.length > 0) {
                        const certificateUrls = await fetchCertificateUrls(certificateIds);
                        setCertificates(certificateUrls);
                    } else {
                        // Если это уже URL, используем их напрямую
                        const certificateUrls = processedDoctor.acf.doctor_certificates.filter((item): item is string =>
                            typeof item === 'string' && item.startsWith('http')
                        );
                        setCertificates(certificateUrls);
                    }
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch doctor');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchDoctor();
        }
    }, [slug, language]);

    // Безопасное извлечение значений
    const getSafeString = (field: any): string => {
        if (!field) return '';
        if (typeof field === 'string') return field;
        if (typeof field === 'object') return Object.values(field).join(', ');
        return String(field || '');
    };

    // Получение изображения врача
    const getDoctorImage = (doctor: DoctorData): string => {
        const acfImage = getSafeString(doctor.acf?.doctor_avatar);
        if (acfImage) return acfImage;

        const featuredImage = doctor._embedded?.['wp:featuredmedia']?.[0]?.source_url;
        if (featuredImage) return featuredImage;

        return '';
    };

    // Получение информации о враче с учетом языка
    const getDoctorInfo = (doctor: DoctorData) => {
        const ruInfo = getSafeString(doctor.acf?.doctor_info_ru);
        const ukInfo = doctor.acf?.doctor_info;

        // Возвращаем объект с гарантированными свойствами
        let specialization = '';
        let experience = '';
        let fullInfo = '';

        if (language === 'ru' && ruInfo) {
            fullInfo = ruInfo;
        } else if (ukInfo && typeof ukInfo === 'object') {
            specialization = getSafeString(ukInfo.doctor_specialization);
            experience = getSafeString(ukInfo.doctor_experience);
        } else {
            fullInfo = getSafeString(ukInfo);
        }

        return {
            specialization,
            experience,
            fullInfo
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header postId="" />
                <main className="flex-1">
                    <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto">
                                <div className="h-12 bg-muted rounded w-1/3 mx-auto mb-4 animate-pulse"></div>
                                <div className="h-6 bg-muted rounded w-2/3 mx-auto animate-pulse"></div>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header postId="" />
                <main className="flex-1">
                    <section className="py-20 bg-gradient-to-b from-medical-gray-light/30 to-background">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl mx-auto text-center">
                                <h1 className="text-5xl font-bold text-foreground mb-8">
                                    {translations.common.error[language]}
                                </h1>
                                <p className="text-muted-foreground text-lg mb-8">
                                    {error || (language === 'ru' ? 'Врач не найден' : 'Лікар не знайдений')}
                                </p>
                                <Button onClick={() => navigate('/doctors')} variant="outline">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {translations.common.back[language]}
                                </Button>
                            </div>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        );
    }

    const doctorImage = getDoctorImage(doctor);
    const doctorInfo = getDoctorInfo(doctor);

    return (
        <div className="min-h-screen flex flex-col">
            <Header postId="" />
            <main className="flex-1">
                {/* Back Button */}
                <section className="py-6 border-b bg-background">
                    <div className="container">
                        <Button variant="ghost" onClick={() => navigate("/doctors")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {language === 'ru' ? 'Вернуться к списку врачей' : 'Повернутися до списку лікарів'}
                        </Button>
                    </div>
                </section>

                {/* Doctor Profile Header */}
                <section className="py-12 bg-gradient-to-br from-medical-gray-light via-background to-secondary/30">
                    <div className="container">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <Card className="overflow-hidden">
                                    <div className="relative h-96 bg-gradient-to-br from-medical-gray-light to-secondary/30">
                                        {doctorImage ? (
                                            <img
                                                src={doctorImage}
                                                alt={doctor.title.rendered}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <div class="text-6xl text-primary/40">👨‍⚕️</div>
                            </div>
                          `;
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-6xl text-primary/40">👨‍⚕️</div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>

                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <Badge className="mb-3">{doctor.category_names?.[0] || doctorInfo.specialization}</Badge>
                                    <h1 className="text-4xl font-bold mb-2">{doctor.title.rendered}</h1>
                                    {doctorInfo.experience && doctorInfo.experience.trim() && (
                                        <p className="text-muted-foreground">
                                            {(language === 'ru' ? 'Опыт:' : 'Досвід:')}: {doctorInfo.experience}
                                        </p>
                                    )}
                                </div>

                                {doctorInfo.fullInfo && (
                                    <p className="text-lg">{doctorInfo.fullInfo}</p>
                                )}

                                <BookingDialog />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Biography */}
                {doctor.acf?.doctor_about && (
                    <section className="py-12">
                        <div className="container">
                            <h2 className="text-3xl font-bold mb-6">{language === 'ru' ? 'Биография' : 'Біографія'}</h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <div
                                        className="text-lg leading-relaxed prose prose-lg max-w-none"
                                        dangerouslySetInnerHTML={{ __html: doctor.acf.doctor_about }}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Additional Info */}
                {doctor.acf?.doctor_add_info && Array.isArray(doctor.acf.doctor_add_info) && doctor.acf.doctor_add_info.map((item, index) => {
                    if (item && typeof item === 'object' && item.acf_fc_layout === "doctor_add_list") {
                        return (
                            <section key={index} className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
                                <div className="container">
                                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                                        {item.doctor_list_title || ''}
                                    </h2>
                                    <Card>
                                        <CardContent className="pt-6">
                                            <ul className="space-y-4 grid md:grid-cols-2 gap-6">
                                                {item.doctor_list_repeater && Array.isArray(item.doctor_list_repeater) && item.doctor_list_repeater.map((edu, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                                                        <span className="text-base">{edu && typeof edu === 'object' ? edu.doctor_list_value || '' : ''}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            </section>
                        );
                    }
                    return null;
                })}

                {/* Certifications */}
                {certificates.length > 0 && (
                    <section className="py-12">
                        <div className="container">
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                                <Award className="h-8 w-8 text-primary" />
                                {language === 'ru' ? 'Сертификаты' : 'Сертифікати'}
                            </h2>
                            <div className="relative">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    spaceBetween={20}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{ clickable: true }}
                                    breakpoints={{
                                        640: {
                                            slidesPerView: 2,
                                            spaceBetween: 20,
                                        },
                                        1024: {
                                            slidesPerView: 3,
                                            spaceBetween: 30,
                                        },
                                    }}
                                    className="certificate-swiper"
                                >
                                    {certificates.map((certUrl, index) => (
                                        <SwiperSlide key={`certificate-${index}`}>
                                            <Card className="overflow-hidden">
                                                <CardContent className="p-0">
                                                    <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                                                        <img
                                                            src={certUrl}
                                                            alt={`${language === 'ru' ? 'Сертификат' : 'Сертифікат'} ${index + 1}`}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                e.currentTarget.parentElement!.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center text-gray-400">
                                    <Award className="w-12 h-12" />
                                  </div>
                                `;
                                                            }}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="container text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            {language === 'ru' ? 'Готовы записаться на прием?' : 'Готові записатися на прийом?'}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {language === 'ru'
                                ? 'Позвоните нам или заполните форму онлайн-записи'
                                : 'Зателефонуйте нам або заповніть форму онлайн-запису'
                            }
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg">
                                <Calendar className="mr-2 h-5 w-5" />
                                {language === 'ru' ? 'Записаться на прием' : 'Записатися на прийом'}
                            </Button>
                            <Button size="lg" variant="outline">
                                <Phone className="mr-2 h-5 w-5" />
                                {language === 'ru' ? 'Позвонить' : 'Зателефонувати'}
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default DoctorDetail;