import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="inline-block mb-4">
              <span className="text-white text-2xl font-display font-bold">Naina<span className="text-red-600">Land</span></span>
            </a>
            <p className="text-gray-400 mb-6">
              Premium real estate solutions tailored to your needs. Finding your dream property is our passion.
            </p>
            <div className="flex space-x-4">
              <a href={COMPANY_INFO.socialMedia.facebook} className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={COMPANY_INFO.socialMedia.twitter} className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={COMPANY_INFO.socialMedia.instagram} className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={COMPANY_INFO.socialMedia.linkedin} className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#home" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Properties
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Services
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-amber-500 h-5 w-5 mr-3 mt-1" />
                <span className="text-gray-400">{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-start">
                <Phone className="text-amber-500 h-5 w-5 mr-3 mt-1" />
                <span className="text-gray-400">{COMPANY_INFO.phone}</span>
              </li>
              <li className="flex items-start">
                <Mail className="text-amber-500 h-5 w-5 mr-3 mt-1" />
                <span className="text-gray-400">{COMPANY_INFO.email}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Business Hours</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{COMPANY_INFO.businessHours.weekdays}</li>
              <li>{COMPANY_INFO.businessHours.saturday}</li>
              <li>{COMPANY_INFO.businessHours.sunday}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} NainaLand Deals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
