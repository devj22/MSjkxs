import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  Search, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight
} from "lucide-react";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Fetch all blog posts
  const { 
    data: blogData,
    isLoading,
    error 
  } = useQuery<{ success: boolean; data: BlogPost[] }>({
    queryKey: ['/api/blog'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const posts: BlogPost[] = blogData?.data || [];
  
  // Get unique categories
  const categories = posts ? 
    Array.from(new Set(posts.map(post => post.category))) : 
    [];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!posts) return;
    
    if (searchTerm.trim() === "") {
      setFilteredPosts([]);
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const results = posts.filter(post => 
        post.title.toLowerCase().includes(searchTermLower) ||
        post.summary.toLowerCase().includes(searchTermLower) ||
        post.content.toLowerCase().includes(searchTermLower) ||
        post.author.toLowerCase().includes(searchTermLower) ||
        post.category.toLowerCase().includes(searchTermLower)
      );
      setFilteredPosts(results);
    }
  };
  
  const filterByCategory = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      setFilteredPosts([]);
    } else {
      setActiveCategory(category);
      if (!posts) return;
      const results = posts.filter(post => post.category === category);
      setFilteredPosts(results);
    }
  };
  
  // Display either filtered posts or all posts
  const displayPosts = filteredPosts.length > 0 || activeCategory || searchTerm.trim() !== "" ? 
    filteredPosts : 
    posts;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="font-body text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
              Real Estate Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Stay informed with the latest real estate news, market trends, and helpful advice from our experts.
            </p>
          </div>

          {/* Search and Categories */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Search
                </Button>
                {(filteredPosts.length > 0 || searchTerm.trim() !== "") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setFilteredPosts([]);
                    }}
                    className="border-gray-300"
                  >
                    Clear
                  </Button>
                )}
              </form>
            </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => filterByCategory(category)}
                  className={`${
                    activeCategory === category 
                      ? "bg-primary hover:bg-primary/90" 
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </Button>
              ))}
              {activeCategory && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setActiveCategory(null);
                    setFilteredPosts([]);
                  }}
                  className="text-gray-500 hover:text-primary"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Blog Posts */}
          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg">Error loading blog posts. Please try again later.</p>
              </div>
            ) : displayPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or category filters.</p>
              </div>
            ) : (
              <div className="grid gap-8">
                {displayPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover aspect-video md:aspect-auto"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Tag className="h-3 w-3 mr-1" />
                            {post.category}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(post.createdAt)}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <User className="h-3 w-3 mr-1" />
                            {post.author}
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold mb-3 text-primary line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.summary}
                        </p>
                        <Link href={`/blog/${post.slug}`}>
                          <Button 
                            variant="link" 
                            className="p-0 text-primary hover:text-primary/90 underline-offset-4"
                          >
                            Read More
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}