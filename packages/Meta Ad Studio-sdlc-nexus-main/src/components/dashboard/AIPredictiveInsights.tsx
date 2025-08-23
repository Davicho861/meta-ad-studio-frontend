
import { useState } from 'react';
import { Brain, LineChart, TrendingUp, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InsightProps {
  title: string;
  description: string;
  confidence: number;
  category: "optimization" | "prediction" | "risk" | "recommendation";
  impact: "high" | "medium" | "low";
}

const insights: InsightProps[] = [
  {
    title: "Optimización de recursos",
    description: "Reasignar 2 desarrolladores frontend al backend podría reducir el tiempo de desarrollo en 3.5 días según patrones históricos del equipo.",
    confidence: 89,
    category: "optimization",
    impact: "high"
  },
  {
    title: "Predicción de fechas",
    description: "Existe un 78% de probabilidad de completar la fase de implementación antes del 20 de Mayo basado en la velocidad actual del equipo.",
    confidence: 78,
    category: "prediction",
    impact: "medium"
  },
  {
    title: "Alerta de riesgo",
    description: "El módulo de autenticación tiene un 35% más de errores que otros módulos similares, sugiriendo una revisión prioritaria.",
    confidence: 92,
    category: "risk",
    impact: "high"
  },
  {
    title: "Mejora de calidad",
    description: "Aumentar la cobertura de pruebas en 15% podría reducir los errores en producción hasta en un 23% según análisis de proyectos similares.",
    confidence: 86,
    category: "recommendation",
    impact: "medium"
  }
];

const getCategoryIcon = (category: string) => {
  switch(category) {
    case "optimization": return <Zap className="w-5 h-5 text-blue-500" />;
    case "prediction": return <TrendingUp className="w-5 h-5 text-purple-500" />;
    case "risk": return <Brain className="w-5 h-5 text-red-500" />;
    case "recommendation": return <LineChart className="w-5 h-5 text-green-500" />;
    default: return <Brain className="w-5 h-5 text-gray-500" />;
  }
};

const getImpactColor = (impact: string) => {
  switch(impact) {
    case "high": return "bg-red-50 border-red-200 hover:bg-red-100";
    case "medium": return "bg-amber-50 border-amber-200 hover:bg-amber-100";
    case "low": return "bg-green-50 border-green-200 hover:bg-green-100";
    default: return "bg-gray-50 border-gray-200 hover:bg-gray-100";
  }
};

const AIPredictiveInsights = () => {
  const { toast } = useToast();
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const handleInsightClick = (title: string) => {
    setExpandedInsight(expandedInsight === title ? null : title);
    
    toast({
      title: "Analizando insight",
      description: `Generando detalles adicionales para: ${title}`,
      duration: 3000,
    });
  };

  const handleApplyInsight = (insight: InsightProps) => {
    toast({
      title: "Aplicando recomendación",
      description: `Implementando: ${insight.title}`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium flex items-center">
          <Brain size={20} className="mr-2 text-apple-purple" />
          Insights Predictivos IA
        </h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Actualizado cada 30 minutos
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {insights.map((insight) => (
          <div 
            key={insight.title}
            className={`p-4 border rounded-lg transition-all duration-300 cursor-pointer ${
              getImpactColor(insight.impact)
            } ${
              expandedInsight === insight.title ? "shadow-md" : ""
            }`}
            onClick={() => handleInsightClick(insight.title)}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                {getCategoryIcon(insight.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{insight.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-white border">
                    {insight.confidence}% confianza
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{insight.description}</p>
                
                {expandedInsight === insight.title && (
                  <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Basado en análisis de 27 proyectos similares
                      </span>
                      <button 
                        className="apple-button-secondary text-xs py-1 px-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyInsight(insight);
                        }}
                      >
                        Aplicar recomendación
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPredictiveInsights;
