"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Circle } from "lucide-react";
import { useState, createContext, useContext, useEffect } from "react";
const DropdownMenuContext = createContext(null);
const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const setOpen = open => setIsOpen(open);
  return <DropdownMenuContext.Provider value={{ isOpen, setOpen }}>{children}</DropdownMenuContext.Provider>;
};
const DropdownMenuTrigger = ({ children, ...props }) => {
  const { setOpen } = useContext(DropdownMenuContext);
  return (
    <div onClick={() => setOpen(true)} {...props}>
      {children}
    </div>
  );
};
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, children, ...props }, ref) => {
  const { isOpen, setOpen } = useContext(DropdownMenuContext);
  const contentRef = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = event => {
      if (contentRef.current && !contentRef.current.contains(event.target) && triggerRef.current && !triggerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, setOpen]);
  const style = {};
  if (triggerRef.current) {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    style.position = "absolute";
    style.top = `${triggerRect.bottom + sideOffset}px`;
    style.left = `${triggerRect.left}px`;
  }
  return (
    <DropdownMenuPortal>
      {React.Children.map(children, child => (child.type === DropdownMenuTrigger ? React.cloneElement(child, { ref: triggerRef }) : null))}
      {isOpen && (
        <div ref={contentRef} className={cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} style={style} {...props}>
          {children}
        </div>
      )}
    </DropdownMenuPortal>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";
const DropdownMenuItem = React.forwardRef(({ className, inset, children, ...props }, ref) => {
  const { setOpen } = useContext(DropdownMenuContext);
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className,
      )}
      onClick={() => setOpen(false)}
      {...props}>
      {children}
    </div>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, onCheckedChange, ...props }, ref) => {
  const { setOpen } = useContext(DropdownMenuContext);
  const [isChecked, setIsChecked] = useState(checked || false);
  const handleCheckChange = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onCheckedChange) {
      onCheckedChange(newState);
    }
  };
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      onClick={handleCheckChange}
      {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">{isChecked && <Check className="h-4 w-4" />}</span> {children}
    </div>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";
const DropdownMenuRadioItem = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  const { setOpen } = useContext(DropdownMenuContext);
  const isSelected = false;
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      onClick={() => {
        if (onValueChange) {
          onValueChange(value);
        }
        setOpen(false);
      }}
      {...props}>
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">{isSelected && <Circle className="h-2 w-2 fill-current" />}</span> {children}
    </div>
  );
});
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";
const DropdownMenuLabel = React.forwardRef(({ className, inset, children, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} {...props}>
    {children}
  </div>
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
const DropdownMenuShortcut = ({ className, ...props }) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
const DropdownMenuGroup = ({ className, ...props }) => {
  return <div className={cn("flex flex-col", className)} {...props} />;
};
DropdownMenuGroup.displayName = "DropdownMenuGroup";
const DropdownMenuSub = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      {React.Children.map(children, child => {
        if (child.type === DropdownMenuSubTrigger) {
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen) });
        }
        if (child.type === DropdownMenuSubContent) {
          return React.cloneElement(child, { isVisible: isOpen });
        }
        return child;
      })}
    </div>
  );
};
DropdownMenuSub.displayName = "DropdownMenuSub";
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, onClick, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent", inset && "pl-8", className)}
    onClick={onClick}
    {...props}>
    {children} <ChevronRight className="ml-auto h-4 w-4" />
  </div>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";
const DropdownMenuSubContent = React.forwardRef(({ className, isVisible, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
      isVisible ? "visible opacity-100" : "invisible opacity-0",
      "transition-opacity duration-300",
      className,
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";
const DropdownMenuRadioGroup = ({ className, ...props }) => {
  return <div className={cn("flex flex-col", className)} {...props} />;
};
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
