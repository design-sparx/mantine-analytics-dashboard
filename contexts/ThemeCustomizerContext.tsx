'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

// Types
export type SidebarVariant = 'default' | 'colored';
export type SidebarPosition = 'left' | 'right';
export type HeaderVariant = 'default' | 'colored';
export type HeaderPosition = 'fixed' | 'sticky' | 'static';
export type ContentLayout = 'boxed' | 'full-width' | 'centered' | 'fluid';
export type SpacingSize = 'compact' | 'comfortable' | 'spacious';

export interface ThemeConfig {
  layout: {
    sidebar: {
      variant: SidebarVariant;
      position: SidebarPosition;
      width: number;
      overlay: boolean;
      visible: boolean; // New: replaces hidden/mini/full states
    };
    header: {
      variant: HeaderVariant;
      position: HeaderPosition;
      height: number;
      showShadow: boolean;
    };
    content: {
      layout: ContentLayout;
      padding: SpacingSize;
    };
  };
  appearance: {
    colorScheme: 'light' | 'dark' | 'auto';
  };
}

export const defaultThemeConfig: ThemeConfig = {
  layout: {
    sidebar: {
      variant: 'default',
      position: 'left',
      width: 300,
      overlay: false,
      visible: true,
    },
    header: {
      variant: 'default',
      position: 'fixed',
      height: 60,
      showShadow: true,
    },
    content: {
      layout: 'full-width',
      padding: 'comfortable',
    },
  },
  appearance: {
    colorScheme: 'auto',
  },
};

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
    // Load from localStorage on initial mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsedConfig = JSON.parse(stored);
          // Merge with default config to handle new properties
          return {
            ...defaultConfig,
            ...parsedConfig,
            layout: {
              ...defaultConfig.layout,
              ...parsedConfig.layout,
              sidebar: {
                ...defaultConfig.layout.sidebar,
                ...parsedConfig.layout.sidebar,
                // Ensure new properties exist
                visible: parsedConfig.layout.sidebar?.visible ?? true,
              },
            },
            appearance: {
              ...defaultConfig.appearance,
              ...parsedConfig.appearance,
            },
          };
        } catch (e) {
          console.error('Failed to parse stored theme config:', e);
        }
      }
    }
    return defaultConfig;
  });

  const [previewConfig, setPreviewConfig] = useState<ThemeConfig>(config);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Save to localStorage whenever config changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(config));
    }
  }, [config, storageKey]);

  // Reset preview when customizer opens
  useEffect(() => {
    if (isCustomizerOpen) {
      setPreviewConfig(config);
    }
  }, [isCustomizerOpen, config]);

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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
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

  // Sidebar visibility controls
  const toggleSidebarVisibility = () => {
    const currentConfig = isCustomizerOpen ? previewConfig : config;
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

    if (isCustomizerOpen) {
      updatePreviewConfig(newConfig);
    } else {
      updateConfig(newConfig);
    }
  };

  const showSidebar = () => {
    const currentConfig = isCustomizerOpen ? previewConfig : config;
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

    if (isCustomizerOpen) {
      updatePreviewConfig(newConfig);
    } else {
      updateConfig(newConfig);
    }
  };

  const hideSidebar = () => {
    const currentConfig = isCustomizerOpen ? previewConfig : config;
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

    if (isCustomizerOpen) {
      updatePreviewConfig(newConfig);
    } else {
      updateConfig(newConfig);
    }
  };

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
        toggleSidebarVisibility,
        showSidebar,
        hideSidebar,
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

// Utility hooks for specific parts of the theme
export function useLayoutConfig() {
  const { config } = useThemeCustomizer();
  return config.layout;
}

export function useSidebarConfig() {
  const { config } = useThemeCustomizer();
  return config.layout.sidebar;
}

export function useHeaderConfig() {
  const { config } = useThemeCustomizer();
  return config.layout.header;
}

export function useContentConfig() {
  const { config } = useThemeCustomizer();
  return config.layout.content;
}

export function useAppearanceConfig() {
  const { config } = useThemeCustomizer();
  return config.appearance;
}

// Helper functions to generate CSS classes/styles based on config
export function generateSidebarStyles(
  config: ThemeConfig['layout']['sidebar'],
) {
  const styles: React.CSSProperties = {
    width: config.width,
    transition: 'all 0.3s ease',
  };

  switch (config.variant) {
    case 'colored':
      styles.backgroundColor = 'var(--mantine-primary-color-filled)';
      styles.color = 'white';
      break;
    case 'default':
    default:
      // Default uses CSS variables for light/dark mode handling
      break;
  }

  if (config.position === 'right') {
    styles.right = 0;
    styles.left = 'auto';
  }

  return styles;
}

export function generateHeaderStyles(config: ThemeConfig['layout']['header']) {
  const styles: React.CSSProperties = {
    height: config.height,
    position: config.position as any,
    transition: 'all 0.3s ease',
  };

  if (config.position === 'fixed' || config.position === 'sticky') {
    styles.top = 0;
    styles.zIndex = 100;
  }

  switch (config.variant) {
    case 'colored':
      styles.backgroundColor = 'var(--mantine-primary-color-filled)';
      styles.color = 'white';
      break;
    case 'default':
    default:
      // Default uses CSS variables for light/dark mode handling
      break;
  }

  if (config.showShadow) {
    styles.boxShadow = 'var(--mantine-shadow-sm)';
  }

  return styles;
}

export function generateContentStyles(
  config: ThemeConfig['layout']['content'],
) {
  const styles: React.CSSProperties = {
    transition: 'all 0.3s ease',
  };

  // Padding based on size
  const paddingMap = {
    compact: '0.5rem',
    comfortable: '1rem',
    spacious: '2rem',
  };
  styles.padding = paddingMap[config.padding];

  // Layout styles
  switch (config.layout) {
    case 'boxed':
      styles.maxWidth = '1400px';
      styles.margin = '0 auto';
      break;
    case 'centered':
      styles.maxWidth = '1200px';
      styles.margin = '0 auto';
      styles.padding = `${paddingMap[config.padding]} 2rem`;
      break;
    case 'full-width':
      styles.width = '100%';
      break;
    case 'fluid':
      styles.width = '100%';
      styles.maxWidth = '100%';
      break;
  }

  return styles;
}
