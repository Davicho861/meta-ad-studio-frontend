import React from "react";

import { Code, Activity, GitBranch, Bug, CheckCircle, PlusCircle } from "lucide-react";
import AIAgentCard from "../components/dashboard/AIAgentCard";
import StatCard from "../components/dashboard/StatCard";

const devAgents = [
  {
    name: "DesarrolloFront",
    type: "Frontend",
    status: "active" as const,
    currentTask: "Implementación de interfaz de usuario",
    progress: 65,
  },
  {
    name: "DesarrolloBack",
    type: "Backend",
    status: "active" as const,
    currentTask: "Desarrollo de API RESTful",
    progress: 48,
  },
  {
    name: "Integración",
    type: "DevOps",
    status: "paused" as const,
    currentTask: "Optimización de pipeline CI/CD",
    progress: 30,
  },
];

const codingProgress = [
  {
    name: "Frontend",
    total: 120,
    completed: 78,
    inReview: 22,
    pending: 20,
  },
  {
    name: "Backend",
    total: 95,
    completed: 56,
    inReview: 18,
    pending: 21,
  },
];

const recentCommits = [
  {
    id: "abc123",
    message: "Fix: Corregir problema de renderizado en componente Dashboard",
    author: "María García",
    time: "Hace 2 horas",
    type: "fix",
  },
  {
    id: "def456",
    message: "Feature: Implementar autenticación con OAuth",
    author: "Carlos Mendez",
    time: "Hace 4 horas",
    type: "feature",
  },
  {
    id: "ghi789",
    message: "Refactor: Optimizar consultas a la base de datos",
    author: "Ana López",
    time: "Hace 1 día",
    type: "refactor",
  },
  {
    id: "jkl012",
    message: "Docs: Actualizar documentación de API",
    author: "David Torres",
    time: "Hace 1 día",
    type: "docs",
  },
];

const getCommitTypeColor = (type: string) => {
  switch (type) {
    case "fix":
      return "bg-red-100 text-red-800";
    case "feature":
      return "bg-green-100 text-green-800";
    case "refactor":
      return "bg-blue-100 text-blue-800";
    case "docs":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const Development = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-1">Desarrollo</h1>
        <p className="text-gray-500">Codificación frontend y backend</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Líneas de código"
          value="32,450"
          icon={<Code size={18} />}
          trend={{ value: 3840, isPositive: true }}
          iconBg="bg-blue-100"
          iconColor="text-apple-blue"
        />
        <StatCard
          title="Commits"
          value={246}
          icon={<GitBranch size={18} />}
          trend={{ value: 42, isPositive: true }}
          iconBg="bg-purple-100"
          iconColor="text-apple-purple"
        />
        <StatCard
          title="Bugs detectados"
          value={15}
          icon={<Bug size={18} />}
          trend={{ value: 3, isPositive: false }}
          iconBg="bg-red-100"
          iconColor="text-apple-red"
        />
        <StatCard
          title="Tests pasados"
          value="89%"
          icon={<CheckCircle size={18} />}
          trend={{ value: 2, isPositive: true }}
          iconBg="bg-green-100"
          iconColor="text-apple-green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Progreso de la codificación</h2>
            <button className="apple-icon-button">
              <Activity size={18} className="text-gray-600" />
            </button>
          </div>
          
          {codingProgress.map((item) => (
            <div key={item.name} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <span className="text-xs text-gray-500">
                  {Math.round((item.completed / item.total) * 100)}% completado
                </span>
              </div>
              
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div
                    className="bg-apple-green"
                    style={{ width: `${(item.completed / item.total) * 100}%` }}
                  ></div>
                  <div
                    className="bg-apple-blue"
                    style={{ width: `${(item.inReview / item.total) * 100}%` }}
                  ></div>
                  <div
                    className="bg-gray-300"
                    style={{ width: `${(item.pending / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex mt-2 text-xs">
                <div className="flex items-center mr-4">
                  <div className="w-2 h-2 rounded-full bg-apple-green mr-1"></div>
                  <span className="text-gray-600">Completado ({item.completed})</span>
                </div>
                <div className="flex items-center mr-4">
                  <div className="w-2 h-2 rounded-full bg-apple-blue mr-1"></div>
                  <span className="text-gray-600">En revisión ({item.inReview})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
                  <span className="text-gray-600">Pendiente ({item.pending})</span>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium">Cobertura de pruebas</h3>
            </div>
            <div className="h-48 w-full bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Gráfico de cobertura de pruebas</p>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Actividad reciente</h2>
            <button className="apple-button-secondary flex items-center text-sm">
              <PlusCircle size={16} className="mr-2" />
              <span>Nueva rama</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {recentCommits.map((commit) => (
              <div key={commit.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${getCommitTypeColor(
                        commit.type
                      )}`}
                    >
                      {commit.type}
                    </span>
                    <span className="text-xs text-gray-500">{commit.time}</span>
                  </div>
                  <p className="text-sm font-medium mt-2">{commit.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{commit.author}</span>
                    <span className="text-xs font-mono text-gray-500">
                      {commit.id.slice(0, 6)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button className="text-apple-blue text-sm font-medium">
              Ver todo el historial
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Agentes de IA - Desarrollo</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {devAgents.map((agent) => (
            <AIAgentCard key={agent.name} {...agent} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Development;
