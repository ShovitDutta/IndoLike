"use client";

import { cn } from "@/lib/utils"; // Assuming cn is a typed utility for combining class names
import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels"; // Assuming react-resizable-panels provides its own types
import { type PanelGroupProps, type PanelResizeHandleProps } from "react-resizable-panels"; // Import necessary types

// --- ResizablePanelGroup ---
// Define props for ResizablePanelGroup, extending the original PanelGroupProps
interface ResizablePanelGroupProps extends PanelGroupProps {
  className?: string;
  // Rest props are inherited from PanelGroupProps
}

const ResizablePanelGroup = ({ className, ...props }: ResizablePanelGroupProps) => (
  <ResizablePrimitive.PanelGroup className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)} {...props} />
);
ResizablePanelGroup.displayName = "ResizablePanelGroup"; // Add display name

// --- ResizablePanel ---
// This is just an alias, no additional typing needed beyond the import
const ResizablePanel = ResizablePrimitive.Panel;
ResizablePanel.displayName = "ResizablePanel"; // Add display name

// --- ResizableHandle ---
// Define props for ResizableHandle, extending the original PanelResizeHandleProps
interface ResizableHandleProps extends PanelResizeHandleProps {
  className?: string;
  withHandle?: boolean; // Optional boolean prop for rendering the handle icon
  // Rest props are inherited from PanelResizeHandleProps
}

const ResizableHandle = ({ withHandle, className, ...props }: ResizableHandleProps) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className,
    )}
    {...props} // Spread remaining PanelResizeHandleProps
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" /> {/* Render GripVertical icon */}
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
);
ResizableHandle.displayName = "ResizableHandle"; // Add display name

// Export components
export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
