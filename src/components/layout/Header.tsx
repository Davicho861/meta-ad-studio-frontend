
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
    <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-gray-900">
      <div className="flex items-center">
        <Link to="/" className="text-xl font-medium text-gray-800 dark:text-white">Meta Ad Studio</Link>
        <Link to="/sdlc" className="ml-6 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">SDLC Nexus</Link>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="apple-icon-button">
          {isDarkMode ? <Sun size={20} className="text-gray-600 dark:text-gray-300" /> : <Moon size={20} className="text-gray-600 dark:text-gray-300" />}
        </button>
        <button className="apple-icon-button">
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button className="apple-icon-button">
          <Settings size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Davicho</span>
          <div className="w-8 h-8 rounded-full bg-meta-blue flex items-center justify-center text-white">
            <User size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
