import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'Inicio', path: '/' },  // Alterado para rota raiz
  { label: 'Viagem', path: '/viagens' },
  { label: 'Atividades', path: '/atividades' },
];

const MenuItem = ({ label, path, currentPath }) => {
  const [hover, setHover] = useState(false);
  const isActive = currentPath === path;

  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '0.5rem 1rem',
        // backgroundColor: isActive ? '#3965A5' : 'transparent',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
      }}
    >
      <Link
        to={path}
        style={{
            color: hover ? '#3965A5' : '#fff', // Muda a cor do texto no hover
          textDecoration: 'none',
          cursor: 'pointer',
          fontWeight: isActive ? 'bold' : 'normal',
        }}
      >
        {label}
      </Link>
    </li>
  );
};

const Menu = () => {
  const location = useLocation();

  return (
    <nav
      style={{
        fontFamily: 'Arial',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        top: '1rem',
        zIndex: 1000,
      }}
    >
      <ul
        style={{
          background: '#262626',
          display: 'flex',
          padding: '.8rem 1.5rem',
          borderRadius: '15px',
          listStyle: 'none',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '40%',
          margin: 0,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <MenuItem 
              label={item.label} 
              path={item.path} 
              currentPath={location.pathname} 
            />
            {index < menuItems.length - 1 && (
              <li
                style={{ background: '#4B4B4B', width: '1px', height: '30px' }}
              />
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;