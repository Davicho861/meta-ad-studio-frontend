import React from 'react';
import { useAuth } from '../hooks/useAuth.tsx';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div>
        <p>Por favor, inicie sesión.</p>
        {/* This button could redirect to the login page */}
        <button>Iniciar Sesión</button>
      </div>
    );
  }

  return (
    <div>
      <p>Bienvenido, {user.username}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default Profile;
