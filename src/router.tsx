import { createBrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/NotFound";

const Overview = React.lazy(() => import("./pages/Overview"));
const Planning = React.lazy(() => import("./pages/Planning"));
const Development = React.lazy(() => import("./pages/Development"));
const Implementation = React.lazy(() => import("./pages/Implementation"));
const Deployment = React.lazy(() => import("./pages/Deployment"));
const Insights = React.lazy(() => import("./pages/Insights"));
const Settings = React.lazy(() => import("./pages/Settings"));
const SdlcDashboard = React.lazy(() => import("./pages/SdlcDashboard"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Suspense fallback={<div>Loading...</div>}><Overview /></Suspense></Layout>,
    errorElement: <NotFound />,
  },
  {
    path: "/planning",
    element: <Layout><Suspense fallback={<div>Loading...</div>}><Planning /></Suspense></Layout>,
  },
  {
    path: "/development",
    element: <Layout><Suspense fallback={<div>Loading...</div>}><Development /></Suspense></Layout>,
  },
  {
    path: "/implementation",
    element: <Layout><Suspense fallback={<div>Loading...</div>}><Implementation /></Suspense></Layout>,
  },
  {
    path: "/deployment",
    element: <Layout><Suspense fallback={<div>Loading...</div>}><Deployment /></Suspense></Layout>,
  },
  {
    path: "/insights",
    element: <Layout><Suspense fallback={<div>Loading...</div>}><Insights /></Suspense></Layout>,
  },
  {
    path: "/settings",
    element: <Layout><Suspense fallback={<div>Loading...</div>}><Settings /></Suspense></Layout>,
  },
  {
    path: "/sdlc",
    element: <Layout><Suspense fallback={<div>Loading...</div>}><SdlcDashboard /></Suspense></Layout>,
  },
]);
