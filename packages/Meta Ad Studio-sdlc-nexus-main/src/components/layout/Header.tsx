
import { Bell, Settings, User, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeContext";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="h-16 border-b flex items-center justify-between px-6 bg-card text-card-foreground">
      <div className="flex items-center">
        <h1 className="text-xl font-medium">Meta Ad Studio SDLC Nexus</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="apple-icon-button">
          {isDarkMode ? (
            <Sun size={20} className="text-foreground" />
          ) : (
            <Moon size={20} className="text-foreground" />
          )}
        </button>
        <button className="apple-icon-button">
          <Bell size={20} className="text-foreground" />
        </button>
        <button className="apple-icon-button">
          <Settings size={20} className="text-foreground" />
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Davicho</span>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <User size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
