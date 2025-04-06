import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { COMPANY_INFO } from "@/lib/constants";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsPending(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate("/admin");
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            {COMPANY_INFO.name} Admin
          </h1>
          <p className="text-gray-600">
            Sign in to access the admin dashboard.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="mb-2 block">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="mb-2 block">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isPending || isLoading}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
            
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>For demo purposes:</p>
              <p>Username: <span className="font-mono">admin</span></p>
              <p>Password: <span className="font-mono">admin123</span></p>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="link" onClick={() => navigate("/")}>
            Back to Website
          </Button>
        </div>
      </div>
    </div>
  );
}