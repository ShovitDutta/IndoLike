import { cn } from "@/lib/utils"; // Assuming cn utility will be created in TS
import React from "react";

// Define types for the component props
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };