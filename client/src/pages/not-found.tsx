import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  const [location] = useLocation();

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-24">
        <Card className="w-full max-w-md mx-4 border-red-100 shadow-lg">
          <CardContent className="pt-10 pb-6 text-center">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">404</h1>
              <h2 className="text-xl font-semibold text-gray-700">Page Not Found</h2>
            </div>

            <p className="mt-4 text-gray-600">
              We couldn't find the page you're looking for. The page may have been moved, deleted, or never existed.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto flex items-center gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            {location !== "/" && (
              <Button 
                variant="outline" 
                className="w-full sm:w-auto flex items-center gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  );
}
