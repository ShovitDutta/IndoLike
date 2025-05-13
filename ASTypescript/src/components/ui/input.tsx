import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming cn is a typed utility for combining class names
import { type InputHTMLAttributes, type Ref } from "react"; // Import necessary React types

// Define the props for the Input component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string; // className is already in InputHTMLAttributes, but can be explicit
  // The 'type' prop is inherited from InputHTMLAttributes<HTMLInputElement>
  // Rest props are also inherited from InputHTMLAttributes<HTMLInputElement>
}

// Use React.forwardRef with generic types for the element (HTMLInputElement) and props (InputProps)
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref: Ref<HTMLInputElement>) => {
  return (
    // Render the input element with typed props and forwarded ref
    <input
      type={type} // Apply the type prop
      className={cn(
        // Combine base classes with user-provided className
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref} // Attach the forwarded ref
      {...props} // Spread remaining standard input attributes
    />
  );
});

Input.displayName = "Input"; // Set display name for debugging

export { Input };
