
import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(children);

  // Efecto para la transición suave entre páginas con mayor tiempo para una transición más notable
  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setContent(children);
      setIsLoading(false);
    }, 400); // Aumentado a 400ms para una transición más visible
    
    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#F5F5F7] to-[#F0F0F2] p-6">
          <div className="max-w-7xl mx-auto transition-opacity duration-500 ease-in-out">
            {isLoading ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <div className="relative w-16 h-16"> {/* Tamaño aumentado */}
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-apple-blue rounded-full animate-spin border-t-transparent"></div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-xs text-gray-500">SDLC</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                {content}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
