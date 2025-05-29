import { useSidebar as useInternalSidebar } from "../context/sidebar-context"

/**
 * Hook to access sidebar context from any component
 */
export function useSidebar() {
  return useInternalSidebar()
} 