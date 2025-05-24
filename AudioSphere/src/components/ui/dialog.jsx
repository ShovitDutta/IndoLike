"use client";
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useState, createContext, useContext, useEffect } from "react";
const DialogContext = createContext(null);
const Dialog = ({ children }) => {
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
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  return <DialogContext.Provider value={{ isOpen, setOpen }}>{children}</DialogContext.Provider>;
};
const DialogTrigger = ({ children, ...props }) => {
  const { setOpen } = useContext(DialogContext);
  return (
    <div onClick={() => setOpen(true)} {...props}>
      {children}
    </div>
  );
};
const DialogPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? createPortal(children, document.body) : null;
};
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { isOpen } = useContext(DialogContext);
  return <div ref={ref} className={cn("fixed inset-0 z-50 bg-black/80 transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none", className)} {...props} />;
});
DialogOverlay.displayName = "DialogOverlay";
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setOpen } = useContext(DialogContext);
  return (
    <DialogPortal>
      <DialogOverlay onClick={() => setOpen(false)} />
      {isOpen && (
        <div
          ref={ref}
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
            "transition-all ease-in-out",
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
            className,
          )}
          {...props}>
          {children}
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" /> <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      )}
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";
const DialogHeader = ({ className, ...props }) => <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />;
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </div>
));
DialogTitle.displayName = "DialogTitle";
const DialogDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </div>
));
DialogDescription.displayName = "DialogDescription";
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
