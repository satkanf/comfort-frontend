import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetail from "./pages/ServiceDetail";
import Doctors from "./pages/Doctors";
import DoctorDetail from "./pages/DoctorDetail";
import Prices from "./pages/Prices";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Blog from "./pages/Blog";
import Promotions from "./pages/Promotions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/golovna" element={<Index />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:poslugyId" element={<ServiceDetail />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:slug" element={<DoctorDetail />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/about" element={<About />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/promotion" element={<Promotions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
