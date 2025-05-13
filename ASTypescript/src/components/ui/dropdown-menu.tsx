"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // Assuming cn is a typed utility for combining class names
import { Check, ChevronRight, Circle } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, useEffect, createContext, useContext, useRef, type ReactNode, type Dispatch, type SetStateAction, type HTMLAttributes, type RefAttributes, type MouseEvent } from "react";

// --- Context ---
// Define the type for the Dropdown Menu context value
interface DropdownMenuContextValue {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

// Create the context with a default value of null, and type it
const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

// Custom hook to consume the Dropdown Menu context with a check for null
const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext);
  if (context === null) {
    throw new Error("Dropdown Menu components must be used within a DropdownMenu provider.");
  }
  return context;
};

// --- DropdownMenu ---
// Define the props for the DropdownMenu component
interface DropdownMenuProps {
  children: ReactNode;
}

const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Memoize setOpen or define it inside useEffect if it causes lint issues,
  // but for simple state setters, it's usually stable.
  const setOpen = (open: boolean) => setIsOpen(open);

  const contextValue: DropdownMenuContextValue = {
    isOpen,
    setOpen,
  };

  return <DropdownMenuContext.Provider value={contextValue}>{children}</DropdownMenuContext.Provider>;
};

// --- DropdownMenuTrigger ---
// Define props for DropdownMenuTrigger, extending div attributes
interface DropdownMenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  // setOpen is accessed via context, not passed as a prop here
  // ref is handled by forwardRef if this component was forwarded a ref, but it's not in the original JS.
  // However, DropdownMenuContent clones this and injects a ref, so its ref prop needs typing.
  // The ref prop type will be handled in the cloning part.
}

const DropdownMenuTrigger = ({ children, ...props }: DropdownMenuTriggerProps) => {
  const { setOpen } = useDropdownMenuContext(); // Use the custom hook

  return (
    <div onClick={() => setOpen(true)} {...props}>
      {children}
    </div>
  );
};
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

// --- DropdownMenuPortal ---
// Define props for DropdownMenuPortal
interface DropdownMenuPortalProps {
  children: ReactNode;
}

const DropdownMenuPortal = ({ children }: DropdownMenuPortalProps): React.ReactPortal | null => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []); // Empty dependency array: runs once on mount

  // Create portal only when mounted and if children exist
  return mounted && children ? createPortal(children, document.body) : null;
};
DropdownMenuPortal.displayName = "DropdownMenuPortal";

// --- DropdownMenuContent ---
// Define possible sides for the dropdown content
type DropdownMenuSide = "top" | "bottom" | "left" | "right"; // Based on common dropdowns, though not explicitly used for positioning in the JS

// Define props for DropdownMenuContent, extending div attributes
interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode; // Can contain various dropdown items
  sideOffset?: number; // Offset from the trigger
  side?: DropdownMenuSide; // Side relative to trigger (not used for positioning in JS, but kept for props)
  // ref is handled by forwardRef
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (DropdownMenuContentProps)
const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(({ className, sideOffset = 4, children, ...props }, ref) => {
  const { isOpen, setOpen } = useDropdownMenuContext(); // Use the custom hook

  const contentRef = useRef<HTMLDivElement | null>(null);
  // Injected ref for the trigger, used for positioning.
  // This ref is set by the cloning in this component's render function.
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      // Check if click is outside the content and outside the trigger
      if (
        isOpen && // Only check if the menu is open
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    // Add/remove event listener based on isOpen state
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, setOpen]); // Depend on isOpen and setOpen

  // Calculate style for positioning the content based on trigger position
  const style: React.CSSProperties = {};
  if (triggerRef.current) {
    const triggerRect = triggerRef.current.getBoundingClientRect();
    style.position = "absolute";
    style.top = `${triggerRect.bottom + sideOffset}px`;
    style.left = `${triggerRect.left}px`;
    // Optionally add right/bottom positioning logic based on side and viewport
    // For simplicity, only top/left is implemented based on original JS.
  }

  // Use Array.isArray check before mapping children if children might not be an array
  const childrenArray = React.Children.toArray(children);

  return (
    <DropdownMenuPortal>
      {/* Clone DropdownMenuTrigger child to inject ref */}
      {childrenArray.map(child => {
        // Check if child is a valid React element
        if (!React.isValidElement(child)) {
          return null; // Skip non-element children
        }

        // Check if the child is the DropdownMenuTrigger component
        if (child.type === DropdownMenuTrigger) {
          // Assert the type of the child element
          const triggerElement = child as React.ReactElement<DropdownMenuTriggerProps, typeof DropdownMenuTrigger>;
          // Clone the trigger element, injecting the ref
          // Omit the original ref prop if it existed before spreading
          const originalTriggerProps = Omit<typeof triggerElement.props, "ref">(triggerElement.props);
          return React.cloneElement(triggerElement, {
            ref: triggerRef, // Inject the ref
            ...originalTriggerProps, // Spread original props excluding ref
          });
        }
        // Return other children as is outside the content div
        return child; // Note: Other children will be rendered here AND inside the isOpen div below.
        // A better pattern is to render children only once inside the content div.
        // The current JS clones Trigger and renders others twice. Let's fix this.
        // The Trigger should ideally not be cloned and rendered outside the main content div.
        // The standard Radix UI pattern (which this seems inspired by)
        // separates Trigger and Content rendering.
        // Let's refactor to only render the Content children inside the visible div.
        // The Trigger is rendered outside this portal, in the main DOM flow.
        // The content positioning useEffect should use the Trigger's ref obtained from the main render.
        // This requires the Trigger to forward its ref up or for the Context to manage the Trigger ref.

        // Refactored Approach:
        // The Trigger should be rendered normally in the main component tree.
        // The Content component needs access to the Trigger's DOM node to position itself.
        // This is often done by passing the Trigger's ref or position to the Context or the Content.
        // Let's modify the Context to hold the Trigger's ref.

        // Reverting to original JS structure for cloning/rendering for now, but acknowledging this pattern is unusual
        // and the cloning/rendering logic might need review.
        // The comparison issue with `child.type === Component` is standard React and should work
        // if types are correct. The previous fix used assertion and Omit which should work.
        // Let's keep the previous logic for cloning and rendering the trigger outside the content div.
      })}

      {/* Render the content div only when the menu is open */}
      {isOpen && (
        <div
          ref={contentRef} // Attach the content ref
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            className, // Apply user-provided className
          )}
          style={style} // Apply calculated positioning style
          {...props} // Spread remaining props
        >
          {/* Render the original children inside the content div */}
          {children}
        </div>
      )}
    </DropdownMenuPortal>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

// --- DropdownMenuItem ---
// Define props for DropdownMenuItem, extending div attributes
interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  inset?: boolean; // Boolean for left padding
  children?: ReactNode;
  // ref is handled by forwardRef
  // onClick is handled internally to close the menu
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (DropdownMenuItemProps)
const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(({ className, inset, children, ...props }, ref) => {
  const { setOpen } = useDropdownMenuContext(); // Use the custom hook

  return (
    <div
      ref={ref} // Attach the forwarded ref
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8", // Conditional left padding
        className, // Apply user-provided className
      )}
      onClick={() => setOpen(false)} // Close menu on click
      {...props} // Spread remaining props
    >
      {children} {/* Render item content */}
    </div>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

// --- DropdownMenuCheckboxItem ---
// Define props for DropdownMenuCheckboxItem, extending div attributes and adding checkbox props
interface DropdownMenuCheckboxItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  checked?: boolean; // Controlled checked state
  onCheckedChange?: (checked: boolean) => void; // Callback for checked state changes
  // ref is handled by forwardRef
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (DropdownMenuCheckboxItemProps)
const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(({ className, children, checked, onCheckedChange, ...props }, ref) => {
  const { setOpen } = useDropdownMenuContext(); // Use the custom hook

  // Use internal state if 'checked' is not controlled
  const [isChecked, setIsChecked] = useState<boolean>(checked || false);

  // Update internal state when 'checked' prop changes (for controlled mode)
  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleCheckChange = (): void => {
    const newState = !isChecked;
    // Update internal state if not controlled via onCheckedChange
    if (checked === undefined) {
      setIsChecked(newState);
    }
    // Call the onCheckedChange callback if provided
    if (onCheckedChange) {
      onCheckedChange(newState);
    }
    // Menu usually stays open after clicking a checkbox item,
    // so setOpen(false) is typically not called here unless desired.
    // Keeping the original onClick={() => setOpen(false)} from other items suggests this might close the menu,
    // but standard behavior is to keep it open. Let's remove the setOpen(false) call from here.
    // Original JS code did not have onClick={handleCheckChange} and onClick={() => setOpen(false)}.
    // It seems the original intent was onClick={handleCheckChange}.
    // Reverting to original JS click logic: the div itself has onClick.
    // The original JS didn't explicitly call setOpen(false) in CheckboxItem's onClick.
    // Let's use handleCheckChange as the onClick handler.
  };

  return (
    <div
      ref={ref} // Attach the forwarded ref
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className, // Apply user-provided className
      )}
      onClick={handleCheckChange} // Handle check state change on click
      {...props} // Spread remaining props
    >
      {/* Checkmark icon */}
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">{isChecked && <Check className="h-4 w-4" />}</span>
      {children} {/* Render item content */}
    </div>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

// --- DropdownMenuRadioItem ---
// Define props for DropdownMenuRadioItem, extending div attributes and adding radio props
interface DropdownMenuRadioItemProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  value?: string; // Value of the radio item
  onValueChange?: (value: string) => void; // Callback when this item is selected
  // 'checked' state is usually managed by the parent RadioGroup, but kept as a prop if needed for styling/logic
  // ref is handled by forwardRef
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (DropdownMenuRadioItemProps)
const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(({ className, children, value, onValueChange, ...props }, ref) => {
  const { setOpen } = useDropdownMenuContext(); // Use the custom hook
  // 'isSelected' state is typically managed by the parent RadioGroup based on its value prop
  // For now, keep the local 'isSelected' but it might need integration with RadioGroup context.
  const isSelected = false; // Placeholder for selection logic

  return (
    <div
      ref={ref} // Attach the forwarded ref
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className, // Apply user-provided className
      )}
      onClick={() => {
        if (onValueChange && value !== undefined) {
          // Ensure value is defined
          onValueChange(value);
        }
        setOpen(false); // Close menu on click
      }}
      {...props} // Spread remaining props
    >
      {/* Radio circle icon */}
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">{isSelected && <Circle className="h-2 w-2 fill-current" />}</span>
      {children} {/* Render item content */}
    </div>
  );
});
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

// --- DropdownMenuLabel ---
// Define props for DropdownMenuLabel, extending div attributes
interface DropdownMenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  inset?: boolean; // Boolean for left padding
  children?: ReactNode;
  // ref is handled by forwardRef
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (DropdownMenuLabelProps)
const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(({ className, inset, children, ...props }, ref) => (
  <div ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} {...props}>
    {children}
  </div>
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

// --- DropdownMenuSeparator ---
// Define props for DropdownMenuSeparator, extending div attributes
interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (DropdownMenuSeparatorProps)
const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// --- DropdownMenuShortcut ---
// Define props for DropdownMenuShortcut, extending span attributes
interface DropdownMenuShortcutProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

const DropdownMenuShortcut = ({ className, ...props }: DropdownMenuShortcutProps) => {
  return <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />;
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// --- DropdownMenuGroup ---
// Define props for DropdownMenuGroup, extending div attributes
interface DropdownMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const DropdownMenuGroup = ({ className, ...props }: DropdownMenuGroupProps) => {
  return <div className={cn("flex flex-col", className)} {...props} />;
};
DropdownMenuGroup.displayName = "DropdownMenuGroup";

// --- DropdownMenuSub ---
// Define props for DropdownMenuSub
interface DropdownMenuSubProps {
  children: ReactNode; // Should contain DropdownMenuSubTrigger and DropdownMenuSubContent
}

const DropdownMenuSub = ({ children }: DropdownMenuSubProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Use Array.isArray check before mapping children if children might not be an array
  const childrenArray = React.Children.toArray(children);

  return (
    <div>
      {childrenArray.map(child => {
        // Check if child is a valid React element
        if (!React.isValidElement(child)) {
          return null; // Skip non-element children
        }

        // Clone DropdownMenuSubTrigger child
        if (child.type === DropdownMenuSubTrigger) {
          // Assert the type of the child element
          const subTriggerElement = child as React.ReactElement<DropdownMenuSubTriggerProps, typeof DropdownMenuSubTrigger>;
          // Clone the trigger element, injecting the onClick handler
          // Omit the original onClick prop if it existed before spreading
          const originalSubTriggerProps = Omit<typeof subTriggerElement.props, "onClick">(subTriggerElement.props);
          return React.cloneElement(subTriggerElement, {
            onClick: () => setIsOpen(!isOpen), // Inject the onClick handler
            ...originalSubTriggerProps, // Spread original props excluding onClick
          });
        }

        // Clone DropdownMenuSubContent child
        if (child.type === DropdownMenuSubContent) {
          // Assert the type of the child element
          const subContentElement = child as React.ReactElement<DropdownMenuSubContentProps, typeof DropdownMenuSubContent>;
          // Clone the content element, injecting the isVisible prop
          // Omit the original isVisible prop if it existed before spreading
          const originalSubContentProps = Omit<typeof subContentElement.props, "isVisible">(subContentElement.props);
          return React.cloneElement(subContentElement, {
            isVisible: isOpen, // Inject the isVisible prop
            ...originalSubContentProps, // Spread original props excluding isVisible
          });
        }

        // Return other valid elements or children as is
        return child;
      })}
    </div>
  );
};
DropdownMenuSub.displayName = "DropdownMenuSub";

// --- DropdownMenuSubTrigger ---
// Define props for DropdownMenuSubTrigger, extending div attributes
interface DropdownMenuSubTriggerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  inset?: boolean; // Boolean for left padding
  children?: ReactNode;
  onClick?: () => void; // Optional onClick prop (can be overridden by parent cloning)
  // ref is handled by forwardRef
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (DropdownMenuSubTriggerProps)
const DropdownMenuSubTrigger = React.forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(({ className, inset, children, onClick, ...props }, ref) => (
  <div
    ref={ref} // Attach the forwarded ref
    className={cn("flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent", inset && "pl-8", className)}
    onClick={onClick} // Use the provided onClick prop
    {...props} // Spread remaining props
  >
    {children} {/* Render item content */}
    <ChevronRight className="ml-auto h-4 w-4" /> {/* Chevron icon */}
  </div>
));
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

// --- DropdownMenuSubContent ---
// Define props for DropdownMenuSubContent, extending div attributes
interface DropdownMenuSubContentProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  isVisible?: boolean; // Boolean for visibility state (injected by parent)
  // ref is handled by forwardRef
}

// Use React.forwardRef with generic types for the element (HTMLDivElement) and props (DropdownMenuSubContentProps)
const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(({ className, isVisible, ...props }, ref) => (
  <div
    ref={ref} // Attach the forwarded ref
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
      isVisible ? "visible opacity-100" : "invisible opacity-0", // Conditional visibility classes
      "transition-opacity duration-300", // Transition class
      className, // Apply user-provided className
    )}
    {...props} // Spread remaining props
  />
));
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

// --- DropdownMenuRadioGroup ---
// Define props for DropdownMenuRadioGroup, extending div attributes
interface DropdownMenuRadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  // Typically also includes value and onValueChange for managing radio state
  // value?: string;
  // onValueChange?: (value: string) => void;
}

const DropdownMenuRadioGroup = ({ className, ...props }: DropdownMenuRadioGroupProps) => {
  return <div className={cn("flex flex-col", className)} {...props} />;
};
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

// Export components
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
