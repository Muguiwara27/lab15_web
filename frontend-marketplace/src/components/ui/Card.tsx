import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export function Card({ className, hover = false, glow = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg shadow-black/10",
        "backdrop-blur-sm",
        hover &&
          "transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5",
        glow && "shadow-indigo-500/5 hover:shadow-indigo-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 pb-4 border-b border-zinc-800", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}
