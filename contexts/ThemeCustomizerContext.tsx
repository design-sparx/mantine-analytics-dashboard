import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

// Types
export type SidebarVariant =
  | 'default'
  | 'transparent'
  | 'colored'
  | 'gradient'
  | 'floating';
export type SidebarPosition = 'left' | 'right';
export type HeaderVariant = 'default' | 'transparent' | 'compact' | 'expanded';
// | 'floating'; // disable floating for now
export type HeaderPosition = 'fixed' | 'sticky' | 'static';
export type ContentLayout = 'boxed' | 'full-width' | 'centered' | 'fluid';
export type SpacingSize = 'compact' | 'comfortable' | 'spacious';

export interface ThemeConfig {
  layout: {
    sidebar: {
      variant: SidebarVariant;
      position: SidebarPosition;
      width: number;
      collapsible: boolean;
      overlay: boolean;
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
  // Future extensions
  colors?: {
    primaryColor?: string;
    colorScheme?: 'light' | 'dark' | 'auto';
  };
  typography?: {
    fontFamily?: string;
    fontSize?: 'sm' | 'md' | 'lg';
  };
  components?: {
    buttonStyle?: 'filled' | 'outlined' | 'ghost';
    cardStyle?: 'flat' | 'elevated' | 'bordered';
  };
}

export const defaultThemeConfig: ThemeConfig = {
  layout: {
    sidebar: {
      variant: 'default',
      position: 'left',
      width: 300,
      collapsible: true,
      overlay: false,
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
};

interface ThemeCustomizerContextType {
  config: ThemeConfig;
  updateConfig: (newConfig: ThemeConfig) => void;
  resetConfig: () => void;
  isCustomizerOpen: boolean;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  toggleCustomizer: () => void;
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
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored theme config:', e);
        }
      }
    }
    return defaultConfig;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Save to localStorage whenever config changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(config));
    }
  }, [config, storageKey]);

  const updateConfig = (newConfig: ThemeConfig) => {
    setConfig(newConfig);
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
  };

  const openCustomizer = () => setIsCustomizerOpen(true);
  const closeCustomizer = () => setIsCustomizerOpen(false);
  const toggleCustomizer = () => setIsCustomizerOpen((prev) => !prev);

  return (
    <ThemeCustomizerContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        isCustomizerOpen,
        openCustomizer,
        closeCustomizer,
        toggleCustomizer,
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

// Helper functions to generate CSS classes/styles based on config
export function generateSidebarStyles(
  config: ThemeConfig['layout']['sidebar'],
) {
  const styles: React.CSSProperties = {
    width: config.width,
    transition: 'all 0.3s ease',
  };

  switch (config.variant) {
    case 'transparent':
      styles.backgroundColor = 'transparent';
      styles.backdropFilter = 'blur(10px)';
      break;
    case 'colored':
      styles.backgroundColor = 'var(--mantine-primary-color-filled)';
      break;
    case 'gradient':
      styles.background =
        'linear-gradient(180deg, var(--mantine-primary-color-filled) 0%, var(--mantine-primary-color-light) 100%)';
      break;
    case 'floating':
      styles.margin = '1rem';
      styles.borderRadius = 'var(--mantine-radius-lg)';
      styles.boxShadow = 'var(--mantine-shadow-xl)';
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
    case 'transparent':
      styles.backgroundColor = 'transparent';
      styles.backdropFilter = 'blur(10px)';
      break;
    case 'compact':
      styles.height = Math.min(config.height, 50);
      break;
    case 'expanded':
      styles.height = Math.max(config.height, 80);
      break;
    case 'floating':
      styles.margin = '1rem 1rem 0';
      styles.borderRadius = 'var(--mantine-radius-lg)';
      styles.width = 'calc(100% - 2rem)';
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
