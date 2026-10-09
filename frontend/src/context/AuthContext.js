'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, resumeApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchUserProfile = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        // Also fetch resume
        try {
          const rRes = await resumeApi.getMyResume();
          if (rRes.success && rRes.resume) {
            setResume(rRes.resume);
          }
        } catch (e) {
          // Resume might not exist yet
        }
      }
    } catch (err) {
      console.warn('Auth check notice:', err.message);
      localStorage.removeItem('jobfit_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('jobfit_token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authApi.login({ email, password });
      if (data.token) {
        localStorage.setItem('jobfit_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        await fetchUserProfile();
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await authApi.register(userData);
      if (data.token) {
        localStorage.setItem('jobfit_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(`Welcome to JobFit AI, ${data.user.name}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async () => {
    setIsLoading(true);
    try {
      const data = await authApi.demoLogin();
      if (data.token) {
        localStorage.setItem('jobfit_token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast('Logged in as Demo Candidate (Priya Sharma)', 'success');
        await fetchUserProfile();
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('jobfit_token');
    setUser(null);
    setToken(null);
    setResume(null);
    showToast('Logged out successfully', 'info');
  };

  const refreshResume = async () => {
    try {
      const rRes = await resumeApi.getMyResume();
      if (rRes.success && rRes.resume) {
        setResume(rRes.resume);
      }
    } catch (e) {
      console.warn('Refresh resume error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        resume,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        demoLogin,
        logout,
        refreshResume,
        showToast,
      }}
    >
      {children}

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm transition-all duration-300 transform translate-y-0 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-800'
              : toast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
              : 'bg-zinc-900/90 text-zinc-200 border-zinc-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>{toast.message}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
