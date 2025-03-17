import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed w-full bg-white shadow-md z-50 transition-all duration-300" id="navbar">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>
              <span className="text-primary text-2xl font-display font-bold">Naina<span className="text-red-600">Land</span></span>
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className="text-primary hover:text-red-600 font-medium transition-colors duration-300"
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            >
              Home
            </a>
            <a 
              href="#about" 
              className="text-primary hover:text-red-600 font-medium transition-colors duration-300"
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            >
              About Us
            </a>
            <Button 
              className="bg-red-600 hover:bg-primary text-white px-4 py-2 rounded transition-colors duration-300"
              onClick={() => scrollToSection('contact')}
            >
              Contact Us
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu} 
              className="text-primary focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <a 
              href="#home" 
              className="block py-2 text-primary hover:text-red-600 font-medium"
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
            >
              Home
            </a>
            <a 
              href="#about" 
              className="block py-2 text-primary hover:text-red-600 font-medium"
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            >
              About Us
            </a>
            <Button 
              className="block w-full bg-red-600 text-white px-4 py-2 rounded mt-2 text-center"
              onClick={() => scrollToSection('contact')}
            >
              Contact Us
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
