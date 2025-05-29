import * as React from "react"
import { VariantProps } from "class-variance-authority"
import { TooltipContent } from "@/components/ui/tooltip"
import { sidebarMenuButtonVariants } from "./constants"

/**
 * Sidebar context type
 */
export type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

/**
 * Props for the SidebarProvider component
 */
export interface SidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * Props for the Sidebar component
 */
export interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}

/**
 * Props for the SidebarMenuButton component
 */
export interface SidebarMenuButtonProps extends 
  React.ComponentProps<"button">, 
  VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
}

/**
 * Props for the SidebarMenuAction component
 */
export interface SidebarMenuActionProps extends React.ComponentProps<"button"> {
  asChild?: boolean
  showOnHover?: boolean
}

/**
 * Props for the SidebarMenuSkeleton component
 */
export interface SidebarMenuSkeletonProps extends React.ComponentProps<"div"> {
  showIcon?: boolean
}

/**
 * Props for the SidebarMenuSubButton component
 */
export interface SidebarMenuSubButtonProps extends React.ComponentProps<"a"> {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}

/**
 * Props for the SidebarGroupLabel component
 */
export interface SidebarGroupLabelProps extends React.ComponentProps<"div"> {
  asChild?: boolean
}
