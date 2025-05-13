"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => {
  const contentRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, offsetHeight } = contentRef.current;
      setScrollTop(scrollTop);
      setThumbHeight((offsetHeight / scrollHeight) * offsetHeight);
    }
  };
  const handleMouseDown = e => {
    setIsDragging(true);
    e.preventDefault();
  };
  const handleMouseMove = e => {
    if (!isDragging || !contentRef.current) return;
    const scrollAreaRect = e.currentTarget.getBoundingClientRect();
    const thumbPosition = e.clientY - scrollAreaRect.top - thumbHeight / 2;
    const maxThumbPosition = scrollAreaRect.height - thumbHeight;
    const clampedThumbPosition = Math.max(0, Math.min(maxThumbPosition, thumbPosition));
    const scrollPercentage = clampedThumbPosition / maxThumbPosition;
    const newScrollTop = scrollPercentage * (contentRef.current.scrollHeight - contentRef.current.offsetHeight);
    contentRef.current.scrollTop = newScrollTop;
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener("scroll", handleScroll);
      }
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, thumbHeight]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden rounded-md", className)} {...props}>
      <div ref={contentRef} className="h-full w-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onMouseMove={handleMouseMove}>
        {children}
      </div>
      <ScrollBar
        orientation="vertical"
        style={{ top: `${(scrollTop / contentRef.current?.scrollHeight) * 100}%`, height: `${(contentRef.current?.offsetHeight / contentRef.current?.scrollHeight) * 100}%` }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
});
ScrollArea.displayName = "ScrollArea";
const ScrollBar = React.forwardRef(({ className, orientation = "vertical", style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-0 flex touch-none select-none transition-colors",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
        className,
      )}
      style={style}
      {...props}>
      <div className="relative flex-1 rounded-full bg-border" />
    </div>
  );
});
ScrollBar.displayName = "ScrollBar";
export { ScrollArea, ScrollBar };
