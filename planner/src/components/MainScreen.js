import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
        height: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src="/bg-pattern.png" alt="" style={{ position: 'absolute' }} />
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
      </div>
      <Menu />
    </div>
  );
};

export default MainScreen;
