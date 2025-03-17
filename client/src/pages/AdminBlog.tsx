import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Plus, 
  Search, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2,
  Eye,
  Calendar,
  Tag,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function AdminBlog() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  
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
  
  // Filter posts based on search term
  const filteredPosts = searchTerm 
    ? posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get excerpt from content
  const getExcerpt = (content: string, maxLength: number = 70) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="font-body text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
                Manage Blog Posts
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Input
                  placeholder="Search blog posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-auto min-w-[250px]"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Link href="/admin/blog/add">
                <a>
                  <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Blog Post
                  </Button>
                </a>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg">Error loading blog posts. Please try again later.</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No blog posts found</h3>
                {searchTerm ? (
                  <p className="text-gray-500">Try adjusting your search term or add a new blog post.</p>
                ) : (
                  <p className="text-gray-500">Get started by adding your first blog post.</p>
                )}
                <div className="mt-6">
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
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Title</TableHead>
                      <TableHead className="hidden md:table-cell">Excerpt</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                              <img 
                                src={post.imageUrl} 
                                alt={post.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="truncate max-w-[180px]">
                              <div className="font-medium text-primary truncate">{post.title}</div>
                              <div className="text-xs text-gray-500">
                                Slug: {post.slug}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {getExcerpt(post.summary)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span>{post.author}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-normal">
                            {post.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                  <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/blog/${post.slug}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Post
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link href={`/admin/blog/edit/${post.id}`}>
                                  <a className="flex items-center w-full">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Post
                                  </a>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Post
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}