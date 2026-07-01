"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GamingAuth } from "@/components/ui/gaming-login";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciales inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {};

  return (
    <GamingAuth
      mode="login"
      onLogin={handleLogin}
      onRegister={handleRegister}
      onToggleMode={() => router.push("/register")}
      error={error}
      isLoading={isLoading}
    />
  );
}
