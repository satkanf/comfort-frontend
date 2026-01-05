import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { lazy, Suspense } from "react";

// Lazy loading для страниц
const Index = lazy(() => import("./pages/Index"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const ServicesDetail = lazy(() => import("./pages/ServicesDetail"));
const Doctors = lazy(() => import("./pages/Doctors"));
const DoctorDetail = lazy(() => import("./pages/DoctorDetail"));
const Prices = lazy(() => import("./pages/Prices"));
const About = lazy(() => import("./pages/About"));
const Contacts = lazy(() => import("./pages/Contacts"));
const Blog = lazy(() => import("./pages/Blog"));
const Promotions = lazy(() => import("./pages/Promotions"));
const PromotionDetail = lazy(() => import("@/pages/PromotionDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      gcTime: 1000 * 60 * 30, // 30 минут (ранее cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: (failureCount, error) => {
        // Не повторять запросы при 4xx ошибках
        if (error && 'status' in error && typeof error.status === 'number') {
          return error.status >= 500 && failureCount < 2;
        }
        return failureCount < 2;
      },
    },
  },
});

const App = () => (

  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/golovna" element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServicesDetail />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/:slug" element={<DoctorDetail />} />
              <Route path="/price" element={<Prices />} />
              <Route path="/about" element={<About />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/promotion" element={<Promotions />} />
              <Route path="/promotion/:slug" element={<PromotionDetail />} />
              <Route path="ru/glavnaya" element={<Index />} />
              <Route path="ru/services" element={<ServicesPage />} />
              <Route path="ru/services/:slug" element={<ServicesDetail />} />
              <Route path="ru/doctors" element={<Doctors />} />
              <Route path="ru/doctors/:slug" element={<DoctorDetail />} />
              <Route path="ru/price" element={<Prices />} />
              <Route path="ru/about" element={<About />} />
              <Route path="ru/contacts" element={<Contacts />} />
              <Route path="ru/promotion" element={<Promotions />} />
            <Route path="ru/promotion/:slug" element={<PromotionDetail />} />
            <Route path="uk/golovna" element={<Index />} />
            <Route path="uk/services" element={<ServicesPage />} />
            <Route path="uk/services/:slug" element={<ServicesDetail />} />
            <Route path="uk/doctors" element={<Doctors />} />
            <Route path="uk/doctors/:slug" element={<DoctorDetail />} />
            <Route path="uk/price" element={<Prices />} />
            <Route path="uk/about" element={<About />} />
            <Route path="uk/contacts" element={<Contacts />} />
            <Route path="uk/promotion" element={<Promotions />} />
            <Route path="uk/promotion/:slug" element={<PromotionDetail />} />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
