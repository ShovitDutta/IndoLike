"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming cn is a typed utility for combining class names
import { useState, useRef, useEffect, useCallback, type MouseEvent, type MutableRefObject, type CSSProperties, type HTMLAttributes, type RefAttributes } from "react";

// --- ScrollArea ---
// Define props for ScrollArea, extending div attributes
interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  className?: string; // Class name for the main container div
  children?: React.ReactNode; // Content inside the scrollable area
  // Rest props are inherited from HTMLAttributes<HTMLDivElement>
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (ScrollAreaProps)
const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ className, children, ...props }, ref) => {
  const contentRef = useRef<HTMLDivElement | null>(null); // Ref for the scrollable content div
  const [isDragging, setIsDragging] = useState<boolean>(false); // State to track dragging status
  const [scrollTop, setScrollTop] = useState<number>(0); // State for current scroll position
  const [thumbHeight, setThumbHeight] = useState<number>(0); // State for scrollbar thumb height

  // Memoize scroll handler
  const handleScroll = useCallback((): void => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, offsetHeight } = contentRef.current;
      setScrollTop(scrollTop);
      // Calculate thumb height based on visible ratio
      setThumbHeight((offsetHeight / scrollHeight) * offsetHeight);
    }
  }, []); // No dependencies as it only reads ref.current and sets state

  // Memoize mouse down handler for the thumb
  const handleMouseDown = useCallback((e: MouseEvent): void => {
    setIsDragging(true);
    e.preventDefault(); // Prevent default text selection behavior
  }, []); // No dependencies

  // Memoize mouse move handler for dragging the thumb
  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      // Use e.currentTarget.parentElement to get the ScrollArea container for calculating thumb position
      const scrollAreaContainer = (e.currentTarget as HTMLElement).parentElement;
      if (!isDragging || !contentRef.current || !scrollAreaContainer) return;

      const scrollAreaRect = scrollAreaContainer.getBoundingClientRect();
      // Calculate thumb position relative to the scroll area container
      const thumbPosition = e.clientY - scrollAreaRect.top - thumbHeight / 2;
      const maxThumbPosition = scrollAreaRect.height - thumbHeight;

      // Clamp thumb position within bounds
      const clampedThumbPosition = Math.max(0, Math.min(maxThumbPosition, thumbPosition));

      // Calculate scroll percentage and new scrollTop
      const scrollPercentage = clampedThumbPosition / maxThumbPosition;
      const newScrollTop = scrollPercentage * (contentRef.current.scrollHeight - contentRef.current.offsetHeight);

      // Update content's scrollTop
      contentRef.current.scrollTop = newScrollTop;
    },
    [isDragging, thumbHeight], // Dependencies for useCallback
  );

  // Memoize mouse up handler to stop dragging
  const handleMouseUp = useCallback((): void => {
    setIsDragging(false);
  }, []); // No dependencies

  // Effect to add and remove event listeners
  useEffect(() => {
    const contentElement = contentRef.current;

    if (contentElement) {
      // Add scroll listener to the content div
      contentElement.addEventListener("scroll", handleScroll);
      // Perform initial scroll calculation
      handleScroll();
    }

    // Add global mouseup and mousemove listeners when dragging
    document.addEventListener("mouseup", handleMouseUp);
    // Mousemove listener is added to the scrollable div in JSX when isDragging is true

    return () => {
      // Clean up event listeners
      if (contentElement) {
        contentElement.removeEventListener("scroll", handleScroll);
      }
      document.removeEventListener("mouseup", handleMouseUp);
      // Mousemove listener cleanup is implicitly handled by its conditional rendering in JSX
    };
  }, [handleScroll, handleMouseUp]); // Dependencies for useEffect

  // Add mousemove listener to the content div conditionally based on isDragging state
  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement && isDragging) {
      contentElement.addEventListener("mousemove", handleMouseMove as any); // Cast to any for EventListener
    }
    return () => {
      if (contentElement) {
        contentElement.removeEventListener("mousemove", handleMouseMove as any); // Cleanup
      }
    };
  }, [isDragging, handleMouseMove]); // Depend on isDragging and handleMouseMove

  // Calculate thumb position and height percentages for ScrollBar style
  const thumbTopPercentage = contentRef.current && contentRef.current.scrollHeight > 0 ? (scrollTop / contentRef.current.scrollHeight) * 100 : 0;
  const thumbHeightPercentage = contentRef.current && contentRef.current.scrollHeight > 0 ? (contentRef.current.offsetHeight / contentRef.current.scrollHeight) * 100 : 0;

  return (
    // Main container div with the forwarded ref
    <div ref={ref} className={cn("relative overflow-hidden rounded-md", className)} {...props}>
      {/* Scrollable content div with contentRef and mousemove listener */}
      <div
        ref={contentRef}
        className="h-full w-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        // mousemove listener moved to useEffect for better control with isDragging
      >
        {children} {/* Render the scrollable content */}
      </div>
      {/* Custom ScrollBar component */}
      {/* Only render ScrollBar if content can actually be scrolled */}
      {contentRef.current && contentRef.current.scrollHeight > contentRef.current.offsetHeight && (
        <ScrollBar
          orientation="vertical"
          // Dynamically calculate style based on scroll position and thumb height
          style={{ top: `${thumbTopPercentage}%`, height: `${thumbHeightPercentage}%` }}
          onMouseDown={handleMouseDown} // Handle mouse down on the thumb (via ScrollBar's onMouseDown prop)
        />
      )}
    </div>
  );
});
ScrollArea.displayName = "ScrollArea"; // Set display name

// --- ScrollBar ---
// Define possible orientations for the scrollbar
type ScrollBarOrientation = "vertical" | "horizontal";

// Define props for ScrollBar, extending div attributes
interface ScrollBarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  orientation?: ScrollBarOrientation; // Use the defined union type for orientation
  style?: CSSProperties; // Type for inline styles
  // Rest props are inherited from HTMLAttributes<HTMLDivElement>
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (ScrollBarProps)
const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(({ className, orientation = "vertical", style, ...props }, ref) => {
  return (
    <div
      ref={ref} // Attach the forwarded ref
      className={cn(
        // Combine classes
        "absolute right-0 top-0 flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className, // Apply user-provided className
      )}
      style={style} // Apply inline styles (position and size)
      {...props} // Spread remaining props (like onMouseDown from ScrollArea)
    >
      {/* Visual thumb */}
      <div className="relative flex-1 rounded-full bg-border" />
    </div>
  );
});
ScrollBar.displayName = "ScrollBar"; // Set display name

// Export components
export { ScrollArea, ScrollBar };
