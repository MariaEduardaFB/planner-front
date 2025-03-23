import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Menu from './Menu';

const MainScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      // Se não houver token, redireciona para a tela de login
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <Menu /> {/* Menu sem a necessidade de userRole */}
      <Outlet /> {/* Rotas filhas */}
    </div>
  );
};

export default MainScreen;