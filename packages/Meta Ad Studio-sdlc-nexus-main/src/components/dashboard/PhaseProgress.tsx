
interface Phase {
  name: string;
  progress: number;
  status: "completed" | "in-progress" | "pending" | "issues";
}

interface PhaseProgressProps {
  phases: Phase[];
  onPhaseClick?: (phaseName: string) => void;
  highlightedPhase?: string | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-apple-green";
    case "in-progress":
      return "bg-apple-blue";
    case "pending":
      return "bg-gray-300";
    case "issues":
      return "bg-apple-red";
    default:
      return "bg-gray-300";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
      return "Completado";
    case "in-progress":
      return "En Progreso";
    case "pending":
      return "Pendiente";
    case "issues":
      return "Con Problemas";
    default:
      return "";
  }
};

const PhaseProgress = ({ 
  phases, 
  onPhaseClick,
  highlightedPhase 
}: PhaseProgressProps) => {
  return (
    <div className="w-full">
      <div className="flex w-full h-2 mb-3">
        {phases.map((phase, index) => (
          <div
            key={phase.name}
            className={`${getStatusColor(phase.status)} h-full ${
              index === 0 ? "rounded-l-full" : ""
            } ${
              index === phases.length - 1 ? "rounded-r-full" : ""
            } flex-1 transition-all duration-300 ${
              highlightedPhase === phase.name ? "h-3 -translate-y-0.5" : ""
            }`}
          />
        ))}
      </div>
      <div className="flex w-full justify-between">
        {phases.map((phase) => (
          <div 
            key={phase.name} 
            className={`flex flex-col items-center cursor-pointer transition-transform duration-200 ${
              highlightedPhase === phase.name ? "scale-110" : "hover:scale-105"
            }`}
            onClick={() => onPhaseClick && onPhaseClick(phase.name)}
          >
            <span className={`text-xs font-medium mb-1 ${
              highlightedPhase === phase.name ? "text-apple-blue" : "text-gray-800"
            }`}>
              {phase.name}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                getStatusColor(phase.status).replace("bg-", "text-")
              }`}
            >
              {getStatusText(phase.status)}
            </span>
            {phase.progress > 0 && (
              <span className="text-xs text-gray-500 mt-1">
                {phase.progress}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseProgress;
