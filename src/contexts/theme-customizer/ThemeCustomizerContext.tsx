'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ThemeConfig, defaultThemeConfig } from './types';
import { useConfigUpdater } from './useConfigUpdater';
import { ThemeCSS, ThemeStorage } from './utils';

interface ThemeCustomizerContextType {
  config: ThemeConfig;
  previewConfig: ThemeConfig;
  updateConfig: (newConfig: ThemeConfig) => void;
  updatePreviewConfig: (newConfig: ThemeConfig) => void;
  applyPreview: () => void;
  resetConfig: () => void;
  resetPreview: () => void;
  isCustomizerOpen: boolean;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  toggleCustomizer: () => void;
  hasUnsavedChanges: boolean;
  toggleSidebarVisibility: () => void;
  showSidebar: () => void;
  hideSidebar: () => void;
  setPrimaryColor: (color: any) => void;
  setColorScheme: (scheme: any) => void;
  setBorderRadius: (radius: ThemeConfig['appearance']['borderRadius']) => void;
  toggleCompactMode: () => void;
  setCardFeel: (feel: any) => void;
}

const ThemeCustomizerContext = createContext<
  ThemeCustomizerContextType | undefined
>(undefined);

interface ThemeCustomizerProviderProps {
  children: ReactNode;
  defaultConfig?: ThemeConfig;
  storageKey?: string;
}

export function ThemeCustomizerProvider({
  children,
  defaultConfig = defaultThemeConfig,
  storageKey = 'theme-config',
}: ThemeCustomizerProviderProps) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    return ThemeStorage.load(storageKey, defaultConfig);
  });

  const [previewConfig, setPreviewConfig] = useState<ThemeConfig>(config);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Save to localStorage whenever config changes
  useEffect(() => {
    ThemeStorage.save(storageKey, config);
  }, [config, storageKey]);

  // Reset preview when customizer opens
  useEffect(() => {
    if (isCustomizerOpen) {
      setPreviewConfig(config);
    }
  }, [isCustomizerOpen, config]);

  // Apply CSS custom properties when config changes
  useEffect(() => {
    const activeConfig = isCustomizerOpen ? previewConfig : config;
    ThemeCSS.applyCustomProperties(activeConfig);
  }, [config, previewConfig, isCustomizerOpen]);

  const updateConfig = (newConfig: ThemeConfig) => {
    setConfig(newConfig);
  };

  const updatePreviewConfig = (newConfig: ThemeConfig) => {
    setPreviewConfig(newConfig);
  };

  const applyPreview = () => {
    setConfig(previewConfig);
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    setPreviewConfig(defaultConfig);
    ThemeStorage.remove(storageKey);
  };

  const resetPreview = () => {
    setPreviewConfig(config);
  };

  const openCustomizer = () => setIsCustomizerOpen(true);
  const closeCustomizer = () => {
    setIsCustomizerOpen(false);
    setPreviewConfig(config); // Reset preview on close
  };
  const toggleCustomizer = () => setIsCustomizerOpen((prev) => !prev);

  // Use the config updater hook
  const configUpdaterMethods = useConfigUpdater({
    config,
    previewConfig,
    isCustomizerOpen,
    updateConfig,
    updatePreviewConfig,
  });

  const hasUnsavedChanges =
    JSON.stringify(config) !== JSON.stringify(previewConfig);

  return (
    <ThemeCustomizerContext.Provider
      value={{
        config: isCustomizerOpen ? previewConfig : config,
        previewConfig,
        updateConfig,
        updatePreviewConfig,
        applyPreview,
        resetConfig,
        resetPreview,
        isCustomizerOpen,
        openCustomizer,
        closeCustomizer,
        toggleCustomizer,
        hasUnsavedChanges,
        ...configUpdaterMethods,
      }}
    >
      {children}
    </ThemeCustomizerContext.Provider>
  );
}

export function useThemeCustomizer() {
  const context = useContext(ThemeCustomizerContext);
  if (!context) {
    throw new Error(
      'useThemeCustomizer must be used within a ThemeCustomizerProvider',
    );
  }
  return context;
}
