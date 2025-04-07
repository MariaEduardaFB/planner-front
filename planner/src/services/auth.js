import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { user, token } = response.data;

  localStorage.setItem('token', token);

  localStorage.setItem('userType', user.role);

  return { user };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userType');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userId');
};
