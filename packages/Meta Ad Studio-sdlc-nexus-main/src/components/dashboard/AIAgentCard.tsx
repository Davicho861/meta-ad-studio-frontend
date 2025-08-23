
import { Activity, Brain, RefreshCcw, Pause, Play, Info } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AIAgentProps {
  name: string;
  status: "active" | "paused" | "idle";
  currentTask?: string;
  progress?: number;
  type: string;
}

const AIAgentCard = ({
  name,
  status,
  currentTask,
  progress = 0,
  type,
}: AIAgentProps) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "idle":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Activo";
      case "paused":
        return "Pausado";
      case "idle":
        return "Inactivo";
      default:
        return "Desconocido";
    }
  };

  const handleStatusToggle = () => {
    const newStatus = status === "active" ? "paused" : "active";
    toast({
      title: `Agente IA - ${name}`,
      description: `Estado cambiado a: ${newStatus === "active" ? "Activo" : "Pausado"}`,
      duration: 3000,
    });
  };

  const handleRefresh = () => {
    toast({
      title: `Agente IA - ${name}`,
      description: "Actualizando estado y tareas del agente...",
      duration: 3000,
    });
  };

  const handleShowDetails = () => {
    toast({
      title: `Detalles del agente: ${name}`,
      description: `Tipo: ${type} | Estado: ${getStatusText()} | Progreso: ${progress}%`,
      duration: 5000,
    });
  };

  return (
    <div 
      className="apple-card p-4 transition-all duration-300 hover:shadow-md border-l-4 border-transparent hover:border-l-apple-blue"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="mr-3 bg-apple-blue bg-opacity-10 p-2 rounded-lg">
            <Brain size={20} className="text-apple-blue" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-xs text-gray-500">{type}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span
            className={`w-2 h-2 ${getStatusColor()} rounded-full mr-1 ${isHovered ? "animate-pulse" : ""}`}
          ></span>
          <span className="text-xs text-gray-500">{getStatusText()}</span>
        </div>
      </div>

      {currentTask && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Tarea actual:</p>
          <p className="text-sm font-medium">{currentTask}</p>
        </div>
      )}

      {progress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xs text-gray-500">Progreso</p>
            <p className="text-xs font-medium">{progress}%</p>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-apple-blue rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button 
          className="apple-icon-button transition-transform hover:scale-110"
          onClick={handleShowDetails}
        >
          <Info size={16} className="text-gray-600" />
        </button>
        <button 
          className="apple-icon-button transition-transform hover:scale-110"
          onClick={handleRefresh}
        >
          <RefreshCcw size={16} className="text-gray-600" />
        </button>
        <button 
          className="apple-icon-button transition-transform hover:scale-110"
          onClick={handleStatusToggle}
        >
          {status === "active" ? (
            <Pause size={16} className="text-gray-600" />
          ) : (
            <Play size={16} className="text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AIAgentCard;
