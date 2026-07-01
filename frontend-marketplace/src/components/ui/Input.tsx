"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const radius = 100;
    const containerRef = React.useRef<HTMLDivElement>(null);
    const gradientRef = React.useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    useGSAP(() => {
      gsap.set(gradientRef.current, {
        background: `radial-gradient(0px circle at ${mousePosition.x}px ${mousePosition.y}px, #8b5cf6, transparent 80%)`,
      });
    }, { scope: containerRef });

    function handleMouseMove(e: React.MouseEvent) {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setMousePosition({ x, y });
      gsap.to(gradientRef.current, {
        background: `radial-gradient(${radius}px circle at ${x}px ${y}px, #8b5cf6, transparent 80%)`,
        duration: 0.1,
      });
    }

    function handleMouseEnter(e: React.MouseEvent) {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setMousePosition({ x, y });
      gsap.set(gradientRef.current, {
        background: `radial-gradient(0px circle at ${x}px ${y}px, #8b5cf6, transparent 80%)`,
      });
      gsap.to(gradientRef.current, {
        background: `radial-gradient(${radius}px circle at ${x}px ${y}px, #8b5cf6, transparent 80%)`,
        duration: 0.3,
      });
    }

    function handleMouseLeave() {
      gsap.to(gradientRef.current, {
        background: `radial-gradient(0px circle at ${mousePosition.x}px ${mousePosition.y}px, #8b5cf6, transparent 80%)`,
        duration: 0.3,
      });
    }

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-neutral-300">
            {label}
          </label>
        )}
        <div
          ref={containerRef}
          className="group/input rounded-lg p-[2px] transition duration-300 relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={gradientRef} className="absolute inset-0 rounded-lg" />
          <input
            id={id}
            type={type}
            className={cn(
              "relative z-10 flex h-10 w-full rounded-md border-none bg-zinc-800 px-3 py-2 text-sm text-white shadow-[0px_0px_1px_1px_#404040] transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:ring-[2px] focus-visible:ring-indigo-500/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              error && "ring-2 ring-red-500/50",
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };
