// Theme Types and Constants
export type SidebarVariant =
  | 'default'
  | 'colored'
  | 'gradient'
  | 'glassmorphism';
export type SidebarPosition = 'left' | 'right';
export type HeaderVariant =
  | 'default'
  | 'colored'
  | 'gradient'
  | 'glassmorphism';
export type HeaderPosition = 'fixed' | 'sticky' | 'static';
export type ContentLayout = 'boxed' | 'full-width' | 'centered' | 'fluid';
export type SpacingSize = 'compact' | 'comfortable' | 'spacious';
export type ColorScheme = 'light' | 'dark' | 'auto';
export type CardFeel = 'flat' | 'elevated' | 'bordered' | 'glassmorphism';
export type Direction = 'ltr' | 'rtl';

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
    dir: Direction;
  };
  appearance: {
    colorScheme: ColorScheme;
    primaryColor: PrimaryColor;
    borderRadius: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    compact: boolean;
    cardFeel: CardFeel;
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
    dir: 'ltr',
  },
  appearance: {
    colorScheme: 'auto',
    primaryColor: 'blue',
    borderRadius: 'sm',
    compact: false,
    cardFeel: 'elevated',
  },
};
