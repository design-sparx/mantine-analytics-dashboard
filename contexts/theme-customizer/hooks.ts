import { useThemeCustomizer } from './ThemeCustomizerContext';

export function useSidebarConfig() {
  const { config } = useThemeCustomizer();
  return config.layout.sidebar;
}

export function useAppearanceConfig() {
  const { config } = useThemeCustomizer();
  return config.appearance;
}
