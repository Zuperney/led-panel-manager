import React from "react";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
}) => {
  return (
    <div
      className={clsx(
        "bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6",
        hover && "hover:bg-white/15 transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
};
