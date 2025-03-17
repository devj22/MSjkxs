import { Button } from "@/components/ui/button";

export default function ParallaxSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="parallax py-32 relative"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-primary/70"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Find Your Perfect Property Today</h2>
          <p className="text-xl mb-8">Join hundreds of satisfied clients who found their dream properties with NainaLand Deals.</p>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-6 px-8 rounded-md text-lg shadow-lg hover:shadow-xl"
            onClick={() => scrollToSection('contact')}
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </section>
  );
}
