import React from "react";

import { Toaster as Sonner } from "./components/ui/sonner.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { AppRouter } from "./router.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Sonner />
        <AppRouter />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
