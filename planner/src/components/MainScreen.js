import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Menu from './Menu';

const MainScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  return (
    <div
      style={{
        fontFamily: 'Arial',
        width: '100vw',
        minHeight: '100vh',
        overflow: 'hidden', 
        paddingTop: '80px',
      }}
    >
      <Menu />
    
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>

      {window.location.pathname === '/' && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: -1,
          }}
        >
          <img src="/bg-pattern.png" alt="" style={{ position: 'fixed' }} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src="/logo.svg" alt="" />
            <p
              style={{
                color: '#fff',
                marginTop: '.6rem',
                fontSize: '24px',
              }}
            >
              Planeje sua próxima viagem com amigos!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainScreen;
