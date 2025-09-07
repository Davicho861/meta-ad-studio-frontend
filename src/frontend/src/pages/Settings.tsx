import React from "react";

import { useState } from "react";
import { Users, Bell, Shield, Palette, Moon, Monitor } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium mb-1">Configuración</h1>
        <p className="text-gray-500">Personaliza tu experiencia SDLC</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="apple-card p-4 md:col-span-1">
          <nav className="flex flex-col space-y-1">
            <button
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                activeTab === "general"
                  ? "bg-apple-blue bg-opacity-10 text-apple-blue"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("general")}
            >
              <Users size={18} />
              <span>General</span>
            </button>
            <button
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                activeTab === "notifications"
                  ? "bg-apple-blue bg-opacity-10 text-apple-blue"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell size={18} />
              <span>Notificaciones</span>
            </button>
            <button
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                activeTab === "security"
                  ? "bg-apple-blue bg-opacity-10 text-apple-blue"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("security")}
            >
              <Shield size={18} />
              <span>Seguridad</span>
            </button>
            <button
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                activeTab === "appearance"
                  ? "bg-apple-blue bg-opacity-10 text-apple-blue"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("appearance")}
            >
              <Palette size={18} />
              <span>Apariencia</span>
            </button>
          </nav>
        </div>

        <div className="apple-card p-6 md:col-span-3">
          {activeTab === "general" && (
            <div>
              <h2 className="text-lg font-medium mb-6">Configuración General</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Idioma
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue">
                    <option>Español</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zona horaria
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue">
                    <option>(GMT-06:00) Ciudad de México</option>
                    <option>(GMT-05:00) Nueva York</option>
                    <option>(GMT+00:00) Londres</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Mostrar estadísticas avanzadas
                    </h3>
                    <p className="text-xs text-gray-500">
                      Muestra métricas detalladas en el dashboard
                    </p>
                  </div>
                  <div className="relative inline-block w-10 align-middle select-none">
                    <input
                      type="checkbox"
                      id="toggle-stats"
                      className="opacity-0 absolute h-0 w-0"
                      defaultChecked
                    />
                    <label
                      htmlFor="toggle-stats"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    >
                      <span className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform translate-x-0 checked:translate-x-4"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div>
              <h2 className="text-lg font-medium mb-6">Apariencia</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tema
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border border-apple-blue rounded-lg p-4 flex flex-col items-center">
                      <Monitor size={24} className="mb-2" />
                      <span className="text-sm font-medium">Sistema</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                      <Moon size={24} className="mb-2" />
                      <span className="text-sm font-medium">Oscuro</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
                      <Sun size={24} className="mb-2" />
                      <span className="text-sm font-medium">Claro</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Densidad
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue">
                    <option>Confortable</option>
                    <option>Compacta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño de fuente
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    defaultValue="16"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg font-medium mb-6">Notificaciones</h2>
              <div className="space-y-6">
                <p className="text-gray-500">Configuración de notificaciones</p>
              </div>
            </div>
          )}
          
          {activeTab === "security" && (
            <div>
              <h2 className="text-lg font-medium mb-6">Seguridad</h2>
              <div className="space-y-6">
                <p className="text-gray-500">Configuración de seguridad</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Define missing icons
const Sun = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export default Settings;
