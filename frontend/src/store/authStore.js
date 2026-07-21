import { create } from "zustand";
import authService from "../services/authService";

export const useAuthStore = create((set) => ({
  user: authService.getCurrentUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(credentials);
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al iniciar sesión";
      // Log full server response for debugging
      console.error('Login error response data:', JSON.stringify(error.response?.data || error.message, null, 2));
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.register(userData);
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al registrar usuario";
      console.error('Register error response data:', JSON.stringify(error.response?.data || error.message, null, 2));
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));

