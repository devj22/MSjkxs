import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient"; 
import { InsertBlogPost } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

export default function AdminAddBlogPost() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [category, setCategory] = useState("Land Investment");
  const [imageUrl, setImageUrl] = useState("");
  const [previewTab, setPreviewTab] = useState<string>("edit");
  
  // Generate slug from title
  const generateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };
  
  // Create blog post mutation
  const createBlogPostMutation = useMutation({
    mutationFn: async (blogData: InsertBlogPost) => {
      console.log("Sending blog data:", JSON.stringify(blogData, null, 2));
      console.log("Current authentication state:", document.cookie);
      
      try {
        const response = await apiRequest<{ success: boolean; data: any }>("/api/blog", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(blogData),
        });
        
        console.log("Blog post creation response:", response);
        return response;
      } catch (err) {
        console.error("Raw error from blog post creation:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log("Blog post creation successful:", data);
      toast({
        title: "Blog Post Added",
        description: "The blog post has been published successfully.",
      });
      navigate("/admin/blog");
    },
    onError: (error: any) => {
      console.error("Error adding blog post:", error);
      
      let errorMsg = "Failed to publish blog post. Please try again.";
      if (error?.message) {
        errorMsg = error.message;
      }
      
      if (error?.status === 401) {
        errorMsg = "You need to log in to publish a blog post.";
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
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!slug) {
      toast({
        title: "Error",
        description: "Slug is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!summary) {
      toast({
        title: "Error",
        description: "Summary is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!content) {
      toast({
        title: "Error",
        description: "Content is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!author) {
      toast({
        title: "Error",
        description: "Author is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!category) {
      toast({
        title: "Error",
        description: "Category is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Image URL is required.",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure all fields are strings
    const blogData: InsertBlogPost = {
      title: String(title),
      slug: String(slug),
      summary: String(summary),
      content: String(content),
      author: String(author),
      category: String(category),
      imageUrl: String(imageUrl),
    };
    
    console.log("Submitting blog data:", blogData);
    createBlogPostMutation.mutate(blogData);
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
                Add New Blog Post
              </h1>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90" 
              disabled={createBlogPostMutation.isPending}
              onClick={handleSubmit}
            >
              {createBlogPostMutation.isPending ? (
                "Publishing..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Publish Post
                </>
              )}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="mb-2 block">Post Title*</Label>
                      <Input
                        id="title"
                        placeholder="e.g., 5 Tips for Investing in Agricultural Land"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={generateSlug}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="slug" className="mb-2 block">
                        Slug* <span className="text-sm text-gray-500">(URL-friendly identifier)</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="slug"
                          placeholder="e.g., 5-tips-investing-agricultural-land"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateSlug}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="summary" className="mb-2 block">Summary*</Label>
                      <Textarea
                        id="summary"
                        placeholder="Brief summary about land investment tips, market trends, or development opportunities..."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor="content">Content* <span className="text-sm text-gray-500">(Markdown supported)</span></Label>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={previewTab === "edit" ? "text-primary font-semibold" : "text-gray-500"}
                            onClick={() => setPreviewTab("edit")}
                          >
                            Edit
                          </Button>
                          <span className="mx-2 text-gray-300">|</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className={previewTab === "preview" ? "text-primary font-semibold" : "text-gray-500"}
                            onClick={() => setPreviewTab("preview")}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Preview
                          </Button>
                        </div>
                      </div>
                      <Tabs value={previewTab} onValueChange={setPreviewTab} className="w-full">
                        <TabsContent value="edit" className="mt-0">
                          <Textarea
                            id="content"
                            placeholder="Write your post content here... Markdown formatting is supported."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={15}
                            required
                            className="font-mono text-sm"
                          />
                        </TabsContent>
                        <TabsContent value="preview" className="mt-0">
                          <div className="border border-gray-200 rounded-md p-4 min-h-[300px] prose max-w-none">
                            {content ? (
                              <ReactMarkdown>{content}</ReactMarkdown>
                            ) : (
                              <p className="text-gray-400 italic">No content to preview</p>
                            )}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publication Details */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Publication Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="author" className="mb-2 block">Author*</Label>
                    <Input
                      id="author"
                      placeholder="e.g., John Doe"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category" className="mb-2 block">Category*</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Land Investment, Agricultural, Commercial Development"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Featured Image */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Featured Image</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageUrl" className="mb-2 block">Image URL*</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      required
                    />
                  </div>
                  
                  {imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <div className="rounded-md overflow-hidden h-[200px] border border-gray-200">
                        <img
                          src={imageUrl}
                          alt="Featured"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x600?text=Invalid+Image+URL";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <Button
                  type="button"
                  className="w-full bg-primary hover:bg-primary/90 mb-2"
                  disabled={createBlogPostMutation.isPending}
                  onClick={handleSubmit}
                >
                  {createBlogPostMutation.isPending ? (
                    "Publishing..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Publish Post
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/admin")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}