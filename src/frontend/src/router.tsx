import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Overview.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
