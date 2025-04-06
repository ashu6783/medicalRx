"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "transition-all duration-300",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 shadow-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-400",

          side === "right" && [
            "inset-y-0 right-0 h-full w-3/4 sm:max-w-md",
            "border-l rounded-l-lg",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
          ],

          side === "left" && [
            "inset-y-0 left-0 h-full w-3/4 sm:max-w-md",
            "border-r rounded-r-lg",
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
          ],

          side === "top" && [
            "inset-x-0 top-0 h-auto w-full",
            "border-b rounded-b-lg",
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top"
          ],

          side === "bottom" && [
            "inset-x-0 bottom-0 h-auto w-full",
            "border-t rounded-t-lg",
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
          ],
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className={cn(
            "absolute top-4 right-4 p-1",
            "rounded-full opacity-70 ring-offset-background",
            "hover:opacity-100 hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "transition-all duration-200",
            "focus:outline-none disabled:pointer-events-none"
          )}
        >
          <XIcon className="size-5" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        "mt-auto flex flex-col gap-2 p-4",
        "border-t bg-muted/30",
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}