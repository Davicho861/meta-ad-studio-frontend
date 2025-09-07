import React from "react";

import { Rocket, Activity, Server, Clock, Users, PlusCircle } from "lucide-react";
import AIAgentCard from "../components/dashboard/AIAgentCard";
import StatCard from "../components/dashboard/StatCard";

const deployAgents = [
  {
    name: "DevOps",
    type: "Automatización",
    status: "active" as const,
    currentTask: "Configuración de pipeline de despliegue",
    progress: 70,
  },
  {
    name: "Integración",
    type: "CI/CD",
    status: "active" as const,
    currentTask: "Automatización de pruebas pre-despliegue",
    progress: 55,
  },
  {
    name: "Mantenimiento",
    type: "Soporte",
    status: "idle" as const,
    currentTask: "Esperando despliegue",
    progress: 0,
  },
];

const Deployment = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-1">Despliegue</h1>
        <p className="text-gray-500">Automatización, monitoreo y soporte</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tiempo de despliegue"
          value="4.5 min"
          icon={<Clock size={18} />}
          trend={{ value: 35, isPositive: true }}
          iconBg="bg-blue-100"
          iconColor="text-apple-blue"
        />
        <StatCard
          title="Uptime"
          value="99.98%"
          icon={<Activity size={18} />}
          iconBg="bg-green-100"
          iconColor="text-apple-green"
        />
        <StatCard
          title="Servidores activos"
          value={8}
          icon={<Server size={18} />}
          iconBg="bg-purple-100"
          iconColor="text-apple-purple"
        />
        <StatCard
          title="Usuarios concurrentes"
          value={452}
          icon={<Users size={18} />}
          trend={{ value: 12, isPositive: true }}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Proceso de Despliegue</h2>
            <button className="apple-button flex items-center text-sm">
              <Rocket size={16} className="mr-2" />
              <span>Iniciar despliegue</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="relative pb-12">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-apple-green z-10">
                  <CheckIcon size={18} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Compilación</h3>
                  <p className="text-xs text-gray-500">Completado hace 45 minutos</p>
                </div>
              </div>
              <div className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
            </div>
            
            <div className="relative pb-12">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-apple-green z-10">
                  <CheckIcon size={18} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Pruebas automatizadas</h3>
                  <p className="text-xs text-gray-500">Completado hace 32 minutos</p>
                </div>
              </div>
              <div className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
            </div>
            
            <div className="relative pb-12">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-apple-blue z-10">
                  <LoaderIcon size={18} className="animate-spin" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Despliegue a QA</h3>
                  <p className="text-xs text-gray-500">En progreso</p>
                </div>
              </div>
              <div className="absolute top-8 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
            </div>
            
            <div className="relative">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 z-10">
                  <Rocket size={18} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Despliegue a producción</h3>
                  <p className="text-xs text-gray-500">Pendiente</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <h2 className="text-lg font-medium mb-6">Monitoreo en tiempo real</h2>
          <div className="h-64 w-full bg-gray-50 rounded-lg mb-6 flex items-center justify-center">
            <p className="text-gray-400">Gráfico de rendimiento del servidor</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium mb-2">Uso de CPU</h3>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Carga actual</span>
                <span className="text-xs font-medium">42%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                <div className="h-full bg-apple-blue rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium mb-2">Uso de memoria</h3>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Asignación actual</span>
                <span className="text-xs font-medium">65%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                <div className="h-full bg-apple-green rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <h2 className="text-lg font-medium mb-6">Soporte técnico</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-semibold text-apple-green">2</h3>
              <p className="text-xs text-gray-500 mt-1">Tickets abiertos</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-semibold text-apple-blue">8</h3>
              <p className="text-xs text-gray-500 mt-1">En progreso</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-semibold text-apple-purple">45</h3>
              <p className="text-xs text-gray-500 mt-1">Resueltos</p>
            </div>
          </div>
          
          <button className="apple-button w-full flex items-center justify-center">
            <PlusCircle size={16} className="mr-2" />
            <span>Nuevo ticket</span>
          </button>
        </div>
        
        <div className="apple-card p-6">
          <h2 className="text-lg font-medium mb-6">Mantenimiento continuo</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <ClockIcon size={16} className="text-apple-blue" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Actualización de seguridad</p>
                  <p className="text-xs text-gray-500">Programada para 12/05/2025</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Programado
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <RefreshCcwIcon size={16} className="text-apple-green" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Actualización de dependencias</p>
                  <p className="text-xs text-gray-500">Automáticamente cada semana</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Activo
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Agentes de IA - Despliegue</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deployAgents.map((agent) => (
            <AIAgentCard key={agent.name} {...agent} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Define missing icons
const CheckIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LoaderIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);

const ClockIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const RefreshCcwIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 2v6h6" />
    <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
    <path d="M21 22v-6h-6" />
    <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
  </svg>
);

export default Deployment;
