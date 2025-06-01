'use client';

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

// Types
export type SidebarVariant = 'default' | 'colored' | 'gradient';
export type SidebarPosition = 'left' | 'right';
export type HeaderVariant = 'default' | 'colored' | 'gradient';
export type HeaderPosition = 'fixed' | 'sticky' | 'static';
export type ContentLayout = 'boxed' | 'full-width' | 'centered' | 'fluid';
export type SpacingSize = 'compact' | 'comfortable' | 'spacious';
export type ColorScheme = 'light' | 'dark' | 'auto';

// Predefined color schemes
export const COLOR_SCHEMES = {
  blue: { name: 'Blue', value: 'blue', color: '#339af0' },
  cyan: { name: 'Cyan', value: 'cyan', color: '#22b8cf' },
  teal: { name: 'Teal', value: 'teal', color: '#20c997' },
  green: { name: 'Green', value: 'green', color: '#51cf66' },
  lime: { name: 'Lime', value: 'lime', color: '#94d82d' },
  yellow: { name: 'Yellow', value: 'yellow', color: '#ffd43b' },
  orange: { name: 'Orange', value: 'orange', color: '#ff922b' },
  red: { name: 'Red', value: 'red', color: '#ff6b6b' },
  pink: { name: 'Pink', value: 'pink', color: '#f06292' },
  grape: { name: 'Grape', value: 'grape', color: '#cc5de8' },
  violet: { name: 'Violet', value: 'violet', color: '#845ef7' },
  indigo: { name: 'Indigo', value: 'indigo', color: '#5c7cfa' },
} as const;

export type PrimaryColor = keyof typeof COLOR_SCHEMES;

export interface ThemeConfig {
  layout: {
    sidebar: {
      variant: SidebarVariant;
      position: SidebarPosition;
      width: number;
      overlay: boolean;
      visible: boolean;
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
    colorScheme: ColorScheme;
    primaryColor: PrimaryColor;
    borderRadius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    compact: boolean; // For compact/comfortable UI density
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
    primaryColor: 'blue',
    borderRadius: 'sm',
    compact: false,
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
  // New methods for appearance
  setPrimaryColor: (color: PrimaryColor) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setBorderRadius: (radius: ThemeConfig['appearance']['borderRadius']) => void;
  toggleCompactMode: () => void;
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
                visible: parsedConfig.layout.sidebar?.visible ?? true,
              },
            },
            appearance: {
              ...defaultConfig.appearance,
              ...parsedConfig.appearance,
              // Ensure new appearance properties exist
              primaryColor: parsedConfig.appearance?.primaryColor ?? 'blue',
              borderRadius: parsedConfig.appearance?.borderRadius ?? 'sm',
              compact: parsedConfig.appearance?.compact ?? false,
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

  // Apply CSS custom properties when config changes
  useEffect(() => {
    const activeConfig = isCustomizerOpen ? previewConfig : config;

    if (typeof window !== 'undefined') {
      const root = document.documentElement;

      // Set primary color
      const primaryColorValue =
        COLOR_SCHEMES[activeConfig.appearance.primaryColor].color;
      root.style.setProperty('--theme-primary-color', primaryColorValue);

      // Set border radius
      const radiusMap = {
        xs: '0.125rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      };
      root.style.setProperty(
        '--theme-border-radius',
        radiusMap[activeConfig.appearance.borderRadius],
      );

      // Set density
      if (activeConfig.appearance.compact) {
        root.style.setProperty('--theme-spacing-scale', '0.8');
      } else {
        root.style.setProperty('--theme-spacing-scale', '1');
      }
    }
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

  // New appearance methods
  const setPrimaryColor = (color: PrimaryColor) => {
    const currentConfig = isCustomizerOpen ? previewConfig : config;
    const newConfig = {
      ...currentConfig,
      appearance: {
        ...currentConfig.appearance,
        primaryColor: color,
      },
    };

    if (isCustomizerOpen) {
      updatePreviewConfig(newConfig);
    } else {
      updateConfig(newConfig);
    }
  };

  const setColorScheme = (scheme: ColorScheme) => {
    const currentConfig = isCustomizerOpen ? previewConfig : config;
    const newConfig = {
      ...currentConfig,
      appearance: {
        ...currentConfig.appearance,
        colorScheme: scheme,
      },
    };

    if (isCustomizerOpen) {
      updatePreviewConfig(newConfig);
    } else {
      updateConfig(newConfig);
    }
  };

  const setBorderRadius = (
    radius: ThemeConfig['appearance']['borderRadius'],
  ) => {
    const currentConfig = isCustomizerOpen ? previewConfig : config;
    const newConfig = {
      ...currentConfig,
      appearance: {
        ...currentConfig.appearance,
        borderRadius: radius,
      },
    };

    if (isCustomizerOpen) {
      updatePreviewConfig(newConfig);
    } else {
      updateConfig(newConfig);
    }
  };

  const toggleCompactMode = () => {
    const currentConfig = isCustomizerOpen ? previewConfig : config;
    const newConfig = {
      ...currentConfig,
      appearance: {
        ...currentConfig.appearance,
        compact: !currentConfig.appearance.compact,
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
        setPrimaryColor,
        setColorScheme,
        setBorderRadius,
        toggleCompactMode,
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
    case 'gradient':
      styles.background =
        'linear-gradient(135deg, var(--mantine-primary-color-filled) 0%, var(--mantine-primary-color-7) 100%)';
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
    case 'gradient':
      styles.background =
        'linear-gradient(90deg, var(--mantine-primary-color-filled) 0%, var(--mantine-primary-color-7) 100%)';
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
