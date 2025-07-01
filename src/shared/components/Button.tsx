import React from "react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          // Variants
          "bg-led-primary text-white hover:bg-led-primary/90 focus:ring-led-primary":
            variant === "primary",
          "bg-white/10 text-white hover:bg-white/20 focus:ring-white":
            variant === "secondary",
          "bg-led-accent text-white hover:bg-led-accent/90 focus:ring-led-accent":
            variant === "accent",
          "text-white hover:bg-white/10 focus:ring-white": variant === "ghost",

          // Sizes
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
