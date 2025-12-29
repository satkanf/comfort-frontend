import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import DoctorsSection from "@/components/DoctorsSection";
import BookingForm from "@/components/BookingForm";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { useMultilangPage } from "@/hooks/useMultilangPage";
import { useTestData } from "@/hooks/useTestData";
import ServicesSection from "@/components/Services.tsx";


const Index = () => {
    const { pageData, loading, error } = useMultilangPage('golovna');


    // Always render something to see what's happening
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">

                <Hero />
                <AboutSection />

                {/* Gallery Section */}
                {pageData?.acf?.add_block && pageData.acf.add_block.map((el, index) => {
                    switch (el.acf_fc_layout) {
                        case "gallery":
                            return (
                                <section key={index} className="py-12 bg-secondary/20">
                                    <div className="container">
                                        <h2 className="text-2xl font-bold mb-4">Gallery Block</h2>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            {el.gallery_add?.map((img, i) => (
                                                <Card key={i} className="overflow-hidden">
                                                    <img
                                                        src={img}
                                                        alt="Інтер'єр клініки"
                                                        className="w-full h-64 object-cover"
                                                    />
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            );

                        case "about_services":
                            return (
                                <section key={index} className="py-12">
                                    <ServicesSection acfFieldName="about_services_add" />
                                </section>
                            );

                        case "home_doctors":
                            return (
                                <section key={index}>
                                    <DoctorsSection acfFieldName="home_doctors_add" />
                                </section>
                            );

                        default:
                            return null;
                    }
                })}
                <BookingForm />
                <MapSection />
            </main>
            <Footer />
        </div>
    );
};

export default Index;
