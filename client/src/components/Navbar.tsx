import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Building, Newspaper, Lock } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true);
  const [location] = useLocation();

  // Check if we're on the home page
  useEffect(() => {
    setIsHomePage(location === '/');
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    // Only try to scroll if on home page
    if (isHomePage) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page with hash
      window.location.href = `/#${id}`;
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed w-full bg-white shadow-md z-50 transition-all duration-300" id="navbar">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 mr-2">
                <AspectRatio ratio={1}>
                  <img 
                    src="/WhatsApp_Image_2025-03-28_at_2.02.20_PM-removebg-preview-2.png" 
                    alt="NainaLand Logo" 
                    className="object-contain"
                  />
                </AspectRatio>
              </div>
              <span className="text-primary text-2xl font-display font-bold">Naina<span className="text-red-600">Land</span></span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" 
              className="flex items-center gap-1 text-primary hover:text-red-600 font-medium transition-colors duration-300"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link href="/properties" 
              className="flex items-center gap-1 text-primary hover:text-red-600 font-medium transition-colors duration-300"
            >
              <Building className="h-4 w-4" />
              Properties
            </Link>
            <Link href="/blog" 
              className="flex items-center gap-1 text-primary hover:text-red-600 font-medium transition-colors duration-300"
            >
              <Newspaper className="h-4 w-4" />
              Blog
            </Link>
            {isHomePage ? (
              <Button 
                className="bg-red-600 hover:bg-primary text-white px-4 py-2 rounded transition-colors duration-300"
                onClick={() => scrollToSection('contact')}
              >
                Contact Us
              </Button>
            ) : (
              <Link href="/#contact">
                <Button className="bg-red-600 hover:bg-primary text-white px-4 py-2 rounded transition-colors duration-300">
                  Contact Us
                </Button>
              </Link>
            )}
            <Link href="/admin/login" 
              className="flex items-center gap-1 text-gray-500 hover:text-primary font-medium transition-colors duration-300 ml-4"
            >
              <Lock className="h-4 w-4" />
              Admin
            </Link>
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
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" 
              className="flex items-center gap-2 py-2 text-primary hover:text-red-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link href="/properties" 
              className="flex items-center gap-2 py-2 text-primary hover:text-red-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Building className="h-4 w-4" />
              Properties
            </Link>
            <Link href="/blog" 
              className="flex items-center gap-2 py-2 text-primary hover:text-red-600 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Newspaper className="h-4 w-4" />
              Blog
            </Link>
            {isHomePage ? (
              <Button 
                className="block w-full bg-red-600 text-white px-4 py-2 rounded mt-2 text-center"
                onClick={() => scrollToSection('contact')}
              >
                Contact Us
              </Button>
            ) : (
              <Link href="/#contact" className="block w-full">
                <Button className="w-full bg-red-600 text-white px-4 py-2 rounded mt-2 text-center"
                  onClick={() => setIsMenuOpen(false)}>
                  Contact Us
                </Button>
              </Link>
            )}
            
            <div className="pt-2 mt-2 border-t border-gray-200">
              <Link href="/admin/login" 
                className="flex items-center gap-2 py-2 text-gray-500 hover:text-primary font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Lock className="h-4 w-4" />
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
