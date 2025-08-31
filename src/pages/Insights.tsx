import React from "react";

import { BarChart3, LineChart, PieChart, TrendingUp, Filter } from "lucide-react";

const Insights = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-1">Insights</h1>
        <p className="text-gray-500">Análisis predictivo y visualización de datos</p>
      </div>

      <div className="flex mb-6">
        <div className="flex space-x-2 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
          <button className="px-4 py-2 rounded-md bg-apple-blue text-white text-sm">Todos</button>
          <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm">Planeación</button>
          <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm">Desarrollo</button>
          <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm">Implementación</button>
          <button className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm">Despliegue</button>
        </div>
        <div className="ml-auto">
          <button className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-2">
            <Filter size={18} className="mr-2 text-gray-500" />
            <span className="text-gray-600 text-sm">Filtrar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <TrendingUp size={20} className="text-apple-blue" />
              </div>
              <div>
                <h2 className="text-lg font-medium">Tendencia de progreso</h2>
                <p className="text-xs text-gray-500">Últimas 4 semanas</p>
              </div>
            </div>
          </div>
          <div className="h-72 w-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Gráfico de tendencias de progreso</p>
          </div>
        </div>
        
        <div className="apple-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <PieChart size={20} className="text-apple-purple" />
              </div>
              <div>
                <h2 className="text-lg font-medium">Distribución de recursos</h2>
                <p className="text-xs text-gray-500">Por fase y tipo</p>
              </div>
            </div>
          </div>
          <div className="h-72 w-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Gráfico de distribución de recursos</p>
          </div>
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <BarChart3 size={20} className="text-apple-green" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Rendimiento de agentes IA</h2>
              <p className="text-xs text-gray-500">Comparación entre fases</p>
            </div>
          </div>
        </div>
        <div className="h-80 w-full bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Gráfico de rendimiento de agentes IA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="apple-card p-6">
          <h2 className="text-base font-medium mb-4">Predicción de finalización</h2>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-semibold text-apple-blue mb-2">22 Mayo</div>
            <p className="text-sm text-gray-500">Fecha estimada</p>
            <div className="mt-4 text-xs text-gray-600">
              <span className="font-medium">95% de confianza</span> basado en datos históricos
            </div>
          </div>
        </div>
        
        <div className="apple-card p-6">
          <h2 className="text-base font-medium mb-4">Cuellos de botella</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Revisión de código</span>
              <span className="text-sm font-medium text-red-500">Alto</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Pruebas de integración</span>
              <span className="text-sm font-medium text-yellow-500">Medio</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Documentación</span>
              <span className="text-sm font-medium text-apple-blue">Bajo</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div className="h-full bg-apple-blue rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="apple-card p-6">
          <h2 className="text-base font-medium mb-4">Recomendaciones IA</h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">Incrementar recursos para revisión de código podría reducir el tiempo de entrega en 3 días.</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm">Automatizar más pruebas de integración mejoraría la calidad en un 18%.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm">Considerar paralelizar tareas de documentación con desarrollo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
