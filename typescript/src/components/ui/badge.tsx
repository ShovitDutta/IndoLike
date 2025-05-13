import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming cn is a utility for merging class names

// Define the possible variants for the Badge component
export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

// Define the props for the Badge component
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border-current",
  };

  const classes = cn(baseClasses, variantClasses[variant], className);

  return <div className={classes} {...props} />;
}

export { Badge };