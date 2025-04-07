import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient"; 
import { InsertProperty } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function AdminAddProperty() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  // We still track these state variables for hidden inputs
  const [bedrooms, setBedrooms] = useState<number>(0); 
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [propertyType, setPropertyType] = useState("Land");
  const [forSale, setForSale] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [latitude, setLatitude] = useState<number>(40.7128);
  const [longitude, setLongitude] = useState<number>(-74.0060);
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  
  // Handle image URL changes
  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };
  
  // Add new image URL field
  const addImageUrl = () => {
    setImageUrls([...imageUrls, ""]);
  };
  
  // Remove image URL field
  const removeImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      const newImageUrls = [...imageUrls];
      newImageUrls.splice(index, 1);
      setImageUrls(newImageUrls);
    }
  };
  
  // Create property mutation
  const createPropertyMutation = useMutation({
    mutationFn: async (propertyData: InsertProperty) => {
      console.log("Sending property data:", JSON.stringify(propertyData, null, 2));
      console.log("Current authentication state:", document.cookie);
      
      try {
        const response = await apiRequest<{ success: boolean; data: any }>("/api/properties", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(propertyData),
        });
        
        console.log("Property creation response:", response);
        return response;
      } catch (err) {
        console.error("Raw error from property creation:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log("Property creation successful:", data);
      toast({
        title: "Land Property Added",
        description: "The land property has been added successfully.",
      });
      navigate("/admin/properties");
    },
    onError: (error: any) => {
      console.error("Error adding property:", error);
      
      let errorMsg = "Failed to add property. Please try again.";
      if (error?.message) {
        errorMsg = error.message;
      }
      
      if (error?.status === 401) {
        errorMsg = "You need to log in to add a property.";
        // Navigate to login page
        navigate("/admin/login");
      }
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!title) {
      toast({ title: "Error", description: "Title is required", variant: "destructive" });
      return;
    }
    
    if (!description) {
      toast({ title: "Error", description: "Description is required", variant: "destructive" });
      return;
    }
    
    if (!location) {
      toast({ title: "Error", description: "Location is required", variant: "destructive" });
      return;
    }
    
    if (!address) {
      toast({ title: "Error", description: "Address is required", variant: "destructive" });
      return;
    }
    
    if (!area || area <= 0) {
      toast({ title: "Error", description: "Area must be greater than 0", variant: "destructive" });
      return;
    }
    
    if (!price || price <= 0) {
      toast({ title: "Error", description: "Price must be greater than 0", variant: "destructive" });
      return;
    }
    
    // Filter out empty image URLs
    const filteredImageUrls = imageUrls.filter((url) => url.trim() !== "");
    
    if (filteredImageUrls.length === 0) {
      toast({
        title: "Error",
        description: "At least one image URL is required.",
        variant: "destructive",
      });
      return;
    }
    
    const propertyData: InsertProperty = {
      title,
      description,
      price,
      location,
      address,
      bedrooms: 0, // Always 0 for land properties
      bathrooms: 0, // Always 0 for land properties
      area,
      propertyType,
      forSale,
      featured,
      latitude,
      longitude,
      imageUrls: filteredImageUrls,
    };
    
    console.log("Submitting property data:", propertyData);
    createPropertyMutation.mutate(propertyData);
  };

  return (
    <div className="font-body text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/admin")}
                className="mr-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-display font-bold text-primary">
                Add New Land Property
              </h1>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              disabled={createPropertyMutation.isPending}
              onClick={handleSubmit}
            >
              {createPropertyMutation.isPending ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Property
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="mb-2 block">Title*</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Prime Land Plot in Nainaland Estates"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="mb-2 block">Price*</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="e.g., 1000000"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className="mb-2 block">Description*</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the land plot, including features, vegetation, terrain, utilities, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="mb-2 block">Location*</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Downtown Chicago"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="mb-2 block">Full Address*</Label>
                    <Input
                      id="address"
                      placeholder="e.g., 123 Main St, Chicago, IL 60601"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="area" className="mb-2 block">Land Area (sq ft)*</Label>
                    <Input
                      id="area"
                      type="number"
                      min="0"
                      placeholder="e.g., 10000"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyType" className="mb-2 block">Land Type*</Label>
                    <Input
                      id="propertyType"
                      placeholder="e.g., Residential, Commercial, Agricultural"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zoning" className="mb-2 block">Zoning/Usage</Label>
                    <Input
                      id="zoning"
                      placeholder="e.g., Residential, Commercial, Mixed-use"
                      defaultValue="Residential"
                    />
                  </div>
                  
                  {/* No need for hidden inputs since we're hardcoding values to 0 in propertyData */}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="forSale"
                      checked={forSale}
                      onCheckedChange={setForSale}
                    />
                    <Label htmlFor="forSale">For Sale (unchecked means For Rent)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={featured}
                      onCheckedChange={setFeatured}
                    />
                    <Label htmlFor="featured">Featured Property</Label>
                  </div>
                </div>
              </div>
              
              {/* Map Coordinates */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Map Coordinates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude" className="mb-2 block">Latitude*</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      placeholder="e.g., 40.7128"
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude" className="mb-2 block">Longitude*</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      placeholder="e.g., -74.0060"
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Images */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Property Images</h2>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addImageUrl}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </div>
                
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-grow">
                      <Label htmlFor={`image-${index}`} className="mb-2 block">
                        Image URL {index + 1}{index === 0 ? '*' : ''}
                      </Label>
                      <Input
                        id={`image-${index}`}
                        placeholder="https://example.com/image.jpg"
                        value={url}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        required={index === 0}
                      />
                    </div>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="self-end mb-0.5 text-gray-500 hover:text-red-500"
                        onClick={() => removeImageUrl(index)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
                <p className="text-sm text-gray-500">
                  * At least one image URL is required. Add multiple images for better presentation.
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={createPropertyMutation.isPending}
                >
                  {createPropertyMutation.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Property
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}