export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imageUrl: string | null;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
  category?: Category | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  Products?: Product[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: "ADMIN" | "CUSTOMER";
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
