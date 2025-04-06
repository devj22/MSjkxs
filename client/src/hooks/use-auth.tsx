import { 
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthStatusResponse {
  success: boolean;
  authenticated: boolean;
  user?: {
    id: number;
    username: string;
  };
}

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    username: string;
  };
}

type User = {
  id: number;
  username: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Setup auth status query
  const {
    data: authData,
    isLoading,
    refetch: refetchAuthStatus,
  } = useQuery<AuthStatusResponse>({
    queryKey: ["auth", "status"],
    queryFn: async () => {
      try {
        return await apiRequest<AuthStatusResponse>("/api/auth/status");
      } catch (error) {
        return { success: true, authenticated: false };
      }
    },
    refetchInterval: 5000, // Refetch every 5 seconds to ensure fresh auth state
    refetchOnWindowFocus: true, // Refetch when window gets focus
  });

  const isAuthenticated = authData?.authenticated || false;
  const user = authData?.user || null;

  // Login mutation
  const loginMutation = useMutation<
    LoginResponse, 
    Error, 
    { username: string; password: string }
  >({
    mutationFn: async (credentials) => {
      try {
        return await apiRequest<LoginResponse>("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
      } catch (error: any) {
        if (error.status === 401) {
          return { success: false, message: "Invalid username or password" };
        }
        throw error;
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation<{success: boolean; message?: string}, Error>({
    mutationFn: async () => {
      return await apiRequest("/api/auth/logout", {
        method: "POST",
      });
    },
  });

  // Login handler
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await loginMutation.mutateAsync({ username, password });
      
      if (result.success) {
        // Immediately refetch auth status after login
        await refetchAuthStatus();
        
        // Also invalidate the query to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ["auth", "status"] });
        
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard.",
        });
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Logout handler
  const logout = async (): Promise<void> => {
    try {
      await logoutMutation.mutateAsync();
      // Invalidate auth status query to fetch new state
      queryClient.invalidateQueries({ queryKey: ["auth", "status"] });
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/admin/login");
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Protected route component
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("ProtectedRoute - Auth state:", { isAuthenticated, isLoading, user });
      
      if (!isLoading && !isAuthenticated) {
        console.log("Not authenticated, redirecting to login page");
        
        // Use window.location for a hard redirect instead of wouter
        window.location.href = "/admin/login";
      }
    };
    
    checkAuth();
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we get to this point and not authenticated, show a message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="mb-4">Please log in to access the admin dashboard.</p>
          <button 
            onClick={() => window.location.href = "/admin/login"} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}