"use client";

import { cn } from "./button";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
  hover?: boolean;
}

export function Card({ className, variant = "default", hover = false, ...props }: CardProps) {
  const variants = {
    default: "bg-[#1c1c22]/80 backdrop-blur-xl border border-zinc-800",
    bordered: "bg-transparent border border-zinc-800",
    elevated: "bg-zinc-900 border border-zinc-800 shadow-xl",
  };

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        variants[variant],
        hover && "hover:border-zinc-700 transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold leading-none tracking-tight text-zinc-100", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-zinc-400", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
