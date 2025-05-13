"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react"; // Import useCallback

// Define types for the component props
interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  trackClassName?: string;
  thumbClassName?: string;
  value?: number[];
  onValueChange?: (value: number[]) => void;
  defaultValue?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, trackClassName, thumbClassName, value: controlledValue, onValueChange, defaultValue = 0, max = 100, step = 1, ...props }, ref) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);

    const value = controlledValue !== undefined ? controlledValue[0] : internalValue; // Assuming value is an array with one element

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const newValue = Math.max(0, Math.min(max, ((e.clientX - rect.left) / rect.width) * max));
      const roundedValue = Math.round(newValue / step) * step;

      if (controlledValue === undefined) {
        setInternalValue(roundedValue);
      }
      if (onValueChange) {
        onValueChange([roundedValue]);
      }
    }, [isDragging, max, step, controlledValue, onValueChange]); // Added dependencies

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []); // No dependencies

    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      } else {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, handleMouseMove, handleMouseUp]); // Added dependencies

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      // Simulate a mouse move to set the initial position on click
      handleMouseMove(e.nativeEvent);
    };

    const percentage = (value / max) * 100;

    return (
      <div ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
        <div ref={sliderRef} className={cn("relative h-2 w-full grow overflow-hidden rounded-full bg-secondary", trackClassName)} onMouseDown={handleMouseDown}>
          <div className="absolute h-full bg-primary" style={{ width: `${percentage}%` }} />
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              thumbClassName,
            )}
            style={{ left: `${percentage}%`, transform: `translate(-50%, -50%)` }}
            onMouseDown={e => {
              e.stopPropagation();
              handleMouseDown(e);
            }}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";

export { Slider };