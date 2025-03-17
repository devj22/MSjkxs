import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-gray-800/70"></div>
      <div className="container mx-auto px-4 relative z-10 py-20 md:py-0">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
            Find Your Dream Property with NainaLand
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100/90">
            Premium real estate solutions tailored to your needs and dreams.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-6 px-8 rounded-md text-lg shadow-lg hover:shadow-xl"
              onClick={() => scrollToSection('contact')}
            >
              Contact Us Today
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-medium py-6 px-8 rounded-md text-lg"
              onClick={() => scrollToSection('about')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
