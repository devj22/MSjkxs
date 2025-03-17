import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import Blog from "@/pages/Blog";
import BlogPostDetails from "@/pages/BlogPostDetails";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AdminProperties from "./pages/AdminProperties";
import AdminAddProperty from "./pages/AdminAddProperty";
import AdminBlog from "./pages/AdminBlog";
import AdminAddBlogPost from "./pages/AdminAddBlogPost";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/properties" component={Properties} />
      <Route path="/property/:id" component={PropertyDetails} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPostDetails} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/properties" component={AdminProperties} />
      <Route path="/admin/properties/add" component={AdminAddProperty} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/blog/add" component={AdminAddBlogPost} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
