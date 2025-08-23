
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/layout/ThemeContext";
import Layout from "./components/layout/Layout";
import Overview from "./pages/Overview";
import Planning from "./pages/Planning";
import Development from "./pages/Development";
import Implementation from "./pages/Implementation";
import Deployment from "./pages/Deployment";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
            <Layout>
              <Overview />
            </Layout>
          } />
          <Route path="/planning" element={
            <Layout>
              <Planning />
            </Layout>
          } />
          <Route path="/development" element={
            <Layout>
              <Development />
            </Layout>
          } />
          <Route path="/implementation" element={
            <Layout>
              <Implementation />
            </Layout>
          } />
          <Route path="/deployment" element={
            <Layout>
              <Deployment />
            </Layout>
          } />
          <Route path="/insights" element={
            <Layout>
              <Insights />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout>
              <Settings />
            </Layout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
