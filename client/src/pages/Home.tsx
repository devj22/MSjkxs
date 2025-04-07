import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import ParallaxSection from "@/components/ParallaxSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function Home() {
  // Handle navbar scroll effect
  useEffect(() => {
    const navbar = document.getElementById('navbar');
    
    function handleScroll() {
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('py-2');
          navbar.classList.remove('py-4');
        } else {
          navbar.classList.add('py-4');
          navbar.classList.remove('py-2');
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="font-body text-gray-800 bg-light">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <FeaturedProperties />
      <ParallaxSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
