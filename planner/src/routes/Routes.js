import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import MainScreen from '../components/MainScreen';
import { IoMdExit } from 'react-icons/io';
import ViagensList from '../components/viagens/viagensList';

const Layout = ({ children, setAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        style={{
          border: 'none',
          background: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.2rem',
          color: '#fff',
          bottom: '1rem',
          left: '1rem',
          position: 'absolute',
          zIndex: 1000,
        }}
      >
        Sair
        <IoMdExit />
      </button>
      <main>{children}</main>
    </div>
  );
};

const AppRoutes = ({ isAuthenticated, setAuthenticated }) => {
  const handleLogin = () => {
    setAuthenticated(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout setAuthenticated={setAuthenticated}>
                <MainScreen setAuthenticated={setAuthenticated} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<div>Página Inicial</div>} />
          <Route path="viagens" element={<ViagensList />} />
          {/* Outras rotas podem ser adicionadas aqui */}
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/' : '/login'} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;