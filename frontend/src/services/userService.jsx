import api from './api';

export const userService = {
  register: async (username, email, password) => {
    return api.post('/users/register', { username, email, password });
  },
  
  login: async (email, password) => {
    const data = await api.post('/users/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getUser: (userId) => {
    return api.get(`/users/${userId}`);
  },
  
  updateUser: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },
  
  deleteUser: (userId) => {
    return api.delete(`/users/${userId}`);
  }
};