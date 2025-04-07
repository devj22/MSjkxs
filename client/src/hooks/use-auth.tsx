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

// Define interfaces for API responses
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
  token?: string;
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

// Create a context for authentication
const AuthContext = createContext<AuthContextType | null>(null);

// Local token storage for the token-based auth
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

const clearAuthToken = () => {
  localStorage.removeItem('auth_token');
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Store the auth token in state for reactivity
  const [authToken, setToken] = useState<string | null>(getAuthToken());

  // Setup auth status query
  const {
    data: authData,
    isLoading,
    refetch: refetchAuthStatus
  } = useQuery<AuthStatusResponse>({
    queryKey: ["auth", "status"],
    queryFn: async () => {
      try {
        // Add cache-busting timestamp
        const timestamp = new Date().getTime();
        const token = getAuthToken();
        
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        return await apiRequest<AuthStatusResponse>(
          `/api/auth/status?_=${timestamp}`,
          { headers }
        );
      } catch (error) {
        console.error("Auth status error:", error);
        return { success: true, authenticated: false };
      }
    },
    // More aggressive refetching to ensure token state is current
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    staleTime: 5000,
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
        const response = await apiRequest<LoginResponse>("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        
        // Store the token in localStorage if provided
        if (response.success && response.token) {
          setAuthToken(response.token);
          setToken(response.token);
        }
        
        return response;
      } catch (error: any) {
        console.error("Login error:", error);
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
      const token = getAuthToken();
      const headers: Record<string, string> = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await apiRequest("/api/auth/logout", {
        method: "POST",
        headers
      });
      
      // Clear the token on successful logout
      clearAuthToken();
      setToken(null);
      
      return response;
    },
  });

  // Login handler
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const result = await loginMutation.mutateAsync({ username, password });
      
      if (result.success) {
        // Refresh auth status
        await refetchAuthStatus();
        
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
      console.error("Login error:", error);
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
      // Refresh auth status
      await refetchAuthStatus();
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
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
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}