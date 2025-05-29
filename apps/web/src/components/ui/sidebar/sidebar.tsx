import * as React from "react"
import { SidebarProps } from "./types"
import { SidebarDefault } from "./variants/sidebar-default"
import { SidebarFloating } from "./variants/sidebar-floating"
import { SidebarInset } from "./variants/sidebar-inset"

/**
 * Sidebar component that selects the appropriate variant based on props
 */
export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      variant = "sidebar",
      ...props
    },
    ref
  ) => {
    switch (variant) {
      case "floating":
        return <SidebarFloating ref={ref} variant={variant} {...props} />
      case "inset":
        return <SidebarInset ref={ref} variant={variant} {...props} />
      default:
        return <SidebarDefault ref={ref} variant={variant} {...props} />
    }
  }
)
Sidebar.displayName = "Sidebar" 