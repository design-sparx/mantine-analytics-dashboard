'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { DataModeConfig, DataMode, defaultDataModeConfig } from './types';
import { DataModeStorage } from './utils';

interface DataModeContextType {
  config: DataModeConfig;
  mode: DataMode;
  isMockMode: boolean;
  isRealMode: boolean;
  setMode: (mode: DataMode) => void;
  toggleMode: () => void;
  resetToDefault: () => void;
}

const DataModeContext = createContext<DataModeContextType | undefined>(
  undefined,
);

interface DataModeProviderProps {
  children: ReactNode;
  defaultConfig?: DataModeConfig;
  storageKey?: string;
}

export function DataModeProvider({
  children,
  defaultConfig = defaultDataModeConfig,
  storageKey = 'data-mode-config',
}: DataModeProviderProps) {
  const [config, setConfig] = useState<DataModeConfig>(() => {
    return DataModeStorage.load(storageKey, defaultConfig);
  });

  // Save to localStorage whenever config changes
  useEffect(() => {
    DataModeStorage.save(storageKey, config);
  }, [config, storageKey]);

  const setMode = (mode: DataMode) => {
    setConfig({ mode });
  };

  const toggleMode = () => {
    setConfig((prev) => ({
      mode: prev.mode === 'mock' ? 'real' : 'mock',
    }));
  };

  const resetToDefault = () => {
    setConfig(defaultConfig);
    DataModeStorage.remove(storageKey);
  };

  const value: DataModeContextType = {
    config,
    mode: config.mode,
    isMockMode: config.mode === 'mock',
    isRealMode: config.mode === 'real',
    setMode,
    toggleMode,
    resetToDefault,
  };

  return (
    <DataModeContext.Provider value={value}>
      {children}
    </DataModeContext.Provider>
  );
}

export function useDataMode() {
  const context = useContext(DataModeContext);
  if (!context) {
    throw new Error('useDataMode must be used within a DataModeProvider');
  }
  return context;
}
