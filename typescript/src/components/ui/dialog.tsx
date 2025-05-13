"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useState, createContext, useContext, useEffect, useRef, forwardRef } from "react";

// Define types for the Dialog context
interface DialogContextType {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

interface DialogProps {
  children?: React.ReactNode;
}

const Dialog = ({ children }: DialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const setOpen = (open: boolean) => setIsOpen(open);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
    if (typeof document !== "undefined") {
      if (isOpen) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
      return () => {
        document.body.classList.remove("overflow-hidden");
      };
    }
  }, [isOpen]);

  return <DialogContext.Provider value={{ isOpen, setOpen }}>{children}</DialogContext.Provider>;
};

interface DialogTriggerProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogTrigger = ({ children, ...props }: DialogTriggerProps) => {
  const context = useContext(DialogContext);
  if (context === null) {
    throw new Error("DialogTrigger must be used within a Dialog");
  }
  const { setOpen } = context;

  return (
    <div onClick={() => setOpen(true)} {...props}>
      {children}
    </div>
  );
};

interface DialogPortalProps {
  children?: React.ReactNode;
}

const DialogPortal = ({ children }: DialogPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && typeof document !== "undefined" ? createPortal(children, document.body) : null;
};

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(({ className, ...props }, ref) => {
  const context = useContext(DialogContext);
  if (context === null) {
    throw new Error("DialogOverlay must be used within a Dialog");
  }
  const { isOpen } = context;

  return <div ref={ref} className={cn("fixed inset-0 z-50 bg-black/80 transition-opacity", isOpen ? "opacity-100" : "opacity-0 pointer-events-none", className)} {...props} />;
});

DialogOverlay.displayName = "DialogOverlay";

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(({ className, children, ...props }, ref) => {
  const context = useContext(DialogContext);
  if (context === null) {
    throw new Error("DialogContent must be used within a Dialog");
  }
  const { isOpen, setOpen } = context;

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
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
      )}
    </DialogPortal>
  );
});

DialogContent.displayName = "DialogContent";

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />;
DialogHeader.displayName = "DialogHeader";

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogFooter = ({ className, ...props }: DialogFooterProps) => <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />;
DialogFooter.displayName = "DialogFooter";

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(({ className, children, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </h2>
));
DialogTitle.displayName = "DialogTitle";

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
));
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
