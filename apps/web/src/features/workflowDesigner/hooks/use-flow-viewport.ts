import { useCallback } from 'react';
import { ReactFlowInstance, FitViewOptions } from 'reactflow';

/**
 * Custom hook for managing viewport operations in the workflow designer
 */
export function useFlowViewport(reactFlowInstance: ReactFlowInstance | null) {
  // Reset view to center horizontally and align top vertically
  const resetView = useCallback(() => {
    if (reactFlowInstance) {
      // Use fitView with options first to position nodes
      reactFlowInstance.fitView({
        padding: 0.2,
        duration: 0,
        minZoom: 1,
        maxZoom: 1
      });
      
      // Ensure consistent vertical alignment by getting the current viewport
      // and adjusting only the y-position if needed
      setTimeout(() => {
        const { x, zoom } = reactFlowInstance.getViewport();
        const bounds = reactFlowInstance.getNodes().reduce(
          (acc, node) => {
            acc.minY = Math.min(acc.minY, node.position.y);
            return acc;
          },
          { minY: Infinity }
        );
        
        // If there are nodes, adjust the vertical position to align the top node with the top of the visible area
        if (bounds.minY !== Infinity) {
          const topNodeOffset = bounds.minY * zoom;
          const verticalPadding = 50; // Adjust as needed
          reactFlowInstance.setViewport({ x, y: -topNodeOffset + verticalPadding, zoom });
        }
      }, 50);
    }
  }, [reactFlowInstance]);

  // Zoom in
  const zoomIn = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
    }
  }, [reactFlowInstance]);

  // Zoom out
  const zoomOut = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
    }
  }, [reactFlowInstance]);

  // Fit view to see all nodes
  const fitView = useCallback((options?: FitViewOptions) => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView(options || { padding: 0.2 });
    }
  }, [reactFlowInstance]);

  return {
    resetView,
    zoomIn,
    zoomOut,
    fitView
  };
} 