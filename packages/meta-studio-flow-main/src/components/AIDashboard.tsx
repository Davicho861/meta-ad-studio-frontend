import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Metric {
  tasksCompleted: number;
  apiCosts: number;
  gcpCosts: number;
}

interface Log {
  prompt: string;
  reasoningEffort: string;
}

interface Monetization {
  revenue: number;
  activeUsers: number;
}

interface IaCWorkspace {
  name: string;
  status: string;
}

interface Alert {
  message: string;
  timestamp: string;
}

const AIDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [monetization, setMonetization] = useState<Monetization | null>(null);
  const [iacWorkspaces, setIacWorkspaces] = useState<IaCWorkspace[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metricsRes = await fetch('http://localhost:3000/api/dashboard/autonomy-metrics');
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);

        const logsRes = await fetch('http://localhost:3000/api/dashboard/reasoning-logs');
        const logsData = await logsRes.json();
        setLogs(logsData);

        const monetizationRes = await fetch('http://localhost:3000/api/dashboard/monetization-metrics');
        const monetizationData = await monetizationRes.json();
        setMonetization(monetizationData);

        const iacRes = await fetch('http://localhost:3000/api/dashboard/iac-workspaces');
        const iacData = await iacRes.json();
        setIacWorkspaces(iacData);

        const alertsRes = await fetch('http://localhost:3000/api/dashboard/alerts');
        const alertsData = await alertsRes.json();
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AI Autonomous System Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold">Autonomy Metrics</h2>
          <p>Tasks Completed: {metrics?.tasksCompleted}</p>
          <p>Gemini API Costs: ${metrics?.apiCosts.toFixed(2)}</p>
          <p>GCP Costs: ${metrics?.gcpCosts.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold">Monetization</h2>
          <p>Total Revenue: ${monetization?.revenue}</p>
          <p>Active Users: {monetization?.activeUsers}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold">Controls</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Pause Agents</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Activate Feature Flag</button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Cost & Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            <Line type="monotone" dataKey="costs" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold">IaC Workspaces</h2>
          <ul>
            {iacWorkspaces.map((ws, index) => (
              <li key={index}>{ws.name}: {ws.status}</li>
            ))}
          </ul>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold">Alerts</h2>
          <ul>
            {alerts.map((alert, index) => (
              <li key={index}>{alert.timestamp}: {alert.message}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Reasoning Logs</h2>
        <ul className="list-disc pl-5">
          {logs.map((log, index) => (
            <li key={index}>
              <strong>Prompt:</strong> {log.prompt} (<strong>Effort:</strong> {log.reasoningEffort})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AIDashboard;
