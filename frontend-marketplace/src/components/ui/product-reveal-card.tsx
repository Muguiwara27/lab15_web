"use client";

import { motion, useReducedMotion } from "framer-motion";
import { buttonVariants } from "@/components/ui/Button";
import { BaggageClaim, Star, Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductRevealCardProps {
  id: number;
  name?: string;
  price?: string;
  originalPrice?: string;
  image?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  categoryName?: string;
  onAdd?: () => void;
  onFavorite?: () => void;
  enableAnimations?: boolean;
  className?: string;
}

export function ProductRevealCard({
  id,
  name = "Producto Premium",
  price = "$199",
  originalPrice,
  image = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop",
  description = "Producto de calidad premium con características excepcionales.",
  rating = 4.8,
  reviewCount = 124,
  categoryName,
  onAdd,
  onFavorite,
  enableAnimations = true,
  className,
}: ProductRevealCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.();
  };

  const containerVariants = {
    rest: { scale: 1, y: 0 },
    hover: shouldAnimate
      ? {
          scale: 1.02,
          y: -6,
          transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
        }
      : {},
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
  };

  const overlayVariants = {
    rest: { y: "100%", opacity: 0 },
    hover: {
      y: "0%",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const contentVariants = {
    rest: { opacity: 0, y: 20, scale: 0.95 },
    hover: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.5 },
    },
  };

  const discount = originalPrice
    ? Math.round(
        ((parseFloat(originalPrice.replace("$", "")) -
          parseFloat(price.replace("$", ""))) /
          parseFloat(originalPrice.replace("$", ""))) *
          100
      )
    : 0;

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      variants={containerVariants}
      className={cn(
        "relative w-full rounded-2xl border border-zinc-800 bg-zinc-900 text-white overflow-hidden cursor-pointer group",
        "shadow-lg shadow-black/20",
        className
      )}
    >
      <Link href={`/products/${id}`}>
        <div className="relative overflow-hidden">
          <motion.img
            src={image}
            alt={name}
            className="h-56 w-full object-cover"
            variants={imageVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <motion.button
            onClick={(e) => {
              e.preventDefault();
              handleFavorite();
            }}
            animate={isFavorite ? "favorite" : "rest"}
            className={cn(
              "absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm border border-white/20 z-10",
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </motion.button>

          {categoryName && (
            <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white/90 text-xs px-3 py-1 rounded-full border border-white/10">
              {categoryName}
            </span>
          )}

          {originalPrice && discount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-4 left-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold"
            >
              {discount}% OFF
            </motion.div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3.5 h-3.5",
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-zinc-600"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-500">
              {rating} ({reviewCount})
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold leading-tight text-white truncate">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{price}</span>
              {originalPrice && (
                <span className="text-sm text-zinc-500 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-zinc-900/98 backdrop-blur-xl flex flex-col justify-end"
      >
        <div className="p-5 space-y-4">
          <motion.div variants={contentVariants}>
                <h4 className="font-semibold text-white mb-2">Detalles del Producto</h4>
            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
              {description}
            </p>
          </motion.div>

          <motion.div variants={contentVariants}>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-800 rounded-lg p-2 text-center">
                <div className="font-semibold text-white">Premium</div>
                <div className="text-zinc-500">Calidad</div>
              </div>
              <div className="bg-zinc-800 rounded-lg p-2 text-center">
                <div className="font-semibold text-white">Envío</div>
                <div className="text-zinc-500">Gratis</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={contentVariants} className="space-y-2">
            <Link href={`/products/${id}`}>
              <motion.button
                variants={{
                  rest: { scale: 1, y: 0 },
                  hover: shouldAnimate
                    ? {
                        scale: 1.05,
                        y: -2,
                        transition: { type: "spring", stiffness: 400, damping: 25 },
                      }
                    : {},
                  tap: shouldAnimate ? { scale: 0.95 } : {},
                }}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className={cn(
                  buttonVariants({ variant: "primary", className: "w-full h-11" })
                )}
              >
                <BaggageClaim className="w-4 h-4 mr-2" />
                Ver Producto
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
