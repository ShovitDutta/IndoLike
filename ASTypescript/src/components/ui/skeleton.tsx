import { cn } from "@/lib/utils"; // Assuming cn is a typed utility for combining class names
import * as React from "react"; // Import React for JSX and types

// Define the props for the Skeleton component
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string; // className is already in HTMLAttributes, but can be explicit
  // Rest props are inherited from React.HTMLAttributes<HTMLDivElement>
}

// Type the component function with the defined props
function Skeleton({ className, ...props }: SkeletonProps) {
  // Use cn (clsx) to combine base classes with user-provided classes
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };
