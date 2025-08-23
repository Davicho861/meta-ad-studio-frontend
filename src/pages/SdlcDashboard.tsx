import { Activity, AlertCircle, CheckCircle, Code, Clock, Brain, Users, Lightbulb, ExternalLink, ArrowUpRight, Download, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import ProgressRing from "../components/dashboard/ProgressRing";
import PhaseProgress from "../components/dashboard/PhaseProgress";
import AIAgentCard from "../components/dashboard/AIAgentCard";
import StatCard from "../components/dashboard/StatCard";
import AIPredictiveInsights from "../components/dashboard/AIPredictiveInsights";
import { useToast } from "@/hooks/use-toast";
import { getSdlcData } from "../lib/sdlc-data";

type SdlcData = ReturnType<typeof getSdlcData>;

const SdlcDashboard = () => {
  const { toast } = useToast();
  const [sdlcData, setSdlcData] = useState<SdlcData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const data = getSdlcData();
      setSdlcData(data);
      toast({
        title: "Dashboard actualizado",
        description: "Todos los datos están sincronizados.",
        duration: 3000,
      });
    };

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, [toast]);

  const handleExportReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Reporte exportado",
        description: "Se ha generado el reporte completo en formato PDF.",
        duration: 3000,
      });
    }, 1800);
  };

  if (!sdlcData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-meta-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium mb-1">{sdlcData.projectName}</h1>
          <p className="text-gray-500">Gestión del ciclo de vida de desarrollo de software para Meta Ad Studio</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Actualizado: {sdlcData.lastUpdated}</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tareas Completadas"
          value={sdlcData.completedTasks}
          icon={<CheckCircle size={18} />}
          trend={{ value: parseInt(sdlcData.completedTasksChange), isPositive: true }}
          iconBg="bg-green-100"
          iconColor="text-apple-green"
        />
        <StatCard
          title="Tiempo Estimado"
          value={sdlcData.estimatedTime}
          icon={<Clock size={18} />}
          iconBg="bg-blue-100"
          iconColor="text-apple-blue"
        />
        <StatCard
          title="Uso de Agentes IA"
          value={sdlcData.aiAgentUsage}
          icon={<Brain size={18} />}
          trend={{ value: parseInt(sdlcData.aiAgentUsageChange), isPositive: true }}
          iconBg="bg-purple-100"
          iconColor="text-apple-purple"
        />
        <StatCard
          title="Equipo"
          value={sdlcData.teamMembers}
          icon={<Users size={18} />}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="apple-card p-6 col-span-1 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-medium mb-4">Progreso General</h2>
          <div className="flex items-center justify-center">
            <ProgressRing progress={sdlcData.generalProgress} color="#1877F2" />
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">Tiempo restante estimado</p>
            <p className="text-lg font-medium text-meta-blue">{sdlcData.remainingTime}</p>
          </div>
        </div>

        <div className="apple-card p-6 col-span-1 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-lg font-medium mb-4">Progreso por Fase</h2>
          <PhaseProgress phases={sdlcData.progressByPhase.map(p => ({...p, status: 'in-progress' as const}))} onPhaseClick={() => {}} />
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Alertas & Notificaciones</h3>
              <span className="text-xs bg-red-100 text-apple-red px-2 py-1 rounded-full">
                {sdlcData.alerts.length} nuevas
              </span>
            </div>
            <div className="space-y-3">
              {sdlcData.alerts.map(alert => (
                <div key={alert.id} className="flex items-start p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 cursor-pointer">
                  <AlertCircle size={18} className="text-apple-red mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-gray-600">{alert.description}</p>
                    <p className="text-xs text-apple-red mt-1">Impacto: {alert.impact}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-gray-400 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Agentes de IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sdlcData.aiAgents.map((agent) => (
            <AIAgentCard key={agent.name} name={agent.name} type={agent.status} status={agent.status.toLowerCase() as "active" | "idle" | "paused"} currentTask={agent.task} progress={agent.progress} />
          ))}
        </div>
      </div>
      
      <div className="apple-card p-6 mt-6">
        <AIPredictiveInsights insights={sdlcData.predictiveInsights} />
      </div>

      <div className="apple-card p-6 mt-6">
        <h2 className="text-lg font-medium mb-4">Métricas e Impacto de IA</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-50">
                <p className="text-sm font-medium text-blue-700">Fecha estimada de finalización:</p>
                <p className="text-xl font-bold text-blue-800 mt-2">{sdlcData.aiImpactMetrics.estimatedDate}</p>
                <p className="text-xs text-blue-600 mt-1">Confianza: {sdlcData.aiImpactMetrics.confidence}%</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50">
                <p className="text-sm font-medium text-purple-700">Recomendación de optimización:</p>
                <p className="text-md text-purple-800 mt-2">{sdlcData.aiImpactMetrics.recommendation}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50">
                <p className="text-sm font-medium text-green-700">Análisis de calidad:</p>
                <p className="text-md text-green-800 mt-2">{sdlcData.aiImpactMetrics.analysis}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SdlcDashboard;
