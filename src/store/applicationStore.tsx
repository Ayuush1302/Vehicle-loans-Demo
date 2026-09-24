import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Application } from '../types/journey';

interface AppState {
  applications: Application[];
  currentUser: { name: string; pan: string; mobile: string } | null;
}

interface AppContextType {
  state: AppState;
  login: (user: { name: string; pan: string; mobile: string }) => void;
  logout: () => void;
  saveApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: Application['status']) => void;
  getDraft: () => Application | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'autofinai_demo_state_v2';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local storage', e);
      }
    }
    return { applications: [], currentUser: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = (user: { name: string; pan: string; mobile: string }) => {
    setState(prev => ({ ...prev, currentUser: user }));
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const saveApplication = (app: Application) => {
    setState(prev => {
      const exists = prev.applications.findIndex(a => a.id === app.id);
      let newApps = [...prev.applications];
      app.lastUpdated = Date.now();
      if (exists >= 0) {
        newApps[exists] = app;
      } else {
        newApps.push(app);
      }
      return { ...prev, applications: newApps };
    });
  };

  const updateApplicationStatus = (id: string, status: Application['status']) => {
    setState(prev => {
      const newApps = prev.applications.map(app => 
        app.id === id ? { ...app, status, lastUpdated: Date.now() } : app
      );
      return { ...prev, applications: newApps };
    });
  };

  const getDraft = () => {
    if (!state.currentUser) return undefined;
    return state.applications.find(a => 
      a.mobileNumber === state.currentUser?.mobile && 
      (a.status === 'Draft' || a.status === 'Submitted')
    );
  };

  return (
    <AppContext.Provider value={{ state, login, logout, saveApplication, updateApplicationStatus, getDraft }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
