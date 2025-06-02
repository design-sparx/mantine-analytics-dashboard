import { useThemeCustomizer } from './ThemeCustomizerContext';

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

// Hooks for theme actions
export function useSidebarActions() {
  const { toggleSidebarVisibility, showSidebar, hideSidebar } =
    useThemeCustomizer();
  return { toggleSidebarVisibility, showSidebar, hideSidebar };
}

export function useAppearanceActions() {
  const {
    setPrimaryColor,
    setColorScheme,
    setBorderRadius,
    toggleCompactMode,
    setCardFeel,
  } = useThemeCustomizer();

  return {
    setPrimaryColor,
    setColorScheme,
    setBorderRadius,
    toggleCompactMode,
    setCardFeel,
  };
}

export function useCustomizerState() {
  const {
    isCustomizerOpen,
    openCustomizer,
    closeCustomizer,
    toggleCustomizer,
    hasUnsavedChanges,
    applyPreview,
    resetPreview,
    resetConfig,
  } = useThemeCustomizer();

  return {
    isCustomizerOpen,
    openCustomizer,
    closeCustomizer,
    toggleCustomizer,
    hasUnsavedChanges,
    applyPreview,
    resetPreview,
    resetConfig,
  };
}
