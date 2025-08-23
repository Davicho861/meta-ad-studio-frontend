
import { BarChart3, GitPullRequest, Search, Lightbulb, Filter, PlusCircle, ArrowUpRight, Download, Calendar, TrendingUp, AlertTriangle, Layers, CheckCircle2, Clock } from "lucide-react";
import AIAgentCard from "../components/dashboard/AIAgentCard";
import StatCard from "../components/dashboard/StatCard";
import AIPredictiveInsights from "../components/dashboard/AIPredictiveInsights";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { useToast } from "@/hooks/use-toast";

const researchAgents = [
  {
    name: "Research",
    type: "Análisis de mercado",
    status: "active" as const,
    currentTask: "Análisis de mercado para el segmento empresarial",
    progress: 65,
  },
  {
    name: "Innovación",
    type: "Generación de ideas",
    status: "active" as const,
    currentTask: "Evaluando tendencias emergentes",
    progress: 38,
  },
  {
    name: "Arquitectura",
    type: "Diseño técnico",
    status: "paused" as const,
    currentTask: "Evaluación de componentes",
    progress: 12,
  },
  {
    name: "GestiónTareas",
    type: "Organización",
    status: "idle" as const,
    currentTask: "Esperando nuevas tareas",
    progress: 0,
  },
];

const requirementsData = [
  { id: "REQ-001", title: "Autenticación de usuarios", priority: "Alta", status: "Completado", assignedTo: "Ana López" },
  { id: "REQ-002", title: "Gestión de perfiles", priority: "Media", status: "En progreso", assignedTo: "Carlos Mendez" },
  { id: "REQ-003", title: "Dashboard principal", priority: "Alta", status: "En progreso", assignedTo: "Maria García" },
  { id: "REQ-004", title: "Reportes analíticos", priority: "Media", status: "Por hacer", assignedTo: "Sin asignar" },
  { id: "REQ-005", title: "API de integración", priority: "Alta", status: "En revisión", assignedTo: "David Torres" },
];

// Datos para los gráficos
const marketSegmentData = [
  { name: "Empresas pequeñas", value: 35 },
  { name: "Empresas medianas", value: 45 },
  { name: "Empresas grandes", value: 20 },
];

const trendData = [
  { month: "Ene", onPremise: 35, cloud: 20, hybrid: 10 },
  { month: "Feb", onPremise: 32, cloud: 25, hybrid: 13 },
  { month: "Mar", onPremise: 30, cloud: 30, hybrid: 15 },
  { month: "Abr", onPremise: 27, cloud: 36, hybrid: 18 },
  { month: "May", onPremise: 25, cloud: 40, hybrid: 20 },
  { month: "Jun", onPremise: 22, cloud: 45, hybrid: 23 },
];

const requirementsByPriorityData = [
  { name: "Alta", value: 12 },
  { name: "Media", value: 15 },
  { name: "Baja", value: 5 },
];

const COLORS = ["#8B5CF6", "#0EA5E9", "#F97316", "#10B981", "#EC4899"];

const Planning = () => {
  const { toast } = useToast();
  const [activeInsight, setActiveInsight] = useState<number | null>(null);
  
  const handleInsightClick = (index: number) => {
    setActiveInsight(activeInsight === index ? null : index);
  };
  
  const handleDownloadReport = () => {
    toast({
      title: "Generando reporte",
      description: "El reporte de análisis de mercado se está generando",
      duration: 3000,
    });
  };
  
  const handleAddRequirement = () => {
    toast({
      title: "Nuevo requisito",
      description: "Formulario para añadir un nuevo requisito abierto",
      duration: 3000,
    });
  };

  const handleNewAnalysis = () => {
    toast({
      title: "Nuevo análisis",
      description: "Inicializando herramientas de análisis de mercado",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium mb-1">Planeación</h1>
          <p className="text-gray-500">Análisis de mercado y definición de requisitos</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="apple-button-secondary flex items-center text-sm"
            onClick={handleDownloadReport}
          >
            <Download size={16} className="mr-2" />
            <span>Exportar informe</span>
          </button>
          <button className="apple-button flex items-center text-sm">
            <Calendar size={16} className="mr-2" />
            <span>Actualizar cronograma</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Análisis Completados"
          value={8}
          icon={<BarChart3 size={18} />}
          trend={{ value: 2, isPositive: true }}
          iconBg="bg-blue-100"
          iconColor="text-apple-blue"
        />
        <StatCard
          title="Requisitos Definidos"
          value={32}
          icon={<GitPullRequest size={18} />}
          trend={{ value: 15, isPositive: true }}
          iconBg="bg-green-100"
          iconColor="text-apple-green"
        />
        <StatCard
          title="Insights Generados"
          value={14}
          icon={<Lightbulb size={18} />}
          trend={{ value: 3, isPositive: true }}
          iconBg="bg-purple-100"
          iconColor="text-apple-purple"
        />
        <StatCard
          title="Oportunidades"
          value={5}
          icon={<Search size={18} />}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="apple-card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Análisis de Mercado</h2>
            <div className="flex space-x-2">
              <button className="apple-icon-button">
                <Filter size={18} className="text-gray-600" />
              </button>
              <button 
                className="apple-button-secondary flex items-center text-sm"
                onClick={handleNewAnalysis}
              >
                <PlusCircle size={16} className="mr-2" />
                <span>Nuevo análisis</span>
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-base font-medium mb-3 flex items-center">
              <span>Segmentación de clientes</span>
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Actualizado hoy</span>
            </h3>
            <div className="h-64 w-full rounded-lg">
              <ChartContainer className="h-64" config={{
                segment1: { theme: { light: "#8B5CF6", dark: "#A78BFA" } },
                segment2: { theme: { light: "#0EA5E9", dark: "#38BDF8" } },
                segment3: { theme: { light: "#F97316", dark: "#FB923C" } },
              }}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={marketSegmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {marketSegmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3 flex items-center">
              <span>Tendencias de mercado</span>
              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                <TrendingUp size={12} className="inline mr-1" />
                +12% crecimiento cloud
              </span>
            </h3>
            <div className="h-64 w-full rounded-lg">
              <ChartContainer className="h-64" config={{
                onPremise: { theme: { light: "#64748b", dark: "#94a3b8" } },
                cloud: { theme: { light: "#0ea5e9", dark: "#38bdf8" } },
                hybrid: { theme: { light: "#8b5cf6", dark: "#a78bfa" } },
              }}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="onPremise" name="On-Premise" stackId="a" fill="#64748b" />
                  <Bar dataKey="cloud" name="Cloud" stackId="a" fill="#0ea5e9" />
                  <Bar dataKey="hybrid" name="Híbrido" stackId="a" fill="#8b5cf6" />
                  <Legend />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-medium">KPIs de Mercado</h3>
              <span className="text-xs text-gray-500">Último trimestre</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">42%</div>
                    <p className="text-sm text-gray-600 text-center">Retorno de inversión estimado</p>
                    <div className="text-xs text-green-600 mt-1">
                      <ArrowUpRight size={14} className="inline" /> +8% vs Q1
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">63%</div>
                    <p className="text-sm text-gray-600 text-center">Adopción del mercado</p>
                    <div className="text-xs text-green-600 mt-1">
                      <ArrowUpRight size={14} className="inline" /> +15% vs Q1
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">3.2M</div>
                    <p className="text-sm text-gray-600 text-center">Potencial de mercado</p>
                    <div className="text-xs text-green-600 mt-1">
                      <ArrowUpRight size={14} className="inline" /> +12% vs Q1
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="apple-card p-6">
            <h2 className="text-lg font-medium mb-4">Últimos insights</h2>
            
            <div className="space-y-4">
              <div 
                className={`p-3 bg-blue-50 rounded-lg transition-all duration-300 cursor-pointer ${activeInsight === 0 ? 'ring-2 ring-blue-300' : ''}`}
                onClick={() => handleInsightClick(0)}
              >
                <div className="flex items-start">
                  <Lightbulb size={18} className="text-apple-blue mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Oportunidad en segmento empresarial</p>
                    <p className="text-xs text-gray-600 mt-1">El análisis muestra una creciente demanda de soluciones en la nube para empresas medianas.</p>
                    
                    {activeInsight === 0 && (
                      <div className="mt-3 pt-2 border-t border-blue-200 animate-fade-in">
                        <p className="text-xs text-gray-600">Recomendación: Priorizar el desarrollo de características para facilitar la migración a la nube en empresas medianas.</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Confianza: 92%</span>
                          <button className="text-xs text-blue-600 hover:underline">Implementar</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-3 bg-purple-50 rounded-lg transition-all duration-300 cursor-pointer ${activeInsight === 1 ? 'ring-2 ring-purple-300' : ''}`}
                onClick={() => handleInsightClick(1)}
              >
                <div className="flex items-start">
                  <Lightbulb size={18} className="text-apple-purple mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Tendencia emergente: IA colaborativa</p>
                    <p className="text-xs text-gray-600 mt-1">Las herramientas que faciliten la colaboración entre humanos y agentes de IA muestran un crecimiento del 45%.</p>
                    
                    {activeInsight === 1 && (
                      <div className="mt-3 pt-2 border-t border-purple-200 animate-fade-in">
                        <p className="text-xs text-gray-600">Recomendación: Incorporar agentes de IA en el flujo de trabajo del producto para aumentar la productividad del usuario.</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Confianza: 87%</span>
                          <button className="text-xs text-purple-600 hover:underline">Implementar</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-3 bg-green-50 rounded-lg transition-all duration-300 cursor-pointer ${activeInsight === 2 ? 'ring-2 ring-green-300' : ''}`}
                onClick={() => handleInsightClick(2)}
              >
                <div className="flex items-start">
                  <Lightbulb size={18} className="text-apple-green mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Enfoque en experiencia de usuario</p>
                    <p className="text-xs text-gray-600 mt-1">Los competidores están priorizando la experiencia de usuario como diferenciador clave.</p>
                    
                    {activeInsight === 2 && (
                      <div className="mt-3 pt-2 border-t border-green-200 animate-fade-in">
                        <p className="text-xs text-gray-600">Recomendación: Realizar pruebas de usabilidad con usuarios reales y recopilar feedback para mejorar la UX del producto.</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Confianza: 95%</span>
                          <button className="text-xs text-green-600 hover:underline">Implementar</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <AIPredictiveInsights />
        </div>
      </div>

      <div className="apple-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-lg font-medium">Definición de Requisitos</h2>
            <div className="ml-3 flex items-center">
              <div className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                <Layers size={12} className="mr-1" />
                <span>32 requisitos totales</span>
              </div>
              <div className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                <CheckCircle2 size={12} className="mr-1" />
                <span>15 completados</span>
              </div>
              <div className="ml-2 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                <Clock size={12} className="mr-1" />
                <span>10 en progreso</span>
              </div>
            </div>
          </div>
          <button 
            className="apple-button flex items-center text-sm"
            onClick={handleAddRequirement}
          >
            <PlusCircle size={16} className="mr-2" />
            <span>Nuevo requisito</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Asignado a</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirementsData.map((req) => (
                    <TableRow key={req.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{req.id}</TableCell>
                      <TableCell>{req.title}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          req.priority === "Alta" ? "bg-red-100 text-red-800" : 
                          req.priority === "Media" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-green-100 text-green-800"
                        }`}>
                          {req.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          req.status === "Completado" ? "bg-green-100 text-green-800" : 
                          req.status === "En progreso" ? "bg-blue-100 text-blue-800" :
                          req.status === "En revisión" ? "bg-purple-100 text-purple-800" : 
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {req.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {req.assignedTo}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <button className="text-gray-500 hover:text-gray-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div>
            <h3 className="text-base font-medium mb-3">Requisitos por prioridad</h3>
            <ChartContainer className="h-64" config={{
              Alta: { theme: { light: "#ef4444", dark: "#f87171" } },
              Media: { theme: { light: "#f59e0b", dark: "#fbbf24" } },
              Baja: { theme: { light: "#22c55e", dark: "#4ade80" } },
            }}>
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={requirementsByPriorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {requirementsByPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === "Alta" ? "#ef4444" : entry.name === "Media" ? "#f59e0b" : "#22c55e"} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
            <div className="mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle size={16} className="text-amber-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">Advertencia de planificación</p>
                    <p className="text-xs text-gray-600 mt-0.5">El 37% de los requisitos de alta prioridad no tienen asignado un responsable.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Agentes de IA - Planeación</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {researchAgents.map((agent) => (
            <AIAgentCard key={agent.name} {...agent} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planning;
