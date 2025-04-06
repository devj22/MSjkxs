import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  urlOrOptions: string | RequestInit,
  options?: RequestInit,
): Promise<T> {
  let url: string;
  let fetchOptions: RequestInit;

  if (typeof urlOrOptions === 'string') {
    url = urlOrOptions;
    fetchOptions = options || {};
  } else {
    // This case is never used in our app, but kept for backward compatibility
    url = '';
    fetchOptions = urlOrOptions;
  }

  // Ensure content-type is set for JSON requests if the body is a string that can be parsed as JSON
  let headers = { ...fetchOptions.headers };
  if (
    typeof fetchOptions.body === 'string' && 
    !headers['Content-Type'] && 
    !headers['content-type']
  ) {
    try {
      JSON.parse(fetchOptions.body);
      headers['Content-Type'] = 'application/json';
    } catch (e) {
      // Not JSON, don't set content-type
    }
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) {
      const error: any = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }
    const text = await res.text();
    const error: any = new Error(text || res.statusText);
    error.status = res.status;
    throw error;
  }

  // Check if the response has content
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json() as T;
  }
  
  return {} as T;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
