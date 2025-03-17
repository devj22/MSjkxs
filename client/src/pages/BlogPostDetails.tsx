import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Calendar, 
  User, 
  Tag, 
  ArrowLeft,
  Share2,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function BlogPostDetails() {
  const [match, params] = useRoute<{ slug: string }>('/blog/:slug');
  
  const { 
    data: postData,
    isLoading,
    error 
  } = useQuery<{ success: boolean; data: BlogPost }>({
    queryKey: ['/api/blog', params?.slug],
    enabled: !!params?.slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const post: BlogPost | undefined = postData?.data;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog">
          <Button className="bg-primary hover:bg-primary/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="font-body text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Navigation and Share */}
          <div className="flex justify-between items-center mb-6">
            <Link href="/blog">
              <Button variant="outline" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-sky-500 hover:text-sky-600 hover:bg-sky-50">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-700 hover:text-blue-800 hover:bg-blue-50">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-700 hover:bg-gray-100">
                <LinkIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Tag className="h-4 w-4 mr-1" />
                {post.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.createdAt)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-600">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">By {post.author}</span>
              </div>
              <div className="mx-4">•</div>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="mb-10 rounded-lg overflow-hidden shadow-sm">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
          
          {/* Article Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-10 mb-10">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
          
          {/* Author Bio */}
          <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author)}&background=random`}
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{post.author}</h3>
                <p className="text-gray-600 mb-4">
                  Real estate expert with over 10 years of experience in the market. 
                  Specializes in residential properties and investment opportunities.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    More Articles
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Articles Section Placeholder */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-600">
                More articles related to {post.category} will be coming soon!
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}