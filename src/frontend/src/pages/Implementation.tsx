import React from "react";

import { CheckCircle, BarChart3, UserCheck, AlertCircle, PlusCircle } from "lucide-react";
import AIAgentCard from "../components/dashboard/AIAgentCard";
import StatCard from "../components/dashboard/StatCard";

const implAgents = [
  {
    name: "Pruebas",
    type: "QA",
    status: "active" as const,
    currentTask: "Pruebas de integración de módulos",
    progress: 45,
  },
  {
    name: "EvaluaciónSistema",
    type: "Calidad",
    status: "active" as const,
    currentTask: "Evaluación de rendimiento general",
    progress: 30,
  },
  {
    name: "OptimizaciónIA",
    type: "Optimización",
    status: "idle" as const,
    currentTask: "Esperando resultados de pruebas",
    progress: 0,
  },
];

const testResults = [
  {
    category: "Pruebas unitarias",
    passed: 245,
    failed: 12,
    skipped: 3,
    total: 260,
  },
  {
    category: "Pruebas de integración",
    passed: 68,
    failed: 8,
    skipped: 4,
    total: 80,
  },
  {
    category: "Pruebas de usabilidad",
    passed: 12,
    failed: 3,
    skipped: 0,
    total: 15,
  },
];

const usabilityFeedback = [
  {
    id: 1,
    user: "Usuario #125",
    comment: "La navegación es intuitiva, pero los tiempos de carga son lentos en la sección de reportes.",
    rating: 4,
    date: "Hace 2 días",
  },
  {
    id: 2,
    user: "Usuario #089",
    comment: "Me gusta el diseño visual, pero tuve dificultades para encontrar la función de exportar datos.",
    rating: 3,
    date: "Hace 3 días",
  },
  {
    id: 3,
    user: "Usuario #156",
    comment: "La aplicación funciona muy bien en mi iPad, pero en mi iPhone algunos elementos no se ven correctamente.",
    rating: 3,
    date: "Hace 4 días",
  },
];

const pendingTasks = [
  { id: "T-001", title: "Optimizar consultas a la base de datos", priority: "Alta", status: "En progreso" },
  { id: "T-002", title: "Corregir problemas de UI en dispositivos móviles", priority: "Media", status: "Por hacer" },
  { id: "T-003", title: "Implementar cache para mejorar rendimiento", priority: "Alta", status: "En progreso" },
  { id: "T-004", title: "Actualizar documentación de la API", priority: "Baja", status: "Por hacer" },
];

const Implementation = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-1">Implementación</h1>
        <p className="text-gray-500">Pruebas, evaluación y ajustes finales</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pruebas completadas"
          value={325}
          icon={<CheckCircle size={18} />}
          trend={{ value: 48, isPositive: true }}
          iconBg="bg-green-100"
          iconColor="text-apple-green"
        />
        <StatCard
          title="Tasa de éxito"
          value="92%"
          icon={<BarChart3 size={18} />}
          trend={{ value: 3, isPositive: true }}
          iconBg="bg-blue-100"
          iconColor="text-apple-blue"
        />
        <StatCard
          title="Satisfacción usuarios"
          value="4.2/5"
          icon={<UserCheck size={18} />}
          trend={{ value: 0.3, isPositive: true }}
          iconBg="bg-purple-100"
          iconColor="text-apple-purple"
        />
        <StatCard
          title="Problemas abiertos"
          value={7}
          icon={<AlertCircle size={18} />}
          trend={{ value: 2, isPositive: false }}
          iconBg="bg-red-100"
          iconColor="text-apple-red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Resultados de pruebas</h2>
            <button className="apple-button-secondary flex items-center text-sm">
              <PlusCircle size={16} className="mr-2" />
              <span>Nueva prueba</span>
            </button>
          </div>
          
          <div className="space-y-6">
            {testResults.map((test) => (
              <div key={test.category} className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">{test.category}</h3>
                  <span className="text-xs text-gray-500">
                    {test.passed} / {test.total} pasadas ({Math.round((test.passed / test.total) * 100)}%)
                  </span>
                </div>
                
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-apple-green"
                      style={{ width: `${(test.passed / test.total) * 100}%` }}
                    ></div>
                    <div
                      className="bg-apple-red"
                      style={{ width: `${(test.failed / test.total) * 100}%` }}
                    ></div>
                    <div
                      className="bg-gray-300"
                      style={{ width: `${(test.skipped / test.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex text-xs">
                  <div className="flex items-center mr-4">
                    <div className="w-2 h-2 rounded-full bg-apple-green mr-1"></div>
                    <span className="text-gray-600">Pasadas ({test.passed})</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <div className="w-2 h-2 rounded-full bg-apple-red mr-1"></div>
                    <span className="text-gray-600">Fallidas ({test.failed})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
                    <span className="text-gray-600">Omitidas ({test.skipped})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="text-base font-medium mb-4">Rendimiento</h3>
            <div className="h-48 w-full bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Gráfico de rendimiento</p>
            </div>
          </div>
        </div>

        <div className="apple-card p-6">
          <h2 className="text-lg font-medium mb-6">Feedback de usabilidad</h2>
          
          <div className="space-y-4">
            {usabilityFeedback.map((feedback) => (
              <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex space-x-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-apple-blue bg-opacity-10 flex items-center justify-center">
                      <UserCheck size={16} className="text-apple-blue" />
                    </div>
                    <span className="font-medium text-sm">{feedback.user}</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-3">{feedback.comment}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{feedback.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="apple-card p-6">
        <h2 className="text-lg font-medium mb-6">Ajustes Finales</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Prioridad</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{task.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{task.title}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === "Alta" ? "bg-red-100 text-red-800" : 
                      task.priority === "Media" ? "bg-yellow-100 text-yellow-800" : 
                      "bg-green-100 text-green-800"
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === "Completado" ? "bg-green-100 text-green-800" : 
                      task.status === "En progreso" ? "bg-blue-100 text-blue-800" : 
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Agentes de IA - Implementación</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {implAgents.map((agent) => (
            <AIAgentCard key={agent.name} {...agent} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Implementation;
