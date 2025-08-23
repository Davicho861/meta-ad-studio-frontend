
import { useState } from "react";
import {
  LayoutDashboard,
  Lightbulb,
  Code,
  CheckCircle,
  Rocket,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { name: "Visión General", icon: LayoutDashboard, path: "/" },
  { name: "Planeación", icon: Lightbulb, path: "/planning" },
  { name: "Desarrollo", icon: Code, path: "/development" },
  { name: "Implementación", icon: CheckCircle, path: "/implementation" },
  { name: "Despliegue", icon: Rocket, path: "/deployment" },
  { name: "Insights", icon: LineChart, path: "/insights" },
  { name: "Configuración", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={`h-screen bg-apple-gray transition-all duration-300 border-r border-gray-200 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-center p-6">
        {!collapsed && (
          <div className="text-xl font-bold bg-gradient-to-r from-apple-blue to-apple-purple bg-clip-text text-transparent">
            SDLC Nexus
          </div>
        )}
        {collapsed && (
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-apple-blue to-apple-purple flex items-center justify-center text-white">
            <span className="text-sm font-bold">SN</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 px-4 py-6">
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.name}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          className="apple-icon-button w-full flex justify-center"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={20} className="text-gray-600" />
          ) : (
            <ChevronLeft size={20} className="text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
