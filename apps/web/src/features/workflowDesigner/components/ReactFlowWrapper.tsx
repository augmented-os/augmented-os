import React from 'react';
import { ReactFlowProvider } from 'reactflow';

interface ReactFlowWrapperProps {
  children: React.ReactNode;
}

const ReactFlowWrapper: React.FC<ReactFlowWrapperProps> = ({ children }) => {
  return (
    <ReactFlowProvider>
      {children}
    </ReactFlowProvider>
  );
};

export default ReactFlowWrapper; 