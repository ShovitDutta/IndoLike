"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, useEffect, createContext, useContext } from "react";
const SheetContext = createContext(null);
const Sheet = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const setOpen = open => setIsOpen(open);
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setOpen]);
  return <SheetContext.Provider value={{ isOpen, setOpen }}>{children}</SheetContext.Provider>;
};
const SheetTrigger = ({ children, ...props }) => {
  const { setOpen } = useContext(SheetContext);
  return (
    <div onClick={() => setOpen(true)} {...props}>
      {children}
    </div>
  );
};
const SheetClose = ({ children, ...props }) => {
  const { setOpen } = useContext(SheetContext);
  return (
    <div onClick={() => setOpen(false)} {...props}>
      {children}
    </div>
  );
};
const SheetPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? createPortal(children, document.body) : null;
};
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { isOpen } = useContext(SheetContext);
  return <div ref={ref} className={cn("fixed inset-0 z-50 bg-black/80 transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none", className)} {...props} />;
});
SheetOverlay.displayName = "SheetOverlay";
const baseClasses = "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out";
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => {
  const { isOpen, setOpen } = useContext(SheetContext);
  const positionClasses = {
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  };
  const transformClasses = {
    top: isOpen ? "translate-y-0" : "-translate-y-full",
    bottom: isOpen ? "translate-y-0" : "translate-y-full",
    left: isOpen ? "translate-x-0" : "-translate-x-full",
    right: isOpen ? "translate-x-0" : "translate-x-full",
  };
  return (
    <SheetPortal>
      <SheetOverlay onClick={() => setOpen(false)} />
      <div ref={ref} className={cn(baseClasses, positionClasses[side], transformClasses[side], className)} {...props}>
        {children}
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" /> <span className="sr-only">Close</span>
        </SheetClose>
      </div>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";
const SheetHeader = ({ className, ...props }) => <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />;
SheetHeader.displayName = "SheetHeader";
const SheetFooter = ({ className, ...props }) => <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
SheetFooter.displayName = "SheetFooter";
const SheetTitle = ({ className, children, ...props }) => (
  <div className={cn("text-lg font-semibold text-foreground", className)} {...props}>
    {children}
  </div>
);
SheetTitle.displayName = "SheetTitle";
const SheetDescription = ({ className, children, ...props }) => (
  <div className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </div>
);
SheetDescription.displayName = "SheetDescription";
export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
