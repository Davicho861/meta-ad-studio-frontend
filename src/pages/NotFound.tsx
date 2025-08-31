import React from "react";

import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-apple-blue mb-4">404</h1>
        <p className="text-xl font-medium text-gray-800 mb-6">
          Ups! No hemos encontrado la página que buscas
        </p>
        <p className="text-gray-600 mb-8">
          La página que intentas ver no existe o ha sido movida.
        </p>
        <button
          onClick={() => navigate("/")}
          className="apple-button py-3 px-8 text-base"
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound;
