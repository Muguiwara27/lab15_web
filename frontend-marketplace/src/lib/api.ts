const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://marketplace-pro-backend.onrender.com/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Algo salió mal");
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      fetchAPI<import("@/types/product").AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (data: { name: string; email: string; password: string }) =>
      fetchAPI<import("@/types/product").AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    profile: (token: string) =>
      fetchAPI<import("@/types/product").User>("/auth/profile", { token }),
  },
  products: {
    getAll: (categoryId?: number) => {
      const params = categoryId ? `?categoryId=${categoryId}` : "";
      return fetchAPI<import("@/types/product").Product[]>(`/products${params}`);
    },
    getById: (id: number) =>
      fetchAPI<import("@/types/product").Product>(`/products/${id}`),
    create: (data: Partial<import("@/types/product").Product>, token: string) =>
      fetchAPI<import("@/types/product").Product>("/products", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }),
    update: (id: number, data: Partial<import("@/types/product").Product>, token: string) =>
      fetchAPI<import("@/types/product").Product>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        token,
      }),
    delete: (id: number, token: string) =>
      fetchAPI<{ message: string }>(`/products/${id}`, {
        method: "DELETE",
        token,
      }),
  },
  categories: {
    getAll: () =>
      fetchAPI<import("@/types/product").Category[]>("/categories"),
    getById: (id: number) =>
      fetchAPI<import("@/types/product").Category>(`/categories/${id}`),
    create: (data: { name: string; description: string }, token: string) =>
      fetchAPI<import("@/types/product").Category>("/categories", {
        method: "POST",
        body: JSON.stringify(data),
        token,
      }),
    update: (id: number, data: { name: string; description: string }, token: string) =>
      fetchAPI<import("@/types/product").Category>(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        token,
      }),
    delete: (id: number, token: string) =>
      fetchAPI<{ message: string }>(`/categories/${id}`, {
        method: "DELETE",
        token,
      }),
  },
};
