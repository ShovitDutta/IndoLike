import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming cn is a typed utility for combining class names
import { useState, useRef, useEffect, useCallback, type MouseEvent, type MutableRefObject, type Dispatch, type SetStateAction } from "react";

// Define the props for the Slider component
interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string; // Class name for the main container div
  trackClassName?: string; // Class name for the track div
  thumbClassName?: string; // Class name for the thumb div
  value?: number[]; // Controlled value (array of numbers)
  onValueChange?: (value: number[]) => void; // Callback for value changes
  defaultValue?: number; // Uncontrolled initial value
  max?: number; // Maximum value
  step?: number; // Step size
  // Rest props are inherited from React.HTMLAttributes<HTMLDivElement>
}

const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (SliderProps)
const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      trackClassName,
      thumbClassName,
      value: controlledValue, // Destructure controlled value
      onValueChange,
      defaultValue = 0,
      max = 100,
      step = 1,
      ...props // Rest of the div attributes
    },
    ref, // Forwarded ref
  ) => {
    const sliderRef = useRef<HTMLDivElement | null>(null); // Ref for the track div
    const [internalValue, setInternalValue] = useState<number>(defaultValue); // Internal state for uncontrolled value
    const [isDragging, setIsDragging] = useState<boolean>(false); // State to track dragging status

    // Determine the current value: controlled value if provided, otherwise internal value
    const value = controlledValue !== undefined && controlledValue.length > 0 ? controlledValue[0] : internalValue;

    // Memoize mouse move handler using useCallback
    const handleMouseMove = useCallback(
      (e: MouseEvent): void => {
        if (!isDragging || !sliderRef.current) return;

        const rect = sliderRef.current.getBoundingClientRect();
        // Calculate new value based on mouse position and track width
        let newValue = Math.max(0, Math.min(max, ((e.clientX - rect.left) / rect.width) * max));

        // Round the value to the nearest step
        const roundedValue = Math.round(newValue / step) * step;

        // Update internal state if uncontrolled
        if (controlledValue === undefined) {
          setInternalValue(roundedValue);
        }

        // Call onValueChange callback if provided
        if (onValueChange) {
          onValueChange([roundedValue]); // Pass value as an array
        }
      },
      [isDragging, max, step, controlledValue, onValueChange], // Dependencies for useCallback
    );

    // Memoize mouse up handler using useCallback
    const handleMouseUp = useCallback((): void => {
      setIsDragging(false);
    }, []); // No dependencies as it only sets isDragging to false

    // Effect to add and remove global mousemove and mouseup listeners when dragging state changes
    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove as any); // Cast to any to match EventListener type
        document.addEventListener("mouseup", handleMouseUp);
      } else {
        document.removeEventListener("mousemove", handleMouseMove as any); // Cast to any
        document.removeEventListener("mouseup", handleMouseUp);
      }

      // Cleanup function to remove listeners when the effect cleans up (e.g., component unmounts)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove as any); // Cast to any
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, handleMouseMove, handleMouseUp]); // Dependencies for useEffect

    const handleMouseDown = (e: MouseEvent): void => {
      setIsDragging(true);
      handleMouseMove(e); // Also handle the initial click position
    };

    // Calculate the percentage for the filled track and thumb position
    const percentage = (value / max) * 100;

    return (
      // Main container div with the forwarded ref
      <div ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
        {/* Track div with sliderRef */}
        <div ref={sliderRef} className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", trackClassName)} onMouseDown={handleMouseDown}>
          {/* Filled part of the track */}
          <div className="absolute h-full bg-primary" style={{ width: `${percentage}%` }} />
          {/* Thumb div */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              thumbClassName,
            )}
            style={{ left: `${percentage}%`, transform: `translate(-50%, -50%)` }}
            // Prevent dragging starting on the thumb from bubbling up and causing issues
            onMouseDown={e => {
              e.stopPropagation(); // Stop event propagation
              handleMouseDown(e); // Handle mouse down on the thumb
            }}
          />
        </div>
      </div>
    );
  },
);

Slider.displayName = "Slider"; // Set display name for debugging

export { Slider };
