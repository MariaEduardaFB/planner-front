import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Viagem', path: '/viagem' },
  { label: 'Atividades', path: '/atividades' },
];

const MenuItem = ({ label, path }) => {
  const [hover, setHover] = useState(false);

  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        to={path}
        style={{
          color: hover ? '#3965A5' : '#fff',
          textDecoration: 'none',
          cursor: 'pointer',
        }}
      >
        {label}
      </Link>
    </li>
  );
};

const Menu = () => {
  return (
    <nav
      style={{
        fontFamily: 'Arial',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        marginTop: '1rem',
      }}
    >
      <ul
        style={{
          background: '#262626',
          display: 'flex',
          padding: '.8rem 0',
          borderRadius: '15px',
          listStyle: 'none',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '40%',
          margin: 0,
        }}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <MenuItem label={item.label} path={item.path} />
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
