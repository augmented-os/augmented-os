import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Updated imports for Data Router
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { routeObjects } from './routes.config';

// Import Layout and Pages - these are used by routeObjects, so keep them if not tree-shaken
// import Layout from '@/components/layout/Layout'; 
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import WorkflowsPage from "./pages/WorkflowsPage";
// import ComingSoonPage from "@/pages/ComingSoonPage";

const queryClient = new QueryClient();

// Create the router instance using routeObjects
const router = createBrowserRouter(routeObjects);

// AppRoutes component is no longer needed as routeObjects is passed directly

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Use RouterProvider instead of BrowserRouter */}
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
