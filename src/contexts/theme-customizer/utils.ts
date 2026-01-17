import React from 'react';

import { COLOR_SCHEMES, ThemeConfig } from './types';

// Storage utilities
export const ThemeStorage = {
  save: (key: string, config: ThemeConfig) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(config));
      } catch (error) {
        console.error('Failed to save theme config:', error);
      }
    }
  },

  load: (key: string, defaultConfig: ThemeConfig): ThemeConfig => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
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
              primaryColor: parsedConfig.appearance?.primaryColor ?? 'blue',
              borderRadius: parsedConfig.appearance?.borderRadius ?? 'sm',
              compact: parsedConfig.appearance?.compact ?? false,
            },
          };
        }
      } catch (error) {
        console.error('Failed to parse stored theme config:', error);
      }
    }
    return defaultConfig;
  },

  remove: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

// CSS utilities
export const ThemeCSS = {
  applyCustomProperties: (config: ThemeConfig) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;

      // Set primary color
      const primaryColorValue =
        COLOR_SCHEMES[config.appearance.primaryColor].color;
      root.style.setProperty('--theme-primary-color', primaryColorValue);

      //Set direction
      root.dir = config.layout.dir;

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
        radiusMap[config.appearance.borderRadius],
      );

      // Set density
      if (config.appearance.compact) {
        root.style.setProperty('--theme-spacing-scale', '0.8');
      } else {
        root.style.setProperty('--theme-spacing-scale', '1');
      }
    }
  },
};

// Helper functions to generate CSS classes/styles based on config
export function generateSidebarStyles(
  config: ThemeConfig['layout']['sidebar'],
): React.CSSProperties {
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
    case 'glassmorphism':
      styles.background = `linear-gradient(180deg,
    color-mix(in srgb, var(--theme-primary-color) 10%, rgba(255, 255, 255, 0.2)) 0%,
    color-mix(in srgb, var(--theme-primary-color) 5%, rgba(255, 255, 255, 0.05)) 100%)`;
      styles.backdropFilter = 'blur(24px) saturate(180%)';
      styles.WebkitBackdropFilter = 'blur(24px) saturate(180%)';
      styles.borderInlineEnd = '1px solid rgba(255, 255, 255, 0.25)';
      styles.boxShadow =
        '2px 0 20px rgba(0, 0, 0, 0.1), inset 1px 0 0 rgba(255, 255, 255, 0.3)';
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

export function generateHeaderStyles(
  config: ThemeConfig['layout']['header'],
): React.CSSProperties {
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
    case 'glassmorphism':
      styles.background = `linear-gradient(90deg,
    color-mix(in srgb, var(--theme-primary-color) 10%, rgba(255, 255, 255, 0.2)) 0%,
    color-mix(in srgb, var(--theme-primary-color) 5%, rgba(255, 255, 255, 0.08)) 100%)`;
      styles.backdropFilter = 'blur(24px) saturate(180%)';
      styles.WebkitBackdropFilter = 'blur(24px) saturate(180%)';
      styles.borderBottom = '1px solid rgba(255, 255, 255, 0.25)';
      styles.boxShadow =
        '0 2px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
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
): React.CSSProperties {
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
