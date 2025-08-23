import { Activity, AlertCircle, CheckCircle, Code, Clock, Brain, Users, Lightbulb, ExternalLink, ArrowUpRight, Download, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import ProgressRing from "../components/dashboard/ProgressRing";
import PhaseProgress from "../components/dashboard/PhaseProgress";
import AIAgentCard from "../components/dashboard/AIAgentCard";
import StatCard from "../components/dashboard/StatCard";
import AIPredictiveInsights from "../components/dashboard/AIPredictiveInsights";
import { useToast } from "@/hooks/use-toast";

const phases = [
  { name: "Planeación", progress: 100, status: "completed" as const },
  { name: "Desarrollo", progress: 75, status: "in-progress" as const },
  { name: "Implementación", progress: 10, status: "pending" as const },
  { name: "Despliegue", progress: 0, status: "pending" as const },
];

const aiAgents = [
  {
    name: "Research",
    type: "Planeación",
    status: "active" as const,
    currentTask: "Análisis de mercado para el segmento empresarial",
    progress: 65,
  },
  {
    name: "DesarrolloFront",
    type: "Desarrollo",
    status: "active" as const,
    currentTask: "Implementación de interfaz de usuario",
    progress: 40,
  },
  {
    name: "Pruebas",
    type: "Implementación",
    status: "idle" as const,
    currentTask: "Esperando código para pruebas",
    progress: 0,
  },
  {
    name: "DevOps",
    type: "Despliegue",
    status: "paused" as const,
    currentTask: "Configuración de pipeline CI/CD",
    progress: 20,
  },
];

const Overview = () => {
  const { toast } = useToast();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [highlightedPhase, setHighlightedPhase] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewedRecommendations, setViewedRecommendations] = useState<Set<string>>(new Set());

  // Simulate data fetch on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Dashboard actualizado",
        description: "Todos los datos están sincronizados con el último estado del proyecto",
        duration: 3000,
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [toast]);

  const handlePhaseClick = (phaseName: string) => {
    setHighlightedPhase(phaseName);
    toast({
      title: `Fase: ${phaseName}`,
      description: `Viendo detalles de la fase ${phaseName}`,
      duration: 3000,
    });
  };

  const handleOptimizeResources = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Optimización completada",
        description: "Se ha mejorado la distribución de recursos en un 18%",
        duration: 5000,
      });
    }, 2000);
  };

  const handleActivityClick = () => {
    toast({
      title: "Registro de actividad",
      description: "Cargando historial de actividades recientes...",
      duration: 3000,
    });
  };

  const handleExportReport = () => {
    setIsLoading(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Reporte exportado",
        description: "Se ha generado el reporte completo en formato PDF",
        duration: 3000,
      });
    }, 1800);
  };

  const handleViewRecommendation = (id: string) => {
    const newSet = new Set(viewedRecommendations);
    newSet.add(id);
    setViewedRecommendations(newSet);
  };

  const lastUpdated = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium mb-1">Visión General</h1>
          <p className="text-gray-500">Gestión del ciclo de vida de desarrollo de software</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Actualizado: {lastUpdated}</span>
          <button 
            className="apple-button-secondary flex items-center text-sm"
            onClick={handleExportReport}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
            ) : (
              <Download size={16} className="mr-2" />
            )}
            <span>Exportar reporte</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tareas Completadas"
          value={42}
          icon={<CheckCircle size={18} />}
          trend={{ value: 12, isPositive: true }}
          iconBg="bg-green-100"
          iconColor="text-apple-green"
        />
        <StatCard
          title="Tiempo Estimado"
          value="4 semanas"
          icon={<Clock size={18} />}
          iconBg="bg-blue-100"
          iconColor="text-apple-blue"
        />
        <StatCard
          title="Uso de Agentes IA"
          value="85%"
          icon={<Brain size={18} />}
          trend={{ value: 5, isPositive: true }}
          iconBg="bg-purple-100"
          iconColor="text-apple-purple"
        />
        <StatCard
          title="Equipo"
          value={12}
          icon={<Users size={18} />}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Progress and Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="apple-card p-6 col-span-1 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-medium mb-4 flex items-center justify-between">
            <span>Progreso General</span>
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Actualizado hoy
            </span>
          </h2>
          <div className="flex items-center justify-center">
            <ProgressRing progress={56} color="#8B5CF6" />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Tiempo restante estimado</p>
            <p className="text-lg font-medium text-apple-blue">2 semanas y 3 días</p>
          </div>
        </div>

        <div className="apple-card p-6 col-span-1 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Progreso por Fase</h2>
            <button 
              className="apple-icon-button"
              onClick={handleActivityClick}
            >
              <Activity size={18} className="text-gray-600" />
            </button>
          </div>
          <PhaseProgress phases={phases} onPhaseClick={handlePhaseClick} highlightedPhase={highlightedPhase} />
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Alertas & Notificaciones</h3>
              <span className="text-xs bg-red-100 text-apple-red px-2 py-1 rounded-full">
                3 nuevas
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 cursor-pointer"
                onClick={() => toast({
                  title: "Requisito bloqueante",
                  description: "Visualizando detalles del requisito REQ-145",
                  variant: "destructive",
                })}
              >
                <AlertCircle size={18} className="text-apple-red mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium">Requisito bloqueante</p>
                  <p className="text-xs text-gray-600">Pendiente de aprobación: REQ-145</p>
                  <p className="text-xs text-apple-red mt-1">Impacto: Alto - Afecta timeline del proyecto</p>
                </div>
                <ArrowUpRight size={16} className="text-gray-400 ml-auto" />
              </div>
              
              <div className="flex items-start p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200 cursor-pointer"
                onClick={() => toast({
                  title: "Prueba fallida",
                  description: "Visualizando detalles del build #342",
                  variant: "destructive", // Changed from "warning" to "destructive"
                })}
              >
                <AlertCircle size={18} className="text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium">Prueba fallida</p>
                  <p className="text-xs text-gray-600">Integración continua: Build #342</p>
                  <p className="text-xs text-yellow-600 mt-1">Impacto: Medio - Corregible en próxima iteración</p>
                </div>
                <ArrowUpRight size={16} className="text-gray-400 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Agents Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Agentes de IA</h2>
          <button 
            className="apple-button-secondary flex items-center"
            onClick={handleOptimizeResources}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
            ) : (
              <Lightbulb size={16} className="mr-2" />
            )}
            <span>Optimizar recursos</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiAgents.map((agent) => (
            <AIAgentCard key={agent.name} {...agent} />
          ))}
        </div>
      </div>

      {/* AI Predictive Insights Section */}
      <div className="apple-card p-6 mt-6">
        <AIPredictiveInsights />
      </div>

      {/* Predictions & Recommendations Section */}
      <div className="apple-card p-6 mt-6">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2 text-apple-blue" />
          Métricas e Impacto de IA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 cursor-pointer"
            onClick={() => toast({
              title: "IA Insight",
              description: "Analizando patrones de desarrollo para optimizar recursos...",
            })}
          >
            <p className="text-sm font-medium text-blue-700">Basado en el progreso actual, la fecha estimada de finalización es:</p>
            <p className="text-xl font-bold text-blue-800 mt-2">25 de Mayo</p>
            <p className="text-xs text-blue-600 mt-1">Confianza: 92%</p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-200 cursor-pointer"
            onClick={() => toast({
              title: "IA Insight",
              description: "Generando recomendaciones para optimizar fase de desarrollo...",
            })}
          >
            <p className="text-sm font-medium text-purple-700">Recomendación de optimización:</p>
            <p className="text-md text-purple-800 mt-2">Reasignar 2 agentes de IA de Planeación a Desarrollo podría reducir el tiempo de entrega en 4 días.</p>
          </div>
          <div className="p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-200 cursor-pointer"
            onClick={() => toast({
              title: "IA Insight",
              description: "Analizando métricas de calidad del código...",
            })}
          >
            <p className="text-sm font-medium text-green-700">Análisis de calidad:</p>
            <p className="text-md text-green-800 mt-2">El código actual presenta un 15% menos de errores que proyectos similares en esta fase.</p>
            <p className="text-xs text-green-600 mt-1">Basado en análisis de 34 proyectos similares</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
