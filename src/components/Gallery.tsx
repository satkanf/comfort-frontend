import {Card} from "@/components/ui/card.tsx";
import { useState, useEffect } from "react";
import { fetchImageUrls } from "@/utils/api";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface GalleryProps {
    pageData: any;
}

const Gallery: React.FC<GalleryProps> = ({ pageData }) => {
    const [galleryImages, setGalleryImages] = useState<string[]>([]);

    // Загружаем URL изображений для галереи
    useEffect(() => {
        const loadGalleryImages = async () => {
            if (pageData?.acf?.add_block) {
                const galleryBlock = pageData.acf.add_block.find((block: any) => block.acf_fc_layout === 'gallery');
                if (galleryBlock?.gallery_add && Array.isArray(galleryBlock.gallery_add)) {
                    const imageUrls = await fetchImageUrls(galleryBlock.gallery_add);
                    setGalleryImages(imageUrls);
                }
            }
        };

        if (pageData) {
            loadGalleryImages();
        }
    }, [pageData]);

    return (
        <section className="py-12 bg-secondary/20">
            <div className="container">
                {galleryImages.length > 0 ? (
                    <div className="relative">
                        <Swiper
                            modules={[Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                                el: '.gallery-pagination',
                            }}
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
                            className="gallery-swiper"
                        >
                            {galleryImages.map((img, i) => (
                                <SwiperSlide key={i}>
                                    <Card className="overflow-hidden">
                                        <img
                                            src={img}
                                            alt={`Фото галереї ${i + 1}`}
                                            className="w-full h-64 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </Card>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Пагинация ниже слайдера */}
                        <div className="gallery-pagination flex justify-center mt-6 space-x-2"></div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p>Завантаження зображень...</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Gallery;