import { CheckCircle } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">About Us</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto">Learn about NainaLand Deals and our commitment to excellence in real estate.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="About NainaLand Deals" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-primary mb-4">Your Trusted Real Estate Partner</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              At NainaLand Deals, we take pride in delivering exceptional real estate services with integrity and professionalism. With years of experience in the industry, our team of dedicated experts is committed to helping you find the perfect property that meets your needs and exceeds your expectations.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We understand that buying or selling a property is one of the most significant decisions in your life. That's why we offer personalized solutions tailored to your unique requirements, ensuring a smooth and stress-free experience throughout the process.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="text-red-600 mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Premium Properties</h4>
                  <p className="text-gray-600 text-sm">Exclusive listings in prime locations</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-red-600 mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Expert Guidance</h4>
                  <p className="text-gray-600 text-sm">Professional advice at every step</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-red-600 mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Personalized Service</h4>
                  <p className="text-gray-600 text-sm">Tailored to your unique needs</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-red-600 mr-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-primary">Transparent Process</h4>
                  <p className="text-gray-600 text-sm">Clear communication throughout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
