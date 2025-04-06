import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, ProtectedRoute } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetails from "@/pages/PropertyDetails";
import Blog from "@/pages/Blog";
import BlogPostDetails from "@/pages/BlogPostDetails";

// Admin Pages
import DirectAdminLogin from "./pages/DirectAdminLogin";
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
      
      {/* Admin Login Route */}
      <Route path="/admin/login" component={DirectAdminLogin} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin">
        {() => (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/properties">
        {() => (
          <ProtectedRoute>
            <AdminProperties />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/properties/add">
        {() => (
          <ProtectedRoute>
            <AdminAddProperty />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/blog">
        {() => (
          <ProtectedRoute>
            <AdminBlog />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/blog/add">
        {() => (
          <ProtectedRoute>
            <AdminAddBlogPost />
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
