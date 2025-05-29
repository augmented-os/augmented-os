import React from 'react';
import { RouteObject } from 'react-router-dom';

// Import Layout and Pages
import Layout from '@/components/layout/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import WorkflowsPage from './pages/WorkflowsPage';
import ComingSoonPage from '@/pages/ComingSoonPage';
import IntegrationsHubPage from '@/pages/IntegrationsHubPage';
import SchemaEditorPage from '@/pages/SchemaEditorPage';
import TaskInboxPage from '@/pages/TaskInboxPage';

export const routeObjects: RouteObject[] = [
  {
    // Wrap main routes within the Layout component
    element: <Layout />, 
    children: [
      { path: '/', element: <Index /> },
      
      // Workflow route
      { path: '/build/workflows/:id?', element: <WorkflowsPage /> },
      
      // Integrations route - updated from "Coming Soon" to actual page
      { path: '/build/integrations/:id?', element: <IntegrationsHubPage /> },

      // Schema Editor route
      { path: '/build/data/:id?', element: <SchemaEditorPage /> },

      // Task Inbox route
      { path: '/work/tasks', element: <TaskInboxPage /> },

      // Coming Soon Routes
      { path: '/build', element: <ComingSoonPage /> },
      { path: '/work/workflows/:id?', element: <ComingSoonPage /> },
      { path: '/build/docs', element: <ComingSoonPage /> },
      { path: '/work', element: <ComingSoonPage /> },
      { path: '/work/data', element: <ComingSoonPage /> },
      { path: '/work/docs', element: <ComingSoonPage /> },
      
      // Add future routes intended for the main layout here
    ],
  },
  // Catch-all route - outside the main layout
  { path: '*', element: <NotFound /> },
]; 