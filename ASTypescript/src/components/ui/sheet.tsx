"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming cn is a typed utility for combining class names
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, useEffect, createContext, useContext, useRef, type ReactNode, type Dispatch, type SetStateAction, type HTMLAttributes, type RefAttributes } from "react";

// --- Context ---
// Define the type for the Sheet context value
interface SheetContextValue {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

// Create the context with a default value of null, and type it
const SheetContext = createContext<SheetContextValue | null>(null);

// Custom hook to consume the Sheet context with a check for null
const useSheetContext = () => {
  const context = useContext(SheetContext);
  if (context === null) {
    throw new Error("Sheet components must be used within a Sheet provider.");
  }
  return context;
};

// --- Sheet ---
// Define the props for the Sheet component
interface SheetProps {
  children: ReactNode;
}

const Sheet = ({ children }: SheetProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Memoize setOpen or define it inside useEffect if it causes lint issues,
  // but for simple state setters, it's usually stable.
  const setOpen = (open: boolean) => setIsOpen(open);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setOpen]); // Depend on isOpen and setOpen

  const contextValue: SheetContextValue = {
    isOpen,
    setOpen,
  };

  return <SheetContext.Provider value={contextValue}>{children}</SheetContext.Provider>;
};

// --- SheetTrigger ---
// Define props for SheetTrigger, extending div attributes
interface SheetTriggerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  // setOpen is injected by the parent Sheet component if needed for cloning,
  // but the standard pattern uses useContext.
}

const SheetTrigger = ({ children, ...props }: SheetTriggerProps) => {
  const { setOpen } = useSheetContext(); // Use the custom hook

  return (
    <div onClick={() => setOpen(true)} {...props}>
      {children}
    </div>
  );
};
SheetTrigger.displayName = "SheetTrigger";

// --- SheetClose ---
// Define props for SheetClose, extending div attributes
interface SheetCloseProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  // setOpen is injected by the parent Sheet component if needed for cloning,
  // but the standard pattern uses useContext.
}

const SheetClose = ({ children, ...props }: SheetCloseProps) => {
  const { setOpen } = useSheetContext(); // Use the custom hook

  return (
    <div onClick={() => setOpen(false)} {...props}>
      {children}
    </div>
  );
};
SheetClose.displayName = "SheetClose";

// --- SheetPortal ---
// Define props for SheetPortal
interface SheetPortalProps {
  children: ReactNode;
}

const SheetPortal = ({ children }: SheetPortalProps): React.ReactPortal | null => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []); // Empty dependency array: runs once on mount

  // Create portal only when mounted
  return mounted ? createPortal(children, document.body) : null;
};
SheetPortal.displayName = "SheetPortal";

// --- SheetOverlay ---
// Define props for SheetOverlay, extending div attributes
interface SheetOverlayProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (SheetOverlayProps)
const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(({ className, ...props }, ref) => {
  const { isOpen } = useSheetContext(); // Use the custom hook

  return (
    <div
      ref={ref} // Attach the forwarded ref
      className={cn(
        "fixed inset-0 z-50 bg-black/80 transition-opacity",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none", // Conditional visibility
        className, // Apply user-provided className
      )}
      {...props} // Spread remaining props
    />
  );
});
SheetOverlay.displayName = "SheetOverlay";

// --- SheetContent ---
// Define possible sides for the sheet content
type SheetSide = "top" | "bottom" | "left" | "right";

// Define props for SheetContent, extending div attributes and adding side
interface SheetContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  side?: SheetSide; // Use the defined union type for side
}

const baseClasses = "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out";

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (SheetContentProps)
const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(({ side = "right", className, children, ...props }, ref) => {
  const { isOpen, setOpen } = useSheetContext(); // Use the custom hook

  // Define classes based on side
  const positionClasses: Record<SheetSide, string> = {
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  };

  // Define transform classes based on side and isOpen state
  const transformClasses: Record<SheetSide, string> = {
    top: isOpen ? "translate-y-0" : "-translate-y-full",
    bottom: isOpen ? "translate-y-0" : "translate-y-full",
    left: isOpen ? "translate-x-0" : "-translate-x-full",
    right: isOpen ? "translate-x-0" : "translate-x-full",
  };

  return (
    <SheetPortal>
      {/* SheetOverlay with click handler to close the sheet */}
      <SheetOverlay onClick={() => setOpen(false)} />
      {/* Main content div with forwarded ref and combined classes */}
      <div
        ref={ref} // Attach the forwarded ref
        className={cn(
          baseClasses,
          positionClasses[side],
          transformClasses[side],
          className, // Apply user-provided className
        )}
        {...props} // Spread remaining props
      >
        {children} {/* Render content inside the sheet */}
        {/* SheetClose button */}
        {/* Explicitly create the SheetClose element and pass props */}
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </div>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";

// --- SheetHeader ---
// Define props for SheetHeader, extending div attributes
interface SheetHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SheetHeader = ({ className, ...props }: SheetHeaderProps) => <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />;
SheetHeader.displayName = "SheetHeader";

// --- SheetFooter ---
// Define props for SheetFooter, extending div attributes
interface SheetFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SheetFooter = ({ className, ...props }: SheetFooterProps) => <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
SheetFooter.displayName = "SheetFooter";

// --- SheetTitle ---
// Define props for SheetTitle, extending div attributes
interface SheetTitleProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

const SheetTitle = ({ className, children, ...props }: SheetTitleProps) => (
  <div className={cn("text-lg font-semibold text-foreground", className)} {...props}>
    {children}
  </div>
);
SheetTitle.displayName = "SheetTitle";

// --- SheetDescription ---
// Define props for SheetDescription, extending div attributes
interface SheetDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
}

const SheetDescription = ({ className, children, ...props }: SheetDescriptionProps) => (
  <div className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </div>
);
SheetDescription.displayName = "SheetDescription";

// Export components
export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
