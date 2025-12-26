import { useCallback } from 'react';

import { CardFeel, ColorScheme, PrimaryColor, ThemeConfig } from './types';

interface UseConfigUpdaterProps {
  config: ThemeConfig;
  previewConfig: ThemeConfig;
  isCustomizerOpen: boolean;
  updateConfig: (config: ThemeConfig) => void;
  updatePreviewConfig: (config: ThemeConfig) => void;
}

export function useConfigUpdater({
  config,
  previewConfig,
  isCustomizerOpen,
  updateConfig,
  updatePreviewConfig,
}: UseConfigUpdaterProps) {
  const updateActiveConfig = useCallback(
    (newConfig: ThemeConfig) => {
      if (isCustomizerOpen) {
        updatePreviewConfig(newConfig);
      } else {
        updateConfig(newConfig);
      }
    },
    [isCustomizerOpen, updateConfig, updatePreviewConfig],
  );

  const getCurrentConfig = useCallback(() => {
    return isCustomizerOpen ? previewConfig : config;
  }, [isCustomizerOpen, config, previewConfig]);

  // Sidebar methods
  const toggleSidebarVisibility = useCallback(() => {
    const currentConfig = getCurrentConfig();
    const newConfig = {
      ...currentConfig,
      layout: {
        ...currentConfig.layout,
        sidebar: {
          ...currentConfig.layout.sidebar,
          visible: !currentConfig.layout.sidebar.visible,
        },
      },
    };
    updateActiveConfig(newConfig);
  }, [getCurrentConfig, updateActiveConfig]);

  const showSidebar = useCallback(() => {
    const currentConfig = getCurrentConfig();
    const newConfig = {
      ...currentConfig,
      layout: {
        ...currentConfig.layout,
        sidebar: {
          ...currentConfig.layout.sidebar,
          visible: true,
        },
      },
    };
    updateActiveConfig(newConfig);
  }, [getCurrentConfig, updateActiveConfig]);

  const hideSidebar = useCallback(() => {
    const currentConfig = getCurrentConfig();
    const newConfig = {
      ...currentConfig,
      layout: {
        ...currentConfig.layout,
        sidebar: {
          ...currentConfig.layout.sidebar,
          visible: false,
        },
      },
    };
    updateActiveConfig(newConfig);
  }, [getCurrentConfig, updateActiveConfig]);

  // Appearance methods
  const setPrimaryColor = useCallback(
    (color: PrimaryColor) => {
      const currentConfig = getCurrentConfig();
      const newConfig = {
        ...currentConfig,
        appearance: {
          ...currentConfig.appearance,
          primaryColor: color,
        },
      };
      updateActiveConfig(newConfig);
    },
    [getCurrentConfig, updateActiveConfig],
  );

  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      const currentConfig = getCurrentConfig();
      const newConfig = {
        ...currentConfig,
        appearance: {
          ...currentConfig.appearance,
          colorScheme: scheme,
        },
      };
      updateActiveConfig(newConfig);
    },
    [getCurrentConfig, updateActiveConfig],
  );

  const setBorderRadius = useCallback(
    (radius: ThemeConfig['appearance']['borderRadius']) => {
      const currentConfig = getCurrentConfig();
      const newConfig = {
        ...currentConfig,
        appearance: {
          ...currentConfig.appearance,
          borderRadius: radius,
        },
      };
      updateActiveConfig(newConfig);
    },
    [getCurrentConfig, updateActiveConfig],
  );

  const toggleCompactMode = useCallback(() => {
    const currentConfig = getCurrentConfig();
    const newConfig = {
      ...currentConfig,
      appearance: {
        ...currentConfig.appearance,
        compact: !currentConfig.appearance.compact,
      },
    };
    updateActiveConfig(newConfig);
  }, [getCurrentConfig, updateActiveConfig]);

  const setCardFeel = useCallback(
    (feel: CardFeel) => {
      const currentConfig = getCurrentConfig();
      const newConfig = {
        ...currentConfig,
        appearance: {
          ...currentConfig.appearance,
          cardFeel: feel,
        },
      };
      updateActiveConfig(newConfig);
    },
    [getCurrentConfig, updateActiveConfig],
  );

  return {
    toggleSidebarVisibility,
    showSidebar,
    hideSidebar,
    setPrimaryColor,
    setColorScheme,
    setBorderRadius,
    toggleCompactMode,
    setCardFeel,
  };
}
