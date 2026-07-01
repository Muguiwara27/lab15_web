"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { GamingAuth } from "@/components/ui/gaming-login";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (name: string, email: string, password: string) => {
    setError("");
    setIsLoading(true);
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registro fallido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {};

  return (
    <GamingAuth
      mode="register"
      onLogin={handleLogin}
      onRegister={handleRegister}
      onToggleMode={() => router.push("/login")}
      error={error}
      isLoading={isLoading}
    />
  );
}
