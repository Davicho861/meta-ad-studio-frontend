
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

const AIPredictiveInsights = ({ insights = [] }: { insights: { confidence: number | null; text: string }[] }) => {
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
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 border rounded-lg transition-all duration-300 cursor-pointer bg-gray-50 border-gray-200 hover:bg-gray-100`}
            onClick={() => handleInsightClick(insight.text)}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <Brain className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{insight.text}</h3>
                  {insight.confidence && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white border">
                      {insight.confidence}% confianza
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPredictiveInsights;
