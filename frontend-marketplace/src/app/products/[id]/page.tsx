"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";
import { ChevronLeft, BaggageClaim, Bookmark, Clock } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await api.products.getById(Number(id));
        setProduct(data);
      } catch {
        setError("Producto no encontrado.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-8 h-6 w-24" />
        <div className="grid gap-12 md:grid-cols-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            {error || "Producto no encontrado"}
          </h2>
          <Link href="/">
            <Button variant="primary" className="mt-6">
              Volver al Inicio
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver a productos
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-12 md:grid-cols-2"
      >
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-neutral-800">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.nombre}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BaggageClaim className="h-16 w-16 text-neutral-600" />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          {product.category && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-neutral-800 px-4 py-1.5 text-sm font-medium text-neutral-400">
              <Bookmark className="h-3.5 w-3.5" />
              {product.category.name}
            </div>
          )}

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {product.nombre}
          </h1>

          <p className="mt-4 text-3xl font-semibold text-white">
            {formatPrice(Number(product.precio))}
          </p>

          <p className="mt-6 leading-relaxed text-neutral-400">
            {product.descripcion}
          </p>

          <div className="mt-8 flex items-center gap-4 text-sm text-neutral-400">
            <Clock className="h-4 w-4" />
            Agregado el {new Date(product.createdAt).toLocaleDateString("es-PE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <Button variant="primary" size="lg" className="mt-8 w-full sm:w-auto">
            <BaggageClaim className="h-5 w-5" />
            Agregar al Carrito
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
