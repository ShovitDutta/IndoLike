"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <div ref={ref} className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)} {...props}>
    <div className="h-full flex-1 bg-primary transition-all" style={{ width: `${value || 0}%` }} role="progressbar" aria-valuenow={value || 0} />
  </div>
));
Progress.displayName = "Progress";
export { Progress };
