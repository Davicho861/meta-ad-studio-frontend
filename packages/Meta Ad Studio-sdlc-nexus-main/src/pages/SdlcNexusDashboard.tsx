import React from 'react';
import { Sun, Moon, Download, RefreshCw, BarChart2, PieChart, TrendingUp, AlertTriangle, CheckCircle, XCircle, Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { useTheme } from '../components/layout/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

// Enhanced mock data based on new requirements
const dashboardData = {
  owner: "Davicho",
  lastUpdated: "22 de agosto de 2025, 20:45",
  overview: "Refrescado en tiempo real. Updates AI 2025: 5 reorgs en 7 meses (e.g., Superintelligence Labs dividido en 4 grupos per Reuters/NYT), hiring freeze (WSJ), partnership Midjourney para AI licensing (Reuters), +32% revenue por targeting predictivo. New Ads features: Partnership Ads 2.0, Reels Trending, Threads Video Ads. Ajustado por +20% delays en timelines por costs scrutiny.",
  keyStats: [
    { metric: "Tareas Completadas", value: "62", change: "+20%", description: "Incluye 10 tasks auto-generadas vía Meta AI tools; +5 por new Midjourney integration." },
    { metric: "Tiempo Estimado Restante", value: "2.8 semanas", change: "-0.6 semanas", description: "Optimizado por AI agents; reducción extra por Ad Set Budget Sharing en tests." },
    { metric: "Uso de Agentes IA", value: "97%", change: "+9%", description: "+50% ROAS en pilots con Partnership Ads 2.0; +12% conversions vía SMS Verification en Lead Ads." },
    { metric: "Tamaño del Equipo", value: "15", change: "+3 miembros", description: "Adición de AI specialists para manejar hiring freeze y reorgs." },
    { metric: "Progreso General", value: "72%", change: "+8%", description: "Ajustado por delays en AI; tiempo restante: 2 semanas, integrando Reels Trending Ads." },
  ],
  progressByPhase: {
    labels: ['Planeación', 'Desarrollo', 'Implementación', 'Despliegue'],
    data: [100, 88, 35, 15],
    descriptions: [
      "100% Completado (Análisis de features: Dynamic Content, AI Optimization, Shop Ads con GenAI y Midjourney tech).",
      "88% En Progreso (Integración AI Sandbox multimodal, incluyendo Video Ads en Threads).",
      "35% En Progreso (Testing Value Rules, Audience Labels; benchmarks +40% CLV con new Signals).",
      "15% Pendiente (Pipeline CI/CD para Q1 2026, con chaos engineering para reorg risks)."
    ]
  },
  alerts: [
    { type: 'blocker', text: "Bloqueante Alto: REQ-156 (AI Video en Reels/Threads). Impacto: +20% delay por 5th reorg (TBD Lab focus).", icon: XCircle, color: 'text-red-400' },
    { type: 'failed', text: "Fallida Medio: Build #365 (Andromeda v2). Corregible con AI overviews.", icon: AlertTriangle, color: 'text-yellow-400' },
    { type: 'new', text: "Alerta Nueva: Sobrecarga IA (95% uso). Reasignar para mitigar hiring freeze.", icon: Info, color: 'text-blue-400' },
    { type: 'update', text: "Update Meta: Delay en WhatsApp Ads por reorganización #5 (per Fortune). Impacto: Bajo.", icon: Info, color: 'text-blue-400' },
    { type: 'positive', text: "Positiva: +15% eficiencia código (benchmark vs. 60 proyectos, incl. Ads Manager updates agosto 2025).", icon: CheckCircle, color: 'text-green-400' },
    { type: 'new_risk', text: "Nueva: Hiring Freeze impacta rollouts (WSJ); monitorear Superintelligence Labs.", icon: AlertTriangle, color: 'text-yellow-400' },
  ],
  aiAgents: [
    { name: "Optimizar Recursos", phase: "Planeación", status: "Activo", task: "Mercado AI ad automation enterprise.", progress: "80%", impact: "+8% conversions con Meta AI + Midjourney.", impactColor: 'text-green-400' },
    { name: "Desarrollo Front", phase: "Desarrollo", status: "Activo", task: "UI para Value Rules, Reels Trending, Threads Ads.", progress: "55%", impact: "-3 días timeline con Ad Set Sharing.", impactColor: 'text-green-400' },
    { name: "Pruebas QA", phase: "Implementación", status: "Activo", task: "Testing Labels, Sandbox, GenAI copy + SMS Verification.", progress: "25%", impact: "+45% targeting precisión.", impactColor: 'text-green-400' },
    { name: "DevOps", phase: "Despliegue", status: "Activo", task: "CI/CD para AI ads 2026, chaos engineering reorgs.", progress: "35%", impact: "Mitiga +20% risks por 5 reorgs.", impactColor: 'text-yellow-400' },
    { name: "AI Risk Analyzer", phase: "Todo", status: "Activo", task: "Monitoreo chaos (5 reorgs + hiring freeze).", progress: "45%", impact: "Predice +18% delay risks.", impactColor: 'text-yellow-400' },
    { name: "Nuevo: Partnership Integrator", phase: "Implementación", status: "Activo", task: "Integración Midjourney licensing.", progress: "10%", impact: "+30% revenue lift predictivo.", impactColor: 'text-green-400' },
  ],
  predictiveInsights: [
    { title: "Finalización Estimada", content: "10 de septiembre de 2025. Confianza: 90% (Ajustado por +32% revenue vía AI, delays por reorgs/hiring freeze)." },
    { title: "Optimización", content: "Reasignar 5 agentes a Despliegue; reduce 5 días. Incorpora Reels Trending y Partnership 2.0." },
    { title: "Calidad", content: "18% menos errores (vs. 65 proyectos, incl. julio-agosto updates). Tests: 90%." },
  ],
  iaImpactMetrics: [
    { metric: "ROAS Mejorado", value: "+50%", benchmark: "+35% Meta", notes: "Via Value Rules, Labels, new Signals." },
    { metric: "CLV Predictivo", value: "+40%", benchmark: "+30%", notes: "Multimodal AI + Midjourney tech." },
    { metric: "CAC Blended", value: "-25%", benchmark: "-18%", notes: "Optimizado por chaos mitigation, Ad Set Sharing." },
    { metric: "Conversion Rate", value: "+15%", benchmark: "+10%", notes: "GenAI copy, Video Editing, SMS Verification." },
  ],
  riskAnalysis: {
    description: "Delay por chaos: 28% (5 reorgs + freeze). Mitigación: +15% buffer.",
    data: {
      labels: ['Meta Chaos', 'Técnicos', 'Dependencias', 'Otros'],
      datasets: [{ data: [28, 15, 12, 45], backgroundColor: ['#ef4444', '#f97316', '#eab308', '#3b82f6'] }]
    }
  },
  teamPerformance: {
    productivity: "94% (vs. 88% benchmark)",
    aiAssistedHours: "70%",
    suggestion: "Training Andromeda v2 y Midjourney tools."
  },
  partnershipImpact: {
    description: "+25% efficiency por Midjourney licensing; monitor investor scrutiny (WSJ)."
  },
  trendData: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4', '2026 (Proy.)'],
    datasets: [{ label: 'Progreso SDLC', data: [20, 48, 72, 85, 100], fill: true, backgroundColor: 'rgba(24, 119, 242, 0.2)', borderColor: '#1877F2', tension: 0.4 }]
  },
  reorgTimeline: {
    labels: ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
    datasets: [{ label: 'Reorgs', data: [1, 1, 2, 3, 4, 4, 5], fill: false, borderColor: '#ef4444', tension: 0.4, pointRadius: 5 }]
  }
};

const SdlcNexusDashboard = () => {
  const { isDarkMode } = useTheme();

  const handleExport = (format: 'pdf' | 'csv') => {
    if (format === 'pdf') {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      doc.setFontSize(18);
      doc.text("Meta Ad Studio SDLC Nexus Dashboard", 14, 22);
      doc.setFontSize(11);
      doc.text(`Propietario: ${dashboardData.owner} | Actualizado: ${dashboardData.lastUpdated}`, 14, 30);
      
      let y = 40;
      doc.setFontSize(12);
      doc.text("Estadísticas Clave", 14, y);
      y += 7;
      doc.setFontSize(10);
      dashboardData.keyStats.forEach(stat => {
        doc.text(`- ${stat.metric}: ${stat.value} (${stat.change})`, 20, y);
        y += 6;
      });
      doc.save('sdlc-nexus-report.pdf');
    } else if (format === 'csv') {
      const csvContent = Papa.unparse(dashboardData.keyStats);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "sdlc-nexus-report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-card border border-border rounded-lg p-4 shadow-md backdrop-blur-sm transition-all duration-300 ${className}`}>
      {children}
    </div>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-lg font-bold text-foreground mb-3">{children}</h2>
  );

  return (
    <div className="bg-background text-foreground min-h-screen p-4 font-sans transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard: Visión General</h1>
            <p className="text-muted-foreground">Propietario: {dashboardData.owner}</p>
          </div>
        </header>

        <Card className="mb-4">
          <h2 className="font-semibold text-foreground">Visión General del SDLC</h2>
          <p className="text-muted-foreground text-xs mb-2">Actualizado: {dashboardData.lastUpdated}</p>
          <p className="text-xs max-w-4xl">{dashboardData.overview}</p>
        </Card>
        
        <div className="flex items-center space-x-2 mb-4">
            <button onClick={() => handleExport('pdf')} className="flex items-center space-x-2 px-3 py-1.5 text-xs rounded-md bg-card hover:bg-accent"><Download size={14} /><span>PDF</span></button>
            <button onClick={() => handleExport('csv')} className="flex items-center space-x-2 px-3 py-1.5 text-xs rounded-md bg-card hover:bg-accent"><Download size={14} /><span>CSV</span></button>
            <button className="flex items-center space-x-2 px-3 py-1.5 text-xs rounded-md bg-card hover:bg-accent"><RefreshCw size={14} /><span>Refrescar</span></button>
        </div>

        <main className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <Card>
              <SectionTitle>Estadísticas Clave</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {dashboardData.keyStats.map(s => <div key={s.metric}><strong className="text-foreground">{s.metric}:</strong> {s.value} <span className={s.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>({s.change})</span></div>)}
              </div>
            </Card>
            <Card>
              <SectionTitle>Progreso por Fase</SectionTitle>
              <div className="h-48"><Bar data={{labels: dashboardData.progressByPhase.labels, datasets:[{label: 'Progreso', data: dashboardData.progressByPhase.data, backgroundColor: '#1877F2'}]}} options={{ maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { y: { ticks: { color: isDarkMode ? '#d1d5db' : '#374151' } }, x: { ticks: { color: isDarkMode ? '#d1d5db' : '#374151' } } } }} /></div>
            </Card>
            <Card>
              <SectionTitle>Agentes de IA Activos</SectionTitle>
              <div className="overflow-x-auto text-xs">
                <table className="w-full">
                  <thead><tr className="text-left border-b">{['Agente', 'Fase', 'Tarea', 'Progreso', 'Impacto'].map(h => <th key={h} className="py-1.5 pr-2 font-semibold">{h}</th>)}</tr></thead>
                  <tbody>{dashboardData.aiAgents.map(a => <tr key={a.name} className="border-b border-border/50 hover:bg-accent"><td className="py-1.5 pr-2 font-bold">{a.name}</td><td className="py-1.5 pr-2">{a.phase}</td><td className="py-1.5 pr-2">{a.task}</td><td className="py-1.5 pr-2">{a.progress}</td><td className={`py-1.5 pr-2 ${a.impactColor}`}>{a.impact}</td></tr>)}</tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Card>
              <SectionTitle>Alertas & Notificaciones</SectionTitle>
              <ul className="space-y-2 text-xs">{dashboardData.alerts.map((a, i) => <li key={i} className="flex items-start"><a.icon size={16} className={`${a.color} mr-2 mt-0.5 flex-shrink-0`}/><span>{a.text}</span></li>)}</ul>
            </Card>
            <Card>
              <SectionTitle>Insights Predictivos IA</SectionTitle>
              <ul className="space-y-2 text-xs">{dashboardData.predictiveInsights.map(p => <li key={p.title}><strong className="text-foreground">{p.title}:</strong> {p.content}</li>)}</ul>
            </Card>
            <Card>
              <SectionTitle>Rendimiento del Equipo</SectionTitle>
              <ul className="text-xs space-y-1">
                <li><strong className="text-foreground">Productividad:</strong> {dashboardData.teamPerformance.productivity}</li>
                <li><strong className="text-foreground">Horas AI-asistidas:</strong> {dashboardData.teamPerformance.aiAssistedHours}</li>
                <li className="text-muted-foreground"><strong className="text-foreground">Sugerencia:</strong> {dashboardData.teamPerformance.suggestion}</li>
              </ul>
            </Card>
          </div>
          
          <div className="col-span-12">
            <Card>
              <SectionTitle>Visualizaciones Enriquecidas</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-bold text-center text-sm mb-2">Tendencias SDLC</h3>
                  <div className="h-48"><Line data={dashboardData.trendData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: isDarkMode ? '#d1d5db' : '#374151' } }, x: { ticks: { color: isDarkMode ? '#d1d5db' : '#374151' } } } }} /></div>
                </div>
                <div>
                  <h3 className="font-bold text-center text-sm mb-2">Análisis de Riesgos</h3>
                  <div className="h-48 mx-auto" style={{maxWidth: '180px'}}><Pie data={dashboardData.riskAnalysis.data} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: isDarkMode ? 'white' : 'black', boxWidth: 10, font: { size: 10 } } } } }} /></div>
                </div>
                <div>
                  <h3 className="font-bold text-center text-sm mb-2">Reorg Timeline (7 Meses)</h3>
                  <div className="h-48"><Line data={dashboardData.reorgTimeline} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: isDarkMode ? '#d1d5db' : '#374151', stepSize: 1 } }, x: { ticks: { color: isDarkMode ? '#d1d5db' : '#374151' } } } }} /></div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SdlcNexusDashboard;
