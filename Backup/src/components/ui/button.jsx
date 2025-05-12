import * as React from "react";
import { cn } from "@/lib/utils";

const baseClasses =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, Icon, iconPlacement, children, ...props }, ref) => {
  const classes = cn(
    baseClasses,
    variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
    variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
    variant === "link" && "text-primary underline-offset-4 hover:underline",
    variant === "expandIcon" && "group relative text-primary-foreground bg-primary hover:bg-primary/90",
    variant === "ringHover" && "bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
    variant === "shine" && "text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] ",
    variant === "gooeyRight" &&
      "text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-zinc-400 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%] ",
    variant === "gooeyLeft" &&
      "text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-400 after:transition-transform after:ease-in-out after:duration-300  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ",
    variant === "linkHover1" &&
      "relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
    variant === "linkHover2" &&
      "relative after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
    size === "default" && "h-10 px-4 py-2",
    size === "sm" && "h-9 rounded-md px-3",
    size === "lg" && "h-11 rounded-md px-8",
    size === "icon" && "h-10 w-10",
    className,
  );

  const content = (
    <>
      {Icon && iconPlacement === "left" && (
        <div className="w-0 translate-x-[0%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-100 group-hover:pr-2 group-hover:opacity-100">
          <Icon />
        </div>
      )}
      {children}
      {Icon && iconPlacement === "right" && (
        <div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
          <Icon />
        </div>
      )}
    </>
  );

  if (asChild) {
    // If asChild is true, we assume the child is the element to apply classes to.
    // We need to clone the child and add the classes.
    // This is a simplified version of Radix UI's Slot/Slottable.
    if (React.isValidElement(children)) {
      return React.cloneElement(
        children,
        {
          className: cn(classes, children.props.className),
          ref,
          ...props,
        },
        content,
      );
    }
    return null; // Or handle error appropriately
  }

  return (
    <button className={classes} ref={ref} {...props}>
      {content}
    </button>
  );
});
Button.displayName = "Button";

export { Button };
