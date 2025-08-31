import React from "react";

import { Bell, Settings, User, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeProvider";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-card">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-medium text-foreground">Meta Ad Studio</Link>
        <Link to="/sdlc" className="ml-6 text-sm font-medium text-muted-foreground hover:text-foreground">SDLC Nexus</Link>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="apple-icon-button">
          {isDarkMode ? <Sun size={20} className="text-muted-foreground" /> : <Moon size={20} className="text-muted-foreground" />}
        </button>
        <button className="apple-icon-button">
          <Bell size={20} className="text-muted-foreground" />
        </button>
        <button className="apple-icon-button">
          <Settings size={20} className="text-muted-foreground" />
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Davicho</span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <User size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
