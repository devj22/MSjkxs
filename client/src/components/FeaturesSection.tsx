import { Home, Handshake, TrendingUp } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">Why Choose Us</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">Discover the NainaLand advantage and see why clients trust us with their real estate needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105">
            <div className="text-amber-500 text-4xl mb-4">
              <Home className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Extensive Property Portfolio</h3>
            <p className="text-gray-600">
              Access to a wide range of residential and commercial properties in prime locations to suit your requirements.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105">
            <div className="text-amber-500 text-4xl mb-4">
              <Handshake className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Client-Focused Approach</h3>
            <p className="text-gray-600">
              We prioritize your needs and preferences, providing personalized solutions that align with your goals.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform duration-300 hover:scale-105">
            <div className="text-amber-500 text-4xl mb-4">
              <TrendingUp className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">Market Expertise</h3>
            <p className="text-gray-600">
              Deep understanding of real estate trends and market dynamics to help you make informed decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
