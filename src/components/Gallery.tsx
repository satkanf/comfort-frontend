import {Card} from "@/components/ui/card.tsx";
import { useState, useEffect } from "react";
import { fetchImageUrls } from "@/utils/api";

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
                <div className="grid md:grid-cols-3 gap-6">
                    {galleryImages.length > 0 ? galleryImages.map((img, i) => (
                        <Card key={i} className="overflow-hidden">
                            <img
                                src={img}
                                alt="Інтер'єр клініки"
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </Card>
                    )) : (
                        <div className="col-span-3 text-center py-8">
                            <p>Завантаження зображень...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Gallery;