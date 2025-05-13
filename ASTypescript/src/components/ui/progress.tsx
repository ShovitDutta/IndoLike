import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming cn is a typed utility for combining class names
import { type HTMLAttributes, type RefAttributes } from "react"; // Import necessary React types

// Define the props for the Progress component
interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  className?: string; // Class name for the container div
  value?: number | null; // Progress value (0-100), can be null or undefined
  // Rest props are inherited from HTMLAttributes<HTMLDivElement>
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (ProgressProps)
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, ...props }, ref) => (
  // Main container div with the forwarded ref
  <div
    ref={ref} // Attach the forwarded ref
    className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)} // Combine classes
    {...props} // Spread remaining props (like id, data-*, etc.)
  >
    {/* Progress bar fill */}
    <div
      className="h-full flex-1 bg-primary transition-all"
      style={{ width: `${value ?? 0}%` }} // Use nullish coalescing for fallback to 0
      role="progressbar" // ARIA role for progress bar
      aria-valuenow={value ?? 0} // ARIA attribute for current value (fallback to 0)
      aria-valuemin={0} // ARIA attribute for minimum value
      aria-valuemax={100} // ARIA attribute for maximum value
    />
  </div>
));

Progress.displayName = "Progress"; // Set display name for debugging

export { Progress };
