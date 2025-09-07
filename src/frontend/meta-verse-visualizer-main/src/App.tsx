import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster as HotToaster } from 'react-hot-toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HotToaster toastOptions={{
        style: {
          background: '#1E1E1E', // surface-dark
          color: '#E0E0E0', // primary-text
          border: '1px solid #333'
        },
      }} />
      <BrowserRouter>
          {/* Tiny dev-only banner to verify Hot Reload updates quickly */}
          <div style={{position: 'fixed', top: 8, right: 8, zIndex: 9999, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: 6, fontSize: 12}}>
            Dev HotReload: {new Date().toLocaleTimeString()}
          </div>
        <Routes>
          <Route path='/' element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
