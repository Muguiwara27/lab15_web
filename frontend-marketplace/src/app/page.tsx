"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Product, Category } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import {
  ScanSearch,
  Zap,
  BaggageClaim,
  ShieldCheck,
  Bike,
  Gauge,
  Box,
  Bookmark,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";

export default function HomePage() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.products.getAll(),
          api.categories.getAll(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        setError("Error al cargar productos. Intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.nombre
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-900/30">
            <BaggageClaim className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-white">Algo salió mal</h2>
          <p className="mt-2 text-zinc-400">{error}</p>
          <Button variant="primary" className="mt-6" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated ? (
        <>
          <section className="relative overflow-hidden pb-20 pt-16">
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M20 0v40M0 20h40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/8 blur-[150px]" />
            </div>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mx-auto flex max-w-5xl flex-col items-center text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-5 py-2 text-sm text-zinc-400 backdrop-blur-sm"
                >
                  <Zap className="h-3.5 w-3.5 text-violet-400" />
                  <span>Nuevos productos cada semana</span>
                </motion.div>

                <h1 className="text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Tu tienda{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-300 bg-clip-text text-transparent">
                    inteligente
                  </span>{" "}
                  comienza aquí
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
                  Marketplace inteligente con los mejores productos seleccionados
                  para ti. Calidad, variedad y los mejores precios en un solo lugar.
                </p>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                  <Link href="/register">
                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                      Comenzar Ahora
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Ya tengo cuenta
                    </Button>
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400" /> 4.9 de 5 estrellas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-400" /> +10k productos vendidos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-violet-400" /> Calidad garantizada
                  </span>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: BaggageClaim, title: "Catálogo Extenso", desc: "Miles de productos en todas las categorías", gradient: "from-indigo-600/20 to-violet-600/20", ring: "ring-indigo-500/20", text: "text-violet-400", hoverRing: "group-hover:ring-indigo-500/40" },
                { icon: ShieldCheck, title: "Compra Protegida", desc: "Pago seguro y devolución sin complicaciones", gradient: "from-emerald-600/20 to-teal-600/20", ring: "ring-emerald-500/20", text: "text-emerald-400", hoverRing: "group-hover:ring-emerald-500/40" },
                { icon: Bike, title: "Envío Exprés", desc: "Entrega en 24-48 horas en pedidos premium", gradient: "from-amber-600/20 to-orange-600/20", ring: "ring-amber-500/20", text: "text-amber-400", hoverRing: "group-hover:ring-amber-500/40" },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:border-zinc-700 hover:-translate-y-1"
                >
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.ring} transition-all duration-300 ${feature.hoverRing}`}>
                    <feature.icon className={`h-5 w-5 ${feature.text}`} />
                  </div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="relative overflow-hidden pb-8 pt-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">
                  Hola, {user?.name?.split(" ")[0] || "usuario"}
                </h1>
                <p className="text-zinc-500 text-sm">
                  {products.length} productos disponibles en {categories.length} categorías
                </p>
              </div>

              {isAdmin && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/admin">
                    <Button variant="primary" size="sm">
                      <Gauge className="h-4 w-4" />
                      Ir al Panel
                    </Button>
                  </Link>
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2">
                    <Box className="h-4 w-4 text-violet-400" />
                    <span className="text-sm text-zinc-400">{products.length} productos</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2">
                    <Bookmark className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-zinc-400">{categories.length} categorías</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isAuthenticated ? "Productos" : "Productos Destacados"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} disponible{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <ScanSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
              !selectedCategory
                ? "bg-white text-zinc-900"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-white text-zinc-900"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="No hay productos que coincidan"
            description="Intenta con otro término de búsqueda o categoría."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
