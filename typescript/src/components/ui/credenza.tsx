"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query"; // Assuming useMediaQuery hook will be created in TS
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Assuming Dialog components will be created in TSX
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"; // Assuming Drawer components will be created in TSX

const desktop = "(min-width: 768px)";

interface CredenzaProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Credenza = ({ children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaComponent = isDesktop ? Dialog : Drawer;
  return <CredenzaComponent {...props}>{children}</CredenzaComponent>;
};

interface CredenzaTriggerProps extends React.HTMLAttributes<HTMLElement> {}

const CredenzaTrigger = ({ className, children, ...props }: CredenzaTriggerProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaTriggerComponent = isDesktop ? DialogTrigger : DrawerTrigger;
  return (
    <CredenzaTriggerComponent className={className} {...props}>
      {children}
    </CredenzaTriggerComponent>
  );
};

interface CredenzaCloseProps extends React.HTMLAttributes<HTMLElement> {}

const CredenzaClose = ({ className, children, ...props }: CredenzaCloseProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaCloseComponent = isDesktop ? DialogClose : DrawerClose;
  return (
    <CredenzaCloseComponent className={className} {...props}>
      {children}
    </CredenzaCloseComponent>
  );
};

interface CredenzaContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CredenzaContent = ({ className, children, ...props }: CredenzaContentProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaContentComponent = isDesktop ? DialogContent : DrawerContent;
  return (
    <CredenzaContentComponent className={cn(className)} {...props}>
      {children}
    </CredenzaContentComponent>
  );
};

interface CredenzaDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CredenzaDescription = ({ className, children, ...props }: CredenzaDescriptionProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaDescriptionComponent = isDesktop ? DialogDescription : DrawerDescription;
  return (
    <CredenzaDescriptionComponent className={cn(className)} {...props}>
      {children}
    </CredenzaDescriptionComponent>
  );
};

interface CredenzaHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CredenzaHeader = ({ className, children, ...props }: CredenzaHeaderProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaHeaderComponent = isDesktop ? DialogHeader : DrawerHeader;
  return (
    <CredenzaHeaderComponent className={cn(className)} {...props}>
      {children}
    </CredenzaHeaderComponent>
  );
};

interface CredenzaTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const CredenzaTitle = ({ className, children, ...props }: CredenzaTitleProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaTitleComponent = isDesktop ? DialogTitle : DrawerTitle;
  return (
    <CredenzaTitleComponent className={cn(className)} {...props}>
      {children}
    </CredenzaTitleComponent>
  );
};

interface CredenzaBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const CredenzaBody = ({ className, children, ...props }: CredenzaBodyProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  );
};

interface CredenzaFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CredenzaFooter = ({ className, children, ...props }: CredenzaFooterProps) => {
  const isDesktop = useMediaQuery(desktop);
  const CredenzaFooterComponent = isDesktop ? DialogFooter : DrawerFooter;
  return (
    <CredenzaFooterComponent className={cn(className)} {...props}>
      {children}
    </CredenzaFooterComponent>
  );
};

export { Credenza, CredenzaTrigger, CredenzaClose, CredenzaContent, CredenzaDescription, CredenzaHeader, CredenzaTitle, CredenzaBody, CredenzaFooter };
