import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Overview from "./pages/Overview";
import Planning from "./pages/Planning";
import Development from "./pages/Development";
import Implementation from "./pages/Implementation";
import Deployment from "./pages/Deployment";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SdlcDashboard from "./pages/SdlcDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Overview /></Layout>,
    errorElement: <NotFound />,
  },
  {
    path: "/planning",
    element: <Layout><Planning /></Layout>,
  },
  {
    path: "/development",
    element: <Layout><Development /></Layout>,
  },
  {
    path: "/implementation",
    element: <Layout><Implementation /></Layout>,
  },
  {
    path: "/deployment",
    element: <Layout><Deployment /></Layout>,
  },
  {
    path: "/insights",
    element: <Layout><Insights /></Layout>,
  },
  {
    path: "/settings",
    element: <Layout><Settings /></Layout>,
  },
  {
    path: "/sdlc",
    element: <Layout><SdlcDashboard /></Layout>,
  },
]);
