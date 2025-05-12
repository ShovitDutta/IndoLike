"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
const Slider = React.forwardRef(({ className, trackClassName, thumbClassName, value: controlledValue, onValueChange, defaultValue = 0, max = 100, step = 1, ...props }, ref) => {
  const sliderRef = useRef(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const handleMouseMove = e => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const newValue = Math.max(0, Math.min(max, ((e.clientX - rect.left) / rect.width) * max));
    const roundedValue = Math.round(newValue / step) * step;
    if (controlledValue === undefined) setInternalValue(roundedValue);
    if (onValueChange) onValueChange([roundedValue]);
  };
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };
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
  }, [isDragging, max, step, controlledValue, onValueChange, handleMouseMove]);
  const handleMouseDown = e => {
    setIsDragging(true);
    handleMouseMove(e);
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
});
Slider.displayName = "Slider";
export { Slider };
