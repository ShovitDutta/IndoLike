"use client";
import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
const TooltipProvider = ({ children }) => {
  return <>{children}</>;
};
const Tooltip = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = event => {
      if (isVisible && triggerRef.current && !triggerRef.current.contains(event.target) && contentRef.current && !contentRef.current.contains(event.target)) setIsVisible(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isVisible]);
  return React.Children.map(children, child => {
    if (child.type === TooltipTrigger) return React.cloneElement(child, { setIsVisible, ref: triggerRef });
    if (child.type === TooltipContent) return React.cloneElement(child, { isVisible, ref: contentRef });
    return child;
  });
};
const TooltipTrigger = React.forwardRef(({ children, setIsVisible, ...props }, ref) => {
  return (
    <div ref={ref} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} onFocus={() => setIsVisible(true)} onBlur={() => setIsVisible(false)} {...props}>
      {children}
    </div>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";
const TooltipContent = React.forwardRef(({ className, isVisible, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        isVisible ? "visible opacity-100" : "invisible opacity-0",
        "transition-opacity duration-300",
        className,
      )}
      {...props}
    />
  );
});
TooltipContent.displayName = "TooltipContent";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
