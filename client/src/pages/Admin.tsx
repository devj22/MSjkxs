import { useState } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Home, 
  Newspaper, 
  Mail, 
  Settings, 
  LogOut,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Admin() {
  const [, navigate] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo purposes, we assume user is authenticated
  
  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    navigate("/admin/login");
    return null;
  }

  return (
    <div className="font-body text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-gray-600">Welcome, Admin</span>
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-3 lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  <Link href="/admin">
                    <a className="flex items-center p-2 rounded-md text-gray-800 bg-gray-100 font-medium">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/admin/properties">
                    <a className="flex items-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                      <Home className="mr-2 h-4 w-4" />
                      Properties
                    </a>
                  </Link>
                  <Link href="/admin/blog">
                    <a className="flex items-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                      <Newspaper className="mr-2 h-4 w-4" />
                      Blog Posts
                    </a>
                  </Link>
                  <Link href="/admin/contact">
                    <a className="flex items-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Inquiries
                    </a>
                  </Link>
                  <Link href="/admin/settings">
                    <a className="flex items-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </a>
                  </Link>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10">
              {/* Dashboard Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-3xl font-bold text-primary">12</div>
                    <div className="text-gray-600">Total Properties</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-3xl font-bold text-primary">8</div>
                    <div className="text-gray-600">Blog Posts</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-3xl font-bold text-primary">24</div>
                    <div className="text-gray-600">Inquiries</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="text-3xl font-bold text-primary">128</div>
                    <div className="text-gray-600">Visitors</div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                  <Link href="/admin/properties/add">
                    <a>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Property
                      </Button>
                    </a>
                  </Link>
                  <Link href="/admin/blog/add">
                    <a>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Blog Post
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <Tabs defaultValue="properties">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="properties">Properties</TabsTrigger>
                    <TabsTrigger value="blog">Blog Posts</TabsTrigger>
                    <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                  </TabsList>
                  <TabsContent value="properties">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium">Luxury Villa in Highland Park</div>
                          <div className="text-sm text-gray-600">Added on March 15, 2025</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">$2,350,000</div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium">Modern Apartment in Downtown</div>
                          <div className="text-sm text-gray-600">Added on March 12, 2025</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">$850,000</div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium">Cozy Studio near University</div>
                          <div className="text-sm text-gray-600">Added on March 10, 2025</div>
                        </div>
                        <div className="text-sm font-medium text-green-600">$1,200/month</div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="blog">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium">Top 10 Neighborhoods in 2025</div>
                          <div className="text-sm text-gray-600">Published on March 16, 2025</div>
                        </div>
                        <div className="text-sm font-medium text-blue-600">42 views</div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium">How to Stage Your Home for a Quick Sale</div>
                          <div className="text-sm text-gray-600">Published on March 14, 2025</div>
                        </div>
                        <div className="text-sm font-medium text-blue-600">28 views</div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium">Mortgage Rates Forecast for 2025</div>
                          <div className="text-sm text-gray-600">Published on March 8, 2025</div>
                        </div>
                        <div className="text-sm font-medium text-blue-600">76 views</div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="inquiries">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium">John Doe</div>
                          <div className="text-sm text-gray-600">Interested in Luxury Villa</div>
                        </div>
                        <div className="text-sm font-medium text-gray-600">2 hours ago</div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium">Jane Smith</div>
                          <div className="text-sm text-gray-600">Question about financing options</div>
                        </div>
                        <div className="text-sm font-medium text-gray-600">Yesterday</div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center p-3 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium">Robert Johnson</div>
                          <div className="text-sm text-gray-600">Scheduling a property visit</div>
                        </div>
                        <div className="text-sm font-medium text-gray-600">2 days ago</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">View All Activity</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}