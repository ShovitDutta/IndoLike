"use client";

import * as React from "react";
import { useState, useEffect, useRef, type ReactNode, type MutableRefObject, type Dispatch, type SetStateAction } from "react";
import { cn } from "@/lib/utils"; // Assuming cn is a typed utility for combining class names

// --- TooltipProvider ---
interface TooltipProviderProps {
  children: ReactNode;
}

const TooltipProvider = ({ children }: TooltipProviderProps) => {
  return <>{children}</>;
};

// --- Tooltip ---
interface TooltipProps {
  children: ReactNode;
}

const Tooltip = ({ children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  // Type refs to hold HTMLDivElement or null
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      // Access current values of refs inside the effect
      if (
        isVisible &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) && // Cast event.target to Node
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) // Cast event.target to Node
      ) {
        setIsVisible(false);
      }
    };

    // Add and remove event listener
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isVisible, triggerRef, contentRef]); // Add refs to dependencies

  // Map children to inject props and refs
  return (
    <>
      {React.Children.map(children, child => {
        // Check if child is a valid React element
        if (!React.isValidElement(child)) {
          return child; // Return non-element children as is
        }

        // Clone TooltipTrigger child
        // Use type assertion and Omit to handle injecting props and ref
        if (child.type === TooltipTrigger) {
          const triggerElement = child as React.ReactElement<TooltipTriggerProps, typeof TooltipTrigger>;
          // Omit injected props and ref from original props before spreading
          const originalTriggerProps = Omit<typeof triggerElement.props, "setIsVisible" | "ref">(triggerElement.props);
          return React.cloneElement(triggerElement, {
            setIsVisible: setIsVisible,
            ref: triggerRef, // Inject the ref
            ...originalTriggerProps, // Spread original props excluding injected ones
          });
        }

        // Clone TooltipContent child
        // Use type assertion and Omit to handle injecting props and ref
        if (child.type === TooltipContent) {
          const contentElement = child as React.ReactElement<TooltipContentProps, typeof TooltipContent>;
          // Omit injected props and ref from original props before spreading
          const originalContentProps = Omit<typeof contentElement.props, "isVisible" | "ref">(contentElement.props);
          return React.cloneElement(contentElement, {
            isVisible: isVisible,
            ref: contentRef, // Inject the ref
            ...originalContentProps, // Spread original props excluding injected ones
          });
        }

        // Return other valid elements or children as is
        return child;
      })}
    </>
  );
};

// --- TooltipTrigger ---
// Props for TooltipTrigger, extending div attributes and adding setIsVisible
interface TooltipTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  setIsVisible: Dispatch<SetStateAction<boolean>>; // Function to set visibility
  // ref is handled by forwardRef
}

// Use React.forwardRef with generic types for the element and props
const TooltipTrigger = React.forwardRef<HTMLDivElement, TooltipTriggerProps>(({ children, setIsVisible, ...props }, ref) => {
  return (
    <div
      ref={ref} // Attach the forwarded ref
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      {...props} // Spread remaining props (like className, style, etc.)
    >
      {children} {/* Render trigger content */}
    </div>
  );
});
TooltipTrigger.displayName = "TooltipTrigger"; // Set display name

// --- TooltipContent ---
// Props for TooltipContent, extending div attributes and adding isVisible
interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string; // className is already in HTMLAttributes, but explicit here
  isVisible: boolean; // Boolean for visibility state
  // ref is handled by forwardRef
}

// Use React.forwardRef with generic types for the element and props
const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(({ className, isVisible, ...props }, ref) => {
  return (
    <div
      ref={ref} // Attach the forwarded ref
      className={cn(
        // Combine classes
        "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        isVisible ? "visible opacity-100" : "invisible opacity-0", // Conditional visibility classes
        "transition-opacity duration-300",
        className, // Apply user-provided className
      )}
      {...props} // Spread remaining props
    />
  );
});
TooltipContent.displayName = "TooltipContent"; // Set display name

// Export components
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
