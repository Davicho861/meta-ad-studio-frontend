import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MetaverseDashboard from "./components/MetaverseDashboard";
import Board from "./pages/Board";
import { AppBar } from "./components/AppBar";
import { useEffect, useState } from "react";
import api from "./lib/api";
import BacklogPage from "./pages/Backlog";
import Issues from "./pages/Issues";
import Roadmap from "./pages/Roadmap";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUsername(response.data.username);
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      setUsername("Guest");
    }
  };

    const token = localStorage.getItem('jwt_token');
    if (token) {
      fetchUser();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AppBar username={username || "Guest"} />
          <Routes>
            <Route path="/" element={<MetaverseDashboard />} />
            <Route path="/board" element={<Board />} />
            <Route path="/backlog" element={<BacklogPage />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/reports" element={<Reports />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
  </QueryClientProvider>
  );
};
export default App;
