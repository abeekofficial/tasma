import { toast } from "sonner";

interface FetchOptions extends RequestInit {
  data?: any;
}

const BASE_URL = "/api/v1";

async function fetchClient(endpoint: string, { data, headers: customHeaders, ...customConfig }: FetchOptions = {}) {
  const config: RequestInit = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    headers: {
      "Content-Type": data ? "application/json" : "",
      ...(customHeaders as Record<string, string>),
    },
    ...customConfig,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || "An unexpected error occurred.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
    return response.json();
  } catch (error: any) {
    if (error.name !== "Error") {
      toast.error("Network error or unavailable service.");
    }
    throw error;
  }
}

export const api = {
  get: (endpoint: string, config?: FetchOptions) => fetchClient(endpoint, { ...config, method: "GET" }),
  post: (endpoint: string, data: any, config?: FetchOptions) => fetchClient(endpoint, { ...config, data, method: "POST" }),
  patch: (endpoint: string, data: any, config?: FetchOptions) => fetchClient(endpoint, { ...config, data, method: "PATCH" }),
  delete: (endpoint: string, config?: FetchOptions) => fetchClient(endpoint, { ...config, method: "DELETE" }),
};
